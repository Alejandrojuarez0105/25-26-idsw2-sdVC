<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/2-Alumno/DiagramaDeContextoAlumno.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/2-Alumno/consultarCalendario/README.md)|**Diseño**|Implementación|Pruebas|
|---|---|---|---|---|---|

</div>

# Davidario > consultarCalendario > Diseño (Alumno)

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-10
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `consultarCalendario()` y de la transición `completarConsulta()` para el actor **Alumno**. Reutiliza íntegramente la arquitectura aprobada para el Administrador y el Profesor (`ConsultarCalendarioView`, `useCalendario`, `examenesService`, endpoint `GET /examenes/calendario`). La **única adaptación** es la **restricción de visibilidad**: el Alumno visualiza exclusivamente **los exámenes de las asignaturas en las que está matriculado**, resueltas en el backend a partir del JWT (`Alumno → Matricula → Asignatura`), sin que el cliente pueda eludirla.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: consultarCalendario() (Alumno)](/images/02-diseño/casos-uso/2-Alumno/consultarCalendario/secuencia-diseño.svg)|
|---|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/2-Alumno/consultarCalendario/secuencia-diseño.puml)|

</div>

## diseño completo del caso de uso

El alumno abre el calendario desde su menú (`consultarCalendario()` → estado `CALENDARIO_ABIERTO`), visualiza **únicamente los exámenes de sus asignaturas matriculadas** en una rejilla temporal y puede aplicar filtros por rango de fechas y asignatura. Desde esta vista puede encadenar la descarga (`descargarCalendarioExamenes()`, self-transition) o volver al menú (`completarConsulta()`). No se introduce ninguna entidad nueva: el calendario **es** el subconjunto de `Examen` cuyas asignaturas pertenecen a las `Matricula` del alumno, garantizando la misma **fuente única de verdad** que el Administrador.

## flujo principal

1. El Alumno abre `ConsultarCalendarioView` y (opcionalmente) define filtros (rango de fechas, asignatura).
2. `useCalendario.loadCalendario(filtros)` → `examenesService.findCalendario(filtros)` → `GET /examenes/calendario` (con JWT).
3. El backend resuelve el `alumnoId` del JWT, deriva sus `asignaturaId` matriculadas y **filtra** los exámenes a ese conjunto.
4. La vista renderiza la rejilla (fecha, hora, asignatura, aula) indexada por fecha.

## flujo alternativo

- **Sin matrículas / sin exámenes**: el alumno no tiene asignaturas matriculadas o ninguna tiene examen programado → la vista muestra el aviso "no hay exámenes" (estado vacío), sin error técnico.
- **Error técnico** (red/500): la vista muestra el panel de error con opción de reintento.

## arquitectura Frontend (React + TypeScript + Vite)

#### ConsultarCalendarioView (Component)
- **Tecnología**: Functional Component (TSX) **reutilizado** de Administrador/Profesor, estilo Courier New coherente con el resto del proyecto.
- **Ruta**: `/alumno/calendario/consultar` (registrada en `App.tsx`, protegida por *guard* de rol Alumno).
- **Responsabilidad**: Presentar la rejilla del calendario y los controles de filtro/navegación; delega carga y estado al hook.
- **Características de UI**:
  - Selector de rango temporal y navegación (mes/semana).
  - Filtro académico por **Asignatura** (limitado a las asignaturas matriculadas del alumno). El filtro por Grado del Administrador se omite por no aportar valor en el ámbito acotado del alumno.
  - Cada tarjeta de examen muestra: **asignatura**, **fecha**, **hora** y **aula** (`aula.codigo`), con etiqueta `(sin aula)` para FK nula. No se muestra columna de profesor (irrelevante para el alumno).
  - Botones **📥 Descargar calendario** (prepara `descargarCalendarioExamenes()`) y **🏠 Volver al menú** (`completarConsulta()`).

#### useCalendario (Hook)
- **Responsabilidad**: Gestionar el estado (`examenes`, `filtros`, `cargando`, `error`) y **pre-agrupar** los exámenes por fecha en un `Map` (`O(N)`) para que el renderizado de cada celda sea `O(1)`. **Reutilizado** sin cambios.
- **Método**: `loadCalendario(filtros)`.

#### examenesService (Service)
- **Responsabilidad**: Consumir vía Axios el endpoint de calendario. **Reutilizado** sin cambios.
- **Método**: `findCalendario(filtros): Promise<ExamenCalendarioDto[]>`.

## arquitectura Backend (NestJS + Prisma)

#### Controladores implicados — ExamenesController
- **Endpoint**: `GET /examenes/calendario` (**el mismo** que Administrador/Profesor), protegido por `JwtAuthGuard` + `RolesGuard`.
- **Query params** (todos opcionales): `fechaInicio` (YYYY-MM-DD), `fechaFin` (YYYY-MM-DD), `asignaturaId` (UUID).
- **Responsabilidad**: Recibir la petición y delegar en el servicio, **propagando el usuario autenticado** (`req.user`) para que el servicio aplique el filtro por rol.

