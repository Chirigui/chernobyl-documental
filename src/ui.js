/* ============================================================
   INTERFAZ, MODALES, FUENTES, ATAJOS Y MODO LECTURA
   ============================================================ */

const SOURCE_ORDER = [
  'iaea', 'iaeaFaq', 'insag7', 'unscear', 'unscear2008', 'whoQA', 'whoHealth', 'iaeaForum',
  'iaeaEnv', 'wna', 'wnaSeq', 'ebrd', 'chnpp', 'naturalEarth'
];

function sourceLink(id, extra = '') {
  const s = SOURCES[id];
  if (!s) return '';
  return `<a class="source-item ${extra}" href="${s.url}" target="_blank" rel="noopener noreferrer">
    <span class="source-type">${s.type}</span>
    <span class="source-title">${s.title}<small>${s.note}</small></span>
    <span class="source-arrow">↗</span>
  </a>`;
}

function sourcesHTML(highlight) {
  const items = SOURCE_ORDER.map((id) => sourceLink(id, id === highlight ? 'is-highlighted' : '')).join('');
  return `
    <p class="modal-lede">Esta presentación se apoya en evaluaciones de organismos internacionales, informes técnicos y documentación del operador. Las cifras que siguen se citan tal como aparecen en esas fuentes; cuando existe incertidumbre, se indica.</p>
    <div class="modal-note"><strong>Cómo leer las referencias</strong>Las afirmaciones sobre el accidente y sus consecuencias se contrastaron con IAEA/INSAG, UNSCEAR y la OMS. Las estimaciones a largo plazo se presentan como rangos o proyecciones, nunca como recuentos definitivos.</div>
    <div class="source-list">${items}</div>
    <div class="modal-footer-line"><span>Última revisión editorial: 2026</span><a href="https://www.iaea.org/topics/chornobyl" target="_blank" rel="noopener noreferrer">Abrir portal de la IAEA ↗</a></div>
  `;
}

function timelineHTML() {
  return `
    <p class="modal-lede">Una línea de tiempo para situar el accidente, la respuesta y las décadas posteriores. Pulsa cualquier hito para ir al capítulo relacionado.</p>
    <div class="timeline-global">
      ${TIMELINE.map((e) => `<div class="tl-event ${e.major ? 'is-major' : ''}" data-goto="${e.chapter - 1}" role="button" tabindex="0">
        <span class="tl-date">${e.date}</span>
        <span class="tl-title">${e.title}</span>
        <span class="tl-note">${e.note}</span>
        <span class="tl-link">Ir al capítulo ${String(e.chapter).padStart(2, '0')} →</span>
      </div>`).join('')}
    </div>
    <div class="timeline-legend"><span>Hito principal</span><span>Fechas aproximadas cuando la fuente lo indica</span></div>
    <div class="modal-footer-line"><span>Fuentes: IAEA · INSAG-7 · UNSCEAR · OMS · EBRD</span><button type="button" class="src-inline" data-modal="sources">Ver bibliografía</button></div>
  `;
}

function helpHTML() {
  return `
    <p class="modal-lede">La experiencia está pensada para que el presentador mantenga el control. Las animaciones no avanzan solas entre capítulos: tú decides cuándo pasar y cuándo reproducir una secuencia.</p>
    <div class="shortcuts-grid">
      <div class="shortcut"><span>Capítulo siguiente / anterior</span><kbd>← →</kbd></div>
      <div class="shortcut"><span>Pausar o reanudar animaciones</span><kbd>Espacio</kbd></div>
      <div class="shortcut"><span>Mostrar u ocultar el panel</span><kbd>H</kbd></div>
      <div class="shortcut"><span>Mostrar u ocultar etiquetas 3D</span><kbd>L</kbd></div>
      <div class="shortcut"><span>Abrir cronología</span><kbd>T</kbd></div>
      <div class="shortcut"><span>Abrir fuentes</span><kbd>F</kbd></div>
      <div class="shortcut"><span>Abrir esta ayuda</span><kbd>?</kbd></div>
      <div class="shortcut"><span>Cerrar una ventana</span><kbd>Esc</kbd></div>
      <div class="shortcut"><span>Girar la escena</span><kbd>Arrastrar</kbd></div>
      <div class="shortcut"><span>Acercar / alejar</span><kbd>Rueda / pinza</kbd></div>
    </div>
    <h3>Durante la exposición</h3>
    <p>Usa las pestañas <strong>Historia</strong> y <strong>Guion del expositor</strong> del panel para alternar entre los datos que ve el público y el texto que puedes leer o parafrasear. La pestaña de guion incluye una transición oral al siguiente capítulo.</p>
    <p>Los botones de vista cambian la cámara. Al pulsar <strong>Reproducir secuencia</strong>, el botón cambia a <strong>Detener secuencia</strong> y la tira inferior muestra “EN REPRODUCCIÓN”. Si pausas la presentación, el mismo botón permite reanudar la secuencia. Si necesitas silencio, el botón <strong>Sonido</strong> está desactivado por defecto.</p>
    <div class="modal-footer-line"><span>Presentación educativa · 10 capítulos · 15–20 min</span><button type="button" class="src-inline" data-modal="about">Método y créditos</button></div>
  `;
}

