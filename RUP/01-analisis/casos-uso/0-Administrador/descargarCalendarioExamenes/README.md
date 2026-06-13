<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/descargarCalendarioExamenes/descargarCalendarioExamenes.md)|**Análisis**|[Diseño](/RUP/02-diseño/casos-uso/0-Administrador/descargarCalendarioExamenes/README.md)|[Desarrollo](/RUP/03-desarrollo/casos-uso/0-Administrador/descargarCalendarioExamenes/README.md)|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > descargarCalendarioExamenes > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.1
- **Fecha**: 31/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `descargarCalendarioExamenes()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para exportar la programación de exámenes en formatos externos, garantizando que el contenido se ajuste al perfil del actor solicitante.

## diagrama de colaboración

<div align=center>

|![Análisis: descargarCalendarioExamenes()](/images/01-analisis/casos-uso/0-Administrador/descargarCalendarioExamenes/descargarCalendarioExamenes-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### ConsultarCalendarioView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Ofrecer las opciones de descarga al administrador o profesor.
- Capturar parámetros de exportación (periodo, formato, opciones de visualización).
- Recibir el archivo generado y gestionar la descarga local.
- Manejar la cancelación o finalización del proceso de exportación.

**Colaboraciones**:
- **Entrada**: Recibe `descargarCalendarioExamenes()` desde `:Calendario Abierto`.
- **Control**: Se comunica con `CalendarioController`.
- **Salida**: Navega de regreso a `:Calendario Abierto`.

### clases de control

#### CalendarioController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar el proceso de generación del archivo de exportación.
- Recuperar el actor activo de la sesión para filtrar el contenido del archivo.
- Orquestar la obtención de datos y la invocación al servicio de exportación.

**Colaboraciones**:
- **Vista**: Envía `archivoGenerado(File)` a `ConsultarCalendarioView`.
- **Sesión**: Consulta `:Session` para obtener el actor.
- **Servicio**: Delega la generación técnica a `ExportService`.

### clases de entidad (entity)

#### ExamenRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Proporcionar la lista de exámenes programados filtrada por periodo y actor (`obtenerExamenesPorPeriodo`).

#### ExportService
**Estereotipo**: Entidad (Servicio)  
**Responsabilidades**:
- Ejecutar la transformación de los datos de exámenes al formato de archivo solicitado (PDF, Excel, etc.).
- Leer directamente del repositorio si es necesario para optimizar la generación.

#### :Session
**Estereotipo**: Entidad  
**Responsabilidades**:
- Proveer la identidad y rol del actor solicitante.

## flujo de colaboración

### secuencia de operaciones

1. **Solicitud**: `:Calendario Abierto` → `ConsultarCalendarioView.descargarCalendarioExamenes()`
2. **Parámetros**: `ConsultarCalendarioView` → `CalendarioController.generarArchivo(periodo, formato, opciones)`
3. **Identificación**: `CalendarioController` → `:Session.obtenerActor()`
4. **Carga**: `CalendarioController` → `ExamenRepository.obtenerExamenesPorPeriodo(periodo, actor)`
5. **Generación**: `CalendarioController` → `ExportService.exportar(examenes, formato, opciones) : File`
6. **Notificación**: `CalendarioController` → `ConsultarCalendarioView.archivoGenerado(File)`
7. **Retorno**: `ConsultarCalendarioView` → `:Calendario Abierto` (finalizar o cancelar)

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Filtrar por periodo y actor|`ExamenRepository`|`obtenerExamenesPorPeriodo()`|
|Generar archivo técnico|`ExportService`|`exportar(examenes, formato, ...)`|
|Notificar disponibilidad|`CalendarioController`|`archivoGenerado(File)`|

**Código fuente:** [colaboracion.puml](../../../../../modelosUML/01-analisis/casos-uso/0-Administrador/descargarCalendarioExamenes/colaboracion.puml)

## referencias

- [Especificación detallada: descargarCalendarioExamenes()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/descargarCalendarioExamenes/descargarCalendarioExamenes.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
