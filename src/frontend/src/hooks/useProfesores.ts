import { useState, useEffect } from 'react';
import { profesoresService, Profesor } from '../services/profesores.service';

export const useProfesores = () => {
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfesores = async () => {
    setLoading(true);
    try {
      const data = await profesoresService.findAll();
      setProfesores(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar los profesores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfesores();
  }, []);

  return { profesores, loading, error, refresh: fetchProfesores };
};
