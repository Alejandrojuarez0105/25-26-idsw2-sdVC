import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Profesor, profesoresService } from '../../../services/profesores.service';

interface ProfesorConCodigo extends Profesor {
  codigoMostrado?: string;
}

const EliminarProfesorView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const profesores: ProfesorConCodigo[] = location.state?.profesores || [];

  if (profesores.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', fontFamily: '"Courier New", monospace' }}>
        <p>No hay profesores seleccionados para eliminar.</p>
        <button onClick={() => navigate('/admin/profesores')}>Volver</button>
      </div>
    );
  }

  const getCodigo = (p: ProfesorConCodigo) => p.codigoMostrado || 'N/A';

  const handleConfirm = async () => {
    const resumen = profesores
      .map(p => `- ${getCodigo(p)} - ${p.usuario?.nombre} ${p.usuario?.apellido} (${p.departamento || 'Sin departamento'})`)
      .join('\n');

    const confirmacion = window.confirm(
      `⚠️ ELIMINACIÓN PERMANENTE ⚠️\n\n¿Está ABSOLUTAMENTE seguro de que desea eliminar ${profesores.length === 1 ? 'el profesor seleccionado' : `los ${profesores.length} profesores seleccionados`}?\n\n${resumen}\n\nEsta acción:\n- Es IRREVERSIBLE\n- Se eliminarán las asignaciones de asignaturas vinculadas al profesor\n- Se revocará su cuenta de acceso al sistema\n\nNo podrá recuperar los datos una vez eliminados.`
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

          for (const profesor of profesores) {
            try {
              await profesoresService.remove(profesor.id);
              success++;
            } catch (err: any) {
              const mensaje = err?.response?.data?.message || `Error al eliminar profesor "${getCodigo(profesor)}".`;
              errors.push(mensaje);
            }
          }

          if (errors.length === 0) {
            alert(`✅ ${success} profesor(es) eliminado(s) correctamente.`);
          } else {
            alert(
              `⚠️ Proceso completado con incidencias:\n✅ Éxito: ${success}\n❌ Fallos: ${errors.length}\n\nDetalles:\n${errors.join('\n')}`
            );
          }
          navigate('/admin/profesores');
        } else if (check !== null) {
          alert('❌ Texto incorrecto. Eliminación cancelada.');
        }
      }
    }
  };

  const handleCancel = () => {
    navigate('/admin/profesores');
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
          ELIMINAR PROFESOR
        </h1>

        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
          ¿Está seguro de eliminar {profesores.length === 1 ? 'este profesor' : 'estos profesores'}?
        </div>

        <div style={{ background: '#f5f5f5', border: '1px solid #bdbdbd', padding: '15px', marginBottom: '20px' }}>
          {profesores.map((profesor) => (
            <div key={profesor.id} style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: profesores.length > 1 ? '1px dashed #ccc' : 'none' }}>
              <div style={{ marginBottom: '5px', fontSize: '15px' }}>
                <strong>Código:</strong> {getCodigo(profesor)}
              </div>
              <div style={{ marginBottom: '5px', fontSize: '15px' }}>
                <strong>Nombre:</strong> {profesor.usuario?.nombre} {profesor.usuario?.apellido}
              </div>
              <div style={{ marginBottom: '5px', fontSize: '15px' }}>
                <strong>Email:</strong> {profesor.usuario?.email}
              </div>
              <div style={{ marginBottom: '5px', fontSize: '15px' }}>
                <strong>Departamento:</strong> {profesor.departamento || 'N/A'}
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff3cd', borderLeft: '4px solid #ffc107', padding: '12px 15px', marginBottom: '20px' }}>
          <strong style={{ display: 'block', marginBottom: '5px' }}>📚 Repercusión académica:</strong>
          Si {profesores.length === 1 ? 'el profesor tiene' : 'alguno de los profesores tiene'} asignaturas o exámenes vinculados, sus asignaciones serán eliminadas en cascada del sistema.
        </div>

        <div style={{ background: '#f8d7da', border: '2px solid #dc3545', padding: '15px', marginBottom: '25px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#721c24', marginBottom: '10px' }}>
            ⚠️ ADVERTENCIA ⚠️
          </div>
          <div style={{ fontSize: '14px', color: '#721c24' }}>
            Esta acción es irreversible<br />
            El profesor y toda su información asociada serán eliminados permanentemente
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

export default EliminarProfesorView;
