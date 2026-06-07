# Davidario > abrirAlumnos > Desarrollo

> |[🏠️](/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/abrirAlumnos/abrirAlumnos.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/abrirAlumnos/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/abrirAlumnos/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [alumnos.controller.ts](/src/backend/src/modules/alumnos/alumnos.controller.ts) · [alumnos.service.ts](/src/backend/src/modules/alumnos/alumnos.service.ts) · [alumnos.module.ts](/src/backend/src/modules/alumnos/alumnos.module.ts)
- **Frontend:** [AlumnosView.tsx](/src/frontend/src/features/admin/alumnos/AlumnosView.tsx) · [useAlumnos.ts](/src/frontend/src/hooks/useAlumnos.ts) · [alumnos.service.ts](/src/frontend/src/services/alumnos.service.ts)

## Descripción
Implementación de la vista de listado y consulta de alumnos registrados en el sistema. El sistema permite al administrador visualizar los estudiantes registrados, su matrícula (identificador), nombre completo, correo electrónico, grado académico al que pertenecen y su curso académico correspondiente, manteniendo coherencia total con las pantallas de gestión ya consolidadas.

## Estado
✅ **Completado** - Iteración 1 (Visualización y listado)

## Backend

### Endpoints

#### GET `/alumnos`
Recupera la lista completa de alumnos ordenada por matrícula.

**Response (200 OK):**
```json
[
  {
    "id": "uuid-v4-alumno",
    "usuarioId": "uuid-v4-usuario",
    "matricula": "AL001234",
    "gradoId": "uuid-v4-grado",
    "usuario": {
      "id": "uuid-v4-usuario",
      "nombre": "Ana",
      "apellido": "García López",
      "email": "ana.garcia@alumnos.uneatlantico.es",
      "activo": true
    },
    "grado": {
      "id": "uuid-v4-grado",
      "codigo": "INF",
      "nombre": "Ingeniería Informática"
    }
  }
]
```

### Implementación
- **NestJS**: Creación del módulo `AlumnosModule` con su controlador y servicio, integrándolo en `AppModule`.
- **Prisma**: Uso de consultas optimizadas con inclusión de relaciones (`usuario` y `grado`) para obtener la información unificada del estudiante.
- **Persistencia**: Consumo de datos reales de las tablas `Alumno`, `Usuario` y `Grado` en PostgreSQL.

---

## Frontend

### Implementación
- **React**: Creación de la pantalla `AlumnosView` siguiendo la estética retro Courier New del sistema.
- **Hooks**: El custom hook `useAlumnos` encapsula el consumo asíncrono del backend y el manejo de carga y errores.

#### AlumnosView Component
- Estructura de tabla interactiva con columnas: Checkbox, Matrícula, Nombre, Email, Grado, Curso, y Acción (Editar).
- Buscador con filtrado dinámico local por matrícula, nombre o email.
- Botones de acción inferior alineados a las funcionalidades de administración (`Crear nuevo`, `Importar alumnos`, `Eliminar seleccionado` y `Salir`).
- Mensajes controlados y notificaciones nativas en acciones secundarias pendientes de implementar en futuras sesiones de desarrollo.

#### useAlumnos Hook
- Consume `alumnos.service.ts` para recuperar la colección.
- Mantiene estados de carga, error y refresco.

---

## Flujo de ejecución
1. El Administrador selecciona **👨‍🎓 Alumnos** desde el dashboard principal.
2. El sistema redirige mediante React Router a la ruta `/admin/alumnos`.
3. El componente `AlumnosView` se monta y ejecuta el hook `useAlumnos`.
4. Se realiza una petición HTTP GET a `/alumnos` enviando el token JWT.
5. El backend consulta la base de datos con Prisma y retorna los alumnos mapeados.
6. El Administrador visualiza el listado y puede realizar búsquedas o filtrados en caliente.

## Resultado obtenido
Se ha incorporado la administración inicial de estudiantes a la plataforma Davidario, facilitando la visualización centralizada de sus expedientes y garantizando un comportamiento fluido acorde a las metas del diseño institucional.

## Notas de implementación
- La base de datos local se actualizó mediante el script `database-setup.sql` para añadir soporte a la tabla `Alumno` y sus relaciones, incluyendo seed de estudiantes de prueba congruentes con el prototipo.
- Las acciones CRUD de creación, edición, importación masiva y borrado seguro quedan referenciadas mediante controladores de eventos de advertencia para su posterior acoplamiento.
