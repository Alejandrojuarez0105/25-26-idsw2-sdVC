# Davidario > abrirAsignaturas > Desarrollo

> |[🏠️](/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/abrirAsignaturas/abrirAsignaturas.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/abrirAsignaturas/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/abrirAsignaturas/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [asignaturas.controller.ts](/src/backend/src/modules/asignaturas/asignaturas.controller.ts) · [asignaturas.service.ts](/src/backend/src/modules/asignaturas/asignaturas.service.ts) · [asignaturas.module.ts](/src/backend/src/modules/asignaturas/asignaturas.module.ts)
- **Frontend:** [AsignaturasView.tsx](/src/frontend/src/features/admin/asignaturas/AsignaturasView.tsx) · [useAsignaturas.ts](/src/frontend/src/hooks/useAsignaturas.ts) · [asignaturas.service.ts](/src/frontend/src/services/asignaturas.service.ts)

## Descripción
Implementación de la vista de listado y consulta de asignaturas académicas. El sistema permite al administrador visualizar las materias registradas, incluyendo su código, nombre, carga de créditos y el grado académico al que pertenecen, manteniendo la coherencia visual con el módulo de grados.

## Estado
✅ **Completado** - Iteración 1 (Visualización y listado relacional)

## Backend

### Endpoints

#### GET `/asignaturas`
Recupera la lista completa de asignaturas, incluyendo la información básica del grado asociado mediante un `join` conceptual (Prisma `include`).

**Response (200 OK):**
```json
[
  {
    "id": "uuid-v4-string",
    "codigo": "IYA003",
    "nombre": "Programación I",
    "creditos": 6,
    "gradoId": "uuid-v4-grado",
    "grado": {
      "codigo": "GII",
      "nombre": "Ingeniería Informática"
    },
    "fechaCreacion": "2026-06-04T00:00:00.000Z"
  }
]
```

### Implementación
- **NestJS**: Creación del módulo `AsignaturasModule`.
- **Prisma**: Uso de `include: { grado: true }` para resolver la relación de clave foránea en una sola consulta.
- **Persistencia**: Tabla `Asignatura` vinculada a `Grado` mediante `gradoId`.

---

## Frontend

### Implementación
- **React**: Componente `AsignaturasView` que replica el prototipo `abrirAsignaturas.html`.
- **Hooks**: El custom hook `useAsignaturas` gestiona la recuperación de datos relacionales.

#### AsignaturasView Component
- Tabla con columnas para Código, Nombre, Créditos y Grado.
- Barra de búsqueda reactiva para filtrado por texto.
- Navegación integrada hacia el dashboard principal.

#### useAsignaturas Hook
- Centraliza la llamada a `asignaturasService.findAll()`.
- Maneja estados de carga (`loading`) y errores de red.

---

## Flujo de ejecución
1. El Administrador selecciona **📚 Asignaturas** desde el menú principal.
2. El sistema navega a `/admin/asignaturas`.
3. El frontend solicita el listado al backend NestJS.
4. El backend recupera las asignaturas y sus grados asociados de PostgreSQL.
5. El Administrador visualiza el listado completo y puede filtrar resultados localmente.

## Resultado obtenido
El sistema permite una navegación fluida hacia la gestión de asignaturas, mostrando información clara y relacionada con los grados académicos, cumpliendo con los estándares técnicos y visuales establecidos.

## Notas de implementación
- Se ha actualizado `src/database-setup.sql` para incluir la definición física de la tabla `Asignatura` y datos de prueba.
- Los botones de Crear, Importar y Eliminar se encuentran preparados visualmente para su posterior implementación funcional.
