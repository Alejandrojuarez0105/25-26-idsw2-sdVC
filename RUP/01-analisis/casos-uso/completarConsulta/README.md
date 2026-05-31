<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/completarConsulta/completarConsulta.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > completarConsulta > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.0
- **Fecha**: 31/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `completarConsulta()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para finalizar formalmente una actividad de consulta del calendario de exámenes y retornar al estado disponible del sistema.

## diagrama de colaboración

<div align=center>

|![Análisis: completarConsulta()](/images/01-analisis/casos-uso/completarConsulta/completarConsulta-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### ConsultarCalendarioView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Capturar la orden de finalización de la consulta.
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
- Gestionar el cierre ordenado del contexto de consulta.
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

**Código fuente:** [colaboracion.puml](../../../../modelosUML/01-analisis/casos-uso/completarConsulta/colaboracion.puml)

## referencias

- [Especificación detallada: completarConsulta()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/completarConsulta/completarConsulta.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
