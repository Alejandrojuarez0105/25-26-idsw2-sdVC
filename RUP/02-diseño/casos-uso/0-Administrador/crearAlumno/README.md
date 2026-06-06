<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/crearAlumno/README.md)|**Diseño**|Implementación|Pruebas|
|-|-|-|-|-|-|

</div>

# Davidario > crearAlumno > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-06
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `crearAlumno()`. Define la interfaz de formulario para registrar un nuevo alumno de forma individual, con validaciones en tiempo real (React) y la inserción segura en PostgreSQL utilizando NestJS, asegurando reglas de negocio como correos únicos o códigos institucionales no repetidos.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: crearAlumno()](/images/02-diseño/casos-uso/0-Administrador/crearAlumno/secuencia-diseño.svg)|
|-|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/crearAlumno/secuencia-diseño.puml)|

</div>

## especificación de componentes

### frontend (react)

#### CrearAlumnoView (Component)
- **Tecnología**: Functional Component (TSX).
- **Responsabilidad**: Renderizar el formulario de captura, manejar estados de los inputs y mostrar validaciones (e.g. `react-hook-form`).
- **Hook**: Utiliza la mutación de creación en `useAlumnos()`.

#### AlumnosService (Service)
- **Responsabilidad**: Consumir el endpoint `POST /alumnos`.

### backend (nestjs)

#### AlumnosController
- **Tecnología**: NestJS Controller.
- **Endpoint**: `POST /alumnos`.

#### AlumnosService
- **Responsabilidad**: 
  - Validar datos del DTO (CreateAlumnoDTO).
  - Comprobar que no exista otro alumno con el mismo código/email (`ConflictException`).
  - Crear el registro utilizando Prisma.

### base de datos (postgresql)

#### Alumno (Entity)
- **Operación**: `create` con datos validados.

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `CrearAlumnoView` | `CrearAlumnoView (React)` | Formulario de alta individual. |
| `AlumnosController` | `AlumnosController (NestJS)` | Controlador que recibe la petición de registro. |
| `AlumnoRepository` | `AlumnosService (NestJS)` | Acceso a datos e inserción vía Prisma. |
| `Alumno` | `Alumno (Entity)` | Nueva instancia a persistir. |

## referencias

- [Análisis: crearAlumno()](/RUP/01-analisis/casos-uso/0-Administrador/crearAlumno/README.md)
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Diagramas de Clases](/images/02-diseño/clases-diseño.svg) - Diseño Global
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
