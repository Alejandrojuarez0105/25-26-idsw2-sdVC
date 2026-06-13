# Davidario > eliminarProfesor > Desarrollo

> |[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/eliminarProfesor/eliminarProfesor.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/eliminarProfesor/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/eliminarProfesor/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [profesores.controller.ts](/src/backend/src/modules/profesores/profesores.controller.ts) · [profesores.service.ts](/src/backend/src/modules/profesores/profesores.service.ts)
- **Frontend:** [EliminarProfesorView.tsx](/src/frontend/src/features/admin/profesores/EliminarProfesorView.tsx) · [profesores.service.ts](/src/frontend/src/services/profesores.service.ts)

## Descripción
Implementación de la funcionalidad de eliminación controlada de registros de profesores en el sistema. El sistema permite al Administrador seleccionar uno o múltiples profesores desde la vista principal de administración, inspeccionar las repercusiones académicas, y confirmar de forma explícita e irreversible la eliminación total del perfil docente y de las credenciales de acceso.

## Estado
✅ **Completado** - Iteración 1

## Backend

### Endpoints

#### DELETE `/profesores/:id`
Elimina de forma permanente un profesor por su ID único.

**Response (204 No Content):**
Sin cuerpo de respuesta.

### Implementación
- **NestJS**: Decorador `@Delete(':id')` en `ProfesoresController` con código de respuesta HTTP `204`.
- **Prisma**: Búsqueda del registro por ID (`NotFoundException` 404 si no existe) y eliminación directa de la entidad `Usuario` asociada al profesor.
- **Borrado en Cascada**: Dado que el modelo `Profesor` tiene definida una relación de clave externa a la tabla `Usuario` con comportamiento `onDelete: Cascade`, la supresión del registro `Usuario` desencadena de forma inmediata y automática la supresión correspondiente en `Profesor`. A su vez, la tabla relacional `ProfesorAsignatura` también declara `onDelete: Cascade` sobre `Profesor`, por lo que las vinculaciones con asignaturas se eliminan en una única operación atómica gestionada por PostgreSQL.

---

## Frontend

### Implementación
- **React**: Creación de la vista `EliminarProfesorView` para presentar un desglose detallado de los docentes seleccionados para borrado y advertir sobre los efectos.
- **Validación Triple**: Lógica estricta de seguridad secuencial en cliente para evitar pérdidas accidentales de información:
  1. Confirmación de lista mediante `window.confirm`.
  2. Advertencia final mediante `window.confirm`.
  3. Confirmación textual requiriendo escribir el literal `"ELIMINAR"`.

#### EliminarProfesorView Component
- Ficha de detalles del profesor (código, nombre, email, departamento).
- Panel amarillo advirtiendo que las asignaciones de asignaturas y exámenes vinculados serán eliminadas en cascada del sistema.
- Panel rojo destacando la irreversibilidad de la acción.
- Procesamiento en bucle asíncrono para reportar de forma agregada las operaciones fallidas e individuales.

#### profesoresService
- Método `remove(id)`: Invoca a `DELETE /profesores/:id` vía Axios.

---

## Flujo de ejecución
1. El Administrador marca uno o más checkboxes en `ProfesoresListView` y pulsa **🗑️ Eliminar seleccionado**.
2. Se navega a la ruta `/admin/profesores/eliminar`, inyectando la colección de objetos a eliminar en el estado de navegación (incluyendo el código `PRO###` calculado por la vista de listado).
3. El Administrador inspecciona la ficha de profesores y pulsa **Confirmar eliminación**.
4. El sistema despliega las alertas y solicita escribir `"ELIMINAR"`.
5. Se ejecuta la petición DELETE al backend por cada registro confirmado.
6. El backend suprime las entidades en base de datos en cascada (`Usuario` → `Profesor` → `ProfesorAsignatura`).
7. Se notifica del éxito de la operación y se regresa a la lista general actualizada.

## Notas de implementación
- La baja del profesor conlleva la remoción completa de sus privilegios de inicio de sesión (`Usuario`), lo que optimiza la limpieza y almacenamiento general del sistema académico.
- La ruta `/admin/profesores/eliminar` está registrada en `App.tsx` y vinculada desde `ProfesoresListView.tsx` a través del botón **🗑️ Eliminar seleccionado**, replicando el patrón aplicado en `eliminarAlumno` y `eliminarAula`.
- No se modificó la estructura de la base de datos ni el archivo `database-setup.sql`; la implementación se apoya íntegramente en las relaciones en cascada ya definidas en el esquema Prisma.
