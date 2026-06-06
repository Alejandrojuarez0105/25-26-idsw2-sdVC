# Davidario > crearExamen > Desarrollo

> |[🏠️](/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/crearExamen/crearExamen.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/crearExamen/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/crearExamen/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [examenes.controller.ts](/src/backend/src/modules/examenes/examenes.controller.ts) · [examenes.service.ts](/src/backend/src/modules/examenes/examenes.service.ts)
- **Frontend:** [CrearExamenView.tsx](/src/frontend/src/features/admin/examenes/CrearExamenView.tsx) · [examenes.service.ts](/src/frontend/src/services/examenes.service.ts)

## Descripción
Implementación de la funcionalidad para el registro de nuevos exámenes en el sistema. El administrador puede definir el código identificador, seleccionar la asignatura, establecer la fecha, hora y aula, y asignar un profesor supervisor, garantizando la integridad de los datos mediante validaciones de formato y unicidad.

## Estado
✅ **Completado** - Iteración 1 (Alta de registros con validación de unicidad)

## Backend

### Endpoints

#### POST `/examenes`
Crea un nuevo registro de examen en la base de datos PostgreSQL.

**Request Body:**
```json
{
  "codigo": "EX005",
  "asignatura": "Redes de Ordenadores",
  "fecha": "2026-06-15",
  "hora": "08:30",
  "aula": "1.2",
  "profesor": "Jorge Crespo"
}
```

**Response (201 Created):**
*Retorna el objeto examen creado.*

### Implementación
- **NestJS**: Extensión del `ExamenesController` con el endpoint `POST` y manejo de `ConflictException`.
- **Prisma**: Uso del método `create` previa validación de que el código no esté duplicado.
- **Transformación**: La fecha se convierte a objeto `Date` de JavaScript para su almacenamiento correcto en la DB.

---

## Frontend

### Implementación
- **React**: Componente `CrearExamenView` que implementa el formulario institucional.
- **Validación**: Lógica de validación de campos obligatorios, longitud de código (mín. 3) y restricción de fechas pasadas.

#### CrearExamenView Component
- Formulario con selects para Asignatura (cargada dinámicamente desde el sistema), Hora, Aula y Profesor.
- Uso de `useNavigate` para retornar al listado tras el éxito.
- Protocolo de confirmación previa a la persistencia mediante `window.confirm`.

#### Integración en ExamenesView
- Vinculación del botón **➕ Crear nuevo** hacia la ruta `/admin/examenes/crear`.

---

## Flujo de ejecución
1. El Administrador pulsa **➕ Crear nuevo** en el listado de exámenes.
2. Completa los campos del formulario (validación reactiva).
3. El sistema solicita confirmación visual de los datos ingresados.
4. Se invoca al backend NestJS mediante el servicio API.
5. El backend valida la unicidad del código y persiste en PostgreSQL.
6. El sistema muestra éxito y retorna al listado actualizado.

## Resultado obtenido
Se ha completado el ciclo de alta para la gestión de exámenes, permitiendo la expansión controlada del calendario académico bajo las normas institucionales y manteniendo la coherencia técnica con el resto del sistema Davidario.

## Notas de implementación
- La lista de asignaturas se carga dinámicamente desde el `AsignaturasModule`, fomentando la reutilización de datos existentes.
- Los campos de Profesor y Aula se mantienen como selectores de texto directo para esta fase, alineados con la simplificación del modelo de datos solicitada.
