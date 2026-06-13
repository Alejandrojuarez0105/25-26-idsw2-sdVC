# Davidario > comunicarIncidenciaHorario (Profesor) > Desarrollo

> |[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/1-Profesor/DiagramaDeContextoProfesor.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/1-Profesor/comunicarIncidenciasHorario/comunicarIncidenciasHorario.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/1-Profesor/comunicarIncidenciasHorario/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/1-Profesor/comunicarIncidenciasHorario/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [profesor.controller.ts](/src/backend/src/modules/profesor/profesor.controller.ts) · [incidencias.service.ts](/src/backend/src/modules/profesor/incidencias.service.ts) · [dto/crear-incidencia.dto.ts](/src/backend/src/modules/profesor/dto/crear-incidencia.dto.ts) · [prisma/schema.prisma](/src/backend/prisma/schema.prisma)
- **Frontend:** [ComunicarIncidenciaHorarioView.tsx](/src/frontend/src/features/profesor/ComunicarIncidenciaHorarioView.tsx) · [ProfesorDashboard.tsx](/src/frontend/src/features/profesor/ProfesorDashboard.tsx) · [profesor.service.ts](/src/frontend/src/services/profesor.service.ts)

## Descripción
Caso de uso **exclusivo del Profesor**. Permite comunicar incidencias relacionadas con sus exámenes (solapamiento de horarios, error de asignación, aula incorrecta, imposibilidad de asistencia, etc.): seleccionar el examen, describir el problema y enviarlo. Las incidencias quedan persistidas con estado `PENDIENTE` para revisión administrativa.

## Estado
✅ **Completado** - Iteración 1 (verificado en caliente)

## Modelo de datos (única adición a Prisma)
Se añadió la entidad **`IncidenciaHorario`** y el enum `EstadoIncidencia`, más las relaciones inversas en `Profesor` y `Examen`. Migración aditiva aplicada (`add_incidencia_horario`) sin alterar tablas existentes.

```prisma
enum EstadoIncidencia { PENDIENTE REVISADA RESUELTA }

model IncidenciaHorario {
  id            String           @id @default(uuid()) @db.Uuid
  descripcion   String           @db.Text
  estado        EstadoIncidencia @default(PENDIENTE)
  fechaCreacion DateTime         @default(now()) @db.Timestamptz
  profesorId    String           @db.Uuid
  profesor      Profesor         @relation(fields: [profesorId], references: [id], onDelete: Cascade)
  examenId      String           @db.Uuid
  examen        Examen           @relation(fields: [examenId], references: [id], onDelete: Cascade)
  @@index([profesorId]) @@index([examenId]) @@index([estado])
}
```

## Backend

### Endpoints (protegidos por `ProfesorJwtGuard`)
#### POST `/profesor/incidencias`
Registra una incidencia. **Body** (`CrearIncidenciaDto`): `examenId` (UUID), `descripcion` (10–500 caracteres). El `profesorId` **no** se recibe del cliente: se deriva del JWT. Respuesta **201** con la incidencia serializada (incluye datos del examen).

#### GET `/profesor/incidencias`
Lista las incidencias del profesor autenticado (más recientes primero).

### Implementación
- **`CrearIncidenciaDto`** con `class-validator` (`@IsUUID`, `@MinLength(10)`, `@MaxLength(500)`), validado por el `ValidationPipe` global → descripciones inválidas devuelven **400**.
- **`IncidenciasService.crear(profesorId, dto)`**: verifica que el examen existe (**404** si no) y que **pertenece al profesor autenticado** (`examen.profesorId === profesorId`, **403** si es ajeno); crea el registro con `estado = PENDIENTE`. **No modifica el examen.**
- **`IncidenciasService.listar(profesorId)`**: devuelve las incidencias propias con el examen asociado serializado.

## Frontend

### Implementación
- **React** `ComunicarIncidenciaHorarioView` (estilo coherente con el sistema) con estados `loading | error | ready`:
  - Carga en paralelo el calendario propio (para el selector de examen) y las incidencias existentes.
  - **Formulario**: desplegable de examen (con detalle del examen seleccionado), área de descripción con contador y **validaciones** (examen obligatorio, descripción 10–500). Botón **📨 Enviar incidencia** deshabilitado mientras el formulario no es válido o hay un envío en curso.
  - **Confirmación de envío**: panel verde "✅ Incidencia registrada correctamente" con opción de comunicar otra.
  - **Listado** "📋 Mis incidencias comunicadas" con estado coloreado (Pendiente/En revisión/Resuelto).
- **Ruta**: `/profesor/incidencias` (registrada en `App.tsx`).
- **`profesor.service.ts`**: `crearIncidencia(dto)` → `POST /profesor/incidencias`; `listarIncidencias()` → `GET /profesor/incidencias`.

### Integración con el Dashboard del Profesor
- La tarjeta **⚠️ Incidencias** y el enlace **Reportar nueva incidencia →** navegan a `/profesor/incidencias`.
- El panel **⚠️ Incidencias reportadas** muestra las incidencias reales del profesor (estado en color).

## Flujo de ejecución
1. El Profesor abre **Incidencias** desde el dashboard.
2. Selecciona un examen propio, describe la incidencia y pulsa **Enviar**.
3. `POST /profesor/incidencias`: el guard valida rol, el servicio valida pertenencia y persiste con estado `PENDIENTE`.
4. La vista confirma el envío y actualiza el listado.

## Verificación realizada (en caliente)
- POST con descripción válida sobre examen propio → **201** (registro creado y devuelto).
- POST con descripción corta → **400** (validación).
- GET incidencias → devuelve la incidencia asociada al profesor.
- (El registro de prueba se eliminó tras la verificación para no dejar datos espurios.)

## Ampliación (Sesión 78) — visibilidad de la resolución
El profesor ahora ve, **en solo lectura**, el resultado de la gestión administrativa de sus incidencias:
- La tabla **📌 Mis incidencias** (y el panel del `ProfesorDashboard`) muestran el **estado actual** (`PENDIENTE` / `REVISADA` / `RESUELTA` / `OMITIDA`), el **mensaje de resolución** del administrador y la **fecha de resolución** cuando existen.
- Estos datos provienen de los campos `mensajeResolucion` y `fechaResolucion` añadidos a `IncidenciaHorario`, que el administrador rellena desde el panel de [gestionIncidencias](/RUP/03-desarrollo/casos-uso/0-Administrador/gestionIncidencias/README.md).
- El profesor **no puede modificar** estados ni resoluciones; el endpoint `GET /profesor/incidencias` se mantiene sin cambios de contrato (solo se añadieron campos opcionales a la respuesta).

## Notas
- La entidad `IncidenciaHorario` se creó en esta sesión y se amplió en la Sesión 78 (campos de resolución + estado `OMITIDA`); no se modificó ningún examen ni caso de uso previo.
- La autorización es por rol del JWT; funciona con cualquier usuario de rol Profesor.

## Referencias
- [Diseño: comunicarIncidenciasHorario (Profesor)](/RUP/02-diseño/casos-uso/1-Profesor/comunicarIncidenciasHorario/README.md)
- [Análisis: comunicarIncidenciasHorario (Profesor)](/RUP/01-analisis/casos-uso/1-Profesor/comunicarIncidenciasHorario/README.md)
- [AGENTES.md](/AGENTES.md)
