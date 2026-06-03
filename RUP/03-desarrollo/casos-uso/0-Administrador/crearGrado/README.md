# Davidario > crearGrado > Desarrollo

> |[🏠️](/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/crearGrado/crearGrado.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/crearGrado/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/crearGrado/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [grados.controller.ts](/src/backend/src/modules/grados/grados.controller.ts) · [grados.service.ts](/src/backend/src/modules/grados/grados.service.ts)
- **Frontend:** [CrearGradoView.tsx](/src/frontend/src/features/admin/grados/CrearGradoView.tsx) · [grados.service.ts](/src/frontend/src/services/grados.service.ts)

## Descripción
Implementación de la funcionalidad de registro de nuevos grados académicos. El sistema proporciona un formulario técnico validado que permite al Administrador dar de alta nuevas entidades en la base de datos PostgreSQL 16, garantizando la unicidad del código y manteniendo la coherencia visual con el estándar institucional.

## Estado
✅ **Completado** - Iteración 1

## Backend

### Endpoints

#### POST `/grados`
Crea un nuevo grado académico validando que el código no esté duplicado.

**Request:**
```json
{
  "codigo": "GII",
  "nombre": "Ingeniería Informática",
  "descripcion": "Grado en Ingeniería Informática"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid-v4-string",
  "codigo": "GII",
  "nombre": "Ingeniería Informática",
  "descripcion": "Grado en Ingeniería Informática",
  "fechaActualizacion": "2026-06-04T00:00:00.000Z"
}
```

### Implementación
- **NestJS**: Uso del decorador `@Post()` y manejo de excepciones `ConflictException` (HTTP 409) para códigos duplicados.
- **Prisma**: Operación `this.prisma.grado.create()` tras la validación de existencia previa.
- **Validación**: Lógica de servicio que asegura que el código sea único antes de la persistencia.

---

## Frontend

### Implementación
- **React**: Creación de `CrearGradoView` como vista de formulario dedicada.
- **Estado**: Gestión de formulario mediante `useState` para control de campos (inputs y textarea).
- **Fidelidad Visual**: Réplica exacta del prototipo institucional (estilo Courier New, anchos de campo, botones estilizados).

#### CrearGradoView Component
- Formulario validado (campos obligatorios, longitud mínima de código).
- Diálogo de confirmación nativo antes de la persistencia final.
- Redirección automática al listado principal tras la creación exitosa.

#### gradosService
- Método `create(data)`: Encapsula la petición `POST` de Axios hacia la API de NestJS.

---

## Flujo de ejecución
1. El Administrador hace clic en **➕ Crear nuevo** desde el listado de grados.
2. El sistema navega a la vista **CrearGradoView**.
3. El Administrador completa los campos: Código, Nombre y Descripción.
4. Al pulsar **Crear grado**, el frontend realiza validaciones sintácticas.
5. Se muestra un cuadro de confirmación con el resumen de los datos.
6. Tras la aceptación, se invoca al backend.
7. El sistema informa del éxito y redirige automáticamente a `/admin/grados`.

## Resultado obtenido
El Administrador puede dar de alta nuevos grados de forma ágil y segura. La implementación previene errores de duplicidad y asegura que los datos cumplan con los requisitos mínimos del sistema Davidario.

## Notas de implementación
- El código se convierte automáticamente a mayúsculas antes de ser enviado al servidor para mantener la consistencia.
- Se ha respetado el esquema de base de datos PostgreSQL y las restricciones de integridad definidas.
