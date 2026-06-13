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

# Casos de Uso - Sistema Generador de Calendarios de Exámenes

<div align=center>

**Administrador**

|![](/images/00-requisitos/01-casos-de-uso/1-CasosDeUso/0-Administrador/CdUAdministrador.svg)
|:-:
|[Código fuente](/modelosUML/00-requisitos/01-casos-de-uso/1-CasosDeUso/0-Administrador/CdUAdministrador.puml)

> Aquí se puede observar al actor **Administrador**, ha sido dividido en varios diagramas para mejorar la legibilidad,
> manteniendo **exactamente los mismos casos de uso y relaciones** que el diagrama original.

### Administración Académica

|       ![](/images/00-requisitos/01-casos-de-uso/1-CasosDeUso/0-Administrador/CdUAdministradorAdministraciónAcadémica.svg)        |
| :--------------------------------------------------------------------------------------------------------------------: |
| [Código fuente](/modelosUML/00-requisitos/01-casos-de-uso/1-CasosDeUso/0-Administrador/CdUAdministradorAdministraciónAcadémica.puml) |

### Administración de Exámenes

|       ![](/images/00-requisitos/01-casos-de-uso/1-CasosDeUso/0-Administrador/CdUAdministradorAdministraciónExámenes.svg)        |
| :-------------------------------------------------------------------------------------------------------------------: |
| [Código fuente](/modelosUML/00-requisitos/01-casos-de-uso/1-CasosDeUso/0-Administrador/CdUAdministradorAdministraciónExámenes.puml) |

### Administración de Profesores

|       ![](/images/00-requisitos/01-casos-de-uso/1-CasosDeUso/0-Administrador/CdUAdministradorAdministraciónProfesores.svg)        |
| :---------------------------------------------------------------------------------------------------------------------: |
| [Código fuente](/modelosUML/00-requisitos/01-casos-de-uso/1-CasosDeUso/0-Administrador/CdUAdministradorAdministraciónProfesores.puml) |

### Administración de Aulas

|       ![](/images/00-requisitos/01-casos-de-uso/1-CasosDeUso/0-Administrador/CdUAdministradorAdministraciónAulas.svg)        |
| :----------------------------------------------------------------------------------------------------------------: |
| [Código fuente](/modelosUML/00-requisitos/01-casos-de-uso/1-CasosDeUso/0-Administrador/CdUAdministradorAdministraciónAulas.puml) |

### Administración de Alumnos

|       ![](/images/00-requisitos/01-casos-de-uso/1-CasosDeUso/0-Administrador/CdUAdministradorAdministraciónAlumnos.svg)        |
| :------------------------------------------------------------------------------------------------------------------: |
| [Código fuente](/modelosUML/00-requisitos/01-casos-de-uso/1-CasosDeUso/0-Administrador/CdUAdministradorAdministraciónAlumnos.puml) |

> **Nota:**  
> La descomposición del actor **Administrador** responde únicamente a criterios de **claridad visual**.
> No se han añadido, eliminado ni modificado casos de uso ni actores.

</div>

---

<div align=center>

> A partir de acá se pueden observar a los otros 2 actores y sus casos de uso (Profesor y Alumno)

**Profesor**

|![](/images/00-requisitos/01-casos-de-uso/1-CasosDeUso/1-Profesor/CdUProfesor.svg)
|:-:
|[Código fuente](/modelosUML/00-requisitos/01-casos-de-uso/1-CasosDeUso/1-Profesor/CdUProfesor.puml)

</div>

---

<div align=center>

**Alumno**

|![](/images/00-requisitos/01-casos-de-uso/1-CasosDeUso/2-Alumno/CdUAlumno.svg)
|:-:
|[Código fuente](/modelosUML/00-requisitos/01-casos-de-uso/1-CasosDeUso/2-Alumno/CdUAlumno.puml)

</div>

---

## Tabla de Actores y Casos de Uso

|       Actor       | Casos de Uso                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Relaciones                                                                                                                                                                                                                                | Explicación                                                                                                                                                                                                                                                                                                                                                                                                            |
| :---------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Administrador** | - abrirGrados()<br>- crearGrado()<br>- editarGrado()<br>- eliminarGrado()<br>- importarGrados()<br>- abrirAsignaturas()<br>- crearAsignatura()<br>- editarAsignatura()<br>- eliminarAsignatura()<br>- importarAsignaturas()<br>- abrirExamenes()<br>- crearExamen()<br>- editarExamen()<br>- eliminarExamen()<br>- generarCalendario()<br>- consultarCalendario()<br>- descargarCalendarioExamenes()<br>- abrirProfesores()<br>- crearProfesor()<br>- editarProfesor()<br>- eliminarProfesor()<br>- importarProfesores()<br>- listarConflictosExamenes()<br>- asignarProfesorAExamen()<br>- abrirAulas()<br>- crearAula()<br>- editarAula()<br>- eliminarAula()<br>- importarAulas()<br>- abrirAlumnos()<br>- crearAlumno()<br>- editarAlumno()<br>- eliminarAlumno()<br>- importarAlumnos() | Las acciones de **eliminar** incluyen automáticamente la apertura de la lista correspondiente (`<<include>>`). La acción de **descargarCalendarioExamenes()** es opcional y se realiza después de consultar el calendario (`<<extend>>`). | El **Administrador** es responsable de la **administración completa del sistema**. Puede **crear, editar, eliminar y abrir** entidades académicas (grados, asignaturas, profesores, aulas, alumnos), así como **importarlas desde fuentes externas**. También puede **generar el calendario de exámenes**, **consultarlo** y **descargarlo**. Además, puede **listar conflictos** y **asignar profesores a exámenes**. |
|   **Profesor**    | - comunicarIncidenciasHorario()<br>- consultarCalendario()<br>- descargarCalendarioExamenes()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | descargarCalendarioExamenes() **extend** consultarCalendario()                                                                                                                                                                            | El **Profesor** puede **consultar el calendario de exámenes** y **comunicar incidencias de horario**. La descarga del calendario es opcional y depende de haber consultado previamente el calendario (`<<extend>>`).                                                                                                                                                                                                   |
|    **Alumno**     | - consultarCalendario()<br>- descargarCalendarioExamenes()                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | descargarCalendarioExamenes() **extend** consultarCalendario()                                                                                                                                                                            | El **Alumno** puede **consultar el calendario de exámenes** para conocer sus fechas. Opcionalmente, puede **descargarlo**, lo cual depende de haber realizado previamente la consulta (`<<extend>>`).                                                                                                                                                                                                                  |
