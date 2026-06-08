import api from '../core/api';

export interface Profesor {
  id: string;
  usuarioId: string;
  codigo?: string;
  departamento: string | null;
  usuario: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    activo: boolean;
  };
  asignaturas?: {
    profesorId: string;
    asignaturaId: string;
    asignatura: {
      id: string;
      codigo: string;
      nombre: string;
    };
  }[];
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

  async findOne(id: string): Promise<Profesor> {
    const response = await api.get(`/profesores/${id}`);
    return response.data;
  },

  async update(id: string, data: any): Promise<Profesor> {
    const response = await api.put(`/profesores/${id}`, data);
    return response.data;
  },
};
