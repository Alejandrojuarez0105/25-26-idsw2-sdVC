<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/1-Profesor/DiagramaDeContextoProfesor.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/1-Profesor/consultarCalendario/consultarCalendario.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > completarConsulta > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.0
- **Fecha**: 01/06/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `completarConsulta()` para el actor **Profesor** mediante el patrón MVC. Identifica las clases y colaboraciones necesarias para finalizar formalmente la actividad de consulta del calendario y retornar al estado disponible del sistema.

## diagrama de colaboración

<div align=center>

|![Análisis: completarConsulta()](/images/01-analisis/casos-uso/1-Profesor/completarConsulta/completarConsulta-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### ConsultarCalendarioView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Capturar la orden de finalización de la consulta por parte del profesor.
- Solicitar la limpieza de estados de sesión al controlador.
- Ejecutar la navegación de salida hacia el menú principal.

**Colaboraciones**:
- **Entrada**: Recibe `completarConsulta()` desde `:Calendario Abierto`.
- **Control**: Se comunica con `CalendarioController`.
- **Salida**: Navega a `:Sistema Disponible`.

### clases de control

#### CalendarioController
**Estereotipo**: Control  
**Responsabilidades**:
- Gestionar el cierre ordenado del contexto de consulta del profesor.
- Liberar cualquier recurso temporal o filtro activo en la sesión.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `ConsultarCalendarioView`.

## flujo de colaboración

### secuencia de operaciones

1. **Solicitud**: `:Calendario Abierto` → `ConsultarCalendarioView.completarConsulta()`
2. **Cierre**: `ConsultarCalendarioView` → `CalendarioController.finalizarSesionConsulta()`
3. **Navegación**: `ConsultarCalendarioView` → `:Sistema Disponible` (retorno al menú)

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Finalizar actividad actual|`ConsultarCalendarioView`|Interfaz de cierre|
|Liberar recursos|`CalendarioController`|`finalizarSesionConsulta()`|
|Retornar al menú|`ConsultarCalendarioView`|Navegación de salida|

**Código fuente:** [colaboracion.puml](../../../../../modelosUML/01-analisis/casos-uso/1-Profesor/completarConsulta/colaboracion.puml)

## referencias

- [consultarCalendario() - Caso de uso origen](/RUP/01-analisis/casos-uso/1-Profesor/consultarCalendario/README.md)
- [Diagrama de contexto - Profesor](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/1-Profesor/DiagramaDeContextoProfesor.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
