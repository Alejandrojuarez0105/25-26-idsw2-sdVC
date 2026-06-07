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
};
