<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/crearAlumno/crearAlumno.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > crearAlumno > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.0
- **Fecha**: 25/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `crearAlumno()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para cumplir con los requisitos de creación de un nuevo alumno.

## diagrama de colaboración

<div align=center>

|![Análisis: crearAlumno()](/images/01-analisis/casos-uso/crearAlumno/crearAlumno-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### CrearAlumnoView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar el formulario de creación de alumnos.
- Capturar los datos (NIE, nombre, apellidos, correo, curso, grado) ingresados por el administrador.
- Comunicar el éxito o error tras la operación.
- Manejar la navegación de regreso a la vista de alumnos abiertos o a la edición del nuevo alumno.

**Colaboraciones**:
- **Entrada**: Recibe `crearAlumno()` desde `:Alumnos Abierto`.
- **Control**: Se comunica con `AlumnoController`.
- **Salida**: Navega a `:Alumno Abierta` tras finalizar o a `:Alumnos Abierto` tras cancelar.

### clases de control

#### AlumnoController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar la lógica de creación.
- Validar la unicidad del NIE mediante `AlumnoRepository`.
- Instanciar el nuevo `Alumno` y solicitar su persistencia.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `CrearAlumnoView`.
- **Repositorio**: Colabora con `AlumnoRepository` para validar unicidad y guardar el nuevo alumno.

### clases de entidad (entity)

#### AlumnoRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Verificar si un NIE ya existe.
- Ejecutar la persistencia del nuevo registro.

#### GradoRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Recuperar los grados disponibles para la creación del alumno.

**Colaboraciones**:
- **Control**: Responde a solicitudes de `AlumnoController`.
- **Entidad**: Gestiona instancias de `Grado`.

#### Alumno
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar el nuevo alumno a crear.

#### Grado
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar un grado académico disponible para asociar al alumno.

## flujo de colaboración

### secuencia de operaciones

1. **Solicitud**: `:Alumnos Abierto` → `CrearAlumnoView.crearAlumno()`
2. **Carga de grados**: `CrearAlumnoView` → `AlumnoController.obtenerGrados() : Lista<Grado>`
3. **Consulta de grados**: `AlumnoController` → `GradoRepository.obtenerTodos() : Lista<Grado>`
4. **Creación**: `CrearAlumnoView` → `AlumnoController.crear(nie, nombre, apellidos, correo, curso, grado)`
5. **Validación de campos**: `AlumnoController` → `AlumnoController.validarCampos()`
6. **Validación**: `AlumnoController` → `AlumnoRepository.existeNIE(nie)`
7. **Instanciación**: `AlumnoController` → `Alumno (<<create>>)` 
8. **Persistencia**: `AlumnoController` → `AlumnoRepository.guardar(alumno)`
9. **Retorno**:
   - Finalizar: `CrearAlumnoView` → `:Alumno Abierta`
   - Cancelar: `CrearAlumnoView` → `:Alumnos Abierto`

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Capturar datos|`CrearAlumnoView`|Formulario de entrada|
|Validar y persistir|`AlumnoController`|`crear(nie, nombre, apellidos, correo, curso, grado)`|
|Persistir registro|`AlumnoRepository`|`guardar(alumno)`|

**Código fuente:** [colaboracion.puml](../../../../modelosUML/01-analisis/casos-uso/crearAlumno/colaboracion.puml)

## referencias

- [Especificación detallada: crearAlumno()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/crearAlumno/crearAlumno.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
