<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/abrirExamenes/README.md)|**Diseño**|[Implementación](/RUP/03-desarrollo/casos-uso/0-Administrador/abrirExamenes/README.md)|Pruebas|
|-|-|-|-|-|-|

</div>

# Davidario > abrirExamenes > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 05/06/2026
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `abrirExamenes()`. Define la arquitectura para la visualización y acceso a la lista de exámenes programados, permitiendo al administrador ver el estado actual del calendario de exámenes.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: abrirExamenes()](/images/02-diseño/casos-uso/0-Administrador/abrirExamenes/secuencia-diseño.svg)|
|-|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/abrirExamenes/secuencia-diseño.puml)|

</div>

## especificación de componentes

### frontend (react)

#### ExamenListView (Component)
- **Tecnología**: Functional Component (TSX).
- **Responsabilidad**: Renderizar la tabla o lista de exámenes disponibles.
- **Hook**: Utiliza `useExamenes()` para obtener los datos y gestionar el estado de la lista.

#### useExamenes (Hook)
- **Responsabilidad**: Gestionar el estado de los exámenes, manejo de carga y errores.
- **Servicio**: Invoca a `ExamenesService` para realizar las peticiones HTTP.

#### ExamenesService (Service)
- **Responsabilidad**: Realizar la petición `GET /examenes` para obtener todos los exámenes registrados.

### backend (nestjs)

#### ExamenesController
- **Tecnología**: NestJS Controller.
- **Endpoint**: `GET /examenes`.

#### ExamenesService
- **Responsabilidad**: 
  - Obtener la lista de entidades `Examen` desde PostgreSQL.
  - Retornar los datos mapeados para el frontend.

### base de datos (postgresql)

#### Examen (Entity)
- **Operación**: `SELECT * FROM "Examen"`.

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `AbrirExamenesView` | `ExamenListView (React)` | Interfaz de usuario para listar exámenes. |
| `ExamenesController` | `ExamenesController (NestJS)` | Endpoint para obtener los exámenes. |
| `ExamenService` | `ExamenesService (NestJS)` | Lógica de negocio para el acceso a datos. |

## referencias

- [Análisis: abrirExamenes()](/RUP/01-analisis/casos-uso/0-Administrador/abrirExamenes/README.md)
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Diagramas de Clases](/images/02-diseño/clases-diseño.svg) - Diseño Global
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
