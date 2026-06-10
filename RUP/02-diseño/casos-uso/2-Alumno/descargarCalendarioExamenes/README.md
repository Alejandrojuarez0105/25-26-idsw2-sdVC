<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/2-Alumno/DiagramaDeContextoAlumno.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/2-Alumno/descargarCalendarioExamenes/README.md)|**Diseño**|Implementación|Pruebas|
|---|---|---|---|---|---|

</div>

# Davidario > descargarCalendarioExamenes > Diseño (Alumno)

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-10
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `descargarCalendarioExamenes()` (self-transition del estado `CALENDARIO_ABIERTO`) para el actor **Alumno**. Reutiliza íntegramente el **patrón Strategy + Factory** ya aprobado para el Administrador y el Profesor (`ExportacionService`, `ExamenExporterFactory`, exportadores PDF/Excel). La **única adaptación** es que el documento exportado contiene exclusivamente **los exámenes de las asignaturas matriculadas del alumno**, por reutilizar `ExamenesService.findCalendario()` con el mismo filtro por rol que `consultarCalendario()`.

### Diagrama de secuencia de diseño

Interacción técnica entre la vista, el modal de descarga, el servicio de exportación y la persistencia.

<div align=center>

|![Diseño de Secuencia: descargarCalendarioExamenes() (Alumno)](/images/02-diseño/casos-uso/2-Alumno/descargarCalendarioExamenes/secuencia-diseño.svg)|
|---|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/2-Alumno/descargarCalendarioExamenes/secuencia-diseño.puml)|

</div>

## diseño completo del caso de uso

Desde la vista de consulta, el alumno abre un **modal de descarga**, selecciona el formato (PDF o Excel) y las columnas a incluir (aula), y solicita la exportación. El backend recupera **exactamente los mismos exámenes que muestra su consulta** (mismos filtros + restricción por las asignaturas matriculadas del JWT), los transforma a una estructura plana inmutable (`ExamenExportData`) y delega la generación del binario en el exportador concreto resuelto por la **fábrica**. El archivo se devuelve como descarga y la vista regresa a `CALENDARIO_ABIERTO`.

## formato de salida previsto

