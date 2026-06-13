<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/generarCalendario/README.md)|**Diseño**|[Implementación](/RUP/03-desarrollo/casos-uso/0-Administrador/generarCalendario/README.md)|Pruebas|
|---|---|---|---|---|---|

</div>

# Davidario > generarCalendario > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-08
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `generarCalendario()`. Define la vista de configuración de la generación, un **motor de calendarización en memoria** (`CalendarioEngine`) libre de dependencias de framework y persistencia, y la coordinación del caso de uso mediante una API REST en NestJS sobre Prisma + PostgreSQL.

Para mitigar los *code smells* de **Baja Cohesión** e **Invasión de Incumbencias (Feature Envy)** propios de un enfoque centralizado, se introduce el patrón de **Invención Pura** (`CalendarioEngine`) y se aplica el **Patrón Experto en Información** sobre las entidades `Aula` y `Profesor`. El proceso se diseña en **dos fases desacopladas**: (1) *generación de una propuesta* no persistida (estado `CALENDARIO_GENERADO`) y (2) *confirmación transaccional* que persiste las asignaciones sobre los exámenes existentes (`guardarCalendario()`).

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio, motor de dominio y persistencia.

<div align=center>

|![Diseño de Secuencia: generarCalendario()](/images/02-diseño/casos-uso/0-Administrador/generarCalendario/secuencia-diseño.svg)|
|---|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/generarCalendario/secuencia-diseño.puml)|

</div>

## objetivo del caso de uso

Asignar de forma automática **fecha, hora, aula y profesor supervisor** al conjunto de exámenes ya existentes en el sistema, dentro de una ventana temporal y unas franjas horarias configuradas por el administrador, respetando las restricciones duras del dominio (capacidad de aula, no solapamiento de aula, no cruce horario del profesor y no solapamiento de estudiantes) y maximizando la dispersión temporal de los exámenes de un mismo grado. El resultado se presenta como una **propuesta revisable** antes de su persistencia definitiva.

## diseño Frontend (React + TypeScript + Vite)

#### GenerarCalendarioView (Component)
- **Tecnología**: Functional Component (TSX), estilo visual coherente con `ExamenesView`, `AsignarProfesorAExamenView` y `ListarConflictosExamenesView` (Courier New).
- **Responsabilidad**: Capturar los parámetros de configuración (`fechaInicio`, `fechaFin`, `franjasHorarias`), lanzar la generación, presentar las estadísticas y la propuesta resultante, y ofrecer la confirmación o el descarte. Delega el estado y las llamadas al hook.
- **Ruta**: `/admin/calendario/generar` (registrada en `App.tsx`).

#### useGenerarCalendario (Hook)
- **Responsabilidad**: Gestionar el estado de la generación (`config`, `resultado`, `cargando`, `error`) y orquestar las dos fases.
- **Métodos**: `generar(config)` (Fase 1, no persiste) y `confirmar(propuesta)` (Fase 2, persiste).

#### calendarioService (Service)
- **Responsabilidad**: Encapsular vía Axios las llamadas `POST /calendario/generar` y `POST /calendario/confirmar`.
- **Métodos**: `generar(dto: GenerarCalendarioDto): Promise<GeneracionResultDto>` y `confirmar(dto: ConfirmarCalendarioDto): Promise<ConfirmacionResultDto>`.

## diseño Backend (NestJS + Prisma)

#### CalendarioController
- **Tecnología**: NestJS Controller (módulo `calendario`).
- **Endpoints**:
  - `POST /calendario/generar` → recibe `GenerarCalendarioDto`, delega en el servicio y devuelve `GeneracionResultDto` (propuesta + conflictos). **No escribe** en base de datos.
  - `POST /calendario/confirmar` → recibe `ConfirmarCalendarioDto` y delega la persistencia transaccional.

#### CalendarioService
- **Estereotipo**: Coordinador del caso de uso (Application Service).
- **Responsabilidades**:
  - `generar(dto)`: Carga en memoria los datos necesarios mediante `PrismaService` (exámenes con sus relaciones, aulas, profesores con sus asignaturas, catálogo de asignaturas y aforo por asignatura derivado de `Matricula`), construye un `GeneracionConfig` e invoca a `CalendarioEngine.generar()`. Devuelve el resultado sin persistir.
  - `confirmar(dto)`: Aplica la propuesta mediante `prisma.$transaction`, actualizando `fecha`, `hora`, `aulaId` y `profesorId` de cada examen.

