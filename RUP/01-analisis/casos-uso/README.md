<div align="right">

[![](https://img.shields.io/badge/-Inicio-0A3B64?style=for-the-badge&logo=github&logoColor=white)](/README.md)
[![](https://img.shields.io/badge/-Modelo_del_Dominio-0A3B64?style=for-the-badge&logo=drawio&logoColor=white)](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
[![](https://img.shields.io/badge/-Actores_Y_Casos_de_Uso-0A3B64?style=for-the-badge&logo=use-case&logoColor=white)](/RUP/00-requisitos/01-casos-de-uso/0-Actores/README.md)
[![](https://img.shields.io/badge/-Diagramas_de_Contexto-0A3B64?style=for-the-badge&logo=flowchart&logoColor=white)](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)
[![](https://img.shields.io/badge/-Detalle_de_Casos_de_Uso-0A3B64?style=for-the-badge&logo=notepad&logoColor=white)](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
[![](https://img.shields.io/badge/-Prototipos-0A3B64?style=for-the-badge&logo=figma&logoColor=white)](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/README.md)
[![](https://img.shields.io/badge/-Priorización-0A3B64?style=for-the-badge&logo=priority&logoColor=white)](/RUP/00-requisitos/01-casos-de-uso/3-PriorizarCasosDeUso/README.md)
[![](https://img.shields.io/badge/-Sesiones-0A3B64?style=for-the-badge&logo=google-meet&logoColor=white)](/RUP/00-requisitos/03-sesiones/README.md)
[![](https://img.shields.io/badge/-IA-0A3B64?style=for-the-badge&logo=openai&logoColor=white)](/conversation-log.md)

</div>

# Análisis de Casos de Uso

Esta carpeta contiene el análisis MVC (Model-View-Controller) de cada caso de uso especificado, incluyendo diagramas de colaboración y, opcionalmente, de secuencia.

## Casos de uso analizados

### Gestión del sistema
- [iniciarSesion](/RUP/01-analisis/casos-uso/0-Administrador/iniciarSesion/README.md) - Autenticación con clases de análisis MVC
- [cerrarSesion](/RUP/01-analisis/casos-uso/0-Administrador/cerrarSesion/README.md) - Finalización de sesión segura

### Apertura de entidades
- [abrirGrados](/RUP/01-analisis/casos-uso/0-Administrador/abrirGrados/README.md) - Gestión de vista de listado de grados
- [abrirAsignaturas](/RUP/01-analisis/casos-uso/0-Administrador/abrirAsignaturas/README.md) - Gestión de vista de listado de asignaturas
- [abrirExamenes](/RUP/01-analisis/casos-uso/0-Administrador/abrirExamenes/README.md) - Gestión de vista de listado de exámenes
- [abrirProfesores](/RUP/01-analisis/casos-uso/0-Administrador/abrirProfesores/README.md) - Gestión de vista de listado de profesores
- [abrirAulas](/RUP/01-analisis/casos-uso/0-Administrador/abrirAulas/README.md) - Gestión de vista de listado de aulas
- [abrirAlumnos](/RUP/01-analisis/casos-uso/0-Administrador/abrirAlumnos/README.md) - Gestión de vista de listado de alumnos

### Gestión de entidades
- [importarGrados](/RUP/01-analisis/casos-uso/0-Administrador/importarGrados/README.md) - Importación masiva de grados académicos
- [eliminarGrado](/RUP/01-analisis/casos-uso/0-Administrador/eliminarGrado/README.md) - Eliminación de grados académicos
- [crearGrado](/RUP/01-analisis/casos-uso/0-Administrador/crearGrado/README.md) - Creación de nuevos grados académicos
- [editarGrado](/RUP/01-analisis/casos-uso/0-Administrador/editarGrado/README.md) - Modificación de grados académicos
- [importarAsignaturas](/RUP/01-analisis/casos-uso/0-Administrador/importarAsignaturas/README.md) - Importación masiva de asignaturas
- [eliminarAsignatura](/RUP/01-analisis/casos-uso/0-Administrador/eliminarAsignatura/README.md) - Eliminación de asignaturas
- [crearAsignatura](/RUP/01-analisis/casos-uso/0-Administrador/crearAsignatura/README.md) - Creación de nuevas asignaturas académicas
- [editarAsignatura](/RUP/01-analisis/casos-uso/0-Administrador/editarAsignatura/README.md) - Modificación de asignaturas académicas
- [eliminarExamen](/RUP/01-analisis/casos-uso/0-Administrador/eliminarExamen/README.md) - Eliminación de exámenes
- [crearExamen](/RUP/01-analisis/casos-uso/0-Administrador/crearExamen/README.md) - Creación de nuevos exámenes
- [editarExamen](/RUP/01-analisis/casos-uso/0-Administrador/editarExamen/README.md) - Modificación de exámenes existentes
- [importarProfesores](/RUP/01-analisis/casos-uso/0-Administrador/importarProfesores/README.md) - Importación masiva de profesores
- [eliminarProfesor](/RUP/01-analisis/casos-uso/0-Administrador/eliminarProfesor/README.md) - Eliminación de profesores
- [crearProfesor](/RUP/01-analisis/casos-uso/0-Administrador/crearProfesor/README.md) - Creación de nuevos profesores
- [editarProfesor](/RUP/01-analisis/casos-uso/0-Administrador/editarProfesor/README.md) - Modificación de profesores existentes
- [listarConflictosExamenes](/RUP/01-analisis/casos-uso/0-Administrador/listarConflictosExamenes/README.md) - Consulta de conflictos horarios de profesores
- [asignarProfesorAExamen](/RUP/01-analisis/casos-uso/0-Administrador/asignarProfesorAExamen/README.md) - Asignación de supervisores a exámenes
- [importarAulas](/RUP/01-analisis/casos-uso/0-Administrador/importarAulas/README.md) - Importación masiva de aulas
- [eliminarAula](/RUP/01-analisis/casos-uso/0-Administrador/eliminarAula/README.md) - Eliminación de aulas
- [crearAula](/RUP/01-analisis/casos-uso/0-Administrador/crearAula/README.md) - Creación de nuevas aulas
- [editarAula](/RUP/01-analisis/casos-uso/0-Administrador/editarAula/README.md) - Modificación de aulas existentes
- [importarAlumnos](/RUP/01-analisis/casos-uso/0-Administrador/importarAlumnos/README.md) - Importación masiva de alumnos
- [eliminarAlumno](/RUP/01-analisis/casos-uso/0-Administrador/eliminarAlumno/README.md) - Eliminación de alumnos
- [crearAlumno](/RUP/01-analisis/casos-uso/0-Administrador/crearAlumno/README.md) - Creación de nuevos alumnos
- [editarAlumno](/RUP/01-analisis/casos-uso/0-Administrador/editarAlumno/README.md) - Modificación de alumnos existentes
- [completarGestion](/RUP/01-analisis/casos-uso/0-Administrador/completarGestion/README.md) - Finalización de actividades administrativas

### Procesos del sistema
- [generarCalendario](/RUP/01-analisis/casos-uso/0-Administrador/generarCalendario/README.md) - Generación algorítmica del calendario de exámenes
- [completarProceso](/RUP/01-analisis/casos-uso/0-Administrador/completarProceso/README.md) - Finalización de actividades de procesamiento

### Consulta de información
- [consultarCalendario](/RUP/01-analisis/casos-uso/0-Administrador/consultarCalendario/README.md) - Visualización y filtrado del calendario de exámenes
- [descargarCalendarioExamenes](/RUP/01-analisis/casos-uso/0-Administrador/descargarCalendarioExamenes/README.md) - Exportación del calendario en formatos externos
- [completarConsulta](/RUP/01-analisis/casos-uso/0-Administrador/completarConsulta/README.md) - Finalización de la actividad de consulta

## Estructura de análisis

Cada carpeta de análisis contiene:

- **README.md** - Análisis MVC completo del caso de uso
- **colaboracion.puml** - Diagrama de colaboración entre clases de análisis
- **secuencia.puml** - Diagrama de secuencia (para casos complejos)

## Clases de análisis aplicadas

### Boundary (Vista)
- Clases de interfaz que manejan la interacción con el actor.
- Responsables de presentar datos y capturar solicitudes (ej. Pantallas, APIs).

### Control (Controlador)
- Clases que coordinan la lógica del caso de uso.
- Orquestan las colaboraciones entre boundary y entity.

### Entity (Entidad)
- Clases que representan conceptos del dominio o persistencia.
- Repositories y entidades de negocio.

## Metodologí­a de análisis

- **Patrón MVC** aplicado sistemáticamente.
- **Colaboraciones explí­citas** entre clases de análisis.
- **Trazabilidad** desde la especificación de requisitos hasta el análisis.
- **Nomenclatura consistente** con el glosario y el modelo del dominio.
