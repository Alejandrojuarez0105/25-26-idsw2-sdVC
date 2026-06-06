import api from '../core/api';

export interface Aula {
  id: string;
  codigo: string;
  nombre: string;
  capacidad: number;
  ubicacion: string;
}

export const getAulas = async (): Promise<Aula[]> => {
  const response = await api.get('/aulas');
  return response.data;
};
