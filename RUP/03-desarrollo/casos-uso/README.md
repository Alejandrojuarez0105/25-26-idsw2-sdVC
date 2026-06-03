|[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/README.md)|[📂 Diseño](/RUP/02-diseño/README.md)|**Desarrollo**|Pruebas|
|-|-|-|-|-|-|-|

# Implementación de Casos de Uso

Esta carpeta centraliza los informes técnicos de implementación para cada caso de uso del sistema **Davidario**, detallando la codificación real en el stack React + NestJS.

## Casos de uso desarrollados

### Actor Administrador

#### Gestión del sistema
- [iniciarSesion](0-Administrador/iniciarSesion/README.md) - Implementación del acceso seguro.
- [cerrarSesion](0-Administrador/cerrarSesion/README.md) - Implementación de la finalización de sesión.

#### Gestión de entidades
- [abrirGrados](0-Administrador/abrirGrados/README.md) - Implementación de la vista de listado de grados.
- [importarGrados](0-Administrador/importarGrados/README.md) - Implementación de la carga masiva de grados.
- [eliminarGrado](0-Administrador/eliminarGrado/README.md) - Implementación de la funcionalidad de borrado.
- [crearGrado](0-Administrador/crearGrado/README.md) - Implementación del registro de nuevos grados.

#### Gestión de entidades
*(En desarrollo)*

### Actor Profesor
*(En desarrollo)*

### Actor Alumno
*(En desarrollo)*

## Estructura de cada informe de implementación

Cada documento `README.md` de esta sección incluye:

1.  **Backend**: Detalle de Controladores, Servicios, DTOs y lógica de persistencia.
2.  **Frontend**: Detalle de Componentes React, Hooks de estado y servicios de API.
3.  **Seguridad**: Mecanismos de protección aplicados (Guards, JWT).
4.  **Trazabilidad**: Referencia directa al código fuente en `/src`.
