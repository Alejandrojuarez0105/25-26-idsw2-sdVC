import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginView from './features/auth/login/LoginView';
import AdminDashboard from './features/admin/AdminDashboard';
import ProfesorDashboard from './features/profesor/ProfesorDashboard';
import AlumnoDashboard from './features/alumno/AlumnoDashboard';
import LogoutView from './features/auth/logout/LogoutView';
import GradosView from './features/admin/grados/GradosView';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route path="/logout" element={<LogoutView />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/grados" element={<GradosView />} />
        <Route path="/profesor" element={<ProfesorDashboard />} />
        <Route path="/alumno" element={<AlumnoDashboard />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
