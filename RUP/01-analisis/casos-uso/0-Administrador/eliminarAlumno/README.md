<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/eliminarAlumno/eliminarAlumno.md)|**Análisis**|[Diseño](/RUP/02-diseño/casos-uso/0-Administrador/eliminarAlumno/README.md)|[Desarrollo](/RUP/03-desarrollo/casos-uso/0-Administrador/eliminarAlumno/README.md)|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > eliminarAlumno > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.0
- **Fecha**: 25/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `eliminarAlumno()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para cumplir con los requisitos de eliminación de un registro de alumno.

## diagrama de colaboración

<div align=center>

|![Análisis: eliminarAlumno()](/images/01-analisis/casos-uso/0-Administrador/eliminarAlumno/eliminarAlumno-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### EliminarAlumnoView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar la confirmación para la eliminación de un alumno específico.
- Capturar la confirmación del administrador.
- Comunicar el éxito o error tras la operación.
- Manejar la navegación de regreso a la vista de alumnos abiertos.

**Colaboraciones**:
- **Entrada**: Recibe `eliminarAlumno(alumnoId)` desde `:Alumnos Abierto`.
- **Control**: Se comunica con `AlumnoController`.
- **Salida**: Navega de regreso a `:Alumnos Abierto` tras finalizar o cancelar.

### clases de control

#### AlumnoController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar la lógica de eliminación.
- Validar dependencias (ej. verificar si el alumno está inscrito en asignaturas o tiene exámenes presentados).
- Solicitar la eliminación al repositorio.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `EliminarAlumnoView`.
- **Repositorio**: Colabora con `AsignaturaRepository` / `ExamenRepository` para validaciones y con `AlumnoRepository` para la eliminación.

### clases de entidad (entity)

#### AlumnoRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Ejecutar la eliminación física o lógica del registro.

#### Alumno
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar al alumno a eliminar.

#### AsignaturaRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Proporcionar información sobre inscripciones del alumno para validación.

## flujo de colaboración

### secuencia de operaciones

1. **Solicitud**: `:Alumnos Abierto` → `EliminarAlumnoView.eliminarAlumno(alumnoId)`
2. **Confirmación**: `EliminarAlumnoView` → `AlumnoController.eliminarAlumno(alumnoId)`
3. **Validación**: `AlumnoController` → `AsignaturaRepository.contarInscripcionesPorAlumno(alumnoId)`
4. **Borrado**: `AlumnoController` → `AlumnoRepository.eliminar(alumnoId)`
5. **Retorno**: `EliminarAlumnoView` → `:Alumnos Abierto` (finalizar o cancelar)

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Confirmar eliminación|`EliminarAlumnoView`|Captura acción de usuario|
|Ejecutar eliminación|`AlumnoRepository`|`eliminar(alumnoId)`|

**Código fuente:** [colaboracion.puml](../../../../../modelosUML/01-analisis/casos-uso/0-Administrador/eliminarAlumno/colaboracion.puml)

## referencias

- [Especificación detallada: eliminarAlumno()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/eliminarAlumno/eliminarAlumno.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
