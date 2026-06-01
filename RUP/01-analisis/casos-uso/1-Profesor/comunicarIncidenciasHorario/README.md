<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/1-Profesor/DiagramaDeContextoProfesor.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/1-Profesor/comunicarIncidenciasHorario/comunicarIncidenciasHorario.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > comunicarIncidenciasHorario > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.1
- **Fecha**: 01/06/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `comunicarIncidenciasHorario()` para el actor **Profesor** mediante el patrón MVC. Identifica las clases y colaboraciones detalladas necesarias para seleccionar un examen, especificar el tipo de problema y registrar formalmente la incidencia.

## diagrama de colaboración

<div align=center>

|![Análisis: comunicarIncidenciasHorario()](/images/01-analisis/casos-uso/1-Profesor/comunicarIncidenciasHorario/comunicarIncidenciasHorario-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### ComunicarIncidenciasView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar la interfaz de gestión de incidencias.
- Capturar la selección de exámenes del listado.
- Mostrar datos detallados del examen seleccionado para confirmación visual.
- Capturar la clasificación (tipo) y descripción textual de la incidencia.
- Comunicar el éxito del registro (`mostrarIncidenciaRegistrada`).
- Manejar la navegación de retorno o cancelación.

**Colaboraciones**:
- **Entrada**: Recibe `comunicarIncidenciasHorario()` desde `:Sistema Disponible`.
- **Control**: Se comunica con `IncidenciasController`.
- **Salida**: Navega a `:Incidencias Abierto`.

### clases de control

#### IncidenciasController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar la recuperación de exámenes asignados y sus detalles.
- Orquestar la creación y persistencia de nuevas incidencias incluyendo su clasificación.
- Validar la integridad de los datos antes del registro.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de selección y registro de `ComunicarIncidenciasView`.
- **Repositorio**: Colabora con `ExamenRepository` e `IncidenciaRepository`.

### clases de entidad (entity)

#### IncidenciaRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Abstraer el almacenamiento de las incidencias reportadas.
- Ejecutar la persistencia de nuevos registros.

**Colaboraciones**:
- **Control**: Responde a `IncidenciasController`.
- **Entidad**: Gestiona e interactúa con `Incidencia`.

#### ExamenRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Proporcionar acceso a los exámenes asignados al profesor.
- Recuperar detalles específicos de un examen por ID.

**Colaboraciones**:
- **Control**: Responde a `IncidenciasController`.
- **Entidad**: Gestiona e interactúa con `Examen`.

#### Incidencia
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar la información de la incidencia (tipo, descripción, examen, timestamp).

#### Examen
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar el examen sobre el cual se reporta la incidencia.

## flujo de colaboración

### secuencia de operaciones

1. **Inicio**: `:Sistema Disponible` → `ComunicarIncidenciasView.comunicarIncidenciasHorario()`
2. **Carga**: `ComunicarIncidenciasView` → `IncidenciasController.obtenerExamenesAsignados()` → `ExamenRepository.buscarPorProfesorActivo()`
3. **Selección**: `ComunicarIncidenciasView` → `IncidenciasController.seleccionarExamen(examenId)`
4. **Detalles**: `IncidenciasController` → `ExamenRepository.buscarPorId(examenId)` → `ComunicarIncidenciasView.mostrarDatosExamen(examen)`
5. **Configuración**: 
   - `ComunicarIncidenciasView` → `IncidenciasController.seleccionarTipoIncidencia(tipo)`
   - `ComunicarIncidenciasView` → `IncidenciasController.introducirDescripcion(texto)`
6. **Registro**: `ComunicarIncidenciasView` → `IncidenciasController.registrarIncidencia(examenId, tipo, descripcion)`
7. **Persistencia**: 
   - `IncidenciasController` → `Incidencia` (`<<create>>`)
   - `IncidenciasController` → `IncidenciaRepository.guardar(incidencia)`
8. **Feedback**: `ComunicarIncidenciasView` → `:Incidencias Abierto.mostrarIncidenciaRegistrada()`
9. **Salida**: 
   - Finalizar: `:Incidencias Abierto` → `:Sistema Disponible` (completarComunicacion)
   - Cancelar: `:Incidencias Abierto` → `:Sistema Disponible` (cancelarComunicacion)

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Listar exámenes propios|`ExamenRepository`|`buscarPorProfesorActivo()`|
|Detallar examen seleccionado|`IncidenciasController`|`mostrarDatosExamen(examen)`|
|Clasificar incidencia|`IncidenciasController`|`registrarIncidencia(..., tipo, ...)`|
|Almacenar incidencia|`IncidenciaRepository`|`guardar(incidencia)`|

**Código fuente:** [colaboracion.puml](../../../../../modelosUML/01-analisis/casos-uso/1-Profesor/comunicarIncidenciasHorario/colaboracion.puml)

## referencias

- [Especificación detallada: comunicarIncidenciasHorario()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/1-Profesor/comunicarIncidenciasHorario/comunicarIncidenciasHorario.md)
- [Diagrama de contexto - Profesor](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/1-Profesor/DiagramaDeContextoProfesor.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