function aboutHTML() {
  return `
    <p class="modal-lede">Chernóbil: la noche que cambió la historia es una reconstrucción educativa interactiva. No es material de archivo ni una simulación de ingeniería: es una interpretación histórica y visual para comprender los hechos.</p>
    <div class="about-grid">
      <div class="about-cell"><strong>Hechos y cifras</strong><p>Se contrastaron con IAEA, INSAG-7, UNSCEAR, OMS, EBRD, la World Nuclear Association y el operador del sitio. Las estimaciones se identifican como tales.</p></div>
      <div class="about-cell"><strong>Escenas 3D</strong><p>Todas las geometrías, texturas y animaciones se generaron programáticamente con Three.js y WebGL. No se usan modelos externos ni imágenes de archivo.</p></div>
      <div class="about-cell"><strong>Escala y apariencia</strong><p>Los edificios, vehículos y figuras están simplificados. Las proporciones y distancias no son de ingeniería. Las escenas buscan comprender, no replicar.</p></div>
      <div class="about-cell"><strong>Incertidumbre</strong><p>La secuencia exacta de las explosiones y el desglose de los efectos a largo plazo siguen siendo investigados. El texto lo indica donde corresponde.</p></div>
    </div>
    <h3>Lo que no se inventó</h3>
    <p>No se atribuyen diálogos a personas reales. No se presentan cifras hipotéticas como definitivas. No se representa la radiación como una sustancia verde o luminosa. Las visualizaciones de partículas representan vapor, humo, polvo y materia incandescente, no un “resplandor radiactivo”.</p>
    <h3>Material cartográfico</h3>
    <p>Los contornos del mapa de Europa proceden de Natural Earth (escala 1:110 m, dominio público), simplificados para esta presentación. El sombreado y las partículas del penacho son didácticos; no representan umbrales oficiales de contaminación.</p>
    <div class="modal-note"><strong>Conexión</strong>La experiencia 3D carga Three.js desde un CDN. Si no hay conexión o WebGL no está disponible, la presentación cambia automáticamente al modo lectura con todo el contenido y las fuentes.</div>
    <div class="modal-note"><strong>Uso en clase</strong>Puedes proyectar la experiencia a pantalla completa, ocultar el panel de información con la tecla H y navegar con las flechas. El guion del expositor está integrado en cada capítulo.</div>
    <div class="modal-footer-line"><span>Investigación, diseño y código · 2026</span><a href="https://www.iaea.org/topics/chornobyl" target="_blank" rel="noopener noreferrer">Ver portal de la IAEA ↗</a></div>
  `;
}

function radiationHTML() {
  return `
    <p class="modal-lede">La radiación ionizante es energía emitida por átomos inestables. No es una sustancia que brille: puede atravesar la materia, depositar energía en las células y dañar el ADN. La dosis, el tiempo y la vía de exposición determinan el riesgo.</p>
    <div class="radiation-intro">
      <div class="radiation-copy">
        <h3>Tres tipos principales</h3>
        <p><strong>Alfa:</strong> partículas relativamente grandes, con poca capacidad de penetración. Se detienen en la piel o en una hoja de papel; son peligrosas si se inhalan o ingieren.</p>
        <p><strong>Beta:</strong> electrones rápidos. Pueden atravesar la piel superficial y se detienen con unos milímetros de metal o plástico.</p>
        <p><strong>Gamma:</strong> radiación electromagnética de alta energía. Atraviesa la piel y requiere materiales densos, como el plomo o el hormigón, para reducirla.</p>
        <p>En Chernóbil, el riesgo principal para el público fue la exposición interna por yodo-131 en la leche y por cesio en los alimentos, además de la exposición externa en las zonas contaminadas.</p>
      </div>
      <div class="radiation-diagram">
        <svg viewBox="0 0 420 270" role="img" aria-label="Esquema de penetración de partículas alfa, beta y gamma">
          <defs>
            <linearGradient id="radSkin" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6f726a"/><stop offset=".55" stop-color="#9a9384"/><stop offset="1" stop-color="#4d4f49"/></linearGradient>
            <marker id="radArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6z" fill="#d7a247"/></marker>
          </defs>
          <rect x="0" y="0" width="420" height="270" fill="#090b0c"/>
          <text x="22" y="29" fill="#8d908c" font-family="IBM Plex Mono, monospace" font-size="9" letter-spacing="2">PIEL / TEJIDO</text>
          <rect x="270" y="20" width="110" height="230" fill="url(#radSkin)" opacity=".55"/>
          <rect x="270" y="20" width="2" height="230" fill="#d8d2c5" opacity=".5"/>
          <g stroke="#d7a247" stroke-width="1.4" fill="none">
            <path d="M45 70H238" marker-end="url(#radArrow)"/>
            <path d="M45 128H255" marker-end="url(#radArrow)"/>
            <path d="M45 190H385" marker-end="url(#radArrow)"/>
          </g>
          <text x="42" y="60" fill="#e9e3d7" font-family="IBM Plex Mono, monospace" font-size="12">α ALFA</text>
          <text x="42" y="118" fill="#e9e3d7" font-family="IBM Plex Mono, monospace" font-size="12">β BETA</text>
          <text x="42" y="180" fill="#e9e3d7" font-family="IBM Plex Mono, monospace" font-size="12">γ GAMMA</text>
          <text x="245" y="70" fill="#b7b2a5" font-family="IBM Plex Mono, monospace" font-size="8">detenida por la piel</text>
          <text x="275" y="128" fill="#b7b2a5" font-family="IBM Plex Mono, monospace" font-size="8">unos mm</text>
          <text x="300" y="210" fill="#b7b2a5" font-family="IBM Plex Mono, monospace" font-size="8">atraviesa</text>
          <text x="22" y="246" fill="#676b68" font-family="IBM Plex Mono, monospace" font-size="8">La exposición interna puede ser más peligrosa que la externa.</text>
        </svg>
      </div>
    </div>
    <div class="ray-grid">
      <div class="ray-card"><div class="ray-card-head"><b>α</b><span>ALFA</span></div><p>Núcleos de helio. Poca penetración; riesgo alto si se inhalan o ingieren.</p><div class="ray-bar"><i style="width:22%"></i></div></div>
      <div class="ray-card"><div class="ray-card-head"><b>β</b><span>BETA</span></div><p>Electrones rápidos. Penetran algunos milímetros de tejido o plástico.</p><div class="ray-bar"><i style="width:55%"></i></div></div>
      <div class="ray-card"><div class="ray-card-head"><b>γ</b><span>GAMMA</span></div><p>Ondas de alta energía. Necesitan plomo u hormigón para atenuarse.</p><div class="ray-bar"><i style="width:95%"></i></div></div>
    </div>
    <h3>Dosis: la unidad que importa</h3>
    <p>El <strong>gray (Gy)</strong> mide energía absorbida por kilogramo de materia. El <strong>sievert (Sv)</strong> pondera esa energía según el tipo de radiación y el tejido. En el síndrome de irradiación aguda, se habla de dosis de cuerpo entero recibidas en muy poco tiempo.</p>
    <div class="dose-scale">
      <div class="dose-row"><b>Radiografía de tórax</b><span class="dose-bar"><i style="width:1.5%"></i></span><em>≈ 0,1 mSv</em></div>
      <div class="dose-row"><b>Fondo natural anual</b><span class="dose-bar"><i style="width:24%"></i></span><em>≈ 2,4 mSv</em></div>
      <div class="dose-row"><b>TC de abdomen</b><span class="dose-bar"><i style="width:70%"></i></span><em>≈ 7–10 mSv</em></div>
      <div class="dose-row"><b>Límite para trabajador</b><span class="dose-bar"><i style="width:92%"></i></span><em>20 mSv/año</em></div>
      <div class="dose-row"><b>ARS confirmado</b><span class="dose-bar"><i style="width:100%"></i></span><em>0,8–16 Gy</em></div>
    </div>
    <p class="modal-small">Escala comparativa aproximada. Las dosis de radiación no son equivalentes entre sí: dependen del tejido, el tipo de radiación y el tiempo de exposición. Los valores de 0,8–16 Gy corresponden a dosis absorbidas en trabajadores con ARS según UNSCEAR.</p>
    <div class="modal-footer-line"><span>Fuente: UNSCEAR · OMS · IAEA</span><button type="button" class="src-inline" data-modal="sources">Ver bibliografía</button></div>
  `;
}

