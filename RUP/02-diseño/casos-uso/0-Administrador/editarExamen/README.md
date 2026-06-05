<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/editarExamen/README.md)|**Diseño**|Implementación|Pruebas|
|-|-|-|-|-|-|

</div>

# Davidario > editarExamen > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 05/06/2026
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `editarExamen()`. Define la arquitectura para la modificación de los datos de un examen ya existente, incluyendo la carga de datos previos, validación de cambios y actualización en la base de datos.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: editarExamen()](/images/02-diseño/casos-uso/0-Administrador/editarExamen/secuencia-diseño.svg)|
|-|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/editarExamen/secuencia-diseño.puml)|

</div>

## especificación de componentes

### frontend (react)

#### ExamenEditView (Component)
- **Tecnología**: Functional Component (TSX).
- **Responsabilidad**: Cargar los datos actuales del grado en el formulario y gestionar la solicitud de actualización.
- **Hook**: Utiliza `useExamenEditForm()` para la carga inicial y el envío de cambios.

#### useExamenEditForm (Hook)
- **Responsabilidad**: Gestionar el estado de los campos, la recuperación de datos por ID y la llamada al servicio de actualización.
- **Servicio**: Invoca a `ExamenesService`.

#### ExamenesService (Service)
- **Responsabilidad**: Realizar la petición `PUT /examenes/:id` para actualizar los datos.

### backend (nestjs)

#### ExamenesController
- **Tecnología**: NestJS Controller.
- **Endpoint**: `PUT /examenes/:id`.
- **DTO**: Recibe `UpdateExamenDTO`.

#### ExamenesService
- **Responsabilidad**: 
  - Buscar examen existente.
  - Actualizar campos y persistir en PostgreSQL.

### base de datos (postgresql)

#### Examen (Entity)
- **Operación**: `UPDATE "Examen" SET ... WHERE id = ...`.

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `EditarExamenView` | `ExamenEditView (React)` | Interfaz de edición. |
| `ExamenesController` | `ExamenesController (NestJS)` | Endpoint para actualizar. |
| `ExamenService` | `ExamenesService (NestJS)` | Lógica de actualización. |
| `UpdateExamenDTO` | `UpdateExamenDTO` | DTO de transferencia. |

## referencias

- [Análisis: editarExamen()](/RUP/01-analisis/casos-uso/0-Administrador/editarExamen/README.md)
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Diagramas de Clases](/images/02-diseño/clases-diseño.svg) - Diseño Global
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
