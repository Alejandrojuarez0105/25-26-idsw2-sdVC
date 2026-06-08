import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConflictoExamen, examenesService } from '../../../services/examenes.service';

type EstadoConflicto = 'Pendiente' | 'Resuelto' | 'En revisión';

interface ConflictoLocal extends ConflictoExamen {
  estadoLocal: EstadoConflicto;
}

const ListarConflictosExamenesView: React.FC = () => {
  const navigate = useNavigate();
  const [conflictos, setConflictos] = useState<ConflictoLocal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seleccionadoId, setSeleccionadoId] = useState<number | null>(null);
  const [opcionResolucion, setOpcionResolucion] = useState('');

  const cargar = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await examenesService.findConflictos();
      const conLocal: ConflictoLocal[] = data.map(c => ({ ...c, estadoLocal: c.estado as EstadoConflicto }));
      setConflictos(conLocal);
      if (conLocal.length > 0) {
        setSeleccionadoId(conLocal[0].id);
      } else {
        setSeleccionadoId(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const seleccionado = useMemo(
    () => conflictos.find(c => c.id === seleccionadoId) || null,
    [conflictos, seleccionadoId]
  );

  const opcionesPorTipo = useMemo<string[]>(() => {
    if (!seleccionado) return [];
    switch (seleccionado.tipo) {
      case 'Profesor':
        return [
          'Reasignar profesor del primer examen',
          'Reasignar profesor del segundo examen',
          'Cambiar fecha de uno de los exámenes',
        ];
      case 'Aula':
        return [
          'Reasignar aula del primer examen',
          'Reasignar aula del segundo examen',
          'Cambiar horario de uno de los exámenes',
        ];
      case 'Estudiante':
        return [
          'Distribuir exámenes en diferentes días',
          'Ajustar horarios',
        ];
      default:
        return [];
    }
  }, [seleccionado]);

  useEffect(() => {
    setOpcionResolucion(opcionesPorTipo[0] || '');
  }, [opcionesPorTipo]);

  const colorEstado = (estado: EstadoConflicto) => {
    if (estado === 'Pendiente') return '#dc3545';
    if (estado === 'Resuelto') return '#28a745';
    return '#e6a017';
  };

  const actualizarEstado = (id: number, nuevoEstado: EstadoConflicto) => {
    setConflictos(prev => prev.map(c => (c.id === id ? { ...c, estadoLocal: nuevoEstado } : c)));
  };

  const handleAplicarSolucion = () => {
    if (!seleccionado) return;
    if (seleccionado.estadoLocal === 'Resuelto') {
      alert('⚠️ Este conflicto ya está resuelto. No se puede aplicar otra solución.');
      return;
    }
    if (!opcionResolucion) {
      alert('⚠️ Selecciona una opción de resolución.');
      return;
    }
    actualizarEstado(seleccionado.id, 'En revisión');
    alert(`🔧 Solución aplicada: ${opcionResolucion}\n\nConflicto "${seleccionado.detalle}" cambiado a estado EN REVISIÓN.`);
  };

  const handleOmitir = () => {
    if (!seleccionado) return;
    if (seleccionado.estadoLocal === 'Resuelto') {
      alert('⚠️ Este conflicto ya está resuelto. No se puede omitir.');
      return;
    }
    if (!window.confirm(`⚠️ ¿Estás seguro de que deseas omitir este conflicto?\n\n"${seleccionado.detalle}"\n\nEl conflicto se mantendrá como PENDIENTE.`)) return;
    actualizarEstado(seleccionado.id, 'Pendiente');
    alert('⏭️ Conflicto omitido. Estado cambiado a PENDIENTE.');
  };

  const handleMarcarRevisado = () => {
    if (!seleccionado) return;
    if (seleccionado.estadoLocal === 'Resuelto') {
      alert('✅ Este conflicto ya está resuelto.');
      return;
    }
    if (!window.confirm(`✅ ¿Marcar "${seleccionado.detalle}" como REVISADO y RESUELTO?`)) return;
    actualizarEstado(seleccionado.id, 'Resuelto');
    alert('✅ Conflicto marcado como RESUELTO.');
  };

  const handleVerTodos = () => {
    if (conflictos.length === 0) {
      alert('📋 No hay conflictos registrados.');
      return;
    }
    const mensaje = `📋 Total de conflictos: ${conflictos.length}\n\n` +
      conflictos.map(c => `- ${c.tipo}: ${c.detalle} (${c.estadoLocal})`).join('\n');
    alert(mensaje);
  };

  const handleExportar = () => {
    let reporte = '=== REPORTE DE CONFLICTOS DE EXÁMENES ===\n\n';
    reporte += `Fecha: ${new Date().toLocaleString()}\n`;
    reporte += `Total conflictos: ${conflictos.length}\n\n`;
    conflictos.forEach(c => {
      reporte += `[${c.tipo}] ${c.detalle}\n`;
      reporte += `  Estado: ${c.estadoLocal}\n`;
      reporte += `  Fecha: ${c.fecha} ${c.hora}\n`;
      if (c.estudiantesAfectados > 0) {
        reporte += `  Estudiantes afectados: ${c.estudiantesAfectados}\n`;
      }
      reporte += '\n';
    });
    alert(reporte);
  };

  const handleSalir = () => {
    if (window.confirm('¿Estás seguro de que deseas salir del gestor de conflictos?')) {
      navigate('/admin/examenes');
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
      <div style={{ width: '100%', maxWidth: '1200px', background: '#ececec', padding: '20px', border: '1px solid #cfcfcf' }}>
        <h1 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '10px', letterSpacing: '1px' }}>
          LISTAR CONFLICTOS DE EXÁMENES
        </h1>
        <div style={{ textAlign: 'center', fontSize: '16px', color: '#555', marginBottom: '25px' }}>
          Conflictos detectados: <strong>{conflictos.length}</strong> conflicto(s)
          <button
            onClick={cargar}
            style={{ marginLeft: '15px', background: '#2d89ef', color: 'white', border: 'none', padding: '4px 12px', fontFamily: 'inherit', fontSize: '12px', cursor: 'pointer', borderRadius: '3px' }}
          >
            🔄 Refrescar
          </button>
        </div>

        {error && (
          <div style={{ background: '#f8d7da', borderLeft: '4px solid #dc3545', color: '#721c24', padding: '10px 15px', marginBottom: '20px', fontSize: '14px' }}>
            ❌ {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {/* Panel principal */}
          <div style={{ flex: '3 1 600px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', background: 'white' }}>
              <thead>
                <tr style={{ background: '#dfe7ef' }}>
                  <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', textAlign: 'left' }}>TIPO</th>
                  <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', textAlign: 'left' }}>DETALLE</th>
                  <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', textAlign: 'left' }}>FECHA</th>
                  <th style={{ border: '1px solid #bdbdbd', padding: '12px 10px', textAlign: 'left' }}>ESTADO</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>Cargando conflictos...</td></tr>
                ) : conflictos.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: '20px', color: '#28a745', fontWeight: 'bold' }}>✅ No se han detectado conflictos en la planificación de exámenes.</td></tr>
                ) : (
                  conflictos.map(c => {
                    const sel = seleccionadoId === c.id;
                    return (
                      <tr
                        key={c.id}
                        onClick={() => setSeleccionadoId(c.id)}
                        style={{
                          cursor: 'pointer',
                          background: sel ? '#b8d4f0' : 'transparent',
                          borderLeft: sel ? '3px solid #2d89ef' : undefined,
                        }}
                      >
                        <td style={{ border: '1px solid #bdbdbd', padding: '12px 10px', fontWeight: 'bold' }}>{c.tipo}</td>
                        <td style={{ border: '1px solid #bdbdbd', padding: '12px 10px' }}>{c.detalle}</td>
                        <td style={{ border: '1px solid #bdbdbd', padding: '12px 10px' }}>{c.fecha} {c.hora}</td>
                        <td style={{ border: '1px solid #bdbdbd', padding: '12px 10px', color: colorEstado(c.estadoLocal), fontWeight: 'bold' }}>{c.estadoLocal}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {seleccionado && (
              <>
                <div style={{ background: '#f5f5f5', padding: '15px', marginBottom: '20px', borderLeft: '4px solid #2d89ef' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
                    Conflicto: {seleccionado.detalle}
                  </div>
                  <div style={{ marginLeft: '20px', marginBottom: '10px' }}>
                    {seleccionado.examenes.map((ex, idx) => (
                      <div key={ex.id} style={{ marginLeft: '5px', marginBottom: '8px', padding: '8px', background: '#e9ecef' }}>
                        <strong>Examen {idx + 1}:</strong> {ex.codigo} - {ex.asignatura} - {ex.fecha} {ex.hora} - Aula {ex.aula || 'N/A'}{ex.profesor ? ` - Prof. ${ex.profesor}` : ''}
                      </div>
                    ))}
                    {seleccionado.estudiantesAfectados > 0 && (
                      <div style={{ marginTop: '10px', fontWeight: 'bold', color: '#dc3545' }}>
                        🧑‍🎓 Estudiantes afectados: {seleccionado.estudiantesAfectados} estudiante(s)
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ background: '#e7f3ff', padding: '15px', marginBottom: '20px' }}>
                  <h4 style={{ marginBottom: '10px' }}>📌 Opciones de resolución:</h4>
                  <select
                    value={opcionResolucion}
                    onChange={(e) => setOpcionResolucion(e.target.value)}
                    style={{ width: '100%', padding: '8px', fontFamily: 'inherit', fontSize: '14px', border: '1px solid #bdbdbd', background: 'white' }}
                  >
                    {opcionesPorTipo.map(op => (
                      <option key={op} value={op}>{op}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>

          {/* Panel lateral */}
          <div style={{ flex: '1 1 220px', background: '#ededed', border: '1px solid #cfcfcf', padding: '18px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px', textDecoration: 'underline', fontWeight: 'bold' }}>⚙️ Acciones</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
              <button
                onClick={handleAplicarSolucion}
                disabled={!seleccionado}
                style={{ padding: '12px', color: 'white', border: 'none', fontFamily: 'inherit', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', background: '#2d89ef' }}
              >
                🔧 Aplicar solución
              </button>
              <button
                onClick={handleOmitir}
                disabled={!seleccionado}
                style={{ padding: '12px', color: 'white', border: 'none', fontFamily: 'inherit', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', background: '#dc3545' }}
              >
                ⏭️ Omitir conflicto
              </button>
              <button
                onClick={handleMarcarRevisado}
                disabled={!seleccionado}
                style={{ padding: '12px', color: 'white', border: 'none', fontFamily: 'inherit', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', background: '#28a745' }}
              >
                ✅ Marcar como revisado
              </button>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #cfcfcf', margin: '15px 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={handleVerTodos}
                style={{ padding: '12px', color: 'white', border: 'none', fontFamily: 'inherit', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', background: '#6c757d' }}
              >
                📋 Ver todos conflictos
              </button>
              <button
                onClick={handleExportar}
                style={{ padding: '12px', color: 'white', border: 'none', fontFamily: 'inherit', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', background: '#6c757d' }}
              >
                📎 Exportar reporte
              </button>
              <button
                onClick={handleSalir}
                style={{ padding: '12px', color: 'white', border: 'none', fontFamily: 'inherit', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', background: '#6c757d' }}
              >
                🚪 Salir
              </button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '11px', color: '#666' }}>
          Versión 1.0 · © 2026
        </div>
      </div>
    </div>
  );
};

export default ListarConflictosExamenesView;
