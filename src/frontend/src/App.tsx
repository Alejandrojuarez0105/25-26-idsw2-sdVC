import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginView from './features/auth/login/LoginView';

// Placeholders for Dashboards
const AdminDashboard = () => <div style={{ padding: '2rem' }}><h1>Dashboard Administrador</h1><p>Bienvenido al sistema Davidario.</p></div>;
const ProfesorDashboard = () => <div style={{ padding: '2rem' }}><h1>Dashboard Profesor</h1><p>Bienvenido, docente.</p></div>;
const AlumnoDashboard = () => <div style={{ padding: '2rem' }}><h1>Dashboard Alumno</h1><p>Bienvenido, estudiante.</p></div>;

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profesor" element={<ProfesorDashboard />} />
        <Route path="/alumno" element={<AlumnoDashboard />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
