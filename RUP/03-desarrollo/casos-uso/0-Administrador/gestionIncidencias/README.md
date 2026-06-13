# Davidario > gestionIncidencias (Administrador) > Desarrollo

> |[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔧 Incidencias del Profesor](/RUP/03-desarrollo/casos-uso/1-Profesor/comunicarIncidenciaHorario/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|

- **Backend:** [incidencias.controller.ts](/src/backend/src/modules/incidencias/incidencias.controller.ts) · [incidencias.module.ts](/src/backend/src/modules/incidencias/incidencias.module.ts) · [incidencias.service.ts](/src/backend/src/modules/profesor/incidencias.service.ts) (reutilizado) · [prisma/schema.prisma](/src/backend/prisma/schema.prisma)
- **Frontend:** [GestionIncidenciasView.tsx](/src/frontend/src/features/admin/incidencias/GestionIncidenciasView.tsx) · [AdminDashboard.tsx](/src/frontend/src/features/admin/AdminDashboard.tsx) · [incidencias.service.ts](/src/frontend/src/services/incidencias.service.ts)

## Descripción
Panel de **gestión de incidencias** para el Administrador, que amplía el caso de uso exclusivo del Profesor [comunicarIncidenciaHorario](/RUP/03-desarrollo/casos-uso/1-Profesor/comunicarIncidenciaHorario/README.md). Permite al administrador **listar, revisar, omitir, resolver y exportar** las incidencias de horario comunicadas por los profesores, registrando un **mensaje de resolución** que queda visible para el profesor.

## Estado
✅ **Completado** - Iteración 1 (verificado en caliente)

## Modelo de datos (ampliación de Prisma)
Sobre la entidad `IncidenciaHorario` (creada en la Sesión 77) se añadieron, como ampliación aditiva:
- `mensajeResolucion String?` — mensaje del administrador al resolver.
- `fechaResolucion DateTime?` — momento de la resolución.
- Valor `OMITIDA` en el enum `EstadoIncidencia` (estados: `PENDIENTE`, `REVISADA`, `RESUELTA`, `OMITIDA`).

Migración aditiva `incidencia_resolucion_omitida` aplicada; no se alteró ninguna columna existente.

## Backend

### Módulo `incidencias` (nuevo, sin duplicar lógica)
Importa `ProfesorModule` y **reutiliza** `IncidenciasService` (que ya gestiona `IncidenciaHorario`), evitando módulos o servicios duplicados. Se extendió el servicio con métodos de administración (`listarTodas`, `obtener`, `cambiarEstado`, `aplicarSolucion`, `exportarCSV`) y un `serialize` enriquecido con profesor y datos de resolución.

### Endpoints
| Método | Ruta | Función |
|---|---|---|
| `GET` | `/incidencias` | Lista todas las incidencias (con profesor y examen). |
| `GET` | `/incidencias/export` | Exporta el listado en CSV (con BOM). |
| `PUT` | `/incidencias/:id/estado` | Cambia el estado (`CambiarEstadoDto`, valida enum). Al pasar a RESUELTA fija `fechaResolucion`. |
| `POST` | `/incidencias/:id/solucion` | Aplica solución (`AplicarSolucionDto`: `mensaje` 5–1000, `estado?`); registra mensaje + fecha y deja RESUELTA. |

DTOs con `class-validator`; estados inválidos → **400**; incidencia inexistente → **404**.

## Frontend

### GestionIncidenciasView (`/admin/incidencias`)
Tabla con profesor, examen, descripción, **estado (badge de color)** y acciones por incidencia:
- **🔍 Ver detalle** (modal con datos completos + resolución).
- **🔧 Aplicar solución** (modal con mensaje obligatorio ≥5; deja RESUELTA y muestra el mensaje).
- **✅ Marcar revisado** (`PUT estado=REVISADA`).
- **⏭️ Omitir** (`PUT estado=OMITIDA`; la fila se atenúa, no se elimina).

Barra global: **📋 Ver todos los conflictos**, **📎 Exportar reporte** (CSV), **🔄 Refrescar**, **🚪 Salir**.

### Integración con el AdminDashboard
Nueva sección **🔧 Incidencias** (coexiste con 📋 Conflictos recientes y 📅 Próximos exámenes): lista las incidencias recientes con badge de estado, contador de pendientes, acciones rápidas (Resolver → vista completa, ✅ Revisado, ⏭️ Omitir) y enlaces **📎 Exportar reporte** / **Ver todas →**. Añadida también la tarjeta de acceso rápido **🔧 Incidencias**.

## Mensajería de resolución
El `mensajeResolucion` se persiste al aplicar la solución y se muestra: (a) en el panel y modales del administrador, y (b) en la vista del profesor (solo lectura) junto con la fecha de resolución.

## Verificación realizada (en caliente)
Ciclo completo: profesor crea incidencia (PENDIENTE) → `GET /incidencias` la lista con profesor/examen → `PUT estado=REVISADA` (200) → estado inválido (400) → `POST /solucion` deja RESUELTA con mensaje y fecha → el profesor ve la resolución en `GET /profesor/incidencias` → `GET /incidencias/export` devuelve CSV (200). Registro de prueba eliminado tras verificar.

## Notas
- No se duplicaron módulos ni servicios; se reutilizó `PrismaService` y las relaciones `Profesor ↔ Examen` existentes.
- No se modificó la autenticación, el JWT, los exámenes ni `comunicarIncidenciaHorario` (solo se amplió de forma compatible).

## Referencias
- [comunicarIncidenciaHorario (Profesor)](/RUP/03-desarrollo/casos-uso/1-Profesor/comunicarIncidenciaHorario/README.md)
- [AGENTES.md](/AGENTES.md)
