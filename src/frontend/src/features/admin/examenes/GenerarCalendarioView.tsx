import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarioGenerado, examenesService } from '../../../services/examenes.service';

type Estado = 'idle' | 'loading' | 'success' | 'error';

const GenerarCalendarioView: React.FC = () => {
  const navigate = useNavigate();
  const [estado, setEstado] = useState<Estado>('idle');
  const [data, setData] = useState<CalendarioGenerado | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generar = async () => {
    setEstado('loading');
    setError(null);
    try {
      const resultado = await examenesService.generarCalendario();
      setData(resultado);
      setEstado('success');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error desconocido al generar el calendario');
      setEstado('error');
    }
  };

  const handleSalir = () => {
    navigate('/admin/examenes');
  };

  const formatearFecha = (fechaStr: string) => {
    const partes = fechaStr.split('-');
    if (partes.length === 3) return `${partes[2]}/${partes[1]}/${partes[0]}`;
    return fechaStr;
  };

  const colorConflicto = (tipos: string[]) => {
    if (tipos.includes('Estudiante')) return '#dc3545';
    if (tipos.includes('Profesor')) return '#e6a017';
    if (tipos.includes('Aula')) return '#e6a017';
    return '#28a745';
  };

  const tarjetaDato = (label: string, valor: number) => (
    <div style={{ background: 'white', border: '1px solid #cfcfcf', padding: '12px', textAlign: 'center' }}>
      <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#2d89ef' }}>{valor}</div>
      <div style={{ fontSize: '13px', color: '#555' }}>{label}</div>
    </div>
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
      <div style={{ width: '100%', maxWidth: '1200px', background: '#ececec', padding: '20px', border: '1px solid #cfcfcf' }}>
        <h1 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '10px', letterSpacing: '1px' }}>
          GENERAR CALENDARIO DE EXÁMENES
        </h1>
        <div style={{ textAlign: 'center', fontSize: '15px', color: '#555', marginBottom: '25px' }}>
          Genera el calendario oficial consolidando los exámenes, profesores y aulas registrados en el sistema.
        </div>

        {/* Estado IDLE */}
        {estado === 'idle' && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>📅</div>
            <p style={{ fontSize: '16px', color: '#333', marginBottom: '30px' }}>
              Pulsa el botón para generar el calendario a partir de los datos actuales del sistema.
            </p>
            <button
              onClick={generar}
              style={{ minWidth: '220px', padding: '14px 25px', borderRadius: '4px', fontSize: '18px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #1e7e34', fontWeight: 'bold', background: '#28a745', color: 'white' }}
            >
              📅 Generar Calendario
            </button>
          </div>
        )}

        {/* Estado LOADING */}
        {estado === 'loading' && (
          <div style={{ textAlign: 'center', padding: '50px 20px' }}>
            <div style={{
              display: 'inline-block', width: '50px', height: '50px',
              border: '4px solid #e0e0e0', borderTop: '4px solid #2d89ef',
              borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '20px'
            }} />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <h2 style={{ fontSize: '22px', color: '#2d89ef' }}>Generación en progreso...</h2>
            <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
              Consolidando exámenes, validando conflictos y ordenando cronológicamente.
            </p>
          </div>
        )}

        {/* Estado ERROR */}
        {estado === 'error' && (
          <div style={{ padding: '20px' }}>
            <div style={{ background: '#f8d7da', border: '2px solid #dc3545', padding: '18px', marginBottom: '25px', textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#721c24' }}>
                ❌ No se pudo generar el calendario
              </div>
              <p style={{ marginTop: '10px', color: '#721c24' }}>{error}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={generar}
                style={{ minWidth: '180px', padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#2d89ef', color: 'white', marginRight: '15px' }}
              >
                🔄 Reintentar
              </button>
              <button
                onClick={handleSalir}
                style={{ minWidth: '180px', padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#f3f0ec', color: 'black' }}
              >
                🚪 Salir
              </button>
            </div>
          </div>
        )}

        {/* Estado SUCCESS */}
        {estado === 'success' && data && (
          <>
            <div style={{ background: '#d4edda', borderLeft: '4px solid #28a745', color: '#155724', padding: '12px 15px', marginBottom: '20px', fontWeight: 'bold' }}>
              ✅ ¡Calendario generado exitosamente! ({data.resumen.totalExamenes} examen(es) consolidado(s))
            </div>

            {/* Datos procesados */}
            <h3 style={{ fontSize: '18px', marginBottom: '12px', textDecoration: 'underline' }}>📊 Datos procesados</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '25px' }}>
              {tarjetaDato('Grados', data.datosProcesados.grados)}
              {tarjetaDato('Asignaturas', data.datosProcesados.asignaturas)}
              {tarjetaDato('Profesores', data.datosProcesados.profesores)}
              {tarjetaDato('Aulas', data.datosProcesados.aulas)}
              {tarjetaDato('Estudiantes', data.datosProcesados.estudiantes)}
            </div>

            {/* Resumen de la generación */}
            <h3 style={{ fontSize: '18px', marginBottom: '12px', textDecoration: 'underline' }}>📈 Resumen de la generación</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '25px' }}>
              {tarjetaDato('Total exámenes', data.resumen.totalExamenes)}
              {tarjetaDato('Con profesor', data.resumen.conProfesor)}
              {tarjetaDato('Con aula', data.resumen.conAula)}
              <div style={{ background: 'white', border: '1px solid #cfcfcf', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: data.resumen.totalConflictos > 0 ? '#dc3545' : '#28a745' }}>
                  {data.resumen.totalConflictos}
                </div>
                <div style={{ fontSize: '13px', color: '#555' }}>Conflictos</div>
              </div>
            </div>

            {data.resumen.totalConflictos > 0 && (
              <div style={{ background: '#fff3cd', borderLeft: '4px solid #ffc107', color: '#856404', padding: '12px 15px', marginBottom: '20px', fontSize: '14px' }}>
                ⚠️ Se detectaron <strong>{data.resumen.totalConflictos}</strong> conflicto(s) en la planificación. Revísalos en{' '}
                <button
                  onClick={() => navigate('/admin/examenes/conflictos')}
                  style={{ background: 'none', border: 'none', color: '#2d89ef', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', textDecoration: 'underline', padding: 0 }}
                >
                  Ver conflictos →
                </button>
              </div>
            )}

            {/* Calendario consolidado */}
            <h3 style={{ fontSize: '18px', marginBottom: '12px', textDecoration: 'underline' }}>🗓️ Calendario consolidado</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '25px', background: 'white' }}>
              <thead>
                <tr style={{ background: '#dfe7ef' }}>
                  <th style={{ border: '1px solid #bdbdbd', padding: '10px', textAlign: 'left' }}>FECHA</th>
                  <th style={{ border: '1px solid #bdbdbd', padding: '10px', textAlign: 'left' }}>HORA</th>
                  <th style={{ border: '1px solid #bdbdbd', padding: '10px', textAlign: 'left' }}>ASIGNATURA</th>
                  <th style={{ border: '1px solid #bdbdbd', padding: '10px', textAlign: 'left' }}>PROFESOR</th>
                  <th style={{ border: '1px solid #bdbdbd', padding: '10px', textAlign: 'left' }}>AULA</th>
                  <th style={{ border: '1px solid #bdbdbd', padding: '10px', textAlign: 'center' }}>ESTADO</th>
                </tr>
              </thead>
              <tbody>
                {data.examenes.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>No hay exámenes registrados para generar el calendario.</td></tr>
                ) : (
                  data.examenes.map((ex) => (
                    <tr key={ex.id} style={{ borderBottom: '1px solid #bdbdbd', background: ex.tieneConflicto ? '#fdecea' : 'transparent' }}>
                      <td style={{ padding: '10px' }}>{formatearFecha(ex.fecha)}</td>
                      <td style={{ padding: '10px' }}>{ex.hora}</td>
                      <td style={{ padding: '10px' }}><strong>{ex.asignatura}</strong> <span style={{ color: '#888' }}>({ex.codigo})</span></td>
                      <td style={{ padding: '10px' }}>{ex.profesor || <span style={{ color: '#dc3545', fontStyle: 'italic' }}>(sin profesor)</span>}</td>
                      <td style={{ padding: '10px' }}>{ex.aula || <span style={{ color: '#dc3545', fontStyle: 'italic' }}>(sin aula)</span>}</td>
                      <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: colorConflicto(ex.tiposConflicto) }}>
                        {ex.tieneConflicto ? `⚠️ ${ex.tiposConflicto.join(', ')}` : '✅ OK'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '25px', flexWrap: 'wrap' }}>
              <button
                onClick={generar}
                style={{ minWidth: '180px', padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#2d89ef', color: 'white' }}
              >
                🔄 Regenerar
              </button>
              <button
                onClick={() => navigate('/admin/examenes/conflictos')}
                style={{ minWidth: '180px', padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#e6a017', color: 'white' }}
              >
                ⚠️ Ver conflictos
              </button>
              <button
                onClick={handleSalir}
                style={{ minWidth: '180px', padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#f3f0ec', color: 'black' }}
              >
                🚪 Salir
              </button>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '11px', color: '#666' }}>
              Generado el {new Date(data.generadoEn).toLocaleString()} · Versión 1.0 · © 2026
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GenerarCalendarioView;
