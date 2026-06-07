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

# Diseño - Disciplina de Análisis y Diseño

Esta sección constituye la fase de **Diseño** del sistema **Davidario**, donde se transforman los modelos de análisis conceptuales en especificaciones técnicas detalladas para la implementación, utilizando un stack tecnológico moderno y escalable.

## Propósito
Esta fase tiene como objetivo definir la arquitectura del sistema, la selección tecnológica y el diseño detallado de los componentes para guiar la implementación técnica y asegurar la calidad del producto final.

## Stack Tecnológico Seleccionado

Para la implementación de **Davidario**, se ha seleccionado una arquitectura de **Single Page Application (SPA)** con Backend modular, optimizada para el ecosistema TypeScript.

### Frontend: React + TypeScript
- **Framework**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Ventajas**: Reactividad eficiente, ecosistema masivo de componentes y tipado estático con TypeScript que previene errores comunes en UI.
- **Rol**: Interfaz de usuario interactiva, gestión de rutas en el cliente y consumo de la API REST.

### Backend: Node.js + NestJS
- **Framework**: [NestJS](https://nestjs.com/) (Node.js + TypeScript)
- **Arquitectura**: Basada en módulos, controladores y servicios.
- **ORM**: [Prisma](https://www.prisma.io/) o [TypeORM](https://typeorm.io/) (orientado a PostgreSQL).
- **Ventajas**: Arquitectura modular robusta, inyección de dependencias nativa y soporte de primera clase para TypeScript.
- **Rol**: Lógica de negocio centralizada, validación de datos, seguridad y orquestación del acceso a datos.

### Base de Datos: PostgreSQL 16
- **Motor**: [PostgreSQL 16](https://www.postgresql.org/)
- **Gestión**: pgAdmin para administración y monitoreo.
- **Ventajas**: Motor relacional estándar de la industria, soporte para tipos complejos (JSONB, UUID) y alta integridad referencial.
- **Rol**: Almacenamiento persistente de toda la información del sistema.

## Artefactos de Diseño General

### Arquitectura del sistema

Vista técnica de alto nivel de las capas del sistema y su comunicación.

<div align=center>

|![Diagrama de Arquitectura](/images/02-diseño/arquitectura.svg)|
|:-:|
|[Código PlantUML](../../modelosUML/02-diseño/arquitectura.puml)|

</div>

### Diagrama de clases de diseño (dominio y datos)

Modelado detallado de entidades, tipos de datos técnicos y esquemas de persistencia.

<div align=center>

|![Diagrama de Clases de Diseño](/images/02-diseño/clases-diseño.svg)|
|:-:|
|[Código PlantUML](../../modelosUML/02-diseño/clases-diseño.puml)|

</div>

## Configuración y Estructura del Proyecto

Definición de la estructura de directorios, configuraciones técnicas iniciales y esquema de base de datos para materializar la arquitectura en código ejecutable.

[Documento de Configuración y Scaffolding](configuración-proyecto.md)

## Diseño de Casos de Uso

El diseño detallado de cada caso de uso se organiza en subcarpetas por actor dentro de [casos-uso](casos-uso/README.md):

### Actor Administrador

#### Gestión del Sistema
- [iniciarSesion](casos-uso/0-Administrador/iniciarSesion/README.md) - Diseño del acceso seguro.
- [cerrarSesion](casos-uso/0-Administrador/cerrarSesion/README.md) - Diseño de finalización de sesión.

#### Gestión de Entidades
- [abrirGrados](casos-uso/0-Administrador/abrirGrados/README.md) - Diseño de vista de listado.
- [importarGrados](casos-uso/0-Administrador/importarGrados/README.md) - Diseño de carga masiva.
- [eliminarGrado](casos-uso/0-Administrador/eliminarGrado/README.md) - Diseño de borrado.
- [crearGrado](casos-uso/0-Administrador/crearGrado/README.md) - Diseño de registro.
- [editarGrado](casos-uso/0-Administrador/editarGrado/README.md) - Diseño de modificación.
- [abrirAsignaturas](casos-uso/0-Administrador/abrirAsignaturas/README.md) - Diseño de vista de listado.
- [importarAsignaturas](casos-uso/0-Administrador/importarAsignaturas/README.md) - Diseño de carga masiva.
- [eliminarAsignatura](casos-uso/0-Administrador/eliminarAsignatura/README.md) - Diseño de borrado.
- [crearAsignatura](casos-uso/0-Administrador/crearAsignatura/README.md) - Diseño de registro.
- [editarAsignatura](casos-uso/0-Administrador/editarAsignatura/README.md) - Diseño de modificación.
- [abrirExamenes](casos-uso/0-Administrador/abrirExamenes/README.md) - Diseño de vista de listado.
- [crearExamen](casos-uso/0-Administrador/crearExamen/README.md) - Diseño de registro.
- [editarExamen](casos-uso/0-Administrador/editarExamen/README.md) - Diseño de modificación.
- [eliminarExamen](casos-uso/0-Administrador/eliminarExamen/README.md) - Diseño de borrado.
- [abrirAulas](casos-uso/0-Administrador/abrirAulas/README.md) - Diseño de vista de listado.
- [importarAulas](casos-uso/0-Administrador/importarAulas/README.md) - Diseño de carga masiva.
- [eliminarAula](casos-uso/0-Administrador/eliminarAula/README.md) - Diseño de borrado.
- [crearAula](casos-uso/0-Administrador/crearAula/README.md) - Diseño de registro.
- [editarAula](casos-uso/0-Administrador/editarAula/README.md) - Diseño de modificación.
- [abrirAlumnos](casos-uso/0-Administrador/abrirAlumnos/README.md) - Diseño de vista de listado.
- [importarAlumnos](casos-uso/0-Administrador/importarAlumnos/README.md) - Diseño de carga masiva.
- [eliminarAlumno](casos-uso/0-Administrador/eliminarAlumno/README.md) - Diseño de borrado.
- [crearAlumno](casos-uso/0-Administrador/crearAlumno/README.md) - Diseño de registro.
- [editarAlumno](casos-uso/0-Administrador/editarAlumno/README.md) - Diseño de modificación.

#### Gestión de Profesores
- [abrirProfesores](casos-uso/0-Administrador/abrirProfesores/README.md) - Diseño de vista de listado.
- [importarProfesores](casos-uso/0-Administrador/importarProfesores/README.md) - Diseño de carga masiva.
- [eliminarProfesor](casos-uso/0-Administrador/eliminarProfesor/README.md) - Diseño de borrado.
- [crearProfesor](casos-uso/0-Administrador/crearProfesor/README.md) - Diseño de registro.
- [editarProfesor](casos-uso/0-Administrador/editarProfesor/README.md) - Diseño de modificación.
- [listarConflictosExamenes](casos-uso/0-Administrador/listarConflictosExamenes/README.md) - Diseño de detección de solapamientos.
- [asignarProfesorAExamen](casos-uso/0-Administrador/asignarProfesorAExamen/README.md) - Diseño de vinculación de supervisor.

#### Procesos del sistema

- **Trazabilidad estricta**: Cada clase de diseño debe mapearse a una o más clases de análisis.
- **Tipado fuerte**: Uso de TypeScript en todo el stack para minimizar errores en tiempo de ejecución.
- **Patrón Repository**: Abstracción del acceso a datos para facilitar el mantenimiento y pruebas.

## Referencias

- [Disciplina de Análisis](/RUP/01-analisis/README.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del Dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño y codificación
