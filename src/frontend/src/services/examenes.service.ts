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
};
