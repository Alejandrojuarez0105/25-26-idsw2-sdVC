<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/1-Profesor/DiagramaDeContextoProfesor.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/1-Profesor/iniciarSesion/README.md)|**Diseño**|[Implementación](/RUP/03-desarrollo/casos-uso/1-Profesor/iniciarSesion/README.md)|Pruebas|
|-|-|-|-|-|-|

</div>

# Davidario > iniciarSesion > Diseño (Profesor)

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-09
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `iniciarSesion()` para el actor **Profesor** mediante la arquitectura React + NestJS + PostgreSQL. Reutiliza íntegramente la arquitectura de autenticación ya aprobada para el Administrador (mismo endpoint, mismo `AuthService`, mismo JWT); la única diferencia es el **rol** codificado en el token (`RolUsuario.Profesor`), que determina la **navegación** posterior (dashboard de profesor) y las **restricciones de acceso** a las rutas protegidas.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: iniciarSesion() (Profesor)](/images/02-diseño/casos-uso/1-Profesor/iniciarSesion/secuencia-diseño.svg)|
|-|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/1-Profesor/iniciarSesion/secuencia-diseño.puml)|

</div>

## arquitectura Frontend (React + TypeScript + Vite)

#### LoginView (Component)
- **Tecnología**: Functional Component (TSX) **compartido** con el Administrador (no se duplica).
- **Responsabilidad**: Renderizar el formulario de acceso y gestionar los eventos de entrada del usuario.
- **Hook**: Utiliza `useAuth()` para disparar la lógica de autenticación.

#### useAuth (Hook)
- **Responsabilidad**: Gestionar el estado de la sesión en el cliente (token JWT, perfil de usuario) y, tras un login exitoso, **leer el `rol`** del usuario para redirigir programáticamente al dashboard correspondiente (`/profesor` cuando `rol === 'Profesor'`).
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
  - Generar y firmar el token JWT incluyendo el claim `rol` (`Profesor`), reutilizado por los *guards* de las rutas restringidas.

#### UsersService / PrismaService
- **Responsabilidad**: Consultar `Usuario` por su email mediante Prisma. La autenticación es agnóstica del rol; el rol solo condiciona la navegación y los permisos posteriores.

## permisos y restricciones de acceso

- El token emitido para un Profesor habilita únicamente las rutas del espacio `/profesor/*` (consulta de calendario, descarga e incidencias).
- Las rutas administrativas (`/admin/*`) quedan denegadas mediante el *guard* de roles, devolviendo `403 Forbidden`.

## flujo de datos

1. El Profesor introduce credenciales en `LoginView`.
2. `useAuth.login()` → `AuthService.authenticate()` → `POST /auth/login`.
3. `AuthController` → `AuthService.validateUser()` → `UsersService.findByEmail()` → `PrismaService`.
4. Verificación de contraseña y firma del JWT con `rol: Profesor`.
5. El hook almacena el token, detecta el rol y redirige a `/profesor`.

## componentes implicados

| Capa | Componente | Tecnología |
|---|---|---|
| Presentación | `LoginView`, `useAuth` | React + TS |
| API | `AuthController` (`POST /auth/login`) | NestJS |
| Aplicación | `AuthService`, `UsersService` | NestJS |
| Persistencia | `PrismaService` | Prisma ORM |
| Datos | `Usuario` (`rol = Profesor`) | PostgreSQL 16 |

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `LoginView` | `LoginView (React)` | Implementación como componente de UI compartido. |
| `IniciarSesionController` | `AuthController + AuthService (NestJS)` | Separación en controlador de API y lógica de servicio. |
| `UsuarioRepository` | `UsersService + Prisma` | Abstracción de acceso a datos mediante ORM. |
| `Sesion` | `useAuth + JWT (claim rol)` | Sesión stateless; el rol dirige navegación y permisos. |
| `:Sistema Disponible` | `React Router → /profesor` | Transición de estado mediante redirección por rol. |

## referencias

- [Análisis: iniciarSesion() (Profesor)](/RUP/01-analisis/casos-uso/1-Profesor/iniciarSesion/README.md)
- [Diseño Administrador: iniciarSesion()](../../0-Administrador/iniciarSesion/README.md) - Arquitectura base reutilizada.
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Profesor](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/1-Profesor/DiagramaDeContextoProfesor.svg)
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
