<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/1-Profesor/DiagramaDeContextoProfesor.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/1-Profesor/comunicarIncidenciasHorario/comunicarIncidenciasHorario.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > completarComunicacion > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.0
- **Fecha**: 01/06/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `completarComunicacion()` mediante el patrón MVC, identificando las clases y colaboraciones necesarias para finalizar formalmente la actividad de reporte de incidencias y retornar al estado disponible del sistema.

## diagrama de colaboración

<div align=center>

|![Análisis: completarComunicacion()](/images/01-analisis/casos-uso/1-Profesor/completarComunicacion/completarComunicacion-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### ComunicarIncidenciasView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Capturar la orden de finalización del proceso de comunicación de incidencias.
- Solicitar la limpieza de estados de sesión al controlador.
- Ejecutar la navegación de salida hacia el menú principal.

**Colaboraciones**:
- **Entrada**: Recibe `completarComunicacion()` desde `:Incidencias Abierto`.
- **Control**: Se comunica con `IncidenciasController`.
- **Salida**: Navega a `:Sistema Disponible`.

### clases de control

#### IncidenciasController
**Estereotipo**: Control  
**Responsabilidades**:
- Gestionar el cierre ordenado del contexto de comunicación del profesor.
- Liberar cualquier recurso temporal o estado de carga activa en la sesión.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `ComunicarIncidenciasView`.

## flujo de colaboración

### secuencia de operaciones

1. **Solicitud**: `:Incidencias Abierto` → `ComunicarIncidenciasView.completarComunicacion()`
2. **Cierre**: `ComunicarIncidenciasView` → `IncidenciasController.finalizarSesionComunicacion()`
3. **Navegación**: `ComunicarIncidenciasView` → `:Sistema Disponible` (retorno al menú)

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Finalizar actividad actual|`ComunicarIncidenciasView`|Interfaz de cierre|
|Liberar recursos de sesión|`IncidenciasController`|`finalizarSesionComunicacion()`|
|Retornar al menú|`ComunicarIncidenciasView`|Navegación de salida|

**Código fuente:** [colaboracion.puml](../../../../../modelosUML/01-analisis/casos-uso/1-Profesor/completarComunicacion/colaboracion.puml)

## referencias

- [comunicarIncidenciasHorario() - Caso de uso origen](/RUP/01-analisis/casos-uso/1-Profesor/comunicarIncidenciasHorario/README.md)
- [Diagrama de contexto - Profesor](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/1-Profesor/DiagramaDeContextoProfesor.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