function healthHTML() {
  return `
    <p class="modal-lede">La ciencia distingue entre efectos observados, atribuciones y proyecciones. No es lo mismo contar casos diagnosticados que estimar cuántos cánceres adicionales podría producir una exposición. Estas diferencias explican por qué circulan cifras tan distintas.</p>
    <div class="estimate-grid">
      <div class="estimate-card"><span class="tag">CONFIRMADO</span><strong>134</strong><p>Casos de síndrome de irradiación aguda entre trabajadores y bomberos. 28 muertes en los primeros tres meses.</p></div>
      <div class="estimate-card"><span class="tag">OBSERVADO</span><strong>&gt;6.000</strong><p>Casos de cáncer de tiroides en personas que eran niños o adolescentes en 1986, hasta 2005. Una fracción importante se atribuye al yodo radiactivo.</p></div>
      <div class="estimate-card is-estimate"><span class="tag">ESTIMACIÓN</span><strong>hasta 4.000</strong><p>Muertes adicionales por cáncer entre los grupos más expuestos, según el Foro de Chernóbil (2005). Es una proyección, no un recuento.</p></div>
      <div class="estimate-card is-estimate"><span class="tag">PROYECCIÓN</span><strong>≈25.000</strong><p>Casos de cáncer adicionales en Europa hasta 2065, con ≈16.000 muertes, según una proyección del IARC/OMS publicada en 2006.</p></div>
    </div>
    <h3>Por qué las cifras no coinciden</h3>
    <table class="data-table">
      <thead><tr><th>Factor</th><th>Efecto en la estimación</th></tr></thead>
      <tbody>
        <tr><td>Dosis</td><td>Las dosis individuales se reconstruyen con registros incompletos, especialmente en los primeros días.</td></tr>
        <tr><td>Modelo</td><td>Los modelos de riesgo lineal, los factores de transferencia entre poblaciones y los periodos de latencia cambian el resultado.</td></tr>
        <tr><td>Población</td><td>No es lo mismo estudiar a 600.000 liquidadores que a millones de residentes con dosis bajas.</td></tr>
        <tr><td>Cribado</td><td>La detección intensiva de cáncer de tiroides aumenta el número de casos diagnosticados, incluidos algunos que no habrían causado enfermedad.</td></tr>
        <tr><td>Tiempo</td><td>Los cánceres sólidos pueden tardar décadas en aparecer; las proyecciones a 2065 son escenarios, no observaciones.</td></tr>
      </tbody>
    </table>
    <h3>Efectos no radiológicos</h3>
    <p>La evacuación, el estigma, la pérdida de hogares y la incertidumbre produjeron ansiedad, depresión y sufrimiento social. La OMS considera que la salud mental es una parte central de las consecuencias de un desastre radiológico, aunque no se pueda medir en sieverts.</p>
    <div class="modal-note"><strong>Regla para la exposición</strong>Di “se estima”, “se atribuye” o “se observó” según corresponda. No conviertas una proyección en un titular. La incertidumbre no resta importancia al sufrimiento: lo hace más honesto.</div>
    <div class="modal-footer-line"><span>Fuentes: UNSCEAR 2008 · OMS · Foro de Chernóbil · IARC</span><button type="button" class="src-inline" data-modal="sources">Ver bibliografía</button></div>
  `;
}

