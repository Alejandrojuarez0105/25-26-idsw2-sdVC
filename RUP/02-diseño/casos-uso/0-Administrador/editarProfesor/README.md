<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/editarProfesor/README.md)|**Diseño**|Implementación|Pruebas|
|---|---|---|---|---|---|

</div>

# Davidario > editarProfesor > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-07
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `editarProfesor()`. Define el formulario precargado de edición, la validación de unicidad de correos y la persistencia diferencial de asignaturas impartidas (`ProfesorAsignatura`) a través de un servicio REST modular.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: editarProfesor()](/images/02-diseño/casos-uso/0-Administrador/editarProfesor/secuencia-diseño.svg)|
|---|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/editarProfesor/secuencia-diseño.puml)|

</div>

## especificación de componentes

### frontend (react)

#### EditarProfesorView (Component)
- **Tecnología**: Functional Component (TSX).
- **Responsabilidad**: Presentar los inputs editables y un panel interactivo para matricular/remover materias asignadas al docente.

#### useProfesorForm (Hook)
- **Responsabilidad**: Gestionar la carga inicial de datos (`loadProfesor`), estado de modificaciones y el envío de cambios (`update`).
- **Métodos**: `loadProfesor(id)`, `update(id, data)`.

#### profesoresService (Service)
- **Responsabilidad**: Consumir endpoints a través de Axios:
  - `GET /profesores/:id` (`getProfesorById`).
  - `PUT /profesores/:id` (`updateProfesor`).

### backend (nestjs)

#### ProfesoresController
- **Tecnología**: NestJS Controller.
- **Endpoints**: `GET /profesores/:id` y `PUT /profesores/:id`.
- **Responsabilidad**: Exponer rutas de consulta y actualización de perfiles docentes.

#### ProfesoresService
- **Responsabilidad**:
  - `findOne(id)`: Consultar los datos relacionales del profesor.
  - `update(id, dto)`: Transactional update. Actualiza nombre/email en `Usuario`, departamento en `Profesor`, e inserta/remueve de forma diferencial relaciones en la tabla `ProfesorAsignatura`.

### base de datos (postgresql)

#### Profesor, Usuario & ProfesorAsignatura (Entities)
- **Operación**: Actualización e integridad referencial (`UPDATE` / `INSERT` / `DELETE`).

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `EditarProfesorView` | `EditarProfesorView (React)` | Vista de formulario de edición en el cliente. |
| `EditarProfesorView` | `useProfesorForm (React Hook)` | Hook para carga y gestión de cambios de formulario. |
| `ProfesorController` | `ProfesoresController (NestJS)` | Controlador REST del backend. |
| `ProfesorRepository` | `ProfesoresService (NestJS)` | Lógica transaccional de actualización y sincronización N:M. |
| `Profesor` | `Profesor (Entity)` | Registro de base de datos a modificar. |

## referencias

- [Análisis: editarProfesor()](/RUP/01-analisis/casos-uso/0-Administrador/editarProfesor/README.md)
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Diagramas de Clases](/images/02-diseño/clases-diseño.svg) - Diseño Global
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
