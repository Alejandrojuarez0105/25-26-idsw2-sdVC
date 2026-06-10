import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { CalendarioAlumno, alumnoService } from '../../services/alumno.service';

const AlumnoDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [calendario, setCalendario] = useState<CalendarioAlumno | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    (async () => {
      try {
        const cal = await alumnoService.consultarCalendario();
        if (activo) setCalendario(cal);
      } catch {
        // Dashboard tolerante a fallos: si falla la carga, se muestran vacíos.
      } finally {
        if (activo) setCargando(false);
      }
    })();
    return () => {
      activo = false;
    };
  }, []);

  const handleCerrarSesion = () => {
    navigate('/logout');
  };

  const formatearFecha = (fechaStr: string) => {
    const partes = fechaStr.split('-');
    if (partes.length === 3) return `${partes[2]}/${partes[1]}`;
    return fechaStr;
  };

  const hoy = new Date().toISOString().slice(0, 10);
  const examenes = calendario?.examenes ?? [];
  const futuros = examenes.filter((e) => e.fecha >= hoy);
  const proximos = (futuros.length > 0 ? futuros : examenes).slice(0, 4);

  const stats = [
    { n: String(calendario?.resumen.asignaturas ?? 0), l: 'Asignaturas con examen' },
    { n: String(futuros.length), l: 'Exámenes pendientes' },
  ];

  return (
    <div style={{
      background: '#e9e9e9',
      fontFamily: '"Courier New", monospace',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '25px' }}>
          {stats.map((stat, i) => (
            <div key={i} style={{ background: '#ededed', border: '1px solid #cfcfcf', padding: '15px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2d89ef' }}>{cargando ? '…' : stat.n}</div>
              <div style={{ fontSize: '13px', color: '#555', marginTop: '5px' }}>{stat.l}</div>
            </div>
          ))}
        </div>

        {/* Paneles de actividad */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
          <div style={{ flex: 1, background: '#ededed', border: '1px solid #cfcfcf', padding: '18px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px', textDecoration: 'underline', fontWeight: 'bold' }}>📅 Próximos exámenes</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {cargando ? (
                <li style={{ padding: '8px 0', fontSize: '13px', color: '#666' }}>Cargando…</li>
              ) : proximos.length === 0 ? (
                <li style={{ padding: '8px 0', fontSize: '13px', color: '#666' }}>No tiene exámenes programados.</li>
              ) : (
                proximos.map((ex) => (
                  <li key={ex.id} style={{ padding: '8px 0', borderBottom: '1px solid #cfcfcf', fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{ex.asignatura}</span>
                    <span style={{ fontSize: '11px', color: '#666' }}>{formatearFecha(ex.fecha)} {ex.hora}{ex.aula ? ` - Aula ${ex.aula}` : ''}</span>
                  </li>
                ))
              )}
            </ul>
            <div style={{ marginTop: '12px', textAlign: 'right' }}>
              <a onClick={() => navigate('/alumno/calendario')} style={{ color: '#2d89ef', textDecoration: 'none', fontSize: '12px', cursor: 'pointer' }}>Ver mi calendario →</a>
            </div>
          </div>
        </div>

        {/* Accesos rápidos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '25px' }}>
          {[
            { id: 'calendario', icon: '📅', name: 'Mis Exámenes', ruta: '/alumno/calendario' },
            { id: 'descargar', icon: '📎', name: 'Descargar Calendario', ruta: '/alumno/calendario' }
          ].map((acc) => (
            <div
              key={acc.id}
              onClick={() => navigate(acc.ruta)}
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

export default AlumnoDashboard;
