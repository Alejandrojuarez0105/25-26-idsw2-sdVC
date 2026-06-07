import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAulas } from '../../../hooks/useAulas';

const AulasView: React.FC = () => {
  const { aulas, loading, error } = useAulas();
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [seleccionados, setSeleccionados] = useState<string[]>([]);

  const handleSalir = () => {
    navigate('/admin');
  };

  const handleEliminar = () => {
    if (seleccionados.length === 0) {
      alert('⚠️ Seleccione al menos un aula para eliminar.');
      return;
    }
    const aulasSeleccionadas = aulas.filter(a => seleccionados.includes(a.id));
    navigate('/admin/aulas/eliminar', { state: { aulas: aulasSeleccionadas } });
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
    if (seleccionados.length === aulasFiltradas.length) {
      setSeleccionados([]);
    } else {
      setSeleccionados(aulasFiltradas.map(a => a.id));
    }
  };

  const aulasFiltradas = aulas.filter(aula => 
    aula.codigo.toLowerCase().includes(busqueda.toLowerCase()) || 
    aula.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    aula.ubicacion.toLowerCase().includes(busqueda.toLowerCase())
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
      <div style={{ width: '1200px', background: '#ececec', padding: '20px', border: '1px solid #cfcfcf' }}>
        <h1 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '25px', letterSpacing: '1px' }}>
          ADMINISTRACIÓN DE AULAS
        </h1>

        {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '25px', background: 'white' }}>
          <thead>
            <tr style={{ background: '#dfe7ef' }}>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', width: '40px' }}>
                <input 
                  type="checkbox" 
                  checked={aulasFiltradas.length > 0 && seleccionados.length === aulasFiltradas.length}
                  onChange={toggleSeleccionarTodos}
                />
              </th>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', textAlign: 'left' }}>CÓDIGO</th>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', textAlign: 'left' }}>NOMBRE</th>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', textAlign: 'center' }}>CAPACIDAD</th>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', textAlign: 'left' }}>UBICACIÓN</th>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', width: '100px', textAlign: 'left' }}>ACCIÓN</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>Cargando aulas...</td></tr>
            ) : aulasFiltradas.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>No hay aulas disponibles</td></tr>
            ) : (
              aulasFiltradas.map((aula) => (
                <tr 
                  key={aula.id} 
                  style={{ 
                    borderBottom: '1px solid #bdbdbd',
                    background: seleccionados.includes(aula.id) ? '#b8d4f0' : 'transparent'
                  }}
                >
                  <td style={{ textAlign: 'center', padding: '12px 10px' }}>
                    <input 
                      type="checkbox" 
                      checked={seleccionados.includes(aula.id)}
                      onChange={() => toggleSeleccion(aula.id)}
                    />
                  </td>
                  <td style={{ padding: '12px 10px' }}><strong>{aula.codigo}</strong></td>
                  <td style={{ padding: '12px 10px' }}>{aula.nombre}</td>
                  <td style={{ padding: '12px 10px', textAlign: 'center' }}>{aula.capacidad}</td>
                  <td style={{ padding: '12px 10px' }}>{aula.ubicacion}</td>
                  <td style={{ padding: '12px 10px' }}>
                    <button 
                      onClick={() => handleAccionNoImplementada('editar')}
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
            placeholder="Código, nombre o ubicación..." 
            style={{ padding: '8px 12px', fontFamily: 'inherit', fontSize: '14px', border: '1px solid #bdbdbd', background: 'white', width: '250px' }} 
          />
          <button style={{ background: '#2d89ef', color: 'white', border: 'none', padding: '8px 20px', fontFamily: 'inherit', fontSize: '14px', cursor: 'pointer', borderRadius: '3px' }}>
            Filtrar
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '25px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => navigate('/admin/aulas/crear')}
            style={{ minWidth: '180px', padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#28a745', color: 'white' }}
          >
            ➕ Crear nuevo
          </button>
          <button 
            onClick={() => navigate('/admin/aulas/importar')}
            style={{ minWidth: '180px', padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#2d89ef', color: 'white' }}
          >
            📎 Importar aulas
          </button>
          <button
            onClick={handleEliminar}
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

export default AulasView;
