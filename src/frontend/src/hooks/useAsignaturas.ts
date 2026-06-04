import { useState, useEffect } from 'react';
import { asignaturasService, Asignatura } from '../services/asignaturas.service';

export const useAsignaturas = () => {
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAsignaturas = async () => {
    setLoading(true);
    try {
      const data = await asignaturasService.findAll();
      setAsignaturas(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar las asignaturas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsignaturas();
  }, []);

  return { asignaturas, loading, error, refresh: fetchAsignaturas };
};