function sarcophagusHTML() {
  return `
    <p class="modal-lede">El primer sarcófago se construyó entre mayo y noviembre de 1986. Fue una carrera contra la liberación de radiactividad, no un proyecto de ingeniería planificado con calma.</p>
    <div class="construction-steps">
      <div class="construction-step"><span class="num">01</span><div><strong>Estabilizar el perímetro</strong><p>Se prepararon accesos, se controló el polvo y se trabajó con grúas y hormigón a distancia. La prioridad era cubrir el reactor y evitar que el fuego se extendiera.</p></div></div>
      <div class="construction-step"><span class="num">02</span><div><strong>Construir muros de contención</strong><p>Se levantaron muros de hormigón alrededor del bloque 4. La estructura debía soportar el peso y reducir la liberación de partículas, no servir como contención hermética.</p></div></div>
      <div class="construction-step"><span class="num">03</span><div><strong>Cubrir el reactor</strong><p>Se añadieron vigas, paneles y una cubierta. Los trabajos se hicieron con altas dosis y plazos extremos; muchas tareas se ejecutaron de forma remota o con rotación de personal.</p></div></div>
      <div class="construction-step"><span class="num">04</span><div><strong>Ventilar y monitorear</strong><p>Se instalaron sistemas de ventilación y monitoreo. El sarcófago nunca fue hermético: tenía filtraciones, huecos y una vida útil estimada de 20 a 30 años.</p></div></div>
    </div>
    <div class="nsc-figures">
      <div class="nsc-figure"><b>206</b><span>días de construcción</span></div>
      <div class="nsc-figure"><b>400.000</b><span>m³ de hormigón (aprox.)</span></div>
      <div class="nsc-figure"><b>7.300</b><span>toneladas de acero</span></div>
      <div class="nsc-figure"><b>20–30</b><span>años de vida útil prevista</span></div>
    </div>
    <p>El sarcófago fue una medida de emergencia que funcionó durante más tiempo del previsto. También dejó un problema sin resolver: cómo retirar el combustible y los restos del reactor sin exponer a más personas.</p>
    <div class="modal-footer-line"><span>Fuentes: WNA · IAEA · EBRD</span><button type="button" class="src-inline" data-modal="sources">Ver bibliografía</button></div>
  `;
}

function nscHTML() {
  return `
    <p class="modal-lede">El Nuevo Confinamiento Seguro (NSC) es una bóveda de acero diseñada para cubrir el sarcófago de 1986 y crear las condiciones para desmantelar el interior. No es un edificio terminado: es una infraestructura de muy largo plazo.</p>
    <div class="nsc-figures">
      <div class="nsc-figure"><b>36.000</b><span>toneladas de peso</span></div>
      <div class="nsc-figure"><b>165 m</b><span>de largo</span></div>
      <div class="nsc-figure"><b>257 m</b><span>de ancho</span></div>
      <div class="nsc-figure"><b>108 m</b><span>de altura</span></div>
    </div>
    <h3>Una estructura que se movió entera</h3>
    <p>El arco se ensambló a 327 metros del reactor, en una zona donde los trabajadores podían construir con menor exposición. En noviembre de 2016 se deslizó sobre el sarcófago mediante rieles. Es una de las estructuras móviles más grandes jamás construidas.</p>
    <h3>Qué hace por dentro</h3>
    <p>El NSC contiene sistemas de ventilación y control de humedad, extinción de incendios, grúas, plataformas de acceso y equipos robóticos. Su objetivo es evitar liberaciones, proteger el sarcófago de la lluvia y permitir la retirada controlada de materiales radiactivos.</p>
    <h3>Una vida útil condicionada</h3>
    <p>Fue diseñado para 100 años, pero su seguridad depende del mantenimiento y del contexto. En febrero de 2025, un ataque con dron dañó la estructura. La IAEA informó que perdió sus dos funciones principales: confinar materiales radiactivos y permitir el desmantelamiento seguro. En 2026 continúan las reparaciones.</p>
    <div class="modal-note"><strong>No es “para siempre”</strong>El NSC compra tiempo y crea condiciones de seguridad, pero el problema del combustible y de los residuos sigue abierto. La solución definitiva aún no existe.</div>
    <div class="modal-footer-line"><span>Fuentes: EBRD · IAEA · ChNPP</span><button type="button" class="src-inline" data-modal="sources">Ver bibliografía</button></div>
  `;
}

function rbmkHTML() {
  return `
    <p class="modal-lede">El RBMK-1000 era un reactor de grafito y agua en ebullición. Su diseño permitía producir 1.000 MWe, pero tenía características que lo hacían especialmente difícil de controlar a baja potencia.</p>
    <div class="radiation-intro">
      <div class="radiation-copy">
        <h3>El principio</h3>
        <p>Los neutrones liberados por la fisión del uranio son demasiado rápidos para mantener la reacción. El grafito los frena. El agua circula por tubos de presión, absorbe calor y se convierte en vapor para mover las turbinas.</p>
        <p>El agua también absorbe neutrones. Si se forman burbujas de vapor, hay menos agua y más neutrones disponibles: la reactividad puede aumentar. Ese <strong>coeficiente de vapor positivo</strong> era particularmente peligroso a baja potencia.</p>
      </div>
      <div class="radiation-diagram">
        <svg viewBox="0 0 420 270" role="img" aria-label="Esquema didáctico de un reactor RBMK">
          <defs><marker id="rbmkArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6z" fill="#d7a247"/></marker></defs>
          <rect width="420" height="270" fill="#090b0c"/>
          <rect x="44" y="38" width="150" height="180" fill="#343a35" stroke="#646b61"/>
          <g stroke="#a3a79c" stroke-width="1">
            <path d="M54 52v152M72 52v152M90 52v152M108 52v152M126 52v152M144 52v152M162 52v152M180 52v152"/>
          </g>
          <g fill="#d7a247">
            <rect x="68" y="26" width="5" height="62"/><rect x="118" y="26" width="5" height="78"/><rect x="168" y="26" width="5" height="52"/>
          </g>
          <rect x="44" y="218" width="150" height="10" fill="#62685f"/>
          <text x="57" y="252" fill="#8d908c" font-family="IBM Plex Mono, monospace" font-size="8">GRAFITO + CANALES</text>
          <text x="58" y="22" fill="#d7a247" font-family="IBM Plex Mono, monospace" font-size="8">BARRAS DE CONTROL</text>
          <path d="M194 150H300" stroke="#d7a247" stroke-width="1.2" marker-end="url(#rbmkArrow)"/>
          <text x="208" y="140" fill="#b7b2a5" font-family="IBM Plex Mono, monospace" font-size="8">VAPOR</text>
          <rect x="300" y="116" width="48" height="68" fill="#232927" stroke="#687068"/>
          <circle cx="324" cy="150" r="17" fill="none" stroke="#d7a247" stroke-width="2"/>
          <path d="M324 133v34M307 150h34M312 138l24 24M336 138l-24 24" stroke="#d7a247" stroke-width="1" opacity=".8"/>
          <text x="298" y="204" fill="#8d908c" font-family="IBM Plex Mono, monospace" font-size="8">TURBINA</text>
          <text x="298" y="220" fill="#676b68" font-family="IBM Plex Mono, monospace" font-size="7">electricidad</text>
        </svg>
      </div>
    </div>
    <h3>Cuatro datos para entenderlo</h3>
    <table class="data-table">
      <tbody>
        <tr><td>Potencia</td><td>3.200 MW térmicos / 1.000 MWe por unidad.</td></tr>
        <tr><td>Núcleo</td><td>Aproximadamente 7 m de alto y 12 m de diámetro; grafito y tubos de presión verticales.</td></tr>
        <tr><td>Control</td><td>211 barras; el diseño de sus extremos de grafito contribuyó al “positive scram”.</td></tr>
        <tr><td>Contención</td><td>Sin una estructura integral capaz de retener una liberación masiva como la de 1986.</td></tr>
      </tbody>
    </table>
    <div class="modal-note"><strong>No era una bomba</strong>Un RBMK no puede explotar como un arma nuclear. La explosión de 1986 fue una excursión de potencia seguida de explosiones de vapor y gases, no una detonación nuclear.</div>
    <div class="modal-footer-line"><span>Fuentes: WNA · INSAG-7 · IAEA</span><button type="button" class="src-inline" data-modal="sources">Ver bibliografía</button></div>
  `;
}

