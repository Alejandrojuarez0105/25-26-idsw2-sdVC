<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/importarGrados/README.md)|**Diseño**|Implementación|Pruebas|
|-|-|-|-|-|-|

</div>

# Davidario > importarGrados > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 02/06/2026
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `importarGrados()`. Define la lógica para la carga masiva de grados académicos desde archivos externos (Excel/CSV), gestionando la validación de datos y el reporte de resultados de la importación.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: importarGrados()](/images/02-diseño/casos-uso/0-Administrador/importarGrados/secuencia-diseño.svg)|
|-|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/importarGrados/secuencia-diseño.puml)|

</div>

## especificación de componentes

### frontend (react)

#### GradosImportView (Component)
- **Tecnología**: Functional Component (TSX).
- **Responsabilidad**: Interfaz para la selección de archivos y visualización del progreso y resultados de la importación.
- **Hook**: Utiliza `useGradosImport()` para gestionar el proceso de subida.

#### useGradosImport (Hook)
- **Responsabilidad**: Controlar el estado de la subida del archivo y capturar la respuesta del servidor (`ImportResultDTO`).
- **Servicio**: Invoca a `GradosService` para enviar el archivo.

#### GradosService (Service)
- **Responsabilidad**: Realizar la petición `POST /grados/import` enviando el archivo como `FormData`.

### backend (nestjs)

#### GradosController
- **Tecnología**: NestJS Controller.
- **Endpoint**: `POST /grados/import`.
- **Interceptors**: Utiliza `FileInterceptor` para procesar la subida del archivo.

#### GradosService
- **Responsabilidad**: 
  - Leer y parsear el archivo (Excel/CSV).
  - Validar la integridad de los datos.
  - Insertar/actualizar registros en la base de datos.
  - Generar el `ImportResultDTO` con el resumen del proceso.

### base de datos (postgresql)

#### Grado (Entity)
- **Atributos**: `id` (UUID), `codigo`, `nombre`, `descripcion`.

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `ImportarGradosView` | `GradosImportView (React)` | Interfaz de usuario para la carga de archivos. |
| `GradosController` | `GradosController (NestJS)` | Endpoint para recibir el archivo de importación. |
| `ImportadorGrados` | `GradosService (NestJS)` | Lógica de procesamiento y validación de archivos. |
| `ResultadoImportacion` | `ImportResultDTO` | Estructura de datos para reportar el éxito/error de la carga. |

## referencias

- [Análisis: importarGrados()](/RUP/01-analisis/casos-uso/0-Administrador/importarGrados/README.md)
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Diagramas de Clases](/images/02-diseño/clases-diseño.svg) - Diseño Global
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
