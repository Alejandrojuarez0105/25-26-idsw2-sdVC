# Davidario > asignarProfesorAExamen > Desarrollo

> |[🏠️](/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/asignarProfesorAExamen/asignarProfesorAExamen.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/asignarProfesorAExamen/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/asignarProfesorAExamen/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [examenes.controller.ts](/src/backend/src/modules/examenes/examenes.controller.ts) · [examenes.service.ts](/src/backend/src/modules/examenes/examenes.service.ts)
- **Frontend:** [AsignarProfesorAExamenView.tsx](/src/frontend/src/features/admin/examenes/AsignarProfesorAExamenView.tsx) · [examenes.service.ts](/src/frontend/src/services/examenes.service.ts) · [profesores.service.ts](/src/frontend/src/services/profesores.service.ts)

## Descripción
Implementación de la funcionalidad de asignación o reasignación de un profesor responsable a un examen ya creado. El sistema presenta de forma simultánea el listado de exámenes y el listado de profesores disponibles, permitiendo al Administrador seleccionar un par examen-profesor para vincularlos, o liberar un examen previamente asignado. La operación se persiste en el campo `profesor` (cadena visible al usuario) de la entidad `Examen`, manteniendo la coherencia con el resto de listados sin alterar el esquema relacional.

## Estado
✅ **Completado** - Iteración 1

## Backend

### Endpoints

#### POST `/examenes/:id/asignar-profesor`
Asigna o desasigna el profesor responsable de un examen identificado por `:id`. El cuerpo de la petición admite un `profesorId` (UUID) que el backend resuelve al nombre completo del profesor, o `null` para desasignar.

**Request Body:**
```json
{
  "profesorId": "uuid-v4-profesor"
}
```

**Response (200 OK):**
```json
{
  "id": "uuid-v4-examen",
  "codigo": "EX001",
  "asignatura": "Programación I",
  "fecha": "2026-01-15T00:00:00.000Z",
  "hora": "08:30",
  "aula": "-2.6",
  "profesor": "Manuel Masías"
}
```

### Implementación
- **NestJS**: Endpoint `@Post(':id/asignar-profesor')` con `@HttpCode(HttpStatus.OK)` en `ExamenesController` que traduce los errores a `NotFoundException` (404) cuando el examen o el profesor no existen.
- **Prisma**: El método `asignarProfesor(examenId, profesorId)` realiza dos lecturas (`prisma.examen.findUnique` y `prisma.profesor.findUnique` con la relación `usuario`) y una escritura `prisma.examen.update` actualizando el campo libre `profesor` con `"nombre apellido"`. Cuando se recibe `profesorId = null`, el campo se vacía (cadena vacía) para liberar el examen.
- **Sin alteración del esquema**: La implementación reutiliza el campo `profesor String` ya presente en el modelo `Examen` del `schema.prisma`, evitando crear tablas relacionales nuevas conforme a la restricción de la sesión.

---

## Frontend

### Implementación
- **React**: Componente `AsignarProfesorAExamenView` con disposición en dos paneles laterales (exámenes y profesores) más un panel inferior de resumen y botonera, siguiendo fielmente el prototipo `asignarProfesorAExamen.html` y el estilo retro Courier New.
- **Carga paralela**: Recuperación simultánea de exámenes y profesores mediante `Promise.all([examenesService.findAll(), profesoresService.findAll()])`.
- **Selección visual**: Cada panel resalta el ítem seleccionado con un borde izquierdo azul y los exámenes ya asignados aparecen sombreados en verde para diferenciarlos de los pendientes.

#### AsignarProfesorAExamenView Component
- Panel izquierdo: listado de exámenes ordenado por fecha con indicador "✅ Asignado" o "⚠️ Sin profesor asignado" según corresponda.
- Panel derecho: listado de profesores con nombre, departamento y correo institucional.
- Botones centrales **◀◀ Desasignar** y **Asignar ▶▶** para ejecutar la operación sobre la selección actual.
- Panel inferior de resumen con tres métricas (exámenes sin profesor, profesores disponibles, profesor seleccionado).
- Botonera principal: **💾 Guardar asignaciones** (muestra el listado actual de exámenes con profesor asignado), **📌 Continuar gestionando** y **❌ Cancelar** (con confirmación de salida).
- Confirmación nativa cuando se intenta asignar un examen que ya tiene profesor (advertencia de reemplazo) y al desasignar.
- Refresco automático de los datos tras cada operación para reflejar el estado real del backend.

#### examenesService
- Método `asignarProfesor(examenId, profesorId | null)`: Envía la petición `POST /examenes/:id/asignar-profesor`.

---

## Flujo de ejecución
1. El Administrador pulsa **👨‍🏫 Asignar profesor** en `ExamenesView`.
2. Se navega a la ruta `/admin/examenes/asignar-profesor` y la vista descarga en paralelo los exámenes y los profesores.
3. El Administrador selecciona un examen del panel izquierdo y un profesor del panel derecho.
4. Al pulsar **Asignar ▶▶** se envía la petición al backend; si el examen ya tenía profesor se solicita confirmación de reemplazo.
5. El backend resuelve el nombre completo del profesor y lo persiste en el campo `profesor` del examen.
6. La vista refresca los datos y muestra una alerta de éxito; el examen aparece sombreado en verde con la marca "✅ Asignado".
7. La operación inversa (desasignar) sigue el mismo flujo enviando `profesorId: null`.

## Notas de implementación
- La implementación se apoya íntegramente en la estructura ya existente del modelo `Examen` (campo `profesor` de tipo `String @db.VarChar(100)`), sin crear tablas intermedias adicionales conforme a la restricción explícita de la sesión.
- La búsqueda por el campo `profesor` en `ExamenesView` queda automáticamente operativa para los exámenes recién asignados, manteniendo la coherencia con la funcionalidad existente de filtrado.
- La ruta `/admin/examenes/asignar-profesor` está registrada en `App.tsx` y vinculada desde `ExamenesView.tsx` mediante el botón **👨‍🏫 Asignar profesor**.
- No se modificó la estructura de la base de datos, el archivo `database-setup.sql` ni ningún caso de uso previamente implementado.
