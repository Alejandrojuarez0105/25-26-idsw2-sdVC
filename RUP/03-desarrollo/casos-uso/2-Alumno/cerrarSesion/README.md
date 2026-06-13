# Davidario > cerrarSesion (Alumno) > Desarrollo

> |[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/2-Alumno/DiagramaDeContextoAlumno.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/3-CasosDeUsoComunes/cerrarSesion/cerrarSesion.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/2-Alumno/cerrarSesion/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/2-Alumno/cerrarSesion/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Frontend:** [LogoutView.tsx](/src/frontend/src/features/auth/logout/LogoutView.tsx) · [useAuth.ts](/src/frontend/src/hooks/useAuth.ts) · [auth.service.ts](/src/frontend/src/services/auth.service.ts)

## Descripción
Cierre de sesión para el actor **Alumno**. **No se implementó código nuevo**: el logout ya está resuelto de forma multi-rol. Este documento registra su aplicación al rol Alumno.

## Estado
✅ **Documentado** — reutiliza la implementación multi-rol existente (sin cambios).

## Implementación reutilizada (sin modificar)
- **Frontend** `LogoutView` + `useAuth.logout()` → `authService.logout()`: elimina `token` y `user` de `localStorage` y redirige a `/login`.
- El botón **🚪 Cerrar sesión** del `AlumnoDashboard` navega a `/logout`, mostrando la pantalla de confirmación común con la sesión actual (email y rol).
- Sesión **stateless** basada en JWT: no requiere endpoint de backend (el token simplemente deja de enviarse). La invalidación es del lado cliente.

## Notas
- No se modificó `LogoutView`, `useAuth` ni `authService`. La cobertura del rol Alumno es trazabilidad documental sobre el flujo ya existente.

## Referencias
- [Diseño: cerrarSesion (Alumno)](/RUP/02-diseño/casos-uso/2-Alumno/cerrarSesion/README.md)
- [Desarrollo: cerrarSesion (Profesor)](/RUP/03-desarrollo/casos-uso/1-Profesor/cerrarSesion/README.md)
- [AGENTES.md](/AGENTES.md)
