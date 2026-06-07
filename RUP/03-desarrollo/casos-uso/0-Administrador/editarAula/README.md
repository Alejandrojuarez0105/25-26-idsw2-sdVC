# Davidario > editarAula > Desarrollo

> |[🏠️](/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/crearAula/crearAula.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/editarAula/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/editarAula/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [aulas.controller.ts](/src/backend/src/modules/aulas/aulas.controller.ts) · [aulas.service.ts](/src/backend/src/modules/aulas/aulas.service.ts)
- **Frontend:** [EditarAulaView.tsx](/src/frontend/src/features/admin/aulas/EditarAulaView.tsx) · [aulas.service.ts](/src/frontend/src/services/aulas.service.ts)

## Descripción
Implementación de la funcionalidad de edición y actualización de aulas existentes. El sistema permite al Administrador modificar el nombre, la capacidad y la ubicación de un aula, asegurando que los cambios se validen (capacidad mínima de 1) y persistan correctamente en PostgreSQL 16, manteniendo la integridad y la inmutabilidad del código original de identificación del aula (según prototipo).

## Estado
✅ **Completado** - Iteración 1

## Backend

### Endpoints

#### GET `/aulas/:id`
Recupera los detalles completos de una determinada aula por su identificador UUID para la precarga del formulario.

#### PUT `/aulas/:id`
Actualiza los datos de un aula existente.

**Request:**
```json
{
  "nombre": "Aula Magna Modificada",
  "capacidad": 160,
  "ubicacion": "Planta Baja - Ala Este"
}
```

**Response (200 OK):**
- Objeto del aula con los datos actualizados.

### Implementación
- **NestJS**: Incorporación de los endpoints `@Get(':id')` y `@Put(':id')` en `AulasController`.
- **Prisma**: Operación `this.prisma.aula.findUnique()` para la obtención de datos y `this.prisma.aula.update()` para la actualización.
- **Validación**: Control de existencia previa del aula y lanzamiento automático de `NotFoundException` (HTTP 404) si el ID no es válido.

---

## Frontend

### Implementación
- **React**: Componente `EditarAulaView` como vista de formulario dedicada a la edición de aulas.
- **Fidelidad Visual**: Réplica exacta del prototipo institucional (estilo Courier New, anchos de campo, y botones con colores y distribución de estilo retro).

#### EditarAulaView Component
- Precarga automática de datos mediante `useEffect` al montar el componente a partir de `params.id`.
- Centraliza la gestión del estado del formulario y las validaciones de negocio en el propio componente, manteniendo el patrón de diseño de tener un único hook (`useAulas.ts`) para la lógica de listado general.
- Deshabilita y estiliza como solo lectura (`codigo-disabled`) el campo Código de identificación para evitar modificaciones.
- Valida campos obligatorios: Nombre, Ubicación.
- Valida Capacidad: debe ser mayor o igual a 1.
- Detecta cambios reales mediante la función local `hayCambios()` comparando el estado actual con el original recuperado del backend.
- Presenta confirmación nativa de JavaScript con el resumen de cambios realizados antes de enviar los datos al servidor.
- Botón **📌 Continuar editando** para validación y feedback visual sin salir del formulario.
- Redirige al listado principal en `/admin/aulas` tras guardar con éxito o al cancelar (previa confirmación de pérdida de cambios si el formulario tiene cambios sin guardar).

#### aulasService
- Método `findOne(id)`: Recupera los datos de un aula por su identificador.
- Método `update(id, data)`: Envía la actualización mediante `PUT` a la API.

---

## Flujo de ejecución
1. El Administrador hace clic en **Editar** en una fila del listado de aulas.
2. El sistema redirige a la ruta `/admin/aulas/editar/:id` cargando el componente **EditarAulaView**.
3. El frontend recupera los datos actuales del servidor y los precarga en el formulario.
4. El Administrador modifica el nombre, capacidad o ubicación de la aula.
5. Al pulsar **💾 Guardar cambios**:
   - El sistema valida que se hayan modificado datos y que cumplan con los formatos.
   - Solicita confirmación explícita mediante un resumen de cambios.
   - Invoca al backend mediante la llamada `PUT`.
6. El backend persiste la entidad en PostgreSQL.
7. Tras el éxito, se muestra un mensaje de confirmación y redirige automáticamente al listado principal.

## Resultado obtenido
El Administrador puede actualizar la información de las aulas de forma controlada y ágil. La implementación previene la pérdida de cambios accidentales, valida los datos de capacidad y respeta la inmutabilidad de los códigos identificadores de espacios físicos.

## Notas de implementación
- El campo **Código** se mantiene de solo lectura y deshabilitado durante la edición para asegurar la trazabilidad de los exámenes ya programados en dicha aula.
- Se reutiliza la instancia de conexión Axios interceptada para garantizar el envío del token de autorización.
