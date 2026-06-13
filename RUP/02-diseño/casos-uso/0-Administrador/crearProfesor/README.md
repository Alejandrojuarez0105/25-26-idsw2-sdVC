<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/crearProfesor/README.md)|**Diseño**|[Implementación](/RUP/03-desarrollo/casos-uso/0-Administrador/crearProfesor/README.md)|Pruebas|
|---|---|---|---|---|---|

</div>

# Davidario > crearProfesor > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-07
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `crearProfesor()`. Especifica el formulario reactivo para dar de alta individualmente a profesores en el sistema, validaciones locales de email y campos requeridos, hasheo de claves y persistencia transaccional de las entidades relacionales.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: crearProfesor()](/images/02-diseño/casos-uso/0-Administrador/crearProfesor/secuencia-diseño.svg)|
|---|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/crearProfesor/secuencia-diseño.puml)|

</div>

## especificación de componentes

### frontend (react)

#### CrearProfesorView (Component)
- **Tecnología**: Functional Component (TSX).
- **Responsabilidad**: Presentar un formulario reactivo con inputs para el nombre completo, el correo electrónico y el departamento.

#### useProfesorForm (Hook)
- **Responsabilidad**: Gestionar el estado de los inputs, realizar validaciones locales en tiempo real y enviar los datos al servidor (`submit`).
- **Métodos**: `submit(data)`.

#### profesoresService (Service)
- **Responsabilidad**: Realizar la llamada `POST /profesores` a través de Axios (`createProfesor`).

### backend (nestjs)

#### ProfesoresController
- **Tecnología**: NestJS Controller.
- **Endpoint**: `POST /profesores`.
- **Responsabilidad**: Recibir el DTO en el cuerpo JSON del request y delegar la inserción.

#### ProfesoresService
- **Responsabilidad**:
  - `create(dto)`: Validar que el email no esté ya registrado en la tabla `Usuario`. Si existe, lanzar `ConflictException` (409).
  - Encriptar la contraseña por defecto con `bcrypt`.
  - Crear atómicamente el registro del `Usuario` (con rol `Profesor`) y su respectivo perfil `Profesor` mediante `Prisma.$transaction`.

### base de datos (postgresql)

#### Profesor & Usuario (Entities)
- **Operación**: Inserción transaccional atómica (`INSERT INTO`).

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `CrearProfesorView` | `CrearProfesorView (React)` | Componente de formulario de alta en cliente. |
| `CrearProfesorView` | `useProfesorForm (React Hook)` | Hook para validaciones locales y envío de formulario. |
| `ProfesorController` | `ProfesoresController (NestJS)` | Controlador REST del backend. |
| `ProfesorRepository` | `ProfesoresService (NestJS)` | Lógica de negocio y persistencia relacional con Prisma. |
| `Profesor` | `Profesor (Entity)` | Registros de base de datos creados. |

## referencias

- [Análisis: crearProfesor()](/RUP/01-analisis/casos-uso/0-Administrador/crearProfesor/README.md)
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Diagramas de Clases](/images/02-diseño/clases-diseño.svg) - Diseño Global
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