function mechanismHTML() {
  return `
    <p class="modal-lede">No hubo una sola causa. El accidente surgió de la interacción entre un diseño vulnerable, una operación en una zona inestable y una cultura que no convirtió el conocimiento técnico en una barrera eficaz.</p>
    <div class="construction-steps">
      <div class="construction-step"><span class="num">01</span><div><strong>Un reactor en zona prohibida</strong><p>Tras caer a unos 30 MWt, el reactor quedó envenenado por xenón. Los operadores lo estabilizaron en 200 MWt, lejos de los 700–1.000 MWt previstos, y con un margen de barras por debajo del mínimo.</p></div></div>
      <div class="construction-step"><span class="num">02</span><div><strong>Bombas, vapor y reactividad</strong><p>Las bombas adicionales aumentaron el caudal y redujeron la reactividad. Para compensar, se retiraron más barras. El núcleo se volvió más sensible a cualquier cambio de vapor.</p></div></div>
      <div class="construction-step"><span class="num">03</span><div><strong>El “positive scram”</strong><p>Al pulsar AZ-5, los desplazadores de grafito de las barras desplazaron agua en la parte inferior del núcleo. En lugar de reducir la reactividad de inmediato, la aumentaron localmente.</p></div></div>
      <div class="construction-step"><span class="num">04</span><div><strong>La excursión</strong><p>La potencia se disparó. El combustible se fragmentó, el vapor rompió los canales y la presión levantó la losa superior. Dos explosiones destruyeron el edificio.</p></div></div>
      <div class="construction-step"><span class="num">05</span><div><strong>La liberación</strong><p>Sin contención integral, los productos de fisión salieron al ambiente. El núcleo expuesto y los incendios mantuvieron emisiones durante días.</p></div></div>
    </div>
    <h3>Lo que sigue abierto</h3>
    <p>La cronología de los últimos segundos se reconstruye a partir de registros, modelos y testimonios. La contribución exacta de la excursión de potencia, la ebullición y la segunda explosión todavía se investiga. Lo que no está en duda es la combinación de factores: diseño, operación, información y supervisión.</p>
    <div class="modal-note"><strong>Para explicar sin simplificar</strong>Evita decir “fue culpa de un operador”. También evita decir “fue solo el diseño”. El accidente fue sistémico. El AZ-5 fue el detonante en un reactor que ya estaba fuera de una zona segura.</div>
    <div class="modal-footer-line"><span>Fuentes: INSAG-7 · WNA · IAEA</span><button type="button" class="src-inline" data-modal="sources">Ver bibliografía</button></div>
  `;
}

function mapMethodHTML() {
  return `
    <p class="modal-lede">El mapa es una herramienta didáctica, no un mapa oficial de contaminación. Los contornos y las partículas ayudan a entender la escala y la dirección general del transporte atmosférico; no deben leerse como límites de seguridad.</p>
    <h3>Qué muestra</h3>
    <p>Los países y sus posiciones aproximadas; la localización de Chernóbil; la detección en Forsmark (Suecia); y una representación de las trayectorias generales del penacho durante los primeros días.</p>
    <h3>Qué no muestra</h3>
    <p>No muestra umbrales de dosis ni fronteras de contaminación. La deposición real fue irregular, dependió de la lluvia y varió con cada pulso de liberación. Un mapa con una única “mancha” sería necesariamente falso.</p>
    <h3>Datos y límites</h3>
    <p>Los contornos proceden de Natural Earth (1:110 m), simplificados. Las direcciones del viento se basan en reconstrucciones históricas y se presentan como esquema. Las cifras territoriales y de dosis se citan desde UNSCEAR e IAEA.</p>
    <div class="modal-note"><strong>Cómo usarlo en clase</strong>Haz clic en un país para leer su relación con el accidente. Usa las vistas <em>Europa</em>, <em>Dispersión</em> y <em>Detección</em> para ordenar la explicación. Aclara que “detectable” no significa “peligroso”.</div>
    <div class="modal-footer-line"><span>Cartografía: Natural Earth · Datos: UNSCEAR · IAEA</span><button type="button" class="src-inline" data-modal="sources">Ver bibliografía</button></div>
  `;
}

