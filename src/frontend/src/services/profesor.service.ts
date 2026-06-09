import api from '../core/api';

export interface CalendarioProfesorExamen {
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

export interface CalendarioProfesor {
  generadoEn: string;
  resumen: {
    totalExamenes: number;
    aulasUtilizadas: number;
    asignaturas: number;
    conConflicto: number;
  };
  examenes: CalendarioProfesorExamen[];
}

export interface DescargaProfesorOpciones {
  incluirAula?: boolean;
  incluirAsignatura?: boolean;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface IncidenciaHorario {
  id: string;
  descripcion: string;
  estado: 'PENDIENTE' | 'REVISADA' | 'RESUELTA';
  fechaCreacion: string;
  examen: {
    id: string;
    codigo: string;
    asignatura: string;
    fecha: string;
    hora: string;
    aula: string | null;
  } | null;
}

export interface CrearIncidenciaInput {
  examenId: string;
  descripcion: string;
}

export const profesorService = {
  // consultarCalendario (Profesor): solo los exámenes asignados al profesor autenticado.
  async consultarCalendario(): Promise<CalendarioProfesor> {
    const response = await api.get('/profesor/calendario');
    return response.data;
  },

  // descargarCalendario (Profesor): CSV de los exámenes propios.
  async descargarCalendario(opts: DescargaProfesorOpciones = {}): Promise<Blob> {
    const params: Record<string, string> = {};
    if (opts.incluirAula === false) params.incluirAula = 'false';
    if (opts.incluirAsignatura === false) params.incluirAsignatura = 'false';
    if (opts.fechaInicio) params.fechaInicio = opts.fechaInicio;
    if (opts.fechaFin) params.fechaFin = opts.fechaFin;
    const response = await api.get('/profesor/calendario/descargar', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  // comunicarIncidenciaHorario: registro de una incidencia sobre un examen propio.
  async crearIncidencia(data: CrearIncidenciaInput): Promise<IncidenciaHorario> {
    const response = await api.post('/profesor/incidencias', data);
    return response.data;
  },

  // Listado de incidencias del profesor autenticado.
  async listarIncidencias(): Promise<IncidenciaHorario[]> {
    const response = await api.get('/profesor/incidencias');
    return response.data;
  },
};
