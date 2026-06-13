<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/abrirAulas/README.md)|**Diseño**|[Implementación](/RUP/03-desarrollo/casos-uso/0-Administrador/abrirAulas/README.md)|Pruebas|
|-|-|-|-|-|-|

</div>

# Davidario > abrirAulas > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-06
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `abrirAulas()`. Define la estructura para el listado de aulas, permitiendo la visualización de la ubicación y capacidad de cada espacio físico, incluyendo la integración entre el frontend React y el backend NestJS con persistencia en PostgreSQL a través de Prisma.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: abrirAulas()](/images/02-diseño/casos-uso/0-Administrador/abrirAulas/secuencia-diseño.svg)|
|-|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/abrirAulas/secuencia-diseño.puml)|

</div>

## especificación de componentes

### frontend (react)

#### AulasListView (Component)
- **Tecnología**: Functional Component (TSX).
- **Responsabilidad**: Renderizar la tabla de aulas, los filtros de búsqueda y los accesos rápidos a las operaciones de gestión.
- **Hook**: Utiliza `useAulas()` para obtener los datos y gestionar el estado de la lista.

#### useAulas (Hook)
- **Responsabilidad**: Gestionar el estado local de la lista de aulas y la lógica de filtrado reactivo.
- **Servicio**: Invoca a `AulasService` para realizar las peticiones HTTP.

#### AulasService (Service)
- **Responsabilidad**: Encapsular las llamadas a la API REST (`GET /aulas`).

### backend (nestjs)

#### AulasController
- **Tecnología**: NestJS Controller.
- **Endpoint**: `GET /aulas`.

#### AulasService
- **Responsabilidad**: 
  - Consultar la base de datos vía Prisma para recuperar todas las aulas.
  - Retornar la colección de entidades mapeadas.

### base de datos (postgresql)

#### Aula (Entity)
- **Atributos**: `id` (UUID), `codigo`, `nombre`, `capacidad`, `ubicacion`.

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `AbrirAulasView` | `AulasListView (React)` | Implementación de la interfaz de usuario para el listado. |
| `AulasController` | `AulasController (NestJS)` | Controlador para exponer el endpoint de consulta. |
| `AulaRepository` | `AulasService (NestJS)` | Abstracción de acceso a datos mediante Prisma. |
| `Aula` | `Aula (Entity)` | Mapeo directo a la entidad de persistencia. |

## referencias

- [Análisis: abrirAulas()](/RUP/01-analisis/casos-uso/0-Administrador/abrirAulas/README.md)
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Diagramas de Clases](/images/02-diseño/clases-diseño.svg) - Diseño Global
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
