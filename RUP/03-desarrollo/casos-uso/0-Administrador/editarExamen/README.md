# Davidario > editarExamen > Desarrollo

> |[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/editarExamen/editarExamen.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/editarExamen/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/editarExamen/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [examenes.controller.ts](/src/backend/src/modules/examenes/examenes.controller.ts) · [examenes.service.ts](/src/backend/src/modules/examenes/examenes.service.ts)
- **Frontend:** [EditarExamenView.tsx](/src/frontend/src/features/admin/examenes/EditarExamenView.tsx) · [examenes.service.ts](/src/frontend/src/services/examenes.service.ts)

## Descripción
Implementación de la funcionalidad para la modificación de datos de exámenes existentes. El sistema permite al administrador actualizar la asignatura, fecha, hora, aula y profesor supervisor de un examen, manteniendo la inmutabilidad del código identificador para asegurar la trazabilidad del registro en el calendario académico.

## Estado
✅ **Completado** - Iteración 1 (Modificación de registros con validación de cambios)

## Backend

### Endpoints

#### GET `/examenes/:id`
Recupera los datos detallados de un examen específico para su edición.

**Response (200 OK):**
*Objeto examen completo.*

#### PUT `/examenes/:id`
Actualiza los campos de un examen existente en PostgreSQL.

**Request Body:**
```json
{
  "asignatura": "Programación I",
  "fecha": "2026-06-15",
  "hora": "08:30",
  "aula": "1.2",
  "profesor": "Manuel Masías"
}
```

**Response (200 OK):**
*Retorna el objeto examen actualizado.*

### Implementación
- **NestJS**: Extensión del `ExamenesController` con endpoints `GET` e `PUT`.
- **Prisma**: Uso del método `update` filtrando por el ID proporcionado.
- **Seguridad**: Validación de existencia previa del registro antes de intentar la actualización.

---

## Frontend

### Implementación
- **React**: Componente `EditarExamenView` con precarga de datos mediante `useEffect`.
- **Lógica**: Detección de cambios pendientes y validación de campos obligatorios.

#### EditarExamenView Component
- Campos de solo lectura para el Código del examen.
- Selectores dinámicos para Asignatura, Hora, Aula y Profesor.
- Mecanismo de confirmación antes de guardar los cambios.
- Opción de "Continuar editando" para validaciones intermedias.

#### Integración en ExamenesView
- Vinculación del botón **Editar** de cada fila hacia la ruta dinámica `/admin/examenes/editar/:id`.

---

## Flujo de ejecución
1. El Administrador selecciona **Editar** en un examen específico del listado.
2. El sistema carga los datos actuales desde el backend y los presenta en el formulario.
3. El Administrador realiza las modificaciones deseadas.
4. Al pulsar **💾 Guardar cambios**, el sistema verifica que existan cambios reales.
5. Se solicita confirmación final y se invoca al backend mediante el servicio API.
6. El sistema confirma el éxito y retorna al listado actualizado.

## Resultado obtenido
Se ha completado el ciclo CRUD para la gestión de exámenes, permitiendo ajustes dinámicos en la programación académica con total seguridad e integridad de datos.

## Notas de implementación
- Se mantiene la inmutabilidad del código del examen durante la edición para preservar la coherencia de las referencias externas.
- El sistema detecta automáticamente si el usuario intenta salir sin guardar cambios, lanzando una advertencia de seguridad.
