<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/importarAulas/importarAulas.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > importarAulas > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.1
- **Fecha**: 28/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `importarAulas()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para realizar la carga masiva de aulas al sistema desde una fuente externa.

## diagrama de colaboración

<div align=center>

|![Análisis: importarAulas()](/images/01-analisis/casos-uso/0-Administrador/importarAulas/importarAulas-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### ImportarAulasView
**Estereotipo**: Vista (Boundary)
**Responsabilidades**:
- Proporcionar la interfaz para la selección y carga de archivos de importación.
- Presentar el resultado del proceso de importación (`ImportResult`).
- Interactuar con el controlador para iniciar el procesamiento del archivo.
- Manejar la navegación de retorno o cancelación de la importación.

**Colaboraciones**:
- **Entrada**: Recibe `importarAulas()` desde `:Aulas Abierto`.
- **Control**: Se comunica con `AulaController`.
- **Salida**: Navega de vuelta a `:Aulas Abierto`.

### clases de control

#### AulaController
**Estereotipo**: Control
**Responsabilidades**:
- Orquestar el flujo de importación masiva.
- Proporcionar la estructura/formato requerido para la importación.
- Coordinar la validación y persistencia masiva a través del repositorio.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `ImportarAulasView`.
- **Repositorio**: Delega la persistencia a `AulaRepository`.

### tipo conceptual: ImportResult

**ImportResult** es un objeto de resultado conceptual utilizado en el caso de uso para representar el estado de la operación de importación (éxito, errores y detalles del proceso).

### clases de entidad (entity)

#### AulaRepository
**Estereotipo**: Entidad
**Responsabilidades**:
- Proporcionar métodos para la inserción masiva (`guardarLote`).

**Colaboraciones**:
- **Control**: Responde a `AulaController`.
- **Entidad**: Gestiona e interactúa con `Aula`.

#### Aula
**Estereotipo**: Entidad
**Responsabilidades**:
- Representar la información de un aula individual.

**Colaboraciones**:
- **Repositorio**: Es gestionado por `AulaRepository`.

## flujo de colaboración

### secuencia de operaciones

1. **Solicitud**: `:Aulas Abierto` → `ImportarAulasView.importarAulas()`
2. **Obtención formato**: `ImportarAulasView` → `AulaController.obtenerFormatoRequerido()`
3. **Importación**: `ImportarAulasView` → `AulaController.importar(archivo) : ImportResult`
4. **Persistencia**: `AulaController` → `AulaRepository.guardarLote(aulas)`
5. **Resultado**: `ImportarAulasView` → `:Aulas Abierto.mostrarResultado(importResult)` (finalizar o cancelar)

## correspondencia con requisitos

### mapeado con especificación conceptual

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Selección de archivo externo|`ImportarAulasView`|Interfaz de carga de archivos|
|Procesamiento masivo de datos|`AulaController`|`importar(archivo)`|
|Obtención de formato requerido|`AulaController`|`obtenerFormatoRequerido()`|
|Persistencia en lote|`AulaRepository`|`guardarLote(aulas)`|

### patrón de colaboración establecido

Este análisis mantiene la consistencia con el patrón de "gestión de entidades":
- **Reutilización de Repositorios**: Se utiliza el `AulaRepository` ya identificado en `abrirAulas()`.
- **MVC puro**: El controlador de aula se especializa en la lógica de carga masiva.
- **Trazabilidad**: Enlace directo con la vista de gestión principal.

## características del análisis

### responsabilidades identificadas
- **ImportarAulasView**: Gestión de la interacción de carga y feedback de resultados.
- **AulaController**: Orquestación del flujo de importación.
- **AulaRepository**: Capa de persistencia optimizada para carga masiva.

## conexión con disciplina rup

### desde requisitos
- **Modelo del dominio**: Define la estructura de datos que debe cumplir la importación.
- **Diagrama de contexto**: Establece a `importarAulas()` como una operación del Administrador.

### hacia diseño
- **Estrategia de persistencia**: Sugiere la necesidad de inserciones masivas.

**Código fuente:** [colaboracion.puml](../../../../../modelosUML/01-analisis/casos-uso/0-Administrador/importarAulas/colaboracion.puml)

## referencias

- [Especificación detallada: importarAulas()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/importarAulas/importarAulas.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
