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

# Prototipos de Interfaces del Sistema

## InformaciÃ³n del Artefacto

- **Proyecto**: Generador de Fechas de ExÃ¡menes
- **Fase RUP**: ElaboraciÃ³n
- **Artefacto**: Prototipos de Interfaces
- **Autor**: Alejandro JuÃ¡rez
- **Fecha**: 2025-12-19

---

## IntroducciÃ³n

Este documento presenta los **prototipos de interfaces del sistema Generador de Fechas de ExÃ¡menes**.

Cada prototipo representa una **interfaz funcional** que permite visualizar:

- La disposiciÃ³n de elementos en pantalla para cada caso de uso.
- La interacciÃ³n visual entre el usuario y el sistema.
- Los flujos de navegaciÃ³n y formularios.
- Los componentes de entrada y visualizaciÃ³n de datos.

Este nivel de detalle complementa:

- Los diagramas de estados UML.
- Los casos de uso detallados.
- Los diagramas de contexto.

---

> **ACCESO DIRECTO A LOS CASOS DE USO (DETALLE + PROTOTIPO)**
>
> Si se busca un **caso de uso concreto** o se desea consultar **su detalle junto con su prototipo**, accede directamente aquÃ­
>
> **[Detalle y prototipo de los casos de uso por actor](/RUP/00-requisitos/01-casos-de-uso/0-Actores/README.md#detalle-y-prototipo-de-los-casos-de-uso)**
>
> AllÃ­ encontrarÃ¡s **tablas por actor** con enlaces individuales a cada caso de uso.

---

## OrganizaciÃ³n de los Prototipos

Los prototipos se organizan segÃºn el **actor principal** que los utiliza.

### Administrador

Los prototipos del Administrador cubren la **administraciÃ³n completa del sistema**:

- AdministraciÃ³n CRUD de todas las entidades (grados, asignaturas, exÃ¡menes, profesores, aulas, alumnos).
- Formularios de creaciÃ³n, ediciÃ³n y eliminaciÃ³n.
- Pantallas de importaciÃ³n masiva de datos.
- Interfaces de generaciÃ³n y administraciÃ³n del calendario.
- Herramientas de asignaciÃ³n y resoluciÃ³n de conflictos.

**UbicaciÃ³n de los prototipos**:

[README](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/README.md) con los 34 prototipos del actor **Administrador**

**Prototipos desarrollados (34):**

- `abrirAlumnos()`, `abrirAsignaturas()`, `abrirAulas()`, `abrirExamenes()`, `abrirGrados()`, `abrirProfesores()`
- `crearAlumno()`, `crearAsignatura()`, `crearAula()`, `crearExamen()`, `crearGrado()`, `crearProfesor()`
- `editarAlumno()`, `editarAsignatura()`, `editarAula()`, `editarExamen()`, `editarGrado()`, `editarProfesor()`
- `eliminarAlumno()`, `eliminarAsignatura()`, `eliminarAula()`, `eliminarExamen()`, `eliminarGrado()`, `eliminarProfesor()`
- `importarAlumnos()`, `importarAsignaturas()`, `importarAulas()`, `importarGrados()`, `importarProfesores()`
- `asignarProfesorAExamen()`, `consultarCalendario()`, `descargarCalendarioExamenes()`, `generarCalendario()`, `listarConflictosExamenes()`

---

### Profesor

Los prototipos del Profesor permiten la **consulta personalizada del calendario** y la **comunicaciÃ³n de incidencias**.

**UbicaciÃ³n de los prototipos**:

[README](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/1-Profesor/README.md) con los 3 prototipos del actor **Profesor**

**Prototipos desarrollados (3):**

- `consultarCalendario()`
- `comunicarIncidenciasHorario()`
- `descargarCalendarioExamenes()`

---

### Alumno

Los prototipos del Alumno se centran exclusivamente en la **consulta y descarga del calendario personal**.

**UbicaciÃ³n de los prototipos**:

[README](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/2-Alumno/README.md) con los 2 prototipos del actor **Alumno**

**Prototipos desarrollados (2):**

- `consultarCalendario()`
- `descargarCalendarioExamenes()`

---

## Total de Prototipos Desarrollados

| Actor             | Cantidad de Prototipos | Total  |
| ----------------- | ---------------------- | ------ |
| **Administrador** | 34 prototipos          | 34     |
| **Profesor**      | 3 prototipos           | 3      |
| **Alumno**        | 2 prototipos           | 2      |
| **TOTAL**         | **39 prototipos**      | **39** |

## Estructura de Archivos

```
5-Prototipo/
â”œâ”€â”€ README.md (este documento)
â”œâ”€â”€ 0-Administrador/
â”‚   â”œâ”€â”€ README.md
â”‚   â”œâ”€â”€ abrirAlumnos/
â”‚   â”‚   â”œâ”€â”€ abrirAlumnos.png (captura de pantalla)
â”‚   â”‚   â””â”€â”€ abrirAlumnos.md (documentaciÃ³n especÃ­fica)
â”‚   â”œâ”€â”€ abrirAsignaturas/
â”‚   â”‚   â”œâ”€â”€ abrirAsignaturas.png
â”‚   â”‚   â””â”€â”€ abrirAsignaturas.md
â”‚   â””â”€â”€ ... (32 carpetas mÃ¡s)
â”œâ”€â”€ 1-Profesor/
â”‚   â”œâ”€â”€ README.md
â”‚   â”œâ”€â”€ comunicarIncidenciasHorario/
â”‚   â”‚   â”œâ”€â”€ comunicarIncidenciasHorario.png
â”‚   â”‚   â””â”€â”€ comunicarIncidenciasHorario.md
â”‚   â”œâ”€â”€ consultarCalendario/
â”‚   â”‚   â”œâ”€â”€ consultarCalendario.png
â”‚   â”‚   â””â”€â”€ consultarCalendario.md
â”‚   â””â”€â”€ descargarCalendarioExamenes/
â”‚       â”œâ”€â”€ descargarCalendarioExamenes.png
â”‚       â””â”€â”€ descargarCalendarioExamenes.md
â””â”€â”€ 2-Alumno/
    â”œâ”€â”€ README.md
    â”œâ”€â”€ consultarCalendario/
    â”‚   â”œâ”€â”€ consultarCalendario.png
    â”‚   â””â”€â”€ consultarCalendario.md
    â””â”€â”€ descargarCalendarioExamenes/
        â”œâ”€â”€ descargarCalendarioExamenes.png
        â””â”€â”€ descargarCalendarioExamenes.md
```

