<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/1-Profesor/DiagramaDeContextoProfesor.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/1-Profesor/descargarCalendarioExamenes/descargarCalendarioExamenes.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > descargarCalendarioExamenes > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.0
- **Fecha**: 01/06/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `descargarCalendarioExamenes()` para el actor **Profesor** mediante el patrón MVC. Identifica las clases y colaboraciones necesarias para exportar su programación de exámenes personalizada en formatos externos.

## diagrama de colaboración

<div align=center>

|![Análisis: descargarCalendarioExamenes()](/images/01-analisis/casos-uso/1-Profesor/descargarCalendarioExamenes/descargarCalendarioExamenes-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### ConsultarCalendarioView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Ofrecer las opciones de descarga al profesor.
- Capturar parámetros de exportación (periodo, formato).
- Recibir el archivo generado y gestionar la descarga local.
- Manejar la cancelación o finalización del proceso.

**Colaboraciones**:
- **Entrada**: Recibe `descargarCalendarioExamenes()` desde `:Calendario Abierto`.
- **Control**: Se comunica con `CalendarioController`.
- **Salida**: Navega de regreso a `:Calendario Abierto`.

### clases de control

#### CalendarioController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar el proceso de generación del archivo para el profesor.
- Recuperar la identidad del profesor activo de la sesión.
- Orquestar la obtención de datos y la delegación al servicio de exportación.

**Colaboraciones**:
- **Vista**: Envía `archivoGenerado(File)` a `ConsultarCalendarioView`.
- **Sesión**: Consulta `:Session` para obtener el actor.
- **Servicio**: Delega la generación técnica a `ExportService`.

### clases de entidad (entity)

#### ExamenRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Proporcionar la lista de exámenes programados filtrada por el profesor (`obtenerExamenesPorPeriodo`).

#### ExportService
**Estereotipo**: Entidad (Servicio)  
**Responsabilidades**:
- Ejecutar la transformación de los datos al formato solicitado (PDF, Excel).

#### :Session
**Estereotipo**: Entidad  
**Responsabilidades**:
- Proveer la identidad del profesor solicitante.

## flujo de colaboración

### secuencia de operaciones

1. **Solicitud**: `:Calendario Abierto` → `ConsultarCalendarioView.descargarCalendarioExamenes()`
2. **Parámetros**: `ConsultarCalendarioView` → `CalendarioController.generarArchivo(periodo, formato)`
3. **Identificación**: `CalendarioController` → `:Session.obtenerActor()`
4. **Carga**: `CalendarioController` → `ExamenRepository.obtenerExamenesPorPeriodo(periodo, actor)`
5. **Generación**: `CalendarioController` → `ExportService.exportar(examenes, formato) : File`
6. **Notificación**: `CalendarioController` → `ConsultarCalendarioView.archivoGenerado(File)`
7. **Retorno**: `ConsultarCalendarioView` → `:Calendario Abierto` (finalizar o cancelar)

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Filtrar por periodo y actor|`ExamenRepository`|`obtenerExamenesPorPeriodo()`|
|Generar archivo técnico|`ExportService`|`exportar(examenes, formato, ...)`|
|Notificar disponibilidad|`CalendarioController`|`archivoGenerado(File)`|

**Código fuente:** [colaboracion.puml](../../../../../modelosUML/01-analisis/casos-uso/1-Profesor/descargarCalendarioExamenes/colaboracion.puml)

## referencias

- [Especificación detallada: descargarCalendarioExamenes()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/1-Profesor/descargarCalendarioExamenes/descargarCalendarioExamenes.md)
- [Diagrama de contexto - Profesor](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/1-Profesor/DiagramaDeContextoProfesor.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