#### Servicios implicados — ExamenesService
- **Método**: `findCalendario(filtros, usuario): Promise<ExamenCalendarioDto[]>`.
- **Responsabilidades**:
  - Cuando `usuario.rol === 'Alumno'`, **derivar** el conjunto de asignaturas matriculadas del alumno (`prisma.matricula.findMany({ where: { alumnoId } })` → `asignaturaId[]`) y **restringir** los exámenes a ese conjunto (resolviendo el campo libre `Examen.asignatura` contra el catálogo `Asignatura`). Esta restricción es **no eludible** desde el frontend.
  - Recuperar los exámenes mediante `prisma.examen.findMany` con `include: { aula }` y filtro temporal `where: { fecha: { gte, lte } }`.
  - Serializar a `ExamenCalendarioDto`.

#### PrismaService / PostgreSQL
- **Operación**: lectura indexada de exámenes (índice `@@index([fecha, hora])`) con join a `Aula`, acotada a las asignaturas matriculadas del alumno (`Matricula` con `@@index([alumnoId])`).

### contrato (DTO)

```typescript
interface ExamenCalendarioDto {
  id: string;            // UUID
  codigo: string;
  asignatura: string;    // nombre libre del examen
  fecha: string;         // YYYY-MM-DD
  hora: string;          // HH:MM
  aula: string | null;   // aula.codigo
}
```

> **Adaptación al actor**: respecto al DTO del Administrador se omite `profesor` y `gradoNombre` (no relevantes para el ámbito del alumno), simplificando la carga útil. Es el mismo DTO usado por el Profesor.

## flujo de datos

1. `consultarCalendario()`: el alumno abre `ConsultarCalendarioView` y (opcionalmente) define filtros.
2. `useCalendario.loadCalendario(filtros)` → `examenesService.findCalendario(filtros)` → `GET /examenes/calendario`.
3. `ExamenesController.findCalendario(req.user)` → `ExamenesService.findCalendario(filtros, usuario)`.
4. El servicio **deriva las asignaturas matriculadas del JWT** y restringe los exámenes a ese conjunto; `PrismaService` recupera los exámenes con su `aula`.
5. Respuesta `ExamenCalendarioDto[]` → el hook la indexa por fecha en un `Map` → la vista renderiza la rejilla.
6. Acciones: `descargarCalendarioExamenes()` (self) o `completarConsulta()` → menú.

## componentes implicados

| Capa | Componente | Tecnología |
|---|---|---|
| Presentación | `ConsultarCalendarioView`, `useCalendario`, `examenesService` | React + TS + Axios |
| API | `ExamenesController` (`GET /examenes/calendario`) + `RolesGuard` | NestJS |
| Aplicación | `ExamenesService.findCalendario()` (filtro por rol) | NestJS |
| Persistencia | `PrismaService` | Prisma ORM |
| Datos | `Examen`, `Asignatura`, `Matricula`, `Alumno`, `Aula` | PostgreSQL 16 |

## restricción de acceso (clave de la rama Alumno)

A diferencia del Administrador (visibilidad total) y del Profesor (visibilidad por `profesorId`), el Alumno tiene **visibilidad por matrícula**: el conjunto de asignaturas se deriva en el servidor de las `Matricula` del alumno autenticado (resuelto desde el claim del JWT), nunca desde parámetros del cliente. Cualquier intento de consultar exámenes de asignaturas no matriculadas devuelve un conjunto vacío. Es la "ampliación compatible por rol" anticipada como nota de alcance en el diseño del Administrador, materializada aquí sin alterar la arquitectura del endpoint.

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `ConsultarCalendarioView` | `ConsultarCalendarioView (React)` + `useCalendario (Hook)` | UI de visualización e indexación del calendario (reutilizada). |
| `CalendarioController` | `ExamenesController (NestJS)` + `RolesGuard` | Endpoint `GET /examenes/calendario` con filtrado por rol. |
| `ExamenRepository` | `ExamenesService` + `PrismaService` | Consulta acotada a las asignaturas matriculadas del alumno. |
| `Examen` / `Asignatura` / `Grado` | modelos Prisma + `ExamenCalendarioDto` | Jerarquía académica resuelta para la vista. |
| `:Session` | `JwtAuthGuard` (claim del alumno → `Matricula`) | Restricción de visibilidad por rol, materializada en esta rama. |

## referencias

- [Análisis: consultarCalendario() (Alumno)](/RUP/01-analisis/casos-uso/2-Alumno/consultarCalendario/README.md)
- [Diseño Profesor: consultarCalendario()](../../1-Profesor/consultarCalendario/README.md) - Patrón de adaptación por rol reutilizado.
- [Diseño Administrador: consultarCalendario()](../../0-Administrador/consultarCalendario/README.md) - Arquitectura base.
- [Diseño: descargarCalendarioExamenes() (Alumno)](../descargarCalendarioExamenes/README.md) - Exportación del calendario visualizado.
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Alumno](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/2-Alumno/DiagramaDeContextoAlumno.svg)
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
