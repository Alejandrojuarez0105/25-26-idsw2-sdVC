import { useState, useEffect } from 'react';
import { Aula, getAulas } from '../services/aulas.service';

export const useAulas = () => {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAulas();
  }, []);

  const fetchAulas = async () => {
    try {
      setLoading(true);
      const data = await getAulas();
      setAulas(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching aulas:", err);
      setError('Error al cargar las aulas. Asegúrese de que el servidor esté en ejecución.');
    } finally {
      setLoading(false);
    }
  };

  return { aulas, loading, error, refetch: fetchAulas };
};
