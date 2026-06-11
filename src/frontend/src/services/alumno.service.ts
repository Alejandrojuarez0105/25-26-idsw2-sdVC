import api from '../core/api';

export interface CalendarioAlumnoExamen {
  id: string;
  codigo: string;
  asignatura: string;
  fecha: string;
  hora: string;
  aula: string;
  aulaId: string | null;
  profesor: string;
  profesorId: string | null;
  tieneConflicto: boolean;
  tiposConflicto: string[];
}

export interface CalendarioAlumno {
  generadoEn: string;
  resumen: {
    totalExamenes: number;
    aulasUtilizadas: number;
    asignaturas: number;
    conConflicto: number;
  };
  examenes: CalendarioAlumnoExamen[];
}

export interface DescargaAlumnoOpciones {
  incluirAula?: boolean;
  incluirAsignatura?: boolean;
  fechaInicio?: string;
  fechaFin?: string;
  formato?: 'csv' | 'pdf';
}

export const alumnoService = {
  // consultarCalendario (Alumno): solo los exámenes de sus asignaturas matriculadas.
  async consultarCalendario(): Promise<CalendarioAlumno> {
    const response = await api.get('/alumno/calendario');
    return response.data;
  },

  // descargarCalendarioExamenes (Alumno): CSV de los exámenes de sus asignaturas.
  async descargarCalendario(opts: DescargaAlumnoOpciones = {}): Promise<Blob> {
    const params: Record<string, string> = {};
    if (opts.incluirAula === false) params.incluirAula = 'false';
    if (opts.incluirAsignatura === false) params.incluirAsignatura = 'false';
    if (opts.fechaInicio) params.fechaInicio = opts.fechaInicio;
    if (opts.fechaFin) params.fechaFin = opts.fechaFin;
    if (opts.formato) params.formato = opts.formato;
    const response = await api.get('/alumno/calendario/descargar', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};
