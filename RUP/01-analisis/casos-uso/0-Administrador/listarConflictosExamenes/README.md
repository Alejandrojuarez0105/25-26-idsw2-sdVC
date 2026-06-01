<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/listarConflictosExamenes/listarConflictosExamenes.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > listarConflictosExamenes > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.1
- **Fecha**: 30/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `listarConflictosExamenes()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para detectar, presentar y resolver solapamientos horarios o de disponibilidad de un profesor.

## diagrama de colaboración

<div align=center>

|![Análisis: listarConflictosExamenes()](/images/01-analisis/casos-uso/0-Administrador/listarConflictosExamenes/listarConflictosExamenes-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### ListarConflictosView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Recibir la solicitud de visualización de conflictos de un profesor (`profesorId`).
- Presentar la lista de solapamientos detectados al administrador.
- Capturar acciones de resolución de conflictos.
- Manejar la navegación de regreso a la edición del profesor o a preferencias.

**Colaboraciones**:
- **Entrada**: Recibe `listarConflictosExamenes(profesorId)` desde `:Profesor Abierto`.
- **Control**: Se comunica con `ConflictosController`.
- **Salida**: Navega a `:Profesor Preferencias Abierto` (finalizar) o `:Profesor Abierto` (editarProfesor).

### clases de control

#### ConflictosController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar la detección de conflictos horarios.
- Recuperar los exámenes asociados al profesor mediante `ExamenRepository`.
- Aplicar la lógica de detección de solapamientos y resolución de los mismos.
- Actualizar el estado de los exámenes tras una resolución.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `ListarConflictosView`.
- **Repositorio**: Consulta y actualiza `ExamenRepository` y `ProfesorRepository`.

### clases de entidad (entity)

#### ProfesorRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Proporcionar datos del profesor y sus preferencias de disponibilidad.

**Colaboraciones**:
- **Control**: Responde a `ConflictosController`.
- **Entidad**: Gestiona e interactúa con `Profesor`.

#### ExamenRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Proporcionar la lista de exámenes programados del profesor.
- Actualizar datos de exámenes tras la resolución de conflictos.

**Colaboraciones**:
- **Control**: Responde a `ConflictosController`.

#### Profesor
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar al profesor consultado.

## flujo de colaboración

### secuencia de operaciones

1. **Inicio**: `:Profesor Abierto` → `ListarConflictosView.listarConflictosExamenes(profesorId)`
2. **Solicitud**: `ListarConflictosView` → `ConflictosController.obtenerConflictos(profesorId)`
3. **Carga de Datos**: 
   - `ConflictosController` → `ProfesorRepository.buscarPorId(profesorId)`
   - `ConflictosController` → `ExamenRepository.buscarPorProfesor(profesorId)`
4. **Detección**: `ConflictosController` aplica lógica interna `detectarSolapamientos(examenes)`
5. **Resolución (opcional)**: `ListarConflictosView` → `ConflictosController.resolverConflicto(conflictoId, cambios)`
6. **Persistencia**: `ConflictosController` → `ExamenRepository.actualizarExamen(examen)`
7. **Refresco**: `ConflictosController` re-ejecuta `detectarSolapamientos(examenes)`
8. **Retorno**: 
   - Finalizar: `ListarConflictosView` → `:Profesor Preferencias Abierto`
   - Volver: `ListarConflictosView` → `:Profesor Abierto` (editarProfesor)

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Detectar solapamientos|`ConflictosController`|`detectarSolapamientos(examenes)`|
|Consultar exámenes del profesor|`ExamenRepository`|`buscarPorProfesor(profesorId)`|
|Resolver conflictos|`ConflictosController`|`resolverConflicto(conflictoId, cambios)`|
|Actualizar examen|`ExamenRepository`|`actualizarExamen(examen)`|

**Código fuente:** [colaboracion.puml](../../../../../modelosUML/01-analisis/casos-uso/0-Administrador/listarConflictosExamenes/colaboracion.puml)

## referencias

- [Especificación detallada: listarConflictosExamenes()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/listarConflictosExamenes/listarConflictosExamenes.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
