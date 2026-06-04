import api from '../core/api';

export interface Grado {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  fechaActualizacion: string;
}

export const gradosService = {
  async findAll(): Promise<Grado[]> {
    const response = await api.get('/grados');
    return response.data;
  },

  async findOne(id: string): Promise<Grado> {
    const response = await api.get(`/grados/${id}`);
    return response.data;
  },

  async create(data: any): Promise<Grado> {
    const response = await api.post('/grados', data);
    return response.data;
  },

  async update(id: string, data: any): Promise<Grado> {
    const response = await api.put(`/grados/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/grados/${id}`);
  },

  async importGrados(data: any[]): Promise<any> {
    const response = await api.post('/grados/import', data);
    return response.data;
  },
};
