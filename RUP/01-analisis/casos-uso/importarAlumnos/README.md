<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/importarAlumnos/importarAlumnos.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > importarAlumnos > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.0
- **Fecha**: 25/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `importarAlumnos()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para realizar la carga masiva de alumnos al sistema desde una fuente externa.

## diagrama de colaboración

<div align=center>

|![Análisis: importarAlumnos()](/images/01-analisis/casos-uso/importarAlumnos/importarAlumnos-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### ImportarAlumnosView
**Estereotipo**: Vista (Boundary)
**Responsabilidades**:
- Proporcionar la interfaz para la selección y carga de archivos de importación.
- Presentar el estado del proceso de importación (progreso, errores, éxito).
- Interactuar con el controlador para iniciar el procesamiento del archivo.
- Manejar la navegación de retorno a la gestión de alumnos.

**Colaboraciones**:
- **Entrada**: Recibe `importarAlumnos()` desde `:Alumnos Abierto`.
- **Control**: Se comunica con `AlumnoController`.
- **Salida**: Navega de vuelta a `:Alumnos Abierto`.

### clases de control

#### AlumnoController
**Estereotipo**: Control
**Responsabilidades**:
- Orquestar el flujo de importación masiva.
- Delegar el procesamiento y parseo del archivo.
- Coordinar la validación de los datos importados frente a las reglas de negocio.
- Gestionar la persistencia masiva a través del repositorio.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `ImportarAlumnosView`.
- **Repositorio**: Delega la persistencia a `AlumnoRepository`.

### tipo conceptual: ImportResult

**ImportResult** es un objeto de resultado conceptual utilizado en el caso de uso para representar el estado de la operación de importación (éxito, errores y detalles del proceso). No se considera una clase de dominio persistente.

### clases de entidad (entity)

#### AlumnoRepository
**Estereotipo**: Entidad
**Responsabilidades**:
- Abstraer el acceso a datos de los alumnos.
- Proporcionar métodos para la inserción masiva (guardado por lotes).

**Colaboraciones**:
- **Control**: Responde a `AlumnoController`.
- **Entidad**: Gestiona instancias de `Alumno`.

#### Alumno
**Estereotipo**: Entidad
**Responsabilidades**:
- Representar la información de un alumno individual a importar.
- Encapsular los datos del dominio (NIA, nombre, correo, etc.).

**Colaboraciones**:
- **Repositorio**: Es gestionado por `AlumnoRepository`.

## flujo de colaboración

### secuencia de operaciones

1. **Solicitud**: `:Alumnos Abierto` → `ImportarAlumnosView.importarAlumnos()`
2. **Obtención formato**: `ImportarAlumnosView` → `AlumnoController.obtenerFormatoRequerido()`
3. **Importación**: `ImportarAlumnosView` → `AlumnoController.importar(archivo) : ImportResult`
4. **Persistencia**: `AlumnoController` → `AlumnoRepository.guardarLote(alumnos)`
5. **Resultado**: `ImportarAlumnosView` → `:Alumnos Abierto.mostrarResultado(importResult)` (mostrar resultado o cancelar)

## correspondencia con requisitos

### mapeado con especificación conceptual

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Selección de archivo externo|`ImportarAlumnosView`|Interfaz de carga de archivos|
|Procesamiento masivo de datos|`AlumnoController`|`importar(archivo)`|
|Obtención de formato requerido|`AlumnoController`|`obtenerFormatoRequerido()`|
|Persistencia en lote|`AlumnoRepository`|`guardarLote(alumnos)`|

### patrón de colaboración establecido

Este análisis mantiene la consistencia con el patrón de "gestión de entidades":
- **Reutilización de Repositorios**: Se utiliza el `AlumnoRepository` ya identificado en `abrirAlumnos()`.
- **MVC puro**: El controlador de alumnos se especializa en la lógica de carga masiva.
- **Trazabilidad**: Enlace directo con la vista de gestión principal.

## características del análisis

### responsabilidades identificadas
- **ImportarAlumnosView**: Gestión de la interacción de carga y feedback de resultados.
- **AlumnoController**: Orquestación del flujo de importación.
- **AlumnoRepository**: Capa de persistencia optimizada para carga masiva.

## conexión con disciplina rup

### desde requisitos
- **Modelo del dominio**: Define la estructura de datos que debe cumplir la importación.
- **Diagrama de contexto**: Establece a `importarAlumnos()` como una operación del Administrador.

### hacia diseño
- **Estrategia de persistencia**: Sugiere la necesidad de inserciones masivas.

**Código fuente:** [colaboracion.puml](../../../../modelosUML/01-analisis/casos-uso/importarAlumnos/colaboracion.puml)

## referencias

- [abrirAlumnos() - Análisis de referencia](/RUP/01-analisis/casos-uso/abrirAlumnos/README.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
