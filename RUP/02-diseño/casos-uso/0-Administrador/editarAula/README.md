<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/editarAula/README.md)|**Diseño**|[Implementación](/RUP/03-desarrollo/casos-uso/0-Administrador/editarAula/README.md)|Pruebas|
|-|-|-|-|-|-|

</div>

# Davidario > editarAula > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-06
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `editarAula()`. Define la estructura para la modificación de datos de espacios físicos existentes, permitiendo actualizar la capacidad y ubicación, incluyendo la precarga de datos y el manejo de actualizaciones en PostgreSQL.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: editarAula()](/images/02-diseño/casos-uso/0-Administrador/editarAula/secuencia-diseño.svg)|
|-|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/editarAula/secuencia-diseño.puml)|

</div>

## especificación de componentes

### frontend (react)

#### AulaEditView (Component)
- **Tecnología**: Functional Component (TSX).
- **Responsabilidad**: Presentar el formulario de edición con los datos actuales precargados.
- **Hook**: Utiliza `useAulaEditForm()`.

#### useAulaEditForm (Hook)
- **Responsabilidad**: Gestionar el estado de los datos editados y controlar la carga inicial del registro.

#### AulasService (Service)
- **Responsabilidad**: 
  - Petición `GET /aulas/:id` para precarga.
  - Petición `PUT /aulas/:id` para actualización.

### backend (nestjs)

#### AulasController
- **Tecnología**: NestJS Controller.
- **Endpoints**: `GET /aulas/:id` y `PUT /aulas/:id`.
- **DTO**: Utiliza `UpdateAulaDTO` para la validación de cambios.

#### AulasService
- **Responsabilidad**: 
  - Recuperar el registro actual.
  - Aplicar las modificaciones y persistir en PostgreSQL mediante Prisma.

### base de datos (postgresql)

#### Aula (Entity)
- **Operación**: `UPDATE "Aula" SET ... WHERE id = ?`.

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `EditarAulaView` | `AulaEditView (React)` | Componente para la modificación de datos. |
| `AulasController` | `AulasController (NestJS)` | Endpoints de consulta y actualización. |
| `AulaRepository` | `AulasService (NestJS)` | Lógica de actualización y persistencia. |

## referencias

- [Análisis: editarAula()](/RUP/01-analisis/casos-uso/0-Administrador/editarAula/README.md)
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Diagramas de Clases](/images/02-diseño/clases-diseño.svg) - Diseño Global
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
