# Davidario > actualizarConflictosExamenes > Desarrollo

> |[🏠️](/RUP/README.md)|**Desarrollo**|

- **Backend:** [examenes.controller.ts](/src/backend/src/modules/examenes/examenes.controller.ts) · [examenes.service.ts](/src/backend/src/modules/examenes/examenes.service.ts)
- **Frontend:** [examenes.service.ts](/src/frontend/src/services/examenes.service.ts) · [ListarConflictosExamenesView.tsx](/src/frontend/src/features/admin/examenes/ListarConflictosExamenesView.tsx) · [AdminDashboard.tsx](/src/frontend/src/features/admin/AdminDashboard.tsx)

## Descripción
Actualización de la lógica de detección de conflictos en la planificación de exámenes para que opere sobre los **identificadores reales** (`profesorId`, `aulaId`) introducidos en `refactorExamenes`, eliminando comparaciones por cadena que producían falsos negativos cuando dos exámenes referenciaban al mismo recurso con grafías ligeramente distintas. Adicionalmente se sincroniza la sección "📋 Conflictos recientes" del dashboard del administrador para que consuma los datos calculados en tiempo real en lugar de un listado quemado.

## Estado
✅ **Completado** - Iteración 1

## Backend

### Endpoint
`GET /examenes/conflictos` — mantiene contrato HTTP y estructura de respuesta.

### Lógica revisada
- **Conflicto de Profesor**: agrupación por clave `(profesorId, fecha, hora)` sobre exámenes con `profesorId` no nulo; grupos ≥ 2 se reportan como conflicto del tipo `Profesor`. Antes la agrupación se hacía por la cadena `profesor.toLowerCase()`, ahora se compara por UUID.
- **Conflicto de Aula**: agrupación equivalente por `(aulaId, fecha, hora)` con la misma regla. Se elimina cualquier ambigüedad por mayúsculas/espacios en el código de aula.
- **Conflicto de Estudiante**: la detección de alumnos matriculados en asignaturas con exámenes simultáneos sigue cruzando `Examen.asignatura (string) → Asignatura.nombre/codigo → Matricula`. No cambia respecto a la Sesión 69, pero ahora se beneficia del orden estable `findMany({ orderBy: [fecha, hora] })`.
- **Detalle del conflicto**: el campo `detalle` se construye a partir del nombre completo resuelto desde `profesor.usuario.nombre + apellido` y del `aula.codigo`. Cada examen del payload incluye además los IDs (`profesorId`, `aulaId`) para que el cliente pueda enlazarlos.
- **Índices**: se aprovechan los nuevos índices `Examen_fecha_hora_idx`, `Examen_profesorId_idx` y `Examen_aulaId_idx` (creados en el refactor) para soportar consultas eficientes a medida que la planificación crezca.

## Frontend

### ListarConflictosExamenesView
- Continúa renderizando exactamente la misma vista de Sesión 69, sin cambios de UI.
- Las cadenas mostradas para `aula` y `profesor` provienen ahora del backend ya resueltas (`profesor.usuario.nombre + apellido` y `aula.codigo`), evitando inconsistencias entre la lista principal y la pantalla de conflictos.

### AdminDashboard — sección "📋 Conflictos recientes"
- Se reemplaza el listado hardcodeado de tres conflictos ficticios por una llamada a `examenesService.findConflictos()` en `useEffect`.
- Se muestran los primeros 5 conflictos reales con su tipo, detalle y estado (color según `Pendiente` / `En revisión` / `Resuelto`).
- Estados de carga (`Cargando conflictos...`) y vacío (`✅ Sin conflictos detectados en la planificación actual.`) coherentes con el resto del sistema.
- El enlace "Ver todos los conflictos →" navega a `/admin/examenes/conflictos` en lugar de mostrar un `alert`.

## Flujo de ejecución
1. Cualquier alta o edición de examen via los flujos refactorizados (`CrearExamenView`, `EditarExamenView`, `AsignarProfesorAExamenView`) persiste `profesorId`/`aulaId` reales.
2. El Administrador entra al dashboard o pulsa **⚠️ Ver conflictos** en `ExamenesView`.
3. El frontend invoca `GET /examenes/conflictos`.
4. El backend ejecuta las tres pasadas analíticas sobre las claves foráneas y devuelve los conflictos.
5. Tanto el dashboard como la vista detallada presentan datos consistentes y libres de falsos negativos por diferencias de cadena.

## Notas de implementación
- La transición de estado de conflictos (`Pendiente` → `En revisión` → `Resuelto`) permanece local en cliente; el backend continúa devolviendo siempre `Pendiente`, respetando la restricción de no persistir resolución de conflictos.
- La detección de "estudiantes simultáneos" no requirió cambios; se beneficia indirectamente de la mayor coherencia del catálogo de exámenes.
- Tras `refactorExamenes`, ningún examen creado por el sistema puede tener un `profesor`/`aula` con valor inconsistente: o bien la FK existe (y la relación es correcta) o bien es `null`. Esto garantiza que la lista del dashboard refleje siempre el estado real de la base de datos.
