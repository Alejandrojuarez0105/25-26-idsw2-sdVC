<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/abrirGrados/README.md)|**Diseño**|Implementación|Pruebas|
|-|-|-|-|-|-|

</div>

# Davidario > abrirGrados > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 02/06/2026
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `abrirGrados()`. Define la estructura para el listado de grados académicos, incluyendo filtrado, paginación y la integración entre el frontend React y el backend NestJS con persistencia en PostgreSQL.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: abrirGrados()](/images/02-diseño/casos-uso/0-Administrador/abrirGrados/secuencia-diseño.svg)|
|-|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/abrirGrados/secuencia-diseño.puml)|

</div>

## especificación de componentes

### frontend (react)

#### GradosListView (Component)
- **Tecnología**: Functional Component (TSX).
- **Responsabilidad**: Renderizar la tabla de grados, los controles de paginación y los filtros de búsqueda.
- **Hook**: Utiliza `useGrados()` para obtener los datos y gestionar el estado de la lista.

#### useGrados (Hook)
- **Responsabilidad**: Gestionar el estado local de la lista de grados, filtros y paginación.
- **Servicio**: Invoca a `GradosService` para realizar las peticiones HTTP.

#### GradosService (Service)
- **Responsabilidad**: Encapsular las llamadas a la API REST (`GET /grados`).

### backend (nestjs)

#### GradosController
- **Tecnología**: NestJS Controller.
- **Endpoint**: `GET /grados`.
- **DTO**: Utiliza `GradoQueryDTO` para validar los parámetros de consulta (filtros, paginación).

#### GradosService
- **Responsabilidad**: 
  - Aplicar la lógica de negocio para el filtrado.
  - Interactuar con la base de datos para recuperar los grados.

### base de datos (postgresql)

#### Grado (Entity)
- **Atributos**: `id` (UUID), `codigo`, `nombre`, `descripcion`.

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `GradosView` | `GradosListView (React)` | Implementación de la interfaz de usuario para el listado. |
| `GradosController` | `GradosController (NestJS)` | Controlador para exponer el endpoint de consulta. |
| `GradoService` | `GradosService (NestJS)` | Lógica de negocio y consulta de datos. |
| `Grado` | `Grado (Entity)` | Mapeo directo a la entidad de persistencia. |

## referencias

- [Análisis: abrirGrados()](/RUP/01-analisis/casos-uso/0-Administrador/abrirGrados/README.md)
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Diagramas de Clases](/images/02-diseño/clases-diseño.svg) - Diseño Global
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño