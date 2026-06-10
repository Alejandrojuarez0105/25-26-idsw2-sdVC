<div align="right">

|[🏠️](/RUP/README.md)|[🔍 Análisis](/RUP/01-analisis/README.md)|**Estudio de datos reales**|
|-|-|-|

</div>

# Estudio: Análisis de datos reales y planificación de adaptación del modelo académico

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis (estudio previo a evolución del modelo)
- **Sesión**: 81
- **Versión**: 1.0
- **Fecha**: 2026-06-11
- **Autor**: Alejandro Juárez
- **Naturaleza**: Documento de análisis. **No** implica cambios de código, esquema ni base de datos.

> **Fuentes analizadas**: `Aulas.txt`, `Grados.txt`, `AsignaturasPrimerSemestre.txt`, `AsignaturaSegundoSemestre.txt` (datos reales de la Universidad Europea del Atlántico que se importarán en el futuro).
> **Modelo de referencia**: `src/backend/prisma/schema.prisma` (estado tras la Sesión 80).

---

## 1. Resumen ejecutivo

El análisis de los datos reales revela **tres incompatibilidades estructurales** entre la información que se importará y el modelo de datos actual:

1. **Asignaturas compartidas entre grados (N:M)**. El modelo actual fija que *una asignatura pertenece a un único grado* (`Asignatura.gradoId`, FK obligatoria). Los datos reales contienen **decenas de asignaturas impartidas en varios grados** (p. ej. *Inglés III* en 11 grados, *Economía de la Empresa y Emprendedores* en 10, *Dirección Estratégica y Competencias Directivas* en 6). El modelo actual **no puede representar** esta realidad sin duplicar datos.
2. **Ausencia del concepto de semestre**. Los datos están organizados por **primer y segundo semestre**, y la numeración de asignaturas lo confirma (*Inglés I/III* → 1.º; *Inglés II/IV* → 2.º; *Estadística I* → 1.º, *Estadística II* → 2.º). El modelo no tiene ningún atributo ni entidad de semestre/periodo.
3. **Exámenes acoplados a una asignatura por texto libre y a una sola aula**. `Examen.asignatura` es un `String` libre (no una FK) y un examen referencia **un único aula** (`aulaId`). Con asignaturas compartidas de alta matrícula, un examen real necesitará **varias aulas** (por capacidad) y una identificación **fiable** de la asignatura.

Adicionalmente, los datos introducen **niveles académicos no contemplados** (un **Máster**, MASTERPSI, y un **programa de movilidad**, GERA≡ERASMUS) y presentan **inconsistencias de normalización** (acentos/mayúsculas/duplicados) que romperían el emparejamiento por texto del que hoy depende el calendario del alumno.

**Conclusión**: el modelo actual es válido para el alcance demostrado hasta ahora (pocos grados, asignaturas no compartidas, exámenes 1‑aula), pero **no es suficiente** para los datos reales. Se requiere una **evolución del modelo** (principalmente: relación N:M grado‑asignatura, semestre y refactor de `Examen`), planificada para futuras sesiones. **Este documento no introduce ningún cambio.**

---

## 2. Hallazgos encontrados

### 2.1 Grados (`Grados.txt`)

Se listan **18 entradas**, que conviene clasificar porque no todas son "grados" homogéneos:

| Código | Denominación | Tipo real |
|---|---|---|
| GADE | Administración y Dirección de Empresas | Grado |
| GCA | Comunicación Audiovisual | Grado |
| GCAFD | Ciencias de la Actividad Física y del Deporte | Grado |
| GCG | Cocina y Gastronomía | Grado |
| GCTA | Ciencia y Tecnología de los Alimentos | Grado |
| GEP | Educación Primaria | Grado |
| GII | Ingeniería Informática | Grado |
| GIIAA | Ingeniería Industrial Agroalimentaria | Grado |
| GIOI | Ingeniería de Organización Industrial | Grado |
| GLA | Lenguas Aplicadas | Grado |
| GND | Nutrición y Dietética | Grado |
| GPER | Periodismo | Grado |
| GPRP | Publicidad y Relaciones Públicas | Grado |
| GPSI | Psicología | Grado |
| GTEL | Traducción y Lingüística | Grado |
| GTI | Traducción e Interpretación | Grado |
| **GERA / ERASMUS** | Relaciones Internacionales / Movilidad | **Programa con doble nombre por semestre** |
| **MASTERPSI** | Máster en Psicología | **Nivel: Máster (no grado)** |

**Observaciones clave**:
- **16 grados** propiamente dichos, **1 máster** (MASTERPSI) y **1 programa de movilidad** con **doble denominación** (`GERA` en 1.º semestre, `ERASMUS` en 2.º) que **son la misma entidad**.
- El sistema actual arranca con muy pocos grados de *seed* (~4). El conjunto real es **~4× mayor** y heterogéneo en nivel académico.

### 2.2 Asignaturas — compartición entre grados (N:M)

Ambos ficheros incluyen un apartado explícito **"ASIGNATURAS QUE SE REPITEN EN DOS O MÁS GRADOS"**. Es el hallazgo más relevante. Ejemplos de mayor alcance:

| Asignatura | N.º de grados | Grados (muestra) |
|---|---|---|
| Inglés III | 11 | GCAFD, GPSI, GIIAA, GADE, GIOI, GII, GTEL, GEP, GPER, GCA, GPRP |
| Inglés II | 11 | (2.º sem) GCAFD, GPSI, GIIAA, GADE, GIOI, GII, GTEL, GEP, GPER, GCA, GPRP |
| Inglés IV | 11 | (2.º sem) idem anteriores |
| Economía de la Empresa y Emprendedores | 10 | GCAFD, GPSI, GCTA, GADE, GIOI, GII, GPER, GCA, GPRP, ERASMUS |
| Inglés I | 8 | GCAFD, GPSI, GADE, GTEL, GEP, GPER, GCA, GPRP |
| Coaching | 7 | GCAFD, GPSI, GCTA, GIIAA, GADE, GIOI, GPRP |
| Dirección Estratégica y Competencias Directivas | 6 | GPSI, GCTA, GCG, GIIAA, GADE, GIOI |
| Organización de Empresas | 6 | GPSI, GADE, GIOI, GII, GPRP, GERA |
| Recursos Humanos | 6 | GPSI, GCG, GADE, GIOI, GII, GPRP |
| Contabilidad I | 5 | GCG, GADE, GIOI, GII, GPRP |
| Sociedad de la Información y el Conocimiento | 5 | GADE, GII, GPER, GCA, GPRP |

> Hay **decenas** de casos adicionales (Física → 4 grados; Matemáticas → 4; Análisis Sensorial de los Alimentos → 4; Fundamentos de las Relaciones Públicas → 5; etc.). La compartición **no es excepcional, es masiva**.

### 2.3 Semestres

- Las asignaturas se entregan **separadas por semestre** y la numeración lo refuerza:
  - *Inglés I / Inglés III* (1.º) vs *Inglés II / Inglés IV* (2.º).
  - *Estadística I* (1.º) vs *Estadística II* (2.º); *Contabilidad I* (1.º) vs *Contabilidad II* (2.º); *Matemáticas I* vs *Matemáticas II*.
- El programa de movilidad cambia de **nombre** según el semestre (**GERA** ↔ **ERASMUS**), evidencia directa de que el semestre es una dimensión real del dato.
- Caso límite detectado: *Programación I* aparece en GII tanto en el listado de 1.º como en el de 2.º semestre — probable artefacto/oferta en ambos periodos; refuerza que el **par (asignatura, semestre)** debe ser explícito.

### 2.4 Aulas (`Aulas.txt`)

- **Total: 32 aulas.**
- **Distribución de capacidades**:

| Capacidad | N.º de aulas | Aulas |
|---|---|---|
| 80 | 6 | 1.1, 1.2, 1.3, 1.4, -1.15, -2.15 |
| 56 | 7 | 1.5, 1.10, 0.2, 0.4, -2.2, -2.4, -2.6 |
| 48 | 2 | 0.6, 0.8 |
| 40 | 17 | 1.6–1.9, 0.10, 0.12, -1.1…-1.14 (varias) |

- **Capacidad máxima por aula: 80**; mínima: 40. Capacidad total instalada ≈ **1.640 plazas** repartidas en 32 espacios.
- Los códigos usan **plantas negativas** (`-1.x`, `-2.x` = sótanos) y notación `planta.numero`. Se almacenan como `codigo` (String) sin problema.

### 2.5 Calidad / normalización de datos

Inconsistencias que afectarán a la importación y al emparejamiento por texto:
- **Acentos/mayúsculas**: *"Microbiología y Parasitología"* vs *"Microbiología y parasitologia"* (GIIAA); *"Matemáticas II"* vs *"Matematicas II"* (GIOI); *"Higiene en la Industria Alimentaria"* vs *"…industria alimentaria"*; *"Organización de Empresas - inglés"* vs *"… - Inglés"*.
- **Variantes "(Inglés)"** tratadas como asignaturas distintas: *Nutrición y Deporte* vs *Nutrición y Deporte (Inglés)*; *Organización de Empresas* vs *Organización de Empresas - inglés*.
- **Denominaciones casi iguales**: *"Diseño e Innovación Alimentaria"* vs *"Diseño e Innovación en Alimentación"*.
- **Duplicado interno** señalado en el propio fichero: *Gastronomía Cántabra* aparece dos veces dentro de GCG.

---

## 3. Problemas detectados

### P1 — El modelo "1 asignatura → 1 grado" es incorrecto frente al dato real
`Asignatura.gradoId` es una FK **obligatoria y única** (`onDelete: Cascade`, `@@index([gradoId])`). Implica que cada asignatura pertenece a **exactamente un** grado. Los datos demuestran lo contrario de forma masiva (sección 2.2).

**Por qué el modelo actual sería incorrecto**:
- Para representar *Inglés III* (11 grados) habría que **duplicar** la asignatura 11 veces (11 filas con `codigo` distinto), rompiendo la identidad de "la misma asignatura".
- La duplicación **fragmenta**: matrículas, exámenes y la relación `ProfesorAsignatura` quedarían divididos por copia, impidiendo ver "todos los matriculados en Inglés III" o "un único examen de Inglés III".
- `Asignatura.codigo` es **único**: no admite N copias con el mismo código real.

### P2 — No existe el concepto de semestre/periodo
No hay atributo de semestre en `Asignatura` ni en `Examen`, ni entidad de periodo (la tabla `CursoAcademico` solo tiene `nombre` + `activo`, sin semestre). No se puede filtrar el calendario por semestre ni distinguir la oferta de cada periodo.

### P3 — `Examen.asignatura` es texto libre (no FK)
- Frágil ante las inconsistencias de 2.5 (un examen *"Matematicas II"* no casaría con la asignatura *"Matemáticas II"*).
- El **calendario del alumno (Sesión 80)** filtra comparando `Examen.asignatura` (texto) contra el **nombre/código** de las asignaturas matriculadas. Con datos reales mal normalizados, ese emparejamiento **fallará silenciosamente** (exámenes que no aparecen, o que aparecen en quien no debe).

### P4 — Un examen referencia una sola aula, pero la demanda real excede una aula
`Examen.aulaId` es único. Una asignatura compartida por muchos grados (p. ej. *Inglés III*, 11 grados) tendrá **cientos de matriculados**, muy por encima de la mayor aula (**80**). Un examen real necesitaría **varias aulas simultáneas** (o varias sesiones), algo **irrepresentable** hoy.

### P5 — Niveles académicos heterogéneos no modelados
MASTERPSI (máster) y GERA/ERASMUS (movilidad con doble nombre) se tratarían como "grados" normales. No hay atributo de **nivel/tipo de titulación** ni mecanismo de **alias** para GERA≡ERASMUS.

