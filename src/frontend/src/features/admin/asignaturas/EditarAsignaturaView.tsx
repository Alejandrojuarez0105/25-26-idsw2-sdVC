import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { asignaturasService, Asignatura } from '../../../services/asignaturas.service';
import { gradosService, Grado } from '../../../services/grados.service';

const EditarAsignaturaView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [asignaturaOriginal, setAsignaturaOriginal] = useState<Asignatura | null>(null);
  const [grados, setGrados] = useState<Grado[]>([]);
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    creditos: 0,
    anio: 1,
    gradoId: '',
    descripcion: '' // UI Only if not in DB
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [asignaturaData, gradosData] = await Promise.all([
          asignaturasService.findOne(id),
          gradosService.findAll()
        ]);
        
        setAsignaturaOriginal(asignaturaData);
        setGrados(gradosData);
        
        setFormData({
          codigo: asignaturaData.codigo,
          nombre: asignaturaData.nombre,
          creditos: asignaturaData.creditos,
          anio: asignaturaData.anio ?? 1,
          gradoId: asignaturaData.gradoId,
          descripcion: '' // Placeholder
        });
      } catch (err) {
        alert('❌ Error al cargar los datos.');
        navigate('/admin/asignaturas');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: (id === 'creditos' || id === 'anio') ? parseInt(value) || 0 : value
    }));
  };

  const hayCambios = () => {
    if (!asignaturaOriginal) return false;
    return formData.nombre.trim() !== asignaturaOriginal.nombre ||
           formData.creditos !== asignaturaOriginal.creditos ||
           formData.anio !== (asignaturaOriginal.anio ?? 1) ||
           formData.gradoId !== asignaturaOriginal.gradoId;
  };

  const handleGuardar = async () => {
    if (!id || !asignaturaOriginal) return;

    const { nombre, creditos, gradoId } = formData;

    if (!nombre.trim() || !gradoId) {
      alert('❌ El nombre y el grado son obligatorios.');
      return;
    }

    if (nombre.trim().length < 3) {
      alert('❌ El nombre debe tener al menos 3 caracteres.');
      return;
    }

    if (!hayCambios()) {
      alert('ℹ️ No se detectaron cambios para guardar.');
      return;
    }

    const gradoSeleccionado = grados.find(g => g.id === gradoId);
    const confirmar = window.confirm(
      `¿Guardar los cambios de la asignatura "${asignaturaOriginal.codigo}"?\n\nNombre: ${nombre.trim()}\nCréditos: ${creditos}\nGrado: ${gradoSeleccionado?.nombre}`
    );

    if (confirmar) {
      setSaving(true);
      try {
        await asignaturasService.update(id, {
          nombre: nombre.trim(),
          creditos: creditos,
          anio: formData.anio,
          gradoId: gradoId
        });
        alert('✅ Cambios guardados exitosamente.');
        navigate('/admin/asignaturas');
      } catch (err: any) {
        alert(`❌ Error al actualizar la asignatura: ${err.response?.data?.message || 'Error desconocido'}`);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleContinuarEditando = () => {
    if (hayCambios()) {
      alert('📌 Continuando con la edición...\n\nLos cambios no guardados se mantendrán en el formulario.');
    } else {
      alert('📌 No hay cambios pendientes.');
    }
  };

  const handleCancelar = () => {
    if (hayCambios()) {
      if (window.confirm('⚠️ Hay cambios sin guardar.\n\n¿Estás seguro de que deseas cancelar?')) {
        navigate('/admin/asignaturas');
      }
    } else {
      navigate('/admin/asignaturas');
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Cargando datos...</div>;
  }

  const gradoAsignado = grados.find(g => g.id === asignaturaOriginal?.gradoId);

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
        padding: '25px', 
        border: '1px solid #cfcfcf' 
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          fontSize: '24px', 
          fontWeight: 'bold', 
          textDecoration: 'underline', 
          marginBottom: '30px', 
          letterSpacing: '1px' 
        }}>EDITAR ASIGNATURA</h1>

        <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', color: '#555' }}>
          📚 Datos de la asignatura:
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="codigo" style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Código:</label>
          <input 
            type="text" 
            id="codigo" 
            value={formData.codigo}
            readOnly 
            disabled
            style={{ width: '100%', padding: '10px 12px', fontFamily: 'inherit', fontSize: '16px', border: '1px solid #bdbdbd', background: '#e9ecef', color: '#666', cursor: 'not-allowed' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="nombre" style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Nombre:</label>
          <input 
            type="text" 
            id="nombre" 
            value={formData.nombre}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px 12px', fontFamily: 'inherit', fontSize: '16px', border: '1px solid #bdbdbd', background: 'white' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="creditos" style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Créditos:</label>
          <input 
            type="number" 
            id="creditos" 
            value={formData.creditos}
            onChange={handleChange}
            min={1}
            max={12}
            style={{ width: '100%', padding: '10px 12px', fontFamily: 'inherit', fontSize: '16px', border: '1px solid #bdbdbd', background: 'white' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="anio" style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Año (curso):</label>
          <select
            id="anio"
            value={formData.anio}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px 12px', fontFamily: 'inherit', fontSize: '16px', border: '1px solid #bdbdbd', background: 'white', cursor: 'pointer' }}
          >
            <option value={1}>1.º</option>
            <option value={2}>2.º</option>
            <option value={3}>3.º</option>
            <option value={4}>4.º</option>
          </select>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            Usado por la generación automática para separar exámenes por grado + año.
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="gradoId" style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Grado:</label>
          <select
            id="gradoId"
            value={formData.gradoId}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px 12px', fontFamily: 'inherit', fontSize: '16px', border: '1px solid #bdbdbd', background: 'white', cursor: 'pointer' }}
          >
            {grados.map(grado => (
              <option key={grado.id} value={grado.id}>
                {grado.codigo} - {grado.nombre}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="descripcion" style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Descripción:</label>
          <textarea 
            id="descripcion" 
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Introduzca descripción (opcional)..."
            style={{ width: '100%', padding: '10px 12px', fontFamily: 'inherit', fontSize: '14px', border: '1px solid #bdbdbd', background: 'white', resize: 'vertical', minHeight: '100px', fontStyle: 'italic' }}
          ></textarea>
        </div>

        <div style={{ background: '#e7f3ff', padding: '12px 15px', margin: '20px 0', borderLeft: '4px solid #2d89ef', fontSize: '14px', fontStyle: 'italic', color: '#2c3e50' }}>
          💡 La asignatura pertenece al grado de {gradoAsignado?.nombre} y tiene una carga de {formData.creditos} créditos ECTS.
        </div>

        <hr style={{ border: 'none', borderTop: '2px solid #cfcfcf', margin: '25px 0 20px 0' }} />

        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px', flexWrap: 'wrap' }}>
          <button 
            onClick={handleGuardar}
            disabled={saving}
            style={{ minWidth: '150px', padding: '10px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#28a745', color: 'white' }}
          >
            💾 Guardar cambios
          </button>
          <button 
            onClick={handleContinuarEditando}
            style={{ minWidth: '150px', padding: '10px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#2d89ef', color: 'white' }}
          >
            📌 Continuar editando
          </button>
          <button 
            onClick={handleCancelar}
            style={{ minWidth: '150px', padding: '10px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#f3f0ec', color: 'black' }}
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

export default EditarAsignaturaView;
