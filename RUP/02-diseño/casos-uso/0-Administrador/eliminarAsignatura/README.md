<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/eliminarAsignatura/README.md)|**Diseño**|Implementación|Pruebas|
|-|-|-|-|-|-|

</div>

# Davidario > eliminarAsignatura > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.1
- **Fecha**: 04/06/2026
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `eliminarAsignatura()`. Define el flujo de borrado seguro de materias, incorporando un paso intermedio de verificación de impacto para notificar al Administrador sobre dependencias críticas (ej. exámenes programados) antes de ejecutar la eliminación física en PostgreSQL.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: eliminarAsignatura()](/images/02-diseño/casos-uso/0-Administrador/eliminarAsignatura/secuencia-diseño.svg)|
|-|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/eliminarAsignatura/secuencia-diseño.puml)|

</div>

## especificación de componentes

### frontend (react)

#### AsignaturasListView (Component)
- **Tecnología**: Functional Component (TSX).
- **Responsabilidad**: Presentar el listado, capturar la intención de borrado y orquestar el flujo de confirmación.

#### useAsignaturas (Hook)
- **Responsabilidad**: Proporcionar las funciones `verificarImpacto(id)` y `removeAsignatura(id)` para coordinar con la API.

#### AsignaturasService (Service - Frontend)
- **Responsabilidad**: Encapsular las peticiones `GET /asignaturas/:id/impacto` y `DELETE /asignaturas/:id`.

### backend (nestjs)

#### AsignaturasController
- **Tecnología**: NestJS Controller.
- **Endpoints**: 
  - `GET /.../impacto`: Consultar dependencias.
  - `DELETE /:id`: Ejecutar el borrado.

#### AsignaturasService (Service - Backend)
- **Responsabilidad**: 
  - `countExamenes(id)`: Consultar en PostgreSQL el número de exámenes vinculados.
  - `remove(id)`: Ejecutar la sentencia de eliminación mediante Prisma.

### base de datos (postgresql)

#### Asignatura (Entity)
- **Operación**: Eliminación del registro. Si existe eliminación lógica, se actualiza el campo de estado.

## flujo de diseño detallado

### 1. verificación de impacto
- El Administrador pulsa en el botón eliminar de la lista.
- El sistema invoca al backend para contar cuántos exámenes dependen de esta asignatura.
- El frontend presenta un diálogo de confirmación que incluye el dato real: *"Esta materia tiene X exámenes asociados. ¿Desea continuar?"*.

### 2. ejecución de borrado
- Tras la confirmación final, el hook dispara `removeAsignatura`.
- El backend procesa el `DELETE` en PostgreSQL.
- El frontend actualiza el estado local eliminando el elemento de la lista sin necesidad de recarga total.

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `AsignaturaDeleteView` | `AsignaturasListView (React)` | Componente de origen del borrado. |
| `AsignaturasController` | `AsignaturasController (NestJS)` | Endpoint para verificación y borrado. |
| `AsignaturaService` | `AsignaturasService (NestJS)` | Lógica técnica de conteo y eliminación. |

## referencias

- [Análisis: eliminarAsignatura()](/RUP/01-analisis/casos-uso/0-Administrador/eliminarAsignatura/README.md)
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Diagramas de Clases](/images/02-diseño/clases-diseño.svg) - Diseño Global
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