### P6 — Importadores asumen el modelo antiguo
`importarAsignaturas` (y `crearAsignatura`) asignan la asignatura a **un** grado. Importar los ficheros reales con el importador actual **duplicaría** asignaturas y perdería la compartición (consecuencia directa de P1).

---

## 4. Riesgos

| ID | Riesgo | Impacto | Probabilidad |
|---|---|---|---|
| R1 | Importar con el modelo actual **duplica** asignaturas compartidas y corrompe la trazabilidad (matrículas/exámenes fragmentados). | Alto | Alta (si se importa sin cambios) |
| R2 | El **calendario del alumno** muestra exámenes incorrectos o ninguno por el emparejamiento por texto (P3). | Alto | Alta |
| R3 | **Conflictos de aula** mal calculados: la detección actual asume 1 examen = 1 aula; no contempla un examen multi‑aula ni el aforo agregado. | Medio‑Alto | Media |
| R4 | **Pérdida de datos** por `onDelete: Cascade` en `Asignatura.gradoId`: borrar un grado eliminaría asignaturas que en realidad comparten otros grados. | Alto | Media |
| R5 | Migración compleja del histórico ya cargado (exámenes con asignatura por texto, matrículas) al nuevo modelo. | Medio | Media |
| R6 | Esfuerzo de **normalización** (acentos/mayúsculas/duplicados) subestimado → dedup incorrecto en import. | Medio | Alta |

---

## 5. Cambios recomendados (para futuras sesiones — NO implementar ahora)

### C1 — Relación **N:M** entre Grado y Asignatura (núcleo del cambio)
Introducir una tabla de unión (p. ej. `PlanEstudios` o `GradoAsignatura`) que vincule `gradoId` ↔ `asignaturaId`, y **eliminar** la FK única `Asignatura.gradoId`. Así *Inglés III* es **una sola** asignatura ligada a 11 grados.
- La asignatura pasa a ser un **catálogo único** identificado por `codigo`/`nombre` normalizado.
- `ProfesorAsignatura` y `Matricula` (ya ligadas a `asignaturaId`) **siguen siendo válidas** sin duplicación.

**Alternativas evaluadas**:
- (a) **N:M con tabla de unión** — *recomendada*: representa fielmente la realidad, sin duplicar.
- (b) **Duplicar la asignatura por grado** — *rechazada*: rompe identidad, codigos únicos, exámenes y matrículas (P1).
- (c) **Array de gradoIds en Asignatura** — *rechazada*: no relacional, impide integridad referencial y atributos por vínculo (semestre, curso del plan).

### C2 — Incorporar **semestre/periodo**
- Añadir el semestre como atributo del **vínculo del plan** (`PlanEstudios.semestre`: 1 | 2), no de la asignatura en sí, porque el periodo se define dentro del plan de cada grado.
- Considerar reforzar `CursoAcademico` (año académico) y combinarlo con `semestre` para ubicar la oferta y los exámenes en el tiempo (`CursoAcademico` + `Semestre`).
- `Examen` debería referenciar el **periodo** (curso académico + semestre) para poder filtrar el calendario por semestre.

### C3 — Refactor de `Examen`
- Sustituir el `String` libre por **`asignaturaId` (FK a `Asignatura`)**, eliminando el emparejamiento frágil por texto y arreglando el filtro del calendario del alumno y del profesor de raíz.
- Añadir el **periodo** (curso académico + semestre) al examen.
- Para el aforo: modelar el examen con **varias aulas** — opción mínima: relación `Examen` 1:N `SesionExamen`/`ExamenAula` (cada sesión con su `aulaId`, fecha, hora); opción simple intermedia: tabla de unión `ExamenAula`.

### C4 — Modelar **nivel de titulación** y alias
- Añadir a `Grado` (o nueva entidad `Titulacion`) un campo **`tipo`/`nivel`** (`GRADO` | `MASTER` | `MOVILIDAD`).
- Resolver **GERA≡ERASMUS** con un único registro y, si hace falta, un alias por semestre.

