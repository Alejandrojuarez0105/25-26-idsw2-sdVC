# Davidario > abrirProfesores > Desarrollo

> |[🏠️](/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/abrirProfesores/abrirProfesores.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/abrirProfesores/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/abrirProfesores/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [profesores.controller.ts](/src/backend/src/modules/profesores/profesores.controller.ts) · [profesores.service.ts](/src/backend/src/modules/profesores/profesores.service.ts) · [profesores.module.ts](/src/backend/src/modules/profesores/profesores.module.ts)
- **Frontend:** [ProfesoresListView.tsx](/src/frontend/src/features/admin/profesores/ProfesoresListView.tsx) · [useProfesores.ts](/src/frontend/src/hooks/useProfesores.ts) · [profesores.service.ts](/src/frontend/src/services/profesores.service.ts)

## Descripción
Implementación de la vista de listado y consulta de profesores registrados en el sistema. El sistema permite al administrador visualizar los profesores registrados, su código (generado dinámicamente a partir del ID del profesor), nombre completo, correo electrónico y departamento correspondiente, manteniendo coherencia total con las pantallas de gestión ya consolidadas.

## Estado
✅ **Completado** - Iteración 1 (Visualización y listado)

## Backend

### Endpoints

#### GET `/profesores`
Recupera la lista completa de profesores con su información de usuario asociada.

**Response (200 OK):**
```json
[
  {
    "id": "uuid-v4-profesor",
    "usuarioId": "uuid-v4-usuario",
    "departamento": "Informática",
    "usuario": {
      "id": "uuid-v4-usuario",
      "nombre": "Manuel",
      "apellido": "Masías",
      "email": "manuel.masias@uneatlantico.es",
      "activo": true
    }
  }
]
```

### Implementación
- **NestJS**: Creación del módulo `ProfesoresModule` con su controlador y servicio, integrándolo en `AppModule`.
- **Prisma**: Uso de consultas con inclusión de la relación `usuario` para obtener la información unificada del docente.
- **Persistencia**: Consumo de datos reales de las tablas `Profesor` y `Usuario` en PostgreSQL.

---

## Frontend

### Implementación
- **React**: Creación de la pantalla `ProfesoresListView` siguiendo la estética retro Courier New del sistema.
- **Hooks**: El custom hook `useProfesores` encapsula el consumo asíncrono del backend y el manejo de carga y errores.

#### ProfesoresListView Component
- Estructura de tabla interactiva con columnas: Checkbox, Código, Nombre, Email, Departamento, y Acción (Editar).
- Buscador con filtrado dinámico local por código de profesor, nombre o email.
- Botones de acción inferior alineados a las funcionalidades de administración (`Crear nuevo`, `Importar profesores`, `Eliminar seleccionado` y `Salir`).
- Mensajes controlados y notificaciones nativas en acciones secundarias pendientes de implementar en futuras sesiones de desarrollo.

#### useProfesores Hook
- Consume `profesores.service.ts` para recuperar la colección.
- Mantiene estados de carga, error y refresco.

---

## Flujo de ejecución
1. El Administrador selecciona **👨‍🏫 Profesores** desde el dashboard principal.
2. El sistema redirige mediante React Router a la ruta `/admin/profesores`.
3. El componente `ProfesoresListView` se monta y ejecuta el hook `useProfesores`.
4. Se realiza una petición HTTP GET a `/profesores` enviando el token JWT.
5. El backend consulta la base de datos con Prisma y retorna los profesores mapeados.
6. El Administrador visualiza el listado y puede realizar búsquedas o filtrados en caliente.

## Resultado obtenido
Se ha incorporado la administración inicial de profesores a la plataforma Davidario, facilitando la visualización centralizada de sus expedientes y garantizando un comportamiento fluido acorde a las metas del diseño institucional.

## Notas de implementación
- La base de datos local se configuró mediante el script `database-setup.sql` para añadir soporte a la tabla `Profesor` y sus relaciones, incluyendo el seed de profesores de prueba congruentes con el prototipo.
- Debido a que la base de datos no contiene un atributo de código explícito para profesores, este se genera de manera determinista en el frontend (`PROxxx`) a partir de la representación numérica del UUID único de cada registro, manteniendo consistencia visual con el prototipo.
- Las acciones CRUD de creación, edición, importación masiva y borrado seguro de profesores quedan referenciadas mediante controladores de eventos de advertencia para su posterior acoplamiento.

