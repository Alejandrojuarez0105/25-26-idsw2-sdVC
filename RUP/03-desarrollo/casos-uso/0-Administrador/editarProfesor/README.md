# Davidario > editarProfesor > Desarrollo

> |[🏠️](/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/editarProfesor/editarProfesor.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/editarProfesor/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/editarProfesor/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [profesores.controller.ts](/src/backend/src/modules/profesores/profesores.controller.ts) · [profesores.service.ts](/src/backend/src/modules/profesores/profesores.service.ts)
- **Frontend:** [EditarProfesorView.tsx](/src/frontend/src/features/admin/profesores/EditarProfesorView.tsx) · [profesores.service.ts](/src/frontend/src/services/profesores.service.ts)

## Descripción
Implementación de la funcionalidad de modificación de la ficha de profesores existentes y de su asignación a asignaturas. El sistema permite al Administrador actualizar los datos del docente (nombre, email y departamento), añadir o quitar de forma dinámica las asignaturas que imparte, y guardar todos los cambios de forma segura en PostgreSQL mediante transacciones atómicas, manteniendo el código `PRO###` como identificador inmutable.

## Estado
✅ **Completado** - Iteración 1

## Backend

### Endpoints

#### GET `/profesores/:id`
Recupera la ficha de un profesor individual incluyendo su relación con `Usuario` y el listado de `ProfesorAsignatura` con el detalle de las asignaturas asignadas.

#### PUT `/profesores/:id`
Actualiza la ficha del profesor y la lista de asignaturas vinculadas.

**Request Body:**
```json
{
  "nombre": "Manuel Masías",
  "email": "manuel.masias@uneatlantico.es",
  "departamento": "Informática",
  "asignaturas": [
    "uuid-v4-asig1",
    "uuid-v4-asig2"
  ]
}
```

**Response (200 OK):**
```json
{
  "id": "uuid-v4-profesor",
  "usuarioId": "uuid-v4-usuario",
  "codigo": "PROF001",
  "departamento": "Informática"
}
```

### Implementación
- **NestJS**: Decoradores `@Get(':id')` y `@Put(':id')` en `ProfesoresController`. Los errores se traducen a `NotFoundException` (404) o `ConflictException` (409) según corresponda.
- **Transaccionalidad**: El método `update()` ejecuta una transacción Prisma (`$transaction`) que actualiza de forma coordinada el `Usuario` (dividiendo el nombre completo en `nombre` y `apellido`) y el `Profesor` (`departamento`).
- **Inmutabilidad del Código**: El campo `codigo` no se permite modificar desde la edición; queda fijado al valor con el que fue creado o autogenerado en alta/importación.
- **Sincronización de Asignaturas**: Compara el array de IDs del request con las asignaciones actuales en `ProfesorAsignatura`:
  - Elimina las asignaciones removidas usando la clave compuesta `profesorId_asignaturaId`.
  - Inserta nuevas asignaciones para las añadidas.
- **Validación de Email**: Comprueba la unicidad del nuevo correo si difiere del original, evitando colisiones con otros usuarios.

---

## Frontend

### Implementación
- **React**: Componente `EditarProfesorView` que realiza precarga paralela (`Promise.all`) de la ficha del profesor y del catálogo completo de asignaturas, control reactivo de asignaciones y validación de cambios antes de persistir.
- **Gestión de Asignaturas en caliente**:
  - Renderizado de etiquetas de materias asignadas con botón "✖" para desasignar localmente.
  - Dropdown interactivo cargando las asignaturas aún no asignadas y botón "+ Agregar".

#### EditarProfesorView Component
- Campo `Código` bloqueado/deshabilitado (`codigo-disabled`).
- Campos editables: `Nombre` (texto libre), `Email` (con regex de validación), `Departamento` (selector predefinido coherente con el prototipo).
- Bloque dinámico informativo en la parte inferior resumiendo el departamento y el número de asignaturas asignadas.
- Botones de control "Guardar cambios" (validación de cambios + confirmación nativa), "Continuar editando" (feedback del estado del formulario) y "Cancelar" (con aviso de pérdida de datos si hay cambios).

#### profesoresService
- Método `findOne(id)`: Consulta `GET /profesores/:id`.
- Método `update(id, data)`: Envía cambios vía `PUT /profesores/:id`.

---

## Flujo de ejecución
1. El Administrador pulsa **Editar** en alguna fila de la tabla `ProfesoresListView`.
2. Se navega a la ruta `/admin/profesores/editar/:id`.
3. El frontend descarga en paralelo la ficha del profesor y el catálogo de asignaturas.
4. El Administrador modifica los campos editables, añade/quita asignaturas y pulsa **Guardar cambios**.
5. Tras la confirmación nativa, el backend realiza la actualización atómica de `Usuario`, `Profesor` y `ProfesorAsignatura`.
6. Se notifica del éxito de la operación y se redirige a la lista principal de profesores.

## Notas de implementación
- La modificación de asignaciones se realiza de manera directa y segura sobre la tabla `ProfesorAsignatura` en PostgreSQL sin necesidad de alterar la lógica del profesor, aprovechando la clave compuesta `(profesorId, asignaturaId)` definida en `schema.prisma`.
- La ruta `/admin/profesores/editar/:id` está registrada en `App.tsx` y vinculada desde el botón **Editar** de cada fila en `ProfesoresListView.tsx`, replicando el patrón aplicado en `editarAlumno`.
- No se modificó la estructura de la base de datos ni el archivo `database-setup.sql`; la implementación se apoya íntegramente en los modelos `Profesor`, `Usuario` y `ProfesorAsignatura` ya existentes.
