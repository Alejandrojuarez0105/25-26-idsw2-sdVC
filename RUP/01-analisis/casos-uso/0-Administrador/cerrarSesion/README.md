<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/3-CasosDeUsoComunes/cerrarSesion/cerrarSesion.md)|**Análisis**|[Diseño](/RUP/02-diseño/casos-uso/0-Administrador/cerrarSesion/README.md)|[Desarrollo](/RUP/03-desarrollo/casos-uso/0-Administrador/cerrarSesion/README.md)|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > cerrarSesion > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.0
- **Fecha**: 23/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis del caso de uso `cerrarSesion()` mediante diagrama de colaboración MVC, identificando clases de análisis y sus interacciones conceptuales para realizar el caso de uso.

## diagrama de colaboración

<div align=center>

|![Análisis cerrarSesion()](/images/01-analisis/casos-uso/0-Administrador/cerrarSesion/cerrarSesion-analisis.svg)|
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
|**Administrador**|**LogoutView**|`cerrarSesion()`|Solicitar el cierre de la sesión activa|
|**LogoutView**|**CerrarSesionController**|`confirmarCierre()`|Delegar la finalización de la sesión|
|**CerrarSesionController**|**Sesion**|`finalizarSesion()`|Invalidar el estado de sesión activa|
|**LogoutView**|**:Sesión Cerrada**|`sesionCerrada()`|Transición al estado inicial del sistema|

## enlaces de dependencia
- **LogoutView** conoce a **CerrarSesionController** (delegación)
- **LogoutView** conoce a **:Sesión Cerrada** (transición de estado)
- **CerrarSesionController** conoce a **Sesion** (finalización de estado)

## trazabilidad con artefactos previos

### con especificación detallada
- **Estados internos** → **Clases de análisis**
- **Transición final** → **Sesión Cerrada**
- **Transformación actor** → **Administrador → UsuarioNoRegistrado**

### con prototipo (wireframes)
- **Pantalla: cerrar sesión** → **LogoutView**
- **Botones Confirmar/Cancelar** → **Interacciones en LogoutView**

### con modelo del dominio
- **Sesion** (concepto) → **Sesion** (clase de análisis)

### nota sobre el actor Usuario

En el diagrama de colaboración se incluye el concepto de **Usuario** asociado a la sesión como entidad contextual necesaria para la finalización de la misma.  
Aunque no se modela como clase de análisis independiente en este caso de uso, se utiliza como referencia conceptual para identificar la sesión activa.

## principios de análisis aplicados

### patrón mvc
- **Controlador especializado**: CerrarSesionController coordina la salida segura.
- **Vista de confirmación**: LogoutView gestiona la interacción de despedida.
- **Modelo de sesión**: Sesion maneja la persistencia temporal del estado.

### diagramas de colaboración
- **Minimalismo**: Foco en la acción de destrucción/finalización del estado.
- **Claridad de mensajes**: Expresión de la intención de salida del sistema.

## características del análisis

### responsabilidades identificadas
- **LogoutView**: Presentar la confirmación y capturar la voluntad del actor.
- **CerrarSesionController**: Asegurar que los recursos de sesión se liberen.

## conexión con disciplina rup

### desde requisitos
- **Especificación detallada**: Provee el flujo de confirmación necesario.
- **Prototipo**: Define el aspecto conceptual del diálogo de cierre.

### hacia diseño
- **Clases conceptuales**: Base para la implementación de la gestión de tokens o cookies.
- **Colaboraciones**: Definen el flujo de navegación de retorno al login.

### capa de persistencia de sesión

En este caso de uso se introduce `SesionRepository` como mecanismo de abstracción para la gestión del ciclo de vida de la sesión (finalización e invalidación), actuando como soporte del controlador en la coordinación del cierre de sesión.

**Código fuente:** [colaboracion.puml](../../../../../modelosUML/01-analisis/casos-uso/0-Administrador/cerrarSesion/colaboracion.puml)

## referencias

- [Especificación detallada: cerrarSesion()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/3-CasosDeUsoComunes/cerrarSesion/cerrarSesion.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
