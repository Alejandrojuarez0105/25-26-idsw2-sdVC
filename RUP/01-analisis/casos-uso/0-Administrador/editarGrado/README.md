<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/editarGrado/editarGrado.md)|**Análisis**|[Diseño](/RUP/02-diseño/casos-uso/0-Administrador/editarGrado/README.md)|[Desarrollo](/RUP/03-desarrollo/casos-uso/0-Administrador/editarGrado/README.md)|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > editarGrado > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.0
- **Fecha**: 25/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `editarGrado()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para cumplir con los requisitos de modificación de un grado académico existente.

## diagrama de colaboración

<div align=center>

|![Análisis: editarGrado()](/images/01-analisis/casos-uso/0-Administrador/editarGrado/editarGrado-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### EditarGradoView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar los datos actuales del grado para su edición.
- Capturar los nuevos datos ingresados por el administrador (código, nombre, descripción).
- Comunicar el éxito o error de la actualización.
- Manejar la navegación de retorno (finalizar edición o cancelar).

**Colaboraciones**:
- **Entrada**: Recibe `editarGrado(gradoId)` desde `:Grados Abierto` o `:Grado Abierto`.
- **Control**: Se comunica con `GradoController`.
- **Salida**: Navega a `:Grado Abierto` o `:Grados Abierto`.

### clases de control

#### GradoController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar el flujo de edición.
- Recuperar la entidad original mediante `GradoRepository`.
- Validar la unicidad del código modificado.
- Aplicar las actualizaciones y solicitar la persistencia.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `EditarGradoView`.
- **Repositorio**: Colabora con `GradoRepository` para validar unicidad y guardar el grado.

### clases de entidad (entity)

#### GradoRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Recuperar un grado por su identificador.
- Verificar si un código de grado ya existe para otro grado.
- Ejecutar la persistencia de las modificaciones.

#### Grado
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar el grado académico que está siendo modificado.

## flujo de colaboración

### secuencia de operaciones

1. **Solicitud**: `:Grados Abierto` → `EditarGradoView.editarGrado(gradoId)`
2. **Obtención**: `EditarGradoView` → `GradoController.solicitarEdicion(gradoId)` → `GradoRepository.buscarPorId(gradoId)`
3. **Actualización**: `EditarGradoView` → `GradoController.actualizar(gradoId, codigo, nombre, descripcion)`
4. **Validación**: `GradoController` → `GradoRepository.existeCodigo(codigo)`
5. **Persistencia**: `GradoController` → `GradoRepository.actualizar(grado)` → `Grado`
6. **Retorno**: 
   - Finalizar: `EditarGradoView` → `:Grados Abierto` (actualizado)
   - Cancelar: `EditarGradoView` → `:Grados Abierto`

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Mostrar datos actuales|`GradoController`|`solicitarEdicion(gradoId)`|
|Actualizar datos|`GradoController`|`actualizar(gradoId, codigo, nombre, descripcion)`|
|Validar unicidad|`GradoRepository`|`existeCodigo(codigo)`|
|Persistir cambios|`GradoRepository`|`actualizar(grado)`|

**Código fuente:** [colaboracion.puml](../../../../../modelosUML/01-analisis/casos-uso/0-Administrador/editarGrado/colaboracion.puml)

## referencias

- [Especificación detallada: editarGrado()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/editarGrado/editarGrado.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
