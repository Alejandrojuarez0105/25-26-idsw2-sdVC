<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/1-Profesor/DiagramaDeContextoProfesor.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/1-Profesor/comunicarIncidenciasHorario/README.md)|**Diseño**|Implementación|Pruebas|
|---|---|---|---|---|---|

</div>

# Davidario > comunicarIncidenciasHorario > Diseño (Profesor)

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-09
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso **exclusivo del Profesor** `comunicarIncidenciasHorario()`. Permite al profesor **reportar conflictos o incidencias** detectadas en su calendario (p. ej. solapamientos, errores de aula u horario imposible), seleccionando el examen afectado, clasificando el tipo de incidencia y describiéndola textualmente, para enviarla al sistema y dejarla disponible para **revisión administrativa**. No tiene equivalente directo en la rama Administrador; se diseña siguiendo los mismos criterios metodológicos (separación por capas, trazabilidad análisis → diseño) y patrones (DTO + validación NestJS, Repository vía Prisma) del resto del proyecto.

### Diagrama de secuencia de diseño

Interacción técnica entre el formulario de incidencia, el servicio de API, el controlador NestJS y la persistencia.

<div align=center>

|![Diseño de Secuencia: comunicarIncidenciasHorario()](/images/02-diseño/casos-uso/1-Profesor/comunicarIncidenciasHorario/secuencia-diseño.svg)|
|---|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/1-Profesor/comunicarIncidenciasHorario/secuencia-diseño.puml)|

</div>

## diseño completo del caso de uso

El profesor abre el formulario de incidencias (`comunicarIncidenciasHorario()` → estado `INCIDENCIAS_ABIERTO`), el sistema carga **sus exámenes asignados** (reutilizando el filtro por `profesorId` del JWT), selecciona uno, visualiza sus datos para confirmación, elige el **tipo** de incidencia, escribe una **descripción**, y confirma el envío. El backend valida los datos, verifica que el examen pertenece al profesor autenticado, **persiste** la incidencia con estado `PENDIENTE` y devuelve confirmación. La vista muestra el mensaje de éxito (`mostrarIncidenciaRegistrada`) y permite finalizar (`completarComunicacion()`) o cancelar (`cancelarComunicacion()`).

## arquitectura Frontend (React + TypeScript + Vite)

#### ComunicarIncidenciasView (Component)
- **Tecnología**: Functional Component (TSX), estilo Courier New coherente con el resto del proyecto.
- **Ruta**: `/profesor/incidencias` (registrada en `App.tsx`, protegida por *guard* de rol Profesor).
- **Responsabilidad**: Presentar el **formulario de incidencia** y orquestar la interacción; delega carga, estado y envío al hook.
- **Características de UI**:
  - Desplegable de **examen** (lista de exámenes propios; cada opción muestra asignatura + fecha + hora).
  - Panel de **detalle del examen** seleccionado (asignatura, fecha, hora, aula) para confirmación visual.
  - Desplegable de **tipo de incidencia** (`SOLAPAMIENTO`, `AULA_INCORRECTA`, `FECHA_INVALIDA`, `OTRO`).
  - Área de texto de **descripción** (obligatoria).
  - Botón **📨 Enviar incidencia** y botón **❌ Cancelar** (`cancelarComunicacion()`).
  - **Confirmación de envío**: mensaje de éxito tras el registro y bloqueo del doble envío.

#### Validaciones (frontend)
- `examenId` requerido (debe pertenecer a la lista cargada).
- `tipo` requerido (valor del enum permitido).
- `descripcion` requerida, longitud mínima (p. ej. 10) y máxima (p. ej. 500) caracteres.
- Botón de envío deshabilitado mientras el formulario no sea válido o haya un envío en curso.

#### useIncidencias (Hook)
- **Responsabilidad**: Gestionar el estado (`examenes`, `seleccion`, `tipo`, `descripcion`, `enviando`, `error`, `exito`).
- **Métodos**: `loadExamenesPropios()`, `enviarIncidencia(dto)`.

#### incidenciasService (Service)
- **Responsabilidad**: Comunicación Axios con el backend.
- **Métodos**:
  - `findExamenesPropios(): Promise<ExamenCalendarioDto[]>` — reutiliza `GET /examenes/calendario` (filtro por rol).
  - `crearIncidencia(dto: CrearIncidenciaDto): Promise<IncidenciaDto>` — `POST /incidencias`.

## arquitectura Backend (NestJS + Prisma)

#### Controladores implicados — IncidenciasController
- **Módulo nuevo**: `incidencias` (módulo propio, no se mezcla con `examenes`).
- **Endpoint de recepción**: `POST /incidencias`, protegido por `JwtAuthGuard` + `RolesGuard` (`Profesor`).
- **Body**: `CrearIncidenciaDto`.
- **Responsabilidad**: Recibir la petición, propagar `req.user` y delegar en el servicio. (Opcional para la fase de revisión administrativa: `GET /incidencias` para el Administrador, fuera del alcance de esta rama).

#### Servicios implicados — IncidenciasService
- **Método**: `crear(dto, usuario): Promise<IncidenciaDto>`.
- **Responsabilidades (validación de negocio)**:
  - Verificar que el `examenId` existe y que su `profesorId` **coincide** con el del usuario autenticado (de lo contrario `403 Forbidden`), evitando reportar incidencias sobre exámenes ajenos.
  - Construir la entidad con `estado = PENDIENTE` y `profesorId` del JWT.
  - Persistir vía `PrismaService` y devolver el `IncidenciaDto`.

#### PrismaService / PostgreSQL
- **Operación**: `prisma.incidencia.create(...)` y, para la futura revisión, `findMany` con join a `Examen`/`Profesor`.

