<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/descargarCalendarioExamenes/README.md)|**Diseño**|[Implementación](/RUP/03-desarrollo/casos-uso/0-Administrador/descargarCalendarioExamenes/README.md)|Pruebas|
|---|---|---|---|---|---|

</div>

# Davidario > descargarCalendarioExamenes > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-08
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `descargarCalendarioExamenes()` (self-transition del estado `CALENDARIO_ABIERTO`). Permite al administrador exportar el calendario oficial de exámenes en formatos **PDF** y **Excel (.xlsx)**, manteniendo consistencia con el calendario visualizado en `consultarCalendario()`. Se adapta el **patrón Strategy + Factory** a NestJS, garantizando exportadores desacoplados de la persistencia y la inmutabilidad de los datos exportados.

### Diagrama de secuencia de diseño

Interacción técnica entre la vista, el modal de descarga, el servicio de exportación y la persistencia.

<div align=center>

|![Diseño de Secuencia: descargarCalendarioExamenes()](/images/02-diseño/casos-uso/0-Administrador/descargarCalendarioExamenes/secuencia-diseño.svg)|
|---|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/descargarCalendarioExamenes/secuencia-diseño.puml)|

</div>

## diseño completo del caso de uso

Desde la vista de consulta, el administrador abre un **modal de descarga**, selecciona el formato (PDF o Excel) y las columnas a incluir (aula, profesor, grado), y solicita la exportación. El backend recupera exactamente los mismos exámenes que muestra la consulta (mismos filtros), los transforma a una estructura plana inmutable (`ExamenExportData`) y delega la generación del binario en el exportador concreto resuelto por una **fábrica**. El archivo se devuelve como descarga y la vista regresa a `CALENDARIO_ABIERTO`.

## formato de salida previsto

