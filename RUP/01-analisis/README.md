<div align="right">

[![](https://img.shields.io/badge/-Inicio-0A3B64?style=for-the-badge&logo=github&logoColor=white)](/README.md)
[![](https://img.shields.io/badge/-Modelo_del_Dominio-0A3B64?style=for-the-badge&logo=drawio&logoColor=white)](/RUP/00-requisitos/00-modelo-del-dominio/README.md)
[![](https://img.shields.io/badge/-Actores_Y_Casos_de_Uso-0A3B64?style=for-the-badge&logo=use-case&logoColor=white)](/RUP/00-requisitos/01-casos-de-uso/0-Actores/README.md)
[![](https://img.shields.io/badge/-Diagramas_de_Contexto-0A3B64?style=for-the-badge&logo=flowchart&logoColor=white)](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)
[![](https://img.shields.io/badge/-Detalle_de_Casos_de_Uso-0A3B64?style=for-the-badge&logo=notepad&logoColor=white)](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
[![](https://img.shields.io/badge/-Prototipos-0A3B64?style=for-the-badge&logo=figma&logoColor=white)](/RUP/00-requisitos/01-casos-de-uso/5-Prototipo/README.md)
[![](https://img.shields.io/badge/-Priorización-0A3B64?style=for-the-badge&logo=priority&logoColor=white)](/RUP/00-requisitos/01-casos-de-uso/3-PriorizarCasosDeUso/README.md)
[![](https://img.shields.io/badge/-Sesiones-0A3B64?style=for-the-badge&logo=google-meet&logoColor=white)](/RUP/00-requisitos/03-sesiones/README.md)
[![](https://img.shields.io/badge/-IA-0A3B64?style=for-the-badge&logo=openai&logoColor=white)](/conversation-log.md)

</div>

# Análisis - Disciplina de Análisis y Diseño

Esta sección contiene el análisis arquitectónico de los casos de uso especificados para el sistema **Davidario**, aplicando el patrón MVC e identificando las clases de análisis necesarias para la implementación.

## Contenido de la disciplina

### [Casos de uso - Análisis MVC](casos-uso/README.md)
Análisis completo de cada caso de uso especificado mediante:
- **Clases de análisis**: Boundary, Control, Entity según patrón MVC.
- **Diagramas de colaboración**: Interacciones conceptuales entre clases de análisis.
- **Responsabilidades definidas**: Separación clara por estereotipos.

## Metodologí­a de análisis aplicada

### Patrón MVC sistemático
- **Model (Entity)**: Entidades del dominio y repositorios de datos.
- **View (Boundary)**: Clases de interfaz que manejan interacción con actores.
- **Controller (Control)**: Coordinación de lógica de negocio y flujo de casos de uso.

### Estereotipos de análisis
- **Boundary (Vista)**: `#629EF9` - Clases de interfaz usuario-sistema.
- **Control (Controlador)**: `#b5bd68` - Clases de coordinación y lógica.
- **Entity (Entidad)**: `#F2AC4E` - Clases de dominio y persistencia.
- **Collaboration**: `#CDEBA5` - Referencias a otros casos de uso o estados del sistema.

### Diagramas de colaboración
- **Estructura de package**: Cada caso de uso se analiza como una unidad independiente.
- **Trazabilidad**: Los mensajes expresan intención de negocio derivada de los requisitos.
- **Relaciones MVC**: El controlador actúa como intermediario entre la vista y las entidades.

## Cobertura de análisis

### Casos completamente analizados
- **Gestión del sistema**: 
  - [iniciarSesion](casos-uso/iniciarSesion/README.md) - Autenticación con clases de análisis MVC.
  - [cerrarSesion](casos-uso/cerrarSesion/README.md) - Finalización de sesión segura.
- **Apertura de entidades**:
  - [abrirGrados](casos-uso/abrirGrados/README.md) - Gestión de vista de listado de grados.
- **Gestión de entidades**:
  - [eliminarGrado](casos-uso/eliminarGrado/README.md) - Eliminación de grados académicos.

## Arquitectura emergente

### Separación de responsabilidades por capas
- **Capa de Presentación**: Clases Boundary derivadas de los prototipos de interfaz.
- **Capa de Lógica**: Clases Control especializadas en orquestar el flujo de los casos de uso.
- **Capa de Datos**: Repositorios conceptuales y entidades identificadas en el modelo del dominio.

## Trazabilidad

### De requisitos a análisis
- **Casos de uso detallados**: Los estados y transiciones guí­an la identificación de responsabilidades.
- **Modelo del dominio**: Provee las entidades base para las clases Entity.
- **Prototipos**: Definen la estructura conceptual de las clases Boundary.

## Referencias

- [Casos de uso especificados](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
- [Diagrama de contexto - Administrador](/images/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/0-Administrador/DiagramaDeContextoAdministrador.svg)
- [AGENTES.md](/AGENTES.md) - Metodologí­a y protocolos
- [Log de conversaciones](/conversation-log.md)
