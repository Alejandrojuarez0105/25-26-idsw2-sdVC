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
  matriculas?: {
    id: string;
    alumnoId: string;
    asignaturaId: string;
    asignatura: {
      id: string;
      codigo: string;
      nombre: string;
    };
  }[];
  curso?: string;
}

export const alumnosService = {
  async findAll(): Promise<Alumno[]> {
    const response = await api.get('/alumnos');
    return response.data;
  },

  async findOne(id: string): Promise<Alumno> {
    const response = await api.get(`/alumnos/${id}`);
    return response.data;
  },

  async create(data: any): Promise<Alumno> {
    const response = await api.post('/alumnos', data);
    return response.data;
  },

  async update(id: string, data: any): Promise<Alumno> {
    const response = await api.put(`/alumnos/${id}`, data);
    return response.data;
  },

  async importAlumnos(data: Partial<Alumno>[]): Promise<{success: number; failed: number; errors: string[]}> {
    const response = await api.post('/alumnos/import', data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/alumnos/${id}`);
  },
};
