# Davidario > iniciarSesion (Profesor) > Desarrollo

> |[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/1-Profesor/DiagramaDeContextoProfesor.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/3-CasosDeUsoComunes/iniciarSesion/iniciarSesion.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/1-Profesor/iniciarSesion/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/1-Profesor/iniciarSesion/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [auth.controller.ts](/src/backend/src/modules/auth/auth.controller.ts) · [auth.service.ts](/src/backend/src/modules/auth/auth.service.ts)
- **Frontend:** [LoginView.tsx](/src/frontend/src/features/auth/login/LoginView.tsx) · [useAuth.ts](/src/frontend/src/hooks/useAuth.ts) · [auth.service.ts](/src/frontend/src/services/auth.service.ts)

## Descripción
Acceso al sistema para el actor **Profesor**. **No se implementó código nuevo**: el inicio de sesión ya está resuelto de forma multi-rol mediante JWT (Sesión de Administrador). Este documento registra cómo el mismo flujo de autenticación sirve al rol Profesor.

## Estado
✅ **Documentado** — reutiliza la implementación multi-rol existente (sin cambios).

## Implementación reutilizada (sin modificar)
- **Backend** `POST /auth/login` (`AuthController` → `AuthService.authenticate`): valida credenciales con Bcrypt y firma un JWT con payload `{ email, sub, rol }`. El campo `rol` proviene de `Usuario.rol` (`Admin | Profesor | Alumno`).
- **Frontend** `LoginView` + `useAuth.login()`: almacena `token` y `user` en `localStorage` y **redirige según el rol**: `rol === 'Profesor'` → `/profesor`.

## Autorización por rol (clave de la rama Profesor)
- El token emitido para un usuario Profesor es el que consumen los endpoints `/profesor/*` (vía `ProfesorJwtGuard`, documentado en los casos de consulta/descarga/incidencias).
- La autorización se basa **únicamente en el rol del JWT**: funciona con cualquier usuario cuyo `rol` sea `Profesor` (p. ej. `profesor@davidario.edu`, `manuel.masias@uneatlantico.es`), sin validaciones por email.

## Notas
- No se modificó `AuthController`, `AuthService`, la configuración del JWT ni `useAuth`. La cobertura del rol Profesor es trazabilidad documental sobre el flujo ya existente.

## Referencias
- [Diseño: iniciarSesion (Profesor)](/RUP/02-diseño/casos-uso/1-Profesor/iniciarSesion/README.md)
- [Desarrollo: iniciarSesion (Administrador)](/RUP/03-desarrollo/casos-uso/0-Administrador/iniciarSesion/README.md)
- [AGENTES.md](/AGENTES.md)
