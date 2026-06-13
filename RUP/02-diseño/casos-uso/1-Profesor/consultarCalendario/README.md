<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/1-Profesor/DiagramaDeContextoProfesor.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/1-Profesor/consultarCalendario/README.md)|**Diseño**|[Implementación](/RUP/03-desarrollo/casos-uso/1-Profesor/consultarCalendario/README.md)|Pruebas|
|---|---|---|---|---|---|

</div>

# Davidario > consultarCalendario > Diseño (Profesor)

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-09
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `consultarCalendario()` y de la transición `completarConsulta()` para el actor **Profesor**. Reutiliza íntegramente la arquitectura aprobada para el Administrador (`ConsultarCalendarioView`, `useCalendario`, `examenesService`, endpoint `GET /examenes/calendario`). La **única adaptación** es la **restricción de visibilidad**: el Profesor visualiza exclusivamente **sus propios exámenes** (aquellos cuyo `profesorId` coincide con el del usuario autenticado), aplicada de forma transparente en el backend a partir del JWT, sin que el cliente pueda eludirla.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: consultarCalendario() (Profesor)](/images/02-diseño/casos-uso/1-Profesor/consultarCalendario/secuencia-diseño.svg)|
|---|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/1-Profesor/consultarCalendario/secuencia-diseño.puml)|

</div>

## diseño completo del caso de uso

El profesor abre el calendario desde su menú (`consultarCalendario()` → estado `CALENDARIO_ABIERTO`), visualiza **únicamente los exámenes que supervisa** en una rejilla temporal y puede aplicar filtros por rango de fechas y asignatura. Desde esta vista puede encadenar la descarga (`descargarCalendarioExamenes()`, self-transition) o volver al menú (`completarConsulta()`). No se introduce ninguna entidad nueva: el calendario **es** el subconjunto de `Examen` con `profesorId = <profesor del JWT>`, garantizando la misma **fuente única de verdad** que el Administrador.

## arquitectura Frontend (React + TypeScript + Vite)

#### ConsultarCalendarioView (Component)
- **Tecnología**: Functional Component (TSX) **reutilizado** del Administrador, estilo Courier New coherente con el resto del proyecto.
- **Ruta**: `/profesor/calendario/consultar` (registrada en `App.tsx`, protegida por *guard* de rol Profesor).
- **Responsabilidad**: Presentar la rejilla del calendario y los controles de filtro/navegación; delega carga y estado al hook.
- **Características de UI**:
  - Selector de rango temporal y navegación (mes/semana).
  - Filtro académico por **Asignatura** (limitado a las asignaturas de sus exámenes). El filtro por Grado del Administrador se omite por no aportar valor en el ámbito acotado del profesor.
  - Cada tarjeta de examen muestra: **asignatura**, **fecha**, **hora** y **aula** (`aula.codigo`), con etiqueta `(sin aula)` para FK nula. No se muestra columna de profesor (siempre es el propio).
  - Botones **📥 Descargar calendario** (prepara `descargarCalendarioExamenes()`) y **🏠 Volver al menú** (`completarConsulta()`).

#### useCalendario (Hook)
- **Responsabilidad**: Gestionar el estado (`examenes`, `filtros`, `cargando`, `error`) y **pre-agrupar** los exámenes por fecha en un `Map` (`O(N)`) para que el renderizado de cada celda sea `O(1)`. **Reutilizado** sin cambios.
- **Método**: `loadCalendario(filtros)`.

#### examenesService (Service)
- **Responsabilidad**: Consumir vía Axios el endpoint de calendario. **Reutilizado** sin cambios.
- **Método**: `findCalendario(filtros): Promise<ExamenCalendarioDto[]>`.

## arquitectura Backend (NestJS + Prisma)

#### Controladores implicados — ExamenesController
- **Endpoint**: `GET /examenes/calendario` (**el mismo** que el Administrador), protegido por `JwtAuthGuard` + `RolesGuard`.
- **Query params** (todos opcionales): `fechaInicio` (YYYY-MM-DD), `fechaFin` (YYYY-MM-DD), `asignaturaId` (UUID).
- **Responsabilidad**: Recibir la petición y delegar en el servicio, **propagando el usuario autenticado** (`req.user`) para que el servicio aplique el filtro por rol.

