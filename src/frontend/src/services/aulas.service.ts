import api from '../core/api';

export interface Aula {
  id: string;
  codigo: string;
  nombre: string;
  capacidad: number;
  ubicacion: string;
}

export const aulasService = {
  async importAulas(data: Partial<Aula>[]): Promise<{success: number; failed: number; errors: string[]}> {
    const response = await api.post('/aulas/import', data);
    return response.data;
  }
};

export const getAulas = async (): Promise<Aula[]> => {
  const response = await api.get('/aulas');
  return response.data;
};
