import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { examenesService, Examen } from '../../../services/examenes.service';
import { asignaturasService, Asignatura } from '../../../services/asignaturas.service';
import { profesoresService, Profesor } from '../../../services/profesores.service';
import { Aula, getAulas } from '../../../services/aulas.service';

const EditarExamenView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [examenOriginal, setExamenOriginal] = useState<Examen | null>(null);
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    codigo: '',
    asignatura: '',
    fecha: '',
    hora: '',
    aulaId: '',
    profesorId: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [examenData, asignaturasData, profesoresData, aulasData] = await Promise.all([
          examenesService.findOne(id),
          asignaturasService.findAll(),
          profesoresService.findAll(),
          getAulas(),
        ]);

        setExamenOriginal(examenData);
        setAsignaturas(asignaturasData);
        setProfesores(profesoresData);
        setAulas(aulasData);

        const dateObj = new Date(examenData.fecha);
        const formattedDate = dateObj.toISOString().split('T')[0];

        setFormData({
          codigo: examenData.codigo,
          asignatura: examenData.asignatura,
          fecha: formattedDate,
          hora: examenData.hora,
          aulaId: examenData.aulaId || '',
          profesorId: examenData.profesorId || '',
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
           formData.aulaId !== (examenOriginal.aulaId || '') ||
           formData.profesorId !== (examenOriginal.profesorId || '');
  };

  const handleGuardar = async () => {
    if (!id || !examenOriginal) return;

    const { asignatura, fecha, hora, aulaId, profesorId } = formData;

    if (!asignatura || !fecha || !hora || !aulaId || !profesorId) {
      alert('❌ Todos los campos son obligatorios.');
      return;
    }

    if (!hayCambios()) {
      alert('ℹ️ No se detectaron cambios para guardar.');
      return;
    }

    const profElegido = profesores.find(p => p.id === profesorId);
    const aulaElegida = aulas.find(a => a.id === aulaId);
    const nombreProfesor = profElegido ? `${profElegido.usuario.nombre} ${profElegido.usuario.apellido}` : 'N/A';
    const codigoAula = aulaElegida?.codigo || 'N/A';

    const confirmar = window.confirm(
      `¿Guardar los cambios del examen "${examenOriginal.codigo}"?\n\nAsignatura: ${asignatura}\nFecha: ${fecha}\nHora: ${hora}\nAula: ${codigoAula}\nProfesor: ${nombreProfesor}`
    );

    if (confirmar) {
      setSaving(true);
      try {
        await examenesService.update(id, {
          asignatura,
          fecha,
          hora,
          aulaId,
          profesorId,
        });
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

  const aulaActual = aulas.find(a => a.id === formData.aulaId);
  const profActual = profesores.find(p => p.id === formData.profesorId);

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
            <option value="">-- Seleccionar asignatura --</option>
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
            <label htmlFor="aulaId" style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Aula:</label>
            <select
              id="aulaId"
              value={formData.aulaId}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px 12px', fontFamily: 'inherit', fontSize: '16px', border: '1px solid #bdbdbd', background: 'white' }}
            >
              <option value="">-- Seleccionar aula --</option>
              {aulas.map(a => (
                <option key={a.id} value={a.id}>{a.codigo} - {a.nombre}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1, marginBottom: '20px' }}>
            <label htmlFor="profesorId" style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Profesor:</label>
            <select
              id="profesorId"
              value={formData.profesorId}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px 12px', fontFamily: 'inherit', fontSize: '16px', border: '1px solid #bdbdbd', background: 'white' }}
            >
              <option value="">-- Seleccionar profesor --</option>
              {profesores.map(p => (
                <option key={p.id} value={p.id}>{p.usuario.nombre} {p.usuario.apellido}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ background: '#e7f3ff', padding: '12px 15px', margin: '20px 0', borderLeft: '4px solid #2d89ef', fontSize: '14px', fontStyle: 'italic', color: '#2c3e50' }}>
          📌 El examen está programado en el aula <strong>{aulaActual?.codigo || 'N/A'}</strong> con el profesor <strong>{profActual ? `${profActual.usuario.nombre} ${profActual.usuario.apellido}` : 'N/A'}</strong>.
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
