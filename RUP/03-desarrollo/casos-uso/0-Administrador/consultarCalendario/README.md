# Davidario > consultarCalendario > Desarrollo

> |[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/consultarCalendario/consultarCalendario.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/consultarCalendario/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/consultarCalendario/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [examenes.controller.ts](/src/backend/src/modules/examenes/examenes.controller.ts) · [examenes.service.ts](/src/backend/src/modules/examenes/examenes.service.ts)
- **Frontend:** [ConsultarCalendarioView.tsx](/src/frontend/src/features/admin/examenes/ConsultarCalendarioView.tsx) · [AdminDashboard.tsx](/src/frontend/src/features/admin/AdminDashboard.tsx) · [examenes.service.ts](/src/frontend/src/services/examenes.service.ts)

## Descripción
Implementación de la consulta del calendario oficial de exámenes. Consolida en una vista cronológica todos los exámenes registrados con su profesor y aula **reales** (resueltos desde `profesorId`/`aulaId`), marca los implicados en conflictos (reutilizando la detección existente) y presenta un resumen del calendario (exámenes programados, profesores asignados, aulas utilizadas y estudiantes afectados). Es una operación de solo lectura.

## Estado
✅ **Completado** - Iteración 1

## Backend

### Endpoints

#### GET `/examenes/calendario`
Devuelve el calendario consolidado listo para visualización.

**Response (200 OK):**
```json
{
  "generadoEn": "2026-06-08T17:00:00.000Z",
  "resumen": {
    "totalExamenes": 8,
    "profesoresAsignados": 4,
    "aulasUtilizadas": 4,
    "estudiantesAfectados": 195
  },
  "examenes": [
    {
      "id": "uuid-1", "codigo": "EX001", "asignatura": "Programación I",
      "fecha": "2026-01-15", "hora": "08:30", "aula": "-2.6", "aulaId": "uuid-aula",
      "profesor": "Manuel Masías", "profesorId": "uuid-prof",
      "tieneConflicto": false, "tiposConflicto": []
    }
  ],
  "conflictos": [ /* misma estructura que GET /examenes/conflictos */ ]
}
```

### Implementación
- **NestJS**: Endpoint `@Get('calendario')` en `ExamenesController`, declarado **antes** de `@Get(':id')` para evitar colisiones de routing, con `try/catch` → `InternalServerErrorException`.
- **Servicio `ExamenesService.consultarCalendario()`**:
  1. Reutiliza el helper privado `buildCalendarioConsolidado()`, que obtiene los exámenes con `prisma.examen.findMany` (`orderBy` `fecha`/`hora`, `include` de `profesor.usuario` y `aula`), invoca `findConflictos()` y serializa cada examen resolviendo profesor/aula reales y marcando `tieneConflicto`/`tiposConflicto`.
  2. Calcula el resumen: `totalExamenes`, `profesoresAsignados` (IDs distintos), `aulasUtilizadas` (IDs distintos) y `estudiantesAfectados` (alumnos distintos matriculados en las asignaturas con examen, resueltas vía `matriculasPorAsignatura()`).
  3. Devuelve la estructura consolidada.
- **Sin cambios de esquema**: solo lectura sobre `Examen`, `Asignatura`, `Matricula`, `Profesor`, `Aula`.

---

## Frontend

### Implementación
- **React**: Componente `ConsultarCalendarioView` (estilo Courier New) con máquina de estados `loading | error | success`.
  - **loading**: spinner mientras se consulta el calendario.
  - **error**: panel rojo para fallos técnicos con **🔄 Reintentar** / **🚪 Cerrar**.
  - **success sin exámenes**: pantalla **❌ CALENDARIO NO DISPONIBLE** (adaptación de `consultarCalendarioError.html`) con instrucciones y acceso directo a **Generar calendario**.
  - **success con exámenes**: tabla cronológica con `FECHA / HORA / ASIGNATURA / AULA / PROFESOR / ESTADO` (filas en conflicto resaltadas, `(sin aula)`/`(sin profesor)` para relaciones nulas), aviso de conflictos con enlace a `/admin/examenes/conflictos`, panel **📊 Resumen del calendario** (4 métricas) y botones **📎 Descargar calendario** / **🔄 Refrescar** / **🚪 Cerrar**.
- **Ruta**: `/admin/calendario/consultar` (registrada en `App.tsx`).

#### examenesService
- Método `consultarCalendario()`: envía `GET /examenes/calendario`.
- Interfaz exportada `CalendarioConsulta`.

### Integración con el Dashboard del Administrador
- La tarjeta de acceso rápido **📅 Calendario** navega ahora a `/admin/calendario/consultar` (antes mostraba "Funcionalidad en desarrollo").
- El bloque **📅 Próximos exámenes** se alimenta de datos reales: consume `consultarCalendario()`, filtra los exámenes con `fecha >= hoy` y muestra los 5 primeros (con *fallback* a los más recientes si no hay futuros). Se eliminó el contenido hardcodeado.
- El enlace **Ver todos los exámenes →** navega a `/admin/calendario/consultar` (antes mostraba un `alert`).

---

## Flujo de ejecución
1. El Administrador pulsa la tarjeta **📅 Calendario** del dashboard (o "Ver todos los exámenes →").
2. Se navega a `/admin/calendario/consultar`; la vista invoca `GET /examenes/calendario`.
3. El backend consolida los exámenes, valida conflictos y devuelve el calendario + resumen.
4. La vista renderiza la tabla cronológica, los avisos de conflicto y el resumen; si no hay exámenes, muestra la pantalla de calendario no disponible.

## Notas de implementación
- Profesores y aulas se obtienen exclusivamente desde las relaciones reales (`profesor.usuario`, `aula.codigo`), respetando la prohibición de texto quemado.
- Los endpoints de calendario (`/examenes/calendario`, `/examenes/calendario/generar`, `/examenes/calendario/descargar`) se declaran antes de `@Get(':id')` para evitar colisiones de routing.
- No se modificó autenticación, JWT, el esquema Prisma, `database-setup.sql` ni ningún caso de uso previamente implementado; los cambios en el dashboard son la sustitución de datos hardcodeados/alertas por navegación y datos reales.
</content>
