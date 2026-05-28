<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/importarGrados/importarGrados.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > importarGrados > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.1
- **Fecha**: 28/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `importarGrados()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para realizar la carga masiva de grados académicos al sistema desde una fuente externa.

## diagrama de colaboración

<div align=center>

|![Análisis: importarGrados()](/images/01-analisis/casos-uso/importarGrados/importarGrados-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### ImportarGradosView
**Estereotipo**: Vista (Boundary)
**Responsabilidades**:
- Proporcionar la interfaz para la selección y carga de archivos de importación.
- Presentar el resultado del proceso de importación (`ImportResult`).
- Interactuar con el controlador para iniciar el procesamiento del archivo.
- Manejar la navegación de retorno o cancelación de la importación.

**Colaboraciones**:
- **Entrada**: Recibe `importarGrados()` desde `:Grados Abierto`.
- **Control**: Se comunica con `GradoController`.
- **Salida**: Navega de vuelta a `:Grados Abierto`.

### clases de control

#### GradoController
**Estereotipo**: Control
**Responsabilidades**:
- Orquestar el flujo de importación masiva.
- Proporcionar la estructura/formato requerido para la importación.
- Coordinar la validación y persistencia masiva a través del repositorio.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `ImportarGradosView`.
- **Repositorio**: Delega la persistencia a `GradoRepository`.

### tipo conceptual: ImportResult

**ImportResult** es un objeto de resultado conceptual utilizado en el caso de uso para representar el estado de la operación de importación (éxito, errores y detalles del proceso).

### clases de entidad (entity)

#### GradoRepository
**Estereotipo**: Entidad
**Responsabilidades**:
- Proporcionar métodos para la inserción masiva (`guardarLote`).

**Colaboraciones**:
- **Control**: Responde a `GradoController`.
- **Entidad**: Gestiona e interactúa con `Grado`.

#### Grado
**Estereotipo**: Entidad
**Responsabilidades**:
- Representar la información de un grado individual a importar.

**Colaboraciones**:
- **Repositorio**: Es gestionado por `GradoRepository`.

## flujo de colaboración

### secuencia de operaciones

1. **Solicitud**: `:Grados Abierto` → `ImportarGradosView.importarGrados()`
2. **Obtención formato**: `ImportarGradosView` → `GradoController.obtenerFormatoRequerido()`
3. **Importación**: `ImportarGradosView` → `GradoController.importar(archivo) : ImportResult`
4. **Persistencia**: `GradoController` → `GradoRepository.guardarLote(grados)`
5. **Resultado**: `ImportarGradosView` → `:Grados Abierto.mostrarResultado(importResult)` (finalizar o cancelar)

## correspondencia con requisitos

### mapeado con especificación conceptual

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Selección de archivo externo|`ImportarGradosView`|Interfaz de carga de archivos|
|Procesamiento masivo de datos|`GradoController`|`importar(archivo)`|
|Obtención de formato requerido|`GradoController`|`obtenerFormatoRequerido()`|
|Persistencia en lote|`GradoRepository`|`guardarLote(grados)`|

### patrón de colaboración establecido

Este análisis mantiene la consistencia con el patrón de "gestión de entidades":
- **Reutilización de Repositorios**: Se utiliza el `GradoRepository` ya identificado en `abrirGrados()`.
- **MVC puro**: El controlador de grado se especializa en la lógica de carga masiva.
- **Trazabilidad**: Enlace directo con la vista de gestión principal.

## características del análisis

### responsabilidades identificadas
- **ImportarGradosView**: Gestión de la interacción de carga y feedback de resultados.
- **GradoController**: Orquestación del flujo de importación.
- **GradoRepository**: Capa de persistencia optimizada para carga masiva.

## conexión con disciplina rup

### desde requisitos
- **Modelo del dominio**: Define la estructura de datos que debe cumplir la importación.
- **Diagrama de contexto**: Establece a `importarGrados()` como una operación del Administrador.

### hacia diseño
- **Estrategia de persistencia**: Sugiere la necesidad de inserciones masivas.

**Código fuente:** [colaboracion.puml](../../../../modelosUML/01-analisis/casos-uso/importarGrados/colaboracion.puml)

## referencias

- [Especificación detallada: importarGrados()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/importarGrados/importarGrados.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
