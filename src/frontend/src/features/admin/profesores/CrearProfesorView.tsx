import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { profesoresService } from '../../../services/profesores.service';

const DEPARTAMENTOS = [
  'Informática',
  'Matemáticas',
  'Física',
  'Química',
  'Administración',
  'Psicología',
  'Ingeniería Civil',
  'Electrónica',
];

const CrearProfesorView: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    email: '',
    departamento: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCrear = async () => {
    const { codigo, nombre, email, departamento } = formData;

    if (!codigo.trim()) {
      alert('❌ El código es obligatorio.');
      return;
    }
    if (codigo.trim().length < 3) {
      alert('❌ El código debe tener al menos 3 caracteres.');
      return;
    }
    const regexCodigo = /^[A-Z0-9-]+$/i;
    if (!regexCodigo.test(codigo.trim())) {
      alert('❌ El código solo puede contener letras, números y guiones.');
      return;
    }

    if (!nombre.trim()) {
      alert('❌ El nombre es obligatorio.');
      return;
    }
    if (nombre.trim().length < 3) {
      alert('❌ El nombre debe tener al menos 3 caracteres.');
      return;
    }

    if (!email.trim()) {
      alert('❌ El email es obligatorio.');
      return;
    }
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email.trim())) {
      alert('❌ El email no es válido.\n\nEjemplo: nombre@dominio.com');
      return;
    }

    if (!departamento) {
      alert('❌ Debe seleccionar un departamento.');
      return;
    }

    const codigoUpper = codigo.trim().toUpperCase();
    const confirmar = window.confirm(
      `¿Desea crear el siguiente profesor?\n\nCódigo: ${codigoUpper}\nNombre: ${nombre.trim()}\nEmail: ${email.trim()}\nDepartamento: ${departamento}`
    );

    if (confirmar) {
      setLoading(true);
      try {
        await profesoresService.create({
          codigo: codigoUpper,
          nombre: nombre.trim(),
          email: email.trim(),
          departamento,
        });
        alert('✅ ¡Profesor creado exitosamente!');
        navigate('/admin/profesores');
      } catch (err: any) {
        alert(`❌ Error al crear el profesor: ${err.response?.data?.message || 'Error desconocido'}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancelar = () => {
    if (formData.codigo || formData.nombre || formData.email || formData.departamento) {
      if (!window.confirm('¿Estás seguro de que deseas cancelar?\n\nLos datos ingresados se perderán.')) {
        return;
      }
    }
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
        }}>CREAR NUEVO PROFESOR</h1>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="codigo" style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Código:</label>
          <input
            type="text"
            id="codigo"
            value={formData.codigo}
            onChange={handleChange}
            placeholder="Ej: PRO005"
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
            placeholder="Ej: Manuel Masías"
            style={{ width: '100%', padding: '10px 12px', fontFamily: 'inherit', fontSize: '16px', border: '1px solid #bdbdbd', background: 'white' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="email" style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Email:</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Ej: profesor@uneatlantico.es"
            style={{ width: '100%', padding: '10px 12px', fontFamily: 'inherit', fontSize: '16px', border: '1px solid #bdbdbd', background: 'white' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="departamento" style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Departamento:</label>
          <select
            id="departamento"
            value={formData.departamento}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px 12px', fontFamily: 'inherit', fontSize: '16px', border: '1px solid #bdbdbd', background: 'white', cursor: 'pointer' }}
          >
            <option value="">-- Seleccionar departamento --</option>
            {DEPARTAMENTOS.map(dep => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
          <button
            onClick={handleCrear}
            disabled={loading}
            style={{ minWidth: '150px', padding: '10px 20px', borderRadius: '4px', fontSize: '16px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#28a745', color: 'white' }}
          >
            {loading ? 'Procesando...' : 'Crear profesor'}
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

export default CrearProfesorView;
