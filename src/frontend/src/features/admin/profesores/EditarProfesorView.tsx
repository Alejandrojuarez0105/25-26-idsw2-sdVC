import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Profesor, profesoresService } from '../../../services/profesores.service';
import { Asignatura, asignaturasService } from '../../../services/asignaturas.service';

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

const EditarProfesorView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profesorOriginal, setProfesorOriginal] = useState<Profesor | null>(null);
  const [allAsignaturas, setAllAsignaturas] = useState<Asignatura[]>([]);
  const [enrolledAsignaturaIds, setEnrolledAsignaturaIds] = useState<string[]>([]);
  const [selectedAsignaturaToAdd, setSelectedAsignaturaToAdd] = useState('');

  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    email: '',
    departamento: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [profesorData, asignaturasData] = await Promise.all([
          profesoresService.findOne(id),
          asignaturasService.findAll(),
        ]);

        setProfesorOriginal(profesorData);
        setAllAsignaturas(asignaturasData);

        const fullName = `${profesorData.usuario?.nombre || ''} ${profesorData.usuario?.apellido || ''}`.trim();

        setFormData({
          codigo: profesorData.codigo || '',
          nombre: fullName,
          email: profesorData.usuario?.email || '',
          departamento: profesorData.departamento || '',
        });

        const initialSubjectIds = profesorData.asignaturas?.map(a => a.asignaturaId) || [];
        setEnrolledAsignaturaIds(initialSubjectIds);
      } catch (err: any) {
        const errMsg = err.response?.data?.message || err.message || 'Error desconocido';
        alert(`❌ Error al cargar los datos del profesor: ${errMsg}`);
        navigate('/admin/profesores');
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
      [id]: value,
    }));
  };

  const handleAddAsignatura = () => {
    if (!selectedAsignaturaToAdd) {
      alert('⚠️ Seleccione una asignatura para agregar.');
      return;
    }
    if (enrolledAsignaturaIds.includes(selectedAsignaturaToAdd)) {
      alert('⚠️ La asignatura ya está en la lista del profesor.');
      return;
    }
    setEnrolledAsignaturaIds(prev => [...prev, selectedAsignaturaToAdd]);
    setSelectedAsignaturaToAdd('');
  };

  const handleRemoveAsignatura = (asigId: string) => {
    setEnrolledAsignaturaIds(prev => prev.filter(x => x !== asigId));
  };

  const hayCambios = () => {
    if (!profesorOriginal) return false;
    const originalNombre = `${profesorOriginal.usuario?.nombre || ''} ${profesorOriginal.usuario?.apellido || ''}`.trim();
    const originalEmail = profesorOriginal.usuario?.email || '';
    const originalDepartamento = profesorOriginal.departamento || '';
    const originalSubjectIds = profesorOriginal.asignaturas?.map(a => a.asignaturaId) || [];

    const subjectsEqual =
      enrolledAsignaturaIds.length === originalSubjectIds.length &&
      enrolledAsignaturaIds.every(x => originalSubjectIds.includes(x));

    return (
      formData.nombre.trim() !== originalNombre ||
      formData.email.trim() !== originalEmail ||
      formData.departamento !== originalDepartamento ||
      !subjectsEqual
    );
  };

  const handleGuardar = async () => {
    if (!id || !profesorOriginal) return;
    const { nombre, email, departamento } = formData;

    if (!nombre.trim()) {
      alert('❌ El nombre no puede estar vacío.');
      return;
    }
    if (nombre.trim().length < 3) {
      alert('❌ El nombre debe tener al menos 3 caracteres.');
      return;
    }

    if (!email.trim()) {
      alert('❌ El email no puede estar vacío.');
      return;
    }
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email.trim())) {
      alert('❌ El email no es válido.');
      return;
    }

    if (!departamento) {
      alert('❌ Debe seleccionar un departamento.');
      return;
    }

    if (!hayCambios()) {
      alert('ℹ️ No se detectaron cambios para guardar.');
      return;
    }

    let resumenAsignaturas = enrolledAsignaturaIds
      .map(aid => allAsignaturas.find(a => a.id === aid)?.nombre)
      .filter(Boolean)
      .map(n => `- ${n}`)
      .join('\n');
    if (!resumenAsignaturas) resumenAsignaturas = '- Ninguna asignatura';

    const confirmar = window.confirm(
      `¿Guardar los cambios del profesor "${formData.codigo}"?\n\nNombre: ${nombre.trim()}\nEmail: ${email.trim()}\nDepartamento: ${departamento}\nAsignaturas (${enrolledAsignaturaIds.length}):\n${resumenAsignaturas}`
    );

    if (confirmar) {
      setSaving(true);
      try {
        await profesoresService.update(id, {
          nombre: nombre.trim(),
          email: email.trim(),
          departamento,
          asignaturas: enrolledAsignaturaIds,
        });
        alert(`✅ Cambios guardados exitosamente.\n\nProfesor: ${formData.codigo}\nNombre: ${nombre.trim()}`);
        navigate('/admin/profesores');
      } catch (err: any) {
        alert(`❌ Error al actualizar el profesor: ${err.response?.data?.message || 'Error desconocido'}`);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleContinuarEditando = () => {
    if (hayCambios()) {
      alert('📌 Continuando con la edición...\n\nLos cambios no guardados se mantendrán en el formulario.');
    } else {
      alert('📌 No hay cambios pendientes. Puede seguir editando el profesor.');
    }
  };

  const handleCancelar = () => {
    if (hayCambios()) {
      if (!window.confirm('⚠️ Hay cambios sin guardar.\n\n¿Estás seguro de que deseas cancelar? Los cambios se perderán.')) {
        return;
      }
    }
    navigate('/admin/profesores');
  };

  if (loading) {
    return (
      <div style={{ background: '#e9e9e9', fontFamily: '"Courier New", monospace', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <h2>Cargando datos del profesor...</h2>
      </div>
    );
  }

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
        }}>EDITAR PROFESOR</h1>

        <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', color: '#555' }}>
          📋 Datos del profesor:
        </div>

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

        {/* Asignaturas impartidas */}
        <div style={{ background: '#f5f5f5', border: '1px solid #bdbdbd', padding: '15px', margin: '20px 0' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', textDecoration: 'underline' }}>
            📚 Asignaturas impartidas:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '15px' }}>
            {enrolledAsignaturas.length === 0 ? (
              <span style={{ fontSize: '13px', color: '#666', fontStyle: 'italic' }}>Sin asignaturas asignadas</span>
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
          👨‍🏫 Profesor del departamento de {formData.departamento || 'N/A'}. Asignado a {enrolledAsignaturaIds.length} asignatura(s).
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

export default EditarProfesorView;
