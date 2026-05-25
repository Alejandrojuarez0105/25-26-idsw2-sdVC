<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/editarAsignatura/editarAsignatura.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > editarAsignatura > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.0
- **Fecha**: 25/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `editarAsignatura()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para cumplir con los requisitos de modificación de una asignatura académica existente.

## diagrama de colaboración

<div align=center>

|![Análisis: editarAsignatura()](/images/01-analisis/casos-uso/editarAsignatura/editarAsignatura-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### EditarAsignaturaView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar los datos actuales de la asignatura para su edición.
- Capturar los nuevos datos (código, nombre, créditos, grado) ingresados por el administrador.
- Comunicar el éxito o error de la actualización.
- Manejar la navegación de retorno (finalizar edición o cancelar).

**Colaboraciones**:
- **Entrada**: Recibe `editarAsignatura(asignaturaId)` desde `:Asignaturas Abierto`.
- **Control**: Se comunica con `AsignaturaController`.
- **Salida**: Navega a `:Asignatura Abierta` tras finalizar o a `:Asignaturas Abierto` tras cancelar.

### clases de control

#### AsignaturaController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar el flujo de edición.
- Recuperar la entidad original mediante `AsignaturaRepository`.
- Validar la unicidad del código modificado.
- Aplicar las actualizaciones y solicitar la persistencia de cambios.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `EditarAsignaturaView`.
- **Repositorio**: Colabora con `AsignaturaRepository` para validar unicidad y actualizar la asignatura.

### clases de entidad (entity)

#### AsignaturaRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Recuperar una asignatura por su identificador.
- Verificar si un código de asignatura ya existe.
- Ejecutar la persistencia de las modificaciones.

#### Asignatura
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar la asignatura académica que está siendo modificada.

## flujo de colaboración

### secuencia de operaciones

1. **Solicitud**: `:Asignaturas Abierto` → `EditarAsignaturaView.editarAsignatura(asignaturaId)`
2. **Obtención**: `EditarAsignaturaView` → `AsignaturaController.solicitarEdicion(asignaturaId)` → `AsignaturaRepository.buscarPorId(asignaturaId)`
3. **Actualización**: `EditarAsignaturaView` → `AsignaturaController.actualizar(asignaturaId, codigo, nombre, creditos, grado)`
4. **Validación**: `AsignaturaController` → `AsignaturaRepository.existeCodigo(codigo)`
5. **Persistencia**: `AsignaturaController` → `AsignaturaRepository.actualizar(asignatura)` → `Asignatura` (<<update>>)
6. **Retorno**: 
   - Finalizar: `EditarAsignaturaView` → `:Asignaturas Abierto` (abrirAsignaturas())
   - Cancelar: `EditarAsignaturaView` → `:Asignaturas Abierto`

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Mostrar datos actuales|`AsignaturaController`|`solicitarEdicion(asignaturaId)`|
|Actualizar datos|`AsignaturaController`|`actualizar(asignaturaId, codigo, nombre, creditos, grado)`|
|Validar unicidad|`AsignaturaRepository`|`existeCodigo(codigo)`|
|Persistir cambios|`AsignaturaRepository`|`actualizar(asignatura)`|

**Código fuente:** [colaboracion.puml](../../../../modelosUML/01-analisis/casos-uso/editarAsignatura/colaboracion.puml)

## referencias

- [Especificación detallada: editarAsignatura()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/editarAsignatura/editarAsignatura.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
