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

# Diseño de Casos de Uso

Esta carpeta contiene el diseño detallado de los casos de uso, transformando las clases de análisis conceptuales en componentes técnicos (Frontend y Backend) y definiendo la interacción mediante diagramas de secuencia de diseño.

## Casos de uso diseñados

*(Los diseños se irán incorporando progresivamente siguiendo el orden de la fase de análisis)*

### Actor Administrador

#### Gestión del sistema
- [iniciarSesion](0-Administrador/iniciarSesion/README.md) - Diseño técnico del acceso al sistema.
- [cerrarSesion](0-Administrador/cerrarSesion/README.md) - Diseño técnico de la finalización de sesión.

#### Apertura de entidades
*(Vacío - En desarrollo)*

#### Gestión de entidades
- [abrirGrados](0-Administrador/abrirGrados/README.md) - Diseño de vista de listado.
- [importarGrados](0-Administrador/importarGrados/README.md) - Diseño de carga masiva.
- [eliminarGrado](0-Administrador/eliminarGrado/README.md) - Diseño de borrado.
- [crearGrado](0-Administrador/crearGrado/README.md) - Diseño de registro.
- [editarGrado](0-Administrador/editarGrado/README.md) - Diseño de modificación.
- [abrirAsignaturas](0-Administrador/abrirAsignaturas/README.md) - Diseño de vista de listado.
- [importarAsignaturas](0-Administrador/importarAsignaturas/README.md) - Diseño de carga masiva.
- [eliminarAsignatura](0-Administrador/eliminarAsignatura/README.md) - Diseño de borrado.
- [crearAsignatura](0-Administrador/crearAsignatura/README.md) - Diseño de registro.
- [editarAsignatura](0-Administrador/editarAsignatura/README.md) - Diseño de modificación.

#### Gestión de Exámenes
- [abrirExamenes](0-Administrador/abrirExamenes/README.md) - Diseño de vista de listado.
- [crearExamen](0-Administrador/crearExamen/README.md) - Diseño de registro.
- [editarExamen](0-Administrador/editarExamen/README.md) - Diseño de modificación.
- [eliminarExamen](0-Administrador/eliminarExamen/README.md) - Diseño de borrado.

#### Gestión de Aulas
- [abrirAulas](0-Administrador/abrirAulas/README.md) - Diseño de vista de listado.
- [importarAulas](0-Administrador/importarAulas/README.md) - Diseño de carga masiva.
- [eliminarAula](0-Administrador/eliminarAula/README.md) - Diseño de borrado.
- [crearAula](0-Administrador/crearAula/README.md) - Diseño de registro.
- [editarAula](0-Administrador/editarAula/README.md) - Diseño de modificación.

#### Gestión de Alumnos
- [abrirAlumnos](0-Administrador/abrirAlumnos/README.md) - Diseño de vista de listado.
- [importarAlumnos](0-Administrador/importarAlumnos/README.md) - Diseño de carga masiva.
- [eliminarAlumno](0-Administrador/eliminarAlumno/README.md) - Diseño de borrado.
- [crearAlumno](0-Administrador/crearAlumno/README.md) - Diseño de registro.
- [editarAlumno](0-Administrador/editarAlumno/README.md) - Diseño de modificación.

#### Gestión de Profesores
- [abrirProfesores](0-Administrador/abrirProfesores/README.md) - Diseño de vista de listado.
- [importarProfesores](0-Administrador/importarProfesores/README.md) - Diseño de carga masiva.
- [eliminarProfesor](0-Administrador/eliminarProfesor/README.md) - Diseño de borrado.
- [crearProfesor](0-Administrador/crearProfesor/README.md) - Diseño de registro.
- [editarProfesor](0-Administrador/editarProfesor/README.md) - Diseño de modificación.
- [listarConflictosExamenes](0-Administrador/listarConflictosExamenes/README.md) - Diseño de detección de solapamientos.
- [asignarProfesorAExamen](0-Administrador/asignarProfesorAExamen/README.md) - Diseño de vinculación de supervisor.

#### Procesos del sistema
- [generarCalendario](0-Administrador/generarCalendario/README.md) - Diseño del motor de calendarización automática.

#### Consulta de información
*(Vacío - En desarrollo)*

### Actor Profesor
*(Vacío - En desarrollo)*

### Actor Alumno
*(Vacío - En desarrollo)*

## Estructura de diseño

Cada carpeta de diseño incluye:

- **README.md**: Documentación técnica del diseño del caso de uso.
- **clases-diseño.puml**: Diagrama de clases de diseño (Controladores, Servicios, Componentes).
- **secuencia-diseño.puml**: Diagrama de secuencia técnica detallando el flujo entre capas.

## Metodologí­a de diseño detallado

- **Contratos de Interfaz**: Definición de props en React y DTOs en NestJS.
- **Lógica de Negocio**: Centralizada en servicios de NestJS.
- **Estado del UI**: Gestión de hooks y estados locales en React.
- **Persistencia**: Uso de repositorios orquestados por el ORM.
