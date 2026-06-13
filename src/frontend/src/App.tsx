import React, { useEffect, useState } from 'react';
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
import AsignarProfesorAExamenView from './features/admin/examenes/AsignarProfesorAExamenView';
import ListarConflictosExamenesView from './features/admin/examenes/ListarConflictosExamenesView';
import GenerarCalendarioView from './features/admin/examenes/GenerarCalendarioView';
import ConsultarCalendarioView from './features/admin/examenes/ConsultarCalendarioView';
import GestionIncidenciasView from './features/admin/incidencias/GestionIncidenciasView';
import AlumnoDashboard from './features/alumno/AlumnoDashboard';
import AlumnoCalendarioView from './features/alumno/AlumnoCalendarioView';
import LoginView from './features/auth/login/LoginView';
import LogoutView from './features/auth/logout/LogoutView';
import ProfesorDashboard from './features/profesor/ProfesorDashboard';
import ProfesorCalendarioView from './features/profesor/ProfesorCalendarioView';
import ComunicarIncidenciaHorarioView from './features/profesor/ComunicarIncidenciaHorarioView';
import AulasView from './features/admin/aulas/AulasView';
import EliminarAulaView from './features/admin/aulas/EliminarAulaView';
import ImportarAulasView from './features/admin/aulas/ImportarAulasView';
import CrearAulaView from './features/admin/aulas/CrearAulaView';
import EditarAulaView from './features/admin/aulas/EditarAulaView';
import AlumnosView from './features/admin/alumnos/AlumnosView';
import ImportarAlumnosView from './features/admin/alumnos/ImportarAlumnosView';
import EliminarAlumnoView from './features/admin/alumnos/EliminarAlumnoView';
import CrearAlumnoView from './features/admin/alumnos/CrearAlumnoView';
import EditarAlumnoView from './features/admin/alumnos/EditarAlumnoView';
import ProfesoresListView from './features/admin/profesores/ProfesoresListView';
import ImportarProfesoresView from './features/admin/profesores/ImportarProfesoresView';
import EliminarProfesorView from './features/admin/profesores/EliminarProfesorView';
import CrearProfesorView from './features/admin/profesores/CrearProfesorView';
import EditarProfesorView from './features/admin/profesores/EditarProfesorView';

const App: React.FC = () => {
  // Tema claro/oscuro persistido. El modo oscuro aplica un filtro tipo Dark Reader
  // sobre el contenedor de la app; el conmutador queda fuera para no invertirse.
  const [dark, setDark] = useState<boolean>(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    document.body.classList.toggle('app-dark', dark);
  }, [dark]);

  return (
    <Router>
      <div className={dark ? 'dark-mode-root' : undefined}>
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
        <Route path="/admin/examenes/asignar-profesor" element={<AsignarProfesorAExamenView />} />
        <Route path="/admin/examenes/conflictos" element={<ListarConflictosExamenesView />} />
        <Route path="/admin/examenes/calendario" element={<GenerarCalendarioView />} />
        <Route path="/admin/calendario/consultar" element={<ConsultarCalendarioView />} />
        <Route path="/admin/incidencias" element={<GestionIncidenciasView />} />
        <Route path="/admin/aulas" element={<AulasView />} />
        <Route path="/admin/aulas/eliminar" element={<EliminarAulaView />} />
        <Route path="/admin/aulas/importar" element={<ImportarAulasView />} />
        <Route path="/admin/aulas/crear" element={<CrearAulaView />} />
        <Route path="/admin/aulas/editar/:id" element={<EditarAulaView />} />
        <Route path="/admin/alumnos" element={<AlumnosView />} />
        <Route path="/admin/alumnos/eliminar" element={<EliminarAlumnoView />} />
        <Route path="/admin/alumnos/importar" element={<ImportarAlumnosView />} />
        <Route path="/admin/alumnos/crear" element={<CrearAlumnoView />} />
        <Route path="/admin/alumnos/editar/:id" element={<EditarAlumnoView />} />
        <Route path="/admin/profesores" element={<ProfesoresListView />} />
        <Route path="/admin/profesores/importar" element={<ImportarProfesoresView />} />
        <Route path="/admin/profesores/eliminar" element={<EliminarProfesorView />} />
        <Route path="/admin/profesores/crear" element={<CrearProfesorView />} />
        <Route path="/admin/profesores/editar/:id" element={<EditarProfesorView />} />
        <Route path="/profesor" element={<ProfesorDashboard />} />
        <Route path="/profesor/calendario" element={<ProfesorCalendarioView />} />
        <Route path="/profesor/incidencias" element={<ComunicarIncidenciaHorarioView />} />
        <Route path="/alumno" element={<AlumnoDashboard />} />
        <Route path="/alumno/calendario" element={<AlumnoCalendarioView />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
      </div>
      <button
        type="button"
        className={`theme-toggle ${dark ? 'is-dark' : 'is-light'}`}
        onClick={() => setDark((d) => !d)}
        title="Cambiar entre modo claro y oscuro"
        aria-label="Cambiar tema"
      >
        {dark ? '☀️ Modo claro' : '🌙 Modo oscuro'}
      </button>
    </Router>
  );
};

export default App;
