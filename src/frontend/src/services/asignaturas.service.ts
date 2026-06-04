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

  async findOne(id: string): Promise<Asignatura> {
    const response = await api.get(`/asignaturas/${id}`);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/asignaturas/${id}`);
  },

  async importAsignaturas(data: any[]): Promise<any> {
    const response = await api.post('/asignaturas/import', data);
    return response.data;
  },
};
