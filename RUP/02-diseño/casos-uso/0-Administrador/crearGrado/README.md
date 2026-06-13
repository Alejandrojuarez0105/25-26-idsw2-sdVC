<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/crearGrado/README.md)|**Diseño**|[Implementación](/RUP/03-desarrollo/casos-uso/0-Administrador/crearGrado/README.md)|Pruebas|
|-|-|-|-|-|-|

</div>

# Davidario > crearGrado > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 02/06/2026
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `crearGrado()`. Define la arquitectura para el registro de nuevos grados académicos, incluyendo el formulario de entrada, validaciones de esquema y persistencia en la base de datos relacional.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: crearGrado()](/images/02-diseño/casos-uso/0-Administrador/crearGrado/secuencia-diseño.svg)|
|-|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/crearGrado/secuencia-diseño.puml)|

</div>

## especificación de componentes

### frontend (react)

#### GradoCreateView (Component)
- **Tecnología**: Functional Component (TSX).
- **Responsabilidad**: Renderizar el formulario de creación y gestionar los mensajes de validación visual.
- **Hook**: Utiliza `useGradoForm()` para la lógica de envío y validación.

#### useGradoForm (Hook)
- **Responsabilidad**: Gestionar el estado del formulario, validaciones de cliente y la llamada al servicio de creación.
- **Servicio**: Invoca a `GradosService`.

#### GradosService (Service)
- **Responsabilidad**: Realizar la petición `POST /grados` con los datos del nuevo grado.

### backend (nestjs)

#### GradosController
- **Tecnología**: NestJS Controller.
- **Endpoint**: `POST /grados`.
- **DTO**: Recibe `CreateGradoDTO` para validación de tipos y reglas de negocio (ej. código único).

#### GradosService
- **Responsabilidad**: 
  - Validar que el código del grado no exista.
  - Crear la instancia de la entidad `Grado`.
  - Persistir el nuevo grado en PostgreSQL.

### base de datos (postgresql)

#### Grado (Entity)
- **Operación**: `INSERT INTO "Grado" (...) VALUES (...)`.

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `CrearGradoView` | `GradoCreateView (React)` | Interfaz de usuario para la captura de datos. |
| `GradosController` | `GradosController (NestJS)` | Endpoint para procesar la creación. |
| `GradoService` | `GradosService (NestJS)` | Lógica de negocio para la creación. |
| `NuevoGradoDTO` | `CreateGradoDTO` | Estructura de datos para la transferencia de información. |

## referencias

- [Análisis: crearGrado()](/RUP/01-analisis/casos-uso/0-Administrador/crearGrado/README.md)
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Diagramas de Clases](/images/02-diseño/clases-diseño.svg) - Diseño Global
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño