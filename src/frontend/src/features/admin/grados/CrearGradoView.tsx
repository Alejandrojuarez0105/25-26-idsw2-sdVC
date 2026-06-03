import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gradosService } from '../../../services/grados.service';

const CrearGradoView: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCrear = async () => {
    const { codigo, nombre, descripcion } = formData;

    if (!codigo.trim() || !nombre.trim() || !descripcion.trim()) {
      alert('❌ Todos los campos son obligatorios.');
      return;
    }

    if (codigo.trim().length < 2) {
      alert('❌ El código debe tener al menos 2 caracteres.');
      return;
    }

    const regex = /^[A-Z0-9-]+$/i;
    if (!regex.test(codigo.trim())) {
      alert('❌ El código solo puede contener letras, números y guiones.');
      return;
    }

    const confirmar = window.confirm(
      `¿Desea crear el siguiente grado académico?\n\nCódigo: ${codigo.trim().toUpperCase()}\nNombre: ${nombre.trim()}\nDescripción: ${descripcion.trim()}`
    );

    if (confirmar) {
      setLoading(true);
      try {
        await gradosService.create({
          ...formData,
          codigo: codigo.trim().toUpperCase(),
          nombre: nombre.trim(),
          descripcion: descripcion.trim()
        });
        alert('✅ ¡Grado académico creado exitosamente!');
        navigate('/admin/grados');
      } catch (err: any) {
        alert(`❌ Error al crear el grado: ${err.response?.data?.message || 'Error desconocido'}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancelar = () => {
    if (formData.codigo || formData.nombre || formData.descripcion) {
      if (!window.confirm('¿Estás seguro de que deseas cancelar?\n\nLos datos ingresados se perderán.')) {
        return;
      }
    }
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
        }}>CREAR NUEVO GRADO ACADÉMICO</h1>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="codigo" style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Código:</label>
          <input 
            type="text" 
            id="codigo" 
            value={formData.codigo}
            onChange={handleChange}
            placeholder="Ej: GII, GIOI, GADE..." 
            maxLength={10}
            style={{ width: '100%', padding: '10px 12px', fontFamily: 'inherit', fontSize: '16px', border: '1px solid #bdbdbd', background: 'white' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="nombre" style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Nombre:</label>
          <input 
            type="text" 
            id="nombre" 
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej: Ingeniería Informática"
            style={{ width: '100%', padding: '10px 12px', fontFamily: 'inherit', fontSize: '16px', border: '1px solid #bdbdbd', background: 'white' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="descripcion" style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Descripción:</label>
          <textarea 
            id="descripcion" 
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Ej: Grado en Ingeniería Informática"
            style={{ width: '100%', padding: '10px 12px', fontFamily: 'inherit', fontSize: '16px', border: '1px solid #bdbdbd', background: 'white', resize: 'vertical', minHeight: '80px' }}
          ></textarea>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
          <button 
            onClick={handleCrear}
            disabled={loading}
            style={{ minWidth: '150px', padding: '10px 20px', borderRadius: '4px', fontSize: '16px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#28a745', color: 'white' }}
          >
            {loading ? 'Procesando...' : 'Crear grado'}
          </button>
          <button 
            onClick={handleCancelar}
            style={{ minWidth: '150px', padding: '10px 20px', borderRadius: '4px', fontSize: '16px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#f3f0ec', color: 'black' }}
          >
            Cancelar
          </button>
        </div>

        <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '11px', color: '#666' }}>
          Versión 1.0 · © 2026
        </div>
      </div>
    </div>
  );
};

export default CrearGradoView;
