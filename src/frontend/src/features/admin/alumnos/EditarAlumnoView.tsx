import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { alumnosService, Alumno } from '../../../services/alumnos.service';
import { gradosService, Grado } from '../../../services/grados.service';
import { asignaturasService, Asignatura } from '../../../services/asignaturas.service';

const EditarAlumnoView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [alumnoOriginal, setAlumnoOriginal] = useState<Alumno | null>(null);
  const [grados, setGrados] = useState<Grado[]>([]);
  const [allAsignaturas, setAllAsignaturas] = useState<Asignatura[]>([]);
  const [enrolledAsignaturaIds, setEnrolledAsignaturaIds] = useState<string[]>([]);
  const [selectedAsignaturaToAdd, setSelectedAsignaturaToAdd] = useState('');

  const [formData, setFormData] = useState({
    matricula: '',
    nombre: '',
    email: '',
    gradoId: '',
    curso: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Helper to mock course based on matricula
  const getCurso = (matricula: string) => {
    const digits = matricula.replace(/\D/g, '');
    if (digits.length > 0) {
      const lastDigit = parseInt(digits.slice(-1));
      return `${(lastDigit % 4) + 1}°`;
    }
    return '1°';
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [alumnoData, gradosData, asignaturasData] = await Promise.all([
          alumnosService.findOne(id),
          gradosService.findAll(),
          asignaturasService.findAll()
        ]);

        setAlumnoOriginal(alumnoData);
        setGrados(gradosData);
        setAllAsignaturas(asignaturasData);
        
        const fullName = `${alumnoData.usuario?.nombre || ''} ${alumnoData.usuario?.apellido || ''}`.trim();
        const cursoDb = alumnoData.curso || getCurso(alumnoData.matricula);

        setFormData({
          matricula: alumnoData.matricula,
          nombre: fullName,
          email: alumnoData.usuario?.email || '',
          gradoId: alumnoData.gradoId,
          curso: cursoDb
        });

        // Initialize enrolled subjects
        const initialSubjectIds = alumnoData.matriculas?.map((m: any) => m.asignaturaId) || [];
        setEnrolledAsignaturaIds(initialSubjectIds);
      } catch (err: any) {
        console.error('Error loading student data:', err);
        const errMsg = err.response?.data?.message || err.message || 'Error desconocido';
        alert(`❌ Error al cargar los datos del alumno: ${errMsg}`);
        navigate('/admin/alumnos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleAddAsignatura = () => {
    if (!selectedAsignaturaToAdd) {
      alert('⚠️ Seleccione una asignatura para agregar.');
      return;
    }
    if (enrolledAsignaturaIds.includes(selectedAsignaturaToAdd)) {
      alert('⚠️ El alumno ya está matriculado en esta asignatura.');
      return;
    }
    setEnrolledAsignaturaIds(prev => [...prev, selectedAsignaturaToAdd]);
    setSelectedAsignaturaToAdd('');
  };

  const handleRemoveAsignatura = (asigId: string) => {
    setEnrolledAsignaturaIds(prev => prev.filter(id => id !== asigId));
  };

  const hayCambios = () => {
    if (!alumnoOriginal) return false;

    const originalNombre = `${alumnoOriginal.usuario?.nombre || ''} ${alumnoOriginal.usuario?.apellido || ''}`.trim();
    const originalEmail = alumnoOriginal.usuario?.email || '';
    const originalGradoId = alumnoOriginal.gradoId;
    const originalCurso = alumnoOriginal.curso || getCurso(alumnoOriginal.matricula);

    const originalSubjectIds = alumnoOriginal.matriculas?.map((m: any) => m.asignaturaId) || [];

    const subjectsEqual = enrolledAsignaturaIds.length === originalSubjectIds.length &&
      enrolledAsignaturaIds.every(id => originalSubjectIds.includes(id));

    return formData.nombre.trim() !== originalNombre ||
           formData.email.trim() !== originalEmail ||
           formData.gradoId !== originalGradoId ||
           formData.curso !== originalCurso ||
           !subjectsEqual;
  };

  const handleGuardar = async () => {
    if (!id || !alumnoOriginal) return;

    const { nombre, email, gradoId, curso } = formData;

    if (!nombre.trim() || !email.trim() || !gradoId || !curso) {
      alert('❌ Todos los campos son obligatorios.');
      return;
    }

    if (nombre.trim().length < 3) {
      alert('❌ El nombre debe tener al menos 3 caracteres.');
      return;
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email.trim())) {
      alert('❌ El email no es válido.');
      return;
    }

    if (!hayCambios()) {
      alert('ℹ️ No se detectaron cambios para guardar.');
      return;
    }

    const gradoSeleccionado = grados.find(g => g.id === gradoId);
    
    let resumenAsignaturas = enrolledAsignaturaIds
      .map(aid => allAsignaturas.find(a => a.id === aid)?.nombre)
      .filter(Boolean)
      .map(n => `- ${n}`)
      .join('\n');
    if (!resumenAsignaturas) resumenAsignaturas = '- Ninguna asignatura';

    const confirmar = window.confirm(
      `¿Desea guardar los cambios del alumno "${alumnoOriginal.matricula}"?\n\nNombre: ${nombre.trim()}\nEmail: ${email.trim()}\nGrado: ${gradoSeleccionado?.nombre}\nCurso: ${curso}\nAsignaturas:\n${resumenAsignaturas}`
    );

    if (confirmar) {
      setSaving(true);
      try {
        await alumnosService.update(id, {
          nombre: nombre.trim(),
          email: email.trim(),
          gradoId: gradoId,
          curso: curso,
          asignaturas: enrolledAsignaturaIds
        });
        alert('✅ Cambios guardados exitosamente.');
        navigate('/admin/alumnos');
      } catch (err: any) {
        alert(`❌ Error al actualizar el alumno: ${err.response?.data?.message || 'Error desconocido'}`);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleContinuarEditando = () => {
    if (hayCambios()) {
      alert('📌 Continuando con la edición...\n\nLos cambios no guardados se mantendrán en el formulario.');
    } else {
      alert('📌 No hay cambios pendientes. Puede seguir editando el alumno.');
    }
  };

  const handleCancelar = () => {
    if (hayCambios()) {
      if (!window.confirm('⚠️ Hay cambios sin guardar.\n\n¿Estás seguro de que deseas cancelar? Los cambios se perderán.')) {
        return;
      }
    }
    navigate('/admin/alumnos');
  };

  if (loading) {
    return (
      <div style={{ background: '#e9e9e9', fontFamily: '"Courier New", monospace', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <h2>Cargando datos del alumno...</h2>
      </div>
    );
  }

  const currentGradoObj = grados.find(g => g.id === formData.gradoId);
  const enrolledAsignaturas = enrolledAsignaturaIds
    .map(aid => allAsignaturas.find(a => a.id === aid))
    .filter((a): a is Asignatura => !!a);

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
        width: '650px', 
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
        }}>EDITAR ALUMNO</h1>

        <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', color: '#555' }}>
          🎓 Datos del alumno:
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="matricula" style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Matrícula:</label>
          <input 
            type="text" 
            id="matricula" 
            value={formData.matricula}
            disabled
            style={{ 
              width: '100%', 
              padding: '10px 12px', 
              fontFamily: 'inherit', 
              fontSize: '16px', 
              border: '1px solid #bdbdbd', 
              background: '#e9ecef', 
              color: '#666',
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
              style={{ width: '100%', padding: '10px 12px', fontFamily: 'inherit', fontSize: '16px', border: '1px solid #bdbdbd', background: 'white', cursor: 'pointer' }}
            >
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
              <option value="1°">1°</option>
              <option value="2°">2°</option>
              <option value="3°">3°</option>
              <option value="4°">4°</option>
            </select>
          </div>
        </div>

        {/* Asignaturas Matriculadas */}
        <div style={{ background: '#f5f5f5', border: '1px solid #bdbdbd', padding: '15px', margin: '20px 0' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', textDecoration: 'underline' }}>
            📚 Asignaturas matriculadas:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '15px' }}>
            {enrolledAsignaturas.length === 0 ? (
              <span style={{ fontSize: '13px', color: '#666', fontStyle: 'italic' }}>Sin asignaturas matriculadas</span>
            ) : (
              enrolledAsignaturas.map(asig => (
                <span 
                  key={asig.id} 
                  style={{ background: '#dfe7ef', padding: '5px 12px', borderRadius: '15px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  {asig.nombre}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveAsignatura(asig.id)}
                    style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', padding: '0 3px' }}
                  >
                    ✖
                  </button>
                </span>
              ))
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <select 
              value={selectedAsignaturaToAdd}
              onChange={(e) => setSelectedAsignaturaToAdd(e.target.value)}
              style={{ flex: 1, padding: '8px 10px', fontFamily: 'inherit', fontSize: '14px', border: '1px solid #bdbdbd', background: 'white', cursor: 'pointer' }}
            >
              <option value="">-- Seleccionar asignatura --</option>
              {allAsignaturas
                .filter(asig => !enrolledAsignaturaIds.includes(asig.id))
                .map(asig => (
                  <option key={asig.id} value={asig.id}>
                    {asig.nombre} ({asig.codigo})
                  </option>
                ))}
            </select>
            <button 
              type="button"
              onClick={handleAddAsignatura}
              style={{ background: '#28a745', color: 'white', border: 'none', padding: '8px 20px', fontFamily: 'inherit', fontSize: '13px', cursor: 'pointer', borderRadius: '3px', fontWeight: 'bold' }}
            >
              + Agregar
            </button>
          </div>
        </div>

        <div style={{ background: '#e7f3ff', padding: '12px 15px', margin: '20px 0', borderLeft: '4px solid #2d89ef', fontSize: '14px', color: '#2c3e50' }}>
          📌 Alumno de {formData.curso} curso del Grado en {currentGradoObj?.nombre || 'N/A'}. Matriculado en {enrolledAsignaturaIds.length} asignatura(s).
        </div>

        <hr style={{ border: 'none', borderTop: '2px solid #cfcfcf', margin: '25px 0 20px 0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
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

export default EditarAlumnoView;
