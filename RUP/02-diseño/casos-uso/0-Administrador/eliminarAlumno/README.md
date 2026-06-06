<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/eliminarAlumno/README.md)|**Diseño**|Implementación|Pruebas|
|-|-|-|-|-|-|

</div>

# Davidario > eliminarAlumno > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-06
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `eliminarAlumno()`. Define el proceso para la baja de estudiantes del sistema, garantizando la integridad referencial (por ejemplo, validando que no existan dependencias con registros académicos o exámenes) antes de efectuar la eliminación física o lógica en PostgreSQL mediante Prisma, todo coordinado desde NestJS y accionado desde React.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: eliminarAlumno()](/images/02-diseño/casos-uso/0-Administrador/eliminarAlumno/secuencia-diseño.svg)|
|-|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/eliminarAlumno/secuencia-diseño.puml)|

</div>

## especificación de componentes

### frontend (react)

#### EliminarAlumnoView (Component)
- **Tecnología**: Functional Component (TSX).
- **Responsabilidad**: Mostrar la advertencia de eliminación y confirmar la intención del usuario.
- **Hook**: Utiliza la mutación de borrado en `useAlumnos()`.

#### AlumnosService (Service)
- **Responsabilidad**: Consumir el endpoint `DELETE /alumnos/:id`.

### backend (nestjs)

#### AlumnosController
- **Tecnología**: NestJS Controller.
- **Endpoint**: `DELETE /alumnos/:id`.

#### AlumnosService
- **Responsabilidad**: 
  - Validar si el alumno existe.
  - Verificar si el alumno tiene dependencias asociadas (exámenes, matrículas).
  - Ejecutar el borrado si se cumplen las reglas de negocio, o retornar un error de conflicto (`409 Conflict`).

### base de datos (postgresql)

#### Alumno (Entity)
- **Operación**: `delete` por UUID validando restricciones `ON DELETE RESTRICT` si aplican.

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `EliminarAlumnoView` | `EliminarAlumnoView (React)` | Componente de confirmación y advertencia. |
| `AlumnosController` | `AlumnosController (NestJS)` | Controlador para la eliminación. |
| `AlumnoRepository` | `AlumnosService (NestJS)` | Abstracción de validación de negocio y borrado con Prisma. |
| `Alumno` | `Alumno (Entity)` | Entidad destino del borrado. |

## referencias

- [Análisis: eliminarAlumno()](/RUP/01-analisis/casos-uso/0-Administrador/eliminarAlumno/README.md)
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Diagramas de Clases](/images/02-diseño/clases-diseño.svg) - Diseño Global
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
