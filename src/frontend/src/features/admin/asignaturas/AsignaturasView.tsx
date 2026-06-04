import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAsignaturas } from '../../../hooks/useAsignaturas';

const AsignaturasView: React.FC = () => {
  const { asignaturas, loading, error } = useAsignaturas();
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
    if (seleccionados.length === asignaturasFiltradas.length) {
      setSeleccionados([]);
    } else {
      setSeleccionados(asignaturasFiltradas.map(a => a.id));
    }
  };

  const handleEliminar = () => {
    if (seleccionados.length === 0) {
      alert('⚠️ No hay ninguna asignatura seleccionada para eliminar.');
      return;
    }
    const subjectsToDelete = asignaturas.filter(a => seleccionados.includes(a.id));
    navigate('/admin/asignaturas/eliminar', { state: { subjects: subjectsToDelete } });
  };

  const asignaturasFiltradas = asignaturas.filter(asig => 
    asig.codigo.toLowerCase().includes(busqueda.toLowerCase()) || 
    asig.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{ 
      background: '#e9e9e9', 
      fontFamily: '"Courier New", monospace', 
      display: 'flex', 
      justifyContent: 'center', 
      padding: '20px',
      minHeight: '100vh'
    }}>
      <div style={{ width: '1100px', background: '#ececec', padding: '20px', border: '1px solid #cfcfcf' }}>
        <h1 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '25px', letterSpacing: '1px' }}>
          ADMINISTRACIÓN DE ASIGNATURAS
        </h1>

        {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '25px', background: 'white' }}>
          <thead>
            <tr style={{ background: '#dfe7ef' }}>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', width: '40px' }}>
                <input 
                  type="checkbox" 
                  checked={asignaturasFiltradas.length > 0 && seleccionados.length === asignaturasFiltradas.length}
                  onChange={toggleSeleccionarTodos}
                />
              </th>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', textAlign: 'left' }}>CÓDIGO</th>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', textAlign: 'left' }}>NOMBRE</th>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', width: '80px' }}>CRÉDITOS</th>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', width: '80px' }}>GRADO</th>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', width: '100px', textAlign: 'left' }}>ACCIÓN</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>Cargando asignaturas...</td></tr>
            ) : asignaturasFiltradas.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>No hay asignaturas disponibles</td></tr>
            ) : (
              asignaturasFiltradas.map((asig) => (
                <tr 
                  key={asig.id} 
                  style={{ 
                    borderBottom: '1px solid #bdbdbd',
                    background: seleccionados.includes(asig.id) ? '#b8d4f0' : 'transparent'
                  }}
                >
                  <td style={{ textAlign: 'center', padding: '12px 10px' }}>
                    <input 
                      type="checkbox" 
                      checked={seleccionados.includes(asig.id)}
                      onChange={() => toggleSeleccion(asig.id)}
                    />
                  </td>
                  <td style={{ padding: '12px 10px' }}><strong>{asig.codigo}</strong></td>
                  <td style={{ padding: '12px 10px' }}>{asig.nombre}</td>
                  <td style={{ padding: '12px 10px' }}>{asig.creditos}</td>
                  <td style={{ padding: '12px 10px' }}>{asig.grado.codigo}</td>
                  <td style={{ padding: '12px 10px' }}>
                    <button 
                      onClick={() => navigate(`/admin/asignaturas/editar/${asig.id}`)}
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
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>🔍 BÚSCAR:</span>
          <input 
            type="text" 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Código o nombre..." 
            style={{ padding: '8px 12px', fontFamily: 'inherit', fontSize: '14px', border: '1px solid #bdbdbd', background: 'white', width: '250px' }} 
          />
          <button style={{ background: '#2d89ef', color: 'white', border: 'none', padding: '8px 20px', fontFamily: 'inherit', fontSize: '14px', cursor: 'pointer', borderRadius: '3px' }}>
            Filtrar
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '25px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => navigate('/admin/asignaturas/crear')}
            style={{ minWidth: '180px', padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#28a745', color: 'white' }}
          >
            ➕ Crear nueva
          </button>
          <button 
            onClick={() => navigate('/admin/asignaturas/importar')}
            style={{ minWidth: '180px', padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#2d89ef', color: 'white' }}
          >
            📎 Importar asignaturas
          </button>
          <button 
            onClick={handleEliminar}
            style={{ minWidth: '180px', padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#dc3545', color: 'white' }}
          >
            🗑️ Eliminar seleccionada
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

export default AsignaturasView;
