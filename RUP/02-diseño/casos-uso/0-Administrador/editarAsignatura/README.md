<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/editarAsignatura/README.md)|**Diseño**|Implementación|Pruebas|
|-|-|-|-|-|-|

</div>

# Davidario > editarAsignatura > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.1
- **Fecha**: 04/06/2026
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `editarAsignatura()`. Define la estructura para la modificación de asignaturas existentes, incluyendo la carga previa de datos para el formulario, la validación de actualizaciones técnicas y la sincronización entre el estado del frontend y la persistencia en PostgreSQL.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: editarAsignatura()](/images/02-diseño/casos-uso/0-Administrador/editarAsignatura/secuencia-diseño.svg)|
|-|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/editarAsignatura/secuencia-diseño.puml)|

</div>

## especificación de componentes

### frontend (react)

#### AsignaturaEditForm (Component)
- **Tecnología**: Functional Component (TSX).
- **Responsabilidad**: Presentar el formulario al Administrador, precargar los datos de la asignatura y gestionar el envío de la edición (Submit).

#### useAsignaturas (Hook)
- **Responsabilidad**: Proporcionar las funciones `getAsignatura(id)` para la carga inicial y `update(id, data)` para procesar los cambios.

#### AsignaturasService (Service - Frontend)
- **Responsabilidad**: Encapsular las peticiones HTTP mediante Axios (`GET /asignaturas/:id` y `PUT /asignaturas/:id`).

### backend (nestjs)

#### AsignaturasController
- **Tecnología**: NestJS Controller.
- **Endpoints**: 
  - `GET /asignaturas/:id`: Recuperar la entidad completa para edición.
  - `PUT /asignaturas/:id`: Procesar la actualización técnica.
- **DTO**: Utiliza `UpdateAsignaturaDTO`.

#### AsignaturasService (Service - Backend)
- **Responsabilidad**: Coordinar la recuperación y actualización de datos interactuando con el motor de base de datos.

### base de datos (postgresql)

#### Asignatura (Entity)
- **Operaciones**: Consultas de selección por ID y actualizaciones de campos específicos.

## flujo de diseño detallado

### 1. carga de datos
- El componente `AsignaturaEditForm` solicita los datos al hook `useAsignaturas`.
- Se realiza una petición `GET` al backend.
- El servicio recupera los datos de PostgreSQL y rellena el formulario reactivo.

### 2. edición y persistencia
- El Administrador modifica los campos y pulsa **Guardar**.
- El hook invoca `updateAsignatura` enviando el JSON del formulario.
- El backend ejecuta la sentencia `UPDATE` y retorna la entidad actualizada (200 OK).
- El frontend muestra confirmación de éxito y realiza la redirección.

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `AsignaturaFormView` | `AsignaturaEditForm (React)` | Componente de formulario para edición. |
| `AsignaturasController` | `AsignaturasController (NestJS)` | Endpoints de consulta y actualización. |
| `AsignaturaService` | `AsignaturasService (NestJS)` | Lógica técnica de recuperación y persistencia. |

## referencias

- [Análisis: editarAsignatura()](/RUP/01-analisis/casos-uso/0-Administrador/editarAsignatura/README.md)
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Diagramas de Clases](/images/02-diseño/clases-diseño.svg) - Diseño Global
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
