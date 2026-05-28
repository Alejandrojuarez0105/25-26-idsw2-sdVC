<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/editarAula/editarAula.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > editarAula > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.1
- **Fecha**: 28/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `editarAula()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para cumplir con los requisitos de modificación de un aula existente.

## diagrama de colaboración

<div align=center>

|![Análisis: editarAula()](/images/01-analisis/casos-uso/editarAula/editarAula-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### EditarAulaView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar los datos actuales del aula para su edición.
- Capturar los nuevos datos (nombre, capacidad, edificio, planta, tipo).
- Manejar la navegación tras la actualización o cancelación.

**Colaboraciones**:
- **Entrada**: Recibe `editarAula(aulaId)` desde `:Aulas Abierto` o `:Aula Abierta`.
- **Control**: Se comunica con `AulaController`.
- **Salida**: Navega de regreso a `:Aulas Abierto`.

### clases de control

#### AulaController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar el flujo de edición y recuperación de datos.
- Validar la unicidad del nombre modificado.
- Aplicar las actualizaciones y solicitar la persistencia al repositorio.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `EditarAulaView`.
- **Repositorio**: Colabora con `AulaRepository` para validación y persistencia.

### clases de entidad (entity)

#### AulaRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Recuperar un aula por su identificador.
- Verificar si un nombre de aula ya existe para otra aula.
- Ejecutar la persistencia de las modificaciones.

#### Aula
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar el aula que está siendo modificada.

## flujo de colaboración

### secuencia de operaciones

1. **Solicitud**: `:Aulas Abierto` → `EditarAulaView.editarAula(aulaId)`
2. **Obtención**: `EditarAulaView` → `AulaController.solicitarEdicion(aulaId)` → `AulaRepository.buscarPorId(aulaId)`
3. **Actualización**: `EditarAulaView` → `AulaController.actualizar(nombre, capacidad, edificio, planta, tipo)`
4. **Validación**: `AulaController` → `AulaRepository.existeNombre(nombre) : Boolean`
5. **Persistencia**: `AulaController` → `AulaRepository.actualizar(aula)` → `Aula`
6. **Retorno**: 
   - Finalizar: `EditarAulaView` → `:Aulas Abierto` (abrirAulas)
   - Cancelar: `EditarAulaView` → `:Aulas Abierto`

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Mostrar datos actuales|`AulaController`|`solicitarEdicion(aulaId)`|
|Actualizar datos|`AulaController`|`actualizar(nombre, capacidad, edificio, planta, tipo)`|
|Validar unicidad|`AulaRepository`|`existeNombre(nombre)`|
|Persistir cambios|`AulaRepository`|`actualizar(aula)`|

**Código fuente:** [colaboracion.puml](../../../../modelosUML/01-analisis/casos-uso/editarAula/colaboracion.puml)

## referencias

- [Especificación detallada: editarAula()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/editarAula/editarAula.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
