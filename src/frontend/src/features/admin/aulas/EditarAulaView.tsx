import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { aulasService, Aula } from '../../../services/aulas.service';

const EditarAulaView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [aulaOriginal, setAulaOriginal] = useState<Aula | null>(null);
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    capacidad: 0,
    ubicacion: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAula = async () => {
      if (!id) return;
      try {
        const data = await aulasService.findOne(id);
        setAulaOriginal(data);
        setFormData({
          codigo: data.codigo,
          nombre: data.nombre,
          capacidad: data.capacidad,
          ubicacion: data.ubicacion || ''
        });
      } catch (err) {
        alert('❌ Error al cargar los datos del aula.');
        navigate('/admin/aulas');
      } finally {
        setLoading(false);
      }
    };
    fetchAula();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === 'capacidad' ? parseInt(value) || 0 : value
    }));
  };

  const hayCambios = () => {
    if (!aulaOriginal) return false;
    return formData.nombre.trim() !== aulaOriginal.nombre || 
           formData.capacidad !== aulaOriginal.capacidad ||
           formData.ubicacion.trim() !== (aulaOriginal.ubicacion || '');
  };

  const handleGuardar = async () => {
    if (!id || !aulaOriginal) return;

    const { nombre, capacidad, ubicacion } = formData;

    if (!nombre.trim() || !ubicacion.trim()) {
      alert('❌ El nombre y la ubicación son obligatorios.');
      return;
    }

    if (nombre.trim().length < 3) {
      alert('❌ El nombre debe tener al menos 3 caracteres.');
      return;
    }

    if (capacidad < 1) {
      alert('❌ La capacidad del aula debe ser al menos 1.');
      return;
    }

    if (!hayCambios()) {
      alert('ℹ️ No se detectaron cambios para guardar.');
      return;
    }

    const confirmar = window.confirm(
      `¿Desea guardar los cambios del aula "${aulaOriginal.codigo}"?\n\nNombre: ${nombre.trim()}\nCapacidad: ${capacidad}\nUbicación: ${ubicacion.trim()}`
    );

    if (confirmar) {
      setSaving(true);
      try {
        await aulasService.update(id, {
          nombre: nombre.trim(),
          capacidad: capacidad,
          ubicacion: ubicacion.trim()
        });
        alert('✅ Cambios guardados exitosamente.');
        navigate('/admin/aulas');
      } catch (err: any) {
        alert(`❌ Error al actualizar el aula: ${err.response?.data?.message || 'Error desconocido'}`);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleContinuarEditando = () => {
    if (hayCambios()) {
      alert('📌 Continuando con la edición...\n\nLos cambios no guardados se mantendrán en el formulario.');
    } else {
      alert('📌 No hay cambios pendientes. Puede seguir editando el aula.');
    }
  };

  const handleCancelar = () => {
    if (hayCambios()) {
      if (!window.confirm('⚠️ Hay cambios sin guardar.\n\n¿Estás seguro de que deseas cancelar? Los cambios se perderán.')) {
        return;
      }
    }
    navigate('/admin/aulas');
  };

  if (loading) {
    return (
      <div style={{ background: '#e9e9e9', fontFamily: '"Courier New", monospace', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <h2>Cargando datos del aula...</h2>
      </div>
    );
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
        width: '550px', 
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
        }}>EDITAR AULA</h1>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="codigo" style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Código:</label>
          <input 
            type="text" 
            id="codigo" 
            value={formData.codigo}
            disabled
            style={{ 
              width: '100%', 
              padding: '10px 12px', 
              fontFamily: 'inherit', 
              fontSize: '16px', 
              border: '1px solid #bdbdbd', 
              background: '#dfdfdf', 
              color: '#555',
              cursor: 'not-allowed'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="nombre" style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Nombre:</label>
          <input 
            type="text" 
            id="nombre" 
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej: Aula 101"
            maxLength={100}
            style={{ width: '100%', padding: '10px 12px', fontFamily: 'inherit', fontSize: '16px', border: '1px solid #bdbdbd', background: 'white' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="capacidad" style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Capacidad:</label>
          <input 
            type="number" 
            id="capacidad" 
            value={formData.capacidad || ''}
            onChange={handleChange}
            placeholder="Ej: 30"
            min={1}
            style={{ width: '100%', padding: '10px 12px', fontFamily: 'inherit', fontSize: '16px', border: '1px solid #bdbdbd', background: 'white' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="ubicacion" style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Ubicación:</label>
          <input 
            type="text" 
            id="ubicacion" 
            value={formData.ubicacion}
            onChange={handleChange}
            placeholder="Ej: Planta 1"
            maxLength={100}
            style={{ width: '100%', padding: '10px 12px', fontFamily: 'inherit', fontSize: '16px', border: '1px solid #bdbdbd', background: 'white' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
            <button 
              onClick={handleGuardar}
              disabled={saving}
              style={{ flex: 1, padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#28a745', color: 'white' }}
            >
              {saving ? 'Guardando...' : '💾 Guardar cambios'}
            </button>
            
            <button 
              onClick={handleContinuarEditando}
              style={{ flex: 1, padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#2d89ef', color: 'white' }}
            >
              📌 Continuar editando
            </button>
          </div>

          <button 
            onClick={handleCancelar}
            style={{ padding: '12px 20px', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#f3f0ec', color: 'black' }}
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

export default EditarAulaView;
