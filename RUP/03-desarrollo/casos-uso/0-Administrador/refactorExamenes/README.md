# Davidario > refactorExamenes > Desarrollo

> |[🏠️](/RUP/README.md)|**Desarrollo**|

- **Backend:** [examenes.controller.ts](/src/backend/src/modules/examenes/examenes.controller.ts) · [examenes.service.ts](/src/backend/src/modules/examenes/examenes.service.ts) · [schema.prisma](/src/backend/prisma/schema.prisma)
- **Base de Datos:** [database-setup.sql](/src/database-setup.sql)
- **Frontend:** [examenes.service.ts](/src/frontend/src/services/examenes.service.ts) · [CrearExamenView.tsx](/src/frontend/src/features/admin/examenes/CrearExamenView.tsx) · [EditarExamenView.tsx](/src/frontend/src/features/admin/examenes/EditarExamenView.tsx) · [ExamenesView.tsx](/src/frontend/src/features/admin/examenes/ExamenesView.tsx) · [EliminarExamenView.tsx](/src/frontend/src/features/admin/examenes/EliminarExamenView.tsx) · [AsignarProfesorAExamenView.tsx](/src/frontend/src/features/admin/examenes/AsignarProfesorAExamenView.tsx)

## Descripción
Refactorización controlada del módulo de **Exámenes** para corregir inconsistencias críticas en el modelo de datos. La implementación previa almacenaba los campos `profesor` y `aula` como cadenas libres (`String @db.VarChar`), rompiendo la integridad referencial con las entidades `Profesor` y `Aula` reales y haciendo imposible una detección fiable de conflictos en la planificación. Esta sesión convierte ambos campos en claves foráneas (`profesorId`, `aulaId`) opcionales con `onDelete: SetNull`, regenera el esquema y migra los seeds y la lógica de servicio/UI para operar contra entidades reales.

## Estado
✅ **Completado** - Iteración 1

## Cambios en el Modelo

### Prisma (`schema.prisma`)
```prisma
model Examen {
  id         String   @id @default(uuid()) @db.Uuid
  codigo     String   @unique @db.VarChar(20)
  asignatura String   @db.VarChar(100)
  fecha      DateTime @db.Date
  hora       String   @db.VarChar(5)

  profesorId String?   @db.Uuid
  profesor   Profesor? @relation(fields: [profesorId], references: [id], onDelete: SetNull)

  aulaId String? @db.Uuid
  aula   Aula?   @relation(fields: [aulaId], references: [id], onDelete: SetNull)

  fechaCreacion DateTime @default(now()) @db.Timestamptz

  @@index([profesorId])
  @@index([aulaId])
  @@index([fecha, hora])
}
```

- Se han eliminado los campos `profesor String` y `aula String` (cadenas redundantes).
- Las nuevas FKs son **opcionales** (`?`) y usan `onDelete: SetNull` para que la eliminación de un profesor o un aula no destruya el examen.
- Las relaciones inversas `Examen[]` se añadieron en los modelos `Profesor` y `Aula`.
- Se incorporan tres índices (`profesorId`, `aulaId`, `(fecha, hora)`) para acelerar la detección de conflictos.

### `database-setup.sql`
- La creación de la tabla `Examen` se ha movido **después** de `Aula` para poder declarar la FK `aulaId`.
- Los seeds usan subconsultas (`SELECT id FROM "Aula" WHERE codigo = …` y `SELECT p.id FROM "Profesor" p JOIN "Usuario" u ON …`) para resolver los IDs reales en el momento de la inserción.
- Se añaden los índices `Examen_profesorId_idx`, `Examen_aulaId_idx` y `Examen_fecha_hora_idx`.

## Backend

### Endpoints
Los endpoints existentes (`GET /examenes`, `GET /examenes/:id`, `POST /examenes`, `PUT /examenes/:id`, `DELETE /examenes/:id`, `POST /examenes/:id/asignar-profesor`, `GET /examenes/conflictos`) **mantienen su contrato HTTP** pero ahora:

- Las respuestas incluyen objetos anidados `profesor` (con `usuario`) y `aula`.
- `POST /examenes` y `PUT /examenes/:id` aceptan ahora `profesorId` y `aulaId` (UUIDs) en lugar de cadenas.
- `POST /examenes/:id/asignar-profesor` persiste directamente `profesorId` en la columna FK.

### Implementación
- **NestJS**: `ExamenesService` reescrito para incluir `examenInclude` (relaciones `profesor.usuario` y `aula`) en todas las queries.
- **Prisma**: Los seeds y las creaciones nuevas se apoyan en las FKs reales; las relaciones se traen con `findMany({ include: examenInclude })`.
- **Validaciones**: La unicidad de `codigo` y la existencia del examen se mantienen idénticas; las relaciones inválidas devuelven el error nativo de Prisma sin alterar el contrato HTTP.

## Frontend

### Servicio `examenes.service.ts`
- Interfaz `Examen` extendida con `profesorId`, `aulaId`, `profesor` (objeto), `aula` (objeto).
- Nuevo tipo `ExamenInput` para los payloads de `create`/`update`.

### Vistas afectadas
- **CrearExamenView**: los antiguos `<input>`/`<select>` con texto literal de profesor/aula han sido reemplazados por selectores `<select>` que se cargan dinámicamente desde `profesoresService.findAll()` y `getAulas()`. El submit envía `profesorId` y `aulaId`.
- **EditarExamenView**: precarga paralela (`Promise.all`) del examen + asignaturas + profesores + aulas. Detección de cambios sobre `aulaId`/`profesorId`. Bloque informativo inferior resuelve el `codigo` del aula y el nombre del profesor dinámicamente.
- **ExamenesView**: las columnas `AULA` y `PROFESOR` muestran ahora `examen.aula?.codigo` y `examen.profesor?.usuario.nombre + apellido`. La búsqueda por código de aula y nombre de profesor sigue funcionando contra los nombres resueltos. Se añade etiqueta `(sin aula)` / `(sin profesor)` cuando la FK es `null`.
- **EliminarExamenView**: la ficha de eliminación muestra el código del aula y el nombre del profesor resueltos vía relaciones.
- **AsignarProfesorAExamenView**: los chequeos `e.profesor.trim()` se sustituyen por `!!e.profesorId`; los nombres se construyen a partir de `e.profesor?.usuario`.

### Compatibilidad
- No se han modificado componentes ni servicios fuera del módulo de Exámenes, salvo la única excepción del dashboard documentada en `actualizarConflictosExamenes`.

## Migración a aplicar manualmente
1. Detener el backend (`npm run start:dev`).
2. Ejecutar `npx prisma generate` en `src/backend` para regenerar el cliente.
3. Sincronizar la base de datos con `npx prisma db push` **o** volver a ejecutar `src/database-setup.sql` (recomendado por la limpieza completa).
4. Arrancar de nuevo el backend y refrescar el frontend.

## Notas de implementación
- El campo libre `asignatura: String` se mantiene tal cual, fuera del alcance de esta sesión y respetando la restricción "modificar solo lo estrictamente necesario".
- La detección de conflictos basada en estos nuevos IDs se documenta en [`actualizarConflictosExamenes/README.md`](../actualizarConflictosExamenes/README.md).
- No se modificaron módulos fuera de Exámenes (Profesores, Aulas, Autenticación, JWT, Prisma global, dashboards salvo la sección de "Conflictos recientes").
