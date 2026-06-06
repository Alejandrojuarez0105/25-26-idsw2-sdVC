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
};
