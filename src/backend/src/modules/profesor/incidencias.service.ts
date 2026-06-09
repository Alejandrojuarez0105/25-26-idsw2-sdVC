import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CrearIncidenciaDto } from './dto/crear-incidencia.dto';

// Estados válidos de una incidencia (coherentes con el enum EstadoIncidencia de Prisma).
export const ESTADOS_INCIDENCIA = ['PENDIENTE', 'REVISADA', 'RESUELTA', 'OMITIDA'] as const;
export type EstadoIncidencia = (typeof ESTADOS_INCIDENCIA)[number];

const incidenciaInclude = {
  examen: {
    select: {
      id: true,
      codigo: true,
      asignatura: true,
      fecha: true,
      hora: true,
      aula: { select: { codigo: true } },
    },
  },
  profesor: {
    select: {
      id: true,
      codigo: true,
      usuario: { select: { nombre: true, apellido: true, email: true } },
    },
  },
} as const;

/**
 * Servicio de incidencias de horario.
 * - Rol Profesor: registra y lista SUS incidencias (asociadas al profesor autenticado).
 * - Rol Administrador: lista todas, cambia estado, aplica solución y exporta.
 * No modifica exámenes: solo opera sobre registros de IncidenciaHorario.
 */
@Injectable()
export class IncidenciasService {
  constructor(private readonly prisma: PrismaService) {}

  private formatFecha(d: Date) {
    const day = String(d.getUTCDate()).padStart(2, '0');
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const year = d.getUTCFullYear();
    return `${year}-${month}-${day}`;
  }

  private serialize(i: any) {
    return {
      id: i.id,
      descripcion: i.descripcion,
      estado: i.estado,
      fechaCreacion: i.fechaCreacion,
      mensajeResolucion: i.mensajeResolucion ?? null,
      fechaResolucion: i.fechaResolucion ?? null,
      examen: i.examen
        ? {
            id: i.examen.id,
            codigo: i.examen.codigo,
            asignatura: i.examen.asignatura,
            fecha: this.formatFecha(new Date(i.examen.fecha)),
            hora: i.examen.hora,
            aula: i.examen.aula?.codigo || null,
          }
        : null,
      profesor: i.profesor
        ? {
            id: i.profesor.id,
            codigo: i.profesor.codigo,
            nombre: i.profesor.usuario
              ? `${i.profesor.usuario.nombre} ${i.profesor.usuario.apellido}`.trim()
              : '',
            email: i.profesor.usuario?.email ?? null,
          }
        : null,
    };
  }

  /**
   * Registra una nueva incidencia. Verifica que el examen exista y que esté
   * asignado al profesor autenticado (un profesor solo reporta sobre sus
   * propios exámenes). El estado inicial es PENDIENTE.
   */
  async crear(profesorId: string, dto: CrearIncidenciaDto) {
    const examen = await this.prisma.examen.findUnique({
      where: { id: dto.examenId },
      select: { id: true, profesorId: true },
    });

    if (!examen) {
      throw new NotFoundException('El examen indicado no existe');
    }

    if (examen.profesorId !== profesorId) {
      throw new ForbiddenException(
        'Solo puede comunicar incidencias sobre exámenes asignados a usted',
      );
    }

    const incidencia = await this.prisma.incidenciaHorario.create({
      data: {
        descripcion: dto.descripcion,
        profesorId,
        examenId: dto.examenId,
      },
      include: incidenciaInclude,
    });

    return this.serialize(incidencia);
  }

  /**
   * Lista las incidencias del profesor autenticado, más recientes primero.
   */
  async listar(profesorId: string) {
    const incidencias = await this.prisma.incidenciaHorario.findMany({
      where: { profesorId },
      orderBy: { fechaCreacion: 'desc' },
      include: incidenciaInclude,
    });

    return incidencias.map((i) => this.serialize(i));
  }

  // ===== Operaciones del Administrador (gestión de incidencias) =====

  /**
   * Lista TODAS las incidencias del sistema (vista del Administrador),
   * más recientes primero, con profesor y examen asociados.
   */
  async listarTodas() {
    const incidencias = await this.prisma.incidenciaHorario.findMany({
      orderBy: { fechaCreacion: 'desc' },
      include: incidenciaInclude,
    });
    return incidencias.map((i) => this.serialize(i));
  }

