# Davidario > cerrarSesion > Desarrollo

> |[🏠️](/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/3-CasosDeUsoComunes/cerrarSesion/cerrarSesion.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/cerrarSesion/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/cerrarSesion/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Frontend:** [LogoutView.tsx](/src/frontend/src/features/auth/logout/LogoutView.tsx) · [AdminDashboard.tsx](/src/frontend/src/features/admin/AdminDashboard.tsx) · [ProfesorDashboard.tsx](/src/frontend/src/features/profesor/ProfesorDashboard.tsx) · [AlumnoDashboard.tsx](/src/frontend/src/features/alumno/AlumnoDashboard.tsx) · [useAuth.ts](/src/frontend/src/hooks/useAuth.ts) · [auth.service.ts](/src/frontend/src/services/auth.service.ts)

## Descripción
Finalización de la sesión autenticada del usuario. Siguiendo una arquitectura JWT stateless, el proceso consiste en la eliminación de las credenciales (token) y datos de perfil del almacenamiento local del cliente, invalidando cualquier petición subsecuente. Se implementa una vista de confirmación dedicada que respeta el diseño institucional de la universidad.

## Estado
✅ **Completado** - Iteración 2 (Ajuste visual según prototipo)

## Backend
### Implementación
- El backend no requiere endpoints adicionales para el cierre de sesión debido al uso de **JWT stateless**. 
- La seguridad se garantiza al dejar de enviar el token desde el cliente, ya que el servidor no mantiene un estado persistente de la sesión.

---

## Frontend
### Implementación
- **Framework**: React v18 (Vite)
- **Gestión de Estado**: Custom Hook `useAuth` que encapsula la lógica de limpieza.
- **Vista Dedicada**: `LogoutView.tsx` que replica fielmente el prototipo HTML institucional.

#### LogoutView Component
- Centraliza la interacción de confirmación de salida.
- Muestra dinámicamente el **email** y **rol** del usuario que está cerrando la sesión.
- Proporciona las opciones "Cancelar" (vuelve a la pantalla anterior) y "Sí, Cerrar Sesión" (ejecuta el logout).

#### Dashboards (Admin, Profesor, Alumno)
- Los tres paneles de control incluyen un botón "Cerrar sesión" en el encabezado.
- Redirigen programáticamente a la ruta `/logout`.

#### useAuth Hook
- Implementa el método `logout()`.
- Llama a `authService.logout()` para la limpieza de datos.
- Ejecuta `navigate('/login')` para devolver al usuario al estado inicial del sistema.

#### authService
- Método `logout()`: Ejecuta `localStorage.removeItem('token')` y `localStorage.removeItem('user')`.

---

## Flujo de ejecución
1. El usuario hace clic en **🚪 Cerrar sesión** desde cualquier dashboard.
2. El sistema navega a la ruta `/logout`.
3. Se presenta la **LogoutView** con el diseño institucional y la información de la sesión actual.
4. El usuario toma una decisión:
   - **Cancelar**: Se utiliza `navigate(-1)` para volver a la gestión anterior.
   - **Confirmar**: 
     - Se eliminan las entradas `token` y `user` de `localStorage`.
     - Se resetea el estado de navegación.
     - El usuario es redirigido automáticamente a la ruta `/login`.

## Resultado obtenido
El caso de uso cumple con la fidelidad visual del prototipo institucional. La transición de estados y la limpieza de credenciales aseguran un cierre de sesión seguro y coherente con la identidad visual del proyecto Davidario.
