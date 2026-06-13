# Davidario > descargarCalendario (Profesor) > Desarrollo

> |[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/1-Profesor/DiagramaDeContextoProfesor.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/1-Profesor/descargarCalendarioExamenes/descargarCalendarioExamenes.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/1-Profesor/descargarCalendarioExamenes/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/1-Profesor/descargarCalendarioExamenes/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [profesor.controller.ts](/src/backend/src/modules/profesor/profesor.controller.ts) · [profesor-calendario.service.ts](/src/backend/src/modules/profesor/profesor-calendario.service.ts)
- **Frontend:** [ProfesorCalendarioView.tsx](/src/frontend/src/features/profesor/ProfesorCalendarioView.tsx) · [profesor.service.ts](/src/frontend/src/services/profesor.service.ts)

## Descripción
Permite al **Profesor** descargar su calendario de exámenes en **CSV** (mismo formato que la descarga del Administrador: CSV con BOM para Excel). El archivo contiene **únicamente sus exámenes asignados**, garantizado por reutilizar el mismo filtro por `profesorId` de `consultarCalendario` (Profesor).

## Estado
✅ **Completado** - Iteración 1

## Backend

### Endpoint
#### GET `/profesor/calendario/descargar`
Protegido por `ProfesorJwtGuard`. Query params (opcionales): `incluirAula`, `incluirAsignatura` (boolean, por defecto `true`), `fechaInicio`, `fechaFin` (YYYY-MM-DD). Responde con binario adjunto (`Content-Disposition: attachment; filename="mi-calendario-examenes.csv"`, `Content-Type: text/csv; charset=utf-8`).

### Implementación
- **`ProfesorCalendarioService.descargarCalendario(profesorId, opts)`**: reutiliza los datos ya filtrados de `consultarCalendario(profesorId)` (no recalcula ni reconsulta exámenes ajenos), aplica el filtro de período opcional y genera el CSV con columnas seleccionables (`Fecha`, `Hora`, `Código`, `Asignatura?`, `Aula?`, `Estado`). Se emite con el call `@Res()` de Express, igual que la descarga del Administrador.
- **Formato CSV** coherente con el Administrador (escape de comillas + BOM inicial). **PDF/Excel** quedan como ampliación futura (requerirían librerías adicionales), siguiendo la misma decisión tomada en la rama Administrador.

## Frontend

### Implementación
- **React**: el botón **📎 Descargar Calendario** de `ProfesorCalendarioView` abre un **modal** (formato CSV, casillas Asignatura/Aula, período Completo/Personalizado con validación de rango) y descarga el CSV vía `Blob` + `URL.createObjectURL` + `<a>` virtual.
- **`profesor.service.ts`**: método `descargarCalendario(opts)` con `responseType: 'blob'` → `GET /profesor/calendario/descargar`.

## Flujo de ejecución
1. Desde **Mi Calendario**, el Profesor pulsa **📎 Descargar Calendario**.
2. Elige columnas/período y confirma; el frontend solicita `GET /profesor/calendario/descargar`.
3. El backend filtra por `profesorId` (JWT) + período y devuelve el CSV adjunto.
4. El navegador descarga `mi-calendario-examenes.csv`; el modal se cierra.

## Notas
- No se duplica la lógica de consolidación: se reutiliza `consultarCalendario` (Profesor), que a su vez reutiliza el método del Administrador. La descarga es de solo lectura; nunca modifica exámenes.
- No se modificó backend existente, autenticación ni JWT.

## Referencias
- [Diseño: descargarCalendarioExamenes (Profesor)](/RUP/02-diseño/casos-uso/1-Profesor/descargarCalendarioExamenes/README.md)
- [Desarrollo: descargarCalendarioExamenes (Administrador)](/RUP/03-desarrollo/casos-uso/0-Administrador/descargarCalendarioExamenes/README.md)
- [Desarrollo: consultarCalendario (Profesor)](../consultarCalendario/README.md)
- [AGENTES.md](/AGENTES.md)

## Ampliación (Sesión 83) — Descarga en PDF
`GET /profesor/calendario/descargar` acepta `formato` (`csv` | `pdf`). Con `formato=pdf` genera el calendario propio en PDF (helper compartido `calendario-pdf.ts` con `pdfkit`); el modal del profesor incluye selector CSV/PDF. Verificado en caliente: `200 application/pdf`.
