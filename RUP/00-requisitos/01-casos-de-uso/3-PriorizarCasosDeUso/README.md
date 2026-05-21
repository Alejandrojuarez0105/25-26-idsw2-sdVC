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

# Priorización de Casos de Uso

Este documento presenta la **priorización de los casos de uso** del sistema de Generación de Calendarios de Exámenes, tomando en cuenta la **importancia y complejidad** de cada funcionalidad.

---

## Administrador

| ID  | Caso de uso                     | Prioridad |
| --- | ------------------------------- | --------- |
| A1  | `importarGrados()`              | Alta      |
| A2  | `importarAsignaturas()`         | Alta      |
| A3  | `importarProfesores()`          | Alta      |
| A4  | `importarAulas()`               | Alta      |
| A5  | `importarAlumnos()`             | Alta      |
| A6  | `generarCalendario()`           | Alta      |
| A7  | `consultarCalendario()`         | Alta      |
| A8  | `abrirGrados()`                 | Media     |
| A9  | `abrirAsignaturas()`            | Media     |
| A10 | `abrirExamenes()`               | Media     |
| A11 | `abrirProfesores()`             | Media     |
| A12 | `abrirAulas()`                  | Media     |
| A13 | `abrirAlumnos()`                | Media     |
| A14 | `crearGrado()`                  | Media     |
| A15 | `crearAsignatura()`             | Media     |
| A16 | `crearExamen()`                 | Media     |
| A17 | `crearProfesor()`               | Media     |
| A18 | `crearAula()`                   | Media     |
| A19 | `crearAlumno()`                 | Media     |
| A20 | `editarGrado()`                 | Media     |
| A21 | `editarAsignatura()`            | Media     |
| A22 | `editarExamen()`                | Media     |
| A23 | `editarProfesor()`              | Media     |
| A24 | `editarAula()`                  | Media     |
| A25 | `editarAlumno()`                | Media     |
| A26 | `listarConflictosExamenes()`    | Media     |
| A27 | `asignarProfesorAExamen()`      | Media     |
| A28 | `descargarCalendarioExamenes()` | Media     |
| A29 | `eliminarGrado()`               | Baja      |
| A30 | `eliminarAsignatura()`          | Baja      |
| A31 | `eliminarExamen()`              | Baja      |
| A32 | `eliminarProfesor()`            | Baja      |
| A33 | `eliminarAula()`                | Baja      |
| A34 | `eliminarAlumno()`              | Baja      |

## Profesor

| ID  | Caso de uso                     | Prioridad |
| --- | ------------------------------- | --------- |
| P1  | `consultarCalendario()`         | Alta      |
| P2  | `comunicarIncidenciasHorario()` | Alta      |
| P3  | `descargarCalendarioExamenes()` | Media     |

## Alumno

| ID  | Caso de uso                     | Prioridad |
| --- | ------------------------------- | --------- |
| U1  | `consultarCalendario()`         | Alta      |
| U2  | `descargarCalendarioExamenes()` | Media     |
