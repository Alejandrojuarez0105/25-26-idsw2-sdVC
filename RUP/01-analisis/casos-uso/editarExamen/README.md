<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/editarExamen/editarExamen.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > editarExamen > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.0
- **Fecha**: 25/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `editarExamen()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para cumplir con los requisitos de modificación de un examen existente.

## diagrama de colaboración

<div align=center>

|![Análisis: editarExamen()](/images/01-analisis/casos-uso/editarExamen/editarExamen-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### EditarExamenView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar el formulario de edición con los datos actuales del examen.
- Capturar las modificaciones realizadas por el administrador.
- Mostrar mensajes de validación y confirmación.
- Manejar la navegación tras guardar o cancelar.

**Colaboraciones**:
- **Entrada**: Recibe `editarExamen()` desde `:Examenes Abierto` o `:Examen Abierto`.
- **Control**: Se comunica con `ExamenController`.
- **Salida**: Navega a `:Examen Abierto` tras editar o a `:Examenes Abierto` tras finalizar/cancelar.

### clases de control

#### ExamenController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar el flujo de edición.
- Recuperar los datos actuales del examen para la vista.
- Validar los nuevos datos ingresados.
- Solicitar la actualización al repositorio.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `EditarExamenView`.
- **Repositorio**: Delega la búsqueda y persistencia a `ExamenRepository`.

### clases de entidad (entity)

#### ExamenRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Recuperar un examen por su identificador.
- Ejecutar la actualización de los datos del examen en la persistencia.

#### Examen
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar el examen cuyos datos están siendo modificados.

## flujo de colaboración

### secuencia de operaciones

1. **Solicitud**: `:Examenes Abierto` / `:Examen Abierto` → `EditarExamenView.editarExamen()`
2. **Carga**: `EditarExamenView` → `ExamenController.solicitarEdicion(examenId)`
3. **Búsqueda**: `ExamenController` → `ExamenRepository.buscarPorId(examenId)`
4. **Modificación**: `EditarExamenView` → `ExamenController.actualizar(examenId, codigo, fechaHora, duracion, asignatura, aula)`
5. **Validación**: `ExamenController` → `ExamenRepository.existeCodigo(codigo)`
6. **Actualización**: `ExamenController` → `ExamenRepository.actualizar(examen)`
7. **Actualización de entidad**: `ExamenController` → `Examen`
8. **Retorno**: 
   - Finalizar: `EditarExamenView` → `:Examenes Abierto` o `:Examen Abierto`
   - Cancelar: `EditarExamenView` → `:Examenes Abierto`

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Presentar datos actuales|`ExamenController`|`solicitarEdicion(examenId)`|
|Capturar modificaciones|`EditarExamenView`|Formulario de edición|
|Validar y actualizar|`ExamenController`|`actualizar(examen)`|
|Persistir cambios|`ExamenRepository`|`actualizar(examen)`|

**Código fuente:** [colaboracion.puml](../../../../modelosUML/01-analisis/casos-uso/editarExamen/colaboracion.puml)

## referencias

- [Especificación detallada: editarExamen()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/editarExamen/editarExamen.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
