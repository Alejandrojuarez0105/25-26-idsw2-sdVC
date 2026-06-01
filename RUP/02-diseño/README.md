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

|![Diagrama de Arquitectura](/images/02-diseño/casos-uso/arquitectura-davidario.svg)|
|:-:|
|[Código PlantUML](/modelosUML/02-diseño/arquitectura.puml)|

</div>

### Diagrama de clases de diseño (dominio y datos)

Modelado detallado de entidades, tipos de datos técnicos y esquemas de persistencia.

<div align=center>

|![Diagrama de Clases de Diseño](/images/02-diseño/casos-uso/clases-diseño-davidario.svg)|
|:-:|
|[Código PlantUML](/modelosUML/02-diseño/clases-diseño.puml)|

</div>

## Configuración y Estructura del Proyecto

El proyecto se organiza bajo un patrón de repositorio moderno facilitando la separación de capas:

*   **/src/frontend**: Aplicación React con Vite.
*   **/src/backend**: Aplicación NestJS (Módulos, Controladores, Servicios).
*   **/src/shared**: Tipos TypeScript compartidos y DTOs comunes.
*   **/prisma**: Esquemas de base de datos y migraciones (en caso de usar Prisma).

## Diseño de Casos de Uso

El diseño detallado de cada caso de uso se organiza en subcarpetas por actor dentro de [casos-uso](casos-uso/README.md):

### Actor Administrador

#### Gestión del Sistema
*(Se irá completando progresivamente)*

#### Gestión de Entidades
*(Se irá completando progresivamente)*

## Metodología de Diseño

- **Trazabilidad estricta**: Cada clase de diseño debe mapearse a una o más clases de análisis.
- **Tipado fuerte**: Uso de TypeScript en todo el stack para minimizar errores en tiempo de ejecución.
- **Patrón Repository**: Abstracción del acceso a datos para facilitar el mantenimiento y pruebas.

## Referencias

- [Disciplina de Análisis](/RUP/01-analisis/README.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del Dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño y codificación
