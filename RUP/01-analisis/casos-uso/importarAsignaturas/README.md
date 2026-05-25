<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/importarAsignaturas/importarAsignaturas.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > importarAsignaturas > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.0
- **Fecha**: 25/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `importarAsignaturas()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para cumplir con los requisitos de importación masiva de asignaturas desde un archivo.

## diagrama de colaboración

<div align=center>

|![Análisis: importarAsignaturas()](/images/01-analisis/casos-uso/importarAsignaturas/importarAsignaturas-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### ImportarAsignaturasView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar la interfaz de importación y obtener el formato requerido.
- Capturar el archivo seleccionado por el administrador.
- Mostrar los resultados de la importación (éxito/error).
- Manejar la navegación de retorno a la vista de gestión.

**Colaboraciones**:
- **Entrada**: Recibe `importarAsignaturas()` desde `:Asignaturas Abierto`.
- **Control**: Se comunica con `AsignaturaController`.
- **Salida**: Navega de regreso a `:Asignaturas Abierto`.

### clases de control

#### AsignaturaController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar el flujo de importación masiva.
- Proporcionar la estructura/formato requerido para la importación.
- Solicitar el procesamiento y guardado de las asignaturas al repositorio.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `ImportarAsignaturasView`.
- **Repositorio**: Delega la persistencia masiva a `AsignaturaRepository`.

### clases de entidad (entity)

#### AsignaturaRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Procesar y persistir el lote de asignaturas importadas.

#### Asignatura
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar las asignaturas individuales procesadas.

## flujo de colaboración

### secuencia de operaciones

1. **Solicitud**: `:Asignaturas Abierto` → `ImportarAsignaturasView.importarAsignaturas()`
2. **Obtención formato**: `ImportarAsignaturasView` → `AsignaturaController.obtenerFormatoRequerido()`
3. **Importación**: `ImportarAsignaturasView` → `AsignaturaController.importar(archivo)`
4. **Persistencia**: `AsignaturaController` → `AsignaturaRepository.guardarLote(asignaturas)`
5. **Resultado**: `ImportarAsignaturasView` → `:Asignaturas Abierto` (mostrar resultado o cancelar)

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Seleccionar archivo|`ImportarAsignaturasView`|Interfaz de usuario|
|Procesar datos|`AsignaturasController`|`importar(archivo)`|
|Persistir datos masivos|`AsignaturaRepository`|`procesarImportacion(datos)`|

**Código fuente:** [colaboracion.puml](../../../../modelosUML/01-analisis/casos-uso/importarAsignaturas/colaboracion.puml)

## referencias

- [Especificación detallada: importarAsignaturas()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/importarAsignaturas/importarAsignaturas.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
