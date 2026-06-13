<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/crearExamen/README.md)|**Diseño**|[Implementación](/RUP/03-desarrollo/casos-uso/0-Administrador/crearExamen/README.md)|Pruebas|
|-|-|-|-|-|-|

</div>

# Davidario > crearExamen > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 05/06/2026
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `crearExamen()`. Define la arquitectura para la creación de nuevos exámenes en el sistema, incluyendo el formulario de captura, validaciones de datos (fechas, asignaturas, aulas) y persistencia.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: crearExamen()](/images/02-diseño/casos-uso/0-Administrador/crearExamen/secuencia-diseño.svg)|
|-|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/crearExamen/secuencia-diseño.puml)|

</div>

## especificación de componentes

### frontend (react)

#### ExamenCreateView (Component)
- **Tecnología**: Functional Component (TSX).
- **Responsabilidad**: Renderizar el formulario de creación de exámenes y gestionar los mensajes de validación visual.
- **Hook**: Utiliza `useExamenForm()` para la lógica de envío y validación.

#### useExamenForm (Hook)
- **Responsabilidad**: Gestionar el estado del formulario, validaciones de cliente y la llamada al servicio de creación.
- **Servicio**: Invoca a `ExamenesService`.

#### ExamenesService (Service)
- **Responsabilidad**: Realizar la petición `POST /examenes` con los datos del nuevo examen.

### backend (nestjs)

#### ExamenesController
- **Tecnología**: NestJS Controller.
- **Endpoint**: `POST /examenes`.
- **DTO**: Recibe `CreateExamenDTO` para validación de tipos y reglas de negocio (ej. código único)..

#### ExamenesService
- **Responsabilidad**: 
  - Validar disponibilidad de aulas y asignaturas.
  - Validar que el código del examen no exista.
  - Crear la instancia de la entidad `Examen`.
  - Persistir el nuevo examen en PostgreSQL.

### base de datos (postgresql)

#### Examen (Entity)
- **Operación**: `INSERT INTO "Examen" (...) VALUES (...)`.

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `CrearExamenView` | `ExamenCreateView (React)` | Interfaz de captura de datos. |
| `ExamenesController` | `ExamenesController (NestJS)` | Endpoint para crear examen. |
| `ExamenService` | `ExamenesService (NestJS)` | Lógica de creación. |
| `NuevoExamenDTO` | `CreateExamenDTO` | DTO de transferencia. |

## referencias

- [Análisis: crearExamen()](/RUP/01-analisis/casos-uso/0-Administrador/crearExamen/README.md)
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Diagramas de Clases](/images/02-diseño/clases-diseño.svg) - Diseño Global
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