#### CalendarioEngine
- **Estereotipo**: **Invención Pura (Pure Fabrication)**. Clase de dominio pura, sin dependencias de NestJS ni de Prisma → 100% testeable de forma aislada en memoria.
- **Métodos**:
  - `generar(config: GeneracionConfig): GeneracionResultDto`: Orquesta la calendarización combinatorial.
  - `generarRanurasTemporales(inicio, fin, franjas): Slot[]`: Genera la cuadrícula de días hábiles × franjas.
  - `buscarSlotOptimo(...)`: Evalúa exhaustivamente los candidatos válidos (aula + profesor + slot) y los puntúa por dispersión temporal respecto a exámenes ya asignados del mismo grado.
  - `calcularPuntuacionDispersion(...)`: Penaliza la proximidad en días (mismo día: -100, consecutivo: -50, 2 días: -20, 3 días: -5) para repartir los exámenes de un grado.
  - `registrarAsignacion(...)`: Reserva en memoria aula y profesor en el slot para impedir cruces en iteraciones posteriores.

#### Entidad `Aula` (Experto en Información — Espacio)
- `tieneCapacidadSuficiente(aforo: number): boolean`: `this.capacidad >= aforo`.
- `estaDisponibleEn(slot, examenesAsignados): boolean`: Comprueba que el `aulaId` no esté ocupado en el slot mediante **intersección de intervalos** en minutos (`slotStart < exEnd && exStart < slotEnd`), evitando cruces por distinta hora de inicio.

#### Entidad `Profesor` (Experto en Información — Docente)
- `tieneCruceHorario(slot, examenesAsignados): boolean`: Intersección de intervalos para evitar doble supervisión simultánea.
- `puedeImpartirAsignatura(asignaturaId): boolean`: Encapsula la consulta sobre sus `ProfesorAsignatura` (cumple la **Ley de Demeter**: el motor no inspecciona el array interno del profesor).

> **Nota de alcance (modelo de datos actual)**: el esquema vigente **no** incluye una entidad `Preferencia` de exclusiones horarias del docente. El motor aplica por tanto únicamente las **restricciones duras** del dominio. La verificación de preferencias docentes (`verificarPreferenciasDocentes()` del análisis) queda señalada como **ampliación futura**, integrable añadiendo un repositorio de preferencias sin alterar la arquitectura del motor.

## flujo de datos

1. **Configuración** (`SISTEMA_DISPONIBLE` → `generarCalendario()`): el administrador define `fechaInicio`, `fechaFin` y `franjasHorarias` en `GenerarCalendarioView`.
2. **Solicitud (Fase 1)**: `useGenerarCalendario.generar()` → `calendarioService.generar()` → `POST /calendario/generar`.
3. **Carga de datos (solo lectura)**: `CalendarioService` consulta vía `PrismaService`:
   - `examen.findMany({ include: { profesor, aula } })`
   - `aula.findMany()` (capacidad)
   - `profesor.findMany({ include: { asignaturas } })`
   - `asignatura.findMany()` y conteo de `Matricula` por `asignaturaId` (aforo y resolución del `Examen.asignatura` libre contra el catálogo).
4. **Cálculo en memoria**: `CalendarioEngine.generar(config)` produce la propuesta y la lista de conflictos sin tocar la base de datos.
5. **Respuesta (Fase 1)**: `GeneracionResultDto` asciende hasta la vista → estado `CALENDARIO_GENERADO`. **Nada se persiste todavía.**
6. **Confirmación (Fase 2)**: tras la revisión, `confirmar(propuesta)` → `POST /calendario/confirmar` → `prisma.$transaction` actualiza cada `Examen` (`fecha`, `hora`, `aulaId`, `profesorId`).
7. **Retorno**: confirmación → la vista navega a la consulta del calendario (`consultarCalendario()`).

### contratos (DTOs)

```typescript
// Entrada Fase 1
class GenerarCalendarioDto {
  @IsDateString() fechaInicio: string;
  @IsDateString() fechaFin: string;
  @IsArray() @IsString({ each: true }) franjasHorarias: string[]; // p.ej. ["09:00", "11:30", "16:00"]
}

// Salida Fase 1
interface AsignacionPropuesta {
  examenId: string;            // UUID
  fecha: string;               // YYYY-MM-DD
  hora: string;                // HH:MM
  aulaId: string | null;       // UUID
  profesorId: string | null;   // UUID
}

interface ConflictoInfo {
  examenId: string;
  examenCodigo: string;
  asignatura: string;
  motivo: string;              // capacidad | aula | profesor | estudiante | sin-slot
}

interface GeneracionResultDto {
  exito: boolean;
  totalExamenes: number;
  programados: number;
  noProgramados: number;
  propuesta: AsignacionPropuesta[];
  conflictos: ConflictoInfo[];
}

// Entrada Fase 2
class ConfirmarCalendarioDto {
  @IsArray() @ValidateNested({ each: true })
  @Type(() => AsignacionPropuesta)
  asignaciones: AsignacionPropuesta[];
}
```

## componentes implicados

| Capa | Componente | Tecnología |
|---|---|---|
| Presentación | `GenerarCalendarioView`, `useGenerarCalendario`, `calendarioService` | React + TS + Axios |
| API | `CalendarioController` | NestJS |
| Aplicación | `CalendarioService` | NestJS |
| Dominio | `CalendarioEngine`, expertos `Aula` / `Profesor` | TypeScript puro |
| Persistencia | `PrismaService` | Prisma ORM |
| Datos | `Examen`, `Aula`, `Profesor`, `Asignatura`, `Matricula` | PostgreSQL 16 |

