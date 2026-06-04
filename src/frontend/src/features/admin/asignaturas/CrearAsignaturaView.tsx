import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { asignaturasService } from '../../../services/asignaturas.service';
import { gradosService, Grado } from '../../../services/grados.service';

const CrearAsignaturaView: React.FC = () => {
  const navigate = useNavigate();
  const [grados, setGrados] = useState<Grado[]>([]);
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    creditos: 6,
    gradoId: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingGrados, setLoadingGrados] = useState(true);

  useEffect(() => {
    const fetchGrados = async () => {
      try {
        const data = await gradosService.findAll();
        setGrados(data);
      } catch (err) {
        alert('❌ Error al cargar los grados académicos.');
      } finally {
        setLoadingGrados(false);
      }
    };
    fetchGrados();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [id]: id === 'creditos' ? parseInt(value) || 0 : value 
    }));
  };

  const handleCrear = async () => {
    const { codigo, nombre, creditos, gradoId } = formData;

    if (!codigo.trim() || !nombre.trim() || !gradoId) {
      alert('❌ Los campos Código, Nombre y Grado son obligatorios.');
      return;
    }

    if (codigo.trim().length < 3) {
      alert('❌ El código debe tener al menos 3 caracteres.');
      return;
    }

    if (creditos < 1 || creditos > 12) {
      alert('❌ Los créditos deben estar entre 1 y 12.');
      return;
    }

    const regex = /^[A-Z0-9-]+$/i;
    if (!regex.test(codigo.trim())) {
      alert('❌ El código solo puede contener letras, números y guiones.');
      return;
    }

    const gradoSeleccionado = grados.find(g => g.id === gradoId);
    
    const confirmar = window.confirm(
      `¿Desea crear la siguiente asignatura?\n\nCódigo: ${codigo.trim().toUpperCase()}\nNombre: ${nombre.trim()}\nCréditos: ${creditos}\nGrado: ${gradoSeleccionado?.nombre}`
    );

    if (confirmar) {
      setLoading(true);
      try {
        await asignaturasService.create({
          ...formData,
          codigo: codigo.trim().toUpperCase(),
          nombre: nombre.trim()
        });
        alert('✅ ¡Asignatura creada exitosamente!');
        navigate('/admin/asignaturas');
      } catch (err: any) {
        alert(`❌ Error al crear la asignatura: ${err.response?.data?.message || 'Error desconocido'}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancelar = () => {
    if (formData.codigo || formData.nombre || formData.gradoId) {
      if (!window.confirm('¿Estás seguro de que deseas cancelar?\n\nLos datos ingresados se perderán.')) {
        return;
      }
    }
    navigate('/admin/asignaturas');
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
        }}>CREAR NUEVA ASIGNATURA</h1>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="codigo" style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Código:</label>
          <input 
            type="text" 
            id="codigo" 
            value={formData.codigo}
            onChange={handleChange}
            placeholder="Ej: IYA003, MAT101..." 
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
            placeholder="Ej: Programación I"
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
          <label htmlFor="gradoId" style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Grado:</label>
          <select 
            id="gradoId" 
            value={formData.gradoId}
            onChange={handleChange}
            disabled={loadingGrados}
            style={{ width: '100%', padding: '10px 12px', fontFamily: 'inherit', fontSize: '16px', border: '1px solid #bdbdbd', background: 'white', cursor: 'pointer' }}
          >
            <option value="">{loadingGrados ? '-- Cargando grados... --' : '-- Seleccionar grado --'}</option>
            {grados.map(grado => (
              <option key={grado.id} value={grado.id}>
                {grado.codigo} - {grado.nombre}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
          <button 
            onClick={handleCrear}
            disabled={loading || loadingGrados}
            style={{ minWidth: '150px', padding: '10px 20px', borderRadius: '4px', fontSize: '16px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#28a745', color: 'white' }}
          >
            {loading ? 'Procesando...' : 'Crear asignatura'}
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

export default CrearAsignaturaView;
