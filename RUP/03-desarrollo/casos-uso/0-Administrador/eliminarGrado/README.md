# Davidario > eliminarGrado > Desarrollo

> |[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/eliminarGrado/eliminarGrado.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/eliminarGrado/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/eliminarGrado/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [grados.controller.ts](/src/backend/src/modules/grados/grados.controller.ts) · [grados.service.ts](/src/backend/src/modules/grados/grados.service.ts)
- **Frontend:** [GradosView.tsx](/src/frontend/src/features/admin/grados/GradosView.tsx) · [EliminarGradoView.tsx](/src/frontend/src/features/admin/grados/EliminarGradoView.tsx) · [grados.service.ts](/src/frontend/src/services/grados.service.ts)

## Descripción
Implementación de la funcionalidad de borrado de grados académicos. El Administrador puede seleccionar uno o varios grados desde el listado y proceder a su eliminación permanente. Se implementa una vista de confirmación dedicada que replica fielmente el diseño institucional, incorporando múltiples niveles de validación de seguridad.

## Estado
✅ **Completado** - Iteración 2 (Ajuste visual según prototipo)

## Backend

### Endpoints

#### DELETE `/grados/:id`
Elimina un grado académico específico por su identificador UUID.

**Parameters:**
- `id`: UUID del grado a eliminar.

**Response (204 No Content):**
- Éxito en la eliminación.

### Implementación
- **NestJS**: Extensión del controlador existente con el método `remove`.
- **Prisma**: Uso de `this.prisma.grado.delete()` filtrando por ID.
- **Validación**: Verificación previa de existencia para lanzar excepciones `404 NotFound` controladas.

---

## Frontend

### Implementación
- **React**: Implementación de `EliminarGradoView` como página de confirmación técnica.
- **Navegación**: Uso de `state` en React Router para transferir los objetos seleccionados hacia la vista de eliminación.
- **Fidelidad Visual**: Réplica exacta del prototipo institucional (estilo Courier New, cajas de información sombreadas, advertencias resaltadas).

#### GradosView Component
- Permite la selección múltiple mediante checkboxes.
- Redirige a `/admin/grados/eliminar` inyectando los datos de los grados seleccionados.

#### EliminarGradoView Component
- Muestra el detalle de los grados a eliminar.
- Advierte sobre la eliminación irreversible de asignaturas asociadas.
- Mantiene el flujo de seguridad en cascada (Confirmación -> Advertencia Final -> Prompt de texto "ELIMINAR").

#### gradosService
- Método `remove(id)`: Encapsula la petición `DELETE` de Axios hacia la API.

---

## Flujo de ejecución
1. El Administrador selecciona uno o más grados en la tabla.
2. Hace clic en **🗑️ Eliminar seleccionado**.
3. El sistema navega a la vista **EliminarGradoView**.
4. El Administrador revisa la información de los grados y las advertencias.
5. Al pulsar **Confirmar eliminación**:
   - Diálogo 1: Confirmación técnica.
   - Diálogo 2: Última advertencia de irreversibilidad.
   - Diálogo 3: Validación del texto de seguridad "ELIMINAR".
6. Tras la validación, el frontend invoca al backend para cada registro.
7. El sistema redirige automáticamente al listado actualizado.

## Resultado obtenido
El Administrador puede eliminar grados de forma segura y controlada. La implementación garantiza que la acción sea consciente y irreversible, manteniendo la integridad de los datos en PostgreSQL y la fidelidad visual institucional.

## Notas de implementación
- El borrado en cascada (Cascade Delete) está configurado en el esquema Prisma para manejar automáticamente las dependencias si las hubiera.
- Se mantiene el estilo visual "Courier New" coherente con el resto del módulo administrativo.
