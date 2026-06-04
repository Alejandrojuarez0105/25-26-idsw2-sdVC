import api from '../core/api';

export interface Asignatura {
  id: string;
  codigo: string;
  nombre: string;
  creditos: number;
  gradoId: string;
  grado: {
    codigo: string;
    nombre: string;
  };
  fechaCreacion: string;
}

export const asignaturasService = {
  async findAll(): Promise<Asignatura[]> {
    const response = await api.get('/asignaturas');
    return response.data;
  },
};