function countryHTML(code) {
  const info = COUNTRY_INFO[code] || COUNTRY_INFO.default;
  return `
    <p class="modal-lede">${info.text}</p>
    <h3>Contexto radiológico</h3>
    <p>Las dosis medias en la mayor parte de Europa fueron inferiores a 1 mSv en el primer año, un valor comparable al fondo natural anual. En Ucrania, Bielorrusia y las regiones más afectadas de Rusia, las dosis y la deposición fueron mucho mayores. La comparación entre países debe hacerse con cuidado: los promedios nacionales ocultan diferencias locales.</p>
    <div class="modal-note"><strong>Lectura responsable</strong>La presencia de radionucleidos procedentes de Chernóbil se detectó en casi toda Europa. Eso no significa que toda Europa haya recibido una dosis peligrosa. La distancia, la lluvia y la dieta determinaron la exposición.</div>
    <div class="modal-footer-line"><span>Fuente: UNSCEAR · IAEA</span><button type="button" class="src-inline" data-modal="sources">Ver bibliografía</button></div>
  `;
}

const MODAL_BUILDERS = {
  sources: (arg) => ({ kicker: 'BIBLIOGRAFÍA', title: 'Fuentes y referencias', body: sourcesHTML(arg) }),
  timeline: () => ({ kicker: 'CRONOLOGÍA', title: '1986 — 2026', body: timelineHTML() }),
  help: () => ({ kicker: 'CONTROL DE LA PRESENTACIÓN', title: 'Cómo usar la experiencia', body: helpHTML() }),
  about: () => ({ kicker: 'MÉTODO Y CRÉDITOS', title: 'Sobre esta reconstrucción', body: aboutHTML() }),
  radiation: () => ({ kicker: 'CIENCIA · RADIACIÓN', title: 'Qué es la radiación ionizante', body: radiationHTML() }),
  health: () => ({ kicker: 'SALUD · DATOS', title: 'Lo confirmado y lo estimado', body: healthHTML() }),
  sarcophagus: () => ({ kicker: 'INGENIERÍA · 1986', title: 'Cómo se construyó el sarcófago', body: sarcophagusHTML() }),
  nsc: () => ({ kicker: 'INGENIERÍA · 2016—2026', title: 'El Nuevo Confinamiento Seguro', body: nscHTML() }),
  rbmk: () => ({ kicker: 'TECNOLOGÍA · RBMK-1000', title: 'Cómo funcionaba el reactor', body: rbmkHTML() }),
  mechanism: () => ({ kicker: 'CAUSAS · SECUENCIA', title: 'Por qué ocurrió', body: mechanismHTML() }),
  mapMethod: () => ({ kicker: 'CARTOGRAFÍA · MÉTODO', title: 'Cómo leer el mapa', body: mapMethodHTML() }),
  country: (code) => ({ kicker: 'MAPA · PAÍS', title: (COUNTRY_INFO[code] || COUNTRY_INFO.default).name, body: countryHTML(code) })
};

function openModal(key, arg) {
  const builder = MODAL_BUILDERS[key];
  if (!builder) return;
  const def = builder(arg);
  const root = $('#modal-root');
  $('#modal-kicker').textContent = def.kicker;
  $('#modal-title').textContent = def.title;
  $('#modal-body').innerHTML = def.body;
  root.classList.add('is-open');
  root.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  STATE.modalOpen = key;
  STATE.lastFocus = document.activeElement;
  setTimeout(() => $('#modal-close').focus({ preventScroll: true }), 30);
  const body = $('#modal-body');
  body.scrollTop = 0;
  if (key === 'sources' && arg) {
    const el = body.querySelector(`.source-item.is-highlighted`);
    if (el) setTimeout(() => el.scrollIntoView({ block: 'center', behavior: 'smooth' }), 120);
  }
  if (key === 'timeline') {
    $$('.tl-event', body).forEach((el) => {
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const idx = Number(el.dataset.goto);
          closeModal();
          setTimeout(() => goToChapter(idx), 220);
        }
      });
    });
  }
}

function closeModal() {
  const root = $('#modal-root');
  if (!root.classList.contains('is-open')) return;
  root.classList.remove('is-open');
  root.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  STATE.modalOpen = null;
  const last = STATE.lastFocus;
  if (last && last.focus) setTimeout(() => last.focus({ preventScroll: true }), 30);
}

function openSources(highlight) {
  openModal('sources', highlight);
}
function openTimeline() { openModal('timeline'); }

function trapModalFocus(e) {
  if (e.key !== 'Tab' || !STATE.modalOpen) return;
  const root = $('#modal-root');
  const focusables = $$('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])', root)
    .filter((el) => el.offsetParent !== null);
  if (!focusables.length) return;
  const first = focusables[0], last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault(); last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault(); first.focus();
  }
}

