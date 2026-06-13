<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/abrirProfesores/README.md)|**Diseño**|[Implementación](/RUP/03-desarrollo/casos-uso/0-Administrador/abrirProfesores/README.md)|Pruebas|
|---|---|---|---|---|---|

</div>

# Davidario > abrirProfesores > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-07
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `abrirProfesores()`. Define la interfaz del listado de profesores registrados (`ProfesoresListView`), la lógica de paginación y filtrado con React Hooks, y la integración con las operaciones CRUD a través de la API REST en NestJS.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: abrirProfesores()](/images/02-diseño/casos-uso/0-Administrador/abrirProfesores/secuencia-diseño.svg)|
|---|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/abrirProfesores/secuencia-diseño.puml)|

</div>

## especificación de componentes

### frontend (react)

#### ProfesoresListView (Component)
- **Tecnología**: Functional Component (TSX).
- **Responsabilidad**: Renderizar la tabla retro en estilo Courier New con las columnas: Checkbox, Código, Nombre, Email, Departamento y Acciones. Capturar criterios de filtrado y búsqueda.

#### useProfesores (Hook)
- **Responsabilidad**: Manejar el estado local de paginación, búsqueda, y carga de la lista de profesores (`fetchProfesores`).
- **Métodos**: `fetchProfesores(query)`.

#### profesoresService (Service)
- **Responsabilidad**: Consumir el endpoint `GET /profesores?search=...&page=...` a través de Axios (`getProfesores`).

### backend (nestjs)

#### ProfesoresController
- **Tecnología**: NestJS Controller.
- **Endpoint**: `GET /profesores?search=...&page=...`.
- **Responsabilidad**: Exponer la petición HTTP de consulta y devolver la lista serializada de profesores con soporte para paginación y búsqueda.

#### ProfesoresService
- **Responsabilidad**:
  - `findAll(query)`: Consultar profesores que coincidan con la búsqueda (nombre, email o código) con paginación, incluyendo datos de `Usuario`.

### base de datos (postgresql)

#### Profesor & Usuario (Entities)
- **Operación**: Lectura indexada con join relacional (`SELECT * FROM "Profesor" INNER JOIN "Usuario" ON "usuarioId" = "Usuario".id`).

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `AbrirProfesoresView` | `ProfesoresListView (React)` | Componente de listado en UI. |
| `AbrirProfesoresView` | `useProfesores (React Hook)` | Hook para manejo de estado, paginación y filtros. |
| `ProfesoresController` | `ProfesoresController (NestJS)` | Controlador REST del backend. |
| `ProfesorRepository` | `ProfesoresService (NestJS)` | Lógica de negocio y acceso a base de datos con Prisma. |
| `Profesor` | `Profesor (Entity)` | Modelo físico persistido en PostgreSQL. |

## referencias

- [Análisis: abrirProfesores()](/RUP/01-analisis/casos-uso/0-Administrador/abrirProfesores/README.md)
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Diagramas de Clases](/images/02-diseño/clases-diseño.svg) - Diseño Global
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
