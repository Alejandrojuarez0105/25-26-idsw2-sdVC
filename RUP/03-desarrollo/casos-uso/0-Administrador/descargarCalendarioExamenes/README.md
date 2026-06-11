# Davidario > descargarCalendarioExamenes > Desarrollo

> |[🏠️](/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/descargarCalendarioExamenes/descargarCalendarioExamenes.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/descargarCalendarioExamenes/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/descargarCalendarioExamenes/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [examenes.controller.ts](/src/backend/src/modules/examenes/examenes.controller.ts) · [examenes.service.ts](/src/backend/src/modules/examenes/examenes.service.ts)
- **Frontend:** [ConsultarCalendarioView.tsx](/src/frontend/src/features/admin/examenes/ConsultarCalendarioView.tsx) · [examenes.service.ts](/src/frontend/src/services/examenes.service.ts)

## Descripción
Implementación de la descarga del calendario oficial de exámenes. Desde la vista de consulta, el administrador abre un modal de opciones (columnas a incluir y período) y descarga un archivo **CSV** consistente con los datos visualizados. La generación reutiliza la misma consolidación que `consultarCalendario`, garantizando que el documento descargado coincida con lo mostrado en pantalla.

## Estado
✅ **Completado** - Iteración 1

## Backend

### Endpoints

#### GET `/examenes/calendario/descargar`
Genera y devuelve el calendario como archivo CSV descargable.

**Query params (opcionales):**
- `incluirAula` (`'false'` para omitir la columna Aula; por defecto incluida).
- `incluirProfesor` (`'false'` para omitir la columna Profesor; por defecto incluida).
- `incluirEstudiantes` (`'false'` para omitir la columna Estudiantes; por defecto incluida).
- `fechaInicio`, `fechaFin` (`YYYY-MM-DD`): acotan el período exportado.

**Response (200 OK):** archivo binario adjunto.
- `Content-Type: text/csv; charset=utf-8`
- `Content-Disposition: attachment; filename="calendario-examenes.csv"`

### Implementación
- **NestJS**: Endpoint `@Get('calendario/descargar')` en `ExamenesController`, declarado **antes** de `@Get(':id')`. Usa `@Query()` para las opciones y `@Res()` (Express `Response`) para emitir el archivo con sus cabeceras; los fallos se traducen a `InternalServerErrorException`.
- **Servicio `ExamenesService.descargarCalendario(opts)`**:
  1. Reutiliza `buildCalendarioConsolidado()` (la misma fuente que `consultarCalendario`), garantizando consistencia con lo visualizado.
  2. Aplica el filtro de período (`fechaInicio`/`fechaFin`) sobre las fechas ya formateadas (`YYYY-MM-DD`).
  3. Si se incluye la columna de estudiantes, resuelve el número de matriculados por asignatura mediante `matriculasPorAsignatura()` (`groupBy` sobre `Matricula`).
  4. Construye el CSV con las columnas seleccionadas (`Fecha`, `Hora`, `Código`, `Asignatura`, y opcionalmente `Aula`, `Profesor`, `Estudiantes`, más `Estado`), escapando comillas y anteponiendo un BOM (`﻿`) para que Excel respete los acentos.
- **Sin cambios de esquema**: solo lectura.

### Formato de salida
- **CSV** (`.csv`): formato implementado, sin dependencias adicionales.
- **PDF / Excel**: contemplados en el diseño y el prototipo, quedan como **ampliación futura** (requieren librerías como `pdfkit`/`xlsx`); no se añaden para no introducir cambios estructurales innecesarios.

---

## Frontend

### Implementación
- **React**: La descarga se resuelve mediante un **modal** dentro de `ConsultarCalendarioView` (self-transition del estado de calendario abierto), adaptando `descargarCalendarioExamenes.html`. El modal ofrece:
  - **Formato**: CSV (PDF/Excel señalados como ampliación futura).
  - **Información a incluir**: checkboxes Aula / Profesor / Estudiantes matriculados.
  - **Período**: Completo o Personalizado (rango `Desde`/`Hasta` con validación de orden de fechas).
  - Botones **📎 Descargar** / **Cancelar**, con estado `descargando`.
- **Descarga en navegador**: `examenesService.descargarCalendario(opts)` solicita el endpoint con `responseType: 'blob'`; el `Blob` se materializa creando un `URL.createObjectURL` y un elemento `<a>` virtual con `download`, evitando problemas de memoria con binarios.

#### examenesService
- Método `descargarCalendario(opts)`: envía `GET /examenes/calendario/descargar` con los parámetros seleccionados y `responseType: 'blob'`.
- Interfaz exportada `DescargaOpciones`.

---

## Flujo de ejecución
1. En `ConsultarCalendarioView`, el Administrador pulsa **📎 Descargar calendario**.
2. Se abre el modal; el administrador elige columnas y período y pulsa **📎 Descargar**.
3. El frontend solicita `GET /examenes/calendario/descargar` (blob).
4. El backend consolida el mismo calendario, construye el CSV y lo devuelve como adjunto.
5. El navegador descarga `calendario-examenes.csv` y el modal se cierra.

## Notas de implementación
- El archivo descargado se genera desde la misma consolidación que la consulta (`buildCalendarioConsolidado`), por lo que es **idéntico** a lo visualizado y a los datos persistidos; la descarga es de solo lectura y nunca muta el calendario.
- Profesores y aulas provienen de las relaciones reales (`profesor.usuario`, `aula.codigo`); ningún campo de texto quemado.
- No se modificó autenticación, JWT, el esquema Prisma, `database-setup.sql` ni ningún caso de uso previamente implementado.

## Ampliación (Sesión 83) — Descarga en PDF

Además de **CSV**, la descarga admite ahora **PDF** (para los tres actores: Administrador, Profesor y Alumno). El endpoint acepta el query param **`formato`** (`csv` | `pdf`, por defecto `csv`); el servicio construye las mismas `columnas`/`filas` y, si `formato=pdf`, delega en el helper compartido `src/backend/src/common/calendario-pdf.ts` (basado en **`pdfkit`**), que genera un PDF tabular A4 apaisado (cabecera reimpresa al saltar de página) devuelto como `application/pdf` adjunto. El frontend añade un selector **CSV/PDF** en el modal de descarga y ajusta la extensión del archivo. CSV permanece intacto (incluido el BOM para Excel) y se reutiliza la misma fuente de datos, por lo que el contenido es idéntico. Verificado en caliente: los tres actores devuelven `200 application/pdf` (cabecera `%PDF-`).
</content>
