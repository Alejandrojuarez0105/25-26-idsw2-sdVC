import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const LogoutView: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleConfirmLogout = () => {
    logout();
  };

  const handleCancel = () => {
    navigate(-1); // Back to previous page
  };

  return (
    <div style={{ 
      background: '#e9e9e9', 
      fontFamily: '"Courier New", monospace', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{ 
        width: '450px', 
        background: '#ececec', 
        padding: '30px', 
        border: '1px solid #cfcfcf', 
        textAlign: 'center' 
      }}>
        
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, letterSpacing: '2px' }}>UE</h1>
          <div style={{ fontSize: '12px', color: '#555', marginTop: '5px' }}>Universidad Europea del Atlántico</div>
        </div>

        <div style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          textDecoration: 'underline', 
          marginBottom: '25px', 
          letterSpacing: '1px' 
        }}>Cerrar Sesión</div>

        <div style={{ fontSize: '16px', marginBottom: '25px', lineHeight: '1.5', color: '#333' }}>
          <p>¿Está seguro de que desea cerrar la sesión actual?</p>
          <p>Será redirigido a la página de inicio de sesión.</p>
        </div>

        <div style={{ 
          background: '#e7f3ff', 
          padding: '12px', 
          marginBottom: '25px', 
          borderLeft: '4px solid #2d89ef', 
          fontSize: '13px', 
          textAlign: 'left' 
        }}>
          <strong style={{ display: 'block', marginBottom: '5px' }}>👤 Sesión actual:</strong>
          <span>{user?.email}<br />🎓 Rol: {user?.rol}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <button 
            onClick={handleCancel}
            style={{ 
              minWidth: '150px', 
              padding: '12px 20px', 
              borderRadius: '4px', 
              fontSize: '16px', 
              fontFamily: 'inherit', 
              cursor: 'pointer', 
              border: '1px solid #999', 
              fontWeight: 'bold',
              background: '#f3f0ec',
              color: 'black'
            }}
          >
            ❌ Cancelar
          </button>
          <button 
            onClick={handleConfirmLogout}
            style={{ 
              minWidth: '150px', 
              padding: '12px 20px', 
              borderRadius: '4px', 
              fontSize: '16px', 
              fontFamily: 'inherit', 
              cursor: 'pointer', 
              border: '1px solid #a71d2a', 
              fontWeight: 'bold',
              background: '#dc3545',
              color: 'white'
            }}
          >
            🚪 Sí, Cerrar Sesión
          </button>
        </div>

        <div style={{ marginTop: '25px', fontSize: '11px', color: '#666' }}>
          Versión 1.0 · © 2026
        </div>

      </div>
    </div>
  );
};

export default LogoutView;