- **PDF** (`application/pdf`, `calendario.pdf`): documento tabular generado con `pdfkit`, con salto de página automático, reimpresión de cabeceras y fecha de generación.
- **Excel** (`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `calendario.xlsx`): hoja generada con `xlsx` (SheetJS), con anchos de columna ajustados al contenido.

La arquitectura Strategy permite añadir nuevos formatos (`.csv`, `.docx`) implementando `ExamenExporter` y registrándolo en la fábrica, sin tocar el controlador ni los servicios de negocio.

## flujo principal

1. `descargarCalendarioExamenes()`: el alumno abre `DescargarCalendarioModal` y elige formato/opciones.
2. `examenesService.descargarCalendario()` → `GET /examenes/exportar?...` (con JWT).
3. El backend obtiene los exámenes del alumno (mismo filtro por matrículas) y genera el binario.
4. El frontend dispara la descarga local y la vista regresa a `CALENDARIO_ABIERTO`.

## flujo alternativo

- **Sin exámenes en el período/asignaturas**: el documento se genera con solo las cabeceras (vacío) o el frontend avisa de que no hay datos a exportar, sin error.
- **Error técnico**: la vista muestra el aviso de fallo de descarga y permite reintentar.

## arquitectura Frontend (React + TypeScript + Vite)

#### DescargarCalendarioModal (Component)
- **Responsabilidad**: Capturar formato (`pdf`|`excel`) y opciones de columnas (`incluirAula`); invocar el servicio y disparar la descarga local. Se monta dentro de `ConsultarCalendarioView` (no añade ruta: es self-transition). **Reutilizado** de Administrador/Profesor; se omiten columnas no aplicables al alumno (profesor).

#### examenesService (Service)
- **Método**: `descargarCalendario(filtros, formato, opciones): Promise<Blob>` — petición Axios con `responseType: 'blob'`. La descarga se materializa con `URL.createObjectURL(blob)` y un `<a>` virtual. **Reutilizado** sin cambios.

## arquitectura Backend (NestJS + Prisma)

#### Controladores implicados — ExamenesController
- **Endpoint**: `GET /examenes/exportar` (**el mismo** que Administrador/Profesor), protegido por `JwtAuthGuard` + `RolesGuard`.
- **Query params**: `fechaInicio`, `fechaFin`, `asignaturaId` (opcionales), `formato` (`pdf`|`excel`, obligatorio), `incluirAula` (boolean, por defecto `true`).
- **Respuesta**: `200 OK` con binario adjunto (`Content-Disposition: attachment`) y `Content-Type` según formato. Usa `@Res()` para emitir el buffer.

#### Servicios implicados
- **ExportacionService** (`exportar(filtros, formato, opciones, usuario): Promise<{ buffer, contentType, filename }>`):
  1. Obtiene los exámenes vía `ExamenesService.findCalendario(filtros, usuario)` (reutiliza la lógica de `consultarCalendario`, **propagando la restricción por matrículas del alumno**).
  2. Los mapea a `readonly ExamenExportData[]` (estructura plana inmutable, sin acoplar Prisma).
  3. Solicita a `ExamenExporterFactory` el exportador concreto y delega la generación.
- **ExamenExporterFactory**: resuelve `ExcelExporterService` o `PdfExporterService` según `formato`. **Reutilizado**.
- **ExcelExporterService / PdfExporterService**: implementan `ExamenExporter`, formateadores puros (sin acceso a BD). **Reutilizados**.

### contratos (interfaces)

```typescript
export interface ExamenExportData {
  readonly codigo: string;
  readonly asignatura: string;
  readonly fecha: string;        // YYYY-MM-DD
  readonly hora: string;         // HH:MM
  readonly nombreAula: string;
}

export interface ExportOptions {
  incluirAula: boolean;
}

export interface ExamenExporter {
  exportar(datos: readonly ExamenExportData[], opciones: ExportOptions): Promise<Buffer>;
}
```

> **Adaptación al actor**: respecto al Administrador se omiten `nombreProfesor` y `nombreGrado` (irrelevantes en el ámbito del alumno). Las interfaces `ExamenExporter`/`ExamenExporterFactory` se mantienen idénticas, por lo que los exportadores no requieren cambios estructurales.

## flujo de datos

1. `descargarCalendarioExamenes()`: el alumno abre `DescargarCalendarioModal` y elige formato/opciones.
2. `examenesService.descargarCalendario()` → `GET /examenes/exportar?...` (con JWT).
3. `ExamenesController` → `ExportacionService.exportar(..., req.user)`.
4. `ExportacionService` obtiene los exámenes (`ExamenesService.findCalendario`, filtro por matrículas) → `PrismaService` → PostgreSQL.
5. Mapeo a `ExamenExportData[]` → `ExamenExporterFactory.crear(formato)` → `ExamenExporter.exportar()` → `Buffer`.
6. El controlador responde con el binario adjunto → el frontend dispara la descarga → regresa a `CALENDARIO_ABIERTO`.

## componentes implicados

| Capa | Componente | Tecnología |
|---|---|---|
| Presentación | `ConsultarCalendarioView`, `DescargarCalendarioModal`, `examenesService` | React + TS + Axios |
| API | `ExamenesController` (`GET /examenes/exportar`) + `RolesGuard` | NestJS |
| Aplicación | `ExportacionService`, `ExamenesService.findCalendario()` (filtro por rol) | NestJS |
| Dominio | `ExamenExporterFactory`, `ExamenExporter` (Excel/PDF), `ExamenExportData` | TypeScript + `xlsx` / `pdfkit` |
| Persistencia | `PrismaService` | Prisma ORM |
| Datos | `Examen`, `Asignatura`, `Matricula`, `Alumno`, `Aula` | PostgreSQL 16 |

## restricción de acceso

La exportación hereda la **misma restricción de visibilidad** que la consulta: al reutilizar `ExamenesService.findCalendario()` con las matrículas del alumno (derivadas del JWT), el documento descargado contiene únicamente los exámenes de sus asignaturas matriculadas. La descarga es de solo lectura: nunca muta el calendario.

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `ConsultarCalendarioView` | `ConsultarCalendarioView` + `DescargarCalendarioModal (React)` | UI de opciones y descarga local del archivo (reutilizada). |
| `CalendarioController` | `ExamenesController (NestJS)` + `RolesGuard` | Endpoint `GET /examenes/exportar` con filtrado por rol. |
| `ExportService` | `ExportacionService` + `ExamenExporterFactory` + `ExamenExporter` | Generación técnica del archivo (Strategy + Factory). |
| `ExamenRepository` | `ExamenesService.findCalendario()` + `PrismaService` | Carga de exámenes del alumno a exportar. |
| `:Session` | `JwtAuthGuard` (claim del alumno → `Matricula`) | Restricción de visibilidad por rol heredada de la consulta. |

## referencias

- [Análisis: descargarCalendarioExamenes() (Alumno)](/RUP/01-analisis/casos-uso/2-Alumno/descargarCalendarioExamenes/README.md)
- [Diseño Profesor: descargarCalendarioExamenes()](../../1-Profesor/descargarCalendarioExamenes/README.md) - Patrón de adaptación por rol reutilizado.
- [Diseño Administrador: descargarCalendarioExamenes()](../../0-Administrador/descargarCalendarioExamenes/README.md) - Arquitectura base.
- [Diseño: consultarCalendario() (Alumno)](../consultarCalendario/README.md) - Caso de uso base y origen de los datos.
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Alumno](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/2-Alumno/DiagramaDeContextoAlumno.svg)
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
