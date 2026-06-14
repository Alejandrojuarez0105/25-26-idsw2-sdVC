# Davidario > consultarCalendario (Alumno) > Desarrollo

> |[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/2-Alumno/DiagramaDeContextoAlumno.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/2-Alumno/consultarCalendario/consultarCalendario.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/2-Alumno/consultarCalendario/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/2-Alumno/consultarCalendario/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [alumno.controller.ts](/src/backend/src/modules/alumno/alumno.controller.ts) · [alumno-calendario.service.ts](/src/backend/src/modules/alumno/alumno-calendario.service.ts) · [alumno-resolver.guard.ts](/src/backend/src/modules/alumno/alumno-resolver.guard.ts) · [jwt-roles.guard.ts](/src/backend/src/common/jwt-roles.guard.ts) · [alumno.module.ts](/src/backend/src/modules/alumno/alumno.module.ts)
- **Frontend:** [AlumnoCalendarioView.tsx](/src/frontend/src/features/alumno/AlumnoCalendarioView.tsx) · [AlumnoDashboard.tsx](/src/frontend/src/features/alumno/AlumnoDashboard.tsx) · [alumno.service.ts](/src/frontend/src/services/alumno.service.ts)

## Descripción
Permite al **Alumno** consultar **únicamente los exámenes de las asignaturas en las que está matriculado** (fecha, hora, aula y asignatura). Reutiliza la lógica de consolidación del calendario del Administrador (`ExamenesService.consultarCalendario()`) y aplica el filtro por las matrículas del alumno autenticado, derivado del JWT. Operación de solo lectura.

## Estado
✅ **Completado** - Iteración 1 (verificado en caliente)

## Backend

### Endpoint
#### GET `/alumno/calendario`
Protegido por `AlumnoJwtGuard`. Devuelve el calendario del alumno autenticado.

**Response (200 OK):**
```json
{
  "generadoEn": "2026-06-10T08:00:00.000Z",
  "resumen": { "totalExamenes": 1, "aulasUtilizadas": 1, "asignaturas": 1, "conConflicto": 0 },
  "examenes": [
    {
      "id": "uuid", "codigo": "EX002", "asignatura": "Bases de Datos I",
      "fecha": "2026-01-15", "hora": "08:30", "aula": "-2.2", "aulaId": "uuid",
      "profesor": "...", "profesorId": "uuid",
      "tieneConflicto": false, "tiposConflicto": []
    }
  ]
}
```

### Implementación
- **Módulo nuevo `AlumnoModule`** (aditivo): importa `ExamenesModule` (reutiliza `ExamenesService`) y registra `JwtModule` con el **mismo secreto** de autenticación. Registrado en `AppModule` sin tocar los módulos existentes. No introduce entidades ni tablas nuevas.
- **`AlumnoJwtGuard`**: lee el `Authorization: Bearer`, verifica el JWT con `JwtService`, exige `rol === 'Alumno'` y resuelve el `Alumno` por `usuarioId = payload.sub` (relación `Usuario` 1—1 `Alumno`), adjuntándolo a `request.alumno`. **Autorización basada solo en el rol del JWT** — sin validaciones por email (soporte multiusuario).
- **`AlumnoCalendarioService.consultarCalendario(alumnoId)`**: invoca el método público `ExamenesService.consultarCalendario()` (sin duplicar lógica) y **filtra** los exámenes a las asignaturas matriculadas del alumno. Las matrículas se obtienen con `prisma.matricula.findMany({ where: { alumnoId }, include: { asignatura } })`; como `Examen.asignatura` es texto libre, se compara (en minúsculas) contra el **nombre** y el **código** de las asignaturas matriculadas (mismo criterio que `ExamenesService`). Recalcula un resumen propio (`totalExamenes`, `asignaturas`, `aulasUtilizadas`, `conConflicto`).
- **Sin cambios** en `ExamenesController`/`ExamenesService`, en autenticación/JWT ni en el esquema Prisma.

## Frontend

### Implementación
- **React** `AlumnoCalendarioView` (estilo Courier New, coherente con las vistas de Administrador y Profesor) con máquina de estados `loading | error | success`:
  - **loading**: spinner.
  - **error**: panel rojo técnico con **🔄 Reintentar** / **🚪 Volver al panel**.
  - **success sin exámenes**: aviso "📭 No tiene exámenes programados".
  - **success con exámenes**: tabla `FECHA / HORA / ASIGNATURA / AULA / ESTADO` (filas en conflicto resaltadas), aviso de solapamientos, panel **📊 Resumen de mi calendario** y botones **📎 Descargar Calendario** / **🚪 Volver al panel**.
- **Ruta**: `/alumno/calendario` (registrada en `App.tsx`).
- **`alumno.service.ts`**: método `consultarCalendario()` → `GET /alumno/calendario`; interfaz `CalendarioAlumno`.

### Integración con el Dashboard del Alumno
- La tarjeta **📅 Mis Exámenes** y el enlace **Ver mi calendario →** navegan a `/alumno/calendario` (antes mostraban `alert`).
- El bloque **📅 Próximos exámenes** y las estadísticas se alimentan de datos reales vía `consultarCalendario()` (con *fallback* tolerante a fallos).

## Flujo de ejecución
1. El Alumno abre **Mis Exámenes** desde el dashboard.
2. La vista invoca `GET /alumno/calendario` con el JWT.
3. El guard valida rol y resuelve el alumno; el servicio consolida y filtra por sus asignaturas matriculadas.
4. La vista renderiza la tabla y el resumen; si no hay exámenes, muestra el aviso.

## Verificación realizada (en caliente)
- Sin token → **401**; token de Profesor → **403** (aislamiento por rol); token de Alumno → **200**.
- Login multiusuario: `alumno@davidario.edu` y `ana.garcia@alumnos.uneatlantico.es` (rol Alumno) → calendario correcto (vacío cuando el alumno no tiene matrículas que coincidan con exámenes).
- Validación del filtro: con una matrícula de prueba en una asignatura con examen ("Bases de Datos I"), el calendario devolvió **exactamente ese examen**; la matrícula de prueba se eliminó tras verificar (sin alterar datos persistentes).

## Notas
- No se modificó backend existente, autenticación, JWT ni el esquema Prisma. La restricción de visibilidad se aplica en servidor a partir del JWT (no eludible desde el cliente).

## Referencias
- [Diseño: consultarCalendario (Alumno)](/RUP/02-diseño/casos-uso/2-Alumno/consultarCalendario/README.md)
- [Desarrollo: consultarCalendario (Profesor)](/RUP/03-desarrollo/casos-uso/1-Profesor/consultarCalendario/README.md)
- [Desarrollo: consultarCalendario (Administrador)](/RUP/03-desarrollo/casos-uso/0-Administrador/consultarCalendario/README.md)
- [AGENTES.md](/AGENTES.md)