/* ---------- Lógica de UI ---------- */
function initUI() {
  renderRail();
  updateSoundUI();
  STATE.visited = new Set();

  $('#enter-btn').addEventListener('click', beginExperience);
  $('#reading-link').addEventListener('click', () => showFallback('No se pudo iniciar el motor 3D.'));

  $$('.tab[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => setTab(btn.dataset.tab));
  });
  $('#tab-collapse').addEventListener('click', togglePanel);
  $('#panel-reopen').addEventListener('click', togglePanel);

  // Delegación de controles de escena.
  $('#view-pills').addEventListener('click', (e) => {
    const btn = e.target.closest('.view-pill');
    if (!btn) return;
    setView(btn.dataset.view);
  });
  $('#scene-actions').addEventListener('click', (e) => {
    const modalBtn = e.target.closest('[data-modal]');
    if (modalBtn) { openModal(modalBtn.dataset.modal); return; }
    const playBtn = e.target.closest('[data-play-sequence]');
    if (playBtn) {
      if (!SCENE.module || !SCENE.module.playSequence) {
        showToast('La escena todavía no está lista para reproducir la secuencia.');
        return;
      }
      // Si la presentación estaba en pausa, el botón reanuda la secuencia.
      const wasPaused = STATE.paused;
      if (wasPaused) togglePause();
      if (STATE.sequencePlaying) {
        if (wasPaused) {
          syncSequenceButton();
          showToast('Secuencia reanudada.', 1800);
          return;
        }
        // Segundo clic durante la reproducción: detener en el paso actual.
        if (SCENE.module.setStep) SCENE.module.setStep(STATE.currentStep);
        STATE.sequencePlaying = false;
        syncSequenceButton();
        showToast('Secuencia detenida. Puedes reanudarla desde cualquier paso.', 2200);
        return;
      }
      STATE.sequencePlaying = true;
      SCENE.module.playSequence();
      syncSequenceButton();
      showToast('Secuencia iniciada. Usa «Detener secuencia» o el botón de pausa para controlarla.', 3400);
      return;
    }
    const reflection = e.target.closest('[data-reflection]');
    if (reflection) { openReflection(); return; }
    const reset = e.target.closest('[data-reset-view]');
    if (reset && SCENE.module && SCENE.module.resetView) SCENE.module.resetView();
  });
  $('#sequence-track').addEventListener('click', (e) => {
    const btn = e.target.closest('.seq-step');
    if (!btn || !SCENE.module || !SCENE.module.setStep) return;
    STATE.sequencePlaying = false;
    SCENE.module.setStep(Number(btn.dataset.step));
    syncSequenceButton();
  });

  // Navegación.
  $('#btn-prev').addEventListener('click', () => goToChapter(STATE.chapter - 1));
  $('#btn-next').addEventListener('click', () => goToChapter(STATE.chapter + 1));
  $('#btn-prev-panel').addEventListener('click', () => goToChapter(STATE.chapter - 1));
  $('#btn-next-panel').addEventListener('click', () => goToChapter(STATE.chapter + 1));
  $('#btn-pause').addEventListener('click', togglePause);
  $('#btn-labels').addEventListener('click', toggleLabels);
  $('#btn-timeline').addEventListener('click', openTimeline);
  $('#btn-sources').addEventListener('click', () => openSources());
  $('#btn-help').addEventListener('click', () => openModal('help'));
  $('#btn-fullscreen').addEventListener('click', toggleFullscreen);
  $('#btn-sound').addEventListener('click', () => {
    STATE.sound = !STATE.sound;
    const ok = AUDIO.toggle(STATE.sound);
    if (!ok) { STATE.sound = false; showToast('El audio no está disponible en este navegador.'); }
    updateSoundUI();
    if (STATE.sound) AUDIO.profile(STATE.chapter);
    showToast(STATE.sound ? 'Ambiente sonoro activado' : 'Silencio');
  });

  $('#brand').addEventListener('click', (e) => {
    e.preventDefault();
    if (STATE.started) goToChapter(0);
  });

  // Cierre de modales.
  $('#modal-close').addEventListener('click', closeModal);
  $$('[data-close-modal]').forEach((el) => el.addEventListener('click', closeModal));
  $('#modal-root').addEventListener('click', (e) => {
    const closeBtn = e.target.closest('[data-close-modal]');
    if (closeBtn) closeModal();
    const modalBtn = e.target.closest('[data-modal]');
    if (modalBtn) { openModal(modalBtn.dataset.modal); return; }
    const goto = e.target.closest('[data-goto]');
    if (goto) {
      const idx = Number(goto.dataset.goto);
      closeModal();
      setTimeout(() => goToChapter(idx), 230);
    }
  });

  // Citas y referencias dentro del panel y los modales.
  document.addEventListener('click', (e) => {
    const src = e.target.closest('[data-source]');
    if (src) {
      e.preventDefault();
      openSources(src.dataset.source);
    }
  });

  // Tarjeta de mapa.
  $('#map-card-close').addEventListener('click', closeMapCard);
  $('#map-card-source').addEventListener('click', () => openSources('unscear'));
  $('#reflection-close').addEventListener('click', closeReflection);
  $('#reflection-overlay').addEventListener('click', (e) => {
    if (e.target === $('#reflection-overlay')) closeReflection();
  });

  // Pantalla completa.
  document.addEventListener('fullscreenchange', () => {
    const active = !!document.fullscreenElement;
    $('#fullscreen-ico').textContent = active ? '⛶' : '⛶';
    $('#btn-fullscreen').setAttribute('aria-label', active ? 'Salir de pantalla completa' : 'Pantalla completa');
  });

  // Teclado.
  document.addEventListener('keydown', onKeyDown);

  // Resize: evita que el panel quede abierto en un estado inconsistente.
  window.addEventListener('resize', () => {
    const wasMobile = STATE.mobile;
    STATE.mobile = window.innerWidth <= 900;
    if (wasMobile !== STATE.mobile && !STATE.panelHidden) {
      // En móvil el panel ocupa la escena; no cambiamos a mitad de una explicación.
    }
  });

  // Libera timers de audio al cerrar.
  window.addEventListener('beforeunload', () => {
    if (AUDIO.clickTimer) clearTimeout(AUDIO.clickTimer);
  });

  installPointerEvents();
}