#### Servicios implicados — ExamenesService
- **Método**: `findCalendario(filtros, usuario): Promise<ExamenCalendarioDto[]>`.
- **Responsabilidades**:
  - Cuando `usuario.rol === 'Profesor'`, **forzar** `where.profesorId = usuario.profesorId` (derivado del JWT), independientemente de los parámetros recibidos del cliente. Esta restricción es **no eludible** desde el frontend.
  - Recuperar los exámenes mediante `prisma.examen.findMany` con `include: { aula }` y filtro temporal `where: { fecha: { gte, lte } }`.
  - Resolver el campo libre `Examen.asignatura` contra el catálogo `Asignatura` para el filtro por asignatura.
  - Serializar a `ExamenCalendarioDto`.

#### PrismaService / PostgreSQL
- **Operación**: lectura indexada de los exámenes del profesor (índices `@@index([profesorId])` y `@@index([fecha, hora])`), con join a `Aula`.

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

> **Adaptación al actor**: respecto al DTO del Administrador se omite `profesor` (siempre es el propio) y `gradoNombre` no es relevante para el ámbito del profesor, simplificando la carga útil.

## flujo de datos

1. `consultarCalendario()`: el profesor abre `ConsultarCalendarioView` y (opcionalmente) define filtros.
2. `useCalendario.loadCalendario(filtros)` → `examenesService.findCalendario(filtros)` → `GET /examenes/calendario`.
3. `ExamenesController.findCalendario(req.user)` → `ExamenesService.findCalendario(filtros, usuario)`.
4. El servicio **fija `profesorId` del JWT**; `PrismaService` recupera solo sus exámenes con su `aula`.
5. Respuesta `ExamenCalendarioDto[]` → el hook la indexa por fecha en un `Map` → la vista renderiza la rejilla.
6. Acciones: `descargarCalendarioExamenes()` (self) o `completarConsulta()` → menú.

## componentes implicados

| Capa | Componente | Tecnología |
|---|---|---|
| Presentación | `ConsultarCalendarioView`, `useCalendario`, `examenesService` | React + TS + Axios |
| API | `ExamenesController` (`GET /examenes/calendario`) + `RolesGuard` | NestJS |
| Aplicación | `ExamenesService.findCalendario()` (filtro por rol) | NestJS |
| Persistencia | `PrismaService` | Prisma ORM |
| Datos | `Examen`, `Asignatura`, `Profesor`, `Aula` | PostgreSQL 16 |

## restricción de acceso (clave de la rama Profesor)

A diferencia del Administrador (visibilidad total), el Profesor tiene **visibilidad parcial**: el filtro `profesorId` se inyecta en el servidor a partir del claim del JWT, nunca desde parámetros del cliente. Cualquier intento de consultar exámenes ajenos devuelve un conjunto vacío. Esta es exactamente la "ampliación compatible por rol" anticipada como nota de alcance en el diseño del Administrador, materializada aquí sin alterar la arquitectura del endpoint.

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `ConsultarCalendarioView` | `ConsultarCalendarioView (React)` + `useCalendario (Hook)` | UI de visualización e indexación del calendario (reutilizada). |
| `CalendarioController` | `ExamenesController (NestJS)` + `RolesGuard` | Endpoint `GET /examenes/calendario` con filtrado por rol. |
| `ExamenRepository` | `ExamenesService` + `PrismaService` | Consulta filtrada por `profesorId` del JWT. |
| `Examen` / `Asignatura` | modelos Prisma + `ExamenCalendarioDto` | Exámenes propios resueltos para la vista. |
| `:Session` | `JwtAuthGuard` (claim `profesorId`) | Restricción de visibilidad por rol, materializada en esta rama. |

## referencias

- [Análisis: consultarCalendario() (Profesor)](/RUP/01-analisis/casos-uso/1-Profesor/consultarCalendario/README.md)
- [Diseño Administrador: consultarCalendario()](../../0-Administrador/consultarCalendario/README.md) - Arquitectura base reutilizada.
- [Diseño: descargarCalendarioExamenes() (Profesor)](../descargarCalendarioExamenes/README.md) - Exportación del calendario visualizado.
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Profesor](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/1-Profesor/DiagramaDeContextoProfesor.svg)
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
