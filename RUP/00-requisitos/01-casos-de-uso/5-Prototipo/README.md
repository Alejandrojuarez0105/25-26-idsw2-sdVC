# Prototipos de Interfaces del Sistema

## Información del Artefacto

- **Proyecto**: Generador de Fechas de Exámenes
- **Fase RUP**: Elaboración
- **Artefacto**: Prototipos de Interfaces
- **Autor**: Alejandro Juárez
- **Fecha**: 2025-12-19

---

## Introducción

Este documento presenta los **prototipos de interfaces del sistema Generador de Fechas de Exámenes**.

Cada prototipo representa una **interfaz funcional** que permite visualizar:

- La disposición de elementos en pantalla para cada caso de uso.
- La interacción visual entre el usuario y el sistema.
- Los flujos de navegación y formularios.
- Los componentes de entrada y visualización de datos.

Este nivel de detalle complementa:

- Los diagramas de estados UML.
- Los casos de uso detallados.
- Los diagramas de contexto.

---

> **ACCESO DIRECTO A LOS CASOS DE USO (DETALLE + PROTOTIPO)**
>
> Si se busca un **caso de uso concreto** o se desea consultar **su detalle junto con su prototipo**, accede directamente aquí
>
> **[Detalle y prototipo de los casos de uso por actor](/RUP/00-requisitos/01-casos-de-uso/0-Actores/README.md#detalle-y-prototipo-de-los-casos-de-uso)**
>
> Allí encontrarás **tablas por actor** con enlaces individuales a cada caso de uso.

---

## Organización de los Prototipos

Los prototipos se organizan según el **actor principal** que los utiliza.

### Administrador

Los prototipos del Administrador cubren la **administración completa del sistema**:

- Administración CRUD de todas las entidades (grados, asignaturas, exámenes, profesores, aulas, alumnos).
- Formularios de creación, edición y eliminación.
- Pantallas de importación masiva de datos.
- Interfaces de generación y administración del calendario.
- Herramientas de asignación y resolución de conflictos.

**Ubicación de los prototipos**:

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

Los prototipos del Profesor permiten la **consulta personalizada del calendario** y la **comunicación de incidencias**.

**Ubicación de los prototipos**:

[README](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/1-Profesor/README.md) con los 3 prototipos del actor **Profesor**

**Prototipos desarrollados (3):**

- `consultarCalendario()`
- `comunicarIncidenciasHorario()`
- `descargarCalendarioExamenes()`

---

### Alumno

Los prototipos del Alumno se centran exclusivamente en la **consulta y descarga del calendario personal**.

**Ubicación de los prototipos**:

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
├── README.md (este documento)
├── 0-Administrador/
│   ├── README.md
│   ├── abrirAlumnos/
│   │   ├── abrirAlumnos.png (captura de pantalla)
│   │   └── abrirAlumnos.md (documentación específica)
│   ├── abrirAsignaturas/
│   │   ├── abrirAsignaturas.png
│   │   └── abrirAsignaturas.md
│   └── ... (32 carpetas más)
├── 1-Profesor/
│   ├── README.md
│   ├── comunicarIncidenciasHorario/
│   │   ├── comunicarIncidenciasHorario.png
│   │   └── comunicarIncidenciasHorario.md
│   ├── consultarCalendario/
│   │   ├── consultarCalendario.png
│   │   └── consultarCalendario.md
│   └── descargarCalendarioExamenes/
│       ├── descargarCalendarioExamenes.png
│       └── descargarCalendarioExamenes.md
└── 2-Alumno/
    ├── README.md
    ├── consultarCalendario/
    │   ├── consultarCalendario.png
    │   └── consultarCalendario.md
    └── descargarCalendarioExamenes/
        ├── descargarCalendarioExamenes.png
        └── descargarCalendarioExamenes.md
```
