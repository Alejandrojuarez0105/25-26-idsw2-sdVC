<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/abrirAlumnos/README.md)|**Diseño**|[Implementación](/RUP/03-desarrollo/casos-uso/0-Administrador/abrirAlumnos/README.md)|Pruebas|
|-|-|-|-|-|-|

</div>

# Davidario > abrirAlumnos > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-06
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `abrirAlumnos()`. Define la estructura para el listado de alumnos, permitiendo la visualización de los datos académicos y personales de los estudiantes, incluyendo la integración entre el frontend React y el backend NestJS con persistencia en PostgreSQL a través de Prisma.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: abrirAlumnos()](/images/02-diseño/casos-uso/0-Administrador/abrirAlumnos/secuencia-diseño.svg)|
|-|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/abrirAlumnos/secuencia-diseño.puml)|

</div>

## especificación de componentes

### frontend (react)

#### AlumnosListView (Component)
- **Tecnología**: Functional Component (TSX).
- **Responsabilidad**: Renderizar la tabla de alumnos, los filtros de búsqueda y los accesos rápidos a las operaciones de gestión.
- **Hook**: Utiliza `useAlumnos()` para obtener los datos y gestionar el estado de la lista.

#### useAlumnos (Hook)
- **Responsabilidad**: Gestionar el estado local de la lista de alumnos y la lógica de filtrado reactivo.
- **Servicio**: Invoca a `AlumnosService` para realizar las peticiones HTTP.

#### AlumnosService (Service)
- **Responsabilidad**: Encapsular las llamadas a la API REST (`GET /alumnos`).

### backend (nestjs)

#### AlumnosController
- **Tecnología**: NestJS Controller.
- **Endpoint**: `GET /alumnos`.

#### AlumnosService
- **Responsabilidad**: 
  - Consultar la base de datos vía Prisma para recuperar todos los alumnos.
  - Retornar la colección de entidades mapeadas.

### base de datos (postgresql)

#### Alumno (Entity)
- **Atributos**: `id` (UUID), `codigo`, `nombre`, `apellidos`, `email`, `gradoId`.

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `AbrirAlumnosView` | `AlumnosListView (React)` | Implementación de la interfaz de usuario para el listado. |
| `AlumnosController` | `AlumnosController (NestJS)` | Controlador para exponer el endpoint de consulta. |
| `AlumnoRepository` | `AlumnosService (NestJS)` | Abstracción de acceso a datos mediante Prisma. |
| `Alumno` | `Alumno (Entity)` | Mapeo directo a la entidad de persistencia. |

## referencias

- [Análisis: abrirAlumnos()](/RUP/01-analisis/casos-uso/0-Administrador/abrirAlumnos/README.md)
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Diagramas de Clases](/images/02-diseño/clases-diseño.svg) - Diseño Global
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
