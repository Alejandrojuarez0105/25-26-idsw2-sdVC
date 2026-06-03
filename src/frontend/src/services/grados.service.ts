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
};
