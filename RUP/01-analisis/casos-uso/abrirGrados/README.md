<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/abrirGrados/abrirGrados.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > abrirGrados > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.0
- **Fecha**: 24/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `abrirGrados()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para cumplir con los requisitos especificados.

## diagrama de colaboración

<div align=center>

|![Análisis: abrirGrados()](/images/01-analisis/casos-uso/abrirGrados/abrirGrados-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### AbrirGradosView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Recibir la solicitud de apertura de la gestión de grados académicos.
- Interactuar con el controlador para obtener la lista de grados.
- Presentar la lista de grados al administrador.
- Capturar criterios de filtrado y búsqueda.
- Manejar la navegación de regreso al sistema y a operaciones CRUD vinculadas.

**Colaboraciones**:
- **Entrada**: Recibe `abrirGrados()` desde `:Sistema Disponible`.
- **Control**: Se comunica con `GradosController`.
- **Salida**: Navega a `:Sistema Disponible` o colaboraciones CRUD especializadas.

### clases de control

#### GradosController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar la obtención de la lista completa de grados.
- Manejar la lógica de filtrado por criterios de búsqueda.
- Servir como intermediario entre la vista y el repositorio de persistencia conceptual.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `AbrirGradosView`.
- **Repositorio**: Delega operaciones de acceso a datos a `GradoRepository`.

### clases de entidad (entity)

#### GradoRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Abstraer el acceso a datos de los grados.
- Proporcionar métodos para obtener todos los registros o filtrar por criterios.
- Mantener la consistencia conceptual de los datos de grados.

**Colaboraciones**:
- **Control**: Responde a `GradosController`.
- **Entidad**: Gestiona e interactúa con instancias de `Grado`.

#### Grado
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar la información de un grado individual.
- Encapsular atributos fundamentales (ej. nombre, código).

**Colaboraciones**:
- **Repositorio**: Es gestionado por `GradoRepository`.

## flujo de colaboración

### secuencia de operaciones

1. **Inicio**: `:Sistema Disponible` → `AbrirGradosView.abrirGrados()`
2. **Listado inicial**: `AbrirGradosView` → `GradosController.listarGrados()`
3. **Acceso a datos**: `GradosController` → `GradoRepository.obtenerTodos()`
4. **Filtrado (opcional)**: `AbrirGradosView` → `GradosController.filtrarGrados(criterio)`
5. **Búsqueda**: `GradosController` → `GradoRepository.buscarPorCriterio(criterio)`
6. **Navegación**: `AbrirGradosView` → Opciones CRUD o retorno.

### opciones de navegación disponibles

- **completarGestion()** → `:Sistema Disponible`
- **crearGrado()** → `:Collaboration CrearGrado`
- **editarGrado()** → `:Collaboration EditarGrado`
- **eliminarGrado()** → `:Collaboration EliminarGrado`
- **importarGrados()** → `:Collaboration ImportarGrados`

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Presentar lista de grados|`AbrirGradosView`|Coordina con `GradosController.listarGrados()`|
|Permitir filtrado de lista|`AbrirGradosView`|Invoca `GradosController.filtrarGrados(criterio)`|
|Acceso a datos de grados|`GradoRepository`|`obtenerTodos()`, `buscarPorCriterio()`|

**Código fuente:** [colaboracion.puml](../../../../modelosUML/01-analisis/casos-uso/abrirGrados/colaboracion.puml)

## referencias

- [Especificación detallada: abrirGrados()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/abrirGrados/abrirGrados.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
