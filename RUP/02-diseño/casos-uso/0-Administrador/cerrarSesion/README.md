<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/cerrarSesion/README.md)|**Diseño**|[Implementación](/RUP/03-desarrollo/casos-uso/0-Administrador/cerrarSesion/README.md)|Pruebas|
|-|-|-|-|-|-|

</div>

# Davidario > cerrarSesion > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 02/06/2026
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `cerrarSesion()` mediante la arquitectura React + NestJS. Define la estrategia de invalidación de tokens en el cliente y la limpieza de estados de sesión para asegurar una salida controlada del sistema.

## artefactos de diseño

### diagrama de secuencia de diseño

Interacción técnica para la limpieza de credenciales y redirección del actor.

<div align=center>

|![Diseño de Secuencia: cerrarSesion()](/images/02-diseño/casos-uso/0-Administrador/cerrarSesion/secuencia-diseño.svg)|
|-|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/cerrarSesion/secuencia-diseño.puml)|

</div>

## especificación de componentes

### frontend (react)

#### CerrarSesionView (Component)
- **Tecnología**: Functional Component (Confirm Modal/Page).
- **Responsabilidad**: Confirmar la intención del usuario y disparar la acción de logout.

#### useAuth (Hook)
- **Responsabilidad**: 
  - Eliminar el token JWT del almacenamiento persistente del navegador (`LocalStorage` o `Cookies`).
  - Resetear el estado global de la aplicación (User Profile).
  - Ejecutar la redirección programática hacia la pantalla de login.

### backend (nestjs)

#### AuthController
- **Tecnología**: NestJS Controller.
- **Endpoint**: `POST /auth/logout` (Opcional en sesiones stateless).
- **Responsabilidad**: Registrar la salida en logs de auditoría si fuera necesario.

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `CerrarSesionView` | `CerrarSesionView (React)` | Componente de interacción de salida. |
| `CerrarSesionController` | `useAuth (Hook)` | Lógica distribuida para limpieza de cliente. |
| `SesionRepository` | `LocalStorage / Storage API` | El repositorio de sesión en diseño se mapea al almacenamiento del cliente para JWT. |
| `SESION_CERRADA` | `React Router Redirect` | La transición de estado se implementa mediante navegación forzada a `/login`. |

## referencias

- [Análisis: cerrarSesion()](/RUP/01-analisis/casos-uso/0-Administrador/cerrarSesion/README.md)
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Diagramas de Clases](/images/02-diseño/clases-diseño.svg) - Diseño Global
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
