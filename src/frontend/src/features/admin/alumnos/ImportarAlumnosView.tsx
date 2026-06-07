import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { alumnosService } from '../../../services/alumnos.service';

const ImportarAlumnosView: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nombreArchivo, setNombreArchivo] = useState('Ningún archivo seleccionado');
  const [archivo, setArchivo] = useState<File | null>(null);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Options
  const [validarMatriculas, setValidarMatriculas] = useState(true);
  const [cursoDefecto, setCursoDefecto] = useState(true);
  const [crearUsuarios, setCrearUsuarios] = useState(false);

  const handleExaminar = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setMensajeError(null);
    setMensajeExito(null);

    if (file) {
      if (!file.name.endsWith('.csv')) {
        setMensajeError(`❌ Formato no válido. El archivo "${file.name}" no es un CSV.`);
        setArchivo(null);
        setNombreArchivo('Ningún archivo seleccionado');
        return;
      }
      setArchivo(file);
      setNombreArchivo(file.name);
      setMensajeExito(`✅ Archivo válido: "${file.name}" (${(file.size / 1024).toFixed(2)} KB) - Listo para importar`);
    }
  };

  const parseCSV = (text: string) => {
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length === 0) return [];

    // Detect if first line contains headers (e.g. matricula, nombre, email, grado, curso)
    const firstLine = lines[0].toLowerCase();
    const hasHeader = firstLine.includes('matr') || firstLine.includes('nomb') || firstLine.includes('mail') || firstLine.includes('grad');
    
    const linesToProcess = hasHeader ? lines.slice(1) : lines;

    const data = linesToProcess.map(line => {
      const parts = line.split(/[,;]/).map(p => p.trim());
      
      let matricula = '';
      let nombre = '';
      let email = '';
      let grado = '';
      let curso = '';

      const isEmail = (val: string) => val.includes('@');

      if (parts.length >= 6) {
        // Format: Matricula, Nombre, Apellido, Email, Grado, Curso
        matricula = parts[0];
        nombre = `${parts[1]} ${parts[2]}`;
        email = parts[3];
        grado = parts[4];
        curso = parts[5];
      } else if (parts.length === 5) {
        if (isEmail(parts[3])) {
          // Format: Matricula, Nombre, Apellido, Email, Grado
          matricula = parts[0];
          nombre = `${parts[1]} ${parts[2]}`;
          email = parts[3];
          grado = parts[4];
        } else if (isEmail(parts[2])) {
          // Format: Matricula, Nombre, Email, Grado, Curso
          matricula = parts[0];
          nombre = parts[1];
          email = parts[2];
          grado = parts[3];
          curso = parts[4];
        }
      } else if (parts.length === 4) {
        // Format: Matricula, Nombre, Email, Grado
        matricula = parts[0];
        nombre = parts[1];
        email = parts[2];
        grado = parts[3];
      }

      if (curso) {
        // Normalize course (e.g. 4 -> 4°, 4° -> 4°)
        curso = curso.replace(/°/g, '') + '°';
      }

      return {
        matricula,
        nombre,
        email,
        grado: grado,
        gradoCodigo: grado,
        curso: curso || undefined
      };
    }).filter(item => item.matricula && item.nombre && item.email);

    return data;
  };

  const handleImportar = async () => {
    if (!archivo) return;

    setLoading(true);
    setMensajeError(null);
    setMensajeExito(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const data = parseCSV(text);

        if (data.length === 0) {
          setMensajeError('❌ El archivo no contiene datos válidos o está vacío.');
          setLoading(false);
          return;
        }

        const result = await alumnosService.importAlumnos(data);
        
        let opcionesTexto = '';
        if (validarMatriculas) opcionesTexto += '\n- ✓ Validar matrículas únicas';
        if (cursoDefecto) opcionesTexto += '\n- ✓ Curso por defecto (1°)';
        if (crearUsuarios) opcionesTexto += '\n- ✓ Crear usuarios acceso';
        if (opcionesTexto === '') opcionesTexto = '\n- Ninguna opción seleccionada';

        const summary = `✅ IMPORTACIÓN COMPLETADA!\n\n📁 Archivo: ${archivo.name}\n📊 Alumnos procesados: ${data.length}\n✨ Éxito: ${result.success}\n❌ Fallidos: ${result.failed}\n⚙️ Opciones aplicadas:${opcionesTexto}`;
        
        alert(summary);

        if (result.failed > 0) {
          const errorDetails = result.errors && result.errors.length > 0
            ? result.errors.slice(0, 5).map(e => `• ${e}`).join('\n')
            : 'Error desconocido al procesar algunos registros.';
          setMensajeError(`Se importaron ${result.success} alumnos, pero ${result.failed} fallaron.\n\nDetalles de los primeros errores:\n${errorDetails}`);
        } else {
          setMensajeExito(`🎉 ¡Importación exitosa! Se procesaron ${result.success} alumnos correctamente.`);
        }
      } catch (err) {
        setMensajeError('❌ Error al procesar la importación. Verifique el formato del archivo.');
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setMensajeError('❌ Error al leer el archivo.');
      setLoading(false);
    };

    reader.readAsText(archivo, 'UTF-8');
  };

  const handleCancelar = () => {
    setArchivo(null);
    setNombreArchivo('Ningún archivo seleccionado');
    setMensajeError(null);
    setMensajeExito(null);
    setValidarMatriculas(true);
    setCursoDefecto(true);
    setCrearUsuarios(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    navigate('/admin/alumnos');
  };

  return (
    <div style={{ 
      background: '#e9e9e9', 
      fontFamily: '"Courier New", monospace', 
      display: 'flex', 
      justifyContent: 'center', 
      padding: '20px',
      minHeight: '100vh'
    }}>
      <div style={{ width: '650px', background: '#ececec', padding: '0px' }}>
        <h1 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 'bold', textDecoration: 'underline', margin: '20px 0', letterSpacing: '1px' }}>
          IMPORTAR ALUMNOS
        </h1>

        {mensajeError && (
          <div style={{ background: '#f8d7da', borderLeft: '4px solid #dc3545', color: '#721c24', padding: '10px 15px', margin: '0 20px 20px 20px', fontSize: '14px' }}>
            {mensajeError}
          </div>
        )}

        {mensajeExito && (
          <div style={{ background: '#d4edda', borderLeft: '4px solid #28a745', color: '#155724', padding: '10px 15px', margin: '0 20px 20px 20px', fontSize: '14px' }}>
            {mensajeExito}
          </div>
        )}

        <div style={{ border: '2px solid #7ea0c0', padding: '18px', margin: '0 20px 28px 20px', background: '#dfe7ef' }}>
          <label style={{ fontSize: '18px', marginBottom: '15px', display: 'block' }}>Seleccionar archivo:</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px', paddingLeft: '18px' }}>
            <button 
              onClick={handleExaminar}
              style={{ padding: '10px 32px', background: '#ece6df', border: '1px solid #9b9b9b', borderRadius: '2px', cursor: 'pointer', fontSize: '18px', fontFamily: 'inherit', fontWeight: 'bold' }}
            >
              Examinar...
            </button>
            <input 
              type="text" 
              value={nombreArchivo}
              readOnly
              style={{ width: '360px', padding: '10px 14px', border: '1px solid #bdbdbd', background: '#f5f5f5', fontSize: '18px', fontFamily: 'inherit', fontStyle: 'italic', color: '#555' }}
            />
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".csv" 
              style={{ display: 'none' }} 
            />
          </div>
          <div style={{ marginTop: '10px', paddingLeft: '18px', fontSize: '12px', color: '#555', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>📄</span>
            <span>Formatos permitidos: <strong>CSV</strong> (extensión .csv) - Máximo 10MB</span>
          </div>
        </div>

        <div style={{ border: '1px solid #cfcfcf', padding: '18px', margin: '0 20px 28px 20px', background: '#ededed' }}>
          <label style={{ fontSize: '18px', marginBottom: '15px', display: 'block' }}>Opciones:</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', paddingLeft: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="checkbox" checked={validarMatriculas} onChange={(e) => setValidarMatriculas(e.target.checked)} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
              <label style={{ fontSize: '18px', cursor: 'pointer' }}>Validar matrículas únicas</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="checkbox" checked={cursoDefecto} onChange={(e) => setCursoDefecto(e.target.checked)} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
              <label style={{ fontSize: '18px', cursor: 'pointer' }}>Curso por defecto <small style={{ fontSize: '14px', color: '#666', fontStyle: 'italic' }}>(1°)</small></label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="checkbox" checked={crearUsuarios} onChange={(e) => setCrearUsuarios(e.target.checked)} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
              <label style={{ fontSize: '18px', cursor: 'pointer' }}>Crear usuarios acceso</label>
            </div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '2px solid #cfcfcf', margin: '0 20px 25px 20px' }} />

        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', paddingBottom: '30px' }}>
          <button 
            disabled={!archivo || loading}
            onClick={handleImportar}
            style={{ minWidth: '215px', padding: '14px 25px', borderRadius: '4px', fontSize: '18px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: archivo && !loading ? '#2d89ef' : '#9ab3d1', color: 'white' }}
          >
            {loading ? 'Procesando...' : 'Importar alumnos'}
          </button>
          <button 
            onClick={handleCancelar}
            style={{ minWidth: '215px', padding: '14px 25px', borderRadius: '4px', fontSize: '18px', fontFamily: 'inherit', cursor: 'pointer', border: '1px solid #999', fontWeight: 'bold', background: '#f3f0ec', color: 'black' }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportarAlumnosView;
