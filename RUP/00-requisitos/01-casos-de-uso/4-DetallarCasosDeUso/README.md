<div align="right">

[![](https://img.shields.io/badge/-Inicio-0A3B64?style=for-the-badge&logo=github&logoColor=white)](/README.md)
[![](https://img.shields.io/badge/-Modelo_del_Dominio-0A3B64?style=for-the-badge&logo=drawio&logoColor=white)](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
[![](https://img.shields.io/badge/-Actores_Y_Casos_de_Uso-0A3B64?style=for-the-badge&logo=use-case&logoColor=white)](/RUP/00-requisitos/01-casos-de-uso/0-Actores/README.md)
[![](https://img.shields.io/badge/-Diagramas_de_Contexto-0A3B64?style=for-the-badge&logo=flowchart&logoColor=white)](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)
[![](https://img.shields.io/badge/-Detalle_de_Casos_de_Uso-0A3B64?style=for-the-badge&logo=notepad&logoColor=white)](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
[![](https://img.shields.io/badge/-Prototipos-0A3B64?style=for-the-badge&logo=figma&logoColor=white)](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/README.md)
[![](https://img.shields.io/badge/-PriorizaciÃ³n-0A3B64?style=for-the-badge&logo=priority&logoColor=white)](/RUP/00-requisitos/01-casos-de-uso/3-PriorizarCasosDeUso/README.md)
[![](https://img.shields.io/badge/-Sesiones-0A3B64?style=for-the-badge&logo=google-meet&logoColor=white)](/RUP/00-requisitos/03-sesiones/README.md)
[![](https://img.shields.io/badge/-IA-0A3B64?style=for-the-badge&logo=openai&logoColor=white)](/conversation-log.md)

</div>

# Detalle de Casos de Uso

## InformaciÃ³n del Artefacto

- **Proyecto**: Generador de Fechas de ExÃ¡menes
- **Fase RUP**: ElaboraciÃ³n
- **Artefacto**: Detalle de casos de uso
- **Autor**: Alejandro JuÃ¡rez
- **Fecha**: 2025-12-17

---

## IntroducciÃ³n

Este documento describe el **detalle de los casos de uso del sistema Generador de Fechas de ExÃ¡menes**, modelados mediante **diagramas de estados UML**.

Cada caso de uso se representa como una **mÃ¡quina de estados independiente**, permitiendo visualizar:

- El flujo interno de ejecuciÃ³n del caso de uso.
- La interacciÃ³n entre el actor y el sistema.
- Los estados intermedios y finales.
- Las posibles cancelaciones y retornos.

Este nivel de detalle complementa:

- El diagrama de contexto.
- La priorizaciÃ³n de casos de uso.

---

> **ACCESO DIRECTO A LOS CASOS DE USO (DETALLE + PROTOTIPO)**
>
> Si se busca un **caso de uso concreto** o se desea consultar **su detalle junto con su prototipo**, accede directamente aquÃ­
>
> **[Detalle y prototipo de los casos de uso por actor](/RUP/00-requisitos/01-casos-de-uso/0-Actores/README.md#detalle-y-prototipo-de-los-casos-de-uso)**
>
> AllÃ­ encontrarÃ¡s **tablas por actor** con enlaces individuales a cada caso de uso.

---

## OrganizaciÃ³n de los Casos de Uso

Los casos de uso detallados se organizan segÃºn el **actor principal** que los ejecuta.

### Administrador

Los casos de uso del Administrador estÃ¡n orientados a la **administraciÃ³n completa del sistema**:

- AdministraciÃ³n CRUD de todas las entidades (grados, asignaturas, exÃ¡menes, profesores, aulas, alumnos).
- ImportaciÃ³n masiva de datos desde archivos.
- GeneraciÃ³n automÃ¡tica del calendario de exÃ¡menes.
- AdministraciÃ³n de conflictos y asignaciones.
- Consulta y exportaciÃ³n del calendario final.

**UbicaciÃ³n de los diagramas**:

[README](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/0-Administrador/README.md) con el detallado de los 34 casos de uso del actor **Administrador**

**Casos de uso detallados (34):**

- `abrirAlumnos()`, `abrirAsignaturas()`, `abrirAulas()`, `abrirExamenes()`, `abrirGrados()`, `abrirProfesores()`
- `crearAlumno()`, `crearAsignatura()`, `crearAula()`, `crearExamen()`, `crearGrado()`, `crearProfesor()`
- `editarAlumno()`, `editarAsignatura()`, `editarAula()`, `editarExamen()`, `editarGrado()`, `editarProfesor()`
- `eliminarAlumno()`, `eliminarAsignatura()`, `eliminarAula()`, `eliminarExamen()`, `eliminarGrado()`, `eliminarProfesor()`
- `importarAlumnos()`, `importarAsignaturas()`, `importarAulas()`, `importarGrados()`, `importarProfesores()`
- `asignarProfesorAExamen()`, `consultarCalendario()`, `descargarCalendarioExamenes()`, `generarCalendario()`, `listarConflictosExamenes()`

---

### Profesor

Los casos de uso del Profesor permiten la **consulta del calendario publicado** y la **comunicaciÃ³n de incidencias** sobre su asignaciÃ³n.

**UbicaciÃ³n de los diagramas**:

[README](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/1-Profesor/README.md) con el detallado de los 3 casos de uso del actor **Profesor**

**Casos de uso detallados (3):**

- `consultarCalendario()`
- `comunicarIncidenciasHorario()`
- `descargarCalendarioExamenes()`

---

### Alumno

Los casos de uso del Alumno se centran exclusivamente en la **consulta y descarga del calendario de exÃ¡menes**, sin capacidad de modificaciÃ³n.

**UbicaciÃ³n de los diagramas**:

[README](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/2-Alumno/README.md) con el detallado de los 2 casos de uso del actor **Alumno**

**Casos de uso detallados (2):**

- `consultarCalendario()`
- `descargarCalendarioExamenes()`

---

## Total de Casos de Uso Detallados

| Actor             | Cantidad de Casos de Uso | Total  |
| ----------------- | ------------------------ | ------ |
| **Administrador** | 34 casos                 | 34     |
| **Profesor**      | 3 casos                  | 3      |
| **Alumno**        | 2 casos                  | 2      |
| **TOTAL**         | **39 casos de uso**      | **39** |

---

## Archivos y Estructura

```
4-DetallarCasosDeUso/
â”œâ”€â”€ README.md (este documento)
â”œâ”€â”€ 0-Administrador/
â”‚   â”œâ”€â”€ README.md
â”‚   â”œâ”€â”€ abrirAlumnos/
â”‚   â”‚   â”œâ”€â”€ abrirAlumnos.puml
â”‚   â”‚   â””â”€â”€ abrirAlumnos.svg
â”‚   â””â”€â”€ ... (34 carpetas mÃ¡s)
â”œâ”€â”€ 1-Profesor/
â”‚   â”œâ”€â”€ README.md
â”‚   â”œâ”€â”€ consultarCalendario/
â”‚   â”‚   â”œâ”€â”€ consultarCalendario.puml
â”‚   â”‚   â””â”€â”€ consultarCalendario.svg
â”‚   â””â”€â”€ ... (2 carpetas mÃ¡s)
â””â”€â”€ 2-Alumno/
    â”œâ”€â”€ README.md
    â”œâ”€â”€ consultarCalendario/
    â”‚   â”œâ”€â”€ consultarCalendario.puml
    â”‚   â””â”€â”€ consultarCalendario.svg
    â””â”€â”€ ... (1 carpeta mÃ¡s)
```

