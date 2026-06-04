import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gradosService, Grado } from '../../../services/grados.service';

const EditarGradoView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [gradoOriginal, setGradoOriginal] = useState<Grado | null>(null);
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchGrado = async () => {
      if (!id) return;
      try {
        const data = await gradosService.findOne(id);
        setGradoOriginal(data);
        setFormData({
          codigo: data.codigo,
          nombre: data.nombre,
          descripcion: data.descripcion || ''
        });
      } catch (err) {
        alert('❌ Error al cargar los datos del grado.');
        navigate('/admin/grados');
      } finally {
        setLoading(false);
      }
    };
    fetchGrado();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const hayCambios = () => {
    if (!gradoOriginal) return false;
    return formData.nombre.trim() !== gradoOriginal.nombre || 
           formData.descripcion.trim() !== (gradoOriginal.descripcion || '');
  };

  const handleGuardar = async () => {
    if (!id || !gradoOriginal) return;

    const { nombre, descripcion } = formData;

    if (!nombre.trim() || !descripcion.trim()) {
      alert('❌ El nombre y la descripción son obligatorios.');
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

    const confirmar = window.confirm(
      `¿Guardar los cambios del grado "${gradoOriginal.codigo}"?\n\nNombre: ${nombre.trim()}\n\nDescripción: ${descripcion.trim()}`
    );

    if (confirmar) {
      setSaving(true);
      try {
        await gradosService.update(id, {
          nombre: nombre.trim(),
          descripcion: descripcion.trim()
        });
        alert('✅ Cambios guardados exitosamente.');
        navigate('/admin/grados');
      } catch (err: any) {
        alert(`❌ Error al actualizar el grado: ${err.response?.data?.message || 'Error desconocido'}`);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleContinuarEditando = () => {
    if (hayCambios()) {
      alert('📌 Continuando con la edición...\n\nLos cambios no guardados se mantendrán en el formulario.');
    } else {
      alert('📌 No hay cambios pendientes. Puede seguir editando el grado.');
    }
  };

  const handleCancelar = () => {
    if (hayCambios()) {
      if (window.confirm('⚠️ Hay cambios sin guardar.\n\n¿Estás seguro de que deseas cancelar? Los cambios se perderán.')) {
        navigate('/admin/grados');
      }
    } else {
      navigate('/admin/grados');
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Cargando datos del grado...</div>;
  }

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
        }}>EDITAR GRADO ACADÉMICO</h1>

        <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', color: '#555' }}>
          📝 Datos del grado:
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
          <label htmlFor="descripcion" style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Descripción:</label>
          <textarea 
            id="descripcion" 
            value={formData.descripcion}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px 12px', fontFamily: 'inherit', fontSize: '14px', border: '1px solid #bdbdbd', background: 'white', resize: 'vertical', minHeight: '100px', line_height: '1.5' }}
          ></textarea>
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

export default EditarGradoView;
