<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/crearAsignatura/crearAsignatura.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > crearAsignatura > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.0
- **Fecha**: 25/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `crearAsignatura()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para cumplir con los requisitos de creación de una nueva asignatura académica.

## diagrama de colaboración

<div align=center>

|![Análisis: crearAsignatura()](/images/01-analisis/casos-uso/0-Administrador/crearAsignatura/crearAsignatura-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### CrearAsignaturaView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar el formulario de creación de asignaturas.
- Capturar los datos (código, nombre, créditos, grado) ingresados por el administrador.
- Comunicar el éxito o error tras la operación.
- Manejar la navegación de regreso a la vista de gestión o a la edición de la nueva asignatura.

**Colaboraciones**:
- **Entrada**: Recibe `crearAsignatura()` desde `:Asignaturas Abierto`.
- **Control**: Se comunica con `AsignaturaController`.
- **Salida**: Navega a `:Asignatura Abierta` tras finalizar o a `:Asignaturas Abierto` tras cancelar.

### clases de control

#### AsignaturaController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar la lógica de creación.
- Validar la unicidad del código mediante `AsignaturaRepository`.
- Instanciar la nueva `Asignatura` y solicitar su persistencia.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `CrearAsignaturaView`.
- **Repositorio**: Colabora con `AsignaturaRepository` para validar unicidad y guardar la nueva asignatura.

### clases de entidad (entity)

#### AsignaturaRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Verificar si un código de asignatura ya existe.
- Ejecutar la persistencia del nuevo registro.

#### Asignatura
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar la nueva asignatura académica a crear.

## flujo de colaboración

### secuencia de operaciones

1. **Solicitud**: `:Asignaturas Abierto` → `CrearAsignaturaView.crearAsignatura()`
2. **Creación**: `CrearAsignaturaView` → `AsignaturaController.crear(codigo, nombre, creditos, grado)`
3. **Validación**: `AsignaturaController` → `AsignaturaRepository.existeCodigo(codigo)`
4. **Instanciación**: `AsignaturaController` → `Asignatura`
5. **Persistencia**: `AsignaturaController` → `AsignaturaRepository.guardar(asignatura)`
6. **Retorno**: 
   - Finalizar: `CrearAsignaturaView` → `:Asignatura Abierta`
   - Cancelar: `CrearAsignaturaView` → `:Asignaturas Abierto`

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Capturar datos|`CrearAsignaturaView`|Formulario de entrada|
|Validar y persistir|`AsignaturaController`|`guardarAsignatura(datos)`|
|Persistir registro|`AsignaturaRepository`|`guardar(datos)`|

**Código fuente:** [colaboracion.puml](../../../../../modelosUML/01-analisis/casos-uso/0-Administrador/crearAsignatura/colaboracion.puml)

## referencias

- [Especificación detallada: crearAsignatura()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/crearAsignatura/crearAsignatura.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
