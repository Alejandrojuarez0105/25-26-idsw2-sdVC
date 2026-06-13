# Davidario > editarGrado > Desarrollo

> |[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/editarGrado/editarGrado.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/editarGrado/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/editarGrado/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [grados.controller.ts](/src/backend/src/modules/grados/grados.controller.ts) · [grados.service.ts](/src/backend/src/modules/grados/grados.service.ts)
- **Frontend:** [EditarGradoView.tsx](/src/frontend/src/features/admin/grados/EditarGradoView.tsx) · [grados.service.ts](/src/frontend/src/services/grados.service.ts)

## Descripción
Implementación de la funcionalidad de edición y actualización de grados académicos existentes. El sistema permite al Administrador modificar el nombre y la descripción de un grado, asegurando que los cambios se validen y persistan correctamente en la base de datos PostgreSQL 16, manteniendo la integridad del código original del grado (inmutable durante la edición según prototipo).

## Estado
✅ **Completado** - Iteración 1

## Backend

### Endpoints

#### GET `/grados/:id`
Recupera los detalles completos de un grado por su identificador UUID para la precarga del formulario.

#### PUT `/grados/:id`
Actualiza los datos de un grado académico existente.

**Request:**
```json
{
  "nombre": "Ingeniería Informática Actualizado",
  "descripcion": "Nueva descripción detallada del grado"
}
```

**Response (200 OK):**
- Objeto del grado con los datos actualizados y `fechaActualizacion` refrescada.

### Implementación
- **NestJS**: Uso de los decoradores `@Get(':id')` y `@Put(':id')`.
- **Prisma**: Operaciones `findUnique` para precarga y `update` para persistencia.
- **Validación**: Comprobación de existencia del registro para lanzar `404 NotFound` si el ID no es válido.

---

## Frontend

### Implementación
- **React**: Creación de `EditarGradoView` con precarga de datos mediante `useEffect`.
- **Estado**: Gestión de cambios mediante comparativa entre `gradoOriginal` y `formData` para habilitar acciones.
- **Fidelidad Visual**: Réplica exacta del prototipo institucional (estilo Courier New, campos sombreados, botones estilizados).

#### EditarGradoView Component
- Precarga automática al montar el componente usando `params.id`.
- Validación de cambios antes de permitir el guardado.
- Diálogo de confirmación nativo que resume los cambios realizados.
- Botón **📌 Continuar editando** para validación parcial sin salida.

#### gradosService
- Método `findOne(id)`: Recupera el estado actual del servidor.
- Método `update(id, data)`: Envía la actualización mediante `PUT` a la API.

---

## Flujo de ejecución
1. El Administrador hace clic en **Editar** en una fila del listado de grados.
2. El sistema navega a `/admin/grados/editar/:id`.
3. El frontend recupera los datos actuales del backend.
4. El Administrador modifica el nombre o la descripción.
5. Al pulsar **💾 Guardar cambios**:
   - El sistema valida que existan cambios reales.
   - Solicita confirmación explícita.
   - Invoca al backend para persistir.
6. Tras el éxito, se redirige automáticamente al listado principal.

## Resultado obtenido
El Administrador puede actualizar la información de los grados de forma controlada. La implementación garantiza que no se pierdan datos accidentalmente (aviso de cambios sin guardar al cancelar) y mantiene la consistencia visual del sistema Davidario.

## Notas de implementación
- El campo **Código** se mantiene como de solo lectura durante la edición para preservar la trazabilidad de los registros.
- Se utiliza el trigger de base de datos para asegurar que la `fechaActualizacion` sea precisa.
