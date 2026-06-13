# Davidario > cerrarSesion (Profesor) > Desarrollo

> |[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/1-Profesor/DiagramaDeContextoProfesor.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/3-CasosDeUsoComunes/cerrarSesion/cerrarSesion.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/1-Profesor/cerrarSesion/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/1-Profesor/cerrarSesion/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Frontend:** [LogoutView.tsx](/src/frontend/src/features/auth/logout/LogoutView.tsx) · [useAuth.ts](/src/frontend/src/hooks/useAuth.ts) · [auth.service.ts](/src/frontend/src/services/auth.service.ts)

## Descripción
Cierre de sesión para el actor **Profesor**. **No se implementó código nuevo**: el logout ya está resuelto de forma multi-rol. Este documento registra su aplicación al rol Profesor.

## Estado
✅ **Documentado** — reutiliza la implementación multi-rol existente (sin cambios).

## Implementación reutilizada (sin modificar)
- **Frontend** `LogoutView` + `useAuth.logout()` → `authService.logout()`: elimina `token` y `user` de `localStorage` y redirige a `/login`.
- El botón **🚪 Cerrar sesión** del `ProfesorDashboard` navega a `/logout`, mostrando la pantalla de confirmación común con la sesión actual (email y rol).
- Sesión **stateless** basada en JWT: no requiere endpoint de backend (el token simplemente deja de enviarse). La invalidación es del lado cliente.

## Notas
- No se modificó `LogoutView`, `useAuth` ni `authService`. La cobertura del rol Profesor es trazabilidad documental sobre el flujo ya existente.

## Referencias
- [Diseño: cerrarSesion (Profesor)](/RUP/02-diseño/casos-uso/1-Profesor/cerrarSesion/README.md)
- [Desarrollo: cerrarSesion (Administrador)](/RUP/03-desarrollo/casos-uso/0-Administrador/cerrarSesion/README.md)
- [AGENTES.md](/AGENTES.md)