function openReflection() {
  const quote = CHAPTERS[STATE.chapter].quote;
  if (quote) $('#reflection-quote').textContent = quote.replace(/^«|»$/g, '').replace(/^“|”$/g, '');
  const overlay = $('#reflection-overlay');
  overlay.classList.add('is-open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('reflection-mode');
  $('#reflection-close').focus({ preventScroll: true });
}

function closeReflection() {
  const overlay = $('#reflection-overlay');
  overlay.classList.remove('is-open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('reflection-mode');
  setTimeout(() => $('#narrative').focus({ preventScroll: true }), 100);
}

function togglePause() {
  STATE.paused = !STATE.paused;
  document.body.classList.toggle('paused', STATE.paused);
  $('#app').classList.toggle('paused', STATE.paused);
  const btn = $('#btn-pause');
  btn.classList.toggle('is-paused', STATE.paused);
  btn.setAttribute('aria-pressed', STATE.paused ? 'true' : 'false');
  btn.setAttribute('aria-label', STATE.paused ? 'Reanudar animaciones' : 'Pausar animaciones');
  btn.title = STATE.paused ? 'Reanudar animaciones (Espacio)' : 'Pausar animaciones (Espacio)';
  syncSequenceButton();
  showToast(STATE.paused ? 'Animaciones en pausa · la cámara sigue disponible' : 'Reproducción reanudada', 1800);
}

function toggleLabels() {
  STATE.labels = !STATE.labels;
  $('#btn-labels').classList.toggle('is-on', STATE.labels);
  $('#btn-labels').setAttribute('aria-pressed', STATE.labels ? 'true' : 'false');
  $('#label-layer').classList.toggle('labels-off', !STATE.labels);
  showToast(STATE.labels ? 'Etiquetas 3D visibles' : 'Etiquetas 3D ocultas', 1600);
}

function togglePanel() {
  STATE.panelHidden = !STATE.panelHidden;
  $('#app').classList.toggle('panel-hidden', STATE.panelHidden);
  $('#panel-reopen').classList.toggle('is-visible', STATE.panelHidden);
  applyCompositionOffset();
  if (!STATE.panelHidden) setTimeout(() => $('#narrative').focus({ preventScroll: true }), 150);
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    const root = document.documentElement;
    if (root.requestFullscreen) {
      root.requestFullscreen().catch(() => showToast('El navegador no permitió el modo de pantalla completa.'));
    } else {
      showToast('Este navegador no admite pantalla completa.');
    }
  } else {
    document.exitFullscreen().catch(() => {});
  }
}

function onKeyDown(e) {
  if (document.body.classList.contains('reflection-mode')) {
    if (e.key === 'Escape') { e.preventDefault(); closeReflection(); }
    return;
  }
  if (STATE.modalOpen) {
    if (e.key === 'Escape') { e.preventDefault(); closeModal(); return; }
    trapModalFocus(e);
    return;
  }
  const tag = (e.target.tagName || '').toLowerCase();
  const typing = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable;
  if (typing) return;
  if (e.key === 'ArrowRight') {
    e.preventDefault(); goToChapter(STATE.chapter + 1);
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault(); goToChapter(STATE.chapter - 1);
  } else if (e.code === 'Space') {
    if (e.target.closest('button, a')) return;
    e.preventDefault(); togglePause();
  } else if (e.key.toLowerCase() === 'h') {
    e.preventDefault(); togglePanel();
  } else if (e.key.toLowerCase() === 'l') {
    e.preventDefault(); toggleLabels();
  } else if (e.key.toLowerCase() === 't') {
    e.preventDefault(); openTimeline();
  } else if (e.key.toLowerCase() === 'f') {
    e.preventDefault(); openSources();
  } else if (e.key === '?' || e.key === '/') {
    e.preventDefault(); openModal('help');
  } else if (e.key === 'Escape') {
    if (STATE.panelHidden) togglePanel();
  }
}

/* ---------- Modo lectura (fallback) ---------- */
function showFallback(reason) {
  try {
    const fallback = $('#fallback');
    fallback.hidden = false;
    const start = $('#start-screen');
    if (start) start.style.display = 'none';
    const app = $('#app');
    if (app) app.style.display = 'none';
    if (reason) {
      const lead = $('.fallback-lead', fallback);
      if (lead) lead.textContent = `${reason} La presentación sigue disponible como documento de lectura, con la misma cronología, el guion del expositor y las referencias.`;
    }
    const nav = $('#fallback-nav');
    nav.innerHTML = CHAPTERS.map((ch) => `<a href="#lectura-${ch.id}">${ch.num} · ${ch.title}</a>`).join('');
    const content = $('#fallback-content');
    content.innerHTML = CHAPTERS.map((ch) => `
      <article class="fallback-chapter" id="lectura-${ch.id}">
        <div class="fmeta">${ch.eyebrow} · ${ch.place}</div>
        <h2>${ch.num} · ${ch.title}</h2>
        <p>${ch.lead}</p>
        <div class="fstats">${ch.stats.map((s) => `<span><b>${s.value}${s.unit ? ' ' + s.unit : ''}</b>${s.label}</span>`).join('')}</div>
        ${ch.sections.map((sec) => `<h3>${sec.heading}</h3>${sec.body.map((p) => `<p>${p}</p>`).join('')}`).join('')}
        <h3>Guion del expositor</h3>
        ${ch.notes.body.map((p) => `<p>${p}</p>`).join('')}
        <p class="fnotes">${ch.notes.transition}</p>
      </article>
    `).join('');
    const sources = $('#fallback-sources');
    sources.innerHTML = `<h2 style="font-family:var(--font-display);font-size:34px;font-weight:500;text-transform:uppercase;margin:0 0 10px">Fuentes</h2>` +
      SOURCE_ORDER.map((id) => `<a href="${SOURCES[id].url}" target="_blank" rel="noopener noreferrer">${SOURCES[id].title} — ${SOURCES[id].type} ↗</a>`).join('');
    document.body.style.overflow = 'auto';
    fallback.focus && fallback.focus();
    console.info('Modo lectura activo. Motivo:', reason || 'WebGL no disponible');
  } catch (err) {
    console.error('No se pudo activar el modo lectura:', err);
    const fb = document.createElement('div');
    fb.style.cssText = 'position:fixed;inset:0;z-index:999;background:#0a0c0d;color:#e9e3d7;padding:40px;font-family:system-ui;overflow:auto';
    fb.innerHTML = `<h1>Chernóbil · La noche que cambió la historia</h1><p>El motor 3D no pudo cargarse. Consulta las fuentes en <a style="color:#d7a247" href="https://www.iaea.org/topics/chornobyl" target="_blank" rel="noopener noreferrer">IAEA</a> y <a style="color:#d7a247" href="https://www.unscear.org/unscear/en/areas-of-work/chernobyl.html" target="_blank" rel="noopener noreferrer">UNSCEAR</a>.</p>`;
    document.body.appendChild(fb);
  }
}

function webglAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}
