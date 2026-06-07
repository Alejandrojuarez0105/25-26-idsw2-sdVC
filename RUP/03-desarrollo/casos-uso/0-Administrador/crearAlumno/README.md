# Davidario > crearAlumno > Desarrollo

> |[🏠️](/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/crearAlumno/crearAlumno.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/crearAlumno/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/crearAlumno/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [alumnos.controller.ts](/src/backend/src/modules/alumnos/alumnos.controller.ts) · [alumnos.service.ts](/src/backend/src/modules/alumnos/alumnos.service.ts)
- **Frontend:** [CrearAlumnoView.tsx](/src/frontend/src/features/admin/alumnos/CrearAlumnoView.tsx) · [alumnos.service.ts](/src/frontend/src/services/alumnos.service.ts)

## Descripción
Implementación de la funcionalidad de alta individual de nuevos alumnos en el sistema. El sistema permite al Administrador ingresar los datos básicos del estudiante (matrícula, nombre, email, grado y curso), realizar validaciones en cliente para evitar datos erróneos y realizar el alta de forma atómica y segura en PostgreSQL usando Prisma.

## Estado
✅ **Completado** - Iteración 1

## Backend

### Endpoints

#### POST `/alumnos`
Recibe la información básica del estudiante y realiza la inserción. Verifica de forma anticipada la no existencia previa de la matrícula y del correo.

**Request:**
```json
{
  "matricula": "AL005678",
  "nombre": "María González López",
  "email": "maria.gonzalez@estudiante.es",
  "gradoId": "uuid-v4-grado"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid-v4-alumno",
  "usuarioId": "uuid-v4-usuario",
  "matricula": "AL005678",
  "gradoId": "uuid-v4-grado"
}
```

### Implementación
- **NestJS**: Decoradores `@Post()` y `@HttpCode(HttpStatus.CREATED)` en `AlumnosController`.
- **Transaccionalidad**: Creación atómica de `Usuario` y `Alumno` con `this.prisma.$transaction`.
- **Hasheo**: Encriptación automática de la contraseña por defecto (`alumno123`) mediante `bcrypt`.
- **Tratamiento de Nombre**: División del nombre completo en nombre y apellido de forma interna.

---

## Frontend

### Implementación
- **React**: Componente `CrearAlumnoView` estructurado con un formulario de captura, carga dinámica de grados, validaciones instantáneas y cuadros de confirmación.
- **Validaciones en cliente**:
  - Matrícula: Mínimo 8 caracteres, solo alfanumérico.
  - Nombre: Mínimo 3 caracteres.
  - Email: Formato de correo válido.
  - Combos: Selección de grado y curso obligatoria.

#### CrearAlumnoView Component
- Formulario modular en estilo Courier New con enfoque inicial automático en el primer campo.
- Dropdown cargado dinámicamente mediante `gradosService.findAll()`.
- Botones de acción "Crear alumno" (con popup nativo de confirmación) y "Cancelar" (con aviso de pérdida de datos).

#### alumnosService
- Método `create(data)`: Envía la petición `POST /alumnos`.

---

## Flujo de ejecución
1. El Administrador pulsa **➕ Crear nuevo** en `AlumnosView`.
2. Se navega a la ruta `/admin/alumnos/crear`.
3. El frontend recupera los grados disponibles para llenar el select.
4. El Administrador rellena los campos y pulsa **Crear alumno**.
5. Se validan los formatos; si son correctos, se muestra confirmación nativa.
6. El backend realiza las validaciones de unicidad, hashea la clave y persiste las entidades.
7. Se muestra alerta de éxito y se retorna a la lista principal.

## Notas de implementación
- La contraseña por defecto `alumno123` permite al estudiante acceder a la plataforma por primera vez.
