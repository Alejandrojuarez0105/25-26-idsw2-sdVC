<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/eliminarAula/eliminarAula.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > eliminarAula > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.1
- **Fecha**: 28/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `eliminarAula()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para cumplir con los requisitos de eliminación de un registro de aula.

## diagrama de colaboración

<div align=center>

|![Análisis: eliminarAula()](/images/01-analisis/casos-uso/0-Administrador/eliminarAula/eliminarAula-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### EliminarAulaView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar la confirmación para la eliminación de un aula específica.
- Capturar la confirmación del administrador.
- Mostrar advertencias en caso de dependencias existentes.
- Manejar la navegación de regreso a la vista de gestión.

**Colaboraciones**:
- **Entrada**: Recibe `eliminarAula(aulaId)` desde `:Aulas Abierto`.
- **Control**: Se comunica con `AulaController`.
- **Salida**: Navega de regreso a `:Aulas Abierto`.

### clases de control

#### AulaController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar la lógica de eliminación.
- Validar dependencias (ej. verificar si el aula tiene exámenes asociados mediante `ExamenRepository`).
- Notificar a la vista sobre advertencias de dependencias.
- Solicitar la eliminación al repositorio.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `EliminarAulaView` y notifica advertencias.
- **Repositorio**: Colabora con `ExamenRepository` para validaciones y con `AulaRepository` para la eliminación.

### clases de entidad (entity)

#### AulaRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Ejecutar la eliminación del registro.

#### Aula
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar el aula a eliminar.

#### ExamenRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Proporcionar información sobre dependencias (exámenes) para validación.

## flujo de colaboración

### secuencia de operaciones

1. **Solicitud**: `:Aulas Abierto` → `EliminarAulaView.eliminarAula(aulaId)`
2. **Confirmación**: `EliminarAulaView` → `AulaController.confirmarEliminacion(aulaId)`
3. **Validación**: `AulaController` → `ExamenRepository.contarPorAula(aulaId)`
4. **Advertencia (si aplica)**: `AulaController` → `EliminarAulaView.mostrarAdvertencia()`
5. **Borrado**: `AulaController` → `AulaRepository.eliminar(aulaId)`
6. **Retorno**: `EliminarAulaView` → `:Aulas Abierto` (finalizar o cancelar)

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Confirmar eliminación|`EliminarAulaView`|Captura acción de usuario|
|Validar dependencias|`ExamenRepository`|`contarPorAula(aulaId)`|
|Notificar riesgos|`AulaController`|`mostrarAdvertencia()`|
|Ejecutar eliminación|`AulaRepository`|`eliminar(aulaId)`|

**Código fuente:** [colaboracion.puml](../../../../../modelosUML/01-analisis/casos-uso/0-Administrador/eliminarAula/colaboracion.puml)

## referencias

- [Especificación detallada: eliminarAula()](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/3-CasosDeUsoComunes/eliminarAula.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
