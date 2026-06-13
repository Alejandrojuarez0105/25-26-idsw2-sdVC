# Davidario > importarAsignaturas > Desarrollo

> |[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/importarAsignaturas/importarAsignaturas.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/importarAsignaturas/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/0-Administrador/importarAsignaturas/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [asignaturas.controller.ts](/src/backend/src/modules/asignaturas/asignaturas.controller.ts) · [asignaturas.service.ts](/src/backend/src/modules/asignaturas/asignaturas.service.ts)
- **Frontend:** [ImportarAsignaturasView.tsx](/src/frontend/src/features/admin/asignaturas/ImportarAsignaturasView.tsx) · [asignaturas.service.ts](/src/frontend/src/services/asignaturas.service.ts)

## Descripción
Implementación de la funcionalidad de carga masiva de asignaturas académicas mediante archivos CSV. El sistema permite al Administrador importar ramilletes de materias, validando automáticamente la existencia de los grados asociados y evitando duplicidad de códigos, manteniendo la coherencia visual con el módulo de importación de grados.

## Estado
✅ **Completado** - Iteración 1

## Backend

### Endpoints

#### POST `/asignaturas/import`
Recibe una lista de objetos de asignatura, valida la integridad referencial con la entidad Grado y realiza la inserción masiva.

**Request:**
```json
[
  {
    "codigo": "IYA003",
    "nombre": "Programación I",
    "creditos": 6,
    "gradoCodigo": "INF"
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
- **NestJS**: Extensión del controlador con el endpoint `import`.
- **Prisma**: Uso de consultas anidadas y validaciones de clave foránea manuales para asegurar que cada asignatura se vincule a un Grado existente.
- **Lógica de Negocio**: Gestión de errores por registro para permitir importaciones parciales exitosas.

---

## Frontend

### Implementación
- **React**: Creación de `ImportarAsignaturasView` reutilizando el patrón estético y funcional de `importarGrados`.
- **File API**: Lectura y parseo de archivos CSV en el cliente.
- **Fidelidad Visual**: Réplica exacta del prototipo (estilo Courier New, paneles sombreados, feedback de validación).

#### ImportarAsignaturasView Component
- Selector de archivos especializado en `.csv`.
- Parser reactivo que extrae Código, Nombre, Créditos y el Código del Grado.
- Presentación de estadísticas de resultados (Éxito vs Fallidos).

#### asignaturasService
- Método `importAsignaturas(data)`: Envía el array de objetos técnicos al backend.

---

## Flujo de ejecución
1. El Administrador hace clic en **📎 Importar asignaturas** desde el listado.
2. El sistema navega a la vista **ImportarAsignaturasView**.
3. El Administrador carga un archivo CSV con la estructura requerida.
4. El sistema valida localmente el archivo y habilita el botón de importación.
5. Se envían los datos al backend, donde se verifica la existencia de los Grados y la unicidad de los códigos.
6. El sistema muestra un resumen detallado del proceso y refresca el listado tras el retorno.

## Resultado obtenido
El proceso de carga masiva es estable y seguro. La integración relacional garantiza que no se creen asignaturas huérfanas y proporciona una auditoría clara sobre los fallos detectados (ej. grados inexistentes).

## Notas de implementación
- Se ha configurado una opción de "Créditos por defecto (6)" que se aplica si el campo no viene especificado en el CSV.
- El sistema informa individualmente sobre cada fallo detectado en el ramillete procesado.
