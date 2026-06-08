<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/consultarCalendario/README.md)|**Diseño**|Implementación|Pruebas|
|---|---|---|---|---|---|

</div>

# Davidario > consultarCalendario > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-08
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `consultarCalendario()` y de la transición `completarConsulta()`. Define la vista de visualización del calendario de exámenes ya programado, el endpoint REST de consulta con filtros y la resolución de la jerarquía académica (`Examen → Asignatura → Grado`). La consulta opera sobre los mismos datos persistidos por `generarCalendario()`, garantizando una **fuente única de verdad** (los propios exámenes con su `fecha`, `hora`, `aulaId` y `profesorId`).

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: consultarCalendario()](/images/02-diseño/casos-uso/0-Administrador/consultarCalendario/secuencia-diseño.svg)|
|---|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/consultarCalendario/secuencia-diseño.puml)|

</div>

## diseño completo del caso de uso

El administrador abre el calendario desde el menú (`consultarCalendario()` → estado `CALENDARIO_ABIERTO`), visualiza todos los exámenes programados en una rejilla temporal y puede aplicar filtros por rango de fechas, grado y asignatura. Desde esta vista puede encadenar la descarga (`descargarCalendarioExamenes()`, self-transition) o volver al menú (`completarConsulta()`). No se introduce ninguna entidad nueva: el calendario **es** el conjunto de `Examen` con sus asignaciones, coherente con el refactor de FKs (`profesorId`/`aulaId`) y con la rama de Generación de Calendario.

## arquitectura Frontend (React + TypeScript + Vite)

#### ConsultarCalendarioView (Component)
- **Tecnología**: Functional Component (TSX), estilo Courier New coherente con `ExamenesView`, `GenerarCalendarioView` y `ListarConflictosExamenesView`.
- **Ruta**: `/admin/calendario/consultar` (registrada en `App.tsx`).
- **Responsabilidad**: Presentar la rejilla del calendario y los controles de filtro/navegación; delega carga y estado al hook.
- **Características de UI**:
  - Selector de rango temporal y navegación (mes/semana).
  - Filtros académicos: desplegable de **Grado** y de **Asignatura** (dependiente del grado).
  - Cada tarjeta de examen muestra: **asignatura**, **fecha**, **hora**, **aula** (`aula.codigo`) y **profesor** (`usuario.nombre + apellido`), con etiquetas `(sin aula)` / `(sin profesor)` para FKs nulas.
  - Botones **📥 Descargar calendario** (prepara `descargarCalendarioExamenes()`) y **🏠 Volver al menú** (`completarConsulta()`).

#### useCalendario (Hook)
- **Responsabilidad**: Gestionar el estado (`examenes`, `filtros`, `cargando`, `error`) y **pre-agrupar** los exámenes por fecha en un `Map` (complejidad lineal `O(N)`) para que el renderizado de cada celda sea `O(1)`.
- **Método**: `loadCalendario(filtros)`.

#### examenesService (Service)
- **Responsabilidad**: Consumir vía Axios el endpoint de calendario, reutilizando el servicio de exámenes ya existente.
- **Método**: `findCalendario(filtros): Promise<ExamenCalendarioDto[]>`.

## arquitectura Backend (NestJS + Prisma)

#### Controladores implicados — ExamenesController
- **Endpoint**: `GET /examenes/calendario`.
- **Query params** (todos opcionales): `fechaInicio` (YYYY-MM-DD), `fechaFin` (YYYY-MM-DD), `gradoId` (UUID), `asignaturaId` (UUID).
- **Responsabilidad**: Recibir la petición y delegar en el servicio. Se ubica en el módulo `examenes` existente (no se crea un módulo nuevo), respetando el ordenamiento de rutas estáticas antes de `@Get(':id')`.

#### Servicios implicados — ExamenesService
- **Método**: `findCalendario(filtros): Promise<ExamenCalendarioDto[]>`.
- **Responsabilidades**:
  - Recuperar los exámenes mediante `prisma.examen.findMany` con `include: { profesor: { include: { usuario } }, aula }` y filtro temporal `where: { fecha: { gte, lte } }`.
  - Resolver el campo libre `Examen.asignatura` contra el catálogo `Asignatura` (por `nombre`/`codigo`) para obtener `gradoId`/`grado` y permitir los filtros dimensionales.
  - Serializar a `ExamenCalendarioDto` (datos planos para la vista).

