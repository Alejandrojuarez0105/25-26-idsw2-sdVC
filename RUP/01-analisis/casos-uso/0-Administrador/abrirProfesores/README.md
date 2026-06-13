<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/abrirProfesores/abrirProfesores.md)|**Análisis**|[Diseño](/RUP/02-diseño/casos-uso/0-Administrador/abrirProfesores/README.md)|[Desarrollo](/RUP/03-desarrollo/casos-uso/0-Administrador/abrirProfesores/README.md)|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > abrirProfesores > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.0
- **Fecha**: 30/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `abrirProfesores()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para cumplir con los requisitos especificados.

## diagrama de colaboración

<div align=center>

|![Análisis: abrirProfesores()](/images/01-analisis/casos-uso/0-Administrador/abrirProfesores/abrirProfesores-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### AbrirProfesoresView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Recibir la solicitud de apertura de la gestión de profesores.
- Interactuar con el controlador para obtener la lista de profesores.
- Presentar la lista de profesores al administrador.
- Capturar criterios de filtrado y búsqueda.
- Manejar la navegación de regreso al sistema y a operaciones CRUD vinculadas.

**Colaboraciones**:
- **Entrada**: Recibe `abrirProfesores()` desde `:Sistema Disponible`.
- **Control**: Se comunica con `ProfesoresController`.
- **Salida**: Navega a `:Sistema Disponible` o colaboraciones CRUD especializadas.

### clases de control

#### ProfesoresController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar la obtención de la lista completa de profesores.
- Manejar la lógica de filtrado por criterios de búsqueda.
- Servir como intermediario entre la vista y el repositorio de persistencia conceptual.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `AbrirProfesoresView`.
- **Repositorio**: Delega operaciones de acceso a datos a `ProfesorRepository`.

### clases de entidad (entity)

#### ProfesorRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Abstraer el acceso a datos de los profesores.
- Proporcionar métodos para obtener todos los registros o filtrar por criterios.
- Mantener la consistencia conceptual de los datos de profesores.

**Colaboraciones**:
- **Control**: Responde a `ProfesoresController`.
- **Entidad**: Gestiona e interactúa con instancias de `Profesor`.

#### Profesor
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar la información de un profesor individual (nombre, apellidos, correo, departamento, etc.).
- Encapsular atributos fundamentales.

**Colaboraciones**:
- **Repositorio**: Es gestionado por `ProfesorRepository`.

## flujo de colaboración

### secuencia de operaciones

1. **Inicio**: `:Sistema Disponible` → `AbrirProfesoresView.abrirProfesores()`
2. **Listado inicial**: `AbrirProfesoresView` → `ProfesoresController.listarProfesores()`
3. **Acceso a datos**: `ProfesoresController` → `ProfesorRepository.obtenerTodos()`
4. **Filtrado (opcional)**: `AbrirProfesoresView` → `ProfesoresController.filtrarProfesores(criterio)`
5. **Búsqueda**: `ProfesoresController` → `ProfesorRepository.buscarPorCriterio(criterio)`
6. **Navegación**: `AbrirProfesoresView` → Opciones CRUD o retorno.

### opciones de navegación disponibles

- **completarGestion()** → `:Sistema Disponible`
- **crearProfesor()** → `:Collaboration CrearProfesor`
- **editarProfesor()** → `:Collaboration EditarProfesor`
- **eliminarProfesor()** → `:Collaboration EliminarProfesor`
- **importarProfesores()** → `:Collaboration ImportarProfesores`

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Presentar lista de profesores|`AbrirProfesoresView`|Coordina con `ProfesoresController.listarProfesores()`|
|Permitir filtrado de lista|`AbrirProfesoresView`|Invoca `ProfesoresController.filtrarProfesores(criterio)`|
|Acceso a datos de profesores|`ProfesorRepository`|`obtenerTodos()`, `buscarPorCriterio()`|

**Código fuente:** [colaboracion.puml](../../../../../modelosUML/01-analisis/casos-uso/0-Administrador/abrirProfesores/colaboracion.puml)

## referencias

- [Especificación detallada: abrirProfesores()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/abrirProfesores/abrirProfesores.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
