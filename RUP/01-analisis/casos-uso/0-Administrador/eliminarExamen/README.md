<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/eliminarExamen/eliminarExamen.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > eliminarExamen > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.0
- **Fecha**: 25/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `eliminarExamen()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para cumplir con los requisitos de eliminación de un examen existente.

## diagrama de colaboración

<div align=center>

|![Análisis: eliminarExamen()](/images/01-analisis/casos-uso/0-Administrador/eliminarExamen/eliminarExamen-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### EliminarExamenView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar la confirmación para la eliminación de un examen específico.
- Capturar la confirmación del administrador.
- Comunicar el éxito o error tras la operación.
- Manejar la navegación de regreso a la vista de gestión.

**Colaboraciones**:
- **Entrada**: Recibe `eliminarExamen(examenId)` desde `:Examenes Abierto`.
- **Control**: Se comunica con `ExamenController`.
- **Salida**: Navega de regreso a `:Examenes Abierto`.

### clases de control

#### ExamenController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar la lógica de eliminación.
- Validar si el examen puede ser eliminado (según restricciones de dominio).
- Solicitar la eliminación al repositorio.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `EliminarExamenView`.
- **Repositorio**: Colabora con `ExamenRepository` para la eliminación.

### clases de entidad (entity)

#### ExamenRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Ejecutar la eliminación física o lógica del registro.

#### Examen
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar el examen a eliminar.

## flujo de colaboración

### secuencia de operaciones

1. **Solicitud**: `:Examenes Abierto` → `EliminarExamenView.eliminarExamen(examenId)`
2. **Confirmación**: `EliminarExamenView` → `ExamenController.confirmarEliminacion(examenId)`
3. **Borrado**: `ExamenController` → `ExamenRepository.eliminar(examenId)`
4. **Retorno**: `EliminarExamenView` → `:Examenes Abierto` (finalizar o cancelar)

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Confirmar eliminación|`EliminarExamenView`|Captura acción de usuario|
|Ejecutar eliminación|`ExamenRepository`|`eliminar(examenId)`|

**Código fuente:** [colaboracion.puml](../../../../../modelosUML/01-analisis/casos-uso/0-Administrador/eliminarExamen/colaboracion.puml)

## referencias

- [Especificación detallada: eliminarExamen()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/eliminarExamen/eliminarExamen.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