### C5 — Saneamiento previo a la importación
- Definir **clave de identidad** de asignatura por `codigo` oficial (preferente) o por `nombre` **normalizado** (sin acentos, *trim*, *case-insensitive*).
- Tratar las variantes "(Inglés)" como **modalidad/idioma de impartición** (atributo), no como asignaturas distintas, si así se confirma con negocio.
- Eliminar duplicados internos (p. ej. *Gastronomía Cántabra* en GCG).

### C6 — Proteger integridad
- Revisar el `onDelete: Cascade` de la relación grado‑asignatura: con N:M, borrar un grado **no** debe borrar asignaturas compartidas (R4).

---

## 6. Cambios opcionales (mejoras, no bloqueantes)

- **Aulas**: añadir atributos `tipo` (teórica/laboratorio/informática), `edificio`/`planta` (derivable del código), y `equipamiento`. La **capacidad ya existe** y es suficiente para planificar por aforo; estos atributos solo afinan la asignación.
- **Asignatura**: `idioma`/`modalidad` (para las variantes "(Inglés)"), `nivelCurso` (1.º–4.º) si el dato llega.
- **Catálogo de asignaturas** con `codigo` oficial cuando esté disponible (hoy los ficheros solo traen nombres).
- **Auditoría de import**: informe de coincidencias/dedup para validar la normalización (C5).

---

## 7. Impacto sobre la arquitectura actual

> Mapeo de los cambios propuestos a los artefactos existentes. Sirve para dimensionar futuras sesiones. **No** se modifica nada en esta sesión.

| Área | Artefacto | Impacto |
|---|---|---|
| **Esquema** | `schema.prisma` | Nueva tabla `PlanEstudios`/`GradoAsignatura` (N:M + semestre); quitar `Asignatura.gradoId`; `Examen.asignaturaId` + periodo; `ExamenAula`/`SesionExamen`; `Grado.tipo`. Requiere **migración** Prisma. |
| **BD** | `database-setup.sql`, migraciones | Migración de datos del histórico (exámenes por texto → FK; reasignación de asignaturas a planes). |
| **Backend — Asignaturas** | `asignaturas.service` / `crearAsignatura` / `importarAsignaturas` | Reescribir alta/import para catálogo único + vínculos de plan (grado, semestre). |
| **Backend — Exámenes** | `examenes.service` (`generarCalendario`, `findConflictos`, `consultarCalendario`, `descargarCalendario`) | Usar `asignaturaId`; conflictos y aforo con **multi‑aula**; filtro por **semestre**. |
| **Backend — Calendario Profesor/Alumno** | `profesor/*`, `alumno/*` | El filtro del Alumno deja de depender de texto (usa `asignaturaId` vía `Matricula`); añadir filtro por semestre. |
| **Frontend** | Vistas de asignaturas, exámenes y calendarios | Selección de grado(s)+semestre; mostrar varias aulas por examen; filtros por semestre. |
| **Casos de uso afectados** | `crearAsignatura`, `editarAsignatura`, `importarAsignaturas`, `crearExamen`, `editarExamen`, `asignarProfesorAExamen`, `listarConflictosExamenes`, `generarCalendario`, `consultarCalendario`, `descargarCalendarioExamenes`, matrículas | Todos tocan asignatura/grado/examen/aforo. |

### 7.1 Impacto específico sobre Generación de Calendarios
- **generarCalendario**: hoy solo consolida lo introducido a mano. Con datos reales debe (a) filtrar por **semestre**, (b) tratar una asignatura compartida como **un examen** para todos sus grados, y (c) respetar **aforo**: si los matriculados superan 80, **repartir en varias aulas** (multi‑aula/sesiones). La detección de conflictos (`findConflictos`) debe entender el examen multi‑aula y el aforo agregado.
- **consultarCalendario / descargarCalendarioExamenes**: añadir dimensión **semestre**; al pasar `Examen` a `asignaturaId`, la jerarquía *Examen → Asignatura → (Grados)* se resuelve por relación, no por texto.

