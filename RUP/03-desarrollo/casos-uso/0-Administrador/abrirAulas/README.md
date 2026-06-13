# Davidario > abrirAulas > Desarrollo

> |[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/abrirAulas/abrirAulas.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/abrirAulas/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/abrirAulas/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [aulas.controller.ts](/src/backend/src/modules/aulas/aulas.controller.ts) · [aulas.service.ts](/src/backend/src/modules/aulas/aulas.service.ts) · [aulas.module.ts](/src/backend/src/modules/aulas/aulas.module.ts)
- **Frontend:** [AulasView.tsx](/src/frontend/src/features/admin/aulas/AulasView.tsx) · [useAulas.ts](/src/frontend/src/hooks/useAulas.ts) · [aulas.service.ts](/src/frontend/src/services/aulas.service.ts)

## Descripción
Implementación de la vista de listado y consulta de aulas registradas en el sistema. El sistema permite al administrador visualizar las aulas, incluyendo su código, nombre, capacidad y ubicación, manteniendo la coherencia visual con el resto de módulos de administración.

## Estado
✅ **Completado** - Iteración 1 (Visualización y listado)

## Backend

### Endpoints

#### GET `/aulas`
Recupera la lista completa de aulas ordenadas alfabéticamente por código.

**Response (200 OK):**
```json
[
  {
    "id": "uuid-v4-aula",
    "codigo": "-2.6",
    "nombre": "Laboratorio -2.6",
    "capacidad": 30,
    "ubicacion": "Planta -2",
    "fechaCreacion": "2026-06-06T00:00:00.000Z"
  }
]
```

### Implementación
- **NestJS**: Creación del módulo `AulasModule` con un controlador y servicio dedicados.
- **Prisma**: Uso del cliente generado para realizar la consulta `findMany` a la base de datos PostgreSQL.
- **Persistencia**: Tabla `Aula` en PostgreSQL, persistiendo la información de la capacidad y ubicación de los espacios físicos.

---

## Frontend

### Implementación
- **React**: Componente `AulasView` que replica fielmente el diseño de los prototipos y casos previos (`abrirGrados`, `abrirAsignaturas`, `abrirExamenes`).
- **Hooks**: El custom hook `useAulas` gestiona el estado asíncrono, la consulta al backend y la captura de errores a través de Axios y el interceptor global.

#### AulasView Component
- Tabla principal con columnas para Código, Nombre, Capacidad y Ubicación.
- Barra superior de filtrado dinámico (búsqueda en caliente por código, nombre o ubicación).
- Gestión de selección múltiple con checkboxes en cada fila.
- Botones de acción inferior alineados a las funcionalidades CRUD (actualmente preparadas para las siguientes sesiones).

#### useAulas Hook
- Se encarga de hacer petición HTTP GET hacia `aulas.service.ts`.
- Mantiene las variables de estado `aulas`, `loading` y `error`.

---

## Flujo de ejecución
1. El Administrador selecciona **🏛️ Aulas** desde el Dashboard principal.
2. El sistema redirige mediante React Router a la ruta `/admin/aulas`.
3. El hook `useAulas` realiza una petición HTTP GET a `/aulas` autenticada con JWT mediante el core API.
4. El backend recupera el listado ordenado de la base de datos usando Prisma.
5. El Administrador visualiza el grid y tiene la capacidad de buscar, filtrar o seleccionar registros para futuras gestiones.

## Resultado obtenido
Se ha completado la incorporación del módulo de Aulas al sistema de información, proveyendo al actor Administrador de una interfaz consistente, rápida y segura para la supervisión de espacios físicos.

## Notas de implementación
- La tabla `Aula` fue añadida exitosamente en la definición local de base de datos (`schema.prisma` y `database-setup.sql`).
- Las acciones de crear, editar y eliminar se enlazarán progresivamente en las futuras sesiones de desarrollo según el diagrama de contexto.
