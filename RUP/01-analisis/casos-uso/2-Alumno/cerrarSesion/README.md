<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/2-Alumno/DiagramaDeContextoAlumno.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/3-CasosDeUsoComunes/cerrarSesion/cerrarSesion.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > cerrarSesion > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.0
- **Fecha**: 01/06/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis del caso de uso `cerrarSesion()` para el actor **Alumno** mediante diagrama de colaboración MVC, identificando clases de análisis y sus interacciones conceptuales para finalizar de forma segura el acceso al sistema.

## diagrama de colaboración

<div align=center>

|![Análisis cerrarSesion()](/images/01-analisis/casos-uso/2-Alumno/cerrarSesion/cerrarSesion-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases model (naranja #F2AC4E)
|Clase|Responsabilidad|Trazabilidad|
|-|-|-|
|**Sesion**|Entidad que representa el estado de autenticación activa y su finalización.|Concepto del caso de uso|
|**SesionRepository**|Capa de acceso a la gestión del ciclo de vida de la sesión (creación, finalización e invalidación).|Soporte al control de cierre de sesión|

### clases view (azul #629EF9)
|Clase|Responsabilidad|Derivación|
|-|-|-|
|**CerrarSesionView**|Ventana de interacción para confirmar el cierre de sesión.|Wireframe Prototipo|

### clases controller (verde #b5bd68)
|Clase|Responsabilidad|Caso de uso|
|-|-|-|
|**CerrarSesionController**|Control y coordinación del proceso de cierre de sesión.|cerrarSesion()|

### colaboraciones (verde claro #CDEBA5)
|Colaboración|Propósito|Invocación|
|-|-|-|
|**:Sesión Cerrada**|Transición al estado de sesión finalizada.|Tras confirmación de cierre|

## mensajes de colaboración

### flujo principal
|Origen|Destino|Mensaje|Intención|
|-|-|-|-|
|**Alumno**|**CerrarSesionView**|`cerrarSesion()`|Solicitar el cierre de la sesión activa|
|**CerrarSesionView**|**CerrarSesionController**|`confirmarCierre()`|Delegar la finalización de la sesión|
|**CerrarSesionController**|**SesionRepository**|`finalizarSesion()`|Invalidar el estado de sesión activa|
|**CerrarSesionView**|**:Sesión Cerrada**|`sesionCerrada()`|Transición al estado inicial del sistema|

## enlaces de dependencia
- **CerrarSesionView** conoce a **CerrarSesionController** (delegación)
- **CerrarSesionView** conoce a **:Sesión Cerrada** (transición de estado)
- **CerrarSesionController** conoce a **SesionRepository** (finalización de estado)

## trazabilidad con artefactos previos

### con especificación detallada
- **Estados internos** → **Clases de análisis**
- **Transición final** → **Sesión Cerrada**
- **Transformación actor** → **Alumno → UsuarioNoRegistrado**

### con prototipo (wireframes)
- **Pantalla: cerrar sesión** → **CerrarSesionView**

### con modelo del dominio
- **Sesion** (concepto) → **Sesion** (clase de análisis)

## principios de análisis aplicados

### patrón mvc
- **Controlador especializado**: CerrarSesionController coordina la salida segura.
- **Vista de confirmación**: CerrarSesionView gestiona la interacción de salida.
- **Modelo de sesión**: Sesion maneja la persistencia temporal del estado.

## características del análisis

### responsabilidades identificadas
- **CerrarSesionView**: Presentar la confirmación y capturar la voluntad del actor.
- **CerrarSesionController**: Asegurar que los recursos de sesión se liberen.

## conexión con disciplina rup

### desde requisitos
- **Especificación detallada**: Provee el flujo de confirmación necesario.
- **Prototipo**: Define el aspecto conceptual del diálogo de cierre.

### hacia diseño
- **Clases conceptuales**: Base para la implementación de la gestión de tokens.

**Código fuente:** [colaboracion.puml](../../../../../modelosUML/01-analisis/casos-uso/2-Alumno/cerrarSesion/colaboracion.puml)

## referencias

- [Especificación detallada: cerrarSesion()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/3-CasosDeUsoComunes/cerrarSesion/cerrarSesion.md)
- [Diagrama de contexto - Alumno](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/2-Alumno/DiagramaDeContextoAlumno.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
