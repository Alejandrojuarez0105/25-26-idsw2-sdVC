<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/editarAlumno/editarAlumno.md)|**Análisis**|[Diseño](/RUP/02-diseño/casos-uso/0-Administrador/editarAlumno/README.md)|[Desarrollo](/RUP/03-desarrollo/casos-uso/0-Administrador/editarAlumno/README.md)|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > editarAlumno > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.0
- **Fecha**: 25/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `editarAlumno()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para cumplir con los requisitos de modificación de un registro de alumno existente.

## diagrama de colaboración

<div align=center>

|![Análisis: editarAlumno()](/images/01-analisis/casos-uso/0-Administrador/editarAlumno/editarAlumno-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### EditarAlumnoView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar los datos actuales del alumno para su edición.
- Capturar los nuevos datos ingresados por el administrador (NIA, nombre, apellidos, correo).
- Comunicar el éxito o error de la actualización.
- Manejar la navegación de retorno (finalizar edición o cancelar).

**Colaboraciones**:
- **Entrada**: Recibe `editarAlumno(alumnoId)` desde `:Alumnos Abierto` o `:Alumno Abierta`.
- **Control**: Se comunica con `AlumnoController`.
- **Salida**: Navega a `:Alumno Abierta` o `:Alumnos Abierto`.

### clases de control

#### AlumnoController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar el flujo de edición.
- Recuperar la entidad original mediante `AlumnoRepository`.
- Validar la unicidad del NIA modificado.
- Aplicar las actualizaciones y solicitar la persistencia.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `EditarAlumnoView`.
- **Repositorio**: Colabora con `AlumnoRepository` y `GradoRepository`.

### clases de entidad (entity)

#### GradoRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Recuperar todos los grados disponibles para edición del alumno.

#### Grado
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar un grado académico del sistema.

#### AlumnoRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Recuperar un alumno por su identificador.
- Verificar si un NIA ya existe para otro alumno.
- Ejecutar la persistencia de las modificaciones.

#### Alumno
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar el alumno que está siendo modificado.

## flujo de colaboración

### secuencia de operaciones

1. **Solicitud**: `:Alumnos Abierto` → `EditarAlumnoView.editarAlumno(alumnoId)`
2. **Obtención**: `EditarAlumnoView` → `AlumnoController.solicitarEdicion(alumnoId)` → `AlumnoRepository.buscarPorId(alumnoId)`
3. **Carga de grados**: `EditarAlumnoView` → `AlumnoController.obtenerGrados() : Lista<Grado>`
4. **Consulta de grados**: `AlumnoController` → `GradoRepository.obtenerTodos() : Lista<Grado>`
5. **Actualización**: `EditarAlumnoView` → `AlumnoController.actualizar(alumnoId, nie, nombre, apellidos, correo, curso, grado)`
6. **Validación**: `AlumnoController` → `AlumnoRepository.existeNIA(nie)`
7. **Persistencia**: `AlumnoController` → `AlumnoRepository.actualizar(alumno)`
8. **Actualización entidad**: `AlumnoController` → `Alumno (<<update>>)`

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Mostrar datos actuales|`AlumnoController`|`solicitarEdicion(alumnoId)`|
|Actualizar datos|`AlumnoController`|`actualizar(alumnoId, nie, nombre, apellidos, correo, curso, grado)`|
|Validar unicidad|`AlumnoRepository`|`existeNIA(nia)`|
|Persistir cambios|`AlumnoRepository`|`actualizar(alumno)`|

**Código fuente:** [colaboracion.puml](../../../../../modelosUML/01-analisis/casos-uso/0-Administrador/editarAlumno/colaboracion.puml)

## referencias

- [Especificación detallada: editarAlumno()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/editarAlumno/editarAlumno.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
