<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/listarConflictosExamenes/README.md)|**Diseño**|[Implementación](/RUP/03-desarrollo/casos-uso/0-Administrador/listarConflictosExamenes/README.md)|Pruebas|
|---|---|---|---|---|---|

</div>

# Davidario > listarConflictosExamenes > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-07
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `listarConflictosExamenes()`. Define la vista de consulta de conflictos, el algoritmo backend para detectar solapamientos de horario (fecha, hora y aula) para un docente, y la devolución de solapamientos horarios mediante una API REST en NestJS.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: listarConflictosExamenes()](/images/02-diseño/casos-uso/0-Administrador/listarConflictosExamenes/secuencia-diseño.svg)|
|---|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/listarConflictosExamenes/secuencia-diseño.puml)|

</div>

## especificación de componentes

### frontend (react)

#### ListarConflictosView (Component)
- **Tecnología**: Functional Component (TSX).
- **Responsabilidad**: Presentar el panel de conflictos en estilo Courier New, delegando la carga y estado al Hook.

#### useConflictosExamenes (Hook)
- **Responsabilidad**: Manejar el estado de carga y refresco de los solapamientos del profesor (`loadConflictos`).
- **Métodos**: `loadConflictos(profesorId)`.

#### examenesService (Service)
- **Responsabilidad**: Consumir el endpoint `GET /examenes/conflictos/:profesorId` a través de Axios (`getConflictos`).

### backend (nestjs)

#### ExamenesController
- **Tecnología**: NestJS Controller.
- **Endpoint**: `GET /examenes/conflictos/:profesorId`.
- **Responsabilidad**: Recibir la petición HTTP y delegar la detección al servicio.

#### ExamenesService
- **Responsabilidad**:
  - `getConflictosPorProfesor(profesorId)`: Consultar todos los exámenes asociados a un profesor.
  - Ejecutar la lógica de detección de solapamientos (evaluar cruces en campos de fecha, hora y aulas).
  - Devolver la lista serializada de conflictos (`ConflictosDTO`).

### base de datos (postgresql)

#### Examen (Entity)
- **Operación**: Lectura indexada de exámenes filtrados por profesor (`SELECT * FROM "Examen" WHERE "profesorId" = :profesorId`).

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `ListarConflictosView` | `ListarConflictosView (React)` | Componente de UI para visualización de conflictos. |
| `ListarConflictosView` | `useConflictosExamenes (React Hook)` | Hook para cargar y gestionar el listado de conflictos. |
| `ConflictosController` | `ExamenesController (NestJS)` | Controlador REST encargado de la ruta de conflictos. |
| `ExamenRepository` | `ExamenesService (NestJS)` | Consulta de exámenes y cálculo de solapamientos. |
| `ProfesorRepository` | `ProfesoresService (NestJS)` | Consulta y validación del docente. |
| `Profesor` | `Profesor (Entity)` | Entidad de profesor involucrada. |

## referencias

- [Análisis: listarConflictosExamenes()](/RUP/01-analisis/casos-uso/0-Administrador/listarConflictosExamenes/README.md)
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Diagramas de Clases](/images/02-diseño/clases-diseño.svg) - Diseño Global
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
