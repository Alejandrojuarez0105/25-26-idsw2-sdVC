import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { examenesService } from '../../../services/examenes.service';
import { asignaturasService, Asignatura } from '../../../services/asignaturas.service';

const CrearExamenView: React.FC = () => {
  const navigate = useNavigate();
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [loadingAsignaturas, setLoadingAsignaturas] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    codigo: '',
    asignatura: '',
    fecha: '',
    hora: '',
    aula: '',
    profesor: ''
  });

  useEffect(() => {
    const fetchAsignaturas = async () => {
      try {
        const data = await asignaturasService.findAll();
        setAsignaturas(data);
      } catch (err) {
        console.error('Error al cargar asignaturas:', err);
      } finally {
        setLoadingAsignaturas(false);
      }
    };
    fetchAsignaturas();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCrear = async () => {
    const { codigo, asignatura, fecha, hora, aula, profesor } = formData;

    if (!codigo.trim() || !asignatura || !fecha || !hora || !aula || !profesor) {
      alert('❌ Todos los campos son obligatorios.');
      return;
    }

    if (codigo.trim().length < 3) {
      alert('❌ El código debe tener al menos 3 caracteres.');
      return;
    }

    const regex = /^[A-Z0-9-]+$/i;
    if (!regex.test(codigo.trim())) {
      alert('❌ El código solo puede contener letras, números y guiones.');
      return;
    }

    const fechaSeleccionada = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (fechaSeleccionada < hoy) {
      alert('❌ La fecha no puede ser anterior al día de hoy.');
      return;
    }

    const confirmar = window.confirm(
      `¿Desea crear el siguiente examen?\n\nCódigo: ${codigo.trim().toUpperCase()}\nAsignatura: ${asignatura}\nFecha: ${fecha}\nHora: ${hora}\nAula: ${aula}\nProfesor: ${profesor}`
    );

    if (confirmar) {
      setLoading(true);
      try {
        await examenesService.create({
          ...formData,
          codigo: codigo.trim().toUpperCase()
        });
        alert('✅ ¡Examen creado exitosamente!');
        navigate('/admin/examenes');
      } catch (err: any) {
        alert(`❌ Error al crear el examen: ${err.response?.data?.message || 'Error desconocido'}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancelar = () => {
    if (Object.values(formData).some(val => val !== '')) {
      if (!window.confirm('¿Estás seguro de que deseas cancelar?\n\nLos datos ingresados se perderán.')) {
        return;
      }
    }
    navigate('/admin/examenes');
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
      <div style={{ width: '600px', background: '#ececec', padding: '25px', border: '1px solid #cfcfcf' }}>
        <h1 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '30px', letterSpacing: '1px' }}>
          CREAR NUEVO EXAMEN
        </h1>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="codigo" style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Código:</label>
          <input 
            type="text" 
            id="codigo" 
            value={formData.codigo}
            onChange={handleChange}
            placeholder="Ej: EX005" 
            maxLength={10}
            style={{ width: '100%', padding: '10px 12px', fontFamily: 'inherit', fontSize: '16px', border: '1px solid #bdbdbd', background: 'white' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="asignatura" style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Asignatura:</label>
          <select 
            id="asignatura" 
            value={formData.asignatura}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px 12px', fontFamily: 'inherit', fontSize: '16px', border: '1px solid #bdbdbd', background: 'white' }}
          >
            <option value="">-- Seleccionar asignatura --</option>
            {loadingAsignaturas ? (
              <option disabled>Cargando asignaturas...</option>
            ) : (
              asignaturas.map(asig => (
                <option key={asig.id} value={asig.nombre}>{asig.nombre}</option>
              ))
            )}
            {/* Fallback to prototype values if no asignaturas in DB yet */}
            {!loadingAsignaturas && asignaturas.length === 0 && (
              <>
                <option value="Programación I">Programación I</option>
                <option value="Bases de Datos I">Bases de Datos I</option>
                <option value="Estructuras de Datos I">Estructuras de Datos I</option>
              </>
            )}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1, marginBottom: '20px' }}>
            <label htmlFor="fecha" style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Fecha:</label>
            <input 
              type="date" 
              id="fecha" 
              value={formData.fecha}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px 12px', fontFamily: 'inherit', fontSize: '16px', border: '1px solid #bdbdbd', background: 'white' }}
            />
          </div>
          <div style={{ flex: 1, marginBottom: '20px' }}>
            <label htmlFor="hora" style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Hora:</label>
            <select 
              id="hora" 
              value={formData.hora}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px 12px', fontFamily: 'inherit', fontSize: '16px', border: '1px solid #bdbdbd', background: 'white' }}
            >
              <option value="">-- Seleccionar hora --</option>
              <option value="08:30">08:30</option>
              <option value="11:30">11:30</option>
              <option value="14:30">14:30</option>
              <option value="17:30">17:30</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1, marginBottom: '20px' }}>
            <label htmlFor="aula" style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Aula:</label>
            <select 
              id="aula" 
              value={formData.aula}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px 12px', fontFamily: 'inherit', fontSize: '16px', border: '1px solid #bdbdbd', background: 'white' }}
            >
              <option value="">-- Seleccionar aula --</option>
              <option value="-2.6">-2.6</option>
              <option value="-2.4">-2.4</option>
              <option value="-2.2">-2.2</option>
              <option value="1.2">1.2</option>
              <option value="1.3">1.3</option>
              <option value="1.4">1.4</option>
              <option value="1.5">1.5</option>
            </select>
          </div>
          <div style={{ flex: 1, marginBottom: '20px' }}>
            <label htmlFor="profesor" style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Profesor:</label>
            <select 
              id="profesor" 
              value={formData.profesor}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px 12px', fontFamily: 'inherit', fontSize: '16px', border: '1px solid #bdbdbd', background: 'white' }}
            >
              <option value="">-- Seleccionar profesor --</option>
              <option value="Manuel Masías">Manuel Masías</option>
              <option value="Lázaro Hernández">Lázaro Hernández</option>
              <option value="Carlos Galiano">Carlos Galiano</option>
              <option value="Jorge Crespo">Jorge Crespo</option>
              <option value="Javier Bel">Javier Bel</option>
            </select>
          </div>
        </div>

        <div style={{ borderTop: '2px solid #cfcfcf', margin: '25px 0 20px 0' }}></div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <button 
            onClick={handleCrear}
            disabled={loading}
            style={{ minWidth: '150px', padding: '10px 20px', borderRadius: '4px', fontSize: '16px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #1e7e34', fontWeight: 'bold', background: '#28a745', color: 'white' }}
          >
            {loading ? 'Procesando...' : 'Crear examen'}
          </button>
          <button 
            onClick={handleCancelar}
            style={{ minWidth: '150px', padding: '10px 20px', borderRadius: '4px', fontSize: '16px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#f3f0ec', color: 'black' }}
          >
            Cancelar
          </button>
        </div>

        <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '11px', color: '#666' }}>
          Davidario - Versión 1.0 · © 2026
        </div>
      </div>
    </div>
  );
};

export default CrearExamenView;
