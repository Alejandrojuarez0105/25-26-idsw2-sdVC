# Davidario > consultarCalendario (Profesor) > Desarrollo

> |[🏠️](/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/1-Profesor/DiagramaDeContextoProfesor.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/1-Profesor/consultarCalendario/consultarCalendario.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/1-Profesor/consultarCalendario/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/1-Profesor/consultarCalendario/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [profesor.controller.ts](/src/backend/src/modules/profesor/profesor.controller.ts) · [profesor-calendario.service.ts](/src/backend/src/modules/profesor/profesor-calendario.service.ts) · [profesor-jwt.guard.ts](/src/backend/src/modules/profesor/profesor-jwt.guard.ts) · [profesor.module.ts](/src/backend/src/modules/profesor/profesor.module.ts)
- **Frontend:** [ProfesorCalendarioView.tsx](/src/frontend/src/features/profesor/ProfesorCalendarioView.tsx) · [ProfesorDashboard.tsx](/src/frontend/src/features/profesor/ProfesorDashboard.tsx) · [profesor.service.ts](/src/frontend/src/services/profesor.service.ts)

## Descripción
Permite al **Profesor** consultar **únicamente los exámenes que tiene asignados** (fecha, hora, aula y asignatura). Reutiliza la lógica de consolidación del calendario del Administrador (`ExamenesService.consultarCalendario()`) y aplica el filtro por el profesor autenticado, obtenido del JWT. Operación de solo lectura.

## Estado
✅ **Completado** - Iteración 1 (verificado en caliente)

## Backend

### Endpoint
#### GET `/profesor/calendario`
Protegido por `ProfesorJwtGuard`. Devuelve el calendario del profesor autenticado.

**Response (200 OK):**
```json
{
  "generadoEn": "2026-06-09T20:04:55.564Z",
  "resumen": { "totalExamenes": 1, "aulasUtilizadas": 1, "asignaturas": 1, "conConflicto": 0 },
  "examenes": [
    {
      "id": "uuid", "codigo": "EX001", "asignatura": "Programación I",
      "fecha": "2026-01-15", "hora": "08:30", "aula": "1.3", "aulaId": "uuid",
      "profesor": "Manuel Masías", "profesorId": "uuid",
      "tieneConflicto": false, "tiposConflicto": []
    }
  ]
}
```

### Implementación
- **Módulo nuevo `ProfesorModule`** (aditivo): importa `ExamenesModule` (reutiliza `ExamenesService`) y registra `JwtModule` con el **mismo secreto** de autenticación. Registrado en `AppModule` sin tocar los módulos existentes.
- **`ProfesorJwtGuard`**: lee el `Authorization: Bearer`, verifica el JWT con `JwtService`, exige `rol === 'Profesor'` y resuelve el `Profesor` por `usuarioId = payload.sub` (relación `Usuario` 1—1 `Profesor`), adjuntándolo a `request.profesor`. **Autorización basada solo en el rol del JWT** — sin validaciones por email.
- **`ProfesorCalendarioService.consultarCalendario(profesorId)`**: invoca el método público `ExamenesService.consultarCalendario()` (sin duplicar lógica) y **filtra** `examenes` por `profesorId`, recalculando un resumen propio (`totalExamenes`, `asignaturas`, `aulasUtilizadas`, `conConflicto`).
- **Sin cambios** en `ExamenesController`/`ExamenesService` ni en autenticación/JWT.

## Frontend

### Implementación
- **React** `ProfesorCalendarioView` (estilo Courier New, coherente con la `ConsultarCalendarioView` del Administrador) con máquina de estados `loading | error | success`:
  - **loading**: spinner.
  - **error**: panel rojo técnico con **🔄 Reintentar** / **🚪 Volver al panel**.
  - **success sin exámenes**: aviso "📭 No tiene exámenes asignados".
  - **success con exámenes**: tabla `FECHA / HORA / ASIGNATURA / AULA / ESTADO` (filas en conflicto resaltadas), aviso de conflictos con enlace a incidencias, panel **📊 Resumen de mi calendario** y botones **📎 Descargar Calendario** / **⚠️ Comunicar incidencia** / **🚪 Volver al panel**.
- **Ruta**: `/profesor/calendario` (registrada en `App.tsx`).
- **`profesor.service.ts`**: método `consultarCalendario()` → `GET /profesor/calendario`; interfaz `CalendarioProfesor`.

### Integración con el Dashboard del Profesor
- La tarjeta **📅 Mi Calendario** y el enlace **Ver mi calendario →** navegan a `/profesor/calendario` (antes mostraban `alert`).
- El bloque **📅 Mis próximos exámenes** y las estadísticas se alimentan de datos reales vía `consultarCalendario()` (con *fallback* tolerante a fallos).

## Flujo de ejecución
1. El Profesor abre **Mi Calendario** desde el dashboard.
2. La vista invoca `GET /profesor/calendario` con el JWT.
3. El guard valida rol y resuelve el profesor; el servicio consolida y filtra por `profesorId`.
4. La vista renderiza la tabla y el resumen; si no hay exámenes, muestra el aviso.

## Verificación realizada (en caliente)
- Sin token → **401**; con token de Profesor → **200**.
- Login con `manuel.masias@uneatlantico.es` (rol Profesor): el calendario devolvió **solo su examen** (filtro por `profesorId` correcto). Compatible con cualquier usuario de rol Profesor (`profesor@davidario.edu` sin exámenes → lista vacía).

## Notas
- No se modificó backend existente, autenticación, JWT ni la consulta del Administrador. La restricción de visibilidad se aplica en servidor a partir del JWT (no eludible desde el cliente).

## Referencias
- [Diseño: consultarCalendario (Profesor)](/RUP/02-diseño/casos-uso/1-Profesor/consultarCalendario/README.md)
- [Desarrollo: consultarCalendario (Administrador)](/RUP/03-desarrollo/casos-uso/0-Administrador/consultarCalendario/README.md)
- [AGENTES.md](/AGENTES.md)
