<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/crearExamen/crearExamen.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > crearExamen > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.0
- **Fecha**: 25/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `crearExamen()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para cumplir con los requisitos de creación de un nuevo examen.

## diagrama de colaboración

<div align=center>

|![Análisis: crearExamen()](/images/01-analisis/casos-uso/0-Administrador/crearExamen/crearExamen-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### CrearExamenView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar el formulario de creación de exámenes.
- Capturar los datos del nuevo examen ingresados por el administrador.
- Mostrar mensajes de validación y éxito.
- Manejar la navegación de regreso a la vista de gestión.

**Colaboraciones**:
- **Entrada**: Recibe `crearExamen()` desde `:Examenes Abierto`.
- **Control**: Se comunica con `ExamenController`.
- **Salida**: Navega a `:Examen Abierto` tras finalizar o a `:Examenes Abierto` tras cancelar.

### clases de control

#### ExamenController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar el flujo de creación.
- Validar los datos del formulario antes de persistirlos.
- Solicitar la creación al repositorio.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `CrearExamenView`.
- **Repositorio**: Delega la persistencia a `ExamenRepository`.

### clases de entidad (entity)

#### ExamenRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Ejecutar la persistencia del nuevo objeto examen.

#### Examen
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar el nuevo examen a crear.

## flujo de colaboración

### secuencia de operaciones

1. **Solicitud**: `:Examenes Abierto` → `CrearExamenView.crearExamen()`
2. **Formulario**: `CrearExamenView` → `ExamenController.crear(codigo, fechaHora, duracion, asignatura)`
3. **Guardado**: `CrearExamenView` → `ExamenController.guardar(examen)`
4. **Persistencia**: `ExamenController` → `ExamenRepository.guardar(examen)`
5. **Instanciación**: `ExamenRepository` → `Examen`
6. **Retorno**: 
   - Finalizar: `CrearExamenView` → `:Examen Abierto`
   - Cancelar: `CrearExamenView` → `:Examenes Abierto`

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Capturar datos|`CrearExamenView`|Formulario de entrada|
|Validar y persistir|`ExamenController`|`guardar(examen)`|
|Persistir registro|`ExamenRepository`|`guardar(examen)`|

**Código fuente:** [colaboracion.puml](../../../../../modelosUML/01-analisis/casos-uso/0-Administrador/crearExamen/colaboracion.puml)

## referencias

- [Especificación detallada: crearExamen()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/crearExamen/crearExamen.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
