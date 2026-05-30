<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/asignarProfesorAExamen/asignarProfesorAExamen.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > asignarProfesorAExamen > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.1
- **Fecha**: 30/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `asignarProfesorAExamen()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para vincular a un profesor con un examen específico en calidad de supervisor, garantizando su disponibilidad.

## diagrama de colaboración

<div align=center>

|![Análisis: asignarProfesorAExamen()](/images/01-analisis/casos-uso/asignarProfesorAExamen/asignarProfesorAExamen-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### AsignarProfesorView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar la lista de exámenes disponibles para asignación.
- Capturar la selección del profesor (`profesorId`) y del examen (`examenId`).
- Comunicar el éxito o error de la vinculación.
- Manejar la navegación de regreso a la edición del profesor o al listado de asignaciones.

**Colaboraciones**:
- **Entrada**: Recibe `asignarProfesorAExamen()` desde `:Profesor Abierto`.
- **Control**: Se comunica con `AsignacionesController`.
- **Salida**: Navega a `:Profesor Examenes Abierto` (confirmar/cancelar) o `:Profesor Abierto` (editarProfesor).

### clases de control

#### AsignacionesController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar la lógica de vinculación entre profesores y exámenes.
- Recuperar la lista de exámenes sin profesor asignado.
- Validar la viabilidad de la asignación mediante `verificarDisponibilidad()`.
- Solicitar la actualización del vínculo al repositorio.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `AsignarProfesorView`.
- **Repositorio**: Colabora con `ExamenRepository` y `ProfesorRepository`.

### clases de entidad (entity)

#### ExamenRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Proporcionar métodos de consulta especializada (`obtenerTodosSinProfesor`).
- Ejecutar la actualización del supervisor asignado al examen (`asignarProfesor`).

**Colaboraciones**:
- **Control**: Responde a `AsignacionesController`.
- **Entidad**: Gestiona e interactúa con `Examen`.

#### ProfesorRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Proporcionar acceso a los datos del profesor consultado.

**Colaboraciones**:
- **Control**: Responde a `AsignacionesController`.
- **Entidad**: Gestiona e interactúa con `Profesor`.

#### Examen
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar el examen que recibe la asignación.

#### Profesor
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar al profesor que actúa como supervisor.

## flujo de colaboración

### secuencia de operaciones

1. **Solicitud**: `:Profesor Abierto` → `AsignarProfesorView.asignarProfesorAExamen()`
2. **Listado de Exámenes**: `AsignarProfesorView` → `AsignacionesController.listarExamenesDisponibles()` → `ExamenRepository.obtenerTodosSinProfesor()`
3. **Selección de Profesor**: `AsignarProfesorView` → `AsignacionesController.seleccionarProfesor(profesorId)` → `ProfesorRepository.buscarPorId(profesorId)`
4. **Asignación**: `AsignarProfesorView` → `AsignacionesController.asignar(profesorId, examenId)`
5. **Validación**: `AsignacionesController` ejecuta `verificarDisponibilidad()` consultando `ExamenRepository.obtenerTodos()`
6. **Persistencia**: `AsignacionesController` → `ExamenRepository.asignarProfesor(profesorId, examenId)`
7. **Retorno**: 
   - Confirmar: `AsignarProfesorView` → `:Profesor Examenes Abierto` (actualizarAsignaciones)
   - Cancelar: `AsignarProfesorView` → `:Profesor Examenes Abierto`
   - Volver: `AsignarProfesorView` → `:Profesor Abierto` (editarProfesor)

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Filtrar exámenes sin supervisor|`ExamenRepository`|`obtenerTodosSinProfesor()`|
|Verificar solapamientos|`AsignacionesController`|`verificarDisponibilidad()`|
|Vincular profesor|`AsignacionesController`|`asignar(profesorId, examenId)`|
|Persistir asignación|`ExamenRepository`|`asignarProfesor(profesorId, examenId)`|

**Código fuente:** [colaboracion.puml](../../../../modelosUML/01-analisis/casos-uso/asignarProfesorAExamen/colaboracion.puml)

## referencias

- [Especificación detallada: asignarProfesorAExamen()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/asignarProfesorAExamen/asignarProfesorAExamen.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
