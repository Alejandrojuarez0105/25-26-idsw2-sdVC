import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Examen, examenesService } from '../../../services/examenes.service';
import { Profesor, profesoresService } from '../../../services/profesores.service';

const AsignarProfesorAExamenView: React.FC = () => {
  const navigate = useNavigate();
  const [examenes, setExamenes] = useState<Examen[]>([]);
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [examenSeleccionadoId, setExamenSeleccionadoId] = useState<string | null>(null);
  const [profesorSeleccionadoId, setProfesorSeleccionadoId] = useState<string | null>(null);

  const refresh = async () => {
    try {
      const [examenesData, profesoresData] = await Promise.all([
        examenesService.findAll(),
        profesoresService.findAll(),
      ]);
      setExamenes(examenesData);
      setProfesores(profesoresData);
    } catch (err: any) {
      alert(`❌ Error al cargar los datos: ${err.response?.data?.message || err.message || 'Error desconocido'}`);
    }
  };

  useEffect(() => {
    (async () => {
      await refresh();
      setLoading(false);
    })();
  }, []);

  const examenSeleccionado = useMemo(
    () => examenes.find(e => e.id === examenSeleccionadoId) || null,
    [examenes, examenSeleccionadoId]
  );
  const profesorSeleccionado = useMemo(
    () => profesores.find(p => p.id === profesorSeleccionadoId) || null,
    [profesores, profesorSeleccionadoId]
  );

  const totalSinProfesor = examenes.filter(e => !e.profesor || e.profesor.trim() === '').length;

  const formatearFecha = (fechaStr: string) => {
    try {
      const date = new Date(fechaStr);
      const day = String(date.getUTCDate()).padStart(2, '0');
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const year = date.getUTCFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return fechaStr;
    }
  };

  const handleAsignar = async () => {
    if (!examenSeleccionado) {
      alert('⚠️ Primero selecciona un examen.');
      return;
    }
    if (!profesorSeleccionado) {
      alert('⚠️ Primero selecciona un profesor.');
      return;
    }

    const nombreNuevo = `${profesorSeleccionado.usuario.nombre} ${profesorSeleccionado.usuario.apellido}`.trim();

    if (examenSeleccionado.profesor && examenSeleccionado.profesor.trim() !== '') {
      const confirmar = window.confirm(
        `⚠️ El examen "${examenSeleccionado.codigo} - ${examenSeleccionado.asignatura}" ya tiene asignado al profesor "${examenSeleccionado.profesor}".\n\n¿Deseas reemplazarlo por "${nombreNuevo}"?`
      );
      if (!confirmar) return;
    }

    setSaving(true);
    try {
      await examenesService.asignarProfesor(examenSeleccionado.id, profesorSeleccionado.id);
      await refresh();
      setExamenSeleccionadoId(null);
      setProfesorSeleccionadoId(null);
      alert('✅ Asignación realizada con éxito.');
    } catch (err: any) {
      alert(`❌ Error al asignar el profesor: ${err.response?.data?.message || 'Error desconocido'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDesasignar = async () => {
    if (!examenSeleccionado) {
      alert('⚠️ Primero selecciona un examen.');
      return;
    }
    if (!examenSeleccionado.profesor || examenSeleccionado.profesor.trim() === '') {
      alert(`⚠️ El examen "${examenSeleccionado.codigo} - ${examenSeleccionado.asignatura}" no tiene profesor asignado.`);
      return;
    }
    const confirmar = window.confirm(
      `¿Desasignar al profesor "${examenSeleccionado.profesor}" del examen "${examenSeleccionado.codigo} - ${examenSeleccionado.asignatura}"?`
    );
    if (!confirmar) return;

    setSaving(true);
    try {
      await examenesService.asignarProfesor(examenSeleccionado.id, null);
      await refresh();
      setExamenSeleccionadoId(null);
      alert('✅ Profesor desasignado del examen.');
    } catch (err: any) {
      alert(`❌ Error al desasignar el profesor: ${err.response?.data?.message || 'Error desconocido'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleGuardar = () => {
    const asignaciones = examenes.filter(e => e.profesor && e.profesor.trim() !== '');
    if (asignaciones.length === 0) {
      alert('⚠️ No hay asignaciones para guardar.');
      return;
    }
    let mensaje = '💾 ASIGNACIONES VIGENTES\n\n';
    asignaciones.forEach(e => {
      mensaje += `📖 ${e.codigo} - ${e.asignatura}\n`;
      mensaje += `   👨‍🏫 Profesor: ${e.profesor}\n`;
      mensaje += `   📅 ${formatearFecha(e.fecha)} ${e.hora} - Aula ${e.aula}\n\n`;
    });
    mensaje += `✅ Total asignaciones: ${asignaciones.length}`;
    alert(mensaje);
  };

  const handleContinuar = () => {
    alert('📌 Continuando con la gestión de asignaciones...\n\nPuedes seguir asignando profesores a los exámenes pendientes.');
  };

  const handleCancelar = () => {
    if (window.confirm('¿Estás seguro de que deseas salir del gestor de asignaciones?')) {
      navigate('/admin/examenes');
    }
  };

  if (loading) {
    return (
      <div style={{ background: '#e9e9e9', fontFamily: '"Courier New", monospace', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <h2>Cargando datos...</h2>
      </div>
    );
  }

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
        <h1 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '25px', letterSpacing: '1px' }}>
          ASIGNAR PROFESOR A EXAMEN
        </h1>

        <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap' }}>
          {/* Panel izquierdo - Exámenes */}
          <div style={{ flex: '1.5 1 400px' }}>
            <div style={{ border: '1px solid #cfcfcf', padding: '18px', background: '#ededed' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '15px', textDecoration: 'underline', fontWeight: 'bold' }}>📋 Lista de exámenes:</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '480px', overflowY: 'auto' }}>
                {examenes.length === 0 ? (
                  <div style={{ fontStyle: 'italic', color: '#666', fontSize: '13px' }}>No hay exámenes registrados.</div>
                ) : (
                  examenes.map(ex => {
                    const asignado = !!ex.profesor && ex.profesor.trim() !== '';
                    const sel = examenSeleccionadoId === ex.id;
                    const base: React.CSSProperties = {
                      border: '1px solid #bdbdbd',
                      padding: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    };
                    const variant: React.CSSProperties = sel
                      ? { background: '#b8d4f0', borderLeft: '4px solid #2d89ef' }
                      : asignado
                        ? { background: '#d4edda', borderLeft: '4px solid #28a745' }
                        : { background: '#f5f5f5' };
                    return (
                      <div
                        key={ex.id}
                        style={{ ...base, ...variant }}
                        onClick={() => setExamenSeleccionadoId(ex.id)}
                      >
                        <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '5px' }}>📖 {ex.codigo} – {ex.asignatura}</div>
                        <div style={{ fontSize: '12px', color: '#555' }}>{formatearFecha(ex.fecha)} {ex.hora} · Aula {ex.aula}</div>
                        {asignado ? (
                          <div style={{ fontSize: '12px', color: '#28a745', marginTop: '5px', fontWeight: 'bold' }}>✅ Asignado: {ex.profesor}</div>
                        ) : (
                          <div style={{ fontSize: '12px', color: '#dc3545', marginTop: '5px', fontWeight: 'bold' }}>⚠️ Sin profesor asignado</div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Panel derecho - Profesores */}
          <div style={{ flex: '1.5 1 400px' }}>
            <div style={{ border: '1px solid #cfcfcf', padding: '18px', background: '#ededed' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '15px', textDecoration: 'underline', fontWeight: 'bold' }}>👨‍🏫 Profesores disponibles:</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '480px', overflowY: 'auto' }}>
                {profesores.length === 0 ? (
                  <div style={{ fontStyle: 'italic', color: '#666', fontSize: '13px' }}>No hay profesores registrados.</div>
                ) : (
                  profesores.map(p => {
                    const sel = profesorSeleccionadoId === p.id;
                    const nombreCompleto = `${p.usuario?.nombre || ''} ${p.usuario?.apellido || ''}`.trim();
                    return (
                      <div
                        key={p.id}
                        style={{
                          border: '1px solid #bdbdbd',
                          padding: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          background: sel ? '#b8d4f0' : '#f5f5f5',
                          borderLeft: sel ? '4px solid #2d89ef' : '1px solid #bdbdbd',
                        }}
                        onClick={() => setProfesorSeleccionadoId(p.id)}
                      >
                        <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '5px' }}>👨‍🏫 {nombreCompleto || 'Sin nombre'}</div>
                        <div style={{ fontSize: '12px', color: '#555' }}>🎓 Departamento: {p.departamento || 'N/A'}</div>
                        <div style={{ fontSize: '11px', color: '#666', marginTop: '3px' }}>📧 {p.usuario?.email}</div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Botones de asignación */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: '20px 0' }}>
          <button
            onClick={handleDesasignar}
            disabled={saving}
            style={{ minWidth: '150px', padding: '10px 20px', fontSize: '16px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#f3f0ec' }}
          >
            ◀◀ Desasignar
          </button>
          <button
            onClick={handleAsignar}
            disabled={saving}
            style={{ minWidth: '150px', padding: '10px 20px', fontSize: '16px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#f3f0ec' }}
          >
            {saving ? 'Procesando...' : 'Asignar ▶▶'}
          </button>
        </div>

        {/* Resumen */}
        <div style={{ border: '2px solid #7ea0c0', background: '#dfe7ef', padding: '15px 20px', marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '5px' }}>Total exámenes sin profesor:</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2d89ef' }}>{totalSinProfesor}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '5px' }}>Total profesores disponibles:</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2d89ef' }}>{profesores.length}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '5px' }}>Profesor seleccionado:</div>
              <div style={{ fontSize: profesorSeleccionado ? '14px' : '20px', fontWeight: 'bold', color: '#2d89ef' }}>
                {profesorSeleccionado ? `${profesorSeleccionado.usuario?.nombre} ${profesorSeleccionado.usuario?.apellido}`.trim() : 'Ninguno'}
              </div>
            </div>
          </div>
        </div>

        {/* Botones principales */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '15px', flexWrap: 'wrap' }}>
          <button
            onClick={handleGuardar}
            style={{ minWidth: '180px', padding: '12px 20px', borderRadius: '4px', fontSize: '16px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #1e7e34', fontWeight: 'bold', background: '#28a745', color: 'white' }}
          >
            💾 Guardar asignaciones
          </button>
          <button
            onClick={handleContinuar}
            style={{ minWidth: '180px', padding: '12px 20px', borderRadius: '4px', fontSize: '16px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #1d5faa', fontWeight: 'bold', background: '#2d89ef', color: 'white' }}
          >
            📌 Continuar gestionando
          </button>
          <button
            onClick={handleCancelar}
            style={{ minWidth: '180px', padding: '12px 20px', borderRadius: '4px', fontSize: '16px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#f3f0ec', color: 'black' }}
          >
            ❌ Cancelar
          </button>
        </div>

        <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '11px', color: '#666' }}>
          Versión 1.0 · © 2026
        </div>
      </div>
    </div>
  );
};

export default AsignarProfesorAExamenView;
