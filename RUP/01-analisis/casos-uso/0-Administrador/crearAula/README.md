<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/crearAula/crearAula.md)|**Análisis**|Diseño|Desarrollo|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > crearAula > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.1
- **Fecha**: 28/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `crearAula()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para cumplir con los requisitos de creación de una nueva aula.

## diagrama de colaboración

<div align=center>

|![Análisis: crearAula()](/images/01-analisis/casos-uso/0-Administrador/crearAula/crearAula-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### CrearAulaView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Presentar el formulario de creación de aulas.
- Capturar los datos técnicos del aula (código, nombre, capacidad, edificio, planta, tipo).
- Manejar la navegación tras la creación exitosa o cancelación.

**Colaboraciones**:
- **Entrada**: Recibe `crearAula()` desde `:Aulas Abierto`.
- **Control**: Se comunica con `AulaController`.
- **Salida**: Navega a `:Aula Abierta` (finalizar) o `:Aulas Abierto` (cancelar).

### clases de control

#### AulaController
**Estereotipo**: Control  
**Responsabilidades**:
- Coordinar la lógica de creación.
- Validar la unicidad del nombre del aula.
- Instanciar la entidad `Aula` y solicitar su persistencia.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `CrearAulaView`.
- **Repositorio**: Colabora con `AulaRepository` para validación y persistencia.

### clases de entidad (entity)

#### AulaRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Verificar existencia de nombres duplicados.
- Persistir la nueva instancia de aula.

#### Aula
**Estereotipo**: Entidad  
**Responsabilidades**:
- Representar la nueva aula (código, nombre, capacidad, edificio, planta, tipo).

## flujo de colaboración

### secuencia de operaciones

1. **Solicitud**: `:Aulas Abierto` → `CrearAulaView.crearAula()`
2. **Creación**: `CrearAulaView` → `AulaController.crear(codigo, nombre, capacidad, edificio, planta, tipo) : Aula`
3. **Validación**: `AulaController` → `AulaRepository.existeNombre(nombre)`
4. **Instanciación**: `AulaController` → `Aula` (create)
5. **Persistencia**: `AulaController` → `AulaRepository.guardar(aula)`
6. **Retorno**: 
   - Finalizar: `CrearAulaView` → `:Aula Abierta` (editarAula)
   - Cancelar: `CrearAulaView` → `:Aulas Abierto`

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Capturar datos técnicos|`CrearAulaView`|Formulario de entrada|
|Validar unicidad|`AulaRepository`|`existeNombre(nombre)`|
|Persistir registro|`AulaRepository`|`guardar(aula)`|

**Código fuente:** [colaboracion.puml](../../../../../modelosUML/01-analisis/casos-uso/0-Administrador/crearAula/colaboracion.puml)

## referencias

- [Especificación detallada: crearAula()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/crearAula/crearAula.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
