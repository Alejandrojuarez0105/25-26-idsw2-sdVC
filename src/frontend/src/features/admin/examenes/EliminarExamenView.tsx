import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Examen, examenesService } from '../../../services/examenes.service';

const EliminarExamenView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const exams: Examen[] = location.state?.exams || [];

  if (exams.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>No hay exámenes seleccionados para eliminar.</p>
        <button onClick={() => navigate('/admin/examenes')}>Volver</button>
      </div>
    );
  }

  const handleConfirm = async () => {
    const isMultiple = exams.length > 1;
    const confirmMessage = isMultiple 
      ? `⚠️ ELIMINACIÓN PERMANENTE ⚠️\n\n¿Está seguro de que desea eliminar los ${exams.length} exámenes seleccionados?\n\nEsta acción:\n- Es IRREVERSIBLE\n- Eliminará los registros del calendario\n\nNo podrá recuperar los datos una vez eliminados.`
      : `⚠️ ELIMINACIÓN PERMANENTE ⚠️\n\n¿Está ABSOLUTAMENTE seguro de que desea eliminar el examen "${exams[0].codigo} - ${exams[0].asignatura}"?\n\nEsta acción:\n- Es IRREVERSIBLE\n- Eliminará el registro del calendario\n\nNo podrá recuperar los datos una vez eliminados.`;

    const confirmar = window.confirm(confirmMessage);

    if (confirmar) {
      const confirmarFinal = window.confirm(
        `ÚLTIMA ADVERTENCIA\n\n¿Realmente desea proceder con la eliminación?`
      );

      if (confirmarFinal) {
        const check = window.prompt('Escriba "ELIMINAR" para confirmar la eliminación:');
        if (check === 'ELIMINAR') {
          try {
            await Promise.all(exams.map(e => examenesService.remove(e.id)));
            alert(`✅ ${exams.length} examen(es) eliminado(s) correctamente.`);
            navigate('/admin/examenes');
          } catch (err) {
            alert('❌ Error al eliminar los exámenes.');
            navigate('/admin/examenes');
          }
        } else if (check !== null) {
          alert('❌ Texto incorrecto. Eliminación cancelada.');
        }
      }
    }
  };

  const handleCancel = () => {
    navigate('/admin/examenes');
  };

  const formatearFecha = (fechaStr: string) => {
    try {
      const date = new Date(fechaStr);
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
        }}>ELIMINAR EXAMEN</h1>

        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
          ¿Está seguro de eliminar {exams.length === 1 ? 'este examen' : 'estos exámenes'}?
        </div>

        <div style={{ background: '#f5f5f5', border: '1px solid #bdbdbd', padding: '15px', marginBottom: '20px' }}>
          {exams.map((ex) => (
            <div key={ex.id} style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: exams.length > 1 ? '1px dashed #ccc' : 'none' }}>
              <div style={{ marginBottom: '5px', fontSize: '15px' }}>
                <strong>Código:</strong> {ex.codigo}
              </div>
              <div style={{ marginBottom: '5px', fontSize: '15px' }}>
                <strong>Asignatura:</strong> {ex.asignatura}
              </div>
              <div style={{ marginBottom: '5px', fontSize: '15px' }}>
                <strong>Fecha/Hora:</strong> {formatearFecha(ex.fecha)} {ex.hora}
              </div>
              <div style={{ marginBottom: '5px', fontSize: '15px' }}>
                <strong>Aula:</strong> {ex.aula?.codigo || 'N/A'}
              </div>
              <div style={{ marginBottom: '5px', fontSize: '15px' }}>
                <strong>Profesor:</strong> {ex.profesor ? `${ex.profesor.usuario.nombre} ${ex.profesor.usuario.apellido}` : 'N/A'}
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#f8d7da', border: '2px solid #dc3545', padding: '15px', marginBottom: '25px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#721c24', marginBottom: '10px' }}>
            ⚠️ ADVERTENCIA ⚠️
          </div>
          <div style={{ fontSize: '14px', color: '#721c24' }}>
            Esta acción es irreversible<br />
            Los registros del calendario serán eliminados permanentemente
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
          Davidario - Versión 1.0 · © 2026
        </div>
      </div>
    </div>
  );
};

export default EliminarExamenView;
