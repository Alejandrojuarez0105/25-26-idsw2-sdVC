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

# Modelo del dominio

## Diagramas

<div align=center>
	
|![](/images/00-requisitos/00-modelo-del-dominio/DiagramaDeClases/DiagramaDeClasesGeneradorExamenes.svg)
|:-:
|[Código fuente](/modelosUML/00-requisitos/00-modelo-del-dominio/DiagramaDeClases/DiagramaDeClasesGeneradorExamenes.puml)

</div>

### Diagrama de objetos

<div align=center>

|                                                                                               Diagrama de objetos                                                                                               |                                                                                                 Diagrama de objetos expandido                                                                                                 |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| ![](/images/00-requisitos/00-modelo-del-dominio/DiagramaDeObjetos/DiagramaDeObjetosGeneradorExamenes.svg)<br>[Código fuente](/modelosUML/00-requisitos/00-modelo-del-dominio/DiagramaDeObjetos/DiagramaDeObjetosGeneradorExamenes.puml) | ![](/images/00-requisitos/00-modelo-del-dominio/DiagramaDeObjetos/SegundoDiagramaDeObjetosGeneradorExamenes.svg)<br>[Código fuente](/modelosUML/00-requisitos/00-modelo-del-dominio/DiagramaDeObjetos/SegundoDiagramaDeObjetosGeneradorExamenes.puml) |

</div>

### Diagramas de estados

<div align=center>

|                                                                                 Diagrama de estados de un exámen                                                                                  |                                                                                        Diagrama de estados del generador                                                                                        |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| ![](/images/00-requisitos/00-modelo-del-dominio/DiagramaDeEstados/DiagramaDeEstadosDeUnExamen.svg)<br>[Código fuente](/modelosUML/00-requisitos/00-modelo-del-dominio/DiagramaDeEstados/DiagramaDeEstadosDeUnExamen.puml) | ![](/images/00-requisitos/00-modelo-del-dominio/DiagramaDeEstados/DiagramaDeEstadosGeneradorExamenes.svg)<br>[Código fuente](/modelosUML/00-requisitos/00-modelo-del-dominio/DiagramaDeEstados/DiagramaDeEstadosGeneradorExamenes.puml) |


</div>

---

### Glosario

README hacia el [Glosario](/RUP/00-requisitos/00-modelo-del-dominio/Glosario/README.md) del modelo del dominio

### Idea principal

El cliente desea un **generador automático de fechas de exámenes** que elabore el calendario completo siguiendo las reglas y restricciones establecidas por la universidad.

Cada examen debe contener:

- Nombre de la asignatura
- Grado al que pertenece
- Código de la asignatura
- Tipo (parcial o final)
- Profesor asignado
- Número de estudiantes
- Fecha del examen
- Hora (8:30, 11:30, 14:30 o 17:30)
- Aula asignada

El sistema deberá conectarse a la **base de datos universitaria**, desde donde obtendrá y actualizará toda la información relevante.

---

## ¿Por qué?

Actualmente, la universidad realiza la programación de exámenes **manualmente mediante hojas de Excel**, lo cual presenta varios problemas:

- Consumo elevado de tiempo.
- Riesgo de errores humanos.
- Dificultad para detectar conflictos de horarios o disponibilidad de aulas.

El cliente busca una **solución automatizada** que optimice este proceso y elimine el trabajo manual.

---

## ¿Qué?

El proyecto consiste en implementar un sistema capaz de:

- Obtener datos de asignaturas, profesores, aulas y estudiantes desde la base de datos.
- Generar automáticamente fechas, aulas y horarios disponibles.
- Permitir generar el calendario completo con un solo clic.

---

## ¿Para qué?

El objetivo es **automatizar la planificación de exámenes**, logrando:

- Ahorro significativo de tiempo.
- Menos errores en la programación.
- Información organizada y coherente para la universidad.

Aunque el sistema está dirigido a personal administrativo, **los estudiantes son beneficiarios indirectos** al recibir un calendario más fiable y mejor estructurado.

---

## ¿Cómo?

El sistema se conectará a la base de datos de la universidad y funcionará de manera completamente automática:

- Recopilará la información necesaria (asignaturas, profesores, estudiantes, aulas).
- Generará fechas y horarios siguiendo las reglas establecidas.
- Verificará conflictos entre exámenes.
- Permitirá exportar o publicar el calendario final.

En términos simples: **el usuario solo deberá presionar un botón para generar el calendario completo**.

---
