|[🏠️](/RUP/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/README.md)|[📂 Diseño](/RUP/02-diseño/README.md)|**Desarrollo**|Pruebas|
|-|-|-|-|-|-|-|

# Implementación de Casos de Uso

Esta carpeta centraliza los informes técnicos de implementación para cada caso de uso del sistema **Davidario**, detallando la codificación real en el stack React + NestJS.

## Casos de uso desarrollados

### Actor Administrador

#### Gestión del sistema
- [iniciarSesion](0-Administrador/iniciarSesion/README.md) - Implementación del acceso seguro.
- [cerrarSesion](0-Administrador/cerrarSesion/README.md) - Implementación de la finalización de sesión.

#### Gestión de entidades
- [abrirGrados](0-Administrador/abrirGrados/README.md) - Implementación de la vista de listado de grados.
- [importarGrados](0-Administrador/importarGrados/README.md) - Implementación de la carga masiva de grados.
- [eliminarGrado](0-Administrador/eliminarGrado/README.md) - Implementación de la funcionalidad de borrado.
- [crearGrado](0-Administrador/crearGrado/README.md) - Implementación del registro de nuevos grados.
- [editarGrado](0-Administrador/editarGrado/README.md) - Implementación de la edición de grados existentes.
- [abrirAsignaturas](0-Administrador/abrirAsignaturas/README.md) - Implementación de la vista de listado de asignaturas.
- [importarAsignaturas](0-Administrador/importarAsignaturas/README.md) - Implementación de la carga masiva de materias.
- [eliminarAsignatura](0-Administrador/eliminarAsignatura/README.md) - Implementación de la funcionalidad de borrado seguro.
- [crearAsignatura](0-Administrador/crearAsignatura/README.md) - Implementación del registro de nuevas asignaturas.
- [editarAsignatura](0-Administrador/editarAsignatura/README.md) - Implementación de la edición de asignaturas existentes.

#### Gestión de Exámenes
- [abrirExamenes](0-Administrador/abrirExamenes/README.md) - Implementación de la vista de listado de exámenes.
- [eliminarExamen](0-Administrador/eliminarExamen/README.md) - Implementación de la funcionalidad de borrado seguro.
- [crearExamen](0-Administrador/crearExamen/README.md) - Implementación del registro de nuevos exámenes.
- [editarExamen](0-Administrador/editarExamen/README.md) - Implementación de la edición de exámenes existentes.

#### Gestión de Aulas
- [abrirAulas](0-Administrador/abrirAulas/README.md) - Implementación de la vista de listado de aulas.
- [importarAulas](0-Administrador/importarAulas/README.md) - Implementación de la carga masiva de aulas.
- [eliminarAula](0-Administrador/eliminarAula/README.md) - Implementación de la funcionalidad de borrado seguro.
- [crearAula](0-Administrador/crearAula/README.md) - Implementación del registro de nuevas aulas.
- [editarAula](0-Administrador/editarAula/README.md) - Implementación de la edición de aulas existentes.

#### Gestión de Alumnos
- [abrirAlumnos](0-Administrador/abrirAlumnos/README.md) - Implementación de la vista de listado de alumnos.
- [importarAlumnos](0-Administrador/importarAlumnos/README.md) - Implementación de la carga masiva de alumnos.
- [eliminarAlumno](0-Administrador/eliminarAlumno/README.md) - Implementación de la funcionalidad de borrado seguro.
- [crearAlumno](0-Administrador/crearAlumno/README.md) - Implementación del registro de nuevos alumnos.
- [editarAlumno](0-Administrador/editarAlumno/README.md) - Implementación de la edición de alumnos existentes.

