<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/abrirAsignaturas/README.md)|**Diseño**|[Implementación](/RUP/03-desarrollo/casos-uso/0-Administrador/abrirAsignaturas/README.md)|Pruebas|
|-|-|-|-|-|-|

</div>

# Davidario > abrirAsignaturas > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-04
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `abrirAsignaturas()`. Define la estructura para el listado de asignaturas, permitiendo el filtrado por nombre y grado académico, incluyendo la integración entre el frontend React y el backend NestJS con persistencia en PostgreSQL a través de Prisma.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: abrirAsignaturas()](/images/02-diseño/casos-uso/0-Administrador/abrirAsignaturas/secuencia-diseño.svg)|
|-|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/abrirAsignaturas/secuencia-diseño.puml)|

</div>

## especificación de componentes

### frontend (react)

#### AsignaturasListView (Component)
- **Tecnología**: Functional Component (TSX).
- **Responsabilidad**: Renderizar la tabla de asignaturas, los filtros de búsqueda y selección de grado, y la paginación.
- **Hook**: Utiliza `useAsignaturas()` para obtener los datos y gestionar el estado de la lista.

#### useAsignaturas (Hook)
- **Responsabilidad**: Gestionar el estado local de la lista de asignaturas, filtros y paginación.
- **Servicio**: Invoca a `AsignaturasService` para realizar las peticiones HTTP.

#### AsignaturasService (Service)
- **Responsabilidad**: Encapsular las llamadas a la API REST (`GET /asignaturas`).

### backend (nestjs)

#### AsignaturasController
- **Tecnología**: NestJS Controller.
- **Endpoint**: `GET /asignaturas`.
- **DTO**: Utiliza `AsignaturaQueryDTO` para validar los parámetros de consulta (search, gradoId, page, limit).

#### AsignaturasService
- **Responsabilidad**: 
  - Aplicar la lógica de negocio para el filtrado.
  - Interactuar con la base de datos vía Prisma para recuperar las asignaturas incluyendo la relación con `Grado`.

### base de datos (postgresql)

#### Asignatura (Entity)
- **Atributos**: `id` (UUID), `codigo`, `nombre`, `creditos`, `gradoId`.
- **Relación**: `belongsTo` Grado.

#### Grado (Entity)
- **Atributos**: `id` (UUID), `codigo`, `nombre`.

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `AsignaturasView` | `AsignaturasListView (React)` | Implementación de la interfaz de usuario para el listado. |
| `AsignaturasController` | `AsignaturasController (NestJS)` | Controlador para exponer el endpoint de consulta. |
| `AsignaturaService` | `AsignaturasService (NestJS)` | Lógica de negocio y consulta de datos. |
| `Asignatura` | `Asignatura (Entity)` | Mapeo directo a la entidad de persistencia. |

## referencias

- [Análisis: abrirAsignaturas()](/RUP/01-analisis/casos-uso/0-Administrador/abrirAsignaturas/README.md)
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Diagramas de Clases](/images/02-diseño/clases-diseño.svg) - Diseño Global
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño