|[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/README.md)|[📂 Diseño](/RUP/02-diseño/README.md)|**Desarrollo**|Pruebas|
|-|-|-|-|-|-|-|

# Desarrollo - Disciplina de Implementación

Esta sección documenta la fase de **Desarrollo** del sistema **Davidario**, donde se materializa el diseño técnico en código fuente ejecutable, siguiendo un enfoque de construcción incremental basado en casos de uso.

## Entorno de Desarrollo y Stack Oficial

La implementación se realiza bajo un stack unificado en TypeScript para garantizar la coherencia y el tipado fuerte en todas las capas.

### Core Tecnológico
- **Lenguaje**: TypeScript 5.x
- **Frontend**: React 18 (Vite) + Tailwind/CSS
- **Backend**: NestJS 10 (Node.js)
- **Persistencia**: PostgreSQL 16
- **ORM**: Prisma ORM

### Herramientas de Construcción
- **Package Manager**: npm
- **Database Client**: Prisma Client (Autogenerado)
- **API Client**: Axios con Interceptores
- **Seguridad**: JWT (Passport) + Bcrypt para hashing

## Estructura de la Solución

El código fuente se organiza de forma desacoplada para facilitar la mantenibilidad y el despliegue independiente.

- **[/src/backend](/src/backend)**: Servidor de API REST y lógica de negocio.
- **[/src/frontend](/src/frontend)**: Aplicación cliente SPA.

## Estrategia de Implementación

1.  **Enfoque Incremental**: La construcción se realiza ramillete a ramillete, priorizando la infraestructura de seguridad y gestión base.
2.  **Trazabilidad RUP**: Cada componente desarrollado referencia a su correspondiente artefacto de Diseño y Requisitos.
3.  **Clean Code**: Aplicación de principios SOLID y patrones arquitectónicos nativos de NestJS (Módulos, Inyección de Dependencias).
4.  **Validación Continua**: Uso de DTOs y Pipes de validación para asegurar la integridad de los datos en el punto de entrada.

## Casos de Uso Implementados

A continuación se detallan las especificaciones de implementación por actor y caso de uso:

### Actor Administrador

#### Gestión del Sistema
- [iniciarSesion](casos-uso/0-Administrador/iniciarSesion/README.md) - Implementación del flujo de autenticación y redirección.
- [cerrarSesion](casos-uso/0-Administrador/cerrarSesion/README.md) - Implementación de la finalización de sesión y limpieza de tokens.

#### Gestión de Entidades
- [abrirGrados](casos-uso/0-Administrador/abrirGrados/README.md) - Implementación de la vista de listado de grados académicos.
- [importarGrados](casos-uso/0-Administrador/importarGrados/README.md) - Implementación de la carga masiva mediante archivos CSV.
- [eliminarGrado](casos-uso/0-Administrador/eliminarGrado/README.md) - Implementación del borrado seguro y controlado.
- [crearGrado](casos-uso/0-Administrador/crearGrado/README.md) - Implementación del alta de nuevos grados académicos.
- [editarGrado](casos-uso/0-Administrador/editarGrado/README.md) - Implementación de la edición de grados académicos.
- [abrirAsignaturas](casos-uso/0-Administrador/abrirAsignaturas/README.md) - Implementación de la vista de listado de asignaturas académicas.
- [eliminarAsignatura](casos-uso/0-Administrador/eliminarAsignatura/README.md) - Implementación del borrado seguro de materias.
- [importarAsignaturas](casos-uso/0-Administrador/importarAsignaturas/README.md) - Implementación de la carga masiva de materias vinculadas a grados.
- [crearAsignatura](casos-uso/0-Administrador/crearAsignatura/README.md) - Implementación del alta de nuevas asignaturas vinculadas a grados.
- [editarAsignatura](casos-uso/0-Administrador/editarAsignatura/README.md) - Implementación de la edición de asignaturas existentes.

#### Gestión de Exámenes
- [abrirExamenes](casos-uso/0-Administrador/abrirExamenes/README.md) - Implementación de la visualización del listado de exámenes.
- [eliminarExamen](casos-uso/0-Administrador/eliminarExamen/README.md) - Implementación del borrado seguro de registros de exámenes.
- [crearExamen](casos-uso/0-Administrador/crearExamen/README.md) - Implementación del alta de nuevos exámenes.
- [editarExamen](casos-uso/0-Administrador/editarExamen/README.md) - Implementación de la edición de exámenes existentes.

#### Gestión de Aulas
- [abrirAulas](casos-uso/0-Administrador/abrirAulas/README.md) - Implementación de la visualización del listado de aulas.
- [importarAulas](casos-uso/0-Administrador/importarAulas/README.md) - Implementación de la carga masiva de aulas mediante archivos CSV.
- [eliminarAula](casos-uso/0-Administrador/eliminarAula/README.md) - Implementación del borrado seguro y controlado de aulas.
- [crearAula](casos-uso/0-Administrador/crearAula/README.md) - Implementación del alta de nuevas aulas.
- [editarAula](casos-uso/0-Administrador/editarAula/README.md) - Implementación de la edición de aulas existentes.

#### Gestión de Alumnos
- [abrirAlumnos](casos-uso/0-Administrador/abrirAlumnos/README.md) - Implementación de la visualización del listado de alumnos.
- [importarAlumnos](casos-uso/0-Administrador/importarAlumnos/README.md) - Implementación de la carga masiva de alumnos.
- [eliminarAlumno](casos-uso/0-Administrador/eliminarAlumno/README.md) - Implementación de la funcionalidad de borrado seguro.
- [crearAlumno](casos-uso/0-Administrador/crearAlumno/README.md) - Implementación del alta de nuevos alumnos.
- [editarAlumno](casos-uso/0-Administrador/editarAlumno/README.md) - Implementación de la edición de alumnos existentes.

#### Gestión de Profesores
- [abrirProfesores](casos-uso/0-Administrador/abrirProfesores/README.md) - Implementación de la vista de listado de profesores.
- [importarProfesores](casos-uso/0-Administrador/importarProfesores/README.md) - Implementación de la carga masiva de profesores mediante archivos CSV.
- [eliminarProfesor](casos-uso/0-Administrador/eliminarProfesor/README.md) - Implementación de la funcionalidad de borrado seguro de profesores.
- [crearProfesor](casos-uso/0-Administrador/crearProfesor/README.md) - Implementación del alta de nuevos profesores.
- [editarProfesor](casos-uso/0-Administrador/editarProfesor/README.md) - Implementación de la edición de profesores existentes.
- [asignarProfesorAExamen](casos-uso/0-Administrador/asignarProfesorAExamen/README.md) - Implementación de la asignación/desasignación de profesores a exámenes.
- [listarConflictosExamenes](casos-uso/0-Administrador/listarConflictosExamenes/README.md) - Implementación de la detección y listado de conflictos en la planificación de exámenes.
- [refactorExamenes](casos-uso/0-Administrador/refactorExamenes/README.md) - Refactorización del modelo Examen para usar relaciones reales (profesorId, aulaId).
- [actualizarConflictosExamenes](casos-uso/0-Administrador/actualizarConflictosExamenes/README.md) - Actualización de la detección de conflictos sobre IDs reales y sincronización del dashboard.

#### Procesos del sistema
- [generarCalendario](casos-uso/0-Administrador/generarCalendario/README.md) - Implementación de la generación y visualización del calendario oficial de exámenes.

#### Consulta de información
- [consultarCalendario](casos-uso/0-Administrador/consultarCalendario/README.md) - Implementación de la consulta y visualización del calendario de exámenes.
- [descargarCalendarioExamenes](casos-uso/0-Administrador/descargarCalendarioExamenes/README.md) - Implementación de la descarga del calendario en formato CSV.

#### Gestión de incidencias
- [gestionIncidencias](casos-uso/0-Administrador/gestionIncidencias/README.md) - Panel de gestión de incidencias de horario: listar, revisar, resolver (con mensaje de resolución), omitir y exportar (CSV).

### Actor Profesor

#### Gestión del sistema
- [iniciarSesion](casos-uso/1-Profesor/iniciarSesion/README.md) - Acceso del profesor (documentado; login multi-rol por JWT reutilizado).
- [cerrarSesion](casos-uso/1-Profesor/cerrarSesion/README.md) - Cierre de sesión del profesor (documentado; logout multi-rol reutilizado).

#### Consulta de información
- [consultarCalendario](casos-uso/1-Profesor/consultarCalendario/README.md) - Consulta del calendario restringida a los exámenes propios (filtro por `profesorId` del JWT).
- [descargarCalendario](casos-uso/1-Profesor/descargarCalendario/README.md) - Descarga (CSV) del calendario propio.

#### Gestión de incidencias
- [comunicarIncidenciaHorario](casos-uso/1-Profesor/comunicarIncidenciaHorario/README.md) - Caso exclusivo del Profesor: registro de incidencias de horario (entidad `IncidenciaHorario`) y visibilidad (solo lectura) de la resolución aplicada por el administrador.

> **Cobertura de la rama Profesor**: `iniciarSesion` y `cerrarSesion` se documentan reutilizando la autenticación multi-rol existente (sin código nuevo). `consultarCalendario` y `descargarCalendario` se implementan en un módulo backend `profesor` aditivo que reutiliza `ExamenesService` y filtra por el profesor del JWT. `comunicarIncidenciaHorario` introduce la entidad `IncidenciaHorario`. La autorización se basa únicamente en el rol del JWT (compatible con cualquier usuario de rol Profesor).

### Actor Alumno

#### Gestión del sistema
- [iniciarSesion](casos-uso/2-Alumno/iniciarSesion/README.md) - Acceso del alumno (documentado; login multi-rol por JWT reutilizado).
- [cerrarSesion](casos-uso/2-Alumno/cerrarSesion/README.md) - Cierre de sesión del alumno (documentado; logout multi-rol reutilizado).

#### Consulta de información
- [consultarCalendario](casos-uso/2-Alumno/consultarCalendario/README.md) - Consulta del calendario restringida a sus asignaturas matriculadas (filtro por `Matricula` derivado del JWT).
- [descargarCalendarioExamenes](casos-uso/2-Alumno/descargarCalendarioExamenes/README.md) - Descarga (CSV) del calendario de sus asignaturas matriculadas.

> **Cobertura de la rama Alumno**: `iniciarSesion` y `cerrarSesion` se documentan reutilizando la autenticación multi-rol existente. `consultarCalendario` y `descargarCalendarioExamenes` se implementan en un módulo backend `alumno` aditivo que reutiliza `ExamenesService` y filtra por las asignaturas matriculadas del alumno (`Matricula`) derivadas del JWT. No introduce entidades ni tablas nuevas. Con esta rama, la implementación queda cubierta para los **tres actores** (Administrador, Profesor, Alumno) en sus casos de calendario.

## Referencias

- [Guía de Configuración y Scaffolding](/RUP/02-diseño/configuración-proyecto.md)
- [Disciplina de Diseño](/RUP/02-diseño/README.md)
- [Código Fuente Principal](/src/README.md)
- [AGENTES.md](/AGENTES.md) - Estándares de codificación
