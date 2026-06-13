<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/abrirExamenes/abrirExamenes.md)|**Análisis**|[Diseño](/RUP/02-diseño/casos-uso/0-Administrador/abrirExamenes/README.md)|[Desarrollo](/RUP/03-desarrollo/casos-uso/0-Administrador/abrirExamenes/README.md)|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > abrirExamenes > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.0
- **Fecha**: 25/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `abrirExamenes()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para cumplir con los requisitos especificados de gestión de exámenes.

## diagrama de colaboración

<div align=center>

|![Análisis: abrirExamenes()](/images/01-analisis/casos-uso/0-Administrador/abrirExamenes/abrirExamenes-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### AbrirExamenesView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Recibir la solicitud de apertura de la gestión de exámenes.
- Interactuar con el controlador para obtener la lista de exámenes.
- Presentar la lista de exámenes al administrador.
- Capturar criterios de filtrado y búsqueda.
- Manejar la navegación de regreso al sistema y a operaciones CRUD vinculadas.

**Colaboraciones**:
- **Entrada**: Recibe `abrirExamenes()` desde `:Sistema Disponible`.
- **Control**: Se comunica con `ExamenesController`.
- **Salida**: Navega a `:Sistema Disponible` o colaboraciones CRUD especializadas.

### clases de control

#### ExamenesController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar la obtención de la lista completa de exámenes.
- Manejar la lógica de filtrado por criterios de búsqueda.
- Servir como intermediario entre la vista y el repositorio.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `AbrirExamenesView`.
- **Repositorio**: Delega operaciones de acceso a datos a `ExamenRepository`.

### clases de entidad (entity)

#### ExamenRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Abstraer el acceso a datos de los exámenes.
- Proporcionar métodos para obtener todos los registros o filtrar por criterios.

**Colaboraciones**:
- **Control**: Responde a `ExamenesController`.
- **Entidad**: Gestiona e interactúa con instancias de `Examen`.

#### Examen
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar la información de un examen individual.

## flujo de colaboración

### secuencia de operaciones

1. **Inicio**: `:Sistema Disponible` → `AbrirExamenesView.abrirExamenes()`
2. **Listado**: `AbrirExamenesView` → `ExamenesController.listarExamenes()`
3. **Acceso a datos**: `ExamenesController` → `ExamenRepository.obtenerTodos()`
4. **Filtrado (opcional)**: `AbrirExamenesView` → `ExamenesController.filtrarExamenes(criterio)`
5. **Búsqueda**: `ExamenesController` → `ExamenRepository.buscarPorCriterio(criterio)`
6. **Navegación**: `AbrirExamenesView` → Operaciones CRUD o retorno.

### opciones de navegación disponibles

- **completarGestion()** → `:Sistema Disponible`
- **crearExamen()** → `:Collaboration CrearExamen`
- **editarExamen(Examen)** → `:Collaboration EditarExamen`
- **eliminarExamen(Examen)** → `:Collaboration EliminarExamen`

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Presentar lista de exámenes|`AbrirExamenesView`|Coordina con `ExamenesController`|
|Acceso a datos|`ExamenRepository`|`obtenerTodos()`, `buscarPorCriterio()`|

**Código fuente:** [colaboracion.puml](../../../../../modelosUML/01-analisis/casos-uso/0-Administrador/abrirExamenes/colaboracion.puml)

## referencias

- [Especificación detallada: abrirExamenes()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/abrirExamenes/abrirExamenes.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
