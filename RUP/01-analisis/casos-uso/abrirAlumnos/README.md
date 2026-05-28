<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/abrirAlumnos/abrirAlumnos.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > abrirAlumnos > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.0
- **Fecha**: 25/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `abrirAlumnos()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para cumplir con los requisitos especificados.

## diagrama de colaboración

<div align=center>

|![Análisis: abrirAlumnos()](/images/01-analisis/casos-uso/abrirAlumnos/abrirAlumnos-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### AbrirAlumnosView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Recibir la solicitud de apertura de la gestión de alumnos.
- Interactuar con el controlador para obtener la lista de alumnos.
- Presentar la lista de alumnos al administrador.
- Capturar criterios de filtrado y búsqueda.
- Manejar la navegación de regreso al sistema y a operaciones CRUD vinculadas.

**Colaboraciones**:
- **Entrada**: Recibe `abrirAlumnos()` desde `:Sistema Disponible`.
- **Control**: Se comunica con `AlumnosController`.
- **Salida**: Navega a `:Sistema Disponible` o colaboraciones CRUD especializadas.

### clases de control

#### AlumnosController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar la obtención de la lista completa de alumnos.
- Manejar la lógica de filtrado por criterios de búsqueda.
- Servir como intermediario entre la vista y el repositorio de persistencia conceptual.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `AbrirAlumnosView`.
- **Repositorio**: Delega operaciones de acceso a datos a `AlumnoRepository`.

### clases de entidad (entity)

#### AlumnoRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Abstraer el acceso a datos de los alumnos.
- Proporcionar métodos para obtener todos los registros o filtrar por criterios.
- Mantener la consistencia conceptual de los datos de alumnos.

**Colaboraciones**:
- **Control**: Responde a `AlumnosController`.
- **Entidad**: Gestiona e interactúa con instancias de `Alumno`.

#### Alumno
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar la información de un alumno individual.
- Encapsular atributos fundamentales (ej. nombre, NIA, correo).

**Colaboraciones**:
- **Repositorio**: Es gestionado por `AlumnoRepository`.

## flujo de colaboración

### secuencia de operaciones

1. **Inicio**: `:Sistema Disponible` → `AbrirAlumnosView.abrirAlumnos()`
2. **Listado inicial**: `AbrirAlumnosView` → `AlumnosController.listarAlumnos()`
3. **Acceso a datos**: `AlumnosController` → `AlumnoRepository.obtenerTodos()`
4. **Filtrado (opcional)**: `AbrirAlumnosView` → `AlumnosController.filtrarAlumnos(criterio)`
5. **Búsqueda**: `AlumnosController` → `AlumnoRepository.buscarPorCriterio(criterio)`
6. **Navegación**: `AbrirAlumnosView` → Opciones CRUD o retorno.

### opciones de navegación disponibles

- **completarGestion()** → `:Sistema Disponible`
- **crearAlumno()** → `:Collaboration CrearAlumno`
- **editarAlumno()** → `:Collaboration EditarAlumno`
- **eliminarAlumno()** → `:Collaboration EliminarAlumno`
- **importarAlumnos()** → `:Collaboration ImportarAlumnos`

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Presentar lista de alumnos|`AbrirAlumnosView`|Coordina con `AlumnosController.listarAlumnos()`|
|Permitir filtrado de lista|`AbrirAlumnosView`|Invoca `AlumnosController.filtrarAlumnos(criterio)`|
|Acceso a datos de alumnos|`AlumnoRepository`|`obtenerTodos()`, `buscarPorCriterio()`|

**Código fuente:** [colaboracion.puml](../../../../modelosUML/01-analisis/casos-uso/abrirAlumnos/colaboracion.puml)

## referencias

- [Especificación detallada: abrirAlumnos()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/abrirAlumnos/abrirAlumnos.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
