# Davidario > eliminarAlumno > Desarrollo

> |[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/eliminarAlumno/eliminarAlumno.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/eliminarAlumno/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/eliminarAlumno/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [alumnos.controller.ts](/src/backend/src/modules/alumnos/alumnos.controller.ts) · [alumnos.service.ts](/src/backend/src/modules/alumnos/alumnos.service.ts)
- **Frontend:** [EliminarAlumnoView.tsx](/src/frontend/src/features/admin/alumnos/EliminarAlumnoView.tsx) · [alumnos.service.ts](/src/frontend/src/services/alumnos.service.ts)

## Descripción
Implementación de la funcionalidad de eliminación controlada de registros de alumnos en el sistema. El sistema permite al Administrador seleccionar uno o múltiples alumnos desde la vista principal de administración, inspeccionar las repercusiones académicas, y confirmar de forma explícita e irreversible la eliminación total del perfil y credenciales de acceso de los alumnos.

## Estado
✅ **Completado** - Iteración 1

## Backend

### Endpoints

#### DELETE `/alumnos/:id`
Elimina de forma permanente un alumno por su ID único.

**Response (204 No Content):**
Sin cuerpo de respuesta.

### Implementación
- **NestJS**: Decorador `@Delete(':id')` en `AlumnosController` con código de respuesta HTTP `204`.
- **Prisma**: Búsqueda del registro por ID y eliminación directa de la entidad `Usuario` asociada al alumno.
- **Borrado en Cascades**: Dado que el modelo `Alumno` tiene definida una relación de clave externa a la tabla `Usuario` con comportamiento `onDelete: Cascade`, la supresión del registro `Usuario` desencadena de forma inmediata y automática la supresión correspondiente en `Alumno` en PostgreSQL.

---

## Frontend

### Implementación
- **React**: Creación de la vista `EliminarAlumnoView` para presentar un desglose detallado de los estudiantes seleccionados para borrado y advertir sobre los efectos.
- **Validación Triple**: Lógica estricta de seguridad secuencial en cliente para evitar pérdidas accidentales de información:
  1. Confirmación de lista mediante `window.confirm`.
  2. Advertencia final mediante `window.confirm`.
  3. Confirmación textual requiriendo escribir el literal `"ELIMINAR"`.

#### EliminarAlumnoView Component
- Ficha de detalles del alumno (matrícula, nombre, email, grado).
- Panel de advertencia rojo destacando la irreversibilidad de la acción.
- Panel amarillo advirtiendo que las matrículas y notas registradas del alumno serán eliminadas en cascada del sistema.
- Procesamiento en bucle asíncrono para reportar de forma agregada las operaciones fallidas e individuales.

#### alumnosService
- Método `remove(id)`: Invoca a `DELETE /alumnos/:id` vía Axios.

---

## Flujo de ejecución
1. El Administrador marca uno o más checkboxes en `AlumnosView` y pulsa **🗑️ Eliminar seleccionado**.
2. Se navega a la ruta `/admin/alumnos/eliminar`, inyectando la colección de objetos a eliminar en el estado de navegación.
3. El Administrador inspecciona la ficha de estudiantes y pulsa **Confirmar eliminación**.
4. El sistema despliega las alertas y solicita escribir `"ELIMINAR"`.
5. Se ejecuta la petición DELETE al backend por cada registro confirmado.
6. El backend suprime las entidades en base de datos.
7. Se notifica del éxito de la operación y se regresa a la lista general actualizada.

## Notas de implementación
- La baja del alumno conlleva la remoción completa de sus privilegios de inicio de sesión (`Usuario`), lo que optimiza la limpieza y almacenamiento general del sistema académico.
