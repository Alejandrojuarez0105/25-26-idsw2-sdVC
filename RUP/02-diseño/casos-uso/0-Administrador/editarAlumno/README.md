<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/editarAlumno/README.md)|**Diseño**|[Implementación](/RUP/03-desarrollo/casos-uso/0-Administrador/editarAlumno/README.md)|Pruebas|
|-|-|-|-|-|-|

</div>

# Davidario > editarAlumno > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-06
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `editarAlumno()`. Define la interfaz de modificación de los datos de un estudiante previamente registrado, implementando precarga de datos en React, envío de información actualizada hacia la API REST de NestJS, y actualización del registro en PostgreSQL manteniendo la integridad referencial y de unicidad.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: editarAlumno()](/images/02-diseño/casos-uso/0-Administrador/editarAlumno/secuencia-diseño.svg)|
|-|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/editarAlumno/secuencia-diseño.puml)|

</div>

## especificación de componentes

### frontend (react)

#### EditarAlumnoView (Component)
- **Tecnología**: Functional Component (TSX).
- **Responsabilidad**: Precargar los datos actuales del alumno y permitir su edición segura (sin alterar IDs o códigos inmutables si los hay).
- **Hook**: Utiliza la mutación de edición en `useAlumnos()`.

#### AlumnosService (Service)
- **Responsabilidad**: Consumir los endpoints `GET /alumnos/:id` (para precarga) y `PUT /alumnos/:id` (para actualización).

### backend (nestjs)

#### AlumnosController
- **Tecnología**: NestJS Controller.
- **Endpoint**: `PUT /alumnos/:id`.

#### AlumnosService
- **Responsabilidad**: 
  - Validar datos del DTO (UpdateAlumnoDTO).
  - Asegurar la existencia del registro.
  - Actualizar el registro usando Prisma.

### base de datos (postgresql)

#### Alumno (Entity)
- **Operación**: `update` con datos modificados por UUID.

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `EditarAlumnoView` | `EditarAlumnoView (React)` | Formulario de edición con precarga. |
| `AlumnosController` | `AlumnosController (NestJS)` | Controlador que maneja la actualización. |
| `AlumnoRepository` | `AlumnosService (NestJS)` | Acceso a datos y actualización vía Prisma. |
| `Alumno` | `Alumno (Entity)` | Entidad a modificar. |

## referencias

- [Análisis: editarAlumno()](/RUP/01-analisis/casos-uso/0-Administrador/editarAlumno/README.md)
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Diagramas de Clases](/images/02-diseño/clases-diseño.svg) - Diseño Global
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
