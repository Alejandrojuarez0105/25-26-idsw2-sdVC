<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/crearAula/README.md)|**Diseño**|[Implementación](/RUP/03-desarrollo/casos-uso/0-Administrador/crearAula/README.md)|Pruebas|
|-|-|-|-|-|-|

</div>

# Davidario > crearAula > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-06
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `crearAula()`. Define la estructura para el registro de nuevos espacios físicos, incluyendo validaciones de formato de código, capacidad mínima y persistencia en PostgreSQL.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: crearAula()](/images/02-diseño/casos-uso/0-Administrador/crearAula/secuencia-diseño.svg)|
|-|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/crearAula/secuencia-diseño.puml)|

</div>

## especificación de componentes

### frontend (react)

#### AulaCreateView (Component)
- **Tecnología**: Functional Component (TSX).
- **Responsabilidad**: Presentar el formulario de captura de datos y gestionar la interacción del usuario.
- **Hook**: Utiliza `useAulaForm()`.

#### useAulaForm (Hook)
- **Responsabilidad**: Validar los campos obligatorios en el cliente antes de invocar al servicio.

#### AulasService (Service)
- **Responsabilidad**: Petición `POST /aulas`.

### backend (nestjs)

#### AulasController
- **Tecnología**: NestJS Controller.
- **Endpoint**: `POST /aulas`.
- **DTO**: Utiliza `CreateAulaDTO` para la validación automática de datos.

#### AulasService
- **Responsabilidad**: 
  - Validar la unicidad del código del aula.
  - Persistir la nueva entidad mediante Prisma.

### base de datos (postgresql)

#### Aula (Entity)
- **Operación**: `INSERT INTO "Aula" (...)`.

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `CrearAulaView` | `AulaCreateView (React)` | Componente para el registro de datos. |
| `AulasController` | `AulasController (NestJS)` | Endpoint de creación. |
| `AulaRepository` | `AulasService (NestJS)` | Lógica de negocio y persistencia. |

## referencias

- [Análisis: crearAula()](/RUP/01-analisis/casos-uso/0-Administrador/crearAula/README.md)
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Diagramas de Clases](/images/02-diseño/clases-diseño.svg) - Diseño Global
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
