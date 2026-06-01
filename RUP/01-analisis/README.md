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

# Análisis - Disciplina de Análisis y Diseño

Esta sección contiene el análisis arquitectónico de los casos de uso especificados para el sistema **Davidario**, aplicando el patrón MVC e identificando las clases de análisis necesarias para la implementación.

## Contenido de la disciplina

### [Casos de uso - Análisis MVC](casos-uso/README.md)
Análisis completo de cada caso de uso especificado mediante:
- **Clases de análisis**: Boundary, Control, Entity según patrón MVC.
- **Diagramas de colaboración**: Interacciones conceptuales entre clases de análisis.
- **Responsabilidades definidas**: Separación clara por estereotipos.

## Metodologí­a de análisis aplicada

### Patrón MVC sistemático
- **Model (Entity)**: Entidades del dominio y repositorios de datos.
- **View (Boundary)**: Clases de interfaz que manejan interacción con actores.
- **Controller (Control)**: Coordinación de lógica de negocio y flujo de casos de uso.

### Estereotipos de análisis
- **Boundary (Vista)**: `#629EF9` - Clases de interfaz usuario-sistema.
- **Control (Controlador)**: `#b5bd68` - Clases de coordinación y lógica.
- **Entity (Entidad)**: `#F2AC4E` - Clases de dominio y persistencia.
- **Collaboration**: `#CDEBA5` - Referencias a otros casos de uso o estados del sistema.

### Diagramas de colaboración
- **Estructura de package**: Cada caso de uso se analiza como una unidad independiente.
- **Trazabilidad**: Los mensajes expresan intención de negocio derivada de los requisitos.
- **Relaciones MVC**: El controlador actúa como intermediario entre la vista y las entidades.

## Cobertura de análisis

### Casos completamente analizados
- **Gestión del sistema**: 
  - [iniciarSesion](casos-uso/0-Administrador/iniciarSesion/README.md) - Autenticación con clases de análisis MVC.
  - [cerrarSesion](casos-uso/0-Administrador/cerrarSesion/README.md) - Finalización de sesión segura.
- **Apertura de entidades**:
  - [abrirGrados](casos-uso/0-Administrador/abrirGrados/README.md) - Gestión de vista de listado de grados.
  - [abrirAsignaturas](casos-uso/0-Administrador/abrirAsignaturas/README.md) - Gestión de vista de listado de asignaturas.
  - [abrirExamenes](casos-uso/0-Administrador/abrirExamenes/README.md) - Gestión de vista de listado de exámenes.
  - [abrirProfesores](casos-uso/0-Administrador/abrirProfesores/README.md) - Gestión de vista de listado de profesores.
  - [abrirAulas](casos-uso/0-Administrador/abrirAulas/README.md) - Gestión de vista de listado de aulas.
  - [abrirAlumnos](casos-uso/0-Administrador/abrirAlumnos/README.md) - Gestión de vista de listado de alumnos.
- **Gestión de entidades**:
  - [importarGrados](casos-uso/0-Administrador/importarGrados/README.md) - Importación masiva de grados académicos.
  - [eliminarGrado](casos-uso/0-Administrador/eliminarGrado/README.md) - Eliminación de grados académicos.
  - [crearGrado](casos-uso/0-Administrador/crearGrado/README.md) - Creación de nuevos grados académicos.
  - [editarGrado](casos-uso/0-Administrador/editarGrado/README.md) - Modificación de grados académicos.
  - [importarAsignaturas](casos-uso/0-Administrador/importarAsignaturas/README.md) - Importación masiva de asignaturas.
  - [eliminarAsignatura](casos-uso/0-Administrador/eliminarAsignatura/README.md) - Eliminación de asignaturas.
  - [crearAsignatura](casos-uso/0-Administrador/crearAsignatura/README.md) - Creación de nuevas asignaturas académicas.
  - [editarAsignatura](casos-uso/0-Administrador/editarAsignatura/README.md) - Modificación de asignaturas académicas.
  - [eliminarExamen](casos-uso/0-Administrador/eliminarExamen/README.md) - Eliminación de exámenes.
  - [crearExamen](casos-uso/0-Administrador/crearExamen/README.md) - Creación de nuevos exámenes.
  - [editarExamen](casos-uso/0-Administrador/editarExamen/README.md) - Modificación de exámenes existentes.
  - [importarProfesores](casos-uso/0-Administrador/importarProfesores/README.md) - Importación masiva de profesores.
  - [eliminarProfesor](casos-uso/0-Administrador/eliminarProfesor/README.md) - Eliminación de profesores.
  - [crearProfesor](casos-uso/0-Administrador/crearProfesor/README.md) - Creación de nuevos profesores.
  - [editarProfesor](casos-uso/0-Administrador/editarProfesor/README.md) - Modificación de profesores existentes.
  - [listarConflictosExamenes](casos-uso/0-Administrador/listarConflictosExamenes/README.md) - Consulta de conflictos horarios de profesores.
  - [asignarProfesorAExamen](casos-uso/0-Administrador/asignarProfesorAExamen/README.md) - Asignación de supervisores a exámenes.
  - [importarAulas](casos-uso/0-Administrador/importarAulas/README.md) - Importación masiva de aulas.
  - [eliminarAula](casos-uso/0-Administrador/eliminarAula/README.md) - Eliminación de aulas.
  - [crearAula](casos-uso/0-Administrador/crearAula/README.md) - Creación de nuevas aulas.
  - [editarAula](casos-uso/0-Administrador/editarAula/README.md) - Modificación de aulas existentes.
  - [importarAlumnos](casos-uso/0-Administrador/importarAlumnos/README.md) - Importación masiva de alumnos.
  - [eliminarAlumno](casos-uso/0-Administrador/eliminarAlumno/README.md) - Eliminación de alumnos.
  - [crearAlumno](casos-uso/0-Administrador/crearAlumno/README.md) - Creación de nuevos alumnos.
  - [editarAlumno](casos-uso/0-Administrador/editarAlumno/README.md) - Modificación de alumnos existentes.
  - [completarGestion](casos-uso/0-Administrador/completarGestion/README.md) - Finalización de actividades administrativas.
