# #2Think

La calidad de lo que el AI construye depende de la calidad de lo que se le describe.

Los mejores ingredientes para esa descripción son los artefactos del requisitado:

- El modelo del dominio describe qué entidades existen y cómo se relacionan.
- Los casos de uso describen qué hace el sistema, no qué gestiona.
- El diagrama de contexto describe el sistema como un conjunto de estados que solo se transitan mediante casos de uso.
- El detalle y el prototipo describen cómo es la interacción actor-sistema paso a paso.

Para evaluar lo que el AI produce: IDSW2.

## Baremos

<div align=center>

|Académicamente|Profesionalmente|
|-|-|
|*"llegué hasta aquí" tiene valor si el análisis es bueno*|*Sistema que no funciona no existe*|
|El análisis identifica qué principios están presentes, cuáles ausentes y por qué.|El sistema arranca. No *"compilaría si instalas X"*: arranca.|
|La reflexión sobre la distancia entre lo descrito y lo entregado es honesta y argumentada.|Lo que dice `QUE_HACE.md` es lo que el sistema hace. Si no coinciden, el entregable es falso.|
||El `conversation-log.md` fue escrito durante la sesión, no reconstruido después.|
||El README lo puede leer alguien que no estuvo en la sesión.|
|Los commits cuentan una historia coherente del proceso.|Los commits cuentan una historia coherente del proceso.|

</div>

La diferencia entre los dos grupos es que la dimensión profesional es binaria: cumple o no cumple. La dimensión académica admite gradación.
  
Si alguien entrega un sistema que arranca y hace algo pero que no es el sistema que se describió en el QUE_HACE.md, estamos:

- Profesionalmente ante un incumplimiento de requisitos.
- Académicamente si se quiere es material de análisis.

## Prompts

Si la calidad de lo que el AI construye depende de la calidad de lo que se le describe, el prompt es el último eslabón de esa descripción: el punto donde los artefactos del requisitado se convierten en una instrucción que el AI pueda ejecutar sin ambigüedad.

Para que esa traducción no introdujera ruido —malentendidos, supuestos implícitos o instrucciones contradictorias—, la redacción de los prompts se trabajó de forma deliberada. La siguiente conversación documenta ese proceso: cómo formular peticiones claras y autocontenidas para que el uso de IA fuera trazable y sin problemas de interpretación.

Para este proyecto se utilizó una IA (**ChatGPT**), para que ayudara a que el lenguaje coloquial pasara a ser instrucciones claras para la IA.

- [Conversación: redacción de prompts para un uso claro y sin ambigüedades de la IA](https://chatgpt.com/share/6a2d84ec-feb4-83eb-9990-2050be511fab)
