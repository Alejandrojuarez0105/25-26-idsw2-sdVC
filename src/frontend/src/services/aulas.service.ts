import api from '../core/api';

export interface Aula {
  id: string;
  codigo: string;
  nombre: string;
  capacidad: number;
  ubicacion: string;
}

export const aulasService = {
  async create(data: Omit<Aula, 'id'>): Promise<Aula> {
    const response = await api.post('/aulas', data);
    return response.data;
  },

  async findOne(id: string): Promise<Aula> {
    const response = await api.get(`/aulas/${id}`);
    return response.data;
  },

  async update(id: string, data: Partial<Aula>): Promise<Aula> {
    const response = await api.put(`/aulas/${id}`, data);
    return response.data;
  },

  async importAulas(data: Partial<Aula>[]): Promise<{success: number; failed: number; errors: string[]}> {
    const response = await api.post('/aulas/import', data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/aulas/${id}`);
  },
};

export const getAulas = async (): Promise<Aula[]> => {
  const response = await api.get('/aulas');
  return response.data;
};
