# Davidario > editarAsignatura > Desarrollo

> |[🏠️](/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/editarAsignatura/editarAsignatura.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/editarAsignatura/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/editarAsignatura/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [asignaturas.controller.ts](/src/backend/src/modules/asignaturas/asignaturas.controller.ts) · [asignaturas.service.ts](/src/backend/src/modules/asignaturas/asignaturas.service.ts)
- **Frontend:** [EditarAsignaturaView.tsx](/src/frontend/src/features/admin/asignaturas/EditarAsignaturaView.tsx) · [asignaturas.service.ts](/src/frontend/src/services/asignaturas.service.ts)

## Descripción
Implementación de la funcionalidad de edición y actualización de asignaturas académicas existentes. El sistema permite al Administrador modificar el nombre, créditos y grado asociado de una asignatura, asegurando que los cambios se validen y persistan correctamente en la base de datos PostgreSQL 16.

## Estado
✅ **Completado** - Iteración 1

## Backend

### Endpoints

#### GET `/asignaturas/:id`
Recupera los detalles completos de una asignatura por su identificador UUID para la precarga del formulario.

#### PUT `/asignaturas/:id`
Actualiza los datos de una asignatura existente.

**Request:**
```json
{
  "nombre": "Programación I (Actualizada)",
  "creditos": 6,
  "gradoId": "uuid-v4-grado"
}
```

**Response (200 OK):**
- Objeto de la asignatura con los datos actualizados.

### Implementación
- **NestJS**: Uso de los decoradores `@Get(':id')` y `@Put(':id')`.
- **Prisma**: Operaciones `findUnique` con `include` para precarga y `update` para persistencia.
- **Validación**: Comprobación de existencia del registro y del grado asociado.

---

## Frontend

### Implementación
- **React**: Creación de `EditarAsignaturaView` con precarga de datos mediante `useEffect`.
- **Estado**: Gestión de formulario y carga reactiva de la lista de grados para el selector.
- **Fidelidad Visual**: Réplica exacta del prototipo institucional (estilo Courier New, campos sombreados, botones estilizados).

#### EditarAsignaturaView Component
- Precarga automática de la asignatura y del catálogo de grados.
- Validación de cambios obligatorios.
- Diálogo de confirmación que resume los cambios realizados.
- Lógica de aviso ante cambios sin guardar al intentar salir.

#### asignaturasService
- Método `findOne(id)`: Recupera el estado actual de la materia.
- Método `update(id, data)`: Envía la actualización técnica a la API.

---

## Flujo de ejecución
1. El Administrador hace clic en **Editar** en una fila del listado de asignaturas.
2. El sistema navega a `/admin/asignaturas/editar/:id`.
3. El frontend recupera los datos actuales y el catálogo de grados.
4. El Administrador modifica los campos necesarios.
5. Al pulsar **💾 Guardar cambios**:
   - El sistema valida que existan cambios reales.
   - Solicita confirmación explícita mediante un resumen visual.
   - Invoca al backend para persistir los datos.
6. Tras el éxito, se redirige automáticamente al listado de asignaturas.

## Resultado obtenido
El Administrador puede actualizar la oferta académica de forma segura y relacionada. La implementación garantiza que los vínculos entre materias y titulaciones se mantengan íntegros en PostgreSQL.

## Notas de implementación
- El campo **Código** se mantiene como de solo lectura durante la edición para preservar la trazabilidad.
- La vista incluye un campo de **Descripción** visual para coherencia con el prototipo, aunque el esquema actual de base de datos prioriza los campos técnicos principales.
