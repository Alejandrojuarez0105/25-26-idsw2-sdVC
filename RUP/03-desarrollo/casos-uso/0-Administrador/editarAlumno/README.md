# Davidario > editarAlumno > Desarrollo

> |[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/editarAlumno/editarAlumno.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/editarAlumno/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/editarAlumno/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [alumnos.controller.ts](/src/backend/src/modules/alumnos/alumnos.controller.ts) · [alumnos.service.ts](/src/backend/src/modules/alumnos/alumnos.service.ts)
- **Frontend:** [EditarAlumnoView.tsx](/src/frontend/src/features/admin/alumnos/EditarAlumnoView.tsx) · [alumnos.service.ts](/src/frontend/src/services/alumnos.service.ts)

## Descripción
Implementación de la funcionalidad de modificación de expedientes de alumnos existentes y de su matrícula en asignaturas. El sistema permite al Administrador actualizar los datos del alumno (nombre, email y grado), y añadir o quitar de forma dinámica las asignaturas en las que se encuentra matriculado, guardando todos los cambios de forma segura mediante transacciones atómicas.

## Estado
✅ **Completado** - Iteración 1

## Backend

### Endpoints

#### GET `/alumnos/:id`
Recupera la ficha de un estudiante individual, incluyendo su relación con `Usuario`, `Grado` y su listado de `Matriculas` con el detalle de las asignaturas.

#### PUT `/alumnos/:id`
Actualiza el expediente del estudiante y su listado de asignaturas matriculadas.

**Request Body:**
```json
{
  "nombre": "Ana García López",
  "email": "ana.garcia@estudiante.es",
  "gradoId": "uuid-v4-grado",
  "asignaturas": [
    "uuid-v4-asig1",
    "uuid-v4-asig2"
  ]
}
```

**Response (200 OK):**
```json
{
  "id": "uuid-v4-alumno",
  "usuarioId": "uuid-v4-usuario",
  "matricula": "AL001234",
  "gradoId": "uuid-v4-grado"
}
```

### Implementación
- **NestJS**: Decoradores `@Get(':id')` y `@Put(':id')` en `AlumnosController`.
- **Transaccionalidad**: El método `update()` ejecuta una transacción Prisma para actualizar de forma coordinada el `Usuario` (dividiendo el nombre/apellido) y el `Alumno` (grado).
- **Sincronización de Asignaturas**: Compara el array de IDs del request con las matrículas actuales del alumno:
  - Elimina las matrículas de asignaturas removidas.
  - Inserta nuevas matrículas para asignaturas añadidas.

---

## Frontend

### Implementación
- **React**: Componente `EditarAlumnoView` que realiza precarga paralela de datos, control reactivo de asignaturas y validación de cambios.
- **Gestión de Matrículas en caliente**:
  - Renderizado de etiquetas de materias con botón "✖" para desmatricular localmente.
  - Dropdown interactivo cargando materias no matriculadas aún y botón "+ Agregar".

#### EditarAlumnoView Component
- Selector de Grado y Curso, con la Matrícula bloqueada/deshabilitada.
- Bloque dinámico informativo en la parte inferior resumiendo la situación actual del alumno.
- Botones de control "Guardar cambios" (validación de cambios y alerta), "Continuar editando" (feedback del estado del formulario) y "Cancelar".

#### alumnosService
- Método `findOne(id)`: Consulta `/alumnos/:id`.
- Método `update(id, data)`: Envía cambios vía `PUT /alumnos/:id`.

---

## Flujo de ejecución
1. El Administrador pulsa **Editar** en alguna fila de la tabla `AlumnosView`.
2. Se navega a la ruta `/admin/alumnos/editar/:id`.
3. El frontend descarga la ficha del alumno, los grados y las asignaturas.
4. El Administrador modifica los campos, añade/quita asignaturas y pulsa **Guardar cambios**.
5. Tras confirmación, el backend realiza la actualización atómica.
6. Se notifica del éxito de la operación y se redirige a la tabla principal.

## Notas de implementación
- La modificación de asignaturas se realiza de manera directa y segura sobre la tabla `Matricula` en PostgreSQL sin necesidad de alterar la lógica del alumno.
- El curso se calcula dinámicamente mediante la matrícula para asegurar consistencia visual con el prototipo.
