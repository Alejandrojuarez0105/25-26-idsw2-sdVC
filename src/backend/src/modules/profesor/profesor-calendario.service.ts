import { Injectable } from '@nestjs/common';
import { ExamenesService } from '../examenes/examenes.service';

/**
 * Servicio de calendario para el rol Profesor.
 *
 * NO duplica la lógica de consolidación del calendario: reutiliza el método
 * público ya implementado `ExamenesService.consultarCalendario()` (Administrador)
 * y aplica ÚNICAMENTE el filtro por el profesor autenticado. De este modo se
 * respeta la prohibición de modificar el backend existente y se mantiene una
 * única fuente de verdad para los datos del calendario.
 */
@Injectable()
export class ProfesorCalendarioService {
  constructor(private readonly examenesService: ExamenesService) {}

  /**
   * Devuelve el calendario del profesor autenticado: únicamente sus exámenes
   * asignados (filtro por profesorId), con fecha, hora, aula y asignatura.
   */
  async consultarCalendario(profesorId: string) {
    const calendario = await this.examenesService.consultarCalendario();

    const examenes = calendario.examenes.filter(
      (e) => e.profesorId === profesorId,
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
   * Genera el CSV del calendario del profesor autenticado, reutilizando los
   * datos ya filtrados de consultarCalendario(). Mantiene el mismo formato
   * (BOM + CSV) que la descarga del Administrador para coherencia.
   */
  async descargarCalendario(
    profesorId: string,
    opts: {
      incluirAula?: boolean;
      incluirAsignatura?: boolean;
      fechaInicio?: string;
      fechaFin?: string;
    } = {},
  ) {
    const { examenes } = await this.consultarCalendario(profesorId);

    let filas = examenes;
    if (opts.fechaInicio) filas = filas.filter((e) => e.fecha >= opts.fechaInicio!);
    if (opts.fechaFin) filas = filas.filter((e) => e.fecha <= opts.fechaFin!);

    const incluirAula = opts.incluirAula !== false;
    const incluirAsignatura = opts.incluirAsignatura !== false;

    const columnas = ['Fecha', 'Hora', 'Código'];
    if (incluirAsignatura) columnas.push('Asignatura');
    if (incluirAula) columnas.push('Aula');
    columnas.push('Estado');

    const esc = (valor: string) => `"${String(valor ?? '').replace(/"/g, '""')}"`;
    const lineas = [columnas.map(esc).join(',')];

    for (const e of filas) {
      const fila: string[] = [e.fecha, e.hora, e.codigo];
      if (incluirAsignatura) fila.push(e.asignatura);
      if (incluirAula) fila.push(e.aula || '');
      fila.push(e.tieneConflicto ? `Conflicto: ${e.tiposConflicto.join('/')}` : 'OK');
      lineas.push(fila.map(esc).join(','));
    }

    // BOM inicial para que Excel respete los acentos al abrir el CSV.
    const content = '﻿' + lineas.join('\r\n');
    return {
      content,
      filename: 'mi-calendario-examenes.csv',
      contentType: 'text/csv; charset=utf-8',
    };
  }
}
