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

## Stack Tecnológico

El diseño del sistema se fundamenta en las siguientes tecnologías:

### Frontend
- **Framework**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Estilo**: CSS modular y componentes reutilizables.

### Backend
- **Framework**: [NestJS](https://nestjs.com/) (Node.js + TypeScript)
- **Arquitectura**: Basada en módulos, controladores y servicios.
- **ORM**: [Prisma](https://www.prisma.io/) o [TypeORM](https://typeorm.io/) (orientado a PostgreSQL).

### Base de Datos
- **Motor**: [PostgreSQL 16](https://www.postgresql.org/)
- **Gestión**: pgAdmin para administración y monitoreo.

## Arquitectura de Diseño

El sistema sigue una arquitectura de **Capas Técnicas** que extiende el patrón MVC de análisis:

1.  **Capa de Presentación (Frontend)**: Componentes React que implementan las vistas (Boundary) identificadas.
2.  **Capa de API (Backend - Controllers)**: Endpoints NestJS que actúan como controladores de diseño.
3.  **Capa de Lógica de Negocio (Backend - Services)**: Servicios NestJS que encapsulan la lógica compleja.
4.  **Capa de Persistencia (Backend - Repositories/ORM)**: Mapeo de entidades a la base de datos relacional.

## Artefactos de Diseño

Para cada caso de uso se desarrollarán los siguientes artefactos:

- **Diagramas de Clase de Diseño**: Detalle de atributos, métodos y tipos de datos (TypeScript).
- **Diagramas de Secuencia de Diseño**: Interacción entre componentes de React, Controladores NestJS y la Base de Datos.
- **Modelo Físico de Datos**: Esquema de tablas, llaves primarias y foráneas en PostgreSQL.
- **Contratos de API**: Definición de objetos Request/Response (JSON).

## Cobertura de Diseño

### Actor Administrador
*(Se irán incorporando los diseños detallados de los 39 casos de uso analizados)*

- **Gestión del Sistema**:
  - [iniciarSesion](casos-uso/0-Administrador/iniciarSesion/README.md)
  - [cerrarSesion](casos-uso/0-Administrador/cerrarSesion/README.md)
- **Gestión de Entidades**:
  - [Grados](casos-uso/0-Administrador/abrirGrados/README.md)
  - [Asignaturas](casos-uso/0-Administrador/abrirAsignaturas/README.md)
  - [Exámenes](casos-uso/0-Administrador/abrirExamenes/README.md)
  - [Aulas](casos-uso/0-Administrador/abrirAulas/README.md)
  - [Profesores](casos-uso/0-Administrador/abrirProfesores/README.md)
  - [Alumnos](casos-uso/0-Administrador/abrirAlumnos/README.md)

## Metodología de Diseño

- **Trazabilidad estricta**: Cada clase de diseño debe mapearse a una o más clases de análisis.
- **Tipado fuerte**: Uso de TypeScript en todo el stack para minimizar errores en tiempo de ejecución.
- **Patrón Repository**: Abstracción del acceso a datos para facilitar el mantenimiento y pruebas.

## Referencias

- [Disciplina de Análisis](/RUP/01-analisis/README.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño y codificación
