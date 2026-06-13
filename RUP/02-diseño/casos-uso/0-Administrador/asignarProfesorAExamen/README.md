<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/asignarProfesorAExamen/README.md)|**Diseño**|[Implementación](/RUP/03-desarrollo/casos-uso/0-Administrador/asignarProfesorAExamen/README.md)|Pruebas|
|---|---|---|---|---|---|

</div>

# Davidario > asignarProfesorAExamen > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-07
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `asignarProfesorAExamen()`. Especifica la interfaz para vincular un docente supervisor a un examen disponible, la validación de solapamiento horario del profesor en el backend, y la actualización de persistencia correspondiente en PostgreSQL.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: asignarProfesorAExamen()](/images/02-diseño/casos-uso/0-Administrador/asignarProfesorAExamen/secuencia-diseño.svg)|
|---|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/asignarProfesorAExamen/secuencia-diseño.puml)|

</div>

## especificación de componentes

### frontend (react)

#### AsignarProfesorView (Component)
- **Tecnología**: Functional Component (TSX).
- **Responsabilidad**: Presentar la lista de exámenes disponibles y capturar la selección del profesor y examen para realizar el vínculo.

#### useAsignaciones (Hook)
- **Responsabilidad**: Gestionar la carga de exámenes disponibles (`loadExamenesDisponibles`) y procesar la llamada de asignación (`asignarProfesor`).
- **Métodos**: `loadExamenesDisponibles()`, `asignarProfesor(profesorId, examenId)`.

#### AsignacionesService (Service)
- **Responsabilidad**: Consumir endpoints a través de Axios:
  - `GET /examenes/disponibles` (`getExamenesSinProfesor`).
  - `POST /examenes/asignar-profesor` (`asignar`).

### backend (nestjs)

#### AsignacionesController
- **Tecnología**: NestJS Controller.
- **Endpoint**: `GET /examenes/disponibles` y `POST /examenes/asignar-profesor`.
- **Responsabilidad**: Exponer las rutas REST correspondientes.

#### AsignacionesService
- **Responsabilidad**:
  - `findExamenesSinProfesor()`: Recuperar exámenes sin supervisor asignado (`WHERE "profesorId" IS NULL`).
  - `asignar(profesorId, examenId)`: Consultar exámenes existentes del profesor para validar solapamientos de horario (fecha y hora). Si no está disponible, lanzar `ConflictException` (409). Si está disponible, asociar el profesor al examen en PostgreSQL (`profesorId`).

### base de datos (postgresql)

#### Examen (Entity)
- **Operaciones**:
  - `SELECT * FROM "Examen" WHERE "profesorId" IS NULL`.
  - `SELECT * FROM "Examen" WHERE "profesorId" = :profesorId`.
  - `UPDATE "Examen" SET "profesorId" = :profesorId WHERE id = :examenId`.

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `AsignarProfesorView` | `AsignarProfesorView (React)` | Vista de asignación de exámenes. |
| `AsignarProfesorView` | `useAsignaciones (React Hook)` | Hook para cargar exámenes disponibles y realizar la asignación. |
| `AsignacionesController` | `AsignacionesController (NestJS)` | Controlador REST del backend. |
| `ExamenRepository` | `ExamenesService (NestJS)` | Consulta de exámenes y asignación del profesor. |
| `ProfesorRepository` | `ProfesoresService (NestJS)` | Validación del profesor asignado. |
| `Examen` | `Examen (Entity)` | Registro de examen modificado. |
| `Profesor` | `Profesor (Entity)` | Registro de profesor origen. |

## referencias

- [Análisis: asignarProfesorAExamen()](/RUP/01-analisis/casos-uso/0-Administrador/asignarProfesorAExamen/README.md)
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Diagramas de Clases](/images/02-diseño/clases-diseño.svg) - Diseño Global
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
