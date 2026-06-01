<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|**Análisis**|Diseño|Desarrollo|Pruebas|
|-|-|-|-|-|-|

</div>

# Davidario > completarGestion > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.2
- **Fecha**: 31/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `completarGestion()` mediante el patrón MVC. Este caso de uso orquesta la transición desde una actividad administrativa finalizada hacia la redisponibilización del sistema, habilitando las opciones del menú principal basadas en los permisos del usuario activo.

## diagrama de colaboración

<div align=center>

|![Análisis: completarGestion()](/images/01-analisis/casos-uso/0-Administrador/completarGestion/completarGestion-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### GestionView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Representar la interfaz del menú principal o panel de control.
- Solicitar la habilitación de opciones al controlador una vez que el sistema vuelve a estar disponible.
- Presentar dinámicamente las opciones de gestión (Grados, Asignaturas, Profesores, etc.) al administrador.
- Servir como punto de navegación hacia todas las colaboraciones del sistema.

**Colaboraciones**:
- **Entrada**: Recibe `disponibilizarSistema()` desde `:Sistema Disponible`.
- **Control**: Se comunica con `CompletarGestionController`.
- **Navegación**: Enlaza con todas las colaboraciones de "Apertura", "Generación", "Consulta" y "Cierre de Sesión".

### clases de control

#### CompletarGestionController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar el flujo de habilitación del menú principal.
- Recuperar el usuario activo desde la sesión.
- Obtener los permisos y opciones permitidas mediante el repositorio de permisos.
- Orquestar la creación del objeto de opciones de menú.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `GestionView`.
- **Entidad**: Interactúa con `Sesion`, `PermisosRepository` y `OpcionesMenu`.

### clases de entidad (entity)

#### PermisosRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Abstraer el acceso a las reglas de autorización del sistema.
- Proporcionar la lista de opciones de menú (`Opcion`) permitidas para un usuario específico.

#### OpcionesMenu
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar el conjunto de funcionalidades habilitadas para la sesión actual.
- Mantener el estado de las opciones disponibles para la vista.

#### Sesion
**Estereotipo**: Entidad  
**Responsabilidades**:
- Proveer la identidad del usuario activo (`getUsuario()`).

## flujo de colaboración

### secuencia de operaciones

1. **Retorno**: `:Sistema Disponible` → `GestionView.disponibilizarSistema()`
2. **Habilitación**: `GestionView` → `CompletarGestionController.habilitarOpciones(administrador)`
3. **Contexto**: `CompletarGestionController` → `Sesion.getUsuario() : Usuario`
4. **Autorización**: `CompletarGestionController` → `PermisosRepository.obtenerOpciones(usuario) : List<Opcion>`
5. **Instanciación**: `CompletarGestionController` → `OpcionesMenu.crearOpciones(opciones)`
6. **Carga**: `GestionView` → `OpcionesMenu.getOpciones()`
7. **Navegación**: `GestionView` ofrece acceso a:
   - `abrirGrados()`, `abrirAsignaturas()`, `abrirProfesores()`, `abrirAulas()`, `abrirExamenes()`, `abrirAlumnos()`.

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Redisponibilizar sistema|`GestionView`|`disponibilizarSistema()`|
|Validar permisos de usuario|`PermisosRepository`|`obtenerOpciones(usuario)`|
|Habilitar menú dinámico|`CompletarGestionController`|`habilitarOpciones()`|

**Código fuente:** [colaboracion.puml](../../../../../modelosUML/01-analisis/casos-uso/0-Administrador/completarGestion/colaboracion.puml)

## referencias

- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
