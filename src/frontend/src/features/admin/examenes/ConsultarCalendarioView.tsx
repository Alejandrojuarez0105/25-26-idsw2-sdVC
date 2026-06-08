import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarioConsulta, examenesService } from '../../../services/examenes.service';

type Estado = 'loading' | 'error' | 'success';

const ConsultarCalendarioView: React.FC = () => {
  const navigate = useNavigate();
  const [estado, setEstado] = useState<Estado>('loading');
  const [data, setData] = useState<CalendarioConsulta | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Modal de descarga
  const [modalAbierto, setModalAbierto] = useState(false);
  const [incluirAula, setIncluirAula] = useState(true);
  const [incluirProfesor, setIncluirProfesor] = useState(true);
  const [incluirEstudiantes, setIncluirEstudiantes] = useState(true);
  const [periodoPersonalizado, setPeriodoPersonalizado] = useState(false);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [descargando, setDescargando] = useState(false);

  const cargar = async () => {
    setEstado('loading');
    setError(null);
    try {
      const resultado = await examenesService.consultarCalendario();
      setData(resultado);
      setEstado('success');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error desconocido al consultar el calendario');
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

  const colorConflicto = (tipos: string[]) => {
    if (tipos.includes('Estudiante')) return '#dc3545';
    if (tipos.length > 0) return '#e6a017';
    return '#28a745';
  };

  const handleCerrar = () => {
    navigate('/admin');
  };

  const handleDescargar = async () => {
    if (periodoPersonalizado && fechaDesde && fechaHasta && fechaDesde > fechaHasta) {
      alert('⚠️ La fecha inicial debe ser menor o igual a la fecha final.');
      return;
    }
    setDescargando(true);
    try {
      const blob = await examenesService.descargarCalendario({
        incluirAula,
        incluirProfesor,
        incluirEstudiantes,
        fechaInicio: periodoPersonalizado ? fechaDesde || undefined : undefined,
        fechaFin: periodoPersonalizado ? fechaHasta || undefined : undefined,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'calendario-examenes.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setModalAbierto(false);
    } catch (err: any) {
      alert(`❌ ${err.response?.data?.message || err.message || 'Error al descargar el calendario'}`);
    } finally {
      setDescargando(false);
    }
  };

  const resumenItem = (label: string, valor: number) => (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '5px' }}>{label}</div>
      <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#2d89ef' }}>{valor}</div>
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
          CONSULTAR CALENDARIO DE EXÁMENES
        </h1>

        {/* LOADING */}
        {estado === 'loading' && (
          <div style={{ textAlign: 'center', padding: '50px 20px' }}>
            <div style={{
              display: 'inline-block', width: '50px', height: '50px',
              border: '4px solid #e0e0e0', borderTop: '4px solid #2d89ef',
              borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '20px'
            }} />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <h2 style={{ fontSize: '20px', color: '#2d89ef' }}>Cargando calendario...</h2>
          </div>
        )}

        {/* ERROR técnico */}
        {estado === 'error' && (
          <div style={{ padding: '20px' }}>
            <div style={{ background: '#f8d7da', border: '2px solid #dc3545', padding: '18px', marginBottom: '25px', textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#721c24' }}>❌ No se pudo cargar el calendario</div>
              <p style={{ marginTop: '10px', color: '#721c24' }}>{error}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <button onClick={cargar} style={{ minWidth: '180px', padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#2d89ef', color: 'white', marginRight: '15px' }}>
                🔄 Reintentar
              </button>
              <button onClick={handleCerrar} style={{ minWidth: '180px', padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#f3f0ec', color: 'black' }}>
                🚪 Cerrar
              </button>
            </div>
          </div>
        )}

        {/* SUCCESS pero SIN exámenes → calendario no disponible */}
        {estado === 'success' && data && data.examenes.length === 0 && (
          <div style={{ padding: '10px' }}>
            <div style={{ background: '#f8d7da', border: '2px solid #dc3545', padding: '25px', marginBottom: '28px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#721c24' }}>
                ❌ CALENDARIO NO DISPONIBLE ❌
              </div>
              <p style={{ marginTop: '15px', fontSize: '14px', color: '#721c24' }}>
                No hay exámenes registrados para mostrar en el calendario.
              </p>
            </div>
            <div style={{ background: '#ededed', border: '1px solid #cfcfcf', padding: '18px', marginBottom: '28px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', textDecoration: 'underline' }}>📌 ¿Cómo generar el calendario?</h3>
              <ul style={{ marginLeft: '25px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <li>Registre exámenes en el módulo de Exámenes.</li>
                <li>Asigne profesor y aula a cada examen.</li>
                <li>Ejecute <strong>Generar calendario</strong> para consolidar la planificación.</li>
              </ul>
            </div>
            <div style={{ textAlign: 'center' }}>
              <button onClick={() => navigate('/admin/examenes/calendario')} style={{ minWidth: '200px', padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #1e7e34', fontWeight: 'bold', background: '#28a745', color: 'white', marginRight: '15px' }}>
                📅 Ir a Generar calendario
              </button>
              <button onClick={handleCerrar} style={{ minWidth: '180px', padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#f3f0ec', color: 'black' }}>
                🚪 Cerrar
              </button>
            </div>
          </div>
        )}

        {/* SUCCESS con exámenes */}
        {estado === 'success' && data && data.examenes.length > 0 && (
          <>
            <div style={{ textAlign: 'center', fontSize: '15px', color: '#555', marginBottom: '20px' }}>
              Calendario consultado: <strong>{new Date(data.generadoEn).toLocaleString()}</strong>
            </div>

            {data.conflictos.length > 0 && (
              <div style={{ background: '#fff3cd', borderLeft: '4px solid #ffc107', color: '#856404', padding: '12px 15px', marginBottom: '20px', fontSize: '14px' }}>
                ⚠️ Se detectaron <strong>{data.conflictos.length}</strong> conflicto(s) en la planificación.{' '}
                <button onClick={() => navigate('/admin/examenes/conflictos')} style={{ background: 'none', border: 'none', color: '#2d89ef', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', textDecoration: 'underline', padding: 0 }}>
                  Ver conflictos →
                </button>
              </div>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '25px', background: 'white' }}>
              <thead>
                <tr style={{ background: '#dfe7ef' }}>
                  <th style={{ border: '1px solid #bdbdbd', padding: '10px', textAlign: 'left' }}>FECHA</th>
                  <th style={{ border: '1px solid #bdbdbd', padding: '10px', textAlign: 'left' }}>HORA</th>
                  <th style={{ border: '1px solid #bdbdbd', padding: '10px', textAlign: 'left' }}>ASIGNATURA</th>
                  <th style={{ border: '1px solid #bdbdbd', padding: '10px', textAlign: 'left' }}>AULA</th>
                  <th style={{ border: '1px solid #bdbdbd', padding: '10px', textAlign: 'left' }}>PROFESOR</th>
                  <th style={{ border: '1px solid #bdbdbd', padding: '10px', textAlign: 'center' }}>ESTADO</th>
                </tr>
              </thead>
              <tbody>
                {data.examenes.map((ex) => (
                  <tr key={ex.id} style={{ borderBottom: '1px solid #bdbdbd', background: ex.tieneConflicto ? '#fdecea' : 'transparent' }}>
                    <td style={{ padding: '10px' }}>{formatearFecha(ex.fecha)}</td>
                    <td style={{ padding: '10px' }}>{ex.hora}</td>
                    <td style={{ padding: '10px' }}><strong>{ex.asignatura}</strong> <span style={{ color: '#888' }}>({ex.codigo})</span></td>
                    <td style={{ padding: '10px' }}>{ex.aula || <span style={{ color: '#dc3545', fontStyle: 'italic' }}>(sin aula)</span>}</td>
                    <td style={{ padding: '10px' }}>{ex.profesor || <span style={{ color: '#dc3545', fontStyle: 'italic' }}>(sin profesor)</span>}</td>
                    <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: colorConflicto(ex.tiposConflicto) }}>
                      {ex.tieneConflicto ? `⚠️ ${ex.tiposConflicto.join(', ')}` : '✅ OK'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ border: '2px solid #7ea0c0', background: '#dfe7ef', padding: '15px 20px', marginBottom: '25px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', textDecoration: 'underline', fontWeight: 'bold' }}>📊 Resumen del calendario</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                {resumenItem('Exámenes programados', data.resumen.totalExamenes)}
                {resumenItem('Profesores asignados', data.resumen.profesoresAsignados)}
                {resumenItem('Aulas utilizadas', data.resumen.aulasUtilizadas)}
                {resumenItem('Estudiantes afectados', data.resumen.estudiantesAfectados)}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '25px', flexWrap: 'wrap' }}>
              <button onClick={() => setModalAbierto(true)} style={{ minWidth: '200px', padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #1d5faa', fontWeight: 'bold', background: '#2d89ef', color: 'white' }}>
                📎 Descargar calendario
              </button>
              <button onClick={cargar} style={{ minWidth: '180px', padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#6c757d', color: 'white' }}>
                🔄 Refrescar
              </button>
              <button onClick={handleCerrar} style={{ minWidth: '180px', padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#f3f0ec', color: 'black' }}>
                🚪 Cerrar
              </button>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '11px', color: '#666' }}>
              Versión 1.0 · © 2026
            </div>
          </>
        )}
      </div>

      {/* MODAL DE DESCARGA */}
      {modalAbierto && data && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '40px 20px', zIndex: 1000, overflowY: 'auto'
        }}>
          <div style={{ width: '100%', maxWidth: '640px', background: '#ececec', padding: '20px', border: '1px solid #cfcfcf' }}>
            <h2 style={{ textAlign: 'center', fontSize: '22px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '20px' }}>
              DESCARGAR CALENDARIO
            </h2>

            <div style={{ background: '#ededed', border: '1px solid #cfcfcf', padding: '15px', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '10px', textDecoration: 'underline' }}>📅 Calendario disponible</h3>
              <div style={{ fontSize: '14px' }}><strong>Exámenes programados:</strong> {data.resumen.totalExamenes}</div>
            </div>

            <div style={{ background: '#ededed', border: '1px solid #cfcfcf', padding: '15px', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '10px', textDecoration: 'underline' }}>📄 Formato de archivo</h3>
              <div style={{ fontSize: '14px' }}>
                <label><input type="radio" checked readOnly style={{ marginRight: '8px' }} />CSV</label>
                <div style={{ fontSize: '12px', color: '#666', fontStyle: 'italic', marginTop: '6px' }}>
                  PDF y Excel quedan como ampliación futura (requieren librerías adicionales).
                </div>
              </div>
            </div>

            <div style={{ background: '#ededed', border: '1px solid #cfcfcf', padding: '15px', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '10px', textDecoration: 'underline' }}>📋 Información a incluir</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <label><input type="checkbox" checked={incluirAula} onChange={(e) => setIncluirAula(e.target.checked)} style={{ marginRight: '8px' }} />Aula asignada</label>
                <label><input type="checkbox" checked={incluirProfesor} onChange={(e) => setIncluirProfesor(e.target.checked)} style={{ marginRight: '8px' }} />Profesor responsable</label>
                <label><input type="checkbox" checked={incluirEstudiantes} onChange={(e) => setIncluirEstudiantes(e.target.checked)} style={{ marginRight: '8px' }} />Estudiantes matriculados</label>
              </div>
            </div>

            <div style={{ background: '#ededed', border: '1px solid #cfcfcf', padding: '15px', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '10px', textDecoration: 'underline' }}>📆 Período a exportar</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <label><input type="radio" checked={!periodoPersonalizado} onChange={() => setPeriodoPersonalizado(false)} style={{ marginRight: '8px' }} />Completo</label>
                <label><input type="radio" checked={periodoPersonalizado} onChange={() => setPeriodoPersonalizado(true)} style={{ marginRight: '8px' }} />Personalizado</label>
                {periodoPersonalizado && (
                  <div style={{ display: 'flex', gap: '15px', marginLeft: '25px', marginTop: '6px', flexWrap: 'wrap' }}>
                    <label style={{ fontSize: '13px' }}>Desde: <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} style={{ fontFamily: 'inherit', padding: '4px', border: '1px solid #bdbdbd' }} /></label>
                    <label style={{ fontSize: '13px' }}>Hasta: <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} style={{ fontFamily: 'inherit', padding: '4px', border: '1px solid #bdbdbd' }} /></label>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px' }}>
              <button onClick={handleDescargar} disabled={descargando} style={{ minWidth: '180px', padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: descargando ? 'not-allowed' : 'pointer', border: '1px solid #1d5faa', fontWeight: 'bold', background: descargando ? '#9bc0ee' : '#2d89ef', color: 'white' }}>
                {descargando ? 'Descargando...' : '📎 Descargar'}
              </button>
              <button onClick={() => setModalAbierto(false)} disabled={descargando} style={{ minWidth: '180px', padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#f3f0ec', color: 'black' }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultarCalendarioView;
