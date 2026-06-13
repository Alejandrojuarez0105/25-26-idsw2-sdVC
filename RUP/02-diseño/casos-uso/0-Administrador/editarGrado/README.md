<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/editarGrado/README.md)|**Diseño**|[Implementación](/RUP/03-desarrollo/casos-uso/0-Administrador/editarGrado/README.md)|Pruebas|
|-|-|-|-|-|-|

</div>

# Davidario > editarGrado > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 02/06/2026
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `editarGrado()`. Define el flujo para la modificación de datos de un grado existente, incluyendo la recuperación previa de datos, la gestión de cambios parciales (PATCH) y la persistencia en base de datos.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: editarGrado()](/images/02-diseño/casos-uso/0-Administrador/editarGrado/secuencia-diseño.svg)|
|-|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/editarGrado/secuencia-diseño.puml)|

</div>

## especificación de componentes

### frontend (react)

#### GradoEditView (Component)
- **Tecnología**: Functional Component (TSX).
- **Responsabilidad**: Cargar los datos actuales del grado en el formulario y gestionar la solicitud de actualización.
- **Hook**: Utiliza `useGradoForm()` para la carga inicial y el envío de cambios.

#### useGradoForm (Hook)
- **Responsabilidad**: Gestionar el estado de los campos, la recuperación de datos por ID y la llamada al servicio de actualización.
- **Servicio**: Invoca a `GradosService`.

#### GradosService (Service)
- **Responsabilidad**: 
  - `GET /grados/:id` para obtener el detalle.
  - `PATCH /grados/:id` para enviar las modificaciones.

### backend (nestjs)

#### GradosController
- **Tecnología**: NestJS Controller.
- **Endpoints**: 
  - `GET /grados/:id`
  - `PATCH /grados/:id`
- **DTO**: Utiliza `UpdateGradoDTO` para validar las actualizaciones parciales.

#### GradosService
- **Responsabilidad**: 
  - Localizar el registro por ID.
  - Aplicar las actualizaciones validadas.
  - Actualizar el timestamp de modificación.

### base de datos (postgresql)

#### Grado (Entity)
- **Operación**: `UPDATE "Grado" SET ... WHERE id = :id`.

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `EditarGradoView` | `GradoEditView (React)` | Interfaz para la edición de datos existentes. |
| `GradosController` | `GradosController (NestJS)` | Endpoints para lectura y escritura de un grado específico. |
| `GradoService` | `GradosService (NestJS)` | Lógica para la actualización y validación de cambios. |
| `ModificarGradoDTO` | `UpdateGradoDTO` | DTO para transferencia de datos parciales. |

## referencias

- [Análisis: editarGrado()](/RUP/01-analisis/casos-uso/0-Administrador/editarGrado/README.md)
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Diagramas de Clases](/images/02-diseño/clases-diseño.svg) - Diseño Global
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño