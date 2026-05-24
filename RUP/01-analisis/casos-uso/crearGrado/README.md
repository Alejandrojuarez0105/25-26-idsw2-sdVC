<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/crearGrado/crearGrado.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > crearGrado > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.0
- **Fecha**: 24/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `crearGrado()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para cumplir con los requisitos de creación de un nuevo grado académico.

## diagrama de colaboración

<div align=center>

|![Análisis: crearGrado()](/images/01-analisis/casos-uso/crearGrado/crearGrado-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### CrearGradoView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar el formulario de creación de grados.
- Capturar los datos (código y nombre) ingresados por el administrador.
- Comunicar el éxito o error tras la operación.
- Manejar la navegación de regreso a la vista de grados abiertos o a la edición del nuevo grado.

**Colaboraciones**:
- **Entrada**: Recibe `crearGrado()` desde `:Grados Abierto`.
- **Control**: Se comunica con `GradoController`.
- **Salida**: Navega a `:Grado Abierto` tras finalizar o a `:Grados Abierto` tras cancelar.

### clases de control

#### GradoController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar la lógica de creación.
- Validar la unicidad del código mediante `GradoRepository`.
- Instanciar el nuevo `Grado` y solicitar su persistencia.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `CrearGradoView`.
- **Repositorio**: Colabora con `GradoRepository` para validar unicidad y guardar el nuevo grado.

### clases de entidad (entity)

#### GradoRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Verificar si un código de grado ya existe.
- Ejecutar la persistencia del nuevo registro.

#### Grado
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar el nuevo grado académico a crear.

## flujo de colaboración

### secuencia de operaciones

1. **Solicitud**: `:Grados Abierto` → `CrearGradoView.crearGrado()`
2. **Creación**: `CrearGradoView` → `GradoController.crear(codigo, nombre)`
3. **Validación**: `GradoController` → `GradoRepository.existeCodigo(codigo)`
4. **Instanciación**: `GradoController` → `Grado` (create)
5. **Persistencia**: `GradoController` → `GradoRepository.guardar(grado)`
6. **Retorno**: 
   - Finalizar: `CrearGradoView` → `:Grado Abierto`
   - Cancelar: `CrearGradoView` → `:Grados Abierto`

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Capturar datos|`CrearGradoView`|Formulario de entrada|
|Validar y persistir|`GradoController`|`crear(codigo, nombre)`|
|Persistir registro|`GradoRepository`|`guardar(grado)`|

**Código fuente:** [colaboracion.puml](../../../../modelosUML/01-analisis/casos-uso/crearGrado/colaboracion.puml)

## referencias

- [Especificación detallada: crearGrado()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/crearGrado/crearGrado.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