### contrato (DTO)

```typescript
export enum TipoIncidencia {
  SOLAPAMIENTO = 'SOLAPAMIENTO',
  AULA_INCORRECTA = 'AULA_INCORRECTA',
  FECHA_INVALIDA = 'FECHA_INVALIDA',
  OTRO = 'OTRO',
}

export class CrearIncidenciaDto {
  @IsUUID()        examenId: string;
  @IsEnum(TipoIncidencia) tipo: TipoIncidencia;
  @IsString() @Length(10, 500) descripcion: string;
}

export interface IncidenciaDto {
  id: string;
  examenId: string;
  tipo: TipoIncidencia;
  descripcion: string;
  estado: 'PENDIENTE' | 'REVISADA' | 'RESUELTA';
  fechaCreacion: string;   // ISO-8601
}
```

### modelo de persistencia propuesto (Prisma)

> **Nota de diseño**: el esquema vigente (`schema.prisma`) **aún no incluye** la entidad `Incidencia`. Su materialización corresponde a la fase de implementación; aquí se documenta el modelo previsto para asegurar la trazabilidad. No se modifica ningún artefacto de implementación en esta sesión.

```prisma
enum TipoIncidencia {
  SOLAPAMIENTO
  AULA_INCORRECTA
  FECHA_INVALIDA
  OTRO
}

enum EstadoIncidencia {
  PENDIENTE
  REVISADA
  RESUELTA
}

model Incidencia {
  id            String           @id @default(uuid()) @db.Uuid
  tipo          TipoIncidencia
  descripcion   String           @db.Text
  estado        EstadoIncidencia @default(PENDIENTE)
  fechaCreacion DateTime         @default(now()) @db.Timestamptz

  examenId   String   @db.Uuid
  examen     Examen   @relation(fields: [examenId], references: [id], onDelete: Cascade)
  profesorId String   @db.Uuid
  profesor   Profesor @relation(fields: [profesorId], references: [id], onDelete: Cascade)

  @@index([examenId])
  @@index([profesorId])
  @@index([estado])
}
```

Esta entidad reutiliza las FKs ya consolidadas (`Examen`, `Profesor`) y respeta las convenciones del esquema (UUID, `Timestamptz`, índices), de modo que su incorporación futura no altera las entidades existentes (solo añade las relaciones inversas `Examen.incidencias` y `Profesor.incidencias`).

## flujo de datos

1. `comunicarIncidenciasHorario()`: el profesor abre `ComunicarIncidenciasView`.
2. `useIncidencias.loadExamenesPropios()` → `incidenciasService.findExamenesPropios()` → `GET /examenes/calendario` (filtro por `profesorId`).
3. El profesor selecciona examen, tipo y descripción; el formulario valida en cliente.
4. `useIncidencias.enviarIncidencia(dto)` → `incidenciasService.crearIncidencia(dto)` → `POST /incidencias`.
5. `IncidenciasController` → `IncidenciasService.crear(dto, req.user)`: valida pertenencia del examen y datos.
6. `PrismaService.incidencia.create()` persiste con `estado = PENDIENTE`.
7. Respuesta `IncidenciaDto` → la vista muestra confirmación de envío.
8. Acciones de salida: `completarComunicacion()` (éxito) o `cancelarComunicacion()` → menú.

## componentes implicados

| Capa | Componente | Tecnología |
|---|---|---|
| Presentación | `ComunicarIncidenciasView`, `useIncidencias`, `incidenciasService` | React + TS + Axios |
| API | `IncidenciasController` (`POST /incidencias`) + `RolesGuard` | NestJS |
| Aplicación | `IncidenciasService.crear()` (validación de pertenencia) | NestJS |
| Persistencia | `PrismaService` | Prisma ORM |
| Datos | `Incidencia` *(propuesta)*, `Examen`, `Profesor` | PostgreSQL 16 |

## restricción de acceso

Caso exclusivo del rol **Profesor** (`/profesor/incidencias`). El servicio garantiza que un profesor solo puede reportar incidencias sobre **sus propios exámenes** (verificación `examen.profesorId === usuario.profesorId`). La revisión administrativa de las incidencias persistidas se contempla como ampliación compatible (endpoint `GET /incidencias` para el Administrador) y queda fuera del alcance de esta rama.

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `ComunicarIncidenciasView` | `ComunicarIncidenciasView (React)` + `useIncidencias (Hook)` | Formulario, validaciones y confirmación de envío. |
| `IncidenciasController` | `IncidenciasController (NestJS)` + `IncidenciasService` | Coordinación, validación de integridad y orquestación. |
| `IncidenciaRepository` | `PrismaService` (`incidencia.create`) | Persistencia de la incidencia mediante ORM. |
| `ExamenRepository` | `ExamenesService.findCalendario()` (filtro por rol) | Carga de exámenes propios para selección. |
| `Incidencia` | modelo Prisma `Incidencia` *(propuesto)* + `IncidenciaDto` | Entidad de dominio mapeada a persistencia. |
| `Examen` | modelo Prisma `Examen` | Examen afectado por la incidencia. |
| `:Incidencias Abierto` | estado `INCIDENCIAS_ABIERTO` (UI) | `completarComunicacion()` / `cancelarComunicacion()`. |

## referencias

- [Análisis: comunicarIncidenciasHorario() (Profesor)](/RUP/01-analisis/casos-uso/1-Profesor/comunicarIncidenciasHorario/README.md)
- [Diseño: consultarCalendario() (Profesor)](../consultarCalendario/README.md) - Origen de los exámenes seleccionables.
- [Modelo del Dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Profesor](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/1-Profesor/DiagramaDeContextoProfesor.svg)
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
