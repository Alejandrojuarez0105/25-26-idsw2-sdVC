import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGrados } from '../../../hooks/useGrados';
import { gradosService } from '../../../services/grados.service';

const GradosView: React.FC = () => {
  const { grados, loading, error, refresh } = useGrados();
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
    if (seleccionados.length === gradosFiltrados.length) {
      setSeleccionados([]);
    } else {
      setSeleccionados(gradosFiltrados.map(g => g.id));
    }
  };

  const handleEliminar = () => {
    if (seleccionados.length === 0) {
      alert('⚠️ No hay ningún grado seleccionado para eliminar.');
      return;
    }
    const degreesToDelete = grados.filter(g => seleccionados.includes(g.id));
    navigate('/admin/grados/eliminar', { state: { degrees: degreesToDelete } });
  };

  const gradosFiltrados = grados.filter(grado => 
    grado.codigo.toLowerCase().includes(busqueda.toLowerCase()) || 
    grado.nombre.toLowerCase().includes(busqueda.toLowerCase())
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
          ADMINISTRACIÓN DE GRADOS ACADÉMICOS
        </h1>

        {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '25px', background: 'white' }}>
          <thead>
            <tr style={{ background: '#dfe7ef' }}>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', width: '40px' }}>
                <input 
                  type="checkbox" 
                  checked={gradosFiltrados.length > 0 && seleccionados.length === gradosFiltrados.length}
                  onChange={toggleSeleccionarTodos}
                />
              </th>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', textAlign: 'left' }}>CÓDIGO</th>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', textAlign: 'left' }}>NOMBRE</th>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', textAlign: 'left' }}>DESCRIPCIÓN</th>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', width: '100px', textAlign: 'left' }}>ACCIÓN</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>Cargando grados...</td></tr>
            ) : gradosFiltrados.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>No hay grados disponibles</td></tr>
            ) : (
              gradosFiltrados.map((grado) => (
                <tr 
                  key={grado.id} 
                  style={{ 
                    borderBottom: '1px solid #bdbdbd',
                    background: seleccionados.includes(grado.id) ? '#b8d4f0' : 'transparent'
                  }}
                >
                  <td style={{ textAlign: 'center', padding: '12px 10px' }}>
                    <input 
                      type="checkbox" 
                      checked={seleccionados.includes(grado.id)}
                      onChange={() => toggleSeleccion(grado.id)}
                    />
                  </td>
                  <td style={{ padding: '12px 10px' }}><strong>{grado.codigo}</strong></td>
                  <td style={{ padding: '12px 10px' }}>{grado.nombre}</td>
                  <td style={{ padding: '12px 10px' }}>{grado.descripcion || '-'}</td>
                  <td style={{ padding: '12px 10px' }}>
                    <button 
                      onClick={() => handleAccionNoImplementada('Editar')}
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
            onClick={() => navigate('/admin/grados/crear')}
            style={{ minWidth: '160px', padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#28a745', color: 'white' }}
          >
            ➕ Crear nuevo
          </button>
          <button 
            onClick={() => navigate('/admin/grados/importar')}
            style={{ minWidth: '160px', padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#2d89ef', color: 'white' }}
          >
            📎 Importar grados
          </button>
          <button 
            onClick={handleEliminar}
            style={{ minWidth: '160px', padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#dc3545', color: 'white' }}
          >
            🗑️ Eliminar seleccionado
          </button>
          <button 
            onClick={handleSalir}
            style={{ minWidth: '160px', padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#f3f0ec', color: 'black' }}
          >
            🚪 Salir
          </button>
        </div>
      </div>
    </div>
  );
};

export default GradosView;
