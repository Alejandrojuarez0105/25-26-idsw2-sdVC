import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AdminDashboard from './features/admin/AdminDashboard';
import CrearGradoView from './features/admin/grados/CrearGradoView';
import EditarGradoView from './features/admin/grados/EditarGradoView';
import EliminarGradoView from './features/admin/grados/EliminarGradoView';
import GradosView from './features/admin/grados/GradosView';
import ImportarGradosView from './features/admin/grados/ImportarGradosView';
import AsignaturasView from './features/admin/asignaturas/AsignaturasView';
import EliminarAsignaturaView from './features/admin/asignaturas/EliminarAsignaturaView';
import ImportarAsignaturasView from './features/admin/asignaturas/ImportarAsignaturasView';
import CrearAsignaturaView from './features/admin/asignaturas/CrearAsignaturaView';
import AlumnoDashboard from './features/alumno/AlumnoDashboard';
import LoginView from './features/auth/login/LoginView';
import LogoutView from './features/auth/logout/LogoutView';
import ProfesorDashboard from './features/profesor/ProfesorDashboard';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route path="/logout" element={<LogoutView />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/grados" element={<GradosView />} />
        <Route path="/admin/grados/eliminar" element={<EliminarGradoView />} />
        <Route path="/admin/grados/importar" element={<ImportarGradosView />} />
        <Route path="/admin/grados/crear" element={<CrearGradoView />} />
        <Route path="/admin/grados/editar/:id" element={<EditarGradoView />} />
        <Route path="/admin/asignaturas" element={<AsignaturasView />} />
        <Route path="/admin/asignaturas/eliminar" element={<EliminarAsignaturaView />} />
        <Route path="/admin/asignaturas/importar" element={<ImportarAsignaturasView />} />
        <Route path="/admin/asignaturas/crear" element={<CrearAsignaturaView />} />
        <Route path="/profesor" element={<ProfesorDashboard />} />
        <Route path="/alumno" element={<AlumnoDashboard />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
