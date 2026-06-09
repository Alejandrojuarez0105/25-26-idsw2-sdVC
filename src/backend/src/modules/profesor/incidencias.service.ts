import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CrearIncidenciaDto } from './dto/crear-incidencia.dto';

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
} as const;

/**
 * Servicio de incidencias de horario del rol Profesor.
 * Registra y lista incidencias asociándolas SIEMPRE al profesor autenticado.
 * No modifica exámenes: solo crea registros en IncidenciaHorario.
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
}
