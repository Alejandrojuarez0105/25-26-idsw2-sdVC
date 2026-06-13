<div align="right">

|[🏠️](/RUP/README.md)|[ 📊](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/generarCalendario/generarCalendario.md)|**Análisis**|[Diseño](/RUP/02-diseño/casos-uso/0-Administrador/generarCalendario/README.md)|[Desarrollo](/RUP/03-desarrollo/casos-uso/0-Administrador/generarCalendario/README.md)|Pruebas|
|-|-|-|-|-|-|-|

</div>

# Davidario > generarCalendario > Análisis

## información del artefacto

- **Proyecto**: Davidario - Sistema de Gestión de Exámenes
- **Fase RUP**: Elaboración
- **Disciplina**: Análisis
- **Versión**: 1.1
- **Fecha**: 31/05/2026
- **Autor**: Alejandro Juárez

## propósito

Análisis de colaboración del caso de uso `generarCalendario()` mediante el patrón MVC, identificando las clases de análisis, sus responsabilidades y colaboraciones necesarias para ejecutar el proceso algorítmico de asignación de fechas, horarios, aulas y profesores supervisores a los exámenes pendientes.

## diagrama de colaboración

<div align=center>

|![Análisis: generarCalendario()](/images/01-analisis/casos-uso/0-Administrador/generarCalendario/generarCalendario-analisis.svg)|
|-|
|**Disciplina**: Análisis RUP<br>**Enfoque**: Diagramas de colaboración MVC|

</div>

## clases de análisis identificadas

### clases de vista (boundary)

#### GenerarCalendarioView
**Estereotipo**: Vista (Boundary)  
**Responsabilidades**:
- Proporcionar la interfaz para configurar los parámetros de generación (fecha inicio/fin, franjas horarias).
- Capturar la orden de inicio del proceso de generación.
- Presentar el resultado de la generación (`GeneracionResult`) al administrador.
- Manejar la navegación hacia la revisión de conflictos y la persistencia final del calendario.

**Colaboraciones**:
- **Entrada**: Recibe `generarCalendario()` desde `:Sistema Disponible`.
- **Control**: Se comunica con `CalendarioController`.
- **Salida**: Navega a `:Calendario Generado` (guardar) o regresa a `:Sistema Disponible` (cancelar).
- **CRUD Relacionado**: Enlaza con `:Collaboration ListarConflictosExamenes`.

### clases de control

#### CalendarioController
**Estereotipo**: Control  
**Responsabilidades**:
- Orquestar el flujo lógico de generación masiva.
- Coordinar la recuperación de datos desde múltiples repositorios (Exámenes, Aulas, Profesores).
- Validar la disponibilidad docente y las preferencias horarias.
- Gestionar la creación del objeto de resultados y la actualización de entidades.

**Colaboraciones**:
- **Vista**: Responde a solicitudes de `GenerarCalendarioView`.
- **Repositorio**: Colabora con `ExamenRepository`, `AulaRepository`, `ProfesorRepository` y `PreferenciaRepository`.

### clases de entidad (entity)

#### ExamenRepository / AulaRepository / ProfesorRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Proporcionar acceso filtrado a las entidades pendientes o disponibles para el proceso de asignación.

#### PreferenciaRepository
**Estereotipo**: Entidad  
**Responsabilidades**:
- Abstraer el acceso a las restricciones y preferencias de los docentes para su validación durante la generación.

#### Examen / Calendario / GeneracionResult
**Estereotipo**: Entidad  
**Responsabilidades**:
- **Examen**: Encapsular la actualización de la asignación de supervisores.
- **Calendario**: Representar el estado global actualizado de la programación.
- **GeneracionResult**: Objeto de transferencia que contiene el balance del proceso realizado.

## flujo de colaboración

### secuencia de operaciones

1. **Configuración**: `:Sistema Disponible` → `GenerarCalendarioView.generarCalendario()`
2. **Solicitud de Generación**: `GenerarCalendarioView` → `CalendarioController.generar(fechaInicio, fechaFin, franjas) : GeneracionResult`
3. **Carga de Datos**: 
   - `CalendarioController` → `ExamenRepository.obtenerExamenesPendientes()`
   - `CalendarioController` → `AulaRepository.obtenerAulasDisponibles()`
   - `CalendarioController` → `ProfesorRepository.obtenerProfesoresDisponibles()`
4. **Validación de Restricciones**: `CalendarioController` → `PreferenciaRepository.verificarPreferenciasDocentes(franja, fecha)`
5. **Asignación y Actualización**: 
   - `CalendarioController` → `Examen.asignarProfesorAExamen()` (`<<update>>`)
   - `CalendarioController` → `Calendario` (`<<update>>`)
   - `CalendarioController` → `GeneracionResult` (`<<create>>`)
6. **Revisión (opcional)**: `GenerarCalendarioView` ..> `ListarConflictosExamenes.revisarConflictos()`
7. **Retorno**: 
   - Finalizar: `GenerarCalendarioView` → `:Calendario Generado.guardarCalendario()`
   - Cancelar: `GenerarCalendarioView` → `:Sistema Disponible`

## correspondencia con requisitos

|Requisito del caso de uso|Clase responsable|Método/Colaboración|
|-|-|-|
|Configurar parámetros técnicos|`GenerarCalendarioView`|Interfaz de configuración|
|Validar disponibilidad docente|`PreferenciaRepository`|`verificarPreferenciasDocentes()`|
|Asignar supervisores|`Examen`|`asignarProfesorAExamen()`|
|Generar reporte de resultados|`CalendarioController`|Instancia `GeneracionResult`|

**Código fuente:** [colaboracion.puml](../../../../../modelosUML/01-analisis/casos-uso/0-Administrador/generarCalendario/colaboracion.puml)

## referencias

- [Especificación detallada: generarCalendario()](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/0-Administrador/generarCalendario/generarCalendario.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [Modelo del dominio](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
- [AGENTES.md](/AGENTES.md) - Metodología de análisis RUP
