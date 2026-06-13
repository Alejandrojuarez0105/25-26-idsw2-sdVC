<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/importarAlumnos/README.md)|**Diseño**|[Implementación](/RUP/03-desarrollo/casos-uso/0-Administrador/importarAlumnos/README.md)|Pruebas|
|-|-|-|-|-|-|

</div>

# Davidario > importarAlumnos > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-06
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `importarAlumnos()`. Define el proceso para la carga masiva de alumnos desde un archivo CSV o Excel, incluyendo la validación de formato en frontend, el procesamiento asíncrono en backend (NestJS) y la inserción transaccional en PostgreSQL a través de Prisma.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: importarAlumnos()](/images/02-diseño/casos-uso/0-Administrador/importarAlumnos/secuencia-diseño.svg)|
|-|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/importarAlumnos/secuencia-diseño.puml)|

</div>

## especificación de componentes

### frontend (react)

#### ImportarAlumnosView (Component)
- **Tecnología**: Functional Component (TSX).
- **Responsabilidad**: Interfaz de carga de archivo, visualización de progreso y resumen de resultados.
- **Hook**: Utiliza `useImportacion()` para gestionar el estado del archivo y progreso.

#### AlumnosService (Service)
- **Responsabilidad**: Enviar el archivo mediante `POST /alumnos/importar` (multipart/form-data).

### backend (nestjs)

#### AlumnosController
- **Tecnología**: NestJS Controller.
- **Endpoint**: `POST /alumnos/importar`.

#### AlumnosService
- **Responsabilidad**: 
  - Validar el formato y contenido del archivo.
  - Ejecutar la creación masiva dentro de una transacción.
  - Retornar resumen de inserciones y posibles errores.

### base de datos (postgresql)

#### Alumno (Entity)
- **Operación**: `createMany` en transacción.

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `ImportarAlumnosView` | `ImportarAlumnosView (React)` | Componente para subir el archivo de alumnos. |
| `AlumnosController` | `AlumnosController (NestJS)` | Controlador para exponer el endpoint de importación. |
| `AlumnoRepository` | `AlumnosService (NestJS)` | Lógica transaccional de inserción múltiple con Prisma. |
| `Alumno` | `Alumno (Entity)` | Mapeo de datos procesados. |

## referencias

- [Análisis: importarAlumnos()](/RUP/01-analisis/casos-uso/0-Administrador/importarAlumnos/README.md)
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Diagramas de Clases](/images/02-diseño/clases-diseño.svg) - Diseño Global
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
