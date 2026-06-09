import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { CalendarioExamen, ConflictoExamen, examenesService } from '../../services/examenes.service';
import { EstadoIncidencia, IncidenciaAdmin, incidenciasService } from '../../services/incidencias.service';

const COLOR_INCIDENCIA: Record<EstadoIncidencia, string> = {
  PENDIENTE: '#e6a017',
  REVISADA: '#2d89ef',
  RESUELTA: '#28a745',
  OMITIDA: '#6c757d',
};

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conflictos, setConflictos] = useState<ConflictoExamen[]>([]);
  const [conflictosLoading, setConflictosLoading] = useState(true);
  const [proximos, setProximos] = useState<CalendarioExamen[]>([]);
  const [proximosLoading, setProximosLoading] = useState(true);
  const [incidencias, setIncidencias] = useState<IncidenciaAdmin[]>([]);
  const [incidenciasLoading, setIncidenciasLoading] = useState(true);
  const [accionId, setAccionId] = useState<string | null>(null);

  const cargarIncidencias = async () => {
    try {
      const data = await incidenciasService.listarTodas();
      setIncidencias(data);
    } catch {
      setIncidencias([]);
    } finally {
      setIncidenciasLoading(false);
    }
  };

  useEffect(() => {
    cargarIncidencias();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await examenesService.findConflictos();
        setConflictos(data);
      } catch {
        setConflictos([]);
      } finally {
        setConflictosLoading(false);
      }
    })();

    (async () => {
      try {
        const calendario = await examenesService.consultarCalendario();
        const hoy = new Date().toISOString().slice(0, 10);
        const futuros = calendario.examenes.filter((e) => e.fecha >= hoy);
        // Si no hay exámenes futuros, mostrar los más recientes del calendario.
        const lista = (futuros.length > 0 ? futuros : calendario.examenes).slice(0, 5);
        setProximos(lista);
      } catch {
        setProximos([]);
      } finally {
        setProximosLoading(false);
      }
    })();
  }, []);

  const formatearFechaCorta = (fechaStr: string) => {
    const partes = fechaStr.split('-');
    if (partes.length === 3) return `${partes[2]}/${partes[1]}`;
    return fechaStr;
  };

  const colorEstado = (estado: ConflictoExamen['estado']) => {
    if (estado === 'Pendiente') return '#dc3545';
    if (estado === 'Resuelto') return '#28a745';
    return '#e6a017';
  };

  const handleCerrarSesion = () => {
    navigate('/logout');
  };

  const handleCambiarEstadoIncidencia = async (inc: IncidenciaAdmin, nuevo: EstadoIncidencia) => {
    setAccionId(inc.id);
    try {
      const actualizada = await incidenciasService.cambiarEstado(inc.id, nuevo);
      setIncidencias((prev) => prev.map((i) => (i.id === inc.id ? actualizada : i)));
    } catch (err: any) {
      alert(`❌ ${err.response?.data?.message || err.message || 'No se pudo cambiar el estado'}`);
    } finally {
      setAccionId(null);
    }
  };

  const handleExportarIncidencias = async () => {
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

  const incidenciasPendientes = incidencias.filter((i) => i.estado === 'PENDIENTE').length;

  const handleAccesoRapido = (modulo: string) => {
    if (modulo === 'grados') {
      navigate('/admin/grados');
    } else if (modulo === 'asignaturas') {
      navigate('/admin/asignaturas');
    } else if (modulo === 'examenes') {
      navigate('/admin/examenes');
    } else if (modulo === 'aulas') {
      navigate('/admin/aulas');
    } else if (modulo === 'alumnos') {
      navigate('/admin/alumnos');
    } else if (modulo === 'profesores') {
      navigate('/admin/profesores');
    } else if (modulo === 'calendario') {
      navigate('/admin/calendario/consultar');
    } else if (modulo === 'incidencias') {
      navigate('/admin/incidencias');
    } else {
      alert(`🔍 Navegando a: ${modulo}\n\nFuncionalidad en desarrollo.`);
    }
  };

  return (
    <div style={{ 
      background: '#e9e9e9', 
      fontFamily: '"Courier New", monospace', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ 
          background: '#ececec', 
          padding: '20px', 
          border: '1px solid #cfcfcf', 
          marginBottom: '20px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap' 
        }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>UE</h1>
            <div style={{ fontSize: '11px', color: '#555' }}>Universidad Europea del Atlántico</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{user?.nombre} {user?.apellido}</div>
            <div style={{ fontSize: '12px', color: '#2d89ef' }}>{user?.email}</div>
            <button 
              onClick={handleCerrarSesion}
              style={{ 
                background: '#dc3545', 
                color: 'white', 
                border: 'none', 
                padding: '6px 15px', 
                fontFamily: 'inherit', 
                fontSize: '12px', 
                cursor: 'pointer', 
                marginTop: '5px', 
                borderRadius: '3px' 
              }}
            >
              🚪 Cerrar sesión
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px', marginBottom: '25px' }}>
          {[
            { n: '4', l: 'Grados Académicos' },
            { n: '15', l: 'Asignaturas' },
            { n: '8', l: 'Profesores' },
            { n: '12', l: 'Aulas' },
            { n: '350', l: 'Alumnos' }
          ].map((stat, i) => (
            <div key={i} style={{ background: '#ededed', border: '1px solid #cfcfcf', padding: '15px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2d89ef' }}>{stat.n}</div>
              <div style={{ fontSize: '13px', color: '#555', marginTop: '5px' }}>{stat.l}</div>
            </div>
          ))}
        </div>

        {/* Paneles de actividad */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
          <div style={{ flex: 1, background: '#ededed', border: '1px solid #cfcfcf', padding: '18px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px', textDecoration: 'underline', fontWeight: 'bold' }}>📋 Conflictos recientes</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {conflictosLoading ? (
                <li style={{ padding: '8px 0', fontSize: '13px', fontStyle: 'italic', color: '#666' }}>Cargando conflictos...</li>
              ) : conflictos.length === 0 ? (
                <li style={{ padding: '8px 0', fontSize: '13px', color: '#28a745', fontWeight: 'bold' }}>✅ Sin conflictos detectados en la planificación actual.</li>
              ) : (
                conflictos.slice(0, 5).map(c => (
                  <li key={c.id} style={{ padding: '8px 0', borderBottom: '1px solid #cfcfcf', fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>[{c.tipo}] {c.detalle}</span>
                    <span style={{ color: colorEstado(c.estado), fontWeight: 'bold' }}>{c.estado}</span>
                  </li>
                ))
              )}
            </ul>
            <div style={{ marginTop: '12px', textAlign: 'right' }}>
              <a onClick={() => navigate('/admin/examenes/conflictos')} style={{ color: '#2d89ef', textDecoration: 'none', fontSize: '12px', cursor: 'pointer' }}>Ver todos los conflictos →</a>
            </div>
          </div>
          <div style={{ flex: 1, background: '#ededed', border: '1px solid #cfcfcf', padding: '18px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px', textDecoration: 'underline', fontWeight: 'bold' }}>📅 Próximos exámenes</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {proximosLoading ? (
                <li style={{ padding: '8px 0', fontSize: '13px', fontStyle: 'italic', color: '#666' }}>Cargando exámenes...</li>
              ) : proximos.length === 0 ? (
                <li style={{ padding: '8px 0', fontSize: '13px', color: '#666' }}>Sin exámenes programados.</li>
              ) : (
                proximos.map((e) => (
                  <li key={e.id} style={{ padding: '8px 0', borderBottom: '1px solid #cfcfcf', fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{e.asignatura}</span><span>{formatearFechaCorta(e.fecha)} {e.hora}</span>
                  </li>
                ))
              )}
            </ul>
            <div style={{ marginTop: '12px', textAlign: 'right' }}>
              <a onClick={() => navigate('/admin/calendario/consultar')} style={{ color: '#2d89ef', textDecoration: 'none', fontSize: '12px', cursor: 'pointer' }}>Ver todos los exámenes →</a>
            </div>
          </div>

          {/* 🔧 Incidencias */}
          <div style={{ flex: 1, background: '#ededed', border: '1px solid #cfcfcf', padding: '18px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px', textDecoration: 'underline', fontWeight: 'bold' }}>
              🔧 Incidencias{incidenciasPendientes > 0 && <span style={{ marginLeft: '8px', background: '#dc3545', color: 'white', borderRadius: '10px', padding: '1px 8px', fontSize: '12px' }}>{incidenciasPendientes}</span>}
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {incidenciasLoading ? (
                <li style={{ padding: '8px 0', fontSize: '13px', fontStyle: 'italic', color: '#666' }}>Cargando incidencias...</li>
              ) : incidencias.length === 0 ? (
                <li style={{ padding: '8px 0', fontSize: '13px', color: '#28a745', fontWeight: 'bold' }}>✅ Sin incidencias comunicadas.</li>
              ) : (
                incidencias.slice(0, 4).map((inc) => (
                  <li key={inc.id} style={{ padding: '8px 0', borderBottom: '1px solid #cfcfcf', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inc.examen?.asignatura || 'Examen'} · {inc.profesor?.nombre}</span>
                      <span style={{ color: COLOR_INCIDENCIA[inc.estado], fontWeight: 'bold', whiteSpace: 'nowrap' }}>{inc.estado}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                      <button disabled={accionId === inc.id} onClick={() => navigate('/admin/incidencias')} style={{ fontSize: '11px', fontFamily: 'inherit', padding: '2px 6px', border: '1px solid #1e7e34', background: '#28a745', color: 'white', borderRadius: '3px', cursor: 'pointer' }}>🔧 Resolver</button>
                      <button disabled={accionId === inc.id || inc.estado === 'REVISADA'} onClick={() => handleCambiarEstadoIncidencia(inc, 'REVISADA')} style={{ fontSize: '11px', fontFamily: 'inherit', padding: '2px 6px', border: '1px solid #1d5faa', background: '#2d89ef', color: 'white', borderRadius: '3px', cursor: 'pointer' }}>✅ Revisado</button>
                      <button disabled={accionId === inc.id || inc.estado === 'OMITIDA'} onClick={() => handleCambiarEstadoIncidencia(inc, 'OMITIDA')} style={{ fontSize: '11px', fontFamily: 'inherit', padding: '2px 6px', border: '1px solid #565e64', background: '#6c757d', color: 'white', borderRadius: '3px', cursor: 'pointer' }}>⏭️ Omitir</button>
                    </div>
                  </li>
                ))
              )}
            </ul>
            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
              <a onClick={handleExportarIncidencias} style={{ color: '#2d89ef', textDecoration: 'none', fontSize: '12px', cursor: 'pointer' }}>📎 Exportar reporte</a>
              <a onClick={() => navigate('/admin/incidencias')} style={{ color: '#2d89ef', textDecoration: 'none', fontSize: '12px', cursor: 'pointer' }}>Ver todas →</a>
            </div>
          </div>
        </div>

        {/* Accesos rápidos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '25px' }}>
          {[
            { id: 'grados', icon: '🎓', name: 'Grados' },
            { id: 'asignaturas', icon: '📚', name: 'Asignaturas' },
            { id: 'profesores', icon: '👨‍🏫', name: 'Profesores' },
            { id: 'aulas', icon: '🏛️', name: 'Aulas' },
            { id: 'alumnos', icon: '👨‍🎓', name: 'Alumnos' },
            { id: 'examenes', icon: '📝', name: 'Exámenes' },
            { id: 'calendario', icon: '📅', name: 'Calendario' },
            { id: 'incidencias', icon: '🔧', name: 'Incidencias' }
          ].map((acc) => (
            <div 
              key={acc.id} 
              onClick={() => handleAccesoRapido(acc.id)}
              style={{ 
                background: '#dfe7ef', 
                border: '1px solid #7ea0c0', 
                padding: '15px', 
                textAlign: 'center', 
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#b8d4f0'}
              onMouseOut={(e) => e.currentTarget.style.background = '#dfe7ef'}
            >
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{acc.icon}</div>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{acc.name}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', fontSize: '11px', color: '#666', padding: '15px', borderTop: '1px solid #cfcfcf', marginTop: '10px' }}>
          Sistema de gestión académica - Versión 1.0 · © 2026
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