### 7.2 Impacto sobre Matrículas
- `Matricula(alumnoId, asignaturaId)` con `@@unique([alumnoId, asignaturaId])` **sigue siendo válida** y, de hecho, **encaja mejor** con el catálogo único de asignaturas (N:M): el alumno se matricula en la asignatura del catálogo, independientemente de cuántos grados la compartan.
- Recomendable enriquecer la matrícula con **curso académico + semestre** para acotar la oferta y los exámenes del periodo.
- No es necesario "compartir matrículas": la compartición vive en el **plan** (grado↔asignatura), no en la matrícula.

### 7.3 Impacto sobre Exámenes
- **¿Un examen sigue asociado a una sola asignatura?** **Sí**, y es lo correcto: un examen es de **una** asignatura. Lo que cambia es:
  - La asignatura debe ser **FK** (`asignaturaId`), no texto (P3/C3).
  - Un examen de una asignatura **compartida** es **único** (sirve a todos los grados que la comparten); no debe duplicarse por grado.
  - Un examen puede necesitar **varias aulas** por aforo (C3/P4).
  - El examen se ubica en un **semestre/periodo**.

---

## 8. Propuesta de evolución futura (hoja de ruta sugerida)

> Orden propuesto para abordar en próximas sesiones, de menor a mayor acoplamiento. Cada paso es una sesión independiente con su diseño y verificación.

1. **Sesión de diseño del modelo evolucionado**: especificar `PlanEstudios` (N:M grado‑asignatura + semestre), catálogo único de `Asignatura`, `Grado.tipo`, `Examen.asignaturaId` + periodo y `ExamenAula`/`SesionExamen`. Diagramas de clases/ER. Sin código.
2. **Saneamiento y normalización** de los ficheros reales (dedup por nombre normalizado, resolución de variantes "(Inglés)", GERA≡ERASMUS, duplicado de GCG). Producir datasets limpios listos para importar.
3. **Migración de esquema (Prisma)**: tabla de unión, semestre, FK de examen, multi‑aula, `tipo` de titulación; con migración de datos del histórico ya cargado.
4. **Adaptación de importadores**: `importarAsignaturas`/`crearAsignatura` al catálogo + planes; importadores de grados (con tipo) y de aulas con la nueva relación.
5. **Adaptación del motor de calendario**: filtro por semestre, examen por `asignaturaId`, aforo multi‑aula y conflictos coherentes.
6. **Adaptación de vistas** (Admin/Profesor/Alumno) a semestre y multi‑aula; sustituir el filtro por texto del Alumno por `asignaturaId`.

---

## 9. Conclusión

Los datos reales son **fundamentalmente más ricos** que el modelo actual en tres ejes: **compartición de asignaturas entre grados**, **semestres** y **aforo/multi‑aula en exámenes**, además de **niveles académicos** heterogéneos. El modelo vigente sirvió para validar el flujo end‑to‑end con datos de *seed*, pero **debe evolucionar** antes de importar la información real para evitar duplicación, pérdida de integridad y fallos en el calendario.

Este informe deja la base para decidir, en sesiones posteriores, **cómo importar los datos reales, cómo incorporar semestres, cómo gestionar asignaturas compartidas, cómo adaptar el generador de calendarios y qué migraciones realizar** — sin haber introducido todavía ningún cambio técnico.

## referencias

- Datos reales: `Aulas.txt`, `Grados.txt`, `AsignaturasPrimerSemestre.txt`, `AsignaturaSegundoSemestre.txt`
- Modelo actual: [`schema.prisma`](/src/backend/prisma/schema.prisma)
- [Diseño: generarCalendario (Administrador)](/RUP/02-diseño/casos-uso/0-Administrador/generarCalendario/README.md)
- [Modelo del Dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología RUP
