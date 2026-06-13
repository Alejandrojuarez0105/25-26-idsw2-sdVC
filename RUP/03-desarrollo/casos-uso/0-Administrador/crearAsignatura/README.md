# Davidario > crearAsignatura > Desarrollo

> |[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/crearAsignatura/crearAsignatura.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/crearAsignatura/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/crearAsignatura/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [asignaturas.controller.ts](/src/backend/src/modules/asignaturas/asignaturas.controller.ts) · [asignaturas.service.ts](/src/backend/src/modules/asignaturas/asignaturas.service.ts)
- **Frontend:** [CrearAsignaturaView.tsx](/src/frontend/src/features/admin/asignaturas/CrearAsignaturaView.tsx) · [asignaturas.service.ts](/src/frontend/src/services/asignaturas.service.ts)

## Descripción
Implementación de la funcionalidad de registro de nuevas asignaturas académicas. El sistema proporciona un formulario técnico validado que permite al Administrador dar de alta nuevas entidades vinculadas a un Grado académico en la base de datos PostgreSQL 16, garantizando la unicidad del código y manteniendo la coherencia visual institucional.

## Estado
✅ **Completado** - Iteración 1

## Backend

### Endpoints

#### POST `/asignaturas`
Crea una nueva asignatura validando la unicidad del código y la existencia del grado relacionado.

**Request:**
```json
{
  "codigo": "IYA003",
  "nombre": "Programación I",
  "creditos": 6,
  "gradoId": "uuid-v4-grado"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid-v4-string",
  "codigo": "IYA003",
  "nombre": "Programación I",
  "creditos": 6,
  "gradoId": "uuid-v4-grado",
  "fechaCreacion": "2026-06-04T00:00:00.000Z"
}
```

### Implementación
- **NestJS**: Uso del decorador `@Post()` y manejo de excepciones `ConflictException` para códigos duplicados.
- **Prisma**: Operación `this.prisma.asignatura.create()` con validación de clave foránea manual en el servicio.
- **Lógica de Negocio**: Asegura que el grado seleccionado sea válido antes de proceder con la inserción.

---

## Frontend

### Implementación
- **React**: Creación de `CrearAsignaturaView` como componente de formulario.
- **Estado**: Gestión de datos mediante `useState` y carga dinámica de grados para el selector.
- **Fidelidad Visual**: Réplica exacta del prototipo institucional (estilo Courier New, selectores estilizados, botones de acción).

#### CrearAsignaturaView Component
- Formulario reactivo con validaciones de campos obligatorios y tipos de datos (número de créditos).
- Selector dinámico de Grados que consume el servicio `gradosService.findAll()`.
- Diálogo de confirmación antes de la persistencia final.

#### asignaturasService
- Método `create(data)`: Encapsula la petición `POST` de Axios hacia la API de NestJS.

---

## Flujo de ejecución
1. El Administrador hace clic en **➕ Crear nueva** desde el listado de asignaturas.
2. El sistema navega a la vista **CrearAsignaturaView**.
3. El frontend carga la lista de grados disponibles para el selector.
4. El Administrador completa el formulario y selecciona un grado.
5. Al pulsar **Crear asignatura**, se realizan validaciones de formato.
6. Se muestra un cuadro de confirmación resumen.
7. Tras la aceptación, se invoca al backend y se redirige automáticamente al listado.

## Resultado obtenido
El Administrador puede registrar nuevas asignaturas de forma segura y relacionada. La implementación previene la creación de registros inconsistentes y asegura que la información académica esté correctamente estructurada en PostgreSQL.

## Notas de implementación
- El código de la asignatura se normaliza automáticamente a mayúsculas.
- Se ha validado que el rango de créditos permitido esté entre 1 y 12 según las reglas de negocio.
