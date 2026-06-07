# Davidario > importarAlumnos > Desarrollo

> |[🏠️](/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/importarAlumnos/importarAlumnos.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/importarAlumnos/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/importarAlumnos/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [alumnos.controller.ts](/src/backend/src/modules/alumnos/alumnos.controller.ts) · [alumnos.service.ts](/src/backend/src/modules/alumnos/alumnos.service.ts)
- **Frontend:** [ImportarAlumnosView.tsx](/src/frontend/src/features/admin/alumnos/ImportarAlumnosView.tsx) · [alumnos.service.ts](/src/frontend/src/services/alumnos.service.ts)

## Descripción
Implementación de la funcionalidad de carga masiva de alumnos mediante archivos CSV. El sistema permite al Administrador seleccionar un archivo local con los estudiantes, validar su formato y procesar de manera segura y transaccional la creación de las credenciales de usuario y los perfiles académicos de los alumnos en PostgreSQL a través de Prisma.

## Estado
✅ **Completado** - Iteración 1

## Backend

### Endpoints

#### POST `/alumnos/import`
Recibe un listado de alumnos parseados e inserta de forma individual cada uno dentro de una transacción Prisma. Valida la no existencia de matrículas y correos duplicados antes de guardar.

**Request:**
```json
[
  {
    "matricula": "AL001234",
    "nombre": "Ana García López",
    "email": "ana.garcia@alumnos.uneatlantico.es",
    "grado": "GII"
  }
]
```

**Response (200 OK):**
```json
{
  "success": 1,
  "failed": 0,
  "errors": []
}
```

### Implementación
- **NestJS**: Endpoint `@Post('import')` en `AlumnosController`.
- **Bcrypt**: Encriptación automática de la contraseña por defecto (`alumno123`) para los accesos.
- **Transaccionalidad**: El servicio emplea `this.prisma.$transaction` para asegurar que el registro en `Usuario` y `Alumno` ocurra de manera atómica (ambos o ninguno).
- **Relaciones Dinámicas**: Búsqueda del grado correspondiente en base al código de grado (por ejemplo, `GII`, `INF`) de forma tolerante e insensible a mayúsculas/minúsculas.

---

## Frontend

### Implementación
- **React**: Componente `ImportarAlumnosView` siguiendo la interfaz de Courier New del prototipo, con cuadros informativos y estados dinámicos.
- **File API**: Carga y lectura asíncrona del archivo local CSV mediante `FileReader`.
- **CSV Parser**: Extracción de columnas del CSV (`matricula`, `nombre`, `email`, `grado`) mediante delimitadores dinámicos.

#### ImportarAlumnosView Component
- Selector de archivos filtrado por `.csv` y validación de tamaño máximo.
- Opciones interactivas de importación: "Validar matrículas únicas", "Curso por defecto (1°)" y "Crear usuarios acceso".
- Resumen final del procesamiento mediante un cuadro de alerta nativo con métricas.

#### alumnosService
- Método `importAlumnos(data)`: Envía la colección JSON del frontend a `POST /alumnos/import`.

---

## Flujo de ejecución
1. El Administrador pulsa **📎 Importar alumnos** en `AlumnosView`.
2. Se navega a la ruta `/admin/alumnos/importar`.
3. El Administrador pulsa **Examinar...** y selecciona el archivo CSV.
4. Al pulsar **Importar alumnos**, el frontend procesa el archivo y envía la información al backend.
5. El backend valida duplicados, hashea contraseñas, asocia grados y ejecuta las transacciones.
6. El Administrador recibe el resumen final (procesados, éxitos, fallos) y se redirige a la tabla principal.

## Notas de implementación
- Para garantizar la coherencia relacional, la creación del registro en la tabla `Alumno` requiere la existencia previa de su correspondiente cuenta en la tabla `Usuario`. La transacción de base de datos se encarga de enlazar ambas entidades mediante la clave `usuarioId`.
