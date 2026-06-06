import { useState, useEffect } from 'react';
import { examenesService, Examen } from '../services/examenes.service';

export const useExamenes = () => {
  const [examenes, setExamenes] = useState<Examen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExamenes = async () => {
    setLoading(true);
    try {
      const data = await examenesService.findAll();
      setExamenes(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar los exámenes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamenes();
  }, []);

  return { examenes, loading, error, refresh: fetchExamenes };
};
