<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/importarProfesores/importarProfesores.md)|**Análisis**|[Diseño](/RUP/02-diseño/casos-uso/0-Administrador/importarProfesores/README.md)|[Desarrollo](/RUP/03-desarrollo/casos-uso/0-Administrador/importarProfesores/README.md)|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > importarProfesores > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.0
- **Fecha**: 30/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `importarProfesores()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para realizar la carga masiva de profesores al sistema desde una fuente externa.

## diagrama de colaboración

<div align=center>

|![Análisis: importarProfesores()](/images/01-analisis/casos-uso/0-Administrador/importarProfesores/importarProfesores-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### ImportarProfesoresView
**Estereotipo**: Vista (Boundary)
**Responsabilidades**:
- Proporcionar la interfaz para la selección y carga de archivos de importación.
- Presentar el resultado del proceso de importación (`ImportResult`).
- Interactuar con el controlador para iniciar el procesamiento del archivo.
- Manejar la navegación de retorno o cancelación de la importación.

**Colaboraciones**:
- **Entrada**: Recibe `importarProfesores()` desde `:Profesores Abierto`.
- **Control**: Se comunica con `ProfesorController`.
- **Salida**: Navega de vuelta a `:Profesores Abierto`.

### clases de control

#### ProfesorController
**Estereotipo**: Control
**Responsabilidades**:
- Orquestar el flujo de importación masiva.
- Proporcionar la estructura/formato requerido para la importación.
- Coordinar la validación y persistencia masiva a través del repositorio.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `ImportarProfesoresView`.
- **Repositorio**: Delega la persistencia a `ProfesorRepository`.

### tipo conceptual: ImportResult

**ImportResult** es un objeto de resultado conceptual utilizado en el caso de uso para representar el estado de la operación de importación (éxito, errores y detalles del proceso).

### clases de entidad (entity)

#### ProfesorRepository
**Estereotipo**: Entidad
**Responsabilidades**:
- Proporcionar métodos para la inserción masiva (`guardarLote`).

**Colaboraciones**:
- **Control**: Responde a `ProfesorController`.
- **Entidad**: Gestiona e interactúa con `Profesor`.

#### Profesor
**Estereotipo**: Entidad
**Responsabilidades**:
- Representar la información de un profesor individual a importar.

**Colaboraciones**:
- **Repositorio**: Es gestionado por `ProfesorRepository`.

## flujo de colaboración

### secuencia de operaciones

1. **Solicitud**: `:Profesores Abierto` → `ImportarProfesoresView.importarProfesores()`
2. **Obtención formato**: `ImportarProfesoresView` → `ProfesorController.obtenerFormatoRequerido()`
3. **Importación**: `ImportarProfesoresView` → `ProfesorController.importar(archivo) : ImportResult`
4. **Persistencia**: `ProfesorController` → `ProfesorRepository.guardarLote(profesores)`
5. **Resultado**: `ImportarProfesoresView` → `:Profesores Abierto.mostrarResultado(importResult)` (finalizar o cancelar)

## correspondencia con requisitos

### mapeado con especificación conceptual

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Selección de archivo externo|`ImportarProfesoresView`|Interfaz de carga de archivos|
|Procesamiento masivo de datos|`ProfesorController`|`importar(archivo)`|
|Obtención de formato requerido|`ProfesorController`|`obtenerFormatoRequerido()`|
|Persistencia en lote|`ProfesorRepository`|`guardarLote(profesores)`|

### patrón de colaboración establecido

Este análisis mantiene la consistencia con el patrón de "gestión de entidades":
- **Reutilización de Repositorios**: Se utiliza el `ProfesorRepository` ya identificado en `abrirProfesores()`.
- **MVC puro**: El controlador de profesor se especializa en la lógica de carga masiva.
- **Trazabilidad**: Enlace directo con la vista de gestión principal.

## características del análisis

### responsabilidades identificadas
- **ImportarProfesoresView**: Gestión de la interacción de carga y feedback de resultados.
- **ProfesorController**: Orquestación del flujo de importación.
- **ProfesorRepository**: Capa de persistencia optimizada para carga masiva.

## conexión con disciplina rup

### desde requisitos
- **Modelo del dominio**: Define la estructura de datos que debe cumplir la importación.
- **Diagrama de contexto**: Establece a `importarProfesores()` como una operación del Administrador.

### hacia diseño
- **Estrategia de persistencia**: Sugiere la necesidad de inserciones masivas.

**Código fuente:** [colaboracion.puml](../../../../../modelosUML/01-analisis/casos-uso/0-Administrador/importarProfesores/colaboracion.puml)

## referencias

- [Especificación detallada: importarProfesores()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/importarProfesores/importarProfesores.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
