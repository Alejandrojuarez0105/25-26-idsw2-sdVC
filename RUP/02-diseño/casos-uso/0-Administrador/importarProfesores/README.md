<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/importarProfesores/README.md)|**Diseño**|[Implementación](/RUP/03-desarrollo/casos-uso/0-Administrador/importarProfesores/README.md)|Pruebas|
|---|---|---|---|---|---|

</div>

# Davidario > importarProfesores > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-07
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `importarProfesores()`. Define la vista de importación de archivos CSV, la estructura del parser y subida en React Hook, y la definición del endpoint de inserción transaccional masiva multipart en NestJS.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: importarProfesores()](/images/02-diseño/casos-uso/0-Administrador/importarProfesores/secuencia-diseño.svg)|
|---|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/importarProfesores/secuencia-diseño.puml)|

</div>

## especificación de componentes

### frontend (react)

#### ImportarProfesoresView (Component)
- **Tecnología**: Functional Component (TSX).
- **Responsabilidad**: Presentar la interfaz de selección de archivos CSV y mostrar los resultados/errores. Delega la subida al Hook.

#### useProfesoresImport (Hook)
- **Responsabilidad**: Gestionar el estado de la subida del archivo y llamar al servicio (`importProfesores`).
- **Métodos**: `importProfesores(file)`.

#### profesoresService (Service)
- **Responsabilidad**: Enviar la petición `POST /profesores/import` utilizando `Multipart/Form-Data` conteniendo el archivo CSV (`importProfesores`).

### backend (nestjs)

#### ProfesoresController
- **Tecnología**: NestJS Controller.
- **Endpoint**: `POST /profesores/import` (Multipart/Form-Data).
- **Responsabilidad**: Interceptar la subida del archivo CSV y delegar la carga masiva.

#### ProfesoresService
- **Responsabilidad**:
  - `importProfesores(lote)`: Iterar sobre el lote parsed de profesores, comprobar si el correo electrónico ya existe en la base de datos y realizar las inserciones atómicas en una transacción Prisma. Retorna `ImportResultDTO` con el reporte de éxitos y fallos.

### base de datos (postgresql)

#### Profesor & Usuario (Entities)
- **Operación**: Inserción transaccional por lotes (`INSERT INTO`).

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `ImportarProfesoresView` | `ImportarProfesoresView (React)` | Componente de subida de archivos en cliente. |
| `ImportarProfesoresView` | `useProfesoresImport (React Hook)` | Hook para manejo de estado y petición multipart. |
| `ProfesorController` | `ProfesoresController (NestJS)` | Controlador REST encargado de la importación masiva. |
| `ProfesorRepository` | `ProfesoresService (NestJS)` | Lógica transaccional de validación y guardado masivo. |
| `Profesor` | `Profesor (Entity)` | Entidades creadas en base de datos. |

## referencias

- [Análisis: importarProfesores()](/RUP/01-analisis/casos-uso/0-Administrador/importarProfesores/README.md)
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Diagramas de Clases](/images/02-diseño/clases-diseño.svg) - Diseño Global
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
