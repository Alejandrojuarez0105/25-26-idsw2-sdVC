# Davidario > listarConflictosExamenes > Desarrollo

> |[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/listarConflictosExamenes/listarConflictosExamenes.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/listarConflictosExamenes/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/listarConflictosExamenes/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [examenes.controller.ts](/src/backend/src/modules/examenes/examenes.controller.ts) · [examenes.service.ts](/src/backend/src/modules/examenes/examenes.service.ts)
- **Frontend:** [ListarConflictosExamenesView.tsx](/src/frontend/src/features/admin/examenes/ListarConflictosExamenesView.tsx) · [examenes.service.ts](/src/frontend/src/services/examenes.service.ts)

## Descripción
Implementación de la funcionalidad de detección y listado de conflictos en la planificación de exámenes. El sistema analiza en tiempo real el conjunto de exámenes registrados para identificar tres categorías de incidencias: profesores asignados a más de un examen simultáneo, aulas usadas por más de un examen en la misma franja horaria, y estudiantes matriculados en asignaturas con exámenes solapados. Toda la lógica de detección se calcula en backend sin alterar la base de datos, conforme a la restricción de no persistir estado de conflictos.

## Estado
✅ **Completado** - Iteración 1

## Backend

### Endpoints

#### GET `/examenes/conflictos`
Obtiene todos los exámenes registrados y devuelve un listado estructurado de los conflictos detectados sobre el conjunto actual de la planificación.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "tipo": "Profesor",
    "detalle": "Manuel Masías - 2 exámenes a las 08:30",
    "estado": "Pendiente",
    "fecha": "2026-01-15",
    "hora": "08:30",
    "estudiantesAfectados": 0,
    "examenes": [
      { "id": "uuid-1", "codigo": "EX001", "asignatura": "Programación I", "fecha": "2026-01-15", "hora": "08:30", "aula": "-2.6", "profesor": "Manuel Masías" },
      { "id": "uuid-2", "codigo": "EX002", "asignatura": "Bases de Datos", "fecha": "2026-01-15", "hora": "08:30", "aula": "-2.4", "profesor": "Manuel Masías" }
    ]
  }
]
```

### Implementación
- **NestJS**: Endpoint `@Get('conflictos')` en `ExamenesController` declarado **antes** de `@Get(':id')` para evitar que la cadena `conflictos` sea interpretada como parámetro de ruta.
- **Lógica de detección (in-memory)**: El método `findConflictos()` del `ExamenesService` realiza tres pasadas analíticas sobre el catálogo completo de exámenes:
  1. **Conflicto de Profesor**: agrupa los exámenes con `profesor` no vacío por la clave `(profesor + fecha + hora)`. Si un grupo contiene ≥ 2 exámenes, se reporta un conflicto del tipo `Profesor`.
  2. **Conflicto de Aula**: agrupa los exámenes con `aula` no vacía por la clave `(aula + fecha + hora)`. Si un grupo contiene ≥ 2 exámenes, se reporta un conflicto del tipo `Aula`.
  3. **Conflicto de Estudiante**: agrupa los exámenes por slot horario `(fecha + hora)`, resuelve cada `asignatura` (string) a su `Asignatura` real comparando por `nombre` o `codigo` y consulta las `Matricula` relacionadas. Si algún `alumno` está matriculado en ≥ 2 asignaturas del mismo slot, se reporta un conflicto del tipo `Estudiante` indicando el número de alumnos afectados.
- **Sin persistencia**: El campo `estado` se devuelve siempre como `Pendiente`. La transición entre estados (`Pendiente` → `En revisión` → `Resuelto`) se gestiona en cliente; el backend no almacena el estado, conforme a la restricción.
- **Sin modificación del esquema**: La detección reutiliza los modelos `Examen`, `Asignatura` y `Matricula` ya definidos. No se crean tablas auxiliares.

---

## Frontend

### Implementación
- **React**: Componente `ListarConflictosExamenesView` con disposición de dos paneles (principal y lateral) siguiendo fielmente el prototipo `listarConflictosExamenes.html` y el estilo retro Courier New.
- **Carga reactiva**: Consulta inicial al endpoint y botón **🔄 Refrescar** para volver a evaluar el catálogo de exámenes en caliente.
- **Selección y detalle**: Tabla principal con `TIPO / DETALLE / FECHA / ESTADO` (color según estado) y panel inferior con el desglose de exámenes involucrados y el número de estudiantes afectados.
- **Acciones locales**: Los botones laterales `🔧 Aplicar solución`, `⏭️ Omitir conflicto` y `✅ Marcar como revisado` modifican el estado local del conflicto seleccionado (no persistente) replicando la lógica del prototipo: las soluciones aplicadas pasan a `En revisión`, las revisadas a `Resuelto`, las omitidas se mantienen como `Pendiente`.

#### ListarConflictosExamenesView Component
- Contador superior con el total de conflictos detectados.
- Tabla seleccionable con resaltado azul para la fila activa.
- Panel de detalle desplegando uno a uno los exámenes involucrados (código, asignatura, fecha, hora, aula y profesor).
- Selector de opciones de resolución que se adapta dinámicamente al tipo de conflicto (`Profesor`, `Aula` o `Estudiante`).
- Botones secundarios: **📋 Ver todos los conflictos**, **📎 Exportar reporte** (genera un texto con el resumen) y **🚪 Salir** (con confirmación nativa).

#### examenesService
- Método `findConflictos()`: Envía la petición `GET /examenes/conflictos`.
- Interfaz exportada `ConflictoExamen` con la estructura tipada del payload.

---

## Flujo de ejecución
1. El Administrador pulsa **⚠️ Ver conflictos** en `ExamenesView`.
2. Se navega a la ruta `/admin/examenes/conflictos` y la vista invoca el endpoint `GET /examenes/conflictos`.
3. El backend recupera todos los exámenes y, en tres pasadas analíticas sobre el conjunto, identifica los conflictos de tipo Profesor, Aula y Estudiante.
4. La respuesta JSON se renderiza en la tabla principal; la primera fila queda seleccionada por defecto.
5. El Administrador puede inspeccionar cada conflicto, aplicar/omitir/marcar soluciones desde el panel lateral (cambios locales) y exportar un informe textual del estado actual.

## Notas de implementación
- La detección se realiza completamente en memoria, sin escrituras a base de datos, conforme a la restricción explícita `Toda la lógica de conflictos debe calcularse en backend sin persistencia adicional`.
- El endpoint `GET /examenes/conflictos` se declara antes del `@Get(':id')` para evitar colisiones de routing donde el segmento `conflictos` pudiera ser interpretado como UUID.
- La detección de conflictos de estudiantes se basa en cruzar el campo libre `Examen.asignatura` (string) con `Asignatura.nombre`/`Asignatura.codigo` y consultar la tabla `Matricula`. Si los exámenes referencian asignaturas inexistentes o sin matrículas registradas, simplemente no se generan conflictos de tipo `Estudiante`.
- La ruta `/admin/examenes/conflictos` está registrada en `App.tsx` y vinculada desde `ExamenesView.tsx` mediante el botón **⚠️ Ver conflictos**, único cambio realizado sobre la vista existente.
- No se modificó la estructura de la base de datos, el archivo `database-setup.sql` ni ningún caso de uso previamente implementado.
