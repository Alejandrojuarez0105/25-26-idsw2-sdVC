# Davidario > importarProfesores > Desarrollo

> |[🏠️](/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/importarProfesores/importarProfesores.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/importarProfesores/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/importarProfesores/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [profesores.controller.ts](/src/backend/src/modules/profesores/profesores.controller.ts) · [profesores.service.ts](/src/backend/src/modules/profesores/profesores.service.ts)
- **Frontend:** [ImportarProfesoresView.tsx](/src/frontend/src/features/admin/profesores/ImportarProfesoresView.tsx) · [profesores.service.ts](/src/frontend/src/services/profesores.service.ts)

## Descripción
Implementación de la funcionalidad de carga masiva de profesores mediante archivos CSV. El sistema permite al Administrador seleccionar un archivo local con los docentes a registrar, validar su formato y procesar de manera segura y transaccional la creación de las credenciales de usuario y los perfiles de profesor en PostgreSQL a través de Prisma.

## Estado
✅ **Completado** - Iteración 1

## Backend

### Endpoints

#### POST `/profesores/import`
Recibe un listado de profesores parseados e inserta de forma individual cada uno dentro de una transacción Prisma. Valida la no existencia de correos y códigos duplicados antes de guardar, y genera automáticamente el código secuencial `PROF###` cuando el CSV no lo aporta.

**Request:**
```json
[
  {
    "codigo": "PROF010",
    "nombre": "Ana García",
    "apellido": "López",
    "email": "ana.garcia@uneatlantico.es",
    "departamento": "Informática"
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
- **NestJS**: Endpoint `@Post('import')` en `ProfesoresController` con `@HttpCode(HttpStatus.OK)`.
- **Bcrypt**: Encriptación automática de la contraseña por defecto (`profesor123`) para los accesos.
- **Transaccionalidad**: El servicio emplea `this.prisma.$transaction` para asegurar que el registro en `Usuario` y `Profesor` ocurra de manera atómica (ambos o ninguno).
- **Generación de Código**: Cálculo del siguiente código `PROF###` recorriendo los códigos existentes y obteniendo el máximo numérico, asegurando unicidad sin colisiones con los seeds del sistema (PROF000–PROF004).
- **Validación de Unicidad**: Comprobación de existencia previa por `email` (en `Usuario`) y por `codigo` (en `Profesor`) para evitar colisiones de llaves únicas.

---

## Frontend

### Implementación
- **React**: Componente `ImportarProfesoresView` siguiendo la interfaz de Courier New del prototipo, con cuadros informativos y estados dinámicos.
- **File API**: Carga y lectura asíncrona del archivo local CSV mediante `FileReader`.
- **CSV Parser**: Extracción de columnas del CSV (`codigo`, `nombre`, `apellido`, `email`, `departamento`) mediante delimitadores dinámicos (`,` o `;`) y autodetección de cabeceras.

#### ImportarProfesoresView Component
- Selector de archivos filtrado por `.csv` con validación de extensión y tamaño máximo (10 MB).
- Opciones interactivas de importación: "Validar emails únicos", "Generar contraseñas" y "Enviar email bienvenida".
- Resumen final del procesamiento mediante un cuadro de alerta nativo con métricas (procesados, éxitos, fallos) y feedback inline persistente con los primeros errores encontrados.

#### profesoresService
- Método `importProfesores(data)`: Envía la colección JSON del frontend a `POST /profesores/import`.

---

## Flujo de ejecución
1. El Administrador pulsa **📎 Importar profesores** en `ProfesoresListView`.
2. Se navega a la ruta `/admin/profesores/importar`.
3. El Administrador pulsa **Examinar...** y selecciona el archivo CSV.
4. Al pulsar **Importar profesores**, el frontend procesa el archivo y envía la información al backend.
5. El backend valida duplicados, hashea contraseñas, genera códigos `PROF###` cuando proceda y ejecuta las transacciones.
6. El Administrador recibe el resumen final (procesados, éxitos, fallos) y se redirige a la tabla principal.

## Resultado obtenido
El Administrador puede cargar ramilletes de profesores de forma eficiente y segura. La implementación garantiza la coherencia relacional entre `Usuario` y `Profesor`, evita duplicados de correo y código, y proporciona una auditoría básica de los registros procesados.

## Notas de implementación
- El parser CSV soporta delimitadores comunes (coma y punto y coma) mediante expresión regular `/[,;]/` y detecta automáticamente la presencia de cabeceras buscando términos como `codig`, `nomb`, `mail` o `depart` en la primera fila.
- Para garantizar la coherencia relacional, la creación del registro en la tabla `Profesor` requiere la existencia previa de su correspondiente cuenta en la tabla `Usuario`. La transacción de base de datos se encarga de enlazar ambas entidades mediante la clave `usuarioId`.
- El campo `departamento` es opcional; si no se aporta en el CSV, el profesor se registra con `null` en ese campo.
- La ruta `/admin/profesores/importar` está registrada en `App.tsx` y vinculada desde `ProfesoresListView.tsx`.
- No se modificó la estructura de la base de datos ni el archivo `database-setup.sql`; la implementación reutiliza por completo el esquema y los seeds existentes.
