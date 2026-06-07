import { useState, useEffect } from 'react';
import { alumnosService, Alumno } from '../services/alumnos.service';

export const useAlumnos = () => {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlumnos = async () => {
    setLoading(true);
    try {
      const data = await alumnosService.findAll();
      setAlumnos(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar los alumnos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumnos();
  }, []);

  return { alumnos, loading, error, refresh: fetchAlumnos };
};
