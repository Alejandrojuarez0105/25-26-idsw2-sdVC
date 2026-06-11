# Davidario > descargarCalendarioExamenes (Alumno) > Desarrollo

> |[🏠️](/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/2-Alumno/DiagramaDeContextoAlumno.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/2-Alumno/descargarCalendarioExamenes/descargarCalendarioExamenes.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/2-Alumno/descargarCalendarioExamenes/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/2-Alumno/descargarCalendarioExamenes/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [alumno.controller.ts](/src/backend/src/modules/alumno/alumno.controller.ts) · [alumno-calendario.service.ts](/src/backend/src/modules/alumno/alumno-calendario.service.ts)
- **Frontend:** [AlumnoCalendarioView.tsx](/src/frontend/src/features/alumno/AlumnoCalendarioView.tsx) · [alumno.service.ts](/src/frontend/src/services/alumno.service.ts)

## Descripción
Permite al **Alumno** descargar su calendario de exámenes en **CSV** (mismo formato que la descarga del Administrador y del Profesor: CSV con BOM para Excel). El archivo contiene **únicamente los exámenes de sus asignaturas matriculadas**, garantizado por reutilizar el mismo filtro por matrículas de `consultarCalendario` (Alumno).

## Estado
✅ **Completado** - Iteración 1 (verificado en caliente)

## Backend

### Endpoint
#### GET `/alumno/calendario/descargar`
Protegido por `AlumnoJwtGuard`. Query params (opcionales): `incluirAula`, `incluirAsignatura` (boolean, por defecto `true`), `fechaInicio`, `fechaFin` (YYYY-MM-DD). Responde con binario adjunto (`Content-Disposition: attachment; filename="mi-calendario-examenes.csv"`, `Content-Type: text/csv; charset=utf-8`).

### Implementación
- **`AlumnoCalendarioService.descargarCalendario(alumnoId, opts)`**: reutiliza los datos ya filtrados de `consultarCalendario(alumnoId)` (no recalcula ni reconsulta exámenes ajenos), aplica el filtro de período opcional y genera el CSV con columnas seleccionables (`Fecha`, `Hora`, `Código`, `Asignatura?`, `Aula?`, `Estado`). Se emite con `@Res()` de Express, igual que la descarga del Administrador/Profesor.
- **Formato CSV** coherente con Administrador y Profesor (escape de comillas + BOM inicial). **PDF/Excel** quedan como ampliación futura (requerirían librerías adicionales), siguiendo la misma decisión de las otras ramas.

## Frontend

### Implementación
- **React**: el botón **📎 Descargar Calendario** de `AlumnoCalendarioView` (y la tarjeta del dashboard) abre un **modal** (formato CSV, casillas Asignatura/Aula, período Completo/Personalizado con validación de rango) y descarga el CSV vía `Blob` + `URL.createObjectURL` + `<a>` virtual.
- **`alumno.service.ts`**: método `descargarCalendario(opts)` con `responseType: 'blob'` → `GET /alumno/calendario/descargar`.

## Flujo de ejecución
1. Desde **Mis Exámenes**, el Alumno pulsa **📎 Descargar Calendario**.
2. Elige columnas/período y confirma; el frontend solicita `GET /alumno/calendario/descargar`.
3. El backend filtra por las matrículas del alumno (JWT) + período y devuelve el CSV adjunto.
4. El navegador descarga `mi-calendario-examenes.csv`; el modal se cierra.

## Verificación realizada (en caliente)
- `GET /alumno/calendario/descargar` (token Alumno) → **200**, `Content-Type: text/csv`. Con la matrícula de prueba ("Bases de Datos I"), el CSV contenía exactamente la cabecera y la fila de ese examen; sin token → 401; token Profesor → 403.

## Notas
- No se duplica la lógica de consolidación: se reutiliza `consultarCalendario` (Alumno), que a su vez reutiliza el método del Administrador. La descarga es de solo lectura; nunca modifica exámenes. No se modificó backend existente, autenticación, JWT ni el esquema Prisma.

## Referencias
- [Diseño: descargarCalendarioExamenes (Alumno)](/RUP/02-diseño/casos-uso/2-Alumno/descargarCalendarioExamenes/README.md)
- [Desarrollo: descargarCalendarioExamenes (Profesor)](/RUP/03-desarrollo/casos-uso/1-Profesor/descargarCalendario/README.md)
- [Desarrollo: consultarCalendario (Alumno)](../consultarCalendario/README.md)
- [AGENTES.md](/AGENTES.md)

## Ampliación (Sesión 83) — Descarga en PDF
`GET /alumno/calendario/descargar` acepta `formato` (`csv` | `pdf`). Con `formato=pdf` genera el calendario de sus asignaturas matriculadas en PDF (helper compartido `calendario-pdf.ts` con `pdfkit`); el modal del alumno incluye selector CSV/PDF. Verificado en caliente: `200 application/pdf`.
