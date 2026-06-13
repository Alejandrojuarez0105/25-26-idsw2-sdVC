# Davidario > eliminarAula > Desarrollo

> |[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/eliminarAula/eliminarAula.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/eliminarAula/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/eliminarAula/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [aulas.controller.ts](/src/backend/src/modules/aulas/aulas.controller.ts) · [aulas.service.ts](/src/backend/src/modules/aulas/aulas.service.ts)
- **Frontend:** [EliminarAulaView.tsx](/src/frontend/src/features/admin/aulas/EliminarAulaView.tsx) · [AulasView.tsx](/src/frontend/src/features/admin/aulas/AulasView.tsx) · [aulas.service.ts](/src/frontend/src/services/aulas.service.ts)

## Descripción
Implementación de la funcionalidad de borrado seguro de aulas. El Administrador puede seleccionar una o varias aulas desde el listado y proceder a su eliminación permanente. Se implementa una vista de confirmación dedicada que replica fielmente el prototipo institucional (`eliminarAula.html`), incorporando múltiples niveles de validación de seguridad y advertencias sobre la reasignación de exámenes afectados.

## Estado
✅ **Completado** - Iteración 1

## Backend

### Endpoints

#### DELETE `/aulas/:id`
Elimina un aula específica por su identificador UUID.

**Parámetros:**
- `id`: UUID del aula a eliminar.

**Response (204 No Content):**
- Éxito en la eliminación.

**Response (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "Aula con ID <id> no encontrada."
}
```

### Implementación
- **NestJS**: Extensión del controlador `AulasController` existente con el decorador `@Delete(':id')` y código de respuesta `204 NO_CONTENT`.
- **Prisma**: Uso de `prisma.aula.findUnique()` para verificar la existencia del registro antes del borrado y `prisma.aula.delete()` para la eliminación física.
- **Validación**: Lanzamiento de `NotFoundException` si el aula no existe, garantizando errores controlados y mensajes descriptivos al cliente.
- **Nota arquitectónica**: El modelo `Examen` referencia el aula como campo `String` libre (no FK), por lo que no existe integridad referencial a nivel de base de datos. El aviso de reasignación de exámenes se gestiona como información al usuario en el frontend.

---

## Frontend

### Implementación
- **React**: Creación de `EliminarAulaView` como vista de confirmación dedicada, replicando el patrón estético y funcional de `EliminarGradoView` y `EliminarAsignaturaView`.
- **Navegación**: Uso de `state` en React Router para transferir los objetos `Aula[]` seleccionados desde `AulasView` hacia la vista de eliminación, sin parámetros en la URL.
- **Fidelidad Visual**: Réplica exacta del prototipo institucional (Courier New, paneles sombreados `#f5f5f5`, advertencia amarilla `#fff3cd`, advertencia roja `#f8d7da`).

#### AulasView Component (modificado)
- El handler `handleEliminar` valida que haya al menos un aula seleccionada, recoge los objetos completos filtrados por ID y navega a `/admin/aulas/eliminar` con el estado `{ aulas: aulasSeleccionadas }`.
- El botón **🗑️ Eliminar seleccionado** queda vinculado a `handleEliminar` (anteriormente era un placeholder).

#### EliminarAulaView Component (nuevo)
- Muestra el detalle de cada aula seleccionada (Código, Nombre, Capacidad, Ubicación).
- Panel informativo amarillo sobre la necesidad de reasignar exámenes programados.
- Panel de advertencia rojo de irreversibilidad.
- Flujo de triple confirmación: `confirm()` → `confirm()` → `prompt("ELIMINAR")`.
- Procesamiento individual de cada aula en bucle, con reporte de éxitos y fallos.

#### aulasService (ampliado)
- Método `remove(id)`: Encapsula la petición `DELETE /aulas/:id` mediante Axios.

---

## Flujo de ejecución
1. El Administrador selecciona una o varias aulas mediante los checkboxes de `AulasView`.
2. Hace clic en **🗑️ Eliminar seleccionado**.
3. Si no hay selección, se muestra alerta y se cancela la navegación.
4. El sistema navega a `EliminarAulaView` en `/admin/aulas/eliminar`, pasando los datos por `state`.
5. El Administrador revisa la información de las aulas y los avisos.
6. Al pulsar **🗑️ Confirmar eliminación**:
   - **Diálogo 1:** Confirmación con resumen de aulas y detalle de consecuencias.
   - **Diálogo 2:** Última advertencia de irreversibilidad.
   - **Diálogo 3:** Validación del texto de seguridad `"ELIMINAR"`.
7. Tras la validación, el frontend invoca `DELETE /aulas/:id` para cada aula seleccionada.
8. Se muestra un resumen de resultados (éxitos y posibles fallos) y el sistema redirige automáticamente al listado actualizado.

## Resultado obtenido
El Administrador puede eliminar aulas de forma segura y controlada. La implementación garantiza que la acción sea consciente e irreversible, con feedback detallado en caso de errores, manteniendo la coherencia visual y arquitectónica con el resto del módulo administrativo.

## Notas de implementación
- El campo `aula` en el modelo `Examen` es un `String` libre (sin FK), por lo que no existe bloqueo referencial a nivel de base de datos. Se muestra el aviso informativo de reasignación como buena práctica operacional.
- La ruta `/admin/aulas/eliminar` está registrada en `App.tsx` como nueva entrada en el router.
- El botón **Editar** de cada fila de `AulasView` mantiene su estado anterior (no implementado en esta sesión).
- Se mantiene la consistencia con el esquema de base de datos PostgreSQL (tabla `Aula`) y la arquitectura NestJS + React.