#### PrismaService / PostgreSQL
- **Operación**: lectura indexada de exámenes programados (índice `@@index([fecha, hora])`), con joins a `Profesor`/`Usuario` y `Aula`.

### contrato (DTO)

```typescript
interface ExamenCalendarioDto {
  id: string;            // UUID
  codigo: string;
  asignatura: string;    // nombre libre del examen
  gradoNombre: string | null;   // resuelto vía catálogo
  fecha: string;         // YYYY-MM-DD
  hora: string;          // HH:MM
  aula: string | null;       // aula.codigo
  profesor: string | null;   // "nombre apellido"
}
```

## flujo de datos

1. `consultarCalendario()`: el administrador abre `ConsultarCalendarioView` y (opcionalmente) define filtros.
2. `useCalendario.loadCalendario(filtros)` → `examenesService.findCalendario(filtros)` → `GET /examenes/calendario`.
3. `ExamenesController.findCalendario()` → `ExamenesService.findCalendario()`.
4. `PrismaService` recupera los exámenes con sus relaciones (`profesor.usuario`, `aula`); el servicio resuelve `asignatura → grado` y aplica los filtros dimensionales.
5. Respuesta `ExamenCalendarioDto[]` → el hook la indexa por fecha en un `Map` → la vista renderiza la rejilla.
6. Acciones: `descargarCalendarioExamenes()` (self) o `completarConsulta()` → menú.

## componentes implicados

| Capa | Componente | Tecnología |
|---|---|---|
| Presentación | `ConsultarCalendarioView`, `useCalendario`, `examenesService` | React + TS + Axios |
| API | `ExamenesController` (`GET /examenes/calendario`) | NestJS |
| Aplicación | `ExamenesService.findCalendario()` | NestJS |
| Persistencia | `PrismaService` | Prisma ORM |
| Datos | `Examen`, `Asignatura`, `Grado`, `Profesor`, `Usuario`, `Aula` | PostgreSQL 16 |

## dependencias con Generación de Calendario

`consultarCalendario()` **consume directamente** el resultado persistido por `generarCalendario()` → `confirmar()`: los campos `fecha`, `hora`, `aulaId` y `profesorId` que el motor asigna y la confirmación transaccional escribe son exactamente los que esta vista lee y muestra. No hay duplicación de estado ni tabla intermedia; la sincronización es inmediata por compartir la misma tabla `Examen`. Cualquier ampliación del motor (p. ej. preferencias docentes) se refleja automáticamente en la consulta sin cambios en este caso de uso.

> **Nota de alcance**: el diseño se centra en el actor **Administrador** (visibilidad total). La restricción de visibilidad por rol (Profesor → sus exámenes; Alumno → su grado) corresponde a las ramas de esos actores y se contempla como ampliación compatible (filtro adicional por `profesorId`/`gradoId` derivado del JWT) sin alterar esta arquitectura.

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `ConsultarCalendarioView` | `ConsultarCalendarioView (React)` + `useCalendario (Hook)` | UI de visualización e indexación del calendario. |
| `CalendarioController` | `ExamenesController (NestJS)` | Endpoint `GET /examenes/calendario`. |
| `ExamenRepository` | `ExamenesService` + `PrismaService` | Consulta filtrada de exámenes programados. |
| `Examen` / `Asignatura` / `Grado` | modelos Prisma + `ExamenCalendarioDto` | Jerarquía académica resuelta para la vista. |
| `:Session` | *(ampliación futura)* | Filtrado por rol vía JWT, fuera del alcance del actor Administrador. |

## referencias

- [Análisis: consultarCalendario()](/RUP/01-analisis/casos-uso/0-Administrador/consultarCalendario/README.md)
- [Diseño: generarCalendario()](../generarCalendario/README.md) - Fuente de los datos consultados.
- [Diseño: descargarCalendarioExamenes()](../descargarCalendarioExamenes/README.md) - Exportación del calendario visualizado.
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
</content>
