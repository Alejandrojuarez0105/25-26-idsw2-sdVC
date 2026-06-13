<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/editarProfesor/editarProfesor.md)|**Análisis**|[Diseño](/RUP/02-diseño/casos-uso/0-Administrador/editarProfesor/README.md)|[Desarrollo](/RUP/03-desarrollo/casos-uso/0-Administrador/editarProfesor/README.md)|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > editarProfesor > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.1
- **Fecha**: 30/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `editarProfesor()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para cumplir con los requisitos de modificación de un profesor existente.

## diagrama de colaboración

<div align=center>

|![Análisis: editarProfesor()](/images/01-analisis/casos-uso/0-Administrador/editarProfesor/editarProfesor-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### EditarProfesorView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar los datos actuales del profesor para su edición.
- Capturar los nuevos datos (nombre, email, departamento).
- Manejar la navegación tras la actualización exitosa o cancelación.

**Colaboraciones**:
- **Entrada**: Recibe `editarProfesor(profesorId)` desde `:Profesores Abierto` o `:Profesor Abierto`.
- **Control**: Se comunica con `ProfesorController`.
- **Salida**: Navega de regreso a `:Profesores Abierto`.

### clases de control

#### ProfesorController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar el flujo de edición y recuperación de datos.
- Validar la unicidad del correo electrónico modificado.
- Aplicar las actualizaciones y solicitar la persistencia al repositorio.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `EditarProfesorView`.
- **Repositorio**: Colabora con `ProfesorRepository` para validación y persistencia.

### clases de entidad (entity)

#### ProfesorRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Recuperar un profesor por su identificador (`buscarPorId`).
- Verificar si un email ya existe para otro profesor (`existeCorreo`).
- Ejecutar la persistencia de las modificaciones (`actualizar`).

**Colaboraciones**:
- **Control**: Responde a `ProfesorController`.
- **Entidad**: Gestiona e interactúa con `Profesor`.

#### Profesor
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar al profesor que está siendo modificado.
- Encapsular la actualización de atributos (`<<update>>`).

**Colaboraciones**:
- **Repositorio**: Es gestionado por `ProfesorRepository`.

## flujo de colaboración

### secuencia de operaciones

1. **Solicitud**: `:Profesores Abierto` → `EditarProfesorView.editarProfesor(profesorId)`
2. **Obtención**: `EditarProfesorView` → `ProfesorController.solicitarEdicion(profesorId)` → `ProfesorRepository.buscarPorId(profesorId)`
3. **Estado**: `:Profesor Abierto` mantiene el estado de edición.
4. **Actualización**: `EditarProfesorView` → `ProfesorController.actualizar(nombre, email, departamento)`
5. **Validación**: `ProfesorController` → `ProfesorRepository.existeCorreo(correo) : Boolean`
6. **Persistencia**: `ProfesorController` → `ProfesorRepository.actualizar(profesor)` → `Profesor` (`<<update>>`)
7. **Retorno**: 
   - Finalizar: `EditarProfesorView` → `:Profesores Abierto` (abrirProfesores)
   - Cancelar: `EditarProfesorView` → `:Profesores Abierto`

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Mostrar datos actuales|`ProfesorController`|`solicitarEdicion(profesorId)`|
|Actualizar datos técnicos|`ProfesorController`|`actualizar(nombre, email, departamento)`|
|Validar unicidad de email|`ProfesorRepository`|`existeCorreo(correo)`|
|Persistir cambios|`ProfesorRepository`|`actualizar(profesor)`|

**Código fuente:** [colaboracion.puml](../../../../../modelosUML/01-analisis/casos-uso/0-Administrador/editarProfesor/colaboracion.puml)

## referencias

- [Especificación detallada: editarProfesor()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/editarProfesor/editarProfesor.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
