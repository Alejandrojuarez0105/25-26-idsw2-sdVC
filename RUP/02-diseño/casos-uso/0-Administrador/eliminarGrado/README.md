<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/eliminarGrado/README.md)|**Diseño**|Implementación|Pruebas|
|-|-|-|-|-|-|

</div>

# Davidario > eliminarGrado > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 02/06/2026
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `eliminarGrado()`. Define el procedimiento para la eliminación de un grado académico del sistema, asegurando la integridad referencial y la correcta respuesta del backend.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: eliminarGrado()](/images/02-diseño/casos-uso/0-Administrador/eliminarGrado/secuencia-diseño.svg)|
|-|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/eliminarGrado/secuencia-diseño.puml)|

</div>

## especificación de componentes

### frontend (react)

#### GradosListView (Component)
- **Tecnología**: Functional Component (TSX).
- **Responsabilidad**: Gestionar la interacción del usuario para solicitar la eliminación (botón eliminar, diálogo de confirmación).
- **Hook**: Utiliza `useGrados()` para disparar la acción de borrado.

#### useGrados (Hook)
- **Responsabilidad**: Invocar al servicio de eliminación y actualizar el estado local (quitar el elemento de la lista).
- **Servicio**: Invoca a `GradosService` para realizar la petición DELETE.

#### GradosService (Service)
- **Responsabilidad**: Realizar la petición HTTP `DELETE /grados/:id`.

### backend (nestjs)

#### GradosController
- **Tecnología**: NestJS Controller.
- **Endpoint**: `DELETE /grados/:id`.
- **Parámetros**: Recibe el `id` (UUID) del grado a eliminar.

#### GradosService
- **Responsabilidad**: 
  - Validar la existencia del grado.
  - Verificar si existen dependencias (ej. asignaturas vinculadas) si aplica la política de restricción.
  - Ejecutar el borrado en la base de datos.

### base de datos (postgresql)

#### Grado (Entity)
- **Operación**: `DELETE FROM "Grado" WHERE id = :id`.

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `GradosView` | `GradosListView (React)` | El botón de eliminar se encuentra en la vista de lista. |
| `GradosController` | `GradosController (NestJS)` | Endpoint para procesar la solicitud de eliminación. |
| `GradoService` | `GradosService (NestJS)` | Lógica para ejecutar el borrado y validar restricciones. |

## referencias

- [Análisis: eliminarGrado()](/RUP/01-analisis/casos-uso/0-Administrador/eliminarGrado/README.md)
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Diagramas de Clases](/images/02-diseño/clases-diseño.svg) - Diseño Global
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
