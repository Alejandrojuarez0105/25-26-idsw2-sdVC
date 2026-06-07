import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfesores } from '../../../hooks/useProfesores';
import { Profesor } from '../../../services/profesores.service';

const ProfesoresListView: React.FC = () => {
  const { profesores, loading, error } = useProfesores();
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [seleccionados, setSeleccionados] = useState<string[]>([]);

  const handleSalir = () => {
    navigate('/admin');
  };

  const handleAccionNoImplementada = (accion: string) => {
    alert(`⚠️ La funcionalidad de "${accion}" no está implementada en esta sesión.`);
  };

  const toggleSeleccion = (id: string) => {
    setSeleccionados(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSeleccionarTodos = () => {
    if (seleccionados.length === profesoresFiltrados.length) {
      setSeleccionados([]);
    } else {
      setSeleccionados(profesoresFiltrados.map(p => p.id));
    }
  };

  // Helper to generate a deterministic PROxxx code based on the uuid
  const getCodigo = (profesor: Profesor) => {
    const digits = profesor.id.replace(/\D/g, '');
    if (digits.length > 0) {
      const num = parseInt(digits.slice(-3)) || 1;
      return `PRO${String(num % 1000).padStart(3, '0')}`;
    }
    const chars = profesor.id.replace(/[^a-zA-Z0-9]/g, '');
    return `PRO${chars.slice(0, 3).toUpperCase()}`;
  };

  const profesoresFiltrados = profesores.filter(profesor => {
    const nombreCompleto = `${profesor.usuario?.nombre || ''} ${profesor.usuario?.apellido || ''}`.toLowerCase();
    const email = (profesor.usuario?.email || '').toLowerCase();
    const depto = (profesor.departamento || '').toLowerCase();
    const codigo = getCodigo(profesor).toLowerCase();
    const query = busqueda.toLowerCase();

    return nombreCompleto.includes(query) || email.includes(query) || depto.includes(query) || codigo.includes(query);
  });

  return (
    <div style={{ 
      background: '#e9e9e9', 
      fontFamily: '"Courier New", monospace', 
      display: 'flex', 
      justifyContent: 'center', 
      padding: '20px',
      minHeight: '100vh'
    }}>
      <div style={{ width: '1200px', background: '#ececec', padding: '20px', border: '1px solid #cfcfcf' }}>
        <h1 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '25px', letterSpacing: '1px' }}>
          ADMINISTRACIÓN DE PROFESORES
        </h1>

        {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '25px', background: 'white' }}>
          <thead>
            <tr style={{ background: '#dfe7ef' }}>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', width: '40px' }}>
                <input 
                  type="checkbox" 
                  checked={profesoresFiltrados.length > 0 && seleccionados.length === profesoresFiltrados.length}
                  onChange={toggleSeleccionarTodos}
                />
              </th>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', textAlign: 'left' }}>CÓDIGO</th>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', textAlign: 'left' }}>NOMBRE</th>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', textAlign: 'left' }}>EMAIL</th>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', textAlign: 'left' }}>DEPARTAMENTO</th>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', width: '100px', textAlign: 'left' }}>ACCIÓN</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>Cargando profesores...</td></tr>
            ) : profesoresFiltrados.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>No hay profesores disponibles</td></tr>
            ) : (
              profesoresFiltrados.map((profesor) => (
                <tr 
                  key={profesor.id} 
                  style={{ 
                    borderBottom: '1px solid #bdbdbd',
                    background: seleccionados.includes(profesor.id) ? '#b8d4f0' : 'transparent'
                  }}
                >
                  <td style={{ textAlign: 'center', padding: '12px 10px' }}>
                    <input 
                      type="checkbox" 
                      checked={seleccionados.includes(profesor.id)}
                      onChange={() => toggleSeleccion(profesor.id)}
                    />
                  </td>
                  <td style={{ padding: '12px 10px' }}><strong>{getCodigo(profesor)}</strong></td>
                  <td style={{ padding: '12px 10px' }}>{`${profesor.usuario?.nombre || ''} ${profesor.usuario?.apellido || ''}`}</td>
                  <td style={{ padding: '12px 10px' }}>{profesor.usuario?.email}</td>
                  <td style={{ padding: '12px 10px' }}>{profesor.departamento || 'N/A'}</td>
                  <td style={{ padding: '12px 10px' }}>
                    <button 
                      onClick={() => handleAccionNoImplementada('Editar Profesor')}
                      style={{ background: '#2d89ef', color: 'white', border: 'none', padding: '5px 15px', fontFamily: 'inherit', fontSize: '13px', cursor: 'pointer', borderRadius: '3px' }}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '15px', marginBottom: '25px' }}>
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>🔍 BUSCAR:</span>
          <input 
            type="text" 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Código, nombre o email..." 
            style={{ padding: '8px 12px', fontFamily: 'inherit', fontSize: '14px', border: '1px solid #bdbdbd', background: 'white', width: '250px' }} 
          />
          <button style={{ background: '#2d89ef', color: 'white', border: 'none', padding: '8px 20px', fontFamily: 'inherit', fontSize: '14px', cursor: 'pointer', borderRadius: '3px' }}>
            Filtrar
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '25px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => handleAccionNoImplementada('Crear Profesor')}
            style={{ minWidth: '180px', padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#28a745', color: 'white' }}
          >
            ➕ Crear nuevo
          </button>
          <button
            onClick={() => navigate('/admin/profesores/importar')}
            style={{ minWidth: '180px', padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#2d89ef', color: 'white' }}
          >
            📎 Importar profesores
          </button>
          <button
            onClick={() => handleAccionNoImplementada('Eliminar Profesor')}
            style={{ minWidth: '180px', padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#dc3545', color: 'white' }}
          >
            🗑️ Eliminar seleccionado
          </button>
          <button 
            onClick={handleSalir}
            style={{ minWidth: '180px', padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#f3f0ec', color: 'black' }}
          >
            🚪 Salir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfesoresListView;
