# Davidario > crearProfesor > Desarrollo

> |[🏠️](/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/crearProfesor/crearProfesor.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/crearProfesor/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/crearProfesor/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [profesores.controller.ts](/src/backend/src/modules/profesores/profesores.controller.ts) · [profesores.service.ts](/src/backend/src/modules/profesores/profesores.service.ts)
- **Frontend:** [CrearProfesorView.tsx](/src/frontend/src/features/admin/profesores/CrearProfesorView.tsx) · [profesores.service.ts](/src/frontend/src/services/profesores.service.ts)

## Descripción
Implementación de la funcionalidad de alta individual de nuevos profesores en el sistema. El sistema permite al Administrador ingresar los datos básicos del docente (código, nombre completo, email y departamento), realizar validaciones en cliente para evitar datos erróneos y realizar el alta de forma atómica y segura en PostgreSQL usando Prisma a través de una transacción coordinada entre las tablas `Usuario` y `Profesor`.

## Estado
✅ **Completado** - Iteración 1

## Backend

### Endpoints

#### POST `/profesores`
Recibe la información básica del docente y realiza la inserción. Verifica de forma anticipada la no existencia previa del código y del correo electrónico.

**Request:**
```json
{
  "codigo": "PRO005",
  "nombre": "Manuel Masías",
  "email": "manuel.masias@uneatlantico.es",
  "departamento": "Informática"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid-v4-profesor",
  "usuarioId": "uuid-v4-usuario",
  "codigo": "PRO005",
  "departamento": "Informática"
}
```

### Implementación
- **NestJS**: Decoradores `@Post()` y `@HttpCode(HttpStatus.CREATED)` en `ProfesoresController`. Los errores de unicidad se traducen a `ConflictException` (409).
- **Transaccionalidad**: Creación atómica de `Usuario` (rol `Profesor`) y `Profesor` con `this.prisma.$transaction`, asegurando que ambos registros se persistan o ninguno.
- **Hasheo**: Encriptación automática de la contraseña por defecto (`profesor123`) mediante `bcrypt`.
- **Tratamiento de Nombre**: División del nombre completo en `nombre` y `apellido` cuando el cliente envía un único campo, manteniendo compatibilidad con el flujo de importación.
- **Auto-generación de Código**: Si el cliente no aporta `codigo`, se calcula el siguiente `PROF###` reutilizando el helper privado `getNextCodigoSequence()`, evitando colisiones con los seeds existentes.

---

## Frontend

### Implementación
- **React**: Componente `CrearProfesorView` estructurado con un formulario de captura, validaciones instantáneas y cuadros de confirmación nativos.
- **Validaciones en cliente**:
  - Código: Obligatorio, mínimo 3 caracteres, solo letras, números y guiones (regex `[A-Z0-9-]+`).
  - Nombre: Obligatorio, mínimo 3 caracteres.
  - Email: Obligatorio, formato de correo válido.
  - Departamento: Selección obligatoria de un valor de la lista predefinida.

#### CrearProfesorView Component
- Formulario modular en estilo Courier New con campos para código, nombre, email y selector de departamento.
- Lista de departamentos predefinida coherente con el prototipo (`Informática`, `Matemáticas`, `Física`, `Química`, `Administración`, `Psicología`, `Ingeniería Civil`, `Electrónica`).
- Botones de acción "Crear profesor" (con popup nativo de confirmación) y "Cancelar" (con aviso de pérdida de datos si hay cambios).

#### profesoresService
- Método `create(data)`: Envía la petición `POST /profesores` vía Axios.

---

## Flujo de ejecución
1. El Administrador pulsa **➕ Crear nuevo** en `ProfesoresListView`.
2. Se navega a la ruta `/admin/profesores/crear`.
3. El Administrador rellena los campos y pulsa **Crear profesor**.
4. Se validan los formatos en cliente; si son correctos, se muestra confirmación nativa.
5. El backend realiza las validaciones de unicidad (email y código), hashea la clave por defecto y persiste las entidades en una única transacción.
6. Se muestra alerta de éxito y se retorna a la lista principal de profesores actualizada.

## Notas de implementación
- La contraseña por defecto `profesor123` permite al docente acceder a la plataforma por primera vez.
- La ruta `/admin/profesores/crear` está registrada en `App.tsx` y vinculada desde `ProfesoresListView.tsx` mediante el botón **➕ Crear nuevo**, replicando el patrón aplicado en `crearAlumno` y `crearAula`.
- No se modificó la estructura de la base de datos ni el archivo `database-setup.sql`; la implementación reutiliza el esquema y los seeds existentes.
