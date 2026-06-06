<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/eliminarAula/README.md)|**Diseño**|Implementación|Pruebas|
|-|-|-|-|-|-|

</div>

# Davidario > eliminarAula > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-06
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `eliminarAula()`. Define la lógica para la eliminación segura de espacios físicos, incorporando validaciones de integridad referencial para evitar el borrado de aulas con exámenes ya programados.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: eliminarAula()](/images/02-diseño/casos-uso/0-Administrador/eliminarAula/secuencia-diseño.svg)|
|-|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/eliminarAula/secuencia-diseño.puml)|

</div>

## especificación de componentes

### frontend (react)

#### AulasDeleteView (Component)
- **Tecnología**: Functional Component (TSX).
- **Responsabilidad**: Presentar la confirmación de eliminación y capturar la intención definitiva del administrador.
- **Hook**: Utiliza `useAulasDelete()`.

#### useAulasDelete (Hook)
- **Responsabilidad**: Orquestar la llamada al servicio de eliminación y gestionar la redirección al listado.

#### AulasService (Service)
- **Responsabilidad**: Petición `DELETE /aulas/:id`.

### backend (nestjs)

#### AulasController
- **Tecnología**: NestJS Controller.
- **Endpoint**: `DELETE /aulas/:id`.

#### AulasService
- **Responsabilidad**: 
  - Verificar si el aula tiene exámenes asociados (Integridad Referencial).
  - Lanzar excepciones controladas en caso de conflictos.
  - Proceder con la eliminación física en PostgreSQL.

### base de datos (postgresql)

#### Aula (Entity)
- **Operación**: `DELETE FROM "Aula" WHERE id = ?`.

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `EliminarAulaView` | `AulasDeleteView (React)` | Interfaz de confirmación de borrado. |
| `AulasController` | `AulasController (NestJS)` | Controlador para la operación de eliminación. |
| `AulaRepository` | `AulasService (NestJS)` | Lógica de borrado y validación de integridad. |

## referencias

- [Análisis: eliminarAula()](/RUP/01-analisis/casos-uso/0-Administrador/eliminarAula/README.md)
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Diagramas de Clases](/images/02-diseño/clases-diseño.svg) - Diseño Global
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
