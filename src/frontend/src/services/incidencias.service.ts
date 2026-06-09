import api from '../core/api';

export type EstadoIncidencia = 'PENDIENTE' | 'REVISADA' | 'RESUELTA' | 'OMITIDA';

export interface IncidenciaAdmin {
  id: string;
  descripcion: string;
  estado: EstadoIncidencia;
  fechaCreacion: string;
  mensajeResolucion: string | null;
  fechaResolucion: string | null;
  examen: {
    id: string;
    codigo: string;
    asignatura: string;
    fecha: string;
    hora: string;
    aula: string | null;
  } | null;
  profesor: {
    id: string;
    codigo: string;
    nombre: string;
    email: string | null;
  } | null;
}

export const incidenciasService = {
  // Listado completo de incidencias del sistema (Administrador).
  async listarTodas(): Promise<IncidenciaAdmin[]> {
    const response = await api.get('/incidencias');
    return response.data;
  },

  // Cambio de estado (PENDIENTE | REVISADA | RESUELTA | OMITIDA).
  async cambiarEstado(id: string, estado: EstadoIncidencia): Promise<IncidenciaAdmin> {
    const response = await api.put(`/incidencias/${id}/estado`, { estado });
    return response.data;
  },

  // Aplicar solución con mensaje del administrador (deja RESUELTA por defecto).
  async aplicarSolucion(id: string, mensaje: string, estado?: EstadoIncidencia): Promise<IncidenciaAdmin> {
    const response = await api.post(`/incidencias/${id}/solucion`, { mensaje, estado });
    return response.data;
  },

  // Exportación de incidencias en CSV.
  async exportar(): Promise<Blob> {
    const response = await api.get('/incidencias/export', { responseType: 'blob' });
    return response.data;
  },
};
