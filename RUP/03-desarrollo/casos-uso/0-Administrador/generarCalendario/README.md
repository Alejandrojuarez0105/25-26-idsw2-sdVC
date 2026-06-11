# Davidario > generarCalendario > Desarrollo

> |[🏠️](/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/generarCalendario/generarCalendario.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/generarCalendario/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/generarCalendario/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [examenes.controller.ts](/src/backend/src/modules/examenes/examenes.controller.ts) · [examenes.service.ts](/src/backend/src/modules/examenes/examenes.service.ts)
- **Frontend:** [GenerarCalendarioView.tsx](/src/frontend/src/features/admin/examenes/GenerarCalendarioView.tsx) · [examenes.service.ts](/src/frontend/src/services/examenes.service.ts)

## Descripción
Implementación de la generación del calendario oficial de exámenes. El sistema consolida en una única vista cronológica todos los exámenes registrados junto con sus profesores y aulas **reales** (resueltos desde las relaciones `profesorId`/`aulaId`, sin campos de texto quemados), valida la planificación reutilizando la lógica de detección de conflictos ya existente (`findConflictos`) y marca cada examen con su estado (correcto o en conflicto). Toda la operación es de solo lectura: no crea, modifica ni elimina datos, y no altera la estructura de la base de datos.

## Estado
✅ **Completado** - Iteración 1

## Backend

### Endpoints

#### GET `/examenes/calendario/generar`
Consolida los exámenes registrados, valida los conflictos sobre el conjunto actual y devuelve una estructura lista para la visualización del calendario.

**Response (200 OK) — datos suficientes:**
```json
{
  "datosSuficientes": true,
  "requisitos": [
    { "nombre": "Exámenes", "actual": 12, "minimo": 1, "cumple": true },
    { "nombre": "Aulas", "actual": 8, "minimo": 1, "cumple": true },
    { "nombre": "Profesores", "actual": 10, "minimo": 1, "cumple": true }
  ],
  "generadoEn": "2026-06-08T15:40:00.000Z",
  "datosProcesados": { "grados": 3, "asignaturas": 15, "profesores": 10, "aulas": 8, "estudiantes": 350 },
  "resumen": {
    "totalExamenes": 12,
    "completos": 9,
    "conProfesor": 11,
    "conAula": 10,
    "sinProfesor": 1,
    "sinAula": 2,
    "totalConflictos": 2
  },
  "examenes": [
    {
      "id": "uuid-1", "codigo": "EX001", "asignatura": "Programación I",
      "fecha": "2026-01-15", "hora": "08:30", "aula": "-2.6", "aulaId": "uuid-aula",
      "profesor": "Manuel Masías", "profesorId": "uuid-prof",
      "tieneConflicto": true, "tiposConflicto": ["Profesor"]
    }
  ],
  "conflictos": [ /* misma estructura que GET /examenes/conflictos */ ]
}
```

> Cuando **no** se cumplen los requisitos mínimos, la respuesta mantiene la misma forma pero con `"datosSuficientes": false` y el array `requisitos` indicando qué falta (`cumple: false`). El frontend renderiza entonces la pantalla **DATOS INSUFICIENTES** en lugar del calendario.

### Implementación
- **NestJS**: Endpoint `@Get('calendario/generar')` en `ExamenesController`, declarado **antes** de `@Get(':id')` para evitar colisiones de routing. El controlador envuelve la llamada en `try/catch` y traduce cualquier fallo a `InternalServerErrorException`, garantizando un manejo de errores controlado.
- **Servicio `ExamenesService.generarCalendario()`**: reutiliza el módulo de Exámenes existente sin crear módulos nuevos. Su flujo es:
  1. **Obtener los exámenes**: `prisma.examen.findMany` con `orderBy: [{ fecha: 'asc' }, { hora: 'asc' }]` (orden cronológico) e `include` compartido (`examenInclude`) de `profesor.usuario` y `aula`.
  2. **Validar conflictos**: invoca `this.findConflictos()` (lógica ya existente) sin duplicar código.
  3. **Indexar conflictos por examen**: construye un `Map<examenId, Set<tipo>>` a partir de los exámenes implicados en cada conflicto.
  4. **Consolidar**: serializa cada examen resolviendo el nombre del profesor (`usuario.nombre + apellido`) y el código del aula (`aula.codigo`) desde las relaciones reales, añadiendo `tieneConflicto` y `tiposConflicto`.
  5. **Métricas**: calcula los datos procesados (`grado`, `asignatura`, `profesor`, `aula`, `alumno` mediante `count()` en paralelo con `Promise.all`) y el resumen (totales, con/sin profesor, con/sin aula, completos y total de conflictos).
  6. **Validar requisitos mínimos**: comprueba que existan al menos **1 examen, 1 aula y 1 profesor** (mínimos reales para que un calendario sea posible). Construye el array `requisitos` (`nombre`, `actual`, `minimo`, `cumple`) y el flag `datosSuficientes`.
  7. **Retornar** la estructura consolidada lista para visualización, incluyendo `datosSuficientes` y `requisitos`.
- **Sin persistencia ni cambios de esquema**: la generación es de solo lectura. No se crean tablas, no se modifica `database-setup.sql` ni el esquema Prisma, y no se utilizan campos de texto quemados para profesor o aula.

---

## Frontend

### Implementación
- **React**: Componente `GenerarCalendarioView` con estilo retro Courier New, coherente con `ExamenesView`, `AsignarProfesorAExamenView` y `ListarConflictosExamenesView`.
- **Manejo de estados**: máquina de estados `idle | loading | success | error`:
  - **idle**: pantalla inicial con el botón **📅 Generar Calendario**.
  - **loading**: spinner animado y mensaje "Generación en progreso...".
  - **error**: panel rojo para fallos técnicos (red/500) con el mensaje del backend y botones **🔄 Reintentar** / **🚪 Salir**.
  - **success**: si `datosSuficientes` es `false`, render de la pantalla **❌ DATOS INSUFICIENTES** (checklist de requisitos ✅/❌ + acciones recomendadas); en caso contrario, render del calendario consolidado.
- **Vista de éxito**:
  - Banner de confirmación con el total de exámenes consolidados.
  - Bloque **📊 Datos procesados** (Grados, Asignaturas, Profesores, Aulas, Estudiantes).
  - Bloque **📈 Resumen de la generación** (Total, Con profesor, Con aula, Conflictos).
  - Aviso de conflictos con enlace directo a `/admin/examenes/conflictos` si los hay.
  - **🗓️ Calendario consolidado**: tabla con `FECHA / HORA / ASIGNATURA / PROFESOR / AULA / ESTADO`, resaltando en rojo las filas con conflicto y mostrando `(sin profesor)` / `(sin aula)` para relaciones nulas.
  - Botonera: **🔄 Regenerar**, **⚠️ Ver conflictos** y **🚪 Salir**.

#### examenesService
- Método `generarCalendario()`: envía `GET /examenes/calendario/generar`.
- Interfaces exportadas `CalendarioGenerado`, `CalendarioExamen` y `RequisitoCalendario` con la estructura tipada del payload (incluyendo `datosSuficientes` y `requisitos`).

---

## Flujo de ejecución
1. El Administrador pulsa **📅 Generar calendario** en `ExamenesView`.
2. Se navega a la ruta `/admin/examenes/calendario`; la vista arranca en estado `idle`.
3. Al pulsar **📅 Generar Calendario**, la vista pasa a `loading` e invoca `GET /examenes/calendario/generar`.
4. El backend obtiene todos los exámenes ordenados cronológicamente, valida los conflictos con `findConflictos()`, consolida la información y la devuelve.
5. La vista pasa a `success` y renderiza los datos procesados, el resumen, los avisos de conflicto y el calendario consolidado.
6. El Administrador puede regenerar, navegar a la gestión de conflictos o salir a la administración de exámenes.

## Notas de implementación
- La generación reutiliza íntegramente la lógica de exámenes y de conflictos ya implementada (`findConflictos`), sin duplicar módulos ni recrear la detección de solapamientos, manteniendo compatibilidad total con `listarConflictosExamenes`.
- El endpoint `GET /examenes/calendario/generar` se declara antes de `@Get(':id')` para evitar que el segmento `calendario` sea interpretado como parámetro de ruta.
- Profesores y aulas se resuelven exclusivamente desde las relaciones reales (`profesor.usuario`, `aula.codigo`), respetando la prohibición de usar campos de texto quemados (coherente con el refactor de FKs de la Sesión 70).
- La ruta `/admin/examenes/calendario` está registrada en `App.tsx` y vinculada desde `ExamenesView.tsx` mediante el botón **📅 Generar calendario**, único cambio aplicado sobre la vista existente (adición no destructiva).
- No se modificó la autenticación, JWT, el esquema Prisma, `database-setup.sql`, los dashboards ni ningún caso de uso previamente implementado.

### Decisiones sobre los prototipos
De los tres prototipos disponibles en `extraDocs/DiagramasDetallados-Administrador/generarCalendario/`:
- **`generarCalendarioGeneracion.html`** (barras de progreso simuladas): **descartado**; se mantiene la pantalla de éxito/carga real implementada en `GenerarCalendarioView`.
- **`generarCalendarioError.html`** (DATOS INSUFICIENTES): **implementado** mediante la validación de requisitos mínimos reales (≥1 examen, ≥1 aula, ≥1 profesor).
- **`generarCalendarioAdvertencia.html`** (confirmación de sobrescritura de un calendario existente): **diferido**. Requiere persistir la generación (timestamp + snapshot), lo que implica un cambio de esquema; se aborda en la rama **Consultar Calendario** junto con la persistencia del calendario oficial.

---

## Ampliación (Sesión 82) — Generación AUTOMÁTICA del horario

Hasta la Sesión 81, `generarCalendario` solo **consolidaba y validaba** asignaciones introducidas a mano. La Sesión 82 incorpora la **generación automática real**: el sistema asigna `fecha`, `hora`, `aula` y `profesor` a cada examen y **persiste** el resultado.

### Cambio de modelo (mínimo, aditivo)
- Se añadió `Asignatura.anio` (`SmallInt`, 1–4, por defecto 1), editable desde Crear/Editar/Importar asignatura. Define, junto con el grado, la **cohorte** usada por la regla de separación. Migración aditiva `asignatura_anio` (no altera datos existentes; las asignaturas previas quedan en año 1).

### Endpoint
#### POST `/examenes/calendario/generar-automatico`
Body opcional: `{ fechaInicio?, horizonteDias?, franjas?, separacionDias? }`. Por defecto: inicio el próximo día hábil, horizonte 120 días, franjas `08:30/11:30/14:30/17:30`, separación 1 día libre. Persiste las asignaciones y devuelve el calendario consolidado + un bloque `generacion` con `asignados`, `noAsignados` (con motivo) y los parámetros usados. El endpoint `GET /examenes/calendario/generar` (consolidación de solo lectura) se mantiene intacto.

### Algoritmo (`ExamenesService.generarCalendarioAutomatico`)
Heurístico **greedy** (exámenes con más matriculados primero) que, para cada examen, busca el primer *slot* (día hábil L–V × franja, en orden cronológico) que cumple **todas** las restricciones duras:
1. **Separación por cohorte (grado + año)**: dos exámenes de la misma cohorte no pueden caer el **mismo día** ni en **días consecutivos** (`|díaA − díaB| > separacionDias`, por defecto > 1 → ≥1 día libre). El fin de semana cuenta como separación (viernes → lunes es válido).
2. **Aforo**: el aula asignada (best-fit: menor capacidad suficiente) tiene `capacidad ≥` matriculados (`Matricula`). Si ningún aula basta → no asignado (multi-aula no soportado en este modelo).
3. **Sin doble reserva**: una misma aula o un mismo profesor no se reutilizan en el mismo `(fecha, hora)`.
4. **Profesor (estrategia en cascada, "opción c")**: por orden de prioridad sobre cada *slot* candidato — (1) el profesor que el examen ya tuviera **asignado a mano**, si está libre; (2) un **docente de la asignatura** (`ProfesorAsignatura`) libre; (3) como último recurso, **cualquier profesor libre**. El motor prefiere un *slot* en el que pueda asignar profesor; solo si ninguno lo permite usa el primer *slot* válido y deja el examen `sinProfesor`. Nunca reutiliza un profesor ya ocupado en ese `(fecha, hora)`.

Los exámenes que no encajan se devuelven en `noAsignados` con su motivo; **nunca** se produce un horario inválido.

### Frontend
`GenerarCalendarioView` ofrece dos acciones: **⚙️ Generar automáticamente** (llama al nuevo endpoint, persiste y muestra un panel de resultado con asignados/no asignados y los parámetros) y **📅 Solo consolidar** (comportamiento previo de solo lectura). El año es editable en los formularios de asignatura.

### Visibilidad de grado y año (afinado S82)
- **Lista de Asignaturas** (`AsignaturasView`): nueva columna **AÑO** (1.º–4.º) junto a Grado.
- **Lista de Exámenes** (`ExamenesView`): nuevas columnas derivadas **GRADO / AÑO** — se resuelven en el cliente emparejando el texto `Examen.asignatura` con el catálogo de asignaturas; los exámenes que no casan muestran `(?)`, lo que ayuda a detectar los textos que no resuelven (limitación P3).

### Verificación realizada (en caliente)
Generación sobre los datos de *seed*: 5/5 exámenes asignados. Validación independiente de la regla: la cohorte `grado|año` con 3 exámenes quedó en días **06‑11, 06‑15, 06‑17** (jueves → lunes → miércoles), todos con ≥2 días de separación → **0 violaciones**. Exámenes de cohortes distintas sí comparten día (correcto).

### Limitación conocida (trazada al estudio S81)
La cohorte se deriva resolviendo el **texto libre** `Examen.asignatura` contra el catálogo `Asignatura` (por nombre/código normalizado). Un examen cuyo texto **no casa** con el catálogo (p. ej. variantes de acentos/mayúsculas) se trata como cohorte propia y **no** se le aplica la separación. La solución de fondo —`Examen.asignaturaId` como FK— está recogida en [`analisis-datos-reales-sesion81.md`](/RUP/01-analisis/estudios/analisis-datos-reales-sesion81.md) (problema P3) y se abordará al evolucionar el modelo.

### Alcance respetado
No se modificó autenticación, JWT, `database-setup.sql`, los dashboards ni casos de uso previos. El único cambio de esquema es el campo aditivo `Asignatura.anio`. El endpoint de consolidación previo permanece sin cambios.
</content>
