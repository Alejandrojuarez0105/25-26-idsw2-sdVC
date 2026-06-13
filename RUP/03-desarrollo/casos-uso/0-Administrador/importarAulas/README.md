# Davidario > importarAulas > Desarrollo

> |[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/importarAulas/importarAulas.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/importarAulas/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/importarAulas/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [aulas.controller.ts](/src/backend/src/modules/aulas/aulas.controller.ts) · [aulas.service.ts](/src/backend/src/modules/aulas/aulas.service.ts)
- **Frontend:** [ImportarAulasView.tsx](/src/frontend/src/features/admin/aulas/ImportarAulasView.tsx) · [aulas.service.ts](/src/frontend/src/services/aulas.service.ts)

## Descripción
Implementación de la funcionalidad de carga masiva de aulas mediante archivos CSV. El sistema permite al Administrador seleccionar un archivo local, validar su formato y contenido, y procesar la inserción de múltiples registros en una única operación coordinada entre el cliente y el servidor, manteniendo la coherencia visual y arquitectónica con los módulos de importación de grados y asignaturas.

## Estado
✅ **Completado** - Iteración 1

## Backend

### Endpoints

#### POST `/aulas/import`
Recibe una lista de objetos de aula y realiza la inserción masiva, validando la unicidad de cada código.

**Request:**
```json
[
  {
    "codigo": "-2.6",
    "nombre": "Laboratorio -2.6",
    "capacidad": "30",
    "ubicacion": "Planta -2"
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
- **NestJS**: Extensión del controlador `AulasController` existente con el método `import` mediante el decorador `@Post('import')`.
- **Prisma**: Uso de `prisma.aula.findUnique()` para validar unicidad y `prisma.aula.create()` dentro de un bucle controlado para gestionar errores individuales sin abortar la operación masiva.
- **Validación**: Comprobación de existencia previa por código para evitar colisiones de llaves únicas en la tabla `Aula`.

---

## Frontend

### Implementación
- **React**: Creación de `ImportarAulasView` como vista dedicada para la gestión de archivos, replicando el patrón estético y funcional de `ImportarGradosView` e `ImportarAsignaturasView`.
- **File API**: Uso de `FileReader` para procesar el contenido del CSV localmente antes de enviarlo a la API.
- **Fidelidad Visual**: Réplica exacta del estilo institucional (estilo Courier New, paneles de colores, botones de acción).

#### ImportarAulasView Component
- Implementa un selector de archivos filtrado por extensión `.csv`.
- Parser integrado para transformar líneas CSV en objetos JSON compatibles con el backend, extrayendo los campos: Código, Nombre, Capacidad y Ubicación.
- Gestión de estados de carga, éxito y error con feedback visual inmediato.
- Opción de validación de códigos duplicados y forzado de actualización.

#### aulasService
- Método `importAulas(data)`: Envía el array de objetos procesados al servidor vía `POST /aulas/import`.

---

## Flujo de ejecución
1. El Administrador hace clic en **📎 Importar aulas** en el listado principal de aulas.
2. El sistema navega a la vista **ImportarAulasView** en la ruta `/admin/aulas/importar`.
3. El Administrador selecciona un archivo CSV local mediante el botón **Examinar...**.
4. El frontend valida la extensión (`.csv`) y el tamaño del archivo.
5. Al pulsar **Importar aulas**, el sistema lee el archivo, lo parsea y envía los datos al backend.
6. El backend procesa cada registro, valida la unicidad del código e informa de los resultados (éxitos/fallos).
7. Se muestra un resumen final (alert) y feedback inline sobre el resultado, ofreciendo retorno al listado.

## Resultado obtenido
El Administrador puede cargar ramilletes de aulas de forma eficiente y segura. La implementación garantiza que los formatos sean correctos y proporciona una auditoría básica de los registros procesados, evitando la duplicidad de códigos de aula.

## Notas de implementación
- El parser CSV soporta delimitadores comunes (coma y punto y coma) mediante expresión regular `/[,;]/`.
- La capacidad se convierte a entero en el backend (`parseInt`), con valor por defecto 0 si el campo no se especifica.
- La ruta `/admin/aulas/importar` está registrada en `App.tsx` y vinculada desde `AulasView.tsx`.
- Se mantiene la consistencia con el esquema de base de datos PostgreSQL (tabla `Aula`) y la arquitectura NestJS + React.
