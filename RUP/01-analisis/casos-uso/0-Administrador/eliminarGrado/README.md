<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/eliminarGrado/eliminarGrado.md)|**Análisis**|[Diseño](/RUP/02-diseño/casos-uso/0-Administrador/eliminarGrado/README.md)|[Desarrollo](/RUP/03-desarrollo/casos-uso/0-Administrador/eliminarGrado/README.md)|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > eliminarGrado > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.0
- **Fecha**: 24/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `eliminarGrado()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para cumplir con los requisitos de eliminación de un registro de grado académico.

## diagrama de colaboración

<div align=center>

|![Análisis: eliminarGrado()](/images/01-analisis/casos-uso/0-Administrador/eliminarGrado/eliminarGrado-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### EliminarGradoView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar la confirmación para la eliminación de un grado específico.
- Capturar la confirmación del administrador.
- Comunicar el éxito o error tras la operación.
- Manejar la navegación de regreso a la vista de grados abiertos.

**Colaboraciones**:
- **Entrada**: Recibe `eliminarGrado(gradoId)` desde `:Grados Abierto`.
- **Control**: Se comunica con `GradoController`.
- **Salida**: Navega de regreso a `:Grados Abierto` tras finalizar o cancelar.
- **Control adicional**: Solicita validación de dependencias mediante `verificarAsignaturasAsociadas(gradoId)` en `GradoController`.

### clases de control

#### GradoController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar la lógica de eliminación.
- Validar dependencias (ej. verificar si el grado tiene asignaturas asociadas mediante `AsignaturaRepository`).
- Solicitar la eliminación al repositorio.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `EliminarGradoView`.
- **Vista (validación)**: Recibe llamadas de verificación mediante `verificarAsignaturasAsociadas(gradoId)` desde `EliminarGradoView`.
- **Repositorio**: Colabora con `AsignaturaRepository` para validaciones y con `GradoRepository` para la eliminación.

### clases de entidad (entity)

#### GradoRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Ejecutar la eliminación física o lógica del registro.

#### Grado
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar el grado a eliminar.

#### AsignaturaRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Proporcionar información sobre dependencias (asignaturas) para validación.

## flujo de colaboración

### secuencia de operaciones

1. **Solicitud**: `:Grados Abierto` → `EliminarGradoView.eliminarGrado(gradoId)`
2. **Confirmación**: `EliminarGradoView` → `GradoController.eliminarGrado(gradoId)`
3. **Validación**: `GradoController` → `AsignaturaRepository.contarPorGrado(gradoId)`
4. **Borrado**: `GradoController` → `GradoRepository.eliminar(gradoId)`
5. **Retorno**: `EliminarGradoView` → `:Grados Abierto` (finalizar o cancelar)

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Confirmar eliminación|`EliminarGradoView`|Captura acción de usuario|
|Ejecutar eliminación|`GradoRepository`|`eliminar(gradoId)`|

**Código fuente:** [colaboracion.puml](../../../../../modelosUML/01-analisis/casos-uso/0-Administrador/eliminarGrado/colaboracion.puml)

## referencias

- [Especificación detallada: eliminarGrado()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/eliminarGrado/eliminarGrado.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
