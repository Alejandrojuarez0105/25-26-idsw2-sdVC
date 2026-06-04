import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Asignatura, asignaturasService } from '../../../services/asignaturas.service';

const EliminarAsignaturaView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const subjects: Asignatura[] = location.state?.subjects || [];

  if (subjects.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>No hay asignaturas seleccionadas para eliminar.</p>
        <button onClick={() => navigate('/admin/asignaturas')}>Volver</button>
      </div>
    );
  }

  const handleConfirm = async () => {
    const isMultiple = subjects.length > 1;
    const confirmMessage = isMultiple 
      ? `⚠️ ELIMINACIÓN PERMANENTE ⚠️\n\n¿Está seguro de que desea eliminar las ${subjects.length} asignaturas seleccionadas?\n\nEsta acción:\n- Es IRREVERSIBLE\n- Eliminará los exámenes asociados\n- Afectará a los estudiantes matriculados\n\nNo podrá recuperar los datos una vez eliminados.`
      : `⚠️ ELIMINACIÓN PERMANENTE ⚠️\n\n¿Está ABSOLUTAMENTE seguro de que desea eliminar la asignatura "${subjects[0].codigo} - ${subjects[0].nombre}"?\n\nEsta acción:\n- Es IRREVERSIBLE\n- Eliminará los exámenes asociados\n- Afectará a los estudiantes matriculados\n\nNo podrá recuperar los datos una vez eliminados.`;

    const confirmar = window.confirm(confirmMessage);

    if (confirmar) {
      const confirmarFinal = window.confirm(
        `ÚLTIMA ADVERTENCIA\n\n¿Realmente desea proceder con la eliminación?`
      );

      if (confirmarFinal) {
        const check = window.prompt('Escriba "ELIMINAR" para confirmar la eliminación:');
        if (check === 'ELIMINAR') {
          try {
            await Promise.all(subjects.map(s => asignaturasService.remove(s.id)));
            alert(`✅ ${subjects.length} asignatura(s) eliminada(s) correctamente.`);
            navigate('/admin/asignaturas');
          } catch (err) {
            alert('❌ Error al eliminar las asignaturas. Es posible que tengan dependencias activas.');
            navigate('/admin/asignaturas');
          }
        } else if (check !== null) {
          alert('❌ Texto incorrecto. Eliminación cancelada.');
        }
      }
    }
  };

  const handleCancel = () => {
    navigate('/admin/asignaturas');
  };

  return (
    <div style={{ 
      background: '#e9e9e9', 
      fontFamily: '"Courier New", monospace', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{ 
        width: '600px', 
        background: '#ececec', 
        padding: '30px', 
        border: '1px solid #cfcfcf' 
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          fontSize: '24px', 
          fontWeight: 'bold', 
          textDecoration: 'underline', 
          marginBottom: '30px', 
          letterSpacing: '1px' 
        }}>ELIMINAR ASIGNATURA</h1>

        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
          ¿Está seguro de eliminar {subjects.length === 1 ? 'esta asignatura' : 'estas asignaturas'}?
        </div>

        <div style={{ background: '#f5f5f5', border: '1px solid #bdbdbd', padding: '15px', marginBottom: '20px' }}>
          {subjects.map((asig) => (
            <div key={asig.id} style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: subjects.length > 1 ? '1px dashed #ccc' : 'none' }}>
              <div style={{ marginBottom: '5px', fontSize: '15px' }}>
                <strong>Código:</strong> {asig.codigo}
              </div>
              <div style={{ marginBottom: '5px', fontSize: '15px' }}>
                <strong>Nombre:</strong> {asig.nombre}
              </div>
              <div style={{ marginBottom: '5px', fontSize: '15px' }}>
                <strong>Créditos:</strong> {asig.creditos}
              </div>
              <div style={{ marginBottom: '5px', fontSize: '15px' }}>
                <strong>Grado:</strong> {asig.grado.nombre}
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff3cd', borderLeft: '4px solid #ffc107', padding: '12px 15px', marginBottom: '20px' }}>
          <strong style={{ display: 'block', marginBottom: '5px' }}>📝 Exámenes programados:</strong>
          Se eliminarán todos los exámenes asociados a {subjects.length === 1 ? 'esta asignatura' : 'estas asignaturas'}.
        </div>

        <div style={{ background: '#f8d7da', border: '2px solid #dc3545', padding: '15px', marginBottom: '25px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#721c24', marginBottom: '10px' }}>
            ⚠️ ADVERTENCIA ⚠️
          </div>
          <div style={{ fontSize: '14px', color: '#721c24' }}>
            Esta acción es irreversible<br />
            Los exámenes asociados también serán eliminados
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <button 
            onClick={handleConfirm}
            style={{ minWidth: '200px', padding: '12px 20px', borderRadius: '4px', fontSize: '16px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #a71d2a', fontWeight: 'bold', background: '#dc3545', color: 'white' }}
          >
            🗑️ Confirmar eliminación
          </button>
          <button 
            onClick={handleCancel}
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

export default EliminarAsignaturaView;