- **PDF** (`application/pdf`, `calendario.pdf`): documento tabular generado con `pdfkit`, con salto de página automático y reimpresión de cabeceras, y fecha de generación.
- **Excel** (`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `calendario.xlsx`): hoja generada con `xlsx` (SheetJS), con anchos de columna ajustados al contenido.

La arquitectura Strategy permite añadir nuevos formatos (`.csv`, `.docx`) implementando `ExamenExporter` y registrándolo en la fábrica, sin tocar el controlador ni los servicios de negocio.

## arquitectura Frontend (React + TypeScript + Vite)

#### DescargarCalendarioModal (Component)
- **Responsabilidad**: Capturar formato (`pdf`|`excel`) y opciones de columnas (`incluirAula`, `incluirProfesor`, `incluirGrado`); invocar el servicio y disparar la descarga local. Se monta dentro de `ConsultarCalendarioView` (no añade ruta: es self-transition).

#### examenesService (Service)
- **Método**: `descargarCalendario(filtros, formato, opciones): Promise<Blob>` — petición Axios con `responseType: 'blob'`. La descarga se materializa creando un `URL.createObjectURL(blob)` y un elemento `<a>` virtual, evitando problemas de memoria con binarios grandes.

## arquitectura Backend (NestJS + Prisma)

#### Controladores implicados — ExamenesController
- **Endpoint**: `GET /examenes/exportar`.
- **Query params**: `fechaInicio`, `fechaFin`, `gradoId`, `asignaturaId` (opcionales, coherentes con la consulta), `formato` (`pdf`|`excel`, obligatorio), `incluirAula`, `incluirProfesor`, `incluirGrado` (boolean, por defecto `true`).
- **Respuesta**: `200 OK` con binario adjunto (`Content-Disposition: attachment`) y `Content-Type` según formato. Usa `@Res()` para emitir el stream/buffer.

#### Servicios implicados
- **ExportacionService** (`exportar(filtros, formato, opciones): Promise<{ buffer, contentType, filename }>`):
  1. Obtiene los exámenes vía `ExamenesService.findCalendario(filtros)` (reutiliza la lógica de `consultarCalendario`, garantizando consistencia).
  2. Los mapea a `readonly ExamenExportData[]` (estructura plana inmutable, sin acoplar Prisma).
  3. Solicita a `ExamenExporterFactory` el exportador concreto y delega la generación.
- **ExamenExporterFactory**: resuelve `ExcelExporterService` o `PdfExporterService` según `formato`.
- **ExcelExporterService / PdfExporterService**: implementan `ExamenExporter`, formateadores puros (sin acceso a BD).

#### ExamenesService / PrismaService
- Provee los exámenes con `include: { profesor: { include: { usuario } }, aula }`; el `ExportacionService` resuelve `asignatura → grado` para la columna de grado.

### contratos (interfaces)

```typescript
export interface ExamenExportData {
  readonly codigo: string;
  readonly asignatura: string;
  readonly fecha: string;        // YYYY-MM-DD
  readonly hora: string;         // HH:MM
  readonly nombreGrado: string;
  readonly nombreAula: string;
  readonly nombreProfesor: string;
}

export interface ExportOptions {
  incluirAula: boolean;
  incluirProfesor: boolean;
  incluirGrado: boolean;
}

export interface ExamenExporter {
  exportar(datos: readonly ExamenExportData[], opciones: ExportOptions): Promise<Buffer>;
}
```

> **Adaptación al modelo actual**: el esquema vigente no contempla `duracion` ni `tipo` en `Examen` (presentes en el diseño del profesor), por lo que `ExamenExportData` los omite. Las columnas se derivan de los campos reales: `codigo`, `asignatura` (String libre), `fecha`, `hora`, grado resuelto, `aula.codigo` y nombre del profesor (`usuario.nombre + apellido`).

## flujo de datos

1. `descargarCalendarioExamenes()`: el administrador abre `DescargarCalendarioModal` y elige formato/opciones.
2. `examenesService.descargarCalendario()` → `GET /examenes/exportar?...`.
3. `ExamenesController` → `ExportacionService.exportar()`.
4. `ExportacionService` obtiene los exámenes (`ExamenesService.findCalendario`) → `PrismaService` → PostgreSQL.
5. Mapeo a `ExamenExportData[]` → `ExamenExporterFactory.crear(formato)` → `ExamenExporter.exportar()` → `Buffer`.
6. El controlador responde con el binario adjunto → el frontend dispara la descarga → regresa a `CALENDARIO_ABIERTO`.

## componentes implicados

| Capa | Componente | Tecnología |
|---|---|---|
| Presentación | `ConsultarCalendarioView`, `DescargarCalendarioModal`, `examenesService` | React + TS + Axios |
| API | `ExamenesController` (`GET /examenes/exportar`) | NestJS |
| Aplicación | `ExportacionService`, `ExamenesService.findCalendario()` | NestJS |
| Dominio | `ExamenExporterFactory`, `ExamenExporter` (Excel/PDF), `ExamenExportData` | TypeScript + `xlsx` / `pdfkit` |
| Persistencia | `PrismaService` | Prisma ORM |
| Datos | `Examen`, `Asignatura`, `Grado`, `Profesor`, `Usuario`, `Aula` | PostgreSQL 16 |

## dependencias con Generación de Calendario

La exportación refleja el calendario producido por `generarCalendario()` → `confirmar()`. Al reutilizar `ExamenesService.findCalendario()` (el mismo método que alimenta `consultarCalendario()`), el documento descargado es **idéntico** a lo visualizado y a lo persistido por el motor, sin recálculo ni divergencia de datos. La descarga es de solo lectura: nunca muta el calendario generado.

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `ConsultarCalendarioView` | `ConsultarCalendarioView` + `DescargarCalendarioModal (React)` | UI de opciones y descarga local del archivo. |
| `CalendarioController` | `ExamenesController (NestJS)` | Endpoint `GET /examenes/exportar`. |
| `ExportService` | `ExportacionService` + `ExamenExporterFactory` + `ExamenExporter` | Generación técnica del archivo (Strategy + Factory). |
| `ExamenRepository` | `ExamenesService.findCalendario()` + `PrismaService` | Carga filtrada de exámenes a exportar. |
| `:Session` | *(ampliación futura)* | Filtrado por rol vía JWT, fuera del alcance del actor Administrador. |

## referencias

- [Análisis: descargarCalendarioExamenes()](/RUP/01-analisis/casos-uso/0-Administrador/descargarCalendarioExamenes/README.md)
- [Diseño: consultarCalendario()](../consultarCalendario/README.md) - Caso de uso base y origen de los datos.
- [Diseño: generarCalendario()](../generarCalendario/README.md) - Fuente del calendario exportado.
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
</content>
