<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/importarAsignaturas/README.md)|**Diseño**|[Implementación](/RUP/03-desarrollo/casos-uso/0-Administrador/importarAsignaturas/README.md)|Pruebas|
|-|-|-|-|-|-|

</div>

# Davidario > importarAsignaturas > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.1
- **Fecha**: 04/06/2026
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `importarAsignaturas()`. Define el mecanismo para la carga masiva de asignaturas desde archivos externos hacia PostgreSQL, detallando el flujo de procesamiento de buffers de archivo, validación individual de registros y consolidación de resultados en el frontend.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: importarAsignaturas()](/images/02-diseño/casos-uso/0-Administrador/importarAsignaturas/secuencia-diseño.svg)|
|-|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/importarAsignaturas/secuencia-diseño.puml)|

</div>

## especificación de componentes

### frontend (react)

#### ImportAsignaturasDialog (Component)
- **Tecnología**: Functional Component (TSX).
- **Responsabilidad**: Interfaz de carga de archivos y presentación del resumen de resultados (`ImportResultDTO`).

#### useAsignaturasImport (Hook)
- **Responsabilidad**: Gestionar el estado de la subida, progreso y almacenamiento de los resultados de la importación.

#### AsignaturasService (Service - Frontend)
- **Responsabilidad**: Ejecutar el envío del archivo mediante un `POST` con formato `Multipart/Form-Data`.

### backend (nestjs)

#### AsignaturasController
- **Tecnología**: NestJS Controller con interceptor de archivos (Multer).
- **Endpoint**: `POST /asignaturas/import`.

#### AsignaturasService (Service - Backend)
- **Responsabilidad**: 
  - `processImport(fileBuffer)`: Orquestar el procesamiento del archivo.
  - Gestionar el bucle de validación y creación de entidades.
  - Generar el objeto `ImportResultDTO` con el balance de la operación.

### base de datos (postgresql)

#### Asignatura (Entity)
- **Operación**: Inserción masiva de registros.

## flujo de diseño detallado

1. **Carga**: El Administrador selecciona un archivo y pulsa **Importar**.
2. **Trasmisión**: Los datos viajan como buffer binario hacia el controlador NestJS.
3. **Procesamiento**: El servicio backend recorre el archivo línea a línea.
4. **Validación**: Se verifica la integridad de cada registro (ej. formato de créditos, existencia del grado).
5. **Persistencia**: Los registros válidos se insertan en PostgreSQL.
6. **Balance**: El servidor retorna un objeto con el conteo de éxitos y la lista detallada de errores (ImportResultDTO).
7. **Feedback**: El frontend muestra un resumen cuantitativo al Administrador.

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `ImportarAsignaturasView` | `ImportAsignaturasDialog (React)` | Componente de interfaz de carga. |
| `AsignaturasController` | `AsignaturasController (NestJS)` | Manejo técnico de subida de archivos. |
| `AsignaturaService` | `AsignaturasService (NestJS)` | Algoritmo de parseo y persistencia masiva. |

## referencias

- [Análisis: importarAsignaturas()](/RUP/01-analisis/casos-uso/0-Administrador/importarAsignaturas/README.md)
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Diagramas de Clases](/images/02-diseño/clases-diseño.svg) - Diseño Global
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
