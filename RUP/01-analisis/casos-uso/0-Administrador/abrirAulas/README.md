<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/abrirAulas/abrirAulas.md)|**Análisis**|[Diseño](/RUP/02-diseño/casos-uso/0-Administrador/abrirAulas/README.md)|[Desarrollo](/RUP/03-desarrollo/casos-uso/0-Administrador/abrirAulas/README.md)|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > abrirAulas > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.0
- **Fecha**: 28/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `abrirAulas()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para cumplir con los requisitos especificados.

## diagrama de colaboración

<div align=center>

|![Análisis: abrirAulas()](/images/01-analisis/casos-uso/0-Administrador/abrirAulas/abrirAulas-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### AbrirAulasView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Recibir la solicitud de apertura de la gestión de aulas.
- Interactuar con el controlador para obtener la lista de aulas.
- Presentar la lista de aulas al administrador.
- Capturar criterios de filtrado y búsqueda.
- Manejar la navegación de regreso al sistema y a operaciones CRUD vinculadas.

**Colaboraciones**:
- **Entrada**: Recibe `abrirAulas()` desde `:Sistema Disponible`.
- **Control**: Se comunica con `AulasController`.
- **Salida**: Navega a `:Sistema Disponible` o colaboraciones CRUD especializadas.

### clases de control

#### AulasController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar la obtención de la lista completa de aulas.
- Manejar la lógica de filtrado por criterios de búsqueda.
- Servir como intermediario entre la vista y el repositorio de persistencia conceptual.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `AbrirAulasView`.
- **Repositorio**: Delega operaciones de acceso a datos a `AulaRepository`.

### clases de entidad (entity)

#### AulaRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Abstraer el acceso a datos de las aulas.
- Proporcionar métodos para obtener todos los registros o filtrar por criterios.
- Mantener la consistencia conceptual de los datos de aulas.

**Colaboraciones**:
- **Control**: Responde a `AulasController`.
- **Entidad**: Gestiona e interactúa con instancias de `Aula`.

#### Aula
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar la información de un aula individual (nombre, capacidad, ubicación, etc.).
- Encapsular atributos fundamentales.

**Colaboraciones**:
- **Repositorio**: Es gestionado por `AulaRepository`.

## flujo de colaboración

### secuencia de operaciones

1. **Inicio**: `:Sistema Disponible` → `AbrirAulasView.abrirAulas()`
2. **Listado inicial**: `AbrirAulasView` → `AulasController.listarAulas()`
3. **Acceso a datos**: `AulasController` → `AulaRepository.obtenerTodas()`
4. **Filtrado (opcional)**: `AbrirAulasView` → `AulasController.filtrarAulas(criterio)`
5. **Búsqueda**: `AulasController` → `AulaRepository.buscarPorCriterio(criterio)`
6. **Navegación**: `AbrirAulasView` → Opciones CRUD o retorno.

### opciones de navegación disponibles

- **completarGestion()** → `:Sistema Disponible`
- **crearAula()** → `:Collaboration CrearAula`
- **editarAula()** → `:Collaboration EditarAula`
- **eliminarAula()** → `:Collaboration EliminarAula`
- **importarAulas()** → `:Collaboration ImportarAulas`

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Presentar lista de aulas|`AbrirAulasView`|Coordina con `AulasController.listarAulas()`|
|Permitir filtrado de lista|`AbrirAulasView`|Invoca `AulasController.filtrarAulas(criterio)`|
|Acceso a datos de aulas|`AulaRepository`|`obtenerTodas()`, `buscarPorCriterio()`|

**Código fuente:** [colaboracion.puml](../../../../../modelosUML/01-analisis/casos-uso/0-Administrador/abrirAulas/colaboracion.puml)

## referencias

- [Especificación detallada: abrirAulas()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/abrirAulas/abrirAulas.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
