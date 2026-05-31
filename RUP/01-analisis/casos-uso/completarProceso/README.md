<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/completarProceso/completarProceso.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > completarProceso > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.0
- **Fecha**: 31/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `completarProceso()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para finalizar formalmente una actividad de procesamiento masivo (ej. Generación de Calendario) y retornar al estado disponible del sistema.

## diagrama de colaboración

<div align=center>

|![Análisis: completarProceso()](/images/01-analisis/casos-uso/completarProceso/completarProceso-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### GenerarCalendarioView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Capturar la orden de finalización del proceso de generación.
- Solicitar la limpieza de estados temporales al controlador.
- Ejecutar la navegación de salida hacia el menú principal.

**Colaboraciones**:
- **Entrada**: Recibe `completarProceso()` desde `:Calendario Generado`.
- **Control**: Se comunica con `CalendarioController`.
- **Salida**: Navega a `:Sistema Disponible`.

### clases de control

#### CalendarioController
**Estereotipo**: Control  
**Responsabilidades**:
- Gestionar la terminación ordenada del hilo de ejecución del proceso.
- Liberar recursos temporales o estados de sesión vinculados a la generación.
- Asegurar que la persistencia final se ha consolidado antes de cerrar el contexto.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `GenerarCalendarioView`.

## flujo de colaboración

### secuencia de operaciones

1. **Solicitud**: `:Calendario Generado` → `GenerarCalendarioView.completarProceso()`
2. **Cierre**: `GenerarCalendarioView` → `CalendarioController.finalizarSesionProceso()`
3. **Navegación**: `GenerarCalendarioView` → `:Sistema Disponible` (retorno al menú)

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Finalizar actividad actual|`GenerarCalendarioView`|Interfaz de cierre|
|Liberar recursos|`CalendarioController`|`finalizarSesionProceso()`|
|Retornar al menú|`GenerarCalendarioView`|Navegación de salida|

**Código fuente:** [colaboracion.puml](../../../../modelosUML/01-analisis/casos-uso/completarProceso/colaboracion.puml)

## referencias

- [Especificación detallada: completarProceso()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/completarProceso/completarProceso.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
