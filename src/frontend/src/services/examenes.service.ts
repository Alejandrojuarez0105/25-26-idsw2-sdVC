import api from '../core/api';

export interface Examen {
  id: string;
  codigo: string;
  fecha: string;
  hora: string;
  aula: string;
  asignatura: string;
  profesor: string;
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

  async create(data: Omit<Examen, 'id'>): Promise<Examen> {
    const response = await api.post('/examenes', data);
    return response.data;
  },

  async update(id: string, data: Partial<Examen>): Promise<Examen> {
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
    profesor: string;
  }[];
}
