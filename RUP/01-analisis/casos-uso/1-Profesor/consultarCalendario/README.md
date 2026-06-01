<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/1-Profesor/DiagramaDeContextoProfesor.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/1-Profesor/consultarCalendario/consultarCalendario.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > consultarCalendario > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.0
- **Fecha**: 01/06/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `consultarCalendario()` para el actor **Profesor** mediante el patrón MVC. Identifica las clases de análisis y colaboraciones necesarias para visualizar la programación de sus exámenes y navegar hacia la descarga o reporte de incidencias.

## diagrama de colaboración

<div align=center>

|![Análisis: consultarCalendario()](/images/01-analisis/casos-uso/1-Profesor/consultarCalendario/consultarCalendario-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### ConsultarCalendarioView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar la interfaz de visualización de exámenes personalizada para el profesor.
- Capturar parámetros de filtrado (rangos de fechas).
- Manejar la navegación hacia la descarga del calendario o el reporte de incidencias.

**Colaboraciones**:
- **Entrada**: Recibe `consultarCalendario()` desde `:Sistema Disponible`.
- **Control**: Se comunica con `CalendarioController`.
- **Salida**: Navega a `:Calendario Abierto` o regresa a `:Sistema Disponible` (`completarConsulta`).
- **Extensiones**: Enlaza con `DescargarCalendario` e `Incidencia`.

### clases de control

#### CalendarioController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar la recuperación de exámenes programados vinculados al profesor.
- Validar la sesión para obtener la identidad del profesor activo.
- Orquestar la comunicación entre la vista y el repositorio.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `ConsultarCalendarioView`.
- **Sesión**: Consulta `:Session` para obtener el contexto de usuario.
- **Repositorio**: Consulta `ExamenRepository`.

### clases de entidad (entity)

#### ExamenRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Proporcionar acceso filtrado a los exámenes programados del profesor (`buscarExamenes`).

#### Calendario / Examen / Asignatura / Grado
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar la jerarquía de información del dominio requerida para la consulta.

#### :Session
**Estereotipo**: Entidad  
**Responsabilidades**:
- Proveer el contexto de seguridad y la identidad del profesor activo.

## flujo de colaboración

### secuencia de operaciones

1. **Inicio**: `:Sistema Disponible` → `ConsultarCalendarioView.consultarCalendario()`
2. **Solicitud**: `ConsultarCalendarioView` → `CalendarioController.solicitarCalendario(rango, filtros)`
3. **Contexto**: `CalendarioController` → `:Session.obtenerUsuarioActivo()`
4. **Acceso a datos**: `CalendarioController` → `ExamenRepository.buscarExamenes(rango, filtros, usuario)`
5. **Navegación**: `ExamenRepository` → `Examen` → `Asignatura` → `Grado`
6. **Presentación**: `ConsultarCalendarioView` → `:Calendario Abierto.mostrarCalendario(List<Examen>)`
7. **Acciones**: 
   - `<<descargar>>` ..> `DescargarCalendario`
   - `<<incidencia>>` ..> `Incidencia`
8. **Salida**: `ConsultarCalendarioView` → `:Sistema Disponible` (completarConsulta)

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Filtrar por profesor activo|`CalendarioController`|`obtenerUsuarioActivo()`|
|Visualizar jerarquía académica|`ExamenRepository`|Mapeo `Examen` → `Asignatura` → `Grado`|
|Reportar incidencias|`ConsultarCalendarioView`|Enlace a `Incidencia`|

**Código fuente:** [colaboracion.puml](../../../../../modelosUML/01-analisis/casos-uso/1-Profesor/consultarCalendario/colaboracion.puml)

## referencias

- [Especificación detallada: consultarCalendario()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/1-Profesor/consultarCalendario/consultarCalendario.md)
- [Diagrama de contexto - Profesor](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/1-Profesor/DiagramaDeContextoProfesor.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