  /** Recupera una incidencia por id (serializada) o lanza 404. */
  async obtener(id: string) {
    const incidencia = await this.prisma.incidenciaHorario.findUnique({
      where: { id },
      include: incidenciaInclude,
    });
    if (!incidencia) {
      throw new NotFoundException('La incidencia indicada no existe');
    }
    return this.serialize(incidencia);
  }

  /**
   * Cambia el estado de una incidencia (PENDIENTE → REVISADA → RESUELTA,
   * u OMITIDA). Al pasar a RESUELTA registra la fecha de resolución si no existe.
   */
  async cambiarEstado(id: string, estado: string) {
    if (!ESTADOS_INCIDENCIA.includes(estado as EstadoIncidencia)) {
      throw new BadRequestException(
        `Estado no válido. Valores permitidos: ${ESTADOS_INCIDENCIA.join(', ')}`,
      );
    }

    const existente = await this.prisma.incidenciaHorario.findUnique({ where: { id } });
    if (!existente) {
      throw new NotFoundException('La incidencia indicada no existe');
    }

    const incidencia = await this.prisma.incidenciaHorario.update({
      where: { id },
      data: {
        estado: estado as EstadoIncidencia,
        fechaResolucion:
          estado === 'RESUELTA' && !existente.fechaResolucion
            ? new Date()
            : estado === 'RESUELTA'
              ? existente.fechaResolucion
              : existente.fechaResolucion,
      },
      include: incidenciaInclude,
    });
    return this.serialize(incidencia);
  }

  /**
   * Aplica una solución a una incidencia: registra el mensaje del administrador,
   * la fecha de resolución y deja la incidencia en estado RESUELTA (o el estado
   * indicado). El mensaje queda persistido y visible para el profesor.
   */
  async aplicarSolucion(id: string, mensaje: string, estado?: string) {
    const estadoFinal = estado ?? 'RESUELTA';
    if (!ESTADOS_INCIDENCIA.includes(estadoFinal as EstadoIncidencia)) {
      throw new BadRequestException(
        `Estado no válido. Valores permitidos: ${ESTADOS_INCIDENCIA.join(', ')}`,
      );
    }

    const existente = await this.prisma.incidenciaHorario.findUnique({ where: { id } });
    if (!existente) {
      throw new NotFoundException('La incidencia indicada no existe');
    }

    const incidencia = await this.prisma.incidenciaHorario.update({
      where: { id },
      data: {
        mensajeResolucion: mensaje,
        fechaResolucion: new Date(),
        estado: estadoFinal as EstadoIncidencia,
      },
      include: incidenciaInclude,
    });
    return this.serialize(incidencia);
  }

  /**
   * Exporta todas las incidencias en CSV (con BOM para Excel), coherente con el
   * resto de exportaciones del sistema.
   */
  async exportarCSV() {
    const incidencias = await this.listarTodas();

    const columnas = [
      'Profesor',
      'Email',
      'Examen',
      'Código',
      'Fecha examen',
      'Hora',
      'Descripción',
      'Estado',
      'Fecha creación',
      'Mensaje resolución',
      'Fecha resolución',
    ];

    const esc = (valor: string) => `"${String(valor ?? '').replace(/"/g, '""')}"`;
    const lineas = [columnas.map(esc).join(',')];

    for (const i of incidencias) {
      const fila: string[] = [
        i.profesor?.nombre || '',
        i.profesor?.email || '',
        i.examen?.asignatura || '',
        i.examen?.codigo || '',
        i.examen?.fecha || '',
        i.examen?.hora || '',
        i.descripcion,
        i.estado,
        i.fechaCreacion ? new Date(i.fechaCreacion).toISOString() : '',
        i.mensajeResolucion || '',
        i.fechaResolucion ? new Date(i.fechaResolucion).toISOString() : '',
      ];
      lineas.push(fila.map(esc).join(','));
    }

    const content = '﻿' + lineas.join('\r\n');
    return {
      content,
      filename: 'incidencias.csv',
      contentType: 'text/csv; charset=utf-8',
    };
  }
}
