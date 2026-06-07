import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { aulasService } from '../../../services/aulas.service';

const CrearAulaView: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    capacidad: 0,
    ubicacion: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === 'capacidad' ? parseInt(value) || 0 : value
    }));
  };

  const handleCrear = async () => {
    const { codigo, nombre, capacidad, ubicacion } = formData;

    if (!codigo.trim() || !nombre.trim() || !ubicacion.trim()) {
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

    if (capacidad < 1) {
      alert('❌ La capacidad del aula debe ser al menos 1.');
      return;
    }

    const confirmar = window.confirm(
      `¿Desea crear la siguiente aula?\n\nCódigo: ${codigo.trim().toUpperCase()}\nNombre: ${nombre.trim()}\nCapacidad: ${capacidad}\nUbicación: ${ubicacion.trim()}`
    );

    if (confirmar) {
      setLoading(true);
      try {
        await aulasService.create({
          codigo: codigo.trim().toUpperCase(),
          nombre: nombre.trim(),
          capacidad: capacidad,
          ubicacion: ubicacion.trim(),
        });
        alert('✅ ¡Aula creada exitosamente!');
        navigate('/admin/aulas');
      } catch (err: any) {
        alert(`❌ Error al crear el aula: ${err.response?.data?.message || 'Error desconocido'}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancelar = () => {
    if (formData.codigo || formData.nombre || formData.capacidad > 0 || formData.ubicacion) {
      if (!window.confirm('¿Estás seguro de que deseas cancelar?\n\nLos datos ingresados se perderán.')) {
        return;
      }
    }
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
        }}>CREAR NUEVA AULA</h1>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="codigo" style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Código:</label>
          <input 
            type="text" 
            id="codigo" 
            value={formData.codigo}
            onChange={handleChange}
            placeholder="Ej: A-101, LAB-2..." 
            maxLength={20}
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
            placeholder="Ej: Aula 101, Laboratorio de Química"
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
            placeholder="Ej: Edificio A - Planta 1"
            maxLength={100}
            style={{ width: '100%', padding: '10px 12px', fontFamily: 'inherit', fontSize: '16px', border: '1px solid #bdbdbd', background: 'white' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
          <button 
            onClick={handleCrear}
            disabled={loading}
            style={{ minWidth: '150px', padding: '10px 20px', borderRadius: '4px', fontSize: '16px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#28a745', color: 'white' }}
          >
            {loading ? 'Procesando...' : 'Crear aula'}
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

export default CrearAulaView;
