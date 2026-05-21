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

# Glosario del Generador de Fechas de Exámenes

Breve glosario unificado de los términos y conceptos utilizados en el modelo del dominio y diagramas UML del sistema de gestión universitaria, con especial énfasis en la organización académica y la planificación de exámenes.

| Término                          | Definición                                                                               | Ejemplos / Características                                                 |
| -------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Asignatura                       | Unidad académica evaluable que agrupa alumnos, profesores y exámenes.                    | Ingeniería de Software, Sistemas Distribuidos; identificada por un código. |
| Profesor                         | Responsable de impartir una asignatura y de supervisar los exámenes asociados.           | Puede impartir varias asignaturas y supervisar distintos exámenes.         |
| Alumno                           | Estudiante inscrito en una asignatura y habilitado para presentarse a sus exámenes.      | Grupo de alumnos inscritos; participa en exámenes concretos.               |
| Inscripción                      | Relación que vincula a un alumno con una asignatura.                                     | Condición necesaria para poder presentarse a un examen.                    |
| Examen                           | Elemento central de evaluación de una asignatura, que requiere planificación y recursos. | Examen final; asociado a una asignatura, alumnos y profesor.               |
| Tipo de Examen                   | Clasificación del examen según su finalidad evaluadora.                                  | Final, parcial.                                                            |
| Aula                             | Recurso físico donde se realiza un examen.                                               | Tiene código identificativo y capacidad máxima.                            |
| Capacidad del Aula               | Límite de alumnos que pueden realizar un examen en un aula.                              | Debe ser suficiente para los alumnos presentados.                          |
| Franja Horaria                   | Intervalo de tiempo asignado a la realización de un examen.                              | 11:30–13:30, 08:30–10:30.                                                  |
| Supervisión de Examen            | Relación que asigna un profesor responsable durante la realización del examen.           | Evita conflictos de profesores simultáneos.                                |
| Presentación a Examen            | Relación entre los alumnos y un examen específico.                                       | Define qué alumnos realizan cada examen.                                   |
| Programación de Examen           | Proceso de asignar aula, franja horaria y profesor a un examen.                          | Parte del calendario de exámenes.                                          |
| Conflicto de Examen              | Situación que impide una planificación válida.                                           | Solapamiento de horarios, aula insuficiente, profesor duplicado.           |
| Estado del Examen                | Situación en la que se encuentra un examen dentro de su ciclo de vida.                   | SinAsignar, Asignado.                                                      |
| Generador de Exámenes            | Componente encargado de crear, revisar y validar la planificación de exámenes.           | Gestiona asignaciones y detección de conflictos.                           |
| Estado del Generador de Exámenes | Fase del proceso de planificación global.                                                | PendienteDeAsignar, Asignando, PendienteDeRevisión, Finalizado.            |
