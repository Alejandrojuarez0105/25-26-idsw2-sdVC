import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examenesService, Examen } from '../../../services/examenes.service';
import { asignaturasService, Asignatura } from '../../../services/asignaturas.service';

const EditarExamenView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [examenOriginal, setExamenOriginal] = useState<Examen | null>(null);
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    codigo: '',
    asignatura: '',
    fecha: '',
    hora: '',
    aula: '',
    profesor: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [examenData, asignaturasData] = await Promise.all([
          examenesService.findOne(id),
          asignaturasService.findAll()
        ]);
        
        setExamenOriginal(examenData);
        setAsignaturas(asignaturasData);
        
        // Format date to YYYY-MM-DD for input type="date"
        const dateObj = new Date(examenData.fecha);
        const formattedDate = dateObj.toISOString().split('T')[0];

        setFormData({
          codigo: examenData.codigo,
          asignatura: examenData.asignatura,
          fecha: formattedDate,
          hora: examenData.hora,
          aula: examenData.aula,
          profesor: examenData.profesor
        });
      } catch (err) {
        alert('❌ Error al cargar los datos del examen.');
        navigate('/admin/examenes');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const hayCambios = () => {
    if (!examenOriginal) return false;
    
    const dateObj = new Date(examenOriginal.fecha);
    const originalFormattedDate = dateObj.toISOString().split('T')[0];

    return formData.asignatura !== examenOriginal.asignatura || 
           formData.fecha !== originalFormattedDate ||
           formData.hora !== examenOriginal.hora ||
           formData.aula !== examenOriginal.aula ||
           formData.profesor !== examenOriginal.profesor;
  };

  const handleGuardar = async () => {
    if (!id || !examenOriginal) return;

    const { asignatura, fecha, hora, aula, profesor } = formData;

    if (!asignatura || !fecha || !hora || !aula || !profesor) {
      alert('❌ Todos los campos son obligatorios.');
      return;
    }

    if (!hayCambios()) {
      alert('ℹ️ No se detectaron cambios para guardar.');
      return;
    }

    const confirmar = window.confirm(
      `¿Guardar los cambios del examen "${examenOriginal.codigo}"?\n\nAsignatura: ${asignatura}\nFecha: ${fecha}\nHora: ${hora}\nAula: ${aula}\nProfesor: ${profesor}`
    );

    if (confirmar) {
      setSaving(true);
      try {
        await examenesService.update(id, formData);
        alert('✅ Cambios guardados exitosamente.');
        navigate('/admin/examenes');
      } catch (err: any) {
        alert(`❌ Error al actualizar el examen: ${err.response?.data?.message || 'Error desconocido'}`);
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
        navigate('/admin/examenes');
      }
    } else {
      navigate('/admin/examenes');
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Cargando datos...</div>;
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
      <div style={{ width: '650px', background: '#ececec', padding: '25px', border: '1px solid #cfcfcf' }}>
        <h1 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '30px', letterSpacing: '1px' }}>
          EDITAR EXAMEN
        </h1>

        <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', color: '#555' }}>
          📝 Datos del examen:
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
          <label htmlFor="asignatura" style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Asignatura:</label>
          <select 
            id="asignatura" 
            value={formData.asignatura}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px 12px', fontFamily: 'inherit', fontSize: '16px', border: '1px solid #bdbdbd', background: 'white' }}
          >
            {asignaturas.map(asig => (
              <option key={asig.id} value={asig.nombre}>{asig.nombre}</option>
            ))}
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
              <option value="Manuel Masías">Manuel Masías</option>
              <option value="Lázaro Hernández">Lázaro Hernández</option>
              <option value="Carlos Galiano">Carlos Galiano</option>
              <option value="Jorge Crespo">Jorge Crespo</option>
              <option value="Javier Bel">Javier Bel</option>
            </select>
          </div>
        </div>

        <div style={{ background: '#e7f3ff', padding: '12px 15px', margin: '20px 0', borderLeft: '4px solid #2d89ef', fontSize: '14px', fontStyle: 'italic', color: '#2c3e50' }}>
          📌 El examen está programado en el aula {formData.aula} con el profesor {formData.profesor}.
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
          Davidario - Versión 1.0 · © 2026
        </div>
      </div>
    </div>
  );
};

export default EditarExamenView;
