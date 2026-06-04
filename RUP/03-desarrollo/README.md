|[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/README.md)|[📂 Diseño](/RUP/02-diseño/README.md)|**Desarrollo**|Pruebas|
|-|-|-|-|-|-|-|

# Desarrollo - Disciplina de Implementación

Esta sección documenta la fase de **Desarrollo** del sistema **Davidario**, donde se materializa el diseño técnico en código fuente ejecutable, siguiendo un enfoque de construcción incremental basado en casos de uso.

## Entorno de Desarrollo y Stack Oficial

La implementación se realiza bajo un stack unificado en TypeScript para garantizar la coherencia y el tipado fuerte en todas las capas.

### Core Tecnológico
- **Lenguaje**: TypeScript 5.x
- **Frontend**: React 18 (Vite) + Tailwind/CSS
- **Backend**: NestJS 10 (Node.js)
- **Persistencia**: PostgreSQL 16
- **ORM**: Prisma ORM

### Herramientas de Construcción
- **Package Manager**: npm
- **Database Client**: Prisma Client (Autogenerado)
- **API Client**: Axios con Interceptores
- **Seguridad**: JWT (Passport) + Bcrypt para hashing

## Estructura de la Solución

El código fuente se organiza de forma desacoplada para facilitar la mantenibilidad y el despliegue independiente.

- **[/src/backend](/src/backend)**: Servidor de API REST y lógica de negocio.
- **[/src/frontend](/src/frontend)**: Aplicación cliente SPA.

## Estrategia de Implementación

1.  **Enfoque Incremental**: La construcción se realiza ramillete a ramillete, priorizando la infraestructura de seguridad y gestión base.
2.  **Trazabilidad RUP**: Cada componente desarrollado referencia a su correspondiente artefacto de Diseño y Requisitos.
3.  **Clean Code**: Aplicación de principios SOLID y patrones arquitectónicos nativos de NestJS (Módulos, Inyección de Dependencias).
4.  **Validación Continua**: Uso de DTOs y Pipes de validación para asegurar la integridad de los datos en el punto de entrada.

## Casos de Uso Implementados

A continuación se detallan las especificaciones de implementación por actor y caso de uso:

### Actor Administrador

#### Gestión del Sistema
- [iniciarSesion](casos-uso/0-Administrador/iniciarSesion/README.md) - Implementación del flujo de autenticación y redirección.
- [cerrarSesion](casos-uso/0-Administrador/cerrarSesion/README.md) - Implementación de la finalización de sesión y limpieza de tokens.

#### Gestión de Entidades
- [abrirGrados](casos-uso/0-Administrador/abrirGrados/README.md) - Implementación de la vista de listado de grados académicos.
- [importarGrados](casos-uso/0-Administrador/importarGrados/README.md) - Implementación de la carga masiva mediante archivos CSV.
- [eliminarGrado](casos-uso/0-Administrador/eliminarGrado/README.md) - Implementación del borrado seguro y controlado.
- [crearGrado](casos-uso/0-Administrador/crearGrado/README.md) - Implementación del alta de nuevos grados académicos.
- [editarGrado](casos-uso/0-Administrador/editarGrado/README.md) - Implementación de la edición de grados académicos.

## Referencias

- [Guía de Configuración y Scaffolding](/RUP/02-diseño/configuración-proyecto.md)
- [Disciplina de Diseño](/RUP/02-diseño/README.md)
- [Código Fuente Principal](/src/README.md)
- [AGENTES.md](/AGENTES.md) - Estándares de codificación
