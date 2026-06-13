# Davidario > eliminarExamen > Desarrollo

> |[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/eliminarExamen/eliminarExamen.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/eliminarExamen/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/eliminarExamen/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [examenes.controller.ts](/src/backend/src/modules/examenes/examenes.controller.ts) · [examenes.service.ts](/src/backend/src/modules/examenes/examenes.service.ts)
- **Frontend:** [EliminarExamenView.tsx](/src/frontend/src/features/admin/examenes/EliminarExamenView.tsx) · [ExamenesView.tsx](/src/frontend/src/features/admin/examenes/ExamenesView.tsx) · [examenes.service.ts](/src/frontend/src/services/examenes.service.ts)

## Descripción
Implementación de la funcionalidad de borrado de exámenes programados. El sistema permite al administrador seleccionar uno o varios exámenes de la lista y proceder a su eliminación definitiva tras un proceso de validación y triple confirmación, asegurando la integridad del calendario académico.

## Estado
✅ **Completado** - Iteración 1 (Borrado seguro y controlado)

## Backend

### Endpoints

#### DELETE `/examenes/:id`
Elimina un registro de examen de la base de datos PostgreSQL.

**Response (204 No Content):**
*Éxito en la eliminación.*

### Implementación
- **NestJS**: Extensión del `ExamenesController` con el endpoint `DELETE`.
- **Prisma**: Uso del método `delete` filtrando por el ID proporcionado.
- **Validación**: Comprobación previa de existencia para evitar errores de referencia.

---

## Frontend

### Implementación
- **React**: Creación del componente `EliminarExamenView` que gestiona el flujo de confirmación.
- **Hooks**: Uso de `useLocation` para recibir los exámenes seleccionados y `useNavigate` para el retorno al listado.

#### EliminarExamenView Component
- Muestra los detalles de los exámenes a eliminar (Código, Asignatura, Fecha/Hora, Aula).
- Aplica una lógica de confirmación en tres pasos:
  1. Diálogo de confirmación con detalles del impacto.
  2. Advertencia final de irreversibilidad.
  3. Prompt de seguridad requiriendo escribir "ELIMINAR".

#### Integración en ExamenesView
- Habilitación de la lógica de selección múltiple.
- Vinculación del botón "🗑️ Eliminar seleccionado" para redirigir a la vista de confirmación.

---

## Flujo de ejecución
1. El Administrador marca los exámenes deseados en `ExamenesView`.
2. Al pulsar **Eliminar seleccionado**, el sistema navega a la vista de confirmación.
3. El Administrador revisa los datos y completa el protocolo de seguridad ("ELIMINAR").
4. El frontend invoca al backend de forma asíncrona mediante `Promise.all`.
5. El sistema confirma el éxito y retorna automáticamente al listado actualizado.

## Resultado obtenido
Se ha consolidado una gestión destructiva segura para el módulo de exámenes, manteniendo la coherencia operativa con los ramilletes de grados y asignaturas previamente implementados.

## Notas de implementación
- No se han detectado dependencias que bloqueen el borrado (como actas ya cerradas), por lo que la eliminación es directa sobre la tabla `Examen`.
