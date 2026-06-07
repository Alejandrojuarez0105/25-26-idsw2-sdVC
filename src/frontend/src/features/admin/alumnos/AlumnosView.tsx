import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlumnos } from '../../../hooks/useAlumnos';

const AlumnosView: React.FC = () => {
  const { alumnos, loading, error } = useAlumnos();
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [seleccionados, setSeleccionados] = useState<string[]>([]);

  const handleSalir = () => {
    navigate('/admin');
  };

  const handleEliminar = () => {
    if (seleccionados.length === 0) {
      alert('⚠️ Seleccione al menos un alumno para eliminar.');
      return;
    }
    const alumnosSeleccionados = alumnos.filter(a => seleccionados.includes(a.id));
    navigate('/admin/alumnos/eliminar', { state: { alumnos: alumnosSeleccionados } });
  };

  const handleImportar = () => {
    navigate('/admin/alumnos/importar');
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
    if (seleccionados.length === alumnosFiltrados.length) {
      setSeleccionados([]);
    } else {
      setSeleccionados(alumnosFiltrados.map(a => a.id));
    }
  };

  const alumnosFiltrados = alumnos.filter(alumno => {
    const nombreCompleto = `${alumno.usuario?.nombre || ''} ${alumno.usuario?.apellido || ''}`.toLowerCase();
    const matricula = (alumno.matricula || '').toLowerCase();
    const email = (alumno.usuario?.email || '').toLowerCase();
    const query = busqueda.toLowerCase();

    return nombreCompleto.includes(query) || matricula.includes(query) || email.includes(query);
  });

  // Helper function to mock course for display consistency with the prototype
  const getCurso = (matricula: string) => {
    // Generate a course ('1°', '2°', '3°', '4°') based on the last digit of the matricula or length
    const digits = matricula.replace(/\D/g, '');
    if (digits.length > 0) {
      const lastDigit = parseInt(digits.slice(-1));
      return `${(lastDigit % 4) + 1}°`;
    }
    return '1°';
  };

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
          ADMINISTRACIÓN DE ALUMNOS
        </h1>

        {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '25px', background: 'white' }}>
          <thead>
            <tr style={{ background: '#dfe7ef' }}>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', width: '40px' }}>
                <input 
                  type="checkbox" 
                  checked={alumnosFiltrados.length > 0 && seleccionados.length === alumnosFiltrados.length}
                  onChange={toggleSeleccionarTodos}
                />
              </th>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', textAlign: 'left' }}>MATRÍCULA</th>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', textAlign: 'left' }}>NOMBRE</th>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', textAlign: 'left' }}>EMAIL</th>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', textAlign: 'left' }}>GRADO</th>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', textAlign: 'center', width: '80px' }}>CURSO</th>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', width: '100px', textAlign: 'left' }}>ACCIÓN</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>Cargando alumnos...</td></tr>
            ) : alumnosFiltrados.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>No hay alumnos disponibles</td></tr>
            ) : (
              alumnosFiltrados.map((alumno) => (
                <tr 
                  key={alumno.id} 
                  style={{ 
                    borderBottom: '1px solid #bdbdbd',
                    background: seleccionados.includes(alumno.id) ? '#b8d4f0' : 'transparent'
                  }}
                >
                  <td style={{ textAlign: 'center', padding: '12px 10px' }}>
                    <input 
                      type="checkbox" 
                      checked={seleccionados.includes(alumno.id)}
                      onChange={() => toggleSeleccion(alumno.id)}
                    />
                  </td>
                  <td style={{ padding: '12px 10px' }}><strong>{alumno.matricula}</strong></td>
                  <td style={{ padding: '12px 10px' }}>{`${alumno.usuario?.nombre || ''} ${alumno.usuario?.apellido || ''}`}</td>
                  <td style={{ padding: '12px 10px' }}>{alumno.usuario?.email}</td>
                  <td style={{ padding: '12px 10px' }}>{alumno.grado?.codigo || 'N/A'}</td>
                  <td style={{ padding: '12px 10px', textAlign: 'center' }}>{alumno.curso || getCurso(alumno.matricula)}</td>
                  <td style={{ padding: '12px 10px' }}>
                    <button 
                      onClick={() => navigate(`/admin/alumnos/editar/${alumno.id}`)}
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
            placeholder="Matrícula, nombre o email..." 
            style={{ padding: '8px 12px', fontFamily: 'inherit', fontSize: '14px', border: '1px solid #bdbdbd', background: 'white', width: '250px' }} 
          />
          <button style={{ background: '#2d89ef', color: 'white', border: 'none', padding: '8px 20px', fontFamily: 'inherit', fontSize: '14px', cursor: 'pointer', borderRadius: '3px' }}>
            Filtrar
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '25px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => navigate('/admin/alumnos/crear')}
            style={{ minWidth: '180px', padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#28a745', color: 'white' }}
          >
            ➕ Crear nuevo
          </button>
          <button 
            onClick={handleImportar}
            style={{ minWidth: '180px', padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#2d89ef', color: 'white' }}
          >
            📎 Importar alumnos
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

export default AlumnosView;