#### Gestión de Profesores
- [abrirProfesores](0-Administrador/abrirProfesores/README.md) - Implementación de la vista de listado de profesores.
- [importarProfesores](0-Administrador/importarProfesores/README.md) - Implementación de la carga masiva de profesores.
- [eliminarProfesor](0-Administrador/eliminarProfesor/README.md) - Implementación de la funcionalidad de borrado seguro de profesores.
- [crearProfesor](0-Administrador/crearProfesor/README.md) - Implementación del registro de nuevos profesores.
- [editarProfesor](0-Administrador/editarProfesor/README.md) - Implementación de la edición de profesores existentes.
- [asignarProfesorAExamen](0-Administrador/asignarProfesorAExamen/README.md) - Implementación de la asignación de profesores a exámenes.
- [listarConflictosExamenes](0-Administrador/listarConflictosExamenes/README.md) - Implementación del listado de conflictos detectados en la planificación de exámenes.
- [refactorExamenes](0-Administrador/refactorExamenes/README.md) - Refactorización del modelo Examen con relaciones reales a Profesor y Aula.
- [actualizarConflictosExamenes](0-Administrador/actualizarConflictosExamenes/README.md) - Actualización de la lógica de conflictos basada en IDs y sincronización del dashboard.

#### Procesos del sistema
- [generarCalendario](0-Administrador/generarCalendario/README.md) - Implementación de la generación y visualización del calendario oficial de exámenes.

#### Consulta de información
- [consultarCalendario](0-Administrador/consultarCalendario/README.md) - Implementación de la consulta y visualización del calendario de exámenes.
- [descargarCalendarioExamenes](0-Administrador/descargarCalendarioExamenes/README.md) - Implementación de la descarga del calendario en formato CSV.

#### Gestión de incidencias
- [gestionIncidencias](0-Administrador/gestionIncidencias/README.md) - Panel de gestión de incidencias de horario: listar, revisar, resolver (con mensaje), omitir y exportar.

### Actor Profesor

#### Gestión del sistema
- [iniciarSesion](1-Profesor/iniciarSesion/README.md) - Acceso del profesor (documentado; reutiliza el login multi-rol por JWT).
- [cerrarSesion](1-Profesor/cerrarSesion/README.md) - Cierre de sesión del profesor (documentado; reutiliza el logout multi-rol).

#### Consulta de información
- [consultarCalendario](1-Profesor/consultarCalendario/README.md) - Consulta del calendario **restringida a los exámenes propios** (filtro por `profesorId` del JWT).
- [descargarCalendario](1-Profesor/descargarCalendario/README.md) - Descarga (CSV) del calendario propio.

#### Gestión de incidencias
- [comunicarIncidenciaHorario](1-Profesor/comunicarIncidenciaHorario/README.md) - **Caso exclusivo del Profesor**: registro de incidencias de horario (entidad `IncidenciaHorario`) y **visibilidad de la resolución** aplicada por el administrador (solo lectura).

### Actor Alumno

#### Gestión del sistema
- [iniciarSesion](2-Alumno/iniciarSesion/README.md) - Acceso del alumno (documentado; reutiliza el login multi-rol por JWT).
- [cerrarSesion](2-Alumno/cerrarSesion/README.md) - Cierre de sesión del alumno (documentado; reutiliza el logout multi-rol).

#### Consulta de información
- [consultarCalendario](2-Alumno/consultarCalendario/README.md) - Consulta del calendario **restringida a sus asignaturas matriculadas** (filtro por `Matricula` derivado del JWT).
- [descargarCalendarioExamenes](2-Alumno/descargarCalendarioExamenes/README.md) - Descarga (CSV) del calendario de sus asignaturas matriculadas.

## Estructura de cada informe de implementación

Cada documento `README.md` de esta sección incluye:

1.  **Backend**: Detalle de Controladores, Servicios, DTOs y lógica de persistencia.
2.  **Frontend**: Detalle de Componentes React, Hooks de estado y servicios de API.
3.  **Seguridad**: Mecanismos de protección aplicados (Guards, JWT).
4.  **Trazabilidad**: Referencia directa al código fuente en `/src`.