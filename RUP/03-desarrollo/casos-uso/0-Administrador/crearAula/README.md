# Davidario > crearAula > Desarrollo

> |[🏠️](/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/crearAula/crearAula.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/crearAula/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/crearAula/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [aulas.controller.ts](/src/backend/src/modules/aulas/aulas.controller.ts) · [aulas.service.ts](/src/backend/src/modules/aulas/aulas.service.ts)
- **Frontend:** [CrearAulaView.tsx](/src/frontend/src/features/admin/aulas/CrearAulaView.tsx) · [aulas.service.ts](/src/frontend/src/services/aulas.service.ts)

## Descripción
Implementación de la funcionalidad de registro de nuevas aulas (espacios físicos). El sistema proporciona un formulario técnico validado que permite al Administrador dar de alta nuevas aulas en la base de datos PostgreSQL 16, garantizando la unicidad del código, validando la capacidad mínima del aula y manteniendo la coherencia visual con el estándar institucional de Davidario.

## Estado
✅ **Completado** - Iteración 1

## Backend

### Endpoints

#### POST `/aulas`
Crea un nuevo aula validando que el código no esté duplicado y aplicando valores por defecto si es necesario.

**Request:**
```json
{
  "codigo": "A-101",
  "nombre": "Aula 101",
  "capacidad": 40,
  "ubicacion": "Edificio A - Planta 1"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid-v4-string",
  "codigo": "A-101",
  "nombre": "Aula 101",
  "capacidad": 40,
  "ubicacion": "Edificio A - Planta 1",
  "fechaCreacion": "2026-06-07T00:00:00.000Z"
}
```

### Implementación
- **NestJS**: Incorporación del endpoint `@Post()` en `AulasController`, con captura de errores y lanzamiento automático de `ConflictException` (HTTP 409) para códigos duplicados.
- **Prisma**: Operación `this.prisma.aula.create()` en `AulasService` tras comprobar que no exista una entidad con el mismo `codigo`.
- **Validación**: Coerción de capacidad a entero (`parseInt`) con valor por defecto de 0 si es incorrecto, e inicialización de la ubicación vacía por defecto.

---

## Frontend

### Implementación
- **React**: Componente `CrearAulaView` como vista de formulario dedicada al alta de aulas.
- **Fidelidad Visual**: Réplica exacta del prototipo institucional (estilo Courier New, anchos de campo, y botones con colores de estilo retro).

#### CrearAulaView Component
- Centraliza la gestión del estado del formulario y las validaciones de negocio en el propio componente (Código, Nombre, Capacidad y Ubicación), manteniendo el patrón de diseño de tener un único hook (`useAulas.ts`) para la lógica de listado general de la rama.
- Valida campos obligatorios: Código, Nombre, Ubicación.
- Valida formato de Código: al menos 2 caracteres, permitiendo únicamente caracteres alfanuméricos y guiones (`/^[A-Z0-9-]+$/i`).
- Valida Capacidad: debe ser mayor o igual a 1.
- Presenta confirmación nativa de JavaScript con el resumen del aula antes de enviar los datos al servidor.
- Informa mediante alertas del resultado de la operación (éxito o error).
- Redirige al listado principal en `/admin/aulas` tras crear con éxito o al cancelar (previa confirmación de pérdida de cambios si el formulario está sucio).

#### aulasService
- Añadido el método `create(data)` que encapsula la llamada Axios hacia `POST /aulas`.

---

## Flujo de ejecución
1. El Administrador hace clic en **➕ Crear nuevo** desde la pantalla de listado de aulas.
2. El sistema redirige a la ruta `/admin/aulas/crear` cargando el componente **CrearAulaView**.
3. El Administrador introduce los datos de la nueva aula.
4. Al hacer clic en **Crear aula**, el frontend valida sintácticamente los campos.
5. Si los datos son válidos, se solicita una confirmación visual al usuario mostrando los detalles técnicos.
6. Si el Administrador confirma, se envía la petición `POST /aulas`.
7. El backend valida en la base de datos que el código sea único y persiste la entidad.
8. Si se crea con éxito, el sistema muestra un mensaje de confirmación y redirige automáticamente al listado principal, donde el aula ya aparece en orden alfabético.

## Resultado obtenido
El Administrador dispone de una pantalla segura y coherente para el registro de espacios físicos, evitando inconsistencias mediante controles en el cliente (como capacidad mínima e inyección de caracteres especiales) y controlando la duplicidad a nivel de persistencia en PostgreSQL.

## Notas de implementación
- El código del aula se normaliza automáticamente convirtiéndolo a mayúsculas antes de enviarlo al servidor.
- La ruta fue dada de alta en el enrutador principal en `App.tsx` para hacerla accesible y permitir la navegación bidireccional.
