<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/eliminarExamen/README.md)|**Diseño**|Implementación|Pruebas|
|-|-|-|-|-|-|

</div>

# Davidario > eliminarExamen > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 05/06/2026
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `eliminarExamen()`. Define la arquitectura para la eliminación de un examen del sistema, incluyendo la confirmación del usuario y la eliminación definitiva en la base de datos.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: eliminarExamen()](/images/02-diseño/casos-uso/0-Administrador/eliminarExamen/secuencia-diseño.svg)|
|-|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/eliminarExamen/secuencia-diseño.puml)|

</div>

## especificación de componentes

### frontend (react)

#### ExamenDeleteView (Component)
- **Tecnología**: Functional Component (TSX).
- **Responsabilidad**: Mostrar confirmación de eliminación.
- **Hook**: Utiliza `useExamenDelete()` para ejecutar la acción.

#### useExamenDelete (Hook)
- **Responsabilidad**: Llamar al servicio de eliminación.
- **Servicio**: Invoca a `ExamenesService`.

#### ExamenesService (Service)
- **Responsabilidad**: Realizar la petición `DELETE /examenes/:id`.

### backend (nestjs)

#### ExamenesController
- **Tecnología**: NestJS Controller.
- **Endpoint**: `DELETE /examenes/:id`.

#### ExamenesService
- **Responsabilidad**: 
  - Validar si el examen puede ser eliminado (ej. si no tiene calificaciones asociadas).
  - Ejecutar eliminación en PostgreSQL.

### base de datos (postgresql)

#### Examen (Entity)
- **Operación**: `DELETE FROM "Examen" WHERE id = ...`.

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `EliminarExamenView` | `ExamenDeleteView (React)` | Interfaz de confirmación. |
| `ExamenesController` | `ExamenesController (NestJS)` | Endpoint para eliminar. |
| `ExamenService` | `ExamenesService (NestJS)` | Lógica de eliminación. |

## referencias

- [Análisis: eliminarExamen()](/RUP/01-analisis/casos-uso/0-Administrador/eliminarExamen/README.md)
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Diagramas de Clases](/images/02-diseño/clases-diseño.svg) - Diseño Global
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
