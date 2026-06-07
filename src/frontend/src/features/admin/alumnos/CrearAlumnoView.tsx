import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { alumnosService } from '../../../services/alumnos.service';
import { gradosService, Grado } from '../../../services/grados.service';

const CrearAlumnoView: React.FC = () => {
  const navigate = useNavigate();
  const [grados, setGrados] = useState<Grado[]>([]);
  const [formData, setFormData] = useState({
    matricula: '',
    nombre: '',
    email: '',
    gradoId: '',
    curso: ''
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
      [id]: value
    }));
  };

  const handleCrear = async () => {
    const { matricula, nombre, email, gradoId, curso } = formData;

    if (!matricula.trim() || !nombre.trim() || !email.trim() || !gradoId || !curso) {
      alert('❌ Todos los campos son obligatorios.');
      return;
    }

    if (matricula.trim().length < 8) {
      alert('❌ La matrícula debe tener al menos 8 caracteres.');
      return;
    }

    const regexMatricula = /^[A-Z0-9]+$/i;
    if (!regexMatricula.test(matricula.trim())) {
      alert('❌ La matrícula solo puede contener letras y números.');
      return;
    }

    if (nombre.trim().length < 3) {
      alert('❌ El nombre debe tener al menos 3 caracteres.');
      return;
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email.trim())) {
      alert('❌ El email no es válido.\n\nEjemplo: nombre.apellido@estudiante.es');
      return;
    }

    const gradoSeleccionado = grados.find(g => g.id === gradoId);
    
    const confirmar = window.confirm(
      `¿Desea crear el siguiente alumno?\n\nMatrícula: ${matricula.trim().toUpperCase()}\nNombre: ${nombre.trim()}\nEmail: ${email.trim()}\nGrado: ${gradoSeleccionado?.nombre}\nCurso: ${curso}`
    );

    if (confirmar) {
      setLoading(true);
      try {
        await alumnosService.create({
          matricula: matricula.trim().toUpperCase(),
          nombre: nombre.trim(),
          email: email.trim(),
          gradoId: gradoId,
          curso: curso // We pass curso to backend (ignored or saved if needed, but matched)
        });
        alert('✅ ¡Alumno creado exitosamente!');
        navigate('/admin/alumnos');
      } catch (err: any) {
        alert(`❌ Error al crear el alumno: ${err.response?.data?.message || 'Error desconocido'}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancelar = () => {
    if (formData.matricula || formData.nombre || formData.email || formData.gradoId || formData.curso) {
      if (!window.confirm('¿Estás seguro de que deseas cancelar?\n\nLos datos ingresados se perderán.')) {
        return;
      }
    }
    navigate('/admin/alumnos');
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
        }}>CREAR NUEVO ALUMNO</h1>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="matricula" style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Matrícula:</label>
          <input 
            type="text" 
            id="matricula" 
            value={formData.matricula}
            onChange={handleChange}
            placeholder="Ej: AL005678" 
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
            placeholder="Ej: María González López"
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
            placeholder="Ej: nombre.apellido@estudiante.es"
            style={{ width: '100%', padding: '10px 12px', fontFamily: 'inherit', fontSize: '16px', border: '1px solid #bdbdbd', background: 'white' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1, marginBottom: '20px' }}>
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
          <div style={{ flex: 1, marginBottom: '20px' }}>
            <label htmlFor="curso" style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Curso:</label>
            <select 
              id="curso" 
              value={formData.curso}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px 12px', fontFamily: 'inherit', fontSize: '16px', border: '1px solid #bdbdbd', background: 'white', cursor: 'pointer' }}
            >
              <option value="">-- Seleccionar curso --</option>
              <option value="1°">1°</option>
              <option value="2°">2°</option>
              <option value="3°">3°</option>
              <option value="4°">4°</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
          <button 
            onClick={handleCrear}
            disabled={loading || loadingGrados}
            style={{ minWidth: '150px', padding: '10px 20px', borderRadius: '4px', fontSize: '16px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#28a745', color: 'white' }}
          >
            {loading ? 'Procesando...' : 'Crear alumno'}
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

export default CrearAlumnoView;
