import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Grado, gradosService } from '../../../services/grados.service';

const EliminarGradoView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const degrees: Grado[] = location.state?.degrees || [];

  if (degrees.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>No hay grados seleccionados para eliminar.</p>
        <button onClick={() => navigate('/admin/grados')}>Volver</button>
      </div>
    );
  }

  const handleConfirm = async () => {
    const confirmacion = window.confirm(
      `⚠️ ELIMINACIÓN PERMANENTE ⚠️\n\n¿Está seguro de que desea eliminar los ${degrees.length} grados seleccionados?\n\nEsta acción:\n- Es IRREVERSIBLE\n- Eliminará las asignaturas asociadas\n- Afectará a los estudiantes matriculados\n\nNo podrá recuperar los datos una vez eliminados.`
    );

    if (confirmacion) {
      const confirmacionFinal = window.confirm(
        `ÚLTIMA ADVERTENCIA\n\n¿Realmente desea proceder con la eliminación?`
      );

      if (confirmacionFinal) {
        const check = window.prompt('Escriba "ELIMINAR" para confirmar la eliminación:');
        if (check === 'ELIMINAR') {
          try {
            await Promise.all(degrees.map(g => gradosService.remove(g.id)));
            alert(`✅ ${degrees.length} grado(s) eliminado(s) correctamente.`);
            navigate('/admin/grados');
          } catch (err) {
            alert('❌ Error al eliminar los grados. Es posible que tengan dependencias activas.');
            navigate('/admin/grados');
          }
        } else if (check !== null) {
          alert('❌ Texto incorrecto. Eliminación cancelada.');
        }
      }
    }
  };

  const handleCancel = () => {
    navigate('/admin/grados');
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
        }}>ELIMINAR GRADO ACADÉMICO</h1>

        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
          ¿Está seguro de eliminar {degrees.length === 1 ? 'este grado académico' : 'estos grados académicos'}?
        </div>

        <div style={{ background: '#f5f5f5', border: '1px solid #bdbdbd', padding: '15px', marginBottom: '20px' }}>
          {degrees.map((grado) => (
            <div key={grado.id} style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: degrees.length > 1 ? '1px dashed #ccc' : 'none' }}>
              <div style={{ marginBottom: '5px', fontSize: '15px' }}>
                <strong>Código:</strong> {grado.codigo}
              </div>
              <div style={{ marginBottom: '5px', fontSize: '15px' }}>
                <strong>Nombre:</strong> {grado.nombre}
              </div>
              {grado.descripcion && (
                <div style={{ background: '#e9ecef', padding: '10px', marginTop: '10px', fontSize: '14px', fontStyle: 'italic', color: '#555' }}>
                  {grado.descripcion}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ background: '#fff3cd', borderLeft: '4px solid #ffc107', padding: '12px 15px', marginBottom: '20px' }}>
          <strong style={{ display: 'block', marginBottom: '5px' }}>📚 Asignaturas asociadas:</strong>
          Se eliminarán todas las dependencias vinculadas a {degrees.length === 1 ? 'este grado' : 'estos grados'}.
        </div>

        <div style={{ background: '#f8d7da', border: '2px solid #dc3545', padding: '15px', marginBottom: '25px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#721c24', marginBottom: '10px' }}>
            ⚠️ ADVERTENCIA ⚠️
          </div>
          <div style={{ fontSize: '14px', color: '#721c24' }}>
            Esta acción es irreversible<br />
            Todas las asignaturas asociadas también serán eliminadas
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

export default EliminarGradoView;
