<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/abrirAsignaturas/abrirAsignaturas.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > abrirAsignaturas > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.0
- **Fecha**: 25/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `abrirAsignaturas()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para cumplir con los requisitos especificados de gestión de asignaturas.

## diagrama de colaboración

<div align=center>

|![Análisis: abrirAsignaturas()](/images/01-analisis/casos-uso/abrirAsignaturas/abrirAsignaturas-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### AbrirAsignaturasView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Recibir la solicitud de apertura de la gestión de asignaturas.
- Interactuar con el controlador para obtener la lista de asignaturas.
- Presentar la lista de asignaturas al administrador.
- Capturar criterios de filtrado y búsqueda.
- Manejar la navegación de regreso al sistema y a operaciones CRUD vinculadas.

**Colaboraciones**:
- **Entrada**: Recibe `abrirAsignaturas()` desde `:Sistema Disponible`.
- **Control**: Se comunica con `AsignaturasController`.
- **Salida**: Navega a `:Sistema Disponible` o colaboraciones CRUD especializadas.

### clases de control

#### AsignaturasController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar la obtención de la lista completa de asignaturas.
- Manejar la lógica de filtrado por criterios de búsqueda.
- Servir como intermediario entre la vista y el repositorio.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `AbrirAsignaturasView`.
- **Repositorio**: Delega operaciones de acceso a datos a `AsignaturaRepository`.

### clases de entidad (entity)

#### AsignaturaRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Abstraer el acceso a datos de las asignaturas.
- Proporcionar métodos para obtener todos los registros o filtrar por criterios.

**Colaboraciones**:
- **Control**: Responde a `AsignaturasController`.
- **Entidad**: Gestiona e interactúa con instancias de `Asignatura`.

#### Asignatura
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar la información de una asignatura individual.

## flujo de colaboración

### secuencia de operaciones

1. **Inicio**: `:Sistema Disponible` → `AbrirAsignaturasView.abrirAsignaturas()`
2. **Listado**: `AbrirAsignaturasView` → `AsignaturasController.listarAsignaturas()`
3. **Acceso a datos**: `AsignaturasController` → `AsignaturaRepository.obtenerTodas()`
4. **Filtrado (opcional)**: `AbrirAsignaturasView` → `AsignaturasController.filtrarAsignaturas(criterio)`
5. **Búsqueda**: `AsignaturasController` → `AsignaturaRepository.buscarPorCriterio(criterio)`
6. **Navegación**: `AbrirAsignaturasView` → Opciones CRUD, Importar o retorno.

### opciones de navegación disponibles

- **completarGestion()** → `:Sistema Disponible`
- **crearAsignatura()** → `:Collaboration CrearAsignatura`
- **editarAsignatura(Asignatura)** → `:Collaboration EditarAsignatura`
- **eliminarAsignatura(Asignatura)** → `:Collaboration EliminarAsignatura`
- **importarAsignaturas()** → `:Collaboration ImportarAsignaturas`

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Presentar lista de asignaturas|`AbrirAsignaturasView`|Coordina con `AsignaturasController`|
|Acceso a datos|`AsignaturaRepository`|`obtenerTodas()`, `buscarPorCriterio()`|

**Código fuente:** [colaboracion.puml](../../../../modelosUML/01-analisis/casos-uso/abrirAsignaturas/colaboracion.puml)

## referencias

- [Especificación detallada: abrirAsignaturas()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/abrirAsignaturas/abrirAsignaturas.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
