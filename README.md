# Chernóbil · La noche que cambió la historia

Documental educativo interactivo en 3D sobre el accidente nuclear del 26 de abril de 1986. Diez capítulos, reconstrucciones programáticas, cronología, guion para el expositor, mapa de dispersión y biblioteca de fuentes.

## Abrir la presentación

Abre **`index.html`** en un navegador moderno (Chrome, Edge, Firefox o Safari actuales).

- El motor 3D (Three.js) y las tipografías se cargan desde CDN; para la experiencia completa se necesita conexión a internet.
- Si WebGL no está disponible o falla la red, se activa automáticamente el **modo lectura** con los diez capítulos, el guion y las fuentes.
- No requiere servidor local ni instalación.

## Controles

| Acción | Control |
|---|---|
| Avanzar / retroceder de capítulo | `←` `→` o botones inferiores |
| Rotar / acercar la escena | Arrastrar / rueda o pinza |
| Pausar animaciones | `Espacio` |
| Ocultar o mostrar el panel | `H` |
| Mostrar u ocultar etiquetas 3D | `L` |
| Cronología | `T` |
| Fuentes y referencias | `F` |
| Ayuda y atajos | `?` |
| Cerrar ventanas / volver de la cita final | `Esc` |

El panel derecho tiene dos pestañas: **Historia** (datos y contexto) y **Guion del expositor** (texto oral y transición al siguiente capítulo). La presentación **no avanza sola**.

Los botones **Reproducir secuencia / Reproducir evacuación / Reproducir construcción / Recorrer etapas** inician animaciones dentro del capítulo. Mientras están activos cambian a **Detener secuencia** y la tira inferior muestra “EN REPRODUCCIÓN”. Si la presentación está pausada, el mismo botón reanuda la secuencia.

## Contenido

1. El contexto: la central, el RBMK-1000 y Prípiat.
2. La noche del accidente: la prueba de seguridad y la secuencia de 01:23.
3. La explosión: reactor en corte, explosiones, incendio y liberación.
4. Primeras horas: bomberos, exposición y radiación ionizante.
5. Prípiat: vida, evacuación y abandono.
6. La nube sobre Europa: mapa interactivo y detección exterior.
7. Liquidadores: tejados, túnel y primer sarcófago.
8. Consecuencias: salud, estimaciones, zona de exclusión y ecosistemas.
9. Del sarcófago al Nuevo Confinamiento Seguro (NSC).
10. Reflexión final y cita de cierre.

## Criterio histórico

La cronología y las cifras se contrastaron con IAEA/INSAG-7, UNSCEAR, OMS, EBRD, ChNPP, World Nuclear Association y Natural Earth. Las proyecciones a largo plazo se presentan como estimaciones, no como recuentos definitivos. Las escenas 3D son reconstrucciones didácticas: no son imágenes de archivo ni réplicas de ingeniería y no se atribuyen diálogos a personas reales.

Fuentes principales:

- IAEA · [El accidente de 1986](https://www.iaea.org/topics/chornobyl)
- IAEA · [Preguntas frecuentes](https://www.iaea.org/topics/chornobyl/faqs)
- IAEA/INSAG-7 · [The Chernobyl Accident: Updating of INSAG-1](https://www-pub.iaea.org/MTCD/publications/PDF/Pub913e_web.pdf)
- UNSCEAR · [The Chornobyl Accident](https://www.unscear.org/unscear/en/areas-of-work/chernobyl.html)
- OMS · [Radiation: The Chernobyl accident](https://www.who.int/news-room/questions-and-answers/item/radiation-the-chernobyl-accident)
- EBRD · [Making Chornobyl safe](https://www.ebrd.com/home/what-we-do/focus-areas/nuclear-safety/making-chornobyl-safe.html)
- ChNPP · [Sitio oficial](https://www.chnpp.gov.ua/en/home)
- Natural Earth · [Admin 0 Countries](https://www.naturalearthdata.com/downloads/110m-cultural-vectors/110m-admin-0-countries/)

## Desarrollo

`index.html` es el archivo final autocontenido (CSS y JavaScript incluidos). Las fuentes editables están en `src/`; para regenerar el archivo:

```bash
node build.mjs
```

El build concatena datos, núcleo, interfaz y las diez escenas en un único HTML. No hay modelos ni imágenes externas: toda la geometría, texturas y efectos se generan con Three.js y Canvas.
