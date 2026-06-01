<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/eliminarProfesor/eliminarProfesor.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > eliminarProfesor > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.0
- **Fecha**: 30/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `eliminarProfesor()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para cumplir con los requisitos de eliminación de un registro de profesor.

## diagrama de colaboración

<div align=center>

|![Análisis: eliminarProfesor()](/images/01-analisis/casos-uso/0-Administrador/eliminarProfesor/eliminarProfesor-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### EliminarProfesorView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar la confirmación para la eliminación de un profesor específico.
- Capturar la confirmación del administrador.
- Mostrar advertencias en caso de dependencias existentes (asignaturas impartidas o exámenes supervisados).
- Manejar la navegación de regreso a la vista de gestión.

**Colaboraciones**:
- **Entrada**: Recibe `eliminarProfesor(profesorId)` desde `:Profesores Abierto`.
- **Control**: Se comunica con `ProfesorController`.
- **Salida**: Navega de regreso a `:Profesores Abierto`.

### clases de control

#### ProfesorController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar la lógica de eliminación.
- Validar dependencias (verificar si el profesor tiene asignaturas asociadas mediante `AsignaturaRepository` o exámenes mediante `ExamenRepository`).
- Notificar a la vista sobre advertencias de dependencias.
- Solicitar la eliminación al repositorio.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `EliminarProfesorView` y notifica advertencias.
- **Repositorio**: Colabora con `AsignaturaRepository` y `ExamenRepository` para validaciones, y con `ProfesorRepository` para la eliminación.

### clases de entity (entity)

#### ProfesorRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Ejecutar la eliminación física o lógica del registro.

#### Profesor
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar al profesor a eliminar.

#### AsignaturaRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Proporcionar información sobre dependencias (asignaturas) para validación.

#### ExamenRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Proporcionar información sobre dependencias (exámenes) para validación.

## flujo de colaboración

### secuencia de operaciones

1. **Solicitud**: `:Profesores Abierto` → `EliminarProfesorView.eliminarProfesor(profesorId)`
2. **Confirmación**: `EliminarProfesorView` → `ProfesorController.confirmarEliminacion(profesorId)`
3. **Validación de Asignaturas**: `ProfesorController` → `AsignaturaRepository.contarPorProfesor(profesorId)`
4. **Validación de Exámenes**: `ProfesorController` → `ExamenRepository.contarPorProfesor(profesorId)`
5. **Advertencia (si aplica)**: `ProfesorController` → `EliminarProfesorView.mostrarAdvertencia()`
6. **Borrado**: `ProfesorController` → `ProfesorRepository.eliminar(profesorId)`
7. **Retorno**: `EliminarProfesorView` → `:Profesores Abierto` (finalizar o cancelar)

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Confirmar eliminación|`EliminarProfesorView`|Captura acción de usuario|
|Validar dependencias|`AsignaturaRepository`, `ExamenRepository`|`contarPorProfesor(profesorId)`|
|Notificar riesgos|`ProfesorController`|`mostrarAdvertencia()`|
|Ejecutar eliminación|`ProfesorRepository`|`eliminar(profesorId)`|

**Código fuente:** [colaboracion.puml](../../../../../modelosUML/01-analisis/casos-uso/0-Administrador/eliminarProfesor/colaboracion.puml)

## referencias

- [Especificación detallada: eliminarProfesor()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/eliminarProfesor/eliminarProfesor.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
