import api from '../core/api';

export interface Alumno {
  id: string;
  usuarioId: string;
  matricula: string;
  gradoId: string;
  usuario: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    activo: boolean;
  };
  grado: {
    id: string;
    codigo: string;
    nombre: string;
  };
  curso?: string;
}

export const alumnosService = {
  async findAll(): Promise<Alumno[]> {
    const response = await api.get('/alumnos');
    return response.data;
  },
};
