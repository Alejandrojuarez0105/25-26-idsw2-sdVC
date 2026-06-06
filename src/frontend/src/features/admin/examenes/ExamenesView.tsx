import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExamenes } from '../../../hooks/useExamenes';

const ExamenesView: React.FC = () => {
  const { examenes, loading, error } = useExamenes();
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
    if (seleccionados.length === examenesFiltrados.length) {
      setSeleccionados([]);
    } else {
      setSeleccionados(examenesFiltrados.map(e => e.id));
    }
  };

  const handleEliminar = () => {
    if (seleccionados.length === 0) {
      alert('⚠️ No hay ningún examen seleccionado para eliminar.');
      return;
    }
    const examsToDelete = examenes.filter(e => seleccionados.includes(e.id));
    navigate('/admin/examenes/eliminar', { state: { exams: examsToDelete } });
  };

  const examenesFiltrados = examenes.filter(examen => 
    examen.codigo.toLowerCase().includes(busqueda.toLowerCase()) || 
    examen.asignatura.toLowerCase().includes(busqueda.toLowerCase()) ||
    examen.profesor.toLowerCase().includes(busqueda.toLowerCase())
  );

  const formatearFecha = (fechaStr: string) => {
    try {
      const date = new Date(fechaStr);
      // Prisma Date fields can be tricky with timezones, 
      // but for display in a simple table we use UTC parts if it's just a date
      const day = String(date.getUTCDate()).padStart(2, '0');
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const year = date.getUTCFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      return fechaStr;
    }
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
          ADMINISTRACIÓN DE EXÁMENES
        </h1>

        {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '25px', background: 'white' }}>
          <thead>
            <tr style={{ background: '#dfe7ef' }}>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', width: '40px' }}>
                <input 
                  type="checkbox" 
                  checked={examenesFiltrados.length > 0 && seleccionados.length === examenesFiltrados.length}
                  onChange={toggleSeleccionarTodos}
                />
              </th>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', textAlign: 'left' }}>CÓDIGO</th>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', textAlign: 'left' }}>ASIGNATURA</th>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', textAlign: 'left' }}>FECHA</th>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', textAlign: 'left' }}>HORA</th>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', textAlign: 'left' }}>AULA</th>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', textAlign: 'left' }}>PROFESOR</th>
              <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', width: '100px', textAlign: 'left' }}>ACCIÓN</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>Cargando exámenes...</td></tr>
            ) : examenesFiltrados.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>No hay exámenes disponibles</td></tr>
            ) : (
              examenesFiltrados.map((examen) => (
                <tr 
                  key={examen.id} 
                  style={{ 
                    borderBottom: '1px solid #bdbdbd',
                    background: seleccionados.includes(examen.id) ? '#b8d4f0' : 'transparent'
                  }}
                >
                  <td style={{ textAlign: 'center', padding: '12px 10px' }}>
                    <input 
                      type="checkbox" 
                      checked={seleccionados.includes(examen.id)}
                      onChange={() => toggleSeleccion(examen.id)}
                    />
                  </td>
                  <td style={{ padding: '12px 10px' }}><strong>{examen.codigo}</strong></td>
                  <td style={{ padding: '12px 10px' }}>{examen.asignatura}</td>
                  <td style={{ padding: '12px 10px' }}>{formatearFecha(examen.fecha)}</td>
                  <td style={{ padding: '12px 10px' }}>{examen.hora}</td>
                  <td style={{ padding: '12px 10px' }}>{examen.aula}</td>
                  <td style={{ padding: '12px 10px' }}>{examen.profesor}</td>
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
            placeholder="Código, asignatura o profesor..." 
            style={{ padding: '8px 12px', fontFamily: 'inherit', fontSize: '14px', border: '1px solid #bdbdbd', background: 'white', width: '250px' }} 
          />
          <button style={{ background: '#2d89ef', color: 'white', border: 'none', padding: '8px 20px', fontFamily: 'inherit', fontSize: '14px', cursor: 'pointer', borderRadius: '3px' }}>
            Filtrar
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '25px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => handleAccionNoImplementada('Crear nuevo')}
            style={{ minWidth: '180px', padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#28a745', color: 'white' }}
          >
            ➕ Crear nuevo
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

export default ExamenesView;
