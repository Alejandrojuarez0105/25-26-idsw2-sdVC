<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[🔍 Análisis](/RUP/01-analisis/casos-uso/0-Administrador/importarAulas/README.md)|**Diseño**|Implementación|Pruebas|
|-|-|-|-|-|-|

</div>

# Davidario > importarAulas > Diseño

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Diseño
- **Versión**: 1.0
- **Fecha**: 2026-06-06
- **Autor**: Alejandro Juárez

## propósito

Diseño técnico detallado del caso de uso `importarAulas()`. Define el mecanismo de carga masiva de datos para la infraestructura del centro, permitiendo procesar archivos CSV o datos estructurados y persistirlos de forma eficiente en PostgreSQL.

### Diagrama de secuencia de diseño

Interacción técnica entre las capas de presentación, lógica de negocio y persistencia.

<div align=center>

|![Diseño de Secuencia: importarAulas()](/images/02-diseño/casos-uso/0-Administrador/importarAulas/secuencia-diseño.svg)|
|-|
|[Código PlantUML](../../../../../modelosUML/02-diseño/casos-uso/0-Administrador/importarAulas/secuencia-diseño.puml)|

</div>

## especificación de componentes

### frontend (react)

#### ImportAulasView (Component)
- **Tecnología**: Functional Component (TSX).
- **Responsabilidad**: Interfaz para la selección de archivos y previsualización de datos a importar.
- **Hook**: Utiliza `useAulasImport()`.

#### useAulasImport (Hook)
- **Responsabilidad**: Gestionar el estado de la carga masiva y parsear el archivo CSV en el cliente.

#### AulasService (Service)
- **Responsabilidad**: Petición `POST /aulas/import`.

### backend (nestjs)

#### AulasController
- **Tecnología**: NestJS Controller.
- **Endpoint**: `POST /aulas/import`.
- **DTO**: Recibe `ImportAulaDTO[]`.

#### AulasService
- **Responsabilidad**: 
  - Validar duplicados de códigos antes de la inserción.
  - Utilizar el método `createMany` de Prisma para una inserción atómica y eficiente.

### base de datos (postgresql)

#### Aula (Entity)
- **Operación**: Inserción masiva de registros.

## trazabilidad con análisis

| Clase de Análisis | Clase/Componente de Diseño | Justificación Técnica |
|---|---|---|
| `ImportarAulasView` | `ImportAulasView (React)` | Componente para capturar los datos externos. |
| `AulasController` | `AulasController (NestJS)` | Endpoint para recibir el batch de datos. |
| `AulaRepository` | `AulasService (NestJS)` | Lógica de inserción masiva. |

## referencias

- [Análisis: importarAulas()](/RUP/01-analisis/casos-uso/0-Administrador/importarAulas/README.md)
- [Configuración del Proyecto](/RUP/02-diseño/configuración-proyecto.md)
- [Diagrama de Contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Diagramas de Clases](/images/02-diseño/clases-diseño.svg) - Diseño Global
- [AGENTES.md](/AGENTES.md) - Protocolos de diseño
