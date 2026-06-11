import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { ExamenesService } from '../examenes/examenes.service';
import { construirPdfCalendario } from '../../common/calendario-pdf';

/**
 * Servicio de calendario para el rol Alumno.
 *
 * NO duplica la lógica de consolidación del calendario: reutiliza el método
 * público ya implementado `ExamenesService.consultarCalendario()` (Administrador)
 * y aplica ÚNICAMENTE el filtro por las asignaturas en las que el alumno está
 * matriculado. Mantiene una única fuente de verdad para los datos del calendario
 * y respeta la prohibición de modificar el backend existente.
 */
@Injectable()
export class AlumnoCalendarioService {
  constructor(
    private readonly examenesService: ExamenesService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Devuelve el conjunto (en minúsculas) de nombres y códigos de las asignaturas
   * matriculadas por el alumno. El examen guarda la asignatura como texto libre,
   * por lo que se compara contra nombre y código del catálogo (igual criterio que
   * `ExamenesService`).
   */
  private async asignaturasMatriculadas(alumnoId: string): Promise<Set<string>> {
    const matriculas = await this.prisma.matricula.findMany({
      where: { alumnoId },
      select: { asignatura: { select: { nombre: true, codigo: true } } },
    });

    const claves = new Set<string>();
    for (const m of matriculas) {
      if (m.asignatura?.nombre) claves.add(m.asignatura.nombre.trim().toLowerCase());
      if (m.asignatura?.codigo) claves.add(m.asignatura.codigo.trim().toLowerCase());
    }
    return claves;
  }

  /**
   * Devuelve el calendario del alumno autenticado: únicamente los exámenes de las
   * asignaturas en las que está matriculado, con fecha, hora, aula y asignatura.
   */
  async consultarCalendario(alumnoId: string) {
    const [calendario, asignaturas] = await Promise.all([
      this.examenesService.consultarCalendario(),
      this.asignaturasMatriculadas(alumnoId),
    ]);

    const examenes = calendario.examenes.filter((e) =>
      asignaturas.has((e.asignatura || '').trim().toLowerCase()),
    );

    return {
      generadoEn: calendario.generadoEn,
      resumen: {
        totalExamenes: examenes.length,
        aulasUtilizadas: new Set(
          examenes.filter((e) => e.aulaId).map((e) => e.aulaId),
        ).size,
        asignaturas: new Set(examenes.map((e) => e.asignatura)).size,
        conConflicto: examenes.filter((e) => e.tieneConflicto).length,
      },
      examenes,
    };
  }

  /**
   * Genera el CSV del calendario del alumno autenticado, reutilizando los datos
   * ya filtrados de consultarCalendario(). Mantiene el mismo formato (BOM + CSV)
   * que la descarga del Administrador y del Profesor para coherencia.
   */
  async descargarCalendario(
    alumnoId: string,
    opts: {
      incluirAula?: boolean;
      incluirAsignatura?: boolean;
      fechaInicio?: string;
      fechaFin?: string;
      formato?: 'csv' | 'pdf';
    } = {},
  ) {
    const { examenes } = await this.consultarCalendario(alumnoId);

    let filtrados = examenes;
    if (opts.fechaInicio) filtrados = filtrados.filter((e) => e.fecha >= opts.fechaInicio!);
    if (opts.fechaFin) filtrados = filtrados.filter((e) => e.fecha <= opts.fechaFin!);

    const incluirAula = opts.incluirAula !== false;
    const incluirAsignatura = opts.incluirAsignatura !== false;

    const columnas = ['Fecha', 'Hora', 'Código'];
    if (incluirAsignatura) columnas.push('Asignatura');
    if (incluirAula) columnas.push('Aula');
    columnas.push('Estado');

    const filas: string[][] = filtrados.map((e) => {
      const fila: string[] = [e.fecha, e.hora, e.codigo];
      if (incluirAsignatura) fila.push(e.asignatura);
      if (incluirAula) fila.push(e.aula || '');
      fila.push(e.tieneConflicto ? `Conflicto: ${e.tiposConflicto.join('/')}` : 'OK');
      return fila;
    });

    if (opts.formato === 'pdf') {
      const buffer = await construirPdfCalendario({
        titulo: 'Mi Calendario de Exámenes',
        subtitulo: `Total: ${filas.length} examen(es)`,
        columnas,
        filas,
      });
      return {
        content: buffer,
        filename: 'mi-calendario-examenes.pdf',
        contentType: 'application/pdf',
      };
    }

    // BOM inicial para que Excel respete los acentos al abrir el CSV.
    const esc = (valor: string) => `"${String(valor ?? '').replace(/"/g, '""')}"`;
    const lineas = [columnas.map(esc).join(',')];
    for (const fila of filas) lineas.push(fila.map(esc).join(','));
    const content = '﻿' + lineas.join('\r\n');
    return {
      content,
      filename: 'mi-calendario-examenes.csv',
      contentType: 'text/csv; charset=utf-8',
    };
  }
}
