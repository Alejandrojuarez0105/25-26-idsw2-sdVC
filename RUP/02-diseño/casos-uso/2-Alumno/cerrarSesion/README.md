<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/2-Alumno/DiagramaDeContextoAlumno.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/2-Alumno/cerrarSesion/README.md)|**Diseño**|Implementación|Pruebas|
|-|-|-|-|-|-|

</div>

# Davidario > cerrarSesion > Diseño (Alumno)

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-10
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `cerrarSesion()` para el actor **Alumno** mediante la arquitectura React + NestJS. Reutiliza la estrategia de invalidación de tokens y limpieza de estado ya aprobada para el Administrador y el Profesor; la única adaptación es la **navegación** de retorno (desde el espacio `/alumno/*` hacia `/login`).

## artefactos de diseño

### diagrama de secuencia de diseño

Interacción técnica para la limpieza de credenciales y redirección del actor.

<div align=center>

|![Diseño de Secuencia: cerrarSesion() (Alumno)](/images/02-diseño/casos-uso/2-Alumno/cerrarSesion/secuencia-diseño.svg)|
|-|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/2-Alumno/cerrarSesion/secuencia-diseño.puml)|

</div>

## arquitectura Frontend (React + TypeScript + Vite)

#### CerrarSesionView (Component)
- **Tecnología**: Functional Component (Confirm Modal/Page) **compartido** con Administrador y Profesor.
- **Responsabilidad**: Confirmar la intención del usuario y disparar la acción de logout.

#### useAuth (Hook)
- **Responsabilidad**:
  - Eliminar el token JWT del almacenamiento persistente del navegador (`LocalStorage` o `Cookies`).
  - Resetear el estado global de la aplicación (User Profile, rol Alumno).
  - Ejecutar la redirección programática hacia la pantalla de login.

## arquitectura Backend (NestJS + Prisma)

#### AuthController
- **Tecnología**: NestJS Controller (**compartido**).
- **Endpoint**: `POST /auth/logout` (opcional en sesiones stateless).
- **Responsabilidad**: Registrar la salida en logs de auditoría si fuera necesario.

## permisos y restricciones de acceso

- La operación es idéntica para todos los roles; tras el logout, el *guard* de rutas deniega cualquier acceso a `/alumno/*` hasta una nueva autenticación.

## flujo de datos

1. El Alumno confirma cerrar sesión en `CerrarSesionView`.
2. `useAuth.logout()` limpia el token y el perfil del almacenamiento del cliente.
3. (Opcional) `POST /auth/logout` para auditoría.
4. Redirección a `/login`; el estado de sesión queda invalidado.

## flujo alternativo

- **Cancelar**: el Alumno descarta la confirmación en `CerrarSesionView` → regresa a la vista anterior (`/alumno`) sin invalidar la sesión.

## componentes implicados

| Capa | Componente | Tecnología |
|---|---|---|
| Presentación | `CerrarSesionView`, `useAuth` | React + TS |
| API | `AuthController` (`POST /auth/logout`) | NestJS |
| Cliente | `LocalStorage / Storage API` | Browser API |

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `CerrarSesionView` | `CerrarSesionView (React)` | Componente de interacción de salida compartido. |
| `CerrarSesionController` | `useAuth (Hook)` | Lógica distribuida para limpieza de cliente. |
| `SesionRepository` | `LocalStorage / Storage API` | El repositorio de sesión se mapea al almacenamiento del cliente para JWT. |
| `SESION_CERRADA` | `React Router Redirect → /login` | La transición de estado se implementa mediante navegación forzada. |

## referencias

- [Análisis: cerrarSesion() (Alumno)](/RUP/01-analisis/casos-uso/2-Alumno/cerrarSesion/README.md)
- [Diseño Administrador: cerrarSesion()](../../0-Administrador/cerrarSesion/README.md) - Arquitectura base reutilizada.
- [Diseño Profesor: cerrarSesion()](../../1-Profesor/cerrarSesion/README.md) - Patrón de adaptación por rol.
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Alumno](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/2-Alumno/DiagramaDeContextoAlumno.svg)
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
