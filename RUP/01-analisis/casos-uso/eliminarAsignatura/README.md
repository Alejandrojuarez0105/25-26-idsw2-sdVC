<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/eliminarAsignatura/eliminarAsignatura.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > eliminarAsignatura > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.0
- **Fecha**: 25/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `eliminarAsignatura()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para cumplir con los requisitos de eliminación de una asignatura existente.

## diagrama de colaboración

<div align=center>

|![Análisis: eliminarAsignatura()](/images/01-analisis/casos-uso/eliminarAsignatura/eliminarAsignatura-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### EliminarAsignaturaView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar la confirmación para la eliminación de una asignatura específica.
- Capturar la confirmación del administrador.
- Mostrar advertencias si la asignatura tiene exámenes asociados.
- Comunicar el éxito o error tras la operación.
- Manejar la navegación de regreso a la vista de gestión.

**Colaboraciones**:
- **Entrada**: Recibe `eliminarAsignatura(asignaturaId)` desde `:Asignaturas Abierto`.
- **Control**: Se comunica con `AsignaturaController`.
- **Salida**: Navega de regreso a `:Asignaturas Abierto`.

### clases de control

#### AsignaturaController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar la lógica de eliminación.
- Validar dependencias (ej. verificar exámenes asociados mediante `ExamenRepository`).
- Solicitar la eliminación al repositorio.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `EliminarAsignaturaView`.
- **Repositorio**: Colabora con `ExamenRepository` para validaciones y con `AsignaturaRepository` para la eliminación.

### clases de entidad (entity)

#### AsignaturaRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Ejecutar la eliminación física o lógica del registro.

#### ExamenRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Verificar si existen exámenes asociados a la asignatura para validación.

#### Asignatura
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar la asignatura a eliminar.

## flujo de colaboración

### secuencia de operaciones

1. **Solicitud**: `:Asignaturas Abierto` → `EliminarAsignaturaView.eliminarAsignatura(asignaturaId)`
2. **Confirmación**: `EliminarAsignaturaView` → `AsignaturaController.confirmarEliminacion(asignaturaId)`
3. **Validación**: `AsignaturaController` → `ExamenRepository.contarPorAsignatura(asignaturaId)`
4. **Advertencia**: `AsignaturaController` → `EliminarAsignaturaView.mostrarAdvertencia()`
5. **Borrado**: `AsignaturaController` → `AsignaturaRepository.eliminar(asignaturaId)`
6. **Retorno**: `EliminarAsignaturaView` → `:Asignaturas Abierto` (finalizar o cancelar)

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Confirmar eliminación|`EliminarAsignaturaView`|Captura acción de usuario|
|Ejecutar eliminación|`AsignaturaRepository`|`eliminar(asignaturaId)`|

**Código fuente:** [colaboracion.puml](../../../../modelosUML/01-analisis/casos-uso/eliminarAsignatura/colaboracion.puml)

## referencias

- [Especificación detallada: eliminarAsignatura()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/eliminarAsignatura/eliminarAsignatura.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
