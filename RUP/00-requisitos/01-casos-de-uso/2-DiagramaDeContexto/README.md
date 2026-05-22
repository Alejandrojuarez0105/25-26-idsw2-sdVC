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

# Generador de fechas de Exámenes — Diagramas de Contexto

## Información del artefacto

- **Proyecto**: Generador de fechas de Exámenes
- **Fase RUP**: Elaboración
- **Fecha**: 2025-12-17
- **Autor**: Alejandro Juárez

---

## Introducción

Este documento presenta los **diagramas de contexto del Generador de fechas de Exámenes**, modelados como **máquinas de estados**.
Los diagramas describen las **situaciones estables del sistema** desde la perspectiva de cada actor y las transiciones provocadas por sus acciones.

Se presentan diagramas individuales para:

1. **Administrador**
2. **Profesor**
3. **Alumno**

---

## Propósito

- Representar los **estados estables del sistema** desde cada actor.
- Mostrar las **transiciones provocadas por la ejecución de casos de uso**.
- Garantizar que todos los casos de uso estén reflejados en el flujo global.
- Facilitar la comprensión de la **navegación, permisos y secuencias** del sistema.

---

## Diagramas

### Administrador

<div align=center>

**Diagrama de contexto – Administrador**

|       ![](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)        |
| :--------------------------------------------------------------------------------------------------------------------: |
| [Código fuente](/modelosUML/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.puml) |

</div>

---

### Profesor

<div align=center>

**Diagrama de contexto – Profesor**

|       ![](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/1-Profesor/DiagramaDeContextoProfesor.svg)        |
| :----------------------------------------------------------------------------------------------------------: |
| [Código fuente](/modelosUML/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/1-Profesor/DiagramaDeContextoProfesor.puml) |

</div>

---

### Alumno

<div align=center>

**Diagrama de contexto – Alumno**

|       ![](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/2-Alumno/DiagramaDeContextoAlumno.svg)        |
| :------------------------------------------------------------------------------------------------------: |
| [Código fuente](/modelosUML/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/2-Alumno/DiagramaDeContextoAlumno.puml) |

</div>

---

## Estados del Sistema

### Administrador

| Estado                            | Descripción                             | Función Principal                                       |
| --------------------------------- | --------------------------------------- | ------------------------------------------------------- |
| **SESION_CERRADA**                | Estado inicial del sistema              | Punto de entrada, requiere autenticación                |
| **SISTEMA_DISPONIBLE**            | Menú principal con acceso completo      | Navegación central a todas las funcionalidades          |
| **GRADOS_ABIERTO**                | Listado de grados académicos            | CRUD de grados                                          |
| **GRADO_ABIERTO**                 | Formulario de edición de un grado       | Creación o modificación de datos de un grado específico |
| **ASIGNATURAS_ABIERTO**           | Listado de asignaturas                  | CRUD de asignaturas                                     |
| **ASIGNATURA_ABIERTO**            | Formulario de edición de una asignatura | Definición de asignaturas y sus propiedades             |
| **EXAMENES_ABIERTO**              | Listado de exámenes programados         | CRUD de exámenes                                        |
| **EXAMEN_ABIERTO**                | Formulario de edición de un examen      | Configuración de detalles de cada examen                |
| **PROFESORES_ABIERTO**            | Listado de profesores                   | CRUD de profesores                                      |
| **PROFESOR_ABIERTO**              | Formulario de edición de un profesor    | Administración de datos de profesores                   |
| **PROFESOR_PREFERENCIAS_ABIERTO** | Administración de disponibilidad        | Configuración de conflictos y preferencias de horario   |
| **PROFESOR_EXAMENES_ABIERTO**     | Asignación de exámenes                  | Distribución de exámenes a profesores                   |
| **AULAS_ABIERTO**                 | Listado de espacios disponibles         | CRUD de aulas                                           |
| **AULA_ABIERTA**                  | Formulario de edición de un aula        | Configuración de capacidad y características            |
| **ALUMNOS_ABIERTO**               | Listado de estudiantes                  | CRUD de alumnos                                         |
| **ALUMNO_ABIERTO**                | Formulario de edición de un alumno      | Administración de datos de alumnos                      |
| **CALENDARIO_GENERADO**           | Calendario creado automáticamente       | Estado tras la generación automática del calendario     |
| **CALENDARIO_ABIERTO**            | Vista de calendario final               | Consulta, revisión y descarga del calendario generado   |

### Profesor

| Estado                  | Descripción                        | Función Principal                                      |
| ----------------------- | ---------------------------------- | ------------------------------------------------------ |
| **SESION_CERRADA**      | Estado inicial del sistema         | Punto de entrada, requiere autenticación               |
| **SISTEMA_DISPONIBLE**  | Menú principal limitado            | Navegación a funcionalidades permitidas                |
| **CALENDARIO_ABIERTO**  | Vista de calendario de exámenes    | Consulta de fechas, aulas y asignaciones               |
| **INCIDENCIAS_ABIERTO** | Formulario de reporte de problemas | Comunicación de conflictos o incidencias en el horario |

### Alumno

| Estado                 | Descripción                     | Función Principal                         |
| ---------------------- | ------------------------------- | ----------------------------------------- |
| **SESION_CERRADA**     | Estado inicial del sistema      | Punto de entrada, requiere autenticación  |
| **SISTEMA_DISPONIBLE** | Menú con única opción           | Acceso exclusivo a consulta de calendario |
| **CALENDARIO_ABIERTO** | Vista de calendario de exámenes | Consulta de fechas y lugares de exámenes  |

---

## Transiciones Principales

### Autenticación (Común a todos)

- `iniciarSesion()`: `SESION_CERRADA` → `SISTEMA_DISPONIBLE`
- `cerrarSesion()`: `SISTEMA_DISPONIBLE` → `SESION_CERRADA`

### Administración de Entidades (Administrador)

- Operaciones CRUD para cada entidad:
  - `abrir[Entidad]()`: Navegación al listado
  - `crear[Entidad]()`: Transición a edición (creación)
  - `editar[Entidad]()`: Transición a edición (modificación)
  - `eliminar[Entidad]()`: Eliminación en el listado
  - `importar[Entidad]()`: Carga masiva desde archivo
- `completarGestion()`: Retorno al menú principal desde cualquier listado

### Generación de Calendario (Administrador)

- `generarCalendario()`: `SISTEMA_DISPONIBLE` → `CALENDARIO_GENERADO`
- `consultarCalendario()`: `SISTEMA_DISPONIBLE` → `CALENDARIO_ABIERTO`
- `descargarCalendarioExamenes()`: Descarga desde `CALENDARIO_ABIERTO`
- `completarProceso()`: Retorno al menú tras generación
- `completarConsulta()`: Retorno al menú tras consulta

### Funciones del Profesor

- `consultarCalendario()`: `SISTEMA_DISPONIBLE` → `CALENDARIO_ABIERTO`
- `comunicarIncidenciasHorario()`: `SISTEMA_DISPONIBLE` → `INCIDENCIAS_ABIERTO`
- `descargarCalendarioExamenes()`: Descarga desde `CALENDARIO_ABIERTO`
- `completarConsulta()`: Retorno al menú tras consulta
- `completarComunicacion()`: Retorno al menú tras reportar incidencia

### Funciones del Alumno

- `consultarCalendario()`: `SISTEMA_DISPONIBLE` → `CALENDARIO_ABIERTO`
- `descargarCalendarioExamenes()`: Descarga desde `CALENDARIO_ABIERTO`
- `completarConsulta()`: Retorno al menú tras consulta

---
