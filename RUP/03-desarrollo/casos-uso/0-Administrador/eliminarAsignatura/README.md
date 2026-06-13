# Davidario > eliminarAsignatura > Desarrollo

> |[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/eliminarAsignatura/eliminarAsignatura.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/eliminarAsignatura/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/eliminarAsignatura/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [asignaturas.controller.ts](/src/backend/src/modules/asignaturas/asignaturas.controller.ts) · [asignaturas.service.ts](/src/backend/src/modules/asignaturas/asignaturas.service.ts)
- **Frontend:** [AsignaturasView.tsx](/src/frontend/src/features/admin/asignaturas/AsignaturasView.tsx) · [EliminarAsignaturaView.tsx](/src/frontend/src/features/admin/asignaturas/EliminarAsignaturaView.tsx) · [asignaturas.service.ts](/src/frontend/src/services/asignaturas.service.ts)

## Descripción
Implementación de la funcionalidad de borrado de asignaturas académicas. El Administrador puede seleccionar una o varias materias desde el listado y proceder a su eliminación permanente tras superar un flujo de confirmación visual institucional. El proceso asegura la limpieza de dependencias directas en la base de datos PostgreSQL 16.

## Estado
✅ **Completado** - Iteración 1

## Backend

### Endpoints

#### DELETE `/asignaturas/:id`
Elimina una asignatura específica por su identificador UUID.

**Parameters:**
- `id`: UUID de la asignatura a eliminar.

**Response (204 No Content):**
- Éxito en la eliminación.

### Implementación
- **NestJS**: Implementación del método `remove` en el controlador y servicio de asignaturas.
- **Prisma**: Uso de `this.prisma.asignatura.delete()` filtrando por ID.
- **Validación**: Verificación previa de existencia para retorno de error `404 NotFound` si corresponde.

---

## Frontend

### Implementación
- **React**: Creación de `EliminarAsignaturaView` como página de confirmación técnica.
- **Navegación**: Uso de `state` en React Router para transferir los objetos seleccionados hacia la vista de eliminación.
- **Fidelidad Visual**: Réplica exacta del prototipo institucional (estilo Courier New, cajas de información, advertencias resaltadas).

#### AsignaturasView Component
- Permite la selección múltiple mediante checkboxes.
- Redirige a `/admin/asignaturas/eliminar` inyectando los datos de las materias seleccionadas.

#### EliminarAsignaturaView Component
- Muestra el detalle técnico de las asignaturas a eliminar (Código, Nombre, Créditos, Grado).
- Advierte sobre la eliminación irreversible de exámenes asociados.
- Implementa el flujo de seguridad en cascada (Confirmación -> Advertencia Final -> Prompt de texto "ELIMINAR").

#### asignaturasService
- Método `remove(id)`: Encapsula la petición `DELETE` de Axios hacia la API.

---

## Flujo de ejecución
1. El Administrador selecciona una o más asignaturas en la tabla.
2. Hace clic en **🗑️ Eliminar seleccionada**.
3. El sistema navega a la vista **EliminarAsignaturaView**.
4. El Administrador revisa la información y las advertencias.
5. Al pulsar **Confirmar eliminación**:
   - Diálogo 1: Confirmación técnica.
   - Diálogo 2: Última advertencia de irreversibilidad.
   - Diálogo 3: Validación del texto de seguridad "ELIMINAR".
6. Tras la validación, el frontend invoca al backend para cada registro.
7. El sistema redirige automáticamente al listado actualizado.

## Resultado obtenido
El Administrador puede eliminar asignaturas de forma segura y controlada. La implementación garantiza que la acción sea plenamente consciente, manteniendo la integridad referencial en PostgreSQL y la coherencia visual UE.

## Notas de implementación
- La base de datos está configurada con `ON DELETE CASCADE` para las relaciones dependientes en el esquema Prisma.
- Se mantiene el estilo visual "Courier New" coherente con el módulo administrativo de grados.
