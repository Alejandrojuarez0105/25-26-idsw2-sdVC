<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/1-Profesor/DiagramaDeContextoProfesor.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/3-CasosDeUsoComunes/iniciarSesion/iniciarSesion.md)|**Análisis**|[Diseño](/RUP/02-diseño/casos-uso/1-Profesor/iniciarSesion/README.md)|[Desarrollo](/RUP/03-desarrollo/casos-uso/1-Profesor/iniciarSesion/README.md)|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > iniciarSesion > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.0
- **Fecha**: 01/06/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis del caso de uso `iniciarSesion()` para el actor **Profesor** mediante diagrama de colaboración MVC, identificando clases de análisis y sus interacciones conceptuales para realizar el acceso seguro al sistema.

## diagrama de colaboración

<div align=center>

|![Análisis iniciarSesion()](/images/01-analisis/casos-uso/1-Profesor/iniciarSesion/iniciarSesion-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases model (naranja #F2AC4E)
|Clase|Responsabilidad|Trazabilidad|
|-|-|-|
|**Usuario**|Entidad del dominio que representa un usuario del sistema.|Modelo del dominio|
|**Sesion**|Entidad que representa el estado de autenticación activa.|Concepto del caso de uso|
|**UsuarioRepository**|Concepto puro de acceso a datos de usuarios.|Análisis puro|

### clases view (azul #629EF9)
|Clase|Responsabilidad|Derivación|
|-|-|-|
|**LoginView**|Ventana principal de interacción para autenticación.|Wireframe Prototipo|

### clases controller (verde #b5bd68)
|Clase|Responsabilidad|Caso de uso|
|-|-|-|
|**IniciarSesionController**|Control y coordinación completa del caso de uso.|iniciarSesion()|

### colaboraciones (verde claro #CDEBA5)
|Colaboración|Propósito|Invocación|
|-|-|-|
|**:Sistema Disponible**|Transición al estado disponible del sistema.|Tras autenticación exitosa|

## mensajes de colaboración

### flujo principal
|Origen|Destino|Mensaje|Intención|
|-|-|-|-|
|**UsuarioNoRegistrado**|**LoginView**|`iniciarSesion(usuario, contraseña)`|Solicitar acceso al sistema|
|**LoginView**|**IniciarSesionController**|`autenticar(usuario, contraseña)`|Delegar proceso de autenticación|
|**IniciarSesionController**|**UsuarioRepository**|`validarCredenciales(usuario, contraseña)`|Verificar credenciales contra repositorio|
|**IniciarSesionController**|**UsuarioRepository**|`<<accede>>`|Acceso a la entidad Usuario|
|**IniciarSesionController**|**Sesion**|`crearSesion(usuario)`|Establecer sesión activa|
|**LoginView**|**:Sistema Disponible**|`sistemaDisponible(profesor)`|Transición a sistema disponible|

## enlaces de dependencia
- **LoginView** conoce a **IniciarSesionController** (delegación)
- **LoginView** conoce a **:Sistema Disponible** (transición de estado)
- **IniciarSesionController** conoce a **UsuarioRepository** (validación)
- **IniciarSesionController** conoce a **Sesion** (creación estado)
- **UsuarioRepository** conoce a **Usuario** (gestión entidad)

## trazabilidad con artefactos previos

### con especificación detallada
- **Estados internos** → **Clases de análisis**
- **Choice point** → **UsuarioRepository.validarCredenciales()**
- **Transformación actor** → **UsuarioNoRegistrado → Profesor**

### con prototipo (wireframes)
- **Pantalla: iniciar sesión** → **LoginView**
- **Campos usuario/contraseña** → **Atributos de LoginView**
- **Pantalla: credenciales inválidas** → **Manejo en IniciarSesionController**

### con modelo del dominio
- **Usuario** (entidad) → **Usuario** (clase de análisis)
- **Relaciones dominio** → **Enlaces colaboración**

## principios de análisis aplicados

### patrón mvc
- **Un controlador por caso de uso**: IniciarSesionController orquesta la lógica.
- **Vista derivada de prototipo**: LoginView representa la interfaz conceptual.
- **Modelo del dominio**: Entidades conceptuales sin detalles técnicos.

## características del análisis

### responsabilidades identificadas
- **LoginView**: Capturar credenciales y coordinar flujo de autenticación.
- **IniciarSesionController**: Orquestar lógica completa del caso de uso.
- **UsuarioRepository**: Proveer acceso conceptual a datos de usuarios.

## conexión con disciplina rup

### desde requisitos
- **Especificación detallada**: Define los flujos que las clases deben soportar.
- **Prototipo**: Provee la base para identificar las clases Boundary (View).

### hacia diseño
- **Clases conceptuales**: Sirven de base para definir las clases de diseño técnicas.

**Código fuente:** [colaboracion.puml](../../../../../modelosUML/01-analisis/casos-uso/1-Profesor/iniciarSesion/colaboracion.puml)

## referencias

- [Especificación detallada: iniciarSesion()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/3-CasosDeUsoComunes/iniciarSesion/iniciarSesion.md)
- [Diagrama de contexto - Profesor](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/1-Profesor/DiagramaDeContextoProfesor.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
