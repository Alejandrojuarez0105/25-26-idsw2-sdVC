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
</content>
