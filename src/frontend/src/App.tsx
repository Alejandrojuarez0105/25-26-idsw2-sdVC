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
import EditarAsignaturaView from './features/admin/asignaturas/EditarAsignaturaView';
import ExamenesView from './features/admin/examenes/ExamenesView';
import EliminarExamenView from './features/admin/examenes/EliminarExamenView';
import CrearExamenView from './features/admin/examenes/CrearExamenView';
import EditarExamenView from './features/admin/examenes/EditarExamenView';
import AlumnoDashboard from './features/alumno/AlumnoDashboard';
import LoginView from './features/auth/login/LoginView';
import LogoutView from './features/auth/logout/LogoutView';
import ProfesorDashboard from './features/profesor/ProfesorDashboard';
import AulasView from './features/admin/aulas/AulasView';
import EliminarAulaView from './features/admin/aulas/EliminarAulaView';
import ImportarAulasView from './features/admin/aulas/ImportarAulasView';
import CrearAulaView from './features/admin/aulas/CrearAulaView';

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
        <Route path="/admin/asignaturas/editar/:id" element={<EditarAsignaturaView />} />
        <Route path="/admin/examenes" element={<ExamenesView />} />
        <Route path="/admin/examenes/eliminar" element={<EliminarExamenView />} />
        <Route path="/admin/examenes/crear" element={<CrearExamenView />} />
        <Route path="/admin/examenes/editar/:id" element={<EditarExamenView />} />
        <Route path="/admin/aulas" element={<AulasView />} />
        <Route path="/admin/aulas/eliminar" element={<EliminarAulaView />} />
        <Route path="/admin/aulas/importar" element={<ImportarAulasView />} />
        <Route path="/admin/aulas/crear" element={<CrearAulaView />} />
        <Route path="/profesor" element={<ProfesorDashboard />} />
        <Route path="/alumno" element={<AlumnoDashboard />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