- **Procesos del sistema**:
  - [generarCalendario](casos-uso/0-Administrador/generarCalendario/README.md) - Generación algorítmica del calendario de exámenes.
  - [completarProceso](casos-uso/0-Administrador/completarProceso/README.md) - Finalización de actividades de procesamiento.
- **Consulta de información**:
  - [consultarCalendario](casos-uso/0-Administrador/consultarCalendario/README.md) - Visualización y filtrado del calendario de exámenes.
  - [descargarCalendarioExamenes](casos-uso/0-Administrador/descargarCalendarioExamenes/README.md) - Exportación del calendario en formatos externos.
  - [completarConsulta](casos-uso/0-Administrador/completarConsulta/README.md) - Finalización de la actividad de consulta.

- **Actor Profesor**:
  - [iniciarSesion](casos-uso/1-Profesor/iniciarSesion/README.md) - Acceso al sistema para profesores.
  - [cerrarSesion](casos-uso/1-Profesor/cerrarSesion/README.md) - Cierre de sesión seguro.
  - [consultarCalendario](casos-uso/1-Profesor/consultarCalendario/README.md) - Consulta de exámenes programados del profesor.
  - [descargarCalendarioExamenes](casos-uso/1-Profesor/descargarCalendarioExamenes/README.md) - Exportación del calendario personal.
  - [completarConsulta](casos-uso/1-Profesor/completarConsulta/README.md) - Finalización de consulta.
  - [comunicarIncidenciasHorario](casos-uso/1-Profesor/comunicarIncidenciasHorario/README.md) - Reporte de incidencias en la programación.
  - [completarComunicacion](casos-uso/1-Profesor/completarComunicacion/README.md) - Finalización de reporte.

- **Actor Alumno**:
  - [iniciarSesion](casos-uso/2-Alumno/iniciarSesion/README.md) - Acceso al sistema para alumnos.
  - [cerrarSesion](casos-uso/2-Alumno/cerrarSesion/README.md) - Cierre de sesión seguro.
  - [consultarCalendario](casos-uso/2-Alumno/consultarCalendario/README.md) - Consulta de exámenes programados del alumno.
  - [descargarCalendarioExamenes](casos-uso/2-Alumno/descargarCalendarioExamenes/README.md) - Exportación del calendario personal.
  - [completarConsulta](casos-uso/2-Alumno/completarConsulta/README.md) - Finalización de consulta.

## Arquitectura emergente

### Separación de responsabilidades por capas
- **Capa de Presentación**: Clases Boundary derivadas de los prototipos de interfaz.
- **Capa de Lógica**: Clases Control especializadas en orquestar el flujo de los casos de uso.
- **Capa de Datos**: Repositorios conceptuales y entidades identificadas en el modelo del dominio.

## Trazabilidad

### De requisitos a análisis
- **Casos de uso detallados**: Los estados y transiciones guí­an la identificación de responsabilidades.
- **Modelo del dominio**: Provee las entidades base para las clases Entity.
- **Prototipos**: Definen la estructura conceptual de las clases Boundary.

## Referencias

- [Casos de uso especificados](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [AGENTES.md](/AGENTES.md) - Metodologí­a y protocolos
- [Log de conversaciones](/conversation-log.md)
