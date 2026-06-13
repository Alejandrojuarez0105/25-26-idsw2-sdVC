import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

type Rol = 'Admin' | 'Profesor' | 'Alumno';

const rutaPorRol: Record<Rol, string> = {
  Admin: '/admin',
  Profesor: '/profesor',
  Alumno: '/alumno',
};

// Lee la sesión actual desde localStorage en CADA render. Esto es lo que hace
// que, tras un logout, volver con el botón "atrás" del navegador no muestre la
// página protegida: el guard se reevalúa y, al no haber sesión, redirige a login.
const leerSesion = (): { rol: Rol } | null => {
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');
  if (!token || !userJson) return null;
  try {
    const user = JSON.parse(userJson);
    return user && user.rol ? { rol: user.rol as Rol } : null;
  } catch {
    return null;
  }
};

interface Props {
  /** Roles autorizados para el grupo de rutas. Si se omite, basta con estar autenticado. */
  roles?: Rol[];
  children?: React.ReactNode;
}

/**
 * Protege rutas en el cliente:
 *  - Sin sesión válida (token + usuario) → redirige a `/login`.
 *  - Con sesión pero rol no autorizado → redirige al panel de su propio rol.
 * Puede usarse como envoltura (`children`) o como ruta de layout (renderiza `<Outlet/>`).
 */
const ProtectedRoute: React.FC<Props> = ({ roles, children }) => {
  const sesion = leerSesion();

  if (!sesion) {
    return <Navigate to="/login" replace />;
  }
  if (roles && roles.length > 0 && !roles.includes(sesion.rol)) {
    return <Navigate to={rutaPorRol[sesion.rol] ?? '/login'} replace />;
  }
  return <>{children ?? <Outlet />}</>;
};

export default ProtectedRoute;
