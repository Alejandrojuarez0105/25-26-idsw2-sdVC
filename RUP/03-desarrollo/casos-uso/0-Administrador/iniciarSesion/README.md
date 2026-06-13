# Davidario > iniciarSesion > Desarrollo

> |[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/3-CasosDeUsoComunes/iniciarSesion/iniciarSesion.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/iniciarSesion/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/iniciarSesion/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [auth.controller.ts](/src/backend/src/modules/auth/auth.controller.ts) · [auth.service.ts](/src/backend/src/modules/auth/auth.service.ts) · [schema.prisma](/src/backend/prisma/schema.prisma)
- **Frontend:** [LoginView.tsx](/src/frontend/src/features/auth/login/LoginView.tsx) · [auth.service.ts](/src/frontend/src/services/auth.service.ts) · [useAuth.ts](/src/frontend/src/hooks/useAuth.ts)

## Descripción
Autenticación de usuarios mediante JWT (JSON Web Tokens). El sistema valida las credenciales (email y password) contra la base de datos PostgreSQL 16 y genera un token de acceso firmado para las peticiones subsecuentes, permitiendo una gestión de sesión stateless.

## Estado
✅ **Completado** - Iteración 1

## Backend

### Endpoints

#### POST `/auth/login`
Autentica al usuario y retorna el token JWT junto con los datos básicos del perfil para la personalización del cliente.

**Request:**
```json
{
  "email": "admin@davidario.edu",
  "password": "admin123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGci...",
  "user": {
    "id": "uuid-v4-string",
    "nombre": "Administrador",
    "apellido": "Sistema",
    "email": "admin@davidario.edu",
    "rol": "Admin"
  }
}
```

### Implementación
- **Framework**: NestJS v10
- **Seguridad**: Passport JWT + Bcrypt para el hashing de contraseñas.
- **Persistencia**: Prisma ORM con PostgreSQL 16 (integrando UUIDs).
- **Validación**: DTOs técnicos con class-validator para asegurar la integridad del payload.

---

## Frontend

### Implementación
- **Framework**: React v18 (Vite)
- **Gestión de Estado**: Custom Hook `useAuth` con persistencia en `localStorage`.
- **UI**: CSS inline y componentes funcionales con tipado TypeScript.

#### LoginView Component
- Formulario controlado con gestión de estados de error y carga.
- Integración directa con el hook de autenticación.
- Layout minimalista alineado con los prototipos del Administrador.

#### useAuth Hook
- Centraliza la lógica de login/logout.
- Gestiona la persistencia del token y el objeto `user` en el navegador.
- Realiza la redirección programática basada en el rol del usuario (`Navigate` de React Router).

---

## Testing

### Backend (cURL)
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@davidario.edu", "password": "admin123"}' | jq
```

## Notas de implementación
- Se ha configurado un interceptor en el frontend (`core/api.ts`) que adjunta automáticamente el token Bearer en la cabecera `Authorization` de todas las peticiones salientes.
- La base de datos utiliza un trigger de auditoría para mantener actualizada la `fechaActualizacion` de los perfiles de usuario.
- El sistema de roles está tipado mediante Enums tanto en el esquema Prisma como en TypeScript.
