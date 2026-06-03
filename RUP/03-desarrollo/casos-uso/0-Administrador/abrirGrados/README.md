# Davidario > abrirGrados > Desarrollo

> |[🏠️](/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/abrirGrados/abrirGrados.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/abrirGrados/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/abrirGrados/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [grados.controller.ts](/src/backend/src/modules/grados/grados.controller.ts) · [grados.service.ts](/src/backend/src/modules/grados/grados.service.ts) · [grados.module.ts](/src/backend/src/modules/grados/grados.module.ts)
- **Frontend:** [GradosView.tsx](/src/frontend/src/features/admin/grados/GradosView.tsx) · [useGrados.ts](/src/frontend/src/hooks/useGrados.ts) · [grados.service.ts](/src/frontend/src/services/grados.service.ts)

## Descripción
Implementación de la vista de listado y consulta de grados académicos. El sistema permite al administrador visualizar la totalidad de los grados registrados en la base de datos PostgreSQL, incluyendo su código, nombre y descripción, manteniendo la fidelidad visual con el prototipo institucional.

## Estado
✅ **Completado** - Iteración 1 (Visualización y listado)

## Backend

### Endpoints

#### GET `/grados`
Recupera la lista completa de grados académicos ordenados alfabéticamente por nombre.

**Response (200 OK):**
```json
[
  {
    "id": "uuid-v4-string",
    "codigo": "GII",
    "nombre": "Ingeniería Informática",
    "descripcion": "Grado en Ingeniería Informática",
    "fechaActualizacion": "2026-06-03T00:00:00.000Z"
  }
]
```

### Implementación
- **NestJS**: Creación del módulo `GradosModule` para encapsular la lógica.
- **Prisma**: Uso de `this.prisma.grado.findMany()` con ordenamiento `asc` por nombre.
- **Controller**: Exposición del endpoint sin parámetros de filtrado complejos en esta fase.

---

## Frontend

### Implementación
- **React**: Componente `GradosView` estructurado con la estética de los prototipos del profesor ( Courier New, tablas bordeadas, botones de acción).
- **Hooks**: El custom hook `useGrados` gestiona el ciclo de vida de la petición asíncrona y los estados de `loading` y `error`.

#### GradosView Component
- Tabla responsiva con sombreado al pasar el cursor.
- Integración de la barra de búsqueda local para filtrado rápido por código o nombre.
- Botones de acción (Crear, Importar, Eliminar) implementados visualmente pero deshabilitados funcionalmente según el alcance de la sesión.

#### useGrados Hook
- Centraliza la llamada a `gradosService.findAll()`.
- Provee un método `refresh()` para recargar la lista en futuras iteraciones.

---

## Flujo de ejecución
1. El Administrador hace clic en el acceso rápido **🎓 Grados** desde el dashboard.
2. El sistema navega a `/admin/grados`.
3. El hook `useGrados` se dispara en el montaje del componente.
4. El backend consulta la base de datos PostgreSQL a través de Prisma.
5. Los datos se renderizan en la tabla institucional.

## Resultado obtenido
El Administrador puede visualizar correctamente el listado de grados académicos. La navegación de retorno al dashboard y la visualización de datos cumplen con los estándares de diseño y arquitectura definidos.

## Notas de implementación
- Las funciones de creación, edición e importación muestran una alerta informativa, ya que su desarrollo está programado para sesiones posteriores.
- Se ha respetado el esquema de base de datos definido en la configuración global del proyecto.
