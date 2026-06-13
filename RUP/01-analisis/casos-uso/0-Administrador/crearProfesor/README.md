<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/crearProfesor/crearProfesor.md)|**Análisis**|[Diseño](/RUP/02-diseño/casos-uso/0-Administrador/crearProfesor/README.md)|[Desarrollo](/RUP/03-desarrollo/casos-uso/0-Administrador/crearProfesor/README.md)|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > crearProfesor > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.1
- **Fecha**: 30/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `crearProfesor()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para cumplir con los requisitos de creación de un nuevo profesor.

## diagrama de colaboración

<div align=center>

|![Análisis: crearProfesor()](/images/01-analisis/casos-uso/0-Administrador/crearProfesor/crearProfesor-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### CrearProfesorView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar el formulario de creación de profesores.
- Capturar los datos técnicos (código, nombre, email, departamento) ingresados por el administrador.
- Comunicar el éxito o error tras la operación.
- Manejar la navegación tras la creación exitosa (hacia edición) o cancelación.

**Colaboraciones**:
- **Entrada**: Recibe `crearProfesor()` desde `:Profesores Abierto`.
- **Control**: Se comunica con `ProfesorController`.
- **Salida**: Navega a `:Profesor Abierto` (finalizar con `editarProfesor`) o a `:Profesores Abierto` (cancelar).

### clases de control

#### ProfesorController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar la lógica de creación.
- Validar la unicidad del correo electrónico mediante `ProfesorRepository`.
- Instanciar el nuevo `Profesor` y solicitar su persistencia.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `CrearProfesorView`.
- **Repositorio**: Colabora con `ProfesorRepository` para validar unicidad y guardar el nuevo profesor.

### clases de entidad (entity)

#### ProfesorRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Verificar si un email de profesor ya existe.
- Ejecutar la persistencia del nuevo registro.

**Colaboraciones**:
- **Control**: Responde a `ProfesorController`.
- **Entidad**: Gestiona e interactúa con instancias de `Profesor`.

#### Profesor
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar al nuevo profesor a crear (código, nombre, email, departamento).

**Colaboraciones**:
- **Repositorio**: Es gestionado por `ProfesorRepository`.

## flujo de colaboración

### secuencia de operaciones

1. **Solicitud**: `:Profesores Abierto` → `CrearProfesorView.crearProfesor()`
2. **Creación**: `CrearProfesorView` → `ProfesorController.crear(codigo, nombre, email, departamento) : Profesor`
3. **Validación**: `ProfesorController` → `ProfesorRepository.existeCorreo(email) : Boolean`
4. **Instanciación**: `ProfesorController` → `Profesor` (create)
5. **Persistencia**: `ProfesorController` → `ProfesorRepository.guardar(profesor)`
6. **Retorno**: 
   - Finalizar: `CrearProfesorView` → `:Profesor Abierto` (editarProfesor)
   - Cancelar: `CrearProfesorView` → `:Profesores Abierto`

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Capturar datos técnicos|`CrearProfesorView`|Formulario de entrada|
|Validar unicidad de email|`ProfesorRepository`|`existeCorreo(email)`|
|Persistir registro|`ProfesorRepository`|`guardar(profesor)`|

**Código fuente:** [colaboracion.puml](../../../../../modelosUML/01-analisis/casos-uso/0-Administrador/crearProfesor/colaboracion.puml)

## referencias

- [Especificación detallada: crearProfesor()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/crearProfesor/crearProfesor.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
