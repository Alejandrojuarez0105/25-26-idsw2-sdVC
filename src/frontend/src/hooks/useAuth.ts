import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

export const useAuth = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  const login = async (credentials: any) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(credentials);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect based on role
      const { rol } = data.user;
      if (rol === 'Admin') navigate('/admin');
      else if (rol === 'Profesor') navigate('/profesor');
      else if (rol === 'Alumno') navigate('/alumno');
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    navigate('/login', { replace: true });
  };

  return { login, logout, user, error, loading };
};
