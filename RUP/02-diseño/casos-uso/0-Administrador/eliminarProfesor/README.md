<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/eliminarProfesor/README.md)|**Diseño**|Implementación|Pruebas|
|---|---|---|---|---|---|

</div>

# Davidario > eliminarProfesor > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-07
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `eliminarProfesor()`. Define la vista de confirmación, la validación del estado referencial en la base de datos (conteo de asignaturas y exámenes asociados), y el borrado seguro del perfil del docente.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: eliminarProfesor()](/images/02-diseño/casos-uso/0-Administrador/eliminarProfesor/secuencia-diseño.svg)|
|---|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/eliminarProfesor/secuencia-diseño.puml)|

</div>

## especificación de componentes

### frontend (react)

#### EliminarProfesorView (Component)
- **Tecnología**: Functional Component (TSX).
- **Responsabilidad**: Presentar los datos de los profesores seleccionados a eliminar y requerir confirmación nativa del usuario.

#### useProfesoresDelete (Hook)
- **Responsabilidad**: Gestionar el estado de la eliminación del profesor y el manejo de excepciones por dependencias relacionales activas.
- **Métodos**: `removeProfesor(id)`.

#### profesoresService (Service)
- **Responsabilidad**: Consumir el endpoint `DELETE /profesores/:id` a través de Axios (`deleteProfesor`).

### backend (nestjs)

#### ProfesoresController
- **Tecnología**: NestJS Controller.
- **Endpoint**: `DELETE /profesores/:id`.
- **Responsabilidad**: Procesar el parámetro ID de la URL y retornar estado `204 No Content` tras el éxito.

#### ProfesoresService
- **Responsabilidad**:
  - `remove(id)`: Consultar dependencias activas del profesor.
  - Ejecutar consultas de conteo (`SELECT COUNT(*)`) sobre relaciones de asignaturas (`AsignaturaProfesor` / `ProfesorAsignatura`) y exámenes supervisados (`Examen`).
  - Si existen dependencias, lanzar `ConflictException` (409).
  - Si no, eliminar el `Usuario` del profesor (lo que remueve el `Profesor` en cascada).

### base de datos (postgresql)

#### Profesor & Usuario (Entities)
- **Operación**: Verificación referencial y borrado físico (`DELETE FROM "Usuario"`).

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `EliminarProfesorView` | `EliminarProfesorView (React)` | Componente de UI para confirmación de borrado. |
| `EliminarProfesorView` | `useProfesoresDelete (React Hook)` | Hook de control para la acción de borrado y errores. |
| `ProfesorController` | `ProfesoresController (NestJS)` | Controlador REST del backend. |
| `ProfesorRepository` | `ProfesoresService (NestJS)` | Lógica de validación referencial e inicio de borrado. |
| `Profesor` | `Profesor (Entity)` | Instancia física de base de datos a remover. |
| `AsignaturaRepository` | `PrismaClient` | Conteo de dependencias de asignaturas. |
| `ExamenRepository` | `PrismaClient` | Conteo de dependencias de exámenes. |

## referencias

- [Análisis: eliminarProfesor()](/RUP/01-analisis/casos-uso/0-Administrador/eliminarProfesor/README.md)
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Diagramas de Clases](/images/02-diseño/clases-diseño.svg) - Diseño Global
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
