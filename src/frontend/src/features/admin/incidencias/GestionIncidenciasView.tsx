import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  EstadoIncidencia,
  IncidenciaAdmin,
  incidenciasService,
} from '../../../services/incidencias.service';

type Estado = 'loading' | 'error' | 'success';

const COLOR_ESTADO: Record<EstadoIncidencia, string> = {
  PENDIENTE: '#e6a017',
  REVISADA: '#2d89ef',
  RESUELTA: '#28a745',
  OMITIDA: '#6c757d',
};

const GestionIncidenciasView: React.FC = () => {
  const navigate = useNavigate();
  const [estado, setEstado] = useState<Estado>('loading');
  const [error, setError] = useState<string | null>(null);
  const [incidencias, setIncidencias] = useState<IncidenciaAdmin[]>([]);
  const [accionId, setAccionId] = useState<string | null>(null);

  // Detalle / solución
  const [detalle, setDetalle] = useState<IncidenciaAdmin | null>(null);
  const [modalSolucion, setModalSolucion] = useState<IncidenciaAdmin | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [guardando, setGuardando] = useState(false);

  const cargar = async () => {
    setEstado('loading');
    setError(null);
    try {
      const data = await incidenciasService.listarTodas();
      setIncidencias(data);
      setEstado('success');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al cargar las incidencias');
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
  const formatearTimestamp = (iso: string | null) =>
    iso ? new Date(iso).toLocaleString() : '—';

  const badge = (e: EstadoIncidencia) => (
    <span style={{ background: COLOR_ESTADO[e], color: 'white', padding: '2px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold' }}>{e}</span>
  );

  const actualizarLocal = (inc: IncidenciaAdmin) =>
    setIncidencias((prev) => prev.map((i) => (i.id === inc.id ? inc : i)));

  const handleCambiarEstado = async (inc: IncidenciaAdmin, nuevo: EstadoIncidencia) => {
    setAccionId(inc.id);
    try {
      const actualizada = await incidenciasService.cambiarEstado(inc.id, nuevo);
      actualizarLocal(actualizada);
    } catch (err: any) {
      alert(`❌ ${err.response?.data?.message || err.message || 'No se pudo cambiar el estado'}`);
    } finally {
      setAccionId(null);
    }
  };

  const handleAplicarSolucion = async () => {
    if (!modalSolucion || mensaje.trim().length < 5 || guardando) return;
    setGuardando(true);
    try {
      const actualizada = await incidenciasService.aplicarSolucion(modalSolucion.id, mensaje.trim());
      actualizarLocal(actualizada);
      setModalSolucion(null);
      setMensaje('');
    } catch (err: any) {
      alert(`❌ ${err.response?.data?.message || err.message || 'No se pudo aplicar la solución'}`);
    } finally {
      setGuardando(false);
    }
  };

  const handleExportar = async () => {
    try {
      const blob = await incidenciasService.exportar();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'incidencias.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(`❌ ${err.response?.data?.message || err.message || 'No se pudo exportar'}`);
    }
  };

  const btn = (bg: string, borde: string, color = 'white'): React.CSSProperties => ({
    padding: '5px 10px', borderRadius: '4px', fontSize: '12px', fontFamily: 'inherit',
    cursor: 'pointer', border: `1px solid ${borde}`, fontWeight: 'bold', background: bg, color,
  });

  return (
    <div style={{ background: '#e9e9e9', fontFamily: '"Courier New", monospace', display: 'flex', justifyContent: 'center', padding: '20px', minHeight: '100vh' }}>
      <div style={{ width: '100%', maxWidth: '1300px', background: '#ececec', padding: '20px', border: '1px solid #cfcfcf' }}>
        <h1 style={{ textAlign: 'center', fontSize: '26px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '10px', letterSpacing: '1px' }}>
          🔧 GESTIÓN DE INCIDENCIAS
        </h1>

        {/* Barra de acciones globales */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <button onClick={() => navigate('/admin/examenes/conflictos')} style={btn('#dfe7ef', '#7ea0c0', 'black')}>📋 Ver todos los conflictos</button>
          <button onClick={handleExportar} style={btn('#2d89ef', '#1d5faa')}>📎 Exportar reporte</button>
          <button onClick={cargar} style={btn('#6c757d', '#565e64')}>🔄 Refrescar</button>
          <button onClick={() => navigate('/admin')} style={btn('#f3f0ec', '#999', 'black')}>🚪 Salir</button>
        </div>

        {estado === 'loading' && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ display: 'inline-block', width: '50px', height: '50px', border: '4px solid #e0e0e0', borderTop: '4px solid #2d89ef', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <h2 style={{ fontSize: '18px', color: '#2d89ef' }}>Cargando incidencias...</h2>
          </div>
        )}

        {estado === 'error' && (
          <div style={{ padding: '20px' }}>
            <div style={{ background: '#f8d7da', border: '2px solid #dc3545', padding: '18px', marginBottom: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#721c24' }}>❌ No se pudieron cargar las incidencias</div>
              <p style={{ marginTop: '10px', color: '#721c24' }}>{error}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <button onClick={cargar} style={btn('#2d89ef', '#1d5faa')}>🔄 Reintentar</button>
            </div>
          </div>
        )}

        {estado === 'success' && incidencias.length === 0 && (
          <div style={{ background: '#d4edda', border: '2px solid #28a745', padding: '25px', textAlign: 'center', color: '#155724' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>✅ No hay incidencias registradas</div>
            <p style={{ marginTop: '8px', fontSize: '14px' }}>Los profesores aún no han comunicado incidencias de horario.</p>
          </div>
        )}

        {estado === 'success' && incidencias.length > 0 && (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#dfe7ef' }}>
                <th style={{ border: '1px solid #bdbdbd', padding: '8px', textAlign: 'left' }}>PROFESOR</th>
                <th style={{ border: '1px solid #bdbdbd', padding: '8px', textAlign: 'left' }}>EXAMEN</th>
                <th style={{ border: '1px solid #bdbdbd', padding: '8px', textAlign: 'left' }}>DESCRIPCIÓN</th>
                <th style={{ border: '1px solid #bdbdbd', padding: '8px', textAlign: 'center' }}>ESTADO</th>
                <th style={{ border: '1px solid #bdbdbd', padding: '8px', textAlign: 'center' }}>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {incidencias.map((inc) => (
                <tr key={inc.id} style={{ borderBottom: '1px solid #bdbdbd', opacity: inc.estado === 'OMITIDA' ? 0.55 : 1 }}>
                  <td style={{ padding: '8px' }}>
                    {inc.profesor?.nombre || '—'}<br />
                    <span style={{ fontSize: '11px', color: '#666' }}>{inc.profesor?.email}</span>
                  </td>
                  <td style={{ padding: '8px' }}>
                    {inc.examen ? <><strong>{inc.examen.asignatura}</strong> <span style={{ color: '#888' }}>({inc.examen.codigo})</span><br /><span style={{ fontSize: '11px', color: '#666' }}>{formatearFecha(inc.examen.fecha)} {inc.examen.hora}{inc.examen.aula ? ` · ${inc.examen.aula}` : ''}</span></> : '—'}
                  </td>
                  <td style={{ padding: '8px', maxWidth: '260px' }}>
                    {inc.descripcion}
                    {inc.mensajeResolucion && (
                      <div style={{ marginTop: '6px', fontSize: '11px', color: '#155724', background: '#e7f6ec', padding: '5px 8px', borderLeft: '3px solid #28a745' }}>
                        💬 {inc.mensajeResolucion}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>{badge(inc.estado)}</td>
                  <td style={{ padding: '8px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'stretch' }}>
                      <button disabled={accionId === inc.id} onClick={() => setDetalle(inc)} style={btn('#dfe7ef', '#7ea0c0', 'black')}>🔍 Ver detalle</button>
                      <button disabled={accionId === inc.id} onClick={() => { setModalSolucion(inc); setMensaje(inc.mensajeResolucion || ''); }} style={btn('#28a745', '#1e7e34')}>🔧 Aplicar solución</button>
                      <button disabled={accionId === inc.id || inc.estado === 'REVISADA'} onClick={() => handleCambiarEstado(inc, 'REVISADA')} style={btn('#2d89ef', '#1d5faa')}>✅ Marcar revisado</button>
                      <button disabled={accionId === inc.id || inc.estado === 'OMITIDA'} onClick={() => handleCambiarEstado(inc, 'OMITIDA')} style={btn('#6c757d', '#565e64')}>⏭️ Omitir</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '11px', color: '#666' }}>Versión 1.0 · © 2026</div>
      </div>

      {/* MODAL DETALLE */}
      {detalle && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '40px 20px', zIndex: 1000, overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: '560px', background: '#ececec', padding: '20px', border: '1px solid #cfcfcf' }}>
            <h2 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '18px' }}>DETALLE DE INCIDENCIA</h2>
            <div style={{ fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div><strong>Profesor:</strong> {detalle.profesor?.nombre} ({detalle.profesor?.email})</div>
              <div><strong>Examen:</strong> {detalle.examen ? `${detalle.examen.asignatura} (${detalle.examen.codigo}) · ${formatearFecha(detalle.examen.fecha)} ${detalle.examen.hora}` : '—'}</div>
              <div><strong>Estado:</strong> {badge(detalle.estado)}</div>
              <div><strong>Fecha de comunicación:</strong> {formatearTimestamp(detalle.fechaCreacion)}</div>
              <div><strong>Descripción:</strong><div style={{ background: 'white', border: '1px solid #cfcfcf', padding: '8px', marginTop: '4px' }}>{detalle.descripcion}</div></div>
              {detalle.mensajeResolucion && (
                <div><strong>Mensaje de resolución:</strong><div style={{ background: '#e7f6ec', border: '1px solid #28a745', padding: '8px', marginTop: '4px' }}>{detalle.mensajeResolucion}<br /><span style={{ fontSize: '11px', color: '#155724' }}>Resuelta: {formatearTimestamp(detalle.fechaResolucion)}</span></div></div>
              )}
            </div>
            <div style={{ textAlign: 'center', marginTop: '18px' }}>
              <button onClick={() => setDetalle(null)} style={btn('#f3f0ec', '#999', 'black')}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL APLICAR SOLUCIÓN */}
      {modalSolucion && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '40px 20px', zIndex: 1000, overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: '560px', background: '#ececec', padding: '20px', border: '1px solid #cfcfcf' }}>
            <h2 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '14px' }}>APLICAR SOLUCIÓN</h2>
            <div style={{ fontSize: '13px', marginBottom: '12px', color: '#444' }}>
              <strong>{modalSolucion.examen?.asignatura}</strong> · {modalSolucion.profesor?.nombre}
              <div style={{ marginTop: '4px', fontStyle: 'italic' }}>"{modalSolucion.descripcion}"</div>
            </div>
            <label style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', marginBottom: '6px' }}>
              Mensaje de resolución <span style={{ color: '#dc3545' }}>*</span>
            </label>
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              rows={4}
              maxLength={1000}
              placeholder="Describa la solución aplicada (mínimo 5 caracteres). Quedará visible para el profesor."
              style={{ width: '100%', padding: '10px', fontFamily: 'inherit', fontSize: '14px', border: '1px solid #bdbdbd', resize: 'vertical', boxSizing: 'border-box' }}
            />
            <div style={{ fontSize: '12px', color: '#666', textAlign: 'right', marginBottom: '12px' }}>{mensaje.trim().length}/1000</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
              <button onClick={handleAplicarSolucion} disabled={mensaje.trim().length < 5 || guardando} style={{ ...btn(mensaje.trim().length < 5 || guardando ? '#9bc0ee' : '#28a745', '#1e7e34'), padding: '10px 18px', fontSize: '14px', cursor: mensaje.trim().length < 5 || guardando ? 'not-allowed' : 'pointer' }}>
                {guardando ? 'Guardando...' : '✅ Aplicar y resolver'}
              </button>
              <button onClick={() => { setModalSolucion(null); setMensaje(''); }} disabled={guardando} style={{ ...btn('#f3f0ec', '#999', 'black'), padding: '10px 18px', fontSize: '14px' }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionIncidenciasView;
