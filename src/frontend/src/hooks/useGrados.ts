import { useState, useEffect } from 'react';
import { gradosService, Grado } from '../services/grados.service';

export const useGrados = () => {
  const [grados, setGrados] = useState<Grado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGrados = async () => {
    setLoading(true);
    try {
      const data = await gradosService.findAll();
      setGrados(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar los grados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrados();
  }, []);

  return { grados, loading, error, refresh: fetchGrados };
};
