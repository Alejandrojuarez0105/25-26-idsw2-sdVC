<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/crearAsignatura/README.md)|**Diseño**|Implementación|Pruebas|
|-|-|-|-|-|-|

</div>

# Davidario > crearAsignatura > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.1
- **Fecha**: 04/06/2026
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `crearAsignatura()`. Define la estructura para el alta de nuevas asignaturas, garantizando la integridad de los datos, la validación de códigos únicos en el backend y la correcta vinculación con un Grado académico mediante una arquitectura NestJS + React.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: crearAsignatura()](/images/02-diseño/casos-uso/0-Administrador/crearAsignatura/secuencia-diseño.svg)|
|-|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/crearAsignatura/secuencia-diseño.puml)|

</div>

## especificación de componentes

### frontend (react)

#### AsignaturaCreateForm (Component)
- **Tecnología**: Functional Component (TSX).
- **Responsabilidad**: Gestionar la entrada de datos del Administrador (código, nombre, créditos, grado) y disparar el envío del formulario.

#### useAsignaturas (Hook)
- **Responsabilidad**: Proporcionar la función `submit(data)` para coordinar el proceso de creación con el servicio de API.

#### AsignaturasService (Service - Frontend)
- **Responsabilidad**: Invocar el método `createAsignatura(data)` enviando un `POST` al backend.

### backend (nestjs)

#### AsignaturasController
- **Tecnología**: NestJS Controller.
- **Endpoint**: `POST /asignaturas`.
- **DTO**: Utiliza `CreateAsignaturaDTO`.

#### AsignaturasService (Service - Backend)
- **Responsabilidad**: 
  - Ejecutar la **validación de código único** antes de la inserción.
  - Orquestar la creación física del registro en PostgreSQL a través de Prisma.

### base de datos (postgresql)

#### Asignatura (Entity)
- **Atributos técnicos**: `id` (autogenerado UUID), `codigo` (Unique), `nombre`, `creditos`, `gradoId` (Foreign Key).

## flujo de diseño detallado

1. **Entrada**: El Administrador rellena el formulario en `AsignaturaCreateForm`.
2. **Delegación**: El hook `useAsignaturas` recibe los datos y los envía al servicio Axios.
3. **Validación de Negocio**: El servicio NestJS verifica que el código de la asignatura no esté duplicado en la base de datos.
4. **Inserción**: Si es válido, se ejecuta el `INSERT` en PostgreSQL.
5. **Respuesta**: Se retorna el objeto `Asignatura` creado (201 Created).
6. **Navegación**: El frontend muestra confirmación y redirige automáticamente al listado.

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `AsignaturaFormView` | `AsignaturaCreateForm (React)` | Interfaz técnica para creación. |
| `AsignaturasController` | `AsignaturasController (NestJS)` | Controlador de API para creación. |
| `AsignaturaService` | `AsignaturasService (NestJS)` | Lógica de validación y persistencia. |

## referencias

- [Análisis: crearAsignatura()](/RUP/01-analisis/casos-uso/0-Administrador/crearAsignatura/README.md)
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Diagramas de Clases](/images/02-diseño/clases-diseño.svg) - Diseño Global
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
