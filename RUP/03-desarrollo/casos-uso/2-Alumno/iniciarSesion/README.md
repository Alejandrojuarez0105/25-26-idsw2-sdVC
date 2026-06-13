# Davidario > iniciarSesion (Alumno) > Desarrollo

> |[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/2-Alumno/DiagramaDeContextoAlumno.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/3-CasosDeUsoComunes/iniciarSesion/iniciarSesion.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/2-Alumno/iniciarSesion/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/2-Alumno/iniciarSesion/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [auth.controller.ts](/src/backend/src/modules/auth/auth.controller.ts) · [auth.service.ts](/src/backend/src/modules/auth/auth.service.ts)
- **Frontend:** [LoginView.tsx](/src/frontend/src/features/auth/login/LoginView.tsx) · [useAuth.ts](/src/frontend/src/hooks/useAuth.ts) · [auth.service.ts](/src/frontend/src/services/auth.service.ts)

## Descripción
Acceso al sistema para el actor **Alumno**. **No se implementó código nuevo**: el inicio de sesión ya está resuelto de forma multi-rol mediante JWT (compartido con Admin y Profesor). Este documento registra cómo el mismo flujo sirve al rol Alumno.

## Estado
✅ **Documentado** — reutiliza la implementación multi-rol existente (sin cambios).

## Implementación reutilizada (sin modificar)
- **Backend** `POST /auth/login` (`AuthController` → `AuthService.authenticate`): valida credenciales con Bcrypt y firma un JWT con payload `{ email, sub, rol }`. El campo `rol` proviene de `Usuario.rol` (`Admin | Profesor | Alumno`).
- **Frontend** `LoginView` + `useAuth.login()`: almacena `token` y `user` en `localStorage` y **redirige según el rol**: `rol === 'Alumno'` → `/alumno`.

## Autorización por rol (clave de la rama Alumno)
- El token emitido para un usuario Alumno es el que consumen los endpoints `/alumno/*` (vía `AlumnoJwtGuard`, documentado en consultarCalendario/descargarCalendarioExamenes).
- La autorización se basa **únicamente en el rol del JWT**: funciona con cualquier usuario cuyo `rol` sea `Alumno` (p. ej. `alumno@davidario.edu`, `ana.garcia@alumnos.uneatlantico.es`), sin validaciones por email.

## Verificación realizada (en caliente)
- Login con `alumno@davidario.edu` y `ana.garcia@alumnos.uneatlantico.es` (rol Alumno) → token emitido con `rol: Alumno`; redirección a `/alumno`.

## Notas
- No se modificó `AuthController`, `AuthService`, la configuración del JWT ni `useAuth`. La cobertura del rol Alumno es trazabilidad documental sobre el flujo ya existente.

## Referencias
- [Diseño: iniciarSesion (Alumno)](/RUP/02-diseño/casos-uso/2-Alumno/iniciarSesion/README.md)
- [Desarrollo: iniciarSesion (Profesor)](/RUP/03-desarrollo/casos-uso/1-Profesor/iniciarSesion/README.md)
- [AGENTES.md](/AGENTES.md)
