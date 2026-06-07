import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Aula, aulasService } from '../../../services/aulas.service';

const EliminarAulaView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const aulas: Aula[] = location.state?.aulas || [];

  if (aulas.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', fontFamily: '"Courier New", monospace' }}>
        <p>No hay aulas seleccionadas para eliminar.</p>
        <button onClick={() => navigate('/admin/aulas')}>Volver</button>
      </div>
    );
  }

  const handleConfirm = async () => {
    const resumen = aulas.map(a => `- ${a.codigo} - ${a.nombre} (Cap: ${a.capacidad})`).join('\n');
    const confirmacion = window.confirm(
      `⚠️ ELIMINACIÓN PERMANENTE ⚠️\n\n¿Está ABSOLUTAMENTE seguro de que desea eliminar ${aulas.length === 1 ? 'el aula seleccionada' : `las ${aulas.length} aulas seleccionadas`}?\n\n${resumen}\n\nEsta acción:\n- Es IRREVERSIBLE\n- Los exámenes programados deberán ser reasignados a otras aulas\n- Afectará la disponibilidad de espacios\n\nNo podrá recuperar los datos una vez eliminados.`
    );

    if (confirmacion) {
      const confirmacionFinal = window.confirm(
        `ÚLTIMA ADVERTENCIA\n\n¿Realmente desea proceder con la eliminación?`
      );

      if (confirmacionFinal) {
        const check = window.prompt('Escriba "ELIMINAR" para confirmar la eliminación:');
        if (check === 'ELIMINAR') {
          const errors: string[] = [];
          let success = 0;

          for (const aula of aulas) {
            try {
              await aulasService.remove(aula.id);
              success++;
            } catch (err: any) {
              const mensaje = err?.response?.data?.message || `Error al eliminar "${aula.nombre}".`;
              errors.push(mensaje);
            }
          }

          if (errors.length === 0) {
            alert(`✅ ${success} aula(s) eliminada(s) correctamente.`);
          } else {
            alert(
              `⚠️ Proceso completado con incidencias:\n✅ Éxito: ${success}\n❌ Fallos: ${errors.length}\n\nDetalles:\n${errors.join('\n')}`
            );
          }
          navigate('/admin/aulas');
        } else if (check !== null) {
          alert('❌ Texto incorrecto. Eliminación cancelada.');
        }
      }
    }
  };

  const handleCancel = () => {
    navigate('/admin/aulas');
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
        width: '620px',
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
        }}>
          ELIMINAR AULA
        </h1>

        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
          ¿Está seguro de eliminar {aulas.length === 1 ? 'esta aula' : 'estas aulas'}?
        </div>

        <div style={{ background: '#f5f5f5', border: '1px solid #bdbdbd', padding: '15px', marginBottom: '20px' }}>
          {aulas.map((aula) => (
            <div key={aula.id} style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: aulas.length > 1 ? '1px dashed #ccc' : 'none' }}>
              <div style={{ marginBottom: '5px', fontSize: '15px' }}>
                <strong>Código:</strong> {aula.codigo}
              </div>
              <div style={{ marginBottom: '5px', fontSize: '15px' }}>
                <strong>Nombre:</strong> {aula.nombre}
              </div>
              <div style={{ marginBottom: '5px', fontSize: '15px' }}>
                <strong>Capacidad:</strong> {aula.capacidad} plazas
              </div>
              {aula.ubicacion && (
                <div style={{ background: '#e9ecef', padding: '8px 10px', marginTop: '8px', fontSize: '14px', fontStyle: 'italic', color: '#555' }}>
                  📍 {aula.ubicacion}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ background: '#fff3cd', borderLeft: '4px solid #ffc107', padding: '12px 15px', marginBottom: '20px' }}>
          <strong style={{ display: 'block', marginBottom: '5px' }}>📝 Exámenes programados:</strong>
          Si {aulas.length === 1 ? 'el aula tiene' : 'alguna de las aulas tiene'} exámenes programados, deberán ser reasignados a otras aulas tras la eliminación.
        </div>

        <div style={{ background: '#f8d7da', border: '2px solid #dc3545', padding: '15px', marginBottom: '25px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#721c24', marginBottom: '10px' }}>
            ⚠️ ADVERTENCIA ⚠️
          </div>
          <div style={{ fontSize: '14px', color: '#721c24' }}>
            Esta acción es irreversible<br />
            Los registros eliminados no podrán recuperarse
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

export default EliminarAulaView;