## integración con Exámenes

El calendario **se construye sobre los exámenes ya existentes** (`crearExamen`, `editarExamen`). La generación **no crea ni elimina** exámenes: únicamente actualiza sus campos `fecha`, `hora`, `aulaId` y `profesorId`. El aforo de cada examen se deriva resolviendo el campo libre `Examen.asignatura` contra el catálogo `Asignatura` (por `nombre`/`codigo`, patrón ya usado en `listarConflictosExamenes`) y contando las `Matricula` de esa asignatura. No se introduce ninguna tabla `Calendario`: **el calendario es el propio conjunto de exámenes con sus asignaciones**, coherente con el refactor de FKs (`profesorId`/`aulaId`) consolidado en exámenes.

## integración con Profesores

La asignación de supervisor reutiliza la FK `Examen.profesorId → Profesor` empleada por `asignarProfesorAExamen`. El motor solo propone un profesor si `puedeImpartirAsignatura()` (vía `ProfesorAsignatura`) y si no presenta cruce horario (`tieneCruceHorario()`) con otra supervisión en el mismo slot. La generación es compatible con las asignaciones manuales previas: los exámenes que ya tengan `profesorId` se respetan como restricción de entrada.

## integración con Aulas

La asignación de espacio reutiliza la FK `Examen.aulaId → Aula`. El motor solo propone un aula cuyo `capacidad` cubra el aforo (`tieneCapacidadSuficiente()`) y que esté libre en el slot (`estaDisponibleEn()`, intersección de intervalos). Como el modelo actual de `Aula` no contempla `tipo`, la idoneidad se reduce a la **capacidad** y a la **disponibilidad temporal**.

## manejo de conflictos

El motor previene conflictos **durante** la asignación (restricciones duras) y registra como `ConflictoInfo` todo examen que no pueda ubicarse (sin aula con aforo, sin profesor habilitado/libre, solapamiento de estudiantes o sin slot disponible). Tras la confirmación, la propuesta persistida es coherente con el detector ya diseñado en [`listarConflictosExamenes`](../listarConflictosExamenes/README.md), que actúa como **validación independiente** de la integridad del calendario (profesor, aula y estudiante por slot). De este modo la generación y la auditoría de conflictos comparten la misma definición de solapamiento (cruce por `(fecha, hora)` resuelto sobre FKs reales).

## resultado esperado de la generación

- Una **propuesta** (`GeneracionResultDto`) con el número de exámenes programados/no programados, las asignaciones sugeridas y los conflictos no resueltos, mostrada al administrador **sin persistir** (estado `CALENDARIO_GENERADO`).
- Tras `guardarCalendario()`, los exámenes quedan actualizados transaccionalmente con su `fecha`, `hora`, `aulaId` y `profesorId`, dejando el calendario listo para su **consulta y descarga** (`consultarCalendario()`, `descargarCalendarioExamenes()`).

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `GenerarCalendarioView` | `GenerarCalendarioView (React)` + `useGenerarCalendario (Hook)` | UI de configuración y presentación de estadísticas/propuesta/conflictos. |
| — | `calendarioService (Axios)` | Invocación de la API del motor de calendarización. |
| `CalendarioController` | `CalendarioController (NestJS)` | Exposición de `POST /calendario/generar` y `POST /calendario/confirmar`. |
| `CalendarioController` (orquestación) | `CalendarioService (NestJS)` | Coordinador: carga datos, invoca al motor y persiste transaccionalmente. |
| — | `CalendarioEngine (Dominio)` | Motor combinatorial puro, libre de base de datos (Invención Pura). |
| `ExamenRepository` / `Examen` | `PrismaService` / `Examen` (modelo) | Carga de exámenes y persistencia de la asignación. |
| `AulaRepository` / `Aula` | `PrismaService` / `Aula` (Experto en Información) | Capacidad y disponibilidad espacial. |
| `ProfesorRepository` / `Profesor` | `PrismaService` / `Profesor` (Experto en Información) | Habilitación docente y cruce horario. |
| `PreferenciaRepository` | *(no aplicable en el modelo actual)* | Señalado como ampliación futura. |
| `GeneracionResult` | `GeneracionResultDto` | Objeto de transferencia con el balance del proceso. |

## referencias

- [Análisis: generarCalendario()](/RUP/01-analisis/casos-uso/0-Administrador/generarCalendario/README.md)
- [Diseño: listarConflictosExamenes()](../listarConflictosExamenes/README.md) - Detector de conflictos reutilizado como validación.
- [Diseño: asignarProfesorAExamen()](../asignarProfesorAExamen/README.md) - FK `profesorId` reutilizada.
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Diagramas de Clases](/images/02-diseño/clases-diseño.svg) - Diseño Global
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
</content>
</invoke>
