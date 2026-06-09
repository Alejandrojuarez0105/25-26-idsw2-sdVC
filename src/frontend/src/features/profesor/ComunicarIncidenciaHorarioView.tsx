import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarioProfesorExamen,
  IncidenciaHorario,
  profesorService,
} from '../../services/profesor.service';

type Estado = 'loading' | 'error' | 'ready';

const DESC_MIN = 10;
const DESC_MAX = 500;

const ComunicarIncidenciaHorarioView: React.FC = () => {
  const navigate = useNavigate();
  const [estado, setEstado] = useState<Estado>('loading');
  const [error, setError] = useState<string | null>(null);

  const [examenes, setExamenes] = useState<CalendarioProfesorExamen[]>([]);
  const [incidencias, setIncidencias] = useState<IncidenciaHorario[]>([]);

  // Formulario
  const [examenId, setExamenId] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);

  const cargar = async () => {
    setEstado('loading');
    setError(null);
    try {
      const [calendario, lista] = await Promise.all([
        profesorService.consultarCalendario(),
        profesorService.listarIncidencias(),
      ]);
      setExamenes(calendario.examenes);
      setIncidencias(lista);
      setEstado('ready');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al cargar los datos de incidencias');
      setEstado('error');
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const formatearFecha = (fechaStr: string) => {
    const partes = fechaStr.split('-');
    if (partes.length === 3) return `${partes[2]}/${partes[1]}/${partes[0]}`;
    return fechaStr;
  };

  const examenSeleccionado = examenes.find((e) => e.id === examenId) || null;
  const descTrim = descripcion.trim();
  const descValida = descTrim.length >= DESC_MIN && descTrim.length <= DESC_MAX;
  const formularioValido = !!examenId && descValida;

  const handleEnviar = async () => {
    if (!formularioValido || enviando) return;
    setEnviando(true);
    setErrorEnvio(null);
    try {
      const nueva = await profesorService.crearIncidencia({ examenId, descripcion: descTrim });
      setIncidencias((prev) => [nueva, ...prev]);
      setExito(true);
      setExamenId('');
      setDescripcion('');
    } catch (err: any) {
      setErrorEnvio(err.response?.data?.message || err.message || 'No se pudo registrar la incidencia');
    } finally {
      setEnviando(false);
    }
  };

  const estadoColor = (e: string) =>
    e === 'RESUELTA' ? '#28a745' : e === 'REVISADA' ? '#2d89ef' : '#e6a017';

  const badge = (texto: string, color: string) => (
    <span style={{ color, fontWeight: 'bold', fontSize: '12px' }}>{texto}</span>
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
      <div style={{ width: '100%', maxWidth: '900px', background: '#ececec', padding: '20px', border: '1px solid #cfcfcf' }}>
        <h1 style={{ textAlign: 'center', fontSize: '26px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '10px', letterSpacing: '1px' }}>
          COMUNICAR INCIDENCIA DE HORARIO
        </h1>
        <p style={{ textAlign: 'center', fontSize: '13px', color: '#555', marginBottom: '20px' }}>
          Reporte conflictos sobre sus exámenes: solapamientos, errores de asignación, aula incorrecta, imposibilidad de asistencia, etc.
        </p>

        {/* LOADING */}
        {estado === 'loading' && (
          <div style={{ textAlign: 'center', padding: '50px 20px' }}>
            <div style={{
              display: 'inline-block', width: '50px', height: '50px',
              border: '4px solid #e0e0e0', borderTop: '4px solid #2d89ef',
              borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '20px'
            }} />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <h2 style={{ fontSize: '18px', color: '#2d89ef' }}>Cargando...</h2>
          </div>
        )}

        {/* ERROR de carga */}
        {estado === 'error' && (
          <div style={{ padding: '20px' }}>
            <div style={{ background: '#f8d7da', border: '2px solid #dc3545', padding: '18px', marginBottom: '25px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#721c24' }}>❌ No se pudieron cargar los datos</div>
              <p style={{ marginTop: '10px', color: '#721c24' }}>{error}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <button onClick={cargar} style={{ minWidth: '180px', padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#2d89ef', color: 'white', marginRight: '15px' }}>
                🔄 Reintentar
              </button>
              <button onClick={() => navigate('/profesor')} style={{ minWidth: '180px', padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#f3f0ec', color: 'black' }}>
                🚪 Volver al panel
              </button>
            </div>
          </div>
        )}

        {/* READY */}
        {estado === 'ready' && (
          <>
            {/* Confirmación de envío */}
            {exito && (
              <div style={{ background: '#d4edda', border: '2px solid #28a745', padding: '15px', marginBottom: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#155724' }}>✅ Incidencia registrada correctamente</div>
                <p style={{ marginTop: '8px', fontSize: '13px', color: '#155724' }}>
                  Su incidencia ha sido enviada y queda <strong>pendiente</strong> de revisión administrativa.
                </p>
                <button onClick={() => setExito(false)} style={{ marginTop: '10px', padding: '6px 16px', borderRadius: '4px', fontFamily: 'inherit', fontSize: '13px', cursor: 'pointer', border: '1px solid #1e7e34', background: '#28a745', color: 'white', fontWeight: 'bold' }}>
                  Comunicar otra incidencia
                </button>
              </div>
            )}

            {/* Sin exámenes asignados */}
            {examenes.length === 0 ? (
              <div style={{ background: '#fff3cd', border: '2px solid #ffc107', padding: '20px', marginBottom: '20px', textAlign: 'center', color: '#856404' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>📭 No tiene exámenes asignados</div>
                <p style={{ marginTop: '8px', fontSize: '13px' }}>
                  Solo puede comunicar incidencias sobre exámenes asignados a su perfil.
                </p>
              </div>
            ) : (
              !exito && (
                <div style={{ background: '#ededed', border: '1px solid #cfcfcf', padding: '18px', marginBottom: '25px' }}>
                  {/* Selección de examen */}
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', marginBottom: '6px' }}>
                      Examen afectado <span style={{ color: '#dc3545' }}>*</span>
                    </label>
                    <select
                      value={examenId}
                      onChange={(e) => setExamenId(e.target.value)}
                      style={{ width: '100%', padding: '10px', fontFamily: 'inherit', fontSize: '14px', border: '1px solid #bdbdbd', background: 'white' }}
                    >
                      <option value="">— Seleccione un examen —</option>
                      {examenes.map((ex) => (
                        <option key={ex.id} value={ex.id}>
                          {ex.asignatura} ({ex.codigo}) · {formatearFecha(ex.fecha)} {ex.hora} · {ex.aula || 'sin aula'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Detalle del examen seleccionado */}
                  {examenSeleccionado && (
                    <div style={{ background: '#dfe7ef', border: '1px solid #7ea0c0', padding: '12px 15px', marginBottom: '18px', fontSize: '13px' }}>
                      <strong>📌 Detalle:</strong> {examenSeleccionado.asignatura} · {formatearFecha(examenSeleccionado.fecha)} a las {examenSeleccionado.hora}
                      {' · Aula: '}{examenSeleccionado.aula || '(sin aula)'}
                      {examenSeleccionado.tieneConflicto && (
                        <div style={{ marginTop: '6px', color: '#dc3545', fontWeight: 'bold' }}>
                          ⚠️ Conflicto detectado: {examenSeleccionado.tiposConflicto.join(', ')}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Descripción */}
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', marginBottom: '6px' }}>
                      Descripción de la incidencia <span style={{ color: '#dc3545' }}>*</span>
                    </label>
                    <textarea
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      rows={4}
                      maxLength={DESC_MAX}
                      placeholder="Describa el problema (mínimo 10 caracteres): p. ej. solapamiento con otro examen, aula no disponible, etc."
                      style={{ width: '100%', padding: '10px', fontFamily: 'inherit', fontSize: '14px', border: '1px solid #bdbdbd', resize: 'vertical', boxSizing: 'border-box' }}
                    />
                    <div style={{ fontSize: '12px', color: descValida || descTrim.length === 0 ? '#666' : '#dc3545', textAlign: 'right' }}>
                      {descTrim.length}/{DESC_MAX} {descTrim.length > 0 && descTrim.length < DESC_MIN ? `(mínimo ${DESC_MIN})` : ''}
                    </div>
                  </div>

                  {errorEnvio && (
                    <div style={{ background: '#f8d7da', border: '1px solid #dc3545', color: '#721c24', padding: '10px', marginBottom: '12px', fontSize: '13px' }}>
                      ❌ {errorEnvio}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px', flexWrap: 'wrap' }}>
                    <button
                      onClick={handleEnviar}
                      disabled={!formularioValido || enviando}
                      style={{
                        minWidth: '200px', padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit',
                        cursor: !formularioValido || enviando ? 'not-allowed' : 'pointer',
                        border: '1px solid #1d5faa', fontWeight: 'bold',
                        background: !formularioValido || enviando ? '#9bc0ee' : '#2d89ef', color: 'white'
                      }}
                    >
                      {enviando ? 'Enviando...' : '📨 Enviar incidencia'}
                    </button>
                    <button onClick={() => navigate('/profesor')} disabled={enviando} style={{ minWidth: '160px', padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#f3f0ec', color: 'black' }}>
                      ❌ Cancelar
                    </button>
                  </div>
                </div>
              )
            )}

            {/* Listado de incidencias previas */}
            <div style={{ border: '1px solid #cfcfcf', background: '#ededed', padding: '18px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', textDecoration: 'underline', fontWeight: 'bold' }}>
                📋 Mis incidencias comunicadas ({incidencias.length})
              </h3>
              {incidencias.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#666' }}>Aún no ha comunicado ninguna incidencia.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#dfe7ef' }}>
                      <th style={{ border: '1px solid #bdbdbd', padding: '8px', textAlign: 'left' }}>EXAMEN</th>
                      <th style={{ border: '1px solid #bdbdbd', padding: '8px', textAlign: 'left' }}>DESCRIPCIÓN</th>
                      <th style={{ border: '1px solid #bdbdbd', padding: '8px', textAlign: 'center' }}>ESTADO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incidencias.map((inc) => (
                      <tr key={inc.id} style={{ borderBottom: '1px solid #bdbdbd' }}>
                        <td style={{ padding: '8px' }}>
                          {inc.examen ? <><strong>{inc.examen.asignatura}</strong> <span style={{ color: '#888' }}>({inc.examen.codigo})</span><br /><span style={{ fontSize: '11px', color: '#666' }}>{formatearFecha(inc.examen.fecha)} {inc.examen.hora}</span></> : <span style={{ color: '#888' }}>—</span>}
                        </td>
                        <td style={{ padding: '8px' }}>{inc.descripcion}</td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>{badge(inc.estado, estadoColor(inc.estado))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button onClick={() => navigate('/profesor/calendario')} style={{ minWidth: '180px', padding: '10px 18px', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#dfe7ef', color: 'black', marginRight: '12px' }}>
                📅 Ver mi calendario
              </button>
              <button onClick={() => navigate('/profesor')} style={{ minWidth: '160px', padding: '10px 18px', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#f3f0ec', color: 'black' }}>
                🚪 Volver al panel
              </button>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '11px', color: '#666' }}>
              Versión 1.0 · © 2026
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ComunicarIncidenciaHorarioView;
