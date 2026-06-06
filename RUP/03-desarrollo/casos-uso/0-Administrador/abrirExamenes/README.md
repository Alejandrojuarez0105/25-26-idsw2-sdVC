# Davidario > abrirExamenes > Desarrollo

> |[🏠️](/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/abrirExamenes/abrirExamenes.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/abrirExamenes/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/abrirExamenes/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [examenes.controller.ts](/src/backend/src/modules/examenes/examenes.controller.ts) · [examenes.service.ts](/src/backend/src/modules/examenes/examenes.service.ts) · [examenes.module.ts](/src/backend/src/modules/examenes/examenes.module.ts)
- **Frontend:** [ExamenesView.tsx](/src/frontend/src/features/admin/examenes/ExamenesView.tsx) · [useExamenes.ts](/src/frontend/src/hooks/useExamenes.ts) · [examenes.service.ts](/src/frontend/src/services/examenes.service.ts)

## Descripción
Implementación de la vista de listado y consulta de exámenes programados. El sistema permite al administrador visualizar los exámenes registrados, incluyendo su código, la asignatura correspondiente, fecha, hora, aula asignada y el profesor supervisor, manteniendo la coherencia visual con el resto de módulos de administración.

## Estado
✅ **Completado** - Iteración 1 (Visualización y listado relacional)

## Backend

### Endpoints

#### GET `/examenes`
Recupera la lista completa de exámenes, incluyendo la información de la asignatura y del profesor supervisor (incluyendo datos de usuario) mediante Prisma `include`.

**Response (200 OK):**
```json
[
  {
    "id": "uuid-v4-examen",
    "codigo": "EX001",
    "fecha": "2026-01-15T00:00:00.000Z",
    "hora": "08:30",
    "aula": "-2.6",
    "asignaturaId": "uuid-v4-asignatura",
    "asignatura": {
      "nombre": "Programación I"
    },
    "profesor": {
      "usuario": {
        "nombre": "Manuel",
        "apellido": "Masías"
      }
    }
  }
]
```

### Implementación
- **NestJS**: Creación del módulo `ExamenesModule`.
- **Prisma**: Uso de `include` anidado para recuperar `asignatura` y `profesor.usuario` en una sola consulta.
- **Persistencia**: Tabla `Examen` vinculada a `Asignatura` y opcionalmente a `Profesor`.

---

## Frontend

### Implementación
- **React**: Componente `ExamenesView` que replica el prototipo `abrirExamenes.html`.
- **Hooks**: El custom hook `useExamenes` gestiona la recuperación de datos desde el servicio.

#### ExamenesView Component
- Tabla con columnas para Código, Asignatura, Fecha, Hora, Aula y Profesor.
- Formateo de fecha dinámico (DD/MM/YYYY) para mejorar la legibilidad.
- Barra de búsqueda reactiva para filtrado por código, asignatura o profesor.
- Navegación integrada hacia el dashboard principal del administrador.

#### useExamenes Hook
- Centraliza la llamada a `examenesService.findAll()`.
- Maneja estados de carga (`loading`) y errores de red mediante Axios.

---

## Flujo de ejecución
1. El Administrador selecciona **📝 Exámenes** desde el menú principal (Accesos rápidos).
2. El sistema navega a `/admin/examenes`.
3. El frontend solicita el listado al backend NestJS mediante un interceptor JWT.
4. El backend recupera los exámenes y sus relaciones de PostgreSQL mediante Prisma.
5. El Administrador visualiza el listado completo y puede filtrar resultados localmente.

## Resultado obtenido
El sistema permite una visualización clara y ordenada de la programación de exámenes, facilitando la supervisión administrativa del calendario académico bajo los estándares del proyecto Davidario.

## Notas de implementación
- Se ha actualizado `src/backend/prisma/schema.prisma` y `src/database-setup.sql` para incluir la definición física de la tabla `Examen` y datos de prueba iniciales.
- Los botones de Crear, Editar y Eliminar se encuentran preparados visualmente, vinculados a alertas de funcionalidad no implementada en esta sesión.
