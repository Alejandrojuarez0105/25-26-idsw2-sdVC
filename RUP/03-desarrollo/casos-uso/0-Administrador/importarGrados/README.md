# Davidario > importarGrados > Desarrollo

> |[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/importarGrados/importarGrados.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/importarGrados/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/importarGrados/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [grados.controller.ts](/src/backend/src/modules/grados/grados.controller.ts) · [grados.service.ts](/src/backend/src/modules/grados/grados.service.ts)
- **Frontend:** [ImportarGradosView.tsx](/src/frontend/src/features/admin/grados/ImportarGradosView.tsx) · [grados.service.ts](/src/frontend/src/services/grados.service.ts)

## Descripción
Implementación de la funcionalidad de carga masiva de grados académicos mediante archivos CSV. El sistema permite al Administrador seleccionar un archivo local, validar su formato y contenido, y procesar la inserción de múltiples registros en una única operación coordinada entre el cliente y el servidor.

## Estado
✅ **Completado** - Iteración 1

## Backend

### Endpoints

#### POST `/grados/import`
Recibe una lista de objetos de grado y realiza la inserción masiva, validando la unicidad de cada código.

**Request:**
```json
[
  {
    "codigo": "GII",
    "nombre": "Ingeniería Informática",
    "descripcion": "Descripción opcional"
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
- **NestJS**: Extensión del controlador existente con el método `import`.
- **Prisma**: Uso de `this.prisma.grado.create()` dentro de un bucle controlado para gestionar errores individuales sin abortar la operación masiva.
- **Validación**: Comprobación de existencia previa por código para evitar colisiones de llaves únicas.

---

## Frontend

### Implementación
- **React**: Creación de `ImportarGradosView` como vista dedicada para la gestión de archivos.
- **File API**: Uso de `FileReader` para procesar el contenido del CSV localmente antes de enviarlo a la API.
- **Fidelidad Visual**: Réplica exacta del prototipo institucional (estilo Courier New, paneles de colores, botones de acción).

#### ImportarGradosView Component
- Implementa un selector de archivos filtrado por extensión `.csv`.
- Parser integrado para transformar líneas CSV en objetos JSON compatibles con el backend.
- Gestión de estados de carga, éxito y error con feedback visual inmediato.

#### gradosService
- Método `importGrados(data)`: Envía el array de objetos procesados al servidor.

---

## Flujo de ejecución
1. El Administrador hace clic en **📎 Importar grados** en el listado principal.
2. El sistema navega a la vista **ImportarGradosView**.
3. El Administrador selecciona un archivo CSV local mediante el botón **Examinar...**.
4. El frontend valida la extensión y el tamaño del archivo.
5. Al pulsar **Importar grados**, el sistema lee el archivo, lo parsea y envía los datos al backend.
6. El backend procesa cada registro e informa de los resultados (éxitos/fallos).
7. Se muestra un resumen final y se ofrece el retorno al listado.

## Resultado obtenido
El Administrador puede cargar ramilletes de grados académicos de forma eficiente. La implementación garantiza que los formatos sean correctos y proporciona una auditoría básica de los registros procesados.

## Notas de implementación
- El parser CSV soporta delimitadores comunes (coma y punto y coma).
- Se mantiene la consistencia con el esquema de base de datos PostgreSQL y la arquitectura NestJS + React.
