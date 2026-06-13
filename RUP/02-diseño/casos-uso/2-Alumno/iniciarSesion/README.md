<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/2-Alumno/DiagramaDeContextoAlumno.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/2-Alumno/iniciarSesion/README.md)|**Diseño**|[Implementación](/RUP/03-desarrollo/casos-uso/2-Alumno/iniciarSesion/README.md)|Pruebas|
|-|-|-|-|-|-|

</div>

# Davidario > iniciarSesion > Diseño (Alumno)

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-10
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `iniciarSesion()` para el actor **Alumno** mediante la arquitectura React + NestJS + PostgreSQL. Reutiliza íntegramente la arquitectura de autenticación ya aprobada para el Administrador y el Profesor (mismo endpoint, mismo `AuthService`, mismo JWT); la única diferencia es el **rol** codificado en el token (`RolUsuario.Alumno`), que determina la **navegación** posterior (dashboard de alumno) y las **restricciones de acceso** a las rutas protegidas.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: iniciarSesion() (Alumno)](/images/02-diseño/casos-uso/2-Alumno/iniciarSesion/secuencia-diseño.svg)|
|-|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/2-Alumno/iniciarSesion/secuencia-diseño.puml)|

</div>

## arquitectura Frontend (React + TypeScript + Vite)

#### LoginView (Component)
- **Tecnología**: Functional Component (TSX) **compartido** con Administrador y Profesor (no se duplica).
- **Responsabilidad**: Renderizar el formulario de acceso y gestionar los eventos de entrada del usuario.
- **Hook**: Utiliza `useAuth()` para disparar la lógica de autenticación.

#### useAuth (Hook)
- **Responsabilidad**: Gestionar el estado de la sesión en el cliente (token JWT, perfil de usuario) y, tras un login exitoso, **leer el `rol`** del usuario para redirigir programáticamente al dashboard correspondiente (`/alumno` cuando `rol === 'Alumno'`).
- **Servicio**: Invoca a `AuthService` para la comunicación con el backend.

## arquitectura Backend (NestJS + Prisma)

#### AuthController
- **Tecnología**: NestJS Controller (**compartido**).
- **Endpoint**: `POST /auth/login`.
- **DTO**: Recibe `LoginDTO` (email, password).

#### AuthService
- **Responsabilidad**:
  - Validar credenciales mediante `UsersService`.
  - Comparar hashes de contraseñas (Bcrypt/Argon2).
  - Generar y firmar el token JWT incluyendo el claim `rol` (`Alumno`), reutilizado por los *guards* de las rutas restringidas.

#### UsersService / PrismaService
- **Responsabilidad**: Consultar `Usuario` por su email mediante Prisma. La autenticación es agnóstica del rol; el rol solo condiciona la navegación y los permisos posteriores.

## permisos y restricciones de acceso

- El token emitido para un Alumno habilita únicamente las rutas del espacio `/alumno/*` (consulta y descarga de su calendario).
- Las rutas administrativas (`/admin/*`) y de profesor (`/profesor/*`) quedan denegadas mediante el *guard* de roles, devolviendo `403 Forbidden`.

## flujo de datos

1. El Alumno introduce credenciales en `LoginView`.
2. `useAuth.login()` → `AuthService.authenticate()` → `POST /auth/login`.
3. `AuthController` → `AuthService.validateUser()` → `UsersService.findByEmail()` → `PrismaService`.
4. Verificación de contraseña y firma del JWT con `rol: Alumno`.
5. El hook almacena el token, detecta el rol y redirige a `/alumno`.

## flujo alternativo

- **Credenciales inválidas**: `AuthService` no encuentra el usuario o el hash no coincide → `401 Unauthorized`; `useAuth` expone el error y `LoginView` muestra el aviso, permaneciendo en `/login`.

## componentes implicados

| Capa | Componente | Tecnología |
|---|---|---|
| Presentación | `LoginView`, `useAuth` | React + TS |
| API | `AuthController` (`POST /auth/login`) | NestJS |
| Aplicación | `AuthService`, `UsersService` | NestJS |
| Persistencia | `PrismaService` | Prisma ORM |
| Datos | `Usuario` (`rol = Alumno`) | PostgreSQL 16 |

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `LoginView` | `LoginView (React)` | Implementación como componente de UI compartido. |
| `IniciarSesionController` | `AuthController + AuthService (NestJS)` | Separación en controlador de API y lógica de servicio. |
| `UsuarioRepository` | `UsersService + Prisma` | Abstracción de acceso a datos mediante ORM. |
| `Sesion` | `useAuth + JWT (claim rol)` | Sesión stateless; el rol dirige navegación y permisos. |
| `:Sistema Disponible` | `React Router → /alumno` | Transición de estado mediante redirección por rol. |

## referencias

- [Análisis: iniciarSesion() (Alumno)](/RUP/01-analisis/casos-uso/2-Alumno/iniciarSesion/README.md)
- [Diseño Administrador: iniciarSesion()](../../0-Administrador/iniciarSesion/README.md) - Arquitectura base reutilizada.
- [Diseño Profesor: iniciarSesion()](../../1-Profesor/iniciarSesion/README.md) - Patrón de adaptación por rol.
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Alumno](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/2-Alumno/DiagramaDeContextoAlumno.svg)
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
