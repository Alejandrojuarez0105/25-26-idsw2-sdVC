import api from '../core/api';

export interface ExamenProfesorRel {
  id: string;
  codigo: string;
  departamento: string | null;
  usuario: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
  };
}

export interface ExamenAulaRel {
  id: string;
  codigo: string;
  nombre: string;
  ubicacion: string;
  capacidad: number;
}

export interface Examen {
  id: string;
  codigo: string;
  asignatura: string;
  fecha: string;
  hora: string;
  profesorId: string | null;
  aulaId: string | null;
  profesor: ExamenProfesorRel | null;
  aula: ExamenAulaRel | null;
}

export interface ExamenInput {
  codigo?: string;
  asignatura?: string;
  fecha?: string;
  hora?: string;
  profesorId?: string | null;
  aulaId?: string | null;
}

export const examenesService = {
  async findAll(): Promise<Examen[]> {
    const response = await api.get('/examenes');
    return response.data;
  },

  async findOne(id: string): Promise<Examen> {
    const response = await api.get(`/examenes/${id}`);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/examenes/${id}`);
  },

  async create(data: ExamenInput): Promise<Examen> {
    const response = await api.post('/examenes', data);
    return response.data;
  },

  async update(id: string, data: ExamenInput): Promise<Examen> {
    const response = await api.put(`/examenes/${id}`, data);
    return response.data;
  },

  async asignarProfesor(examenId: string, profesorId: string | null): Promise<Examen> {
    const response = await api.post(`/examenes/${examenId}/asignar-profesor`, { profesorId });
    return response.data;
  },

  async findConflictos(): Promise<ConflictoExamen[]> {
    const response = await api.get('/examenes/conflictos');
    return response.data;
  },

  async generarCalendario(): Promise<CalendarioGenerado> {
    const response = await api.get('/examenes/calendario/generar');
    return response.data;
  },

  async consultarCalendario(): Promise<CalendarioConsulta> {
    const response = await api.get('/examenes/calendario');
    return response.data;
  },

  async descargarCalendario(opts: DescargaOpciones = {}): Promise<Blob> {
    const params: Record<string, string> = {};
    if (opts.incluirAula === false) params.incluirAula = 'false';
    if (opts.incluirProfesor === false) params.incluirProfesor = 'false';
    if (opts.incluirEstudiantes === false) params.incluirEstudiantes = 'false';
    if (opts.fechaInicio) params.fechaInicio = opts.fechaInicio;
    if (opts.fechaFin) params.fechaFin = opts.fechaFin;
    const response = await api.get('/examenes/calendario/descargar', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};

export interface ConflictoExamen {
  id: number;
  tipo: 'Profesor' | 'Aula' | 'Estudiante';
  detalle: string;
  estado: 'Pendiente' | 'Resuelto' | 'En revisión';
  fecha: string;
  hora: string;
  estudiantesAfectados: number;
  examenes: {
    id: string;
    codigo: string;
    asignatura: string;
    fecha: string;
    hora: string;
    aula: string;
    aulaId: string | null;
    profesor: string;
    profesorId: string | null;
  }[];
}

export interface CalendarioExamen {
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

export interface RequisitoCalendario {
  nombre: string;
  actual: number;
  minimo: number;
  cumple: boolean;
}

export interface CalendarioConsulta {
  generadoEn: string;
  resumen: {
    totalExamenes: number;
    profesoresAsignados: number;
    aulasUtilizadas: number;
    estudiantesAfectados: number;
  };
  examenes: CalendarioExamen[];
  conflictos: ConflictoExamen[];
}

export interface DescargaOpciones {
  incluirAula?: boolean;
  incluirProfesor?: boolean;
  incluirEstudiantes?: boolean;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface CalendarioGenerado {
  datosSuficientes: boolean;
  requisitos: RequisitoCalendario[];
  generadoEn: string;
  datosProcesados: {
    grados: number;
    asignaturas: number;
    profesores: number;
    aulas: number;
    estudiantes: number;
  };
  resumen: {
    totalExamenes: number;
    completos: number;
    conProfesor: number;
    conAula: number;
    sinProfesor: number;
    sinAula: number;
    totalConflictos: number;
  };
  examenes: CalendarioExamen[];
  conflictos: ConflictoExamen[];
}
