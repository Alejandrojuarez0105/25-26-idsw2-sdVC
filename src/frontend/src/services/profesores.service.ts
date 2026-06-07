import api from '../core/api';

export interface Profesor {
  id: string;
  usuarioId: string;
  departamento: string | null;
  usuario: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    activo: boolean;
  };
}

export const profesoresService = {
  async findAll(): Promise<Profesor[]> {
    const response = await api.get('/profesores');
    return response.data;
  },

  async importProfesores(data: any[]): Promise<{success: number; failed: number; errors: string[]}> {
    const response = await api.post('/profesores/import', data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/profesores/${id}`);
  },

  async create(data: any): Promise<Profesor> {
    const response = await api.post('/profesores', data);
    return response.data;
  },
};
