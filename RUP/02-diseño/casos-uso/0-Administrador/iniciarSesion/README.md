<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/iniciarSesion/README.md)|**Diseño**|Implementación|Pruebas|
|-|-|-|-|-|-|

</div>

# Davidario > iniciarSesion > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 02/06/2026
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `iniciarSesion()` mediante la arquitectura React + NestJS + PostgreSQL. Define los componentes de interfaz, servicios de API, lógica de autenticación y persistencia de datos necesarios para el acceso seguro al sistema.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: iniciarSesion()](/images/02-diseño/casos-uso/0-Administrador/iniciarSesion/secuencia-diseño.svg)|
|-|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/iniciarSesion/secuencia-diseño.puml)|

</div>

## especificación de componentes

### frontend (react)

#### LoginView (Component)
- **Tecnología**: Functional Component (TSX).
- **Responsabilidad**: Renderizar el formulario de acceso y gestionar los eventos de entrada del usuario.
- **Hook**: Utiliza `useAuth()` para disparar la lógica de autenticación.

#### useAuth (Hook)
- **Responsabilidad**: Gestionar el estado de la sesión en el cliente (token JWT, perfil de usuario).
- **Servicio**: Invoca a `AuthService` para la comunicación con el backend.

### backend (nestjs)

#### AuthController
- **Tecnología**: NestJS Controller.
- **Endpoint**: `POST /auth/login`.
- **DTO**: Recibe `LoginDTO` (email, password).

#### AuthService
- **Responsabilidad**: 
  - Validar credenciales mediante `UsersService`.
  - Comparar hashes de contraseñas (Bcrypt/Argon2).
  - Generar y firmar tokens JWT.

#### UsersService
- **Responsabilidad**: Consultar la base de datos mediante el ORM (Prisma/TypeORM) para localizar al usuario por su email.

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `LoginView` | `LoginView (React)` | Implementación como componente de UI. |
| `IniciarSesionController` | `AuthController + AuthService (NestJS)` | Separación en controlador de API y lógica de servicio. |
| `UsuarioRepository` | `UsersService + Prisma/TypeORM` | Abstracción de acceso a datos mediante ORM. |
| `Sesion` | `useAuth + JWT` | Gestión de sesión stateless mediante tokens y hooks de estado. |

## referencias

- [Análisis: iniciarSesion()](/RUP/01-analisis/casos-uso/0-Administrador/iniciarSesion/README.md)
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Diagramas de Clases](/images/02-diseño/clases-diseño.svg) - Diseño Global
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
