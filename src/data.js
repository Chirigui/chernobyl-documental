/* ============================================================
   DATOS HISTÓRICOS, NARRATIVA Y FUENTES
   Todo el contenido está en español y separado de la lógica 3D.
   Las cifras se presentan con su grado de certeza y su fuente.
   ============================================================ */

const SOURCES = {
  iaea: {
    short: 'IAEA',
    type: 'Organismo internacional',
    title: 'The 1986 Chornobyl nuclear power plant accident',
    note: 'Página temática de la IAEA sobre el accidente, la respuesta internacional y la situación del sitio.',
    url: 'https://www.iaea.org/topics/chornobyl'
  },
  iaeaFaq: {
    short: 'IAEA · FAQ',
    type: 'Preguntas frecuentes',
    title: 'Chernobyl Accident — Frequently Asked Questions',
    note: 'Cifras de evacuación, consecuencias, estado del sarcófago y del Nuevo Confinamiento Seguro.',
    url: 'https://www.iaea.org/topics/chornobyl/faqs'
  },
  insag7: {
    short: 'INSAG-7',
    type: 'Informe técnico',
    title: 'The Chernobyl Accident: Updating of INSAG-1',
    note: 'Informe del Grupo Consultivo Internacional sobre Seguridad Nuclear (IAEA, 1992). Referencia central sobre la secuencia y las causas.',
    url: 'https://www-pub.iaea.org/MTCD/publications/PDF/Pub913e_web.pdf'
  },
  unscear: {
    short: 'UNSCEAR',
    type: 'Evaluación científica de la ONU',
    title: 'The Chornobyl Accident — Assessments of radiation effects',
    note: 'Dosis, efectos sobre la salud y conclusiones del Comité Científico de las Naciones Unidas.',
    url: 'https://www.unscear.org/unscear/en/areas-of-work/chernobyl.html'
  },
  unscear2008: {
    short: 'UNSCEAR 2008',
    type: 'Informe científico',
    title: 'UNSCEAR 2008, Annex D: Health effects due to radiation from the Chernobyl accident',
    note: 'Evaluación exhaustiva de dosis y efectos sanitarios publicada en 2011.',
    url: 'https://www.unscear.org/unscear/en/publications/2008_2.html'
  },
  whoQA: {
    short: 'OMS',
    type: 'Organización Mundial de la Salud',
    title: 'Radiation: The Chernobyl accident',
    note: 'Resumen de dosis, síndrome de irradiación aguda, cáncer de tiroides, salud mental y proyecciones.',
    url: 'https://www.who.int/news-room/questions-and-answers/item/radiation-the-chernobyl-accident'
  },
  whoHealth: {
    short: 'OMS · 2006',
    type: 'Informe sanitario',
    title: 'Health effects of the Chernobyl accident and special health care programmes',
    note: 'Informe del Grupo de Expertos en Salud del Foro de Chernóbil (OMS, 2006).',
    url: 'https://www.who.int/publications/i/item/9241594179'
  },
  iaeaForum: {
    short: 'Foro de Chernóbil',
    type: 'Evaluación interinstitucional',
    title: 'Chernobyl’s Legacy: Health, Environmental and Socio-Economic Impacts',
    note: 'Informe de síntesis del Foro de Chernóbil (IAEA, OMS y otros organismos de la ONU, 2005–2006).',
    url: 'https://www.iaea.org/sites/default/files/chernobyl.pdf'
  },
  iaeaEnv: {
    short: 'IAEA · Ambiente',
    type: 'Informe ambiental',
    title: 'Environmental Consequences of the Chernobyl Accident and their Remediation',
    note: 'Veinte años de experiencia en contaminación, remediación y ecosistemas.',
    url: 'https://www.iaea.org/publications/7382/environmental-consequences-of-the-chernobyl-accident-and-their-remediation-twenty-years-of-experience'
  },
  wna: {
    short: 'WNA',
    type: 'Síntesis técnica',
    title: 'Chernobyl Accident 1986',
    note: 'Síntesis de la World Nuclear Association con referencias a IAEA y UNSCEAR.',
    url: 'https://world-nuclear.org/information-library/safety-and-security/safety-of-plants/chernobyl-accident'
  },
  wnaSeq: {
    short: 'WNA · cronología',
    type: 'Cronología técnica',
    title: 'Chernobyl Accident — Appendix 1: Sequence of Events',
    note: 'Reconstrucción horaria basada en INSAG-7 y en la comisión soviética de 1991.',
    url: 'https://world-nuclear.org/information-library/appendices/chernobyl-accident-appendix-1-sequence-of-events'
  },
  ebrd: {
    short: 'EBRD',
    type: 'Financiador internacional',
    title: 'Making Chornobyl safe',
    note: 'Información sobre el Nuevo Confinamiento Seguro y el fondo internacional.',
    url: 'https://www.ebrd.com/home/what-we-do/focus-areas/nuclear-safety/making-chornobyl-safe.html'
  },
  chnpp: {
    short: 'ChNPP',
    type: 'Operador del sitio',
    title: 'SSE Chernobyl NPP — sitio oficial',
    note: 'Información del operador sobre la central, el desmantelamiento y el estado actual.',
    url: 'https://www.chnpp.gov.ua/en/home'
  },
  naturalEarth: {
    short: 'Natural Earth',
    type: 'Datos cartográficos',
    title: 'Admin 0 — Countries (escala 1:110 m)',
    note: 'Contornos de países de dominio público, simplificados y adaptados para el mapa 3D.',
    url: 'https://www.naturalearthdata.com/downloads/110m-cultural-vectors/110m-admin-0-countries/'
  }
};

const CHAPTERS = [
  {
    id: 1,
    num: '01',
    eyebrow: 'EL CONTEXTO · 1970—1986',
    place: 'Prípiat · RSS de Ucrania · Unión Soviética',
    title: 'Una ciudad construida para un reactor',
    subtitle: '¿Qué era Chernóbil antes de la noche del 26 de abril?',
    lead: 'En el norte de Ucrania, a orillas del río Prípiat, la URSS levantó una de sus mayores centrales nucleares. A tres kilómetros, la ciudad de Prípiat albergaba a las familias que la operaban. Entender cómo funcionaba aquel complejo es el primer paso para entender cómo pudo fallar.',
    stats: [
      { value: '4', unit: '', label: 'reactores RBMK-1000 en operación', source: 'iaea' },
      { value: '3.200', unit: 'MWt', label: 'potencia térmica nominal por reactor', source: 'wna' },
      { value: '49.360', unit: '', label: 'habitantes de Prípiat en 1986', source: 'iaeaFaq' }
    ],
    keys: [
      { n: '01', text: 'La central se encontraba a 110 km al norte de Kiev, cerca de la frontera con Bielorrusia.' },
      { n: '02', text: 'El RBMK-1000 usaba grafito como moderador y agua ligera como refrigerante.' },
      { n: '03', text: 'Los cuatro reactores no tenían una contención integral capaz de retener una liberación masiva.' },
      { n: '04', text: 'Prípiat fue planificada como una ciudad joven y moderna para el personal de la planta.' }
    ],
    sections: [
      {
        heading: 'La central',
        body: [
          'La central nuclear de Chernóbil se construyó en la República Socialista Soviética de Ucrania, a unos 110 kilómetros al norte de Kiev y a menos de 20 kilómetros de la frontera con Bielorrusia. El complejo se levantó junto al río Prípiat, un afluente del Dniéper, y utilizaba un gran estanque artificial de unas 22 km² para refrigerar sus reactores.',
          'Los bloques 1 y 2 entraron en servicio en 1977 y 1978; los bloques 3 y 4, en 1981 y 1983. En abril de 1986 los cuatro reactores RBMK-1000 estaban operativos y había dos unidades más en construcción. <strong>Una peculiaridad importante: Chernóbil no usaba torres de refrigeración hiperbólicas.</strong> Su refrigeración principal era el estanque, por lo que la reconstrucción de esta escena evita ese elemento tantas veces añadido por error.'
        ],
        source: 'iaea'
      },
      {
        heading: 'Cómo funcionaba un RBMK-1000',
        body: [
          'Un reactor nuclear produce calor mediante una reacción en cadena controlada: los neutrones dividen núcleos de uranio y liberan energía. En un RBMK-1000, el combustible era dióxido de uranio ligeramente enriquecido dentro de tubos de presión verticales. El agua circulaba por esos canales, absorbía calor y se convertía en vapor para mover dos turbinas de 500 MWe cada una.',
          'El grafito, que rodeaba los canales, moderaba los neutrones para mantener la reacción. El agua cumplía dos funciones: refrigerar y absorber parte de los neutrones. Esa doble función era clave. Si el agua hervía y se formaban burbujas de vapor, absorbía menos neutrones; en ciertas condiciones, la reacción podía aumentar. Es el llamado <strong>coeficiente de vapor positivo</strong>, una característica que volvía al reactor especialmente difícil de controlar a baja potencia.'
        ],
        source: 'wna'
      },
      {
        heading: 'Un diseño sin red de seguridad completa',
        body: [
          'El RBMK-1000 tenía 211 barras de control y un sistema de parada de emergencia, pero su diseño no incluía una estructura de contención robusta como las de muchos reactores occidentales. La combinación de grafito, canales de presión y un coeficiente de vapor positivo no era un secreto técnico; lo que faltó fue un análisis independiente capaz de convertir ese conocimiento en reglas de operación seguras. <span class="inline-cite" data-source="insag7">INSAG-7</span>',
          'La información sobre los límites del reactor tampoco llegaba con claridad a los operadores. El margen de reactividad operativo (ORM), una medida del margen disponible para controlar la reacción, se trataba como un parámetro de potencia y no como una condición vital de seguridad.'
        ],
        source: 'insag7'
      },
      {
        heading: 'Prípiat, la ciudad de los trabajadores',
        body: [
          'Prípiat fue fundada en 1970 para alojar al personal de la central y a sus familias. A 3 km del complejo, era una ciudad planificada: bloques de apartamentos, escuelas, hospital, piscina, palacio de cultura y un parque de atracciones que debía inaugurarse el 1 de mayo de 1986. Su población media era muy joven. En abril de 1986 vivían allí 49.360 personas.',
          'La central y la ciudad formaban un mismo sistema humano. Los turnos de la planta marcaban el ritmo de Prípiat; la ciudad dependía de la central para el empleo, la calefacción y la identidad colectiva. Esa cercanía explica por qué el accidente no fue solo un problema industrial: en pocas horas, una comunidad entera quedaría suspendida en el tiempo.'
        ],
        source: 'iaeaFaq'
      }
    ],
    reconstruction: 'Reconstrucción esquemática del complejo. Las proporciones y distancias se han simplificado para poder leer la escena. No se incluyen torres hiperbólicas porque la refrigeración principal era el estanque artificial.',
    quote: '“Una central nuclear no es solo una máquina: es una promesa de control.” — Reflexión del guion.',
    sourceIds: ['iaea', 'wna', 'insag7', 'iaeaFaq'],
    notes: {
      time: '≈ 2 min',
      body: [
        'Empecemos por el lugar. Estamos en el norte de Ucrania, en 1986, todavía dentro de la Unión Soviética. A la izquierda de la imagen tienen el complejo: cuatro reactores RBMK-1000 en línea, el estanque de refrigeración y, al fondo, la ciudad de Prípiat. Es importante señalar que Chernóbil no tenía torres de refrigeración como las que solemos imaginar: usaba un enorme estanque artificial.',
        'Un RBMK era un reactor de grafito y agua en ebullición. El grafito mantenía la reacción de neutrones y el agua refrigeraba el núcleo. El problema es que el agua también absorbía neutrones. Si se formaban burbujas de vapor, el reactor podía ganar reactividad. A potencia alta eso se compensaba; a baja potencia, el margen se estrechaba. Ese detalle técnico será decisivo en el capítulo 2.',
        'Prípiat estaba a solo tres kilómetros. Allí vivían casi cincuenta mil personas. La ciudad era joven, moderna, y su parque de atracciones iba a inaugurarse el 1 de mayo. Nadie estaba preparado para lo que ocurriría seis días antes.'
      ],
      transition: 'El 25 de abril, el reactor 4 iba a apagarse para mantenimiento. Aprovecharían la parada para una prueba de seguridad. Lo que parecía una rutina se convertiría en una trampa.'
    },
    scene: 'Complejo de Chernóbil',
    views: [
      { id: 'plant', label: 'Complejo' },
      { id: 'core', label: 'Cómo funciona' },
      { id: 'city', label: 'Prípiat' },
      { id: 'water', label: 'Estanque' }
    ],
    actions: [{ label: 'Ficha del RBMK', modal: 'rbmk' }],
    sourceIds: ['iaea', 'wna', 'insag7', 'iaeaFaq'],
    metaLocation: 'COMPLEJO DE CHERNÓBIL · 1986'
  },

  {
    id: 2,
    num: '02',
    eyebrow: '25—26 ABRIL 1986 · 00:00—01:23',
    place: 'Reactor 4 · Central de Chernóbil',
    title: 'Un experimento en el peor momento',
    subtitle: 'La prueba de seguridad que debía demostrar que todo estaba bajo control',
    lead: 'El reactor 4 iba a apagarse para mantenimiento. Aprovechando la parada, los ingenieros probarían si la inercia de una turbina podía alimentar las bombas de refrigeración hasta que arrancaran los generadores diésel. La prueba era eléctrica; el reactor, sin embargo, entraría en una zona de operación prohibida.',
    stats: [
      { value: '200', unit: 'MWt', label: 'potencia estabilizada para la prueba, lejos de los 700–1.000 previstos', source: 'wnaSeq' },
      { value: '8', unit: '/ 15', label: 'margen de reactividad (ORM) frente al mínimo exigido', source: 'insag7' },
      { value: '01:23:40', unit: '', label: 'pulsación del botón de parada de emergencia AZ-5', source: 'wnaSeq' }
    ],
    keys: [
      { n: '01', text: 'La prueba buscaba demostrar que la turbina podía alimentar las bombas durante el apagado.' },
      { n: '02', text: 'La demanda eléctrica de Kiev obligó a mantener el reactor a media potencia hasta la noche.' },
      { n: '03', text: 'La caída de potencia a unos 30 MWt dejó el núcleo envenenado por xenón y muy inestable.' },
      { n: '04', text: 'Los operadores extrajeron demasiadas barras para recuperar potencia; el margen de seguridad quedó por debajo del límite.' }
    ],
    sections: [
      {
        heading: 'El experimento',
        body: [
          'La prueba consistía en medir cuánto tiempo podían seguir girando las turbinas por inercia después de cerrar el suministro de vapor, y si esa electricidad bastaba para mantener las bombas de circulación hasta que entraran en servicio los generadores diésel. Se había intentado en 1985; el nuevo ensayo utilizaba reguladores de voltaje distintos.',
          'El procedimiento incluía desconectar el sistema de refrigeración de emergencia (ECCS). La desconexión no fue la causa directa del accidente, pero muestra el ambiente de confianza excesiva con el que se preparó: una prueba de naturaleza eléctrica se ejecutó sin una evaluación independiente de sus implicaciones nucleares.'
        ],
        source: 'wnaSeq'
      },
      {
        heading: 'Los retrasos y el turno de noche',
        body: [
          'La reducción de potencia comenzó el 25 de abril, pero el operador de la red de Kiev pidió mantener el reactor a unos 1.600 MWt para cubrir la demanda. La prueba se retrasó nueve horas. Cuando por fin se reanudó el descenso, se acercaba el cambio de turno de medianoche.',
          'A las 00:28 del 26 de abril, durante el paso al control automático, la potencia se desplomó hasta unos 30 MWt. Las causas exactas de esa caída siguen discutiéndose; pudo intervenir un error de consigna, una respuesta del regulador o ambas cosas. Lo cierto es que el reactor quedó en un estado de xenón profundo: el xenón-135 absorbía neutrones y hacía muy difícil recuperar potencia.'
        ],
        source: 'insag7'
      },
      {
        heading: 'La zona prohibida',
        body: [
          'Para volver a subir la potencia, los operadores retiraron muchas barras de control. A la 01:00 habían estabilizado el reactor en unos 200 MWt, pero el margen de reactividad operativo había caído a un equivalente de ocho barras cuando el mínimo permitido era quince. Esa información no era fácil de interpretar en la sala de control.',
          'Después se pusieron en marcha bombas adicionales. El mayor caudal enfrió el núcleo, redujo la formación de vapor y disminuyó la reactividad; para compensar, se extrajeron más barras. El nivel de los separadores de vapor se volvió difícil de controlar y se desactivaron algunas protecciones automáticas. El reactor quedó preparado para una prueba que ya no podía considerarse segura.'
        ],
        source: 'insag7'
      },
      {
        heading: 'Los cuarenta segundos decisivos',
        body: [
          'A las 01:23:04 comenzó la prueba: se cerraron las válvulas de las turbinas y las bombas empezaron a girar por inercia. Durante unos treinta segundos los parámetros parecieron mantenerse dentro de lo previsto. Después, a las 01:23:40, el operador pulsó AZ-5, el botón de parada de emergencia.',
          'Las barras comenzaron a entrar. Pero su diseño incluía desplazadores de grafito que, al bajar, desplazaban agua del extremo inferior del núcleo y añadían reactividad local. A eso se sumó el vapor creciente. La potencia se disparó. A las 01:23:43 se activaron las señales de excursión y, en segundos, el reactor dejó de ser controlable. <strong>No fue solo “un botón pulsado”: fue un diseño que convertía una maniobra de parada en un riesgo.</strong>'
        ],
        source: 'wnaSeq'
      }
    ],
    reconstruction: 'La sala de control está inspirada en la del bloque 4, pero su distribución, paneles e indicadores son una interpretación educativa. No se reproducen diálogos ni se atribuyen acciones a personas concretas. La secuencia temporal se basa en INSAG-7 y en la cronología de la WNA.',
    quote: 'La prueba debía demostrar que la central podía prescindir de la red. Terminó demostrando lo contrario: que el reactor dependía de un margen que ya se había agotado.',
    sourceIds: ['insag7', 'wnaSeq', 'iaea', 'iaeaFaq'],
    notes: {
      time: '≈ 2 min 30 s',
      body: [
        'La idea de la prueba era sencilla: si se corta la electricidad, ¿puede la turbina, mientras se detiene, mantener las bombas hasta que arranquen los diésel? Era una prueba de seguridad, no un experimento para forzar el reactor. Pero se hizo sin coordinación suficiente entre el equipo eléctrico y el equipo nuclear.',
        'La demanda de Kiev retrasó el apagado. Cuando el reactor bajó a 200 megavatios, apenas el seis por ciento de su potencia nominal, entró en una zona muy inestable. Para compensar el xenón y las bombas adicionales, se sacaron demasiadas barras. El margen de seguridad era de 8 barras cuando debía ser al menos 15. Los operadores no veían ese número con claridad.',
        'A las 01:23:40 se pulsa AZ-5, la parada de emergencia. Las barras empiezan a bajar y, por su diseño, desplazan agua con grafito en la parte inferior. Eso añade reactividad donde el núcleo ya estaba inestable. En segundos, la potencia se dispara. La escena muestra la telemetría; el siguiente capítulo muestra qué ocurrió físicamente.'
      ],
      transition: 'La potencia ya no era una variable: era una explosión en cámara lenta. A las 01:23:44, el reactor 4 se abrió.'
    },
    scene: 'Sala de control del reactor 4',
    views: [
      { id: 'room', label: 'Sala de control' },
      { id: 'desk', label: 'Mesa del operador' },
      { id: 'core', label: 'Núcleo' }
    ],
    actions: [],
    sequence: {
      title: 'SECUENCIA DE LA PRUEBA',
      steps: [
        { label: '25 abr · 14:00', caption: 'Se aísla el sistema de refrigeración de emergencia (ECCS) para la prueba.' },
        { label: '23:10', caption: 'La demanda de la red permite reanudar el descenso de potencia.' },
        { label: '00:28', caption: 'La potencia cae inesperadamente hasta unos 30 MWt; el xenón envenena el núcleo.' },
        { label: '01:00', caption: 'Se estabiliza en unos 200 MWt con el margen de barras por debajo del mínimo.' },
        { label: '01:19', caption: 'Bombas adicionales, nivel de vapor y protecciones desactivadas: el reactor es inestable.' },
        { label: '01:23:40', caption: 'Se pulsa AZ-5. Las barras entran y la reactividad se dispara.' }
      ]
    },
    initialStep: 3,
    sourceIds: ['insag7', 'wnaSeq', 'iaeaFaq', 'iaea'],
    metaLocation: 'REACTOR 4 · SALA DE CONTROL · 26.04.1986'
  },

  {
    id: 3,
    num: '03',
    eyebrow: '26 ABRIL 1986 · 01:23',
    place: 'Unidad 4 · 01:23:40–01:24 (hora local)',
    title: 'La noche en que el reactor se abrió',
    subtitle: 'La explosión del bloque 4 y la liberación de material radiactivo',
    lead: 'En menos de un minuto, una subida brusca de potencia rompió el orden del reactor. El combustible se fragmentó, el vapor rompió los canales y la losa superior de 1.000 toneladas cedió. Dos explosiones destruyeron el edificio y dejaron el núcleo expuesto a la atmósfera.',
    stats: [
      { value: '01:23:40', unit: '', label: 'pulsación de AZ-5; las explosiones llegan segundos después', source: 'wnaSeq' },
      { value: '1.000', unit: 't', label: 'losa superior del reactor desplazada por la presión', source: 'wnaSeq' },
      { value: '2', unit: '', label: 'explosiones separadas por 2–3 segundos', source: 'wna' }
    ],
    keys: [
      { n: '01', text: 'La excursión de potencia fragmentó el combustible y generó vapor a una presión extraordinaria.' },
      { n: '02', text: 'La primera explosión fue de vapor; la segunda, ocurrida 2–3 segundos después, se asocia a hidrógeno y vapor, aunque sigue debatiéndose.' },
      { n: '03', text: 'El edificio no tenía contención integral: el material del núcleo salió directamente a la atmósfera.' },
      { n: '04', text: 'El grafito y el combustible incandescentes mantuvieron incendios y emisiones durante días.' }
    ],
    sections: [
      {
        heading: 'La subida',
        body: [
          'Cuando las barras de AZ-5 comenzaron a descender, los desplazadores de grafito ocuparon el lugar del agua en la parte inferior de los canales. Ese cambio local añadió reactividad en un núcleo ya inestable. Al mismo tiempo, la ebullición creciente generaba más vapor, que absorbía menos neutrones. La realimentación positiva se sumó a la maniobra de parada.',
          'La potencia se disparó en una fracción de segundo. Los elementos de combustible se calentaron hasta fragmentarse; el agua que quedaba en los canales se convirtió en vapor a gran presión. La energía térmica liberada en ese instante fue suficiente para deformar y romper la estructura del núcleo.'
        ],
        source: 'insag7'
      },
      {
        heading: 'Las dos explosiones',
        body: [
          'La primera explosión fue una explosión de vapor: la despresurización violenta del refrigerante levantó la losa superior —de aproximadamente 1.000 toneladas— y rompió los canales de combustible. Las barras de control quedaron atascadas a medio camino. La tapa y los restos del edificio salieron despedidos. La contribución exacta de la ebullición, la fragmentación del combustible y la interacción entre combustible y refrigerante sigue siendo objeto de estudio.',
          'Dos o tres segundos después se produjo una segunda explosión. La hipótesis más aceptada la relaciona con la producción de hidrógeno por reacción del zirconio con vapor, aunque los expertos siguen discutiendo la contribución exacta de cada fenómeno. <strong>No fue una explosión nuclear como la de una bomba atómica:</strong> fue una excursión de criticalidad y una explosión de vapor y gases en un reactor destruido.'
        ],
        source: 'wna'
      },
      {
        heading: 'El edificio y el núcleo expuesto',
        body: [
          'La explosión demolió buena parte del bloque 4 y arrancó la cubierta. El núcleo quedó abierto al aire; fragmentos de combustible, grafito y estructuras cayeron sobre el tejado y los alrededores. Los incendios se propagaron por el techo de la sala de turbinas, construido con material bituminoso, y por los restos incandescentes.',
          'La ausencia de una contención integral significó que los productos de fisión pudieran escapar directamente. La columna de humo, vapor y partículas ascendió aproximadamente un kilómetro. El material más pesado cayó cerca; el más fino viajó con el viento hacia el noroeste, rumbo a Escandinavia y Europa central.'
        ],
        source: 'iaea'
      },
      {
        heading: 'Por qué no fue una “nube verde”',
        body: [
          'La radiación ionizante no es una sustancia que brille. Es energía emitida por núcleos inestables. Lo que salió del reactor fue una mezcla de gases nobles, yodo, cesio, estroncio y partículas de combustible: materia radiactiva, en su mayor parte invisible. Las visualizaciones de esta escena usan polvo, vapor y brasas para representar el transporte de partículas, no un resplandor radiactivo.',
          'La liberación no fue instantánea ni única. Durante unos diez días, el calor del núcleo y los incendios mantuvieron emisiones intermitentes. La mayor parte de los gases nobles escapó al principio; el yodo y el cesio se depositaron de forma irregular, condicionados por la lluvia y la dirección del viento.'
        ],
        source: 'unscear'
      }
    ],
    reconstruction: 'Corte y secuencia didácticos. La geometría no está a escala y la secuencia exacta de las explosiones sigue siendo objeto de investigación. No se representa la radiación como una sustancia verde ni se inventan fenómenos físicos; las brasas y el polvo son una licencia visual para mostrar materia caliente y partículas.',
    quote: 'La primera explosión rompió el reactor. La segunda rompió la última ilusión: que aquel edificio podía contener lo que ocurría dentro.',
    sourceIds: ['insag7', 'wnaSeq', 'wna', 'iaea', 'unscear'],
    notes: {
      time: '≈ 2 min 30 s',
      body: [
        'Aquí conviene ser precisos: no hubo una explosión nuclear como la de una bomba. Lo que ocurrió fue una excursión de potencia incontrolada. El combustible se fragmentó, el agua se convirtió en vapor a presión y la estructura cedió. La primera explosión fue de vapor y levantó la tapa de mil toneladas del reactor.',
        'Dos o tres segundos después hubo una segunda explosión. La explicación más aceptada implica hidrógeno producido por la reacción del zirconio con el vapor, pero el detalle todavía se investiga. Lo importante es la consecuencia: el edificio quedó abierto, el núcleo expuesto y los productos de fisión empezaron a salir a la atmósfera.',
        'En la vista de corte pueden ver el núcleo, los canales, las barras y la losa superior. La radiación no se ve. Lo que sí se ve es el polvo, el vapor y el grafito incandescente. Esa distinción es fundamental: Chernóbil no liberó una “nube verde”, liberó partículas y gases radiactivos invisibles.'
      ],
      transition: 'Los bomberos llegaron a las 01:28. No sabían que el reactor estaba abierto. Entraron a apagar un incendio y se encontraron con una fuente de radiación que no podían ver.'
    },
    scene: 'Reactor 4 · edificio y corte',
    views: [
      { id: 'cut', label: 'Corte del reactor' },
      { id: 'core', label: 'Núcleo' },
      { id: 'building', label: 'Edificio' }
    ],
    actions: [{ label: 'Por qué ocurrió', modal: 'mechanism' }],
    sequence: {
      title: 'SECUENCIA DE LA EXPLOSIÓN',
      steps: [
        { label: 'Estado previo', caption: 'Reactor inestable a baja potencia, con el margen de barras agotado.' },
        { label: 'AZ-5', caption: 'Las barras entran; el grafito desplaza agua y añade reactividad en la base.' },
        { label: 'Excursión', caption: 'La potencia se dispara; el combustible se fragmenta y el vapor rompe los canales.' },
        { label: '1.ª explosión', caption: 'La presión de vapor levanta la losa superior de unas 1.000 toneladas.' },
        { label: '2.ª explosión', caption: 'Dos o tres segundos después, una segunda explosión expulsa restos del núcleo.' },
        { label: 'Núcleo expuesto', caption: 'El edificio queda abierto; el grafito y el combustible alimentan incendios y emisiones.' }
      ]
    },
    initialStep: 5,
    sourceIds: ['insag7', 'wnaSeq', 'wna', 'iaea', 'unscear'],
    metaLocation: 'BLOQUE 4 · 26.04.1986 · 01:23'
  },

  {
    id: 4,
    num: '04',
    eyebrow: '26 ABRIL 1986 · 01:28—MAÑANA',
    place: 'Central de Chernóbil · Prípiat',
    title: 'Los primeros en entrar',
    subtitle: 'Bomberos, trabajadores y las horas en que nadie conocía la magnitud',
    lead: 'Los bomberos llegaron a las 01:28. Creían enfrentar un incendio en la cubierta; se encontraron con grafito incandescente, combustible disperso y una radiación invisible. Sin información ni equipos adecuados, trabajaron para evitar que el fuego alcanzara el bloque 3.',
    stats: [
      { value: '01:28', unit: '', label: 'llegada del primer grupo de bomberos', source: 'wnaSeq' },
      { value: '134', unit: '', label: 'casos de síndrome de irradiación aguda (ARS)', source: 'unscear' },
      { value: '28', unit: '', label: 'muertes por ARS en los primeros tres meses', source: 'unscear' }
    ],
    keys: [
      { n: '01', text: 'Los primeros equipos no disponían de información sobre el núcleo expuesto ni de dosímetros adecuados.' },
      { n: '02', text: 'El fuego de la cubierta se combatió con agua; los restos de grafito y combustible seguían emitiendo radiación.' },
      { n: '03', text: 'Los incendios de las cubiertas se localizaron hacia las 02:10–02:20; el fuego principal se controló hacia las 05:00.' },
      { n: '04', text: 'La mayoría de los afectados recibió dosis altas en las primeras horas; el público general no sufrió ARS.' }
    ],
    sections: [
      {
        heading: 'La alarma',
        body: [
          'La primera llamada llegó desde la central. Los bomberos de Prípiat salieron hacia el bloque 4 sin saber que la cubierta del reactor había desaparecido. Al llegar vieron restos incandescentes sobre el techo y llamas en la sala de turbinas. El humo y el vapor ocultaban la magnitud de la destrucción.',
          'Los bomberos utilizaron agua para sofocar el fuego de la cubierta y evitar que se extendiera al bloque 3. También combatieron incendios en pasillos, cables y estructuras. No llevaban trajes de protección radiológica ni contaban con lecturas fiables: los dosímetros de la época tenían escalas muy limitadas para la radiación que había en el lugar.'
        ],
        source: 'wnaSeq'
      },
      {
        heading: 'La central, en la oscuridad',
        body: [
          'Dentro del edificio, los trabajadores intentaron comprender qué había pasado. Algunos buscaron a compañeros, otros intentaron restablecer sistemas y otros trataron de bombear agua al núcleo. La sala de control del bloque 4 quedó dañada; las comunicaciones eran confusas. Durante las primeras horas, la idea de que el reactor estuviera completamente destruido parecía inimaginable.',
          'El bombeo de agua hacia el núcleo no funcionó como se esperaba: el agua se dirigía a sectores dañados del circuito y podía amenazar los bloques 1 y 2. La operación se detuvo después de medio día. Mientras tanto, el bloque 3 seguía en funcionamiento y fue apagado esa misma madrugada.'
        ],
        source: 'wna'
      },
      {
        heading: 'Las horas siguientes',
        body: [
          'Los bomberos relevaron equipos y trabajaron durante horas. Las cubiertas de los bloques 3 y 4 se controlaron hacia las 02:10 y 02:20; el fuego principal se dio por controlado alrededor de las 05:00. Para entonces, decenas de personas habían recibido dosis extremadamente altas. Algunos empezaron a vomitar, señal clásica de exposición aguda.',
          'En las semanas siguientes se confirmaron 134 casos de síndrome de irradiación aguda entre trabajadores y personal de emergencia; 28 de ellos murieron en los primeros tres meses. Otras 19 personas fallecieron entre 1987 y 2004 por causas diversas, no necesariamente atribuibles a la radiación. <strong>Dos trabajadores murieron por las explosiones.</strong> El número exacto de muertes atribuibles a largo plazo sigue siendo objeto de estudio.'
        ],
        source: 'unscear'
      },
      {
        heading: 'Radiación: invisible, no mágica',
        body: [
          'La radiación ionizante es energía que puede arrancar electrones de los átomos y dañar moléculas, incluido el ADN. Puede llegar desde fuera (exposición externa) o desde materiales inhalados o ingeridos (exposición interna). La dosis se mide en gray (Gy) para la energía absorbida y en sievert (Sv) para el efecto biológico.',
          'A dosis muy altas y en poco tiempo aparece el síndrome de irradiación aguda: náuseas, vómitos, caída de las defensas, quemaduras e infecciones. A dosis bajas, el riesgo adicional de cáncer es pequeño y difícil de detectar en una población. La radiación no convierte a una persona en radiactiva ni brilla en la oscuridad. Lo que vuelve peligroso un lugar es la contaminación: partículas que permanecen y siguen emitiendo.'
        ],
        source: 'whoQA'
      }
    ],
    reconstruction: 'La escena reinterpreta el exterior del bloque 4 y la llegada de los equipos de emergencia. Los vehículos son modelos genéricos inspirados en camiones soviéticos; no se reproducen rostros ni diálogos. Las llamas y el humo son una representación didáctica.',
    quote: 'Entraron sin saber que el aire estaba lleno de partículas que no podían ver. Su valentía no compensó la falta de información.',
    sourceIds: ['wnaSeq', 'wna', 'unscear', 'whoQA', 'iaeaFaq'],
    notes: {
      time: '≈ 2 min',
      body: [
        'A la 01:28 llegan los bomberos de Prípiat. Creen que es un incendio de cubierta. Se encuentran con grafito y combustible dispersos, y con una radiación que no se puede ver, oler ni tocar. Su trabajo evita que el fuego se propague al bloque 3, pero lo pagan con dosis altísimas.',
        'Esa misma noche, dentro de la central, los trabajadores intentan entender qué ha pasado. No hay una imagen clara del reactor destruido. Se intenta bombear agua, se evalúan daños, se busca a personas. La información es fragmentaria y las autoridades tardarán en comprender la magnitud.',
        'Aquí es importante separar dos cosas: el síndrome de irradiación aguda, que sufrieron 134 personas y causó 28 muertes en los primeros meses, y los efectos a largo plazo, mucho más difíciles de atribuir. La radiación no es un veneno verde: es energía que daña células. La dosis, el tiempo y la vía de exposición lo cambian todo.'
      ],
      transition: 'Mientras los bomberos trabajaban, a tres kilómetros de distancia, Prípiat seguía durmiendo. Nadie había ordenado evacuar la ciudad.'
    },
    scene: 'Exterior del bloque 4 durante el incendio',
    views: [
      { id: 'fire', label: 'Incendio' },
      { id: 'crew', label: 'Bomberos' },
      { id: 'roof', label: 'Cubierta' }
    ],
    actions: [{ label: '¿Qué es la radiación?', modal: 'radiation' }],
    sourceIds: ['wnaSeq', 'wna', 'unscear', 'whoQA', 'iaeaFaq'],
    metaLocation: 'BLOQUE 4 · PRIMERAS HORAS'
  },

  {
    id: 5,
    num: '05',
    eyebrow: '27 ABRIL 1986 · 14:00',
    place: 'Prípiat · 49.360 habitantes',
    title: 'Una ciudad con las maletas hechas',
    subtitle: 'Prípiat: la evacuación que iba a durar tres días',
    lead: 'Durante más de 30 horas, Prípiat siguió su sábado sin saber que el reactor estaba abierto. El 27 de abril comenzaron a llegar autobuses. A las 14:00, una voz por altavoces pidió a la gente prepararse para una evacuación temporal. Nadie volvería.',
    stats: [
      { value: '36', unit: 'h', label: 'entre el accidente y la evacuación de Prípiat', source: 'iaeaFaq' },
      { value: '49.360', unit: '', label: 'personas evacuadas de la ciudad', source: 'iaeaFaq' },
      { value: '3', unit: 'días', label: 'tiempo que se anunció a los residentes', source: 'whoQA' }
    ],
    keys: [
      { n: '01', text: 'La ciudad no fue informada de la magnitud del accidente durante las primeras horas.' },
      { n: '02', text: 'La evacuación se organizó con cientos de autobuses y se completó en pocas horas el 27 de abril.' },
      { n: '03', text: 'Se pidió a la población llevar documentos y lo esencial; las mascotas quedaron atrás.' },
      { n: '04', text: 'El regreso prometido para tres días nunca llegó. La ciudad quedó abandonada.' }
    ],
    sections: [
      {
        heading: 'La vida antes',
        body: [
          'Prípiat era una ciudad joven. Sus bloques de apartamentos, escuelas, jardines de infancia y el Palacio de Cultura Energetik habían sido construidos para las familias de la central. En 1986, la edad media de sus habitantes era muy baja. El parque de atracciones, con su noria amarilla, debía abrir el 1 de mayo.',
          'El sábado 26 de abril, la ciudad siguió su rutina. La gente hizo planes, fue al mercado y los niños salieron a jugar. La ciudad no recibió una alerta pública. Algunos trabajadores de la central sabían que algo grave había ocurrido, pero la información no se tradujo en una orden de evacuación. La magnitud se subestimó y la decisión de proteger a la población llegó tarde.'
        ],
        source: 'iaeaFaq'
      },
      {
        heading: 'Por qué no se evacuó de inmediato',
        body: [
          'En la Unión Soviética, una evacuación de esa escala requería una decisión política central. Las primeras evaluaciones eran incompletas, las comunicaciones fallaban y existía una profunda resistencia a admitir la gravedad del accidente. También pesaba el miedo al pánico y la costumbre de no difundir malas noticias.',
          'Mientras se organizaban los autobuses, los residentes siguieron expuestos. La dosis que recibieron fue, para la mayoría, moderada; pero el yodo radiactivo ya estaba en el aire y en la leche. La demora no fue solo un error técnico: fue una decisión humana con consecuencias.'
        ],
        source: 'whoQA'
      },
      {
        heading: 'La evacuación',
        body: [
          'El 27 de abril, a media tarde, una voz por los altavoces anunció una evacuación temporal. Se pedía a los residentes llevar documentos, ropa de abrigo y comida para unos días. La mayoría dejó atrás mascotas, fotografías, muebles y recuerdos. Cientos de autobuses formaron una fila que salió de la ciudad hacia zonas menos contaminadas.',
          'La operación se completó en pocas horas. Para el 14 de mayo, unas 116.000 personas habían sido evacuadas de la zona de 30 km; en los años siguientes, cientos de miles más fueron reasentadas. Prípiat nunca volvió a ser habitada de forma permanente. La noria no llegó a inaugurarse.'
        ],
        source: 'unscear'
      },
      {
        heading: 'Lo que quedó',
        body: [
          'Las viviendas se deterioraron. La vegetación entró por las ventanas rotas, los edificios perdieron tejados y el mobiliario se cubrió de polvo. Algunos objetos personales permanecieron en su sitio durante décadas, convertidos en testimonio de una vida interrumpida. No fueron “congelados” para la posteridad: simplemente nadie pudo volver a recogerlos.',
          'Un pequeño número de personas mayores regresó de forma no oficial a vivir en la zona. El resto reconstruyó su vida en otros lugares, a menudo con estigma y pérdida de redes sociales. La evacuación salvó vidas, pero también creó una herida social que no se mide en sieverts.'
        ],
        source: 'iaeaFaq'
      }
    ],
    reconstruction: 'Reconstrucción de Prípiat con bloques residenciales, la noria y una columna de autobuses. Las fachadas, colores y distribución son esquemáticas. No se usan imágenes de archivo ni se recrean personas reales.',
    quote: 'Les dijeron que volverían en tres días. La ciudad todavía espera.',
    sourceIds: ['iaeaFaq', 'whoQA', 'unscear', 'iaea'],
    notes: {
      time: '≈ 2 min',
      body: [
        'Prípiat era una ciudad normal. Joven, con escuelas, cines y un parque que iba a abrir el 1 de mayo. El sábado 26 de abril la vida siguió. La información no llegó a la población. Y esa es una de las decisiones más duras de toda la historia.',
        'La evacuación comenzó el 27 a las dos de la tarde. Se anunció como temporal: tres días, documentos, ropa de abrigo. Los autobuses llegaron, la gente subió y la ciudad quedó vacía en pocas horas. Nunca volvieron de forma permanente. La noria se convirtió en el símbolo de esa promesa rota.',
        'Aquí podemos ver la transición: primero la ciudad habitada, con luces y movimiento; después la evacuación; al final, el abandono. La vegetación no tardó en ocupar los espacios. La pérdida material es visible, pero la pérdida social —vecinos, trabajos, rutinas, comunidad— es igual de real.'
      ],
      transition: 'La evacuación no resolvió el problema. La contaminación ya había salido de la zona y estaba cruzando Europa. El 27 de abril, en Suecia, una alarma de radiación reveló lo que Moscú aún no había dicho.'
    },
    scene: 'Prípiat · noria y avenida central',
    views: [
      { id: 'avenue', label: 'Avenida' },
      { id: 'wheel', label: 'Noria' },
      { id: 'blocks', label: 'Edificios' }
    ],
    actions: [],
    sequence: {
      title: 'PRÍPIAT, TRES ESTADOS',
      steps: [
        { label: '26 abril · vida', caption: 'La ciudad antes del accidente: ventanas encendidas, tráfico y vida cotidiana.' },
        { label: '27 abril · evacuación', caption: 'Los autobuses llegan; los residentes salen con lo esencial y las mascotas quedan atrás.' },
        { label: 'Hoy · abandono', caption: 'Ventanas rotas, óxido y vegetación: la ciudad que nunca fue recuperada.' }
      ]
    },
    initialStep: 0,
    sourceIds: ['iaeaFaq', 'whoQA', 'unscear', 'iaea'],
    metaLocation: 'PRÍPIAT · 51.3890° N, 30.0990° E'
  },

  {
    id: 6,
    num: '06',
    eyebrow: '27 ABRIL—MAYO 1986',
    place: 'Chernóbil · Escandinavia · Europa',
    title: 'La nube que cruzó Europa',
    subtitle: 'Contaminación, silencio y alerta internacional',
    lead: 'El penacho no respetó fronteras. El 27 de abril, trabajadores de la central sueca de Forsmark activaron alarmas de radiación. La URSS guardó silencio durante horas; el mundo supo que algo grave había ocurrido antes de que Moscú lo admitiera.',
    stats: [
      { value: '10', unit: 'días', label: 'de liberaciones importantes al ambiente', source: 'iaea' },
      { value: '150.000', unit: 'km²', label: 'de territorio contaminado en Ucrania, Bielorrusia y Rusia (aprox.)', source: 'iaeaFaq' },
      { value: '< 1', unit: 'mSv', label: 'dosis media en el primer año en países europeos lejanos', source: 'unscear' }
    ],
    keys: [
      { n: '01', text: 'El viento llevó primero el penacho hacia el noroeste, hacia Suecia y Finlandia.' },
      { n: '02', text: 'La detección en Forsmark (Suecia) obligó a la URSS a reconocer el accidente el 28 de abril.' },
      { n: '03', text: 'La deposición fue irregular: dependió de la lluvia, el terreno y los cambios de viento.' },
      { n: '04', text: 'Las dosis en Europa occidental fueron bajas, pero las medidas de control de alimentos se extendieron.' }
    ],
    sections: [
      {
        heading: 'La dispersión',
        body: [
          'El material liberado no formó una nube uniforme. Salió en pulsos durante unos diez días, y cada cambio de viento dibujó una trayectoria distinta. En las primeras horas, el penacho se dirigió hacia el noroeste, hacia Suecia y Finlandia. Después, los vientos lo llevaron hacia Europa central y los Balcanes. Las partículas más finas dieron la vuelta al hemisferio norte.',
          'La deposición dependió de la lluvia: las zonas donde llovió mientras pasaba el penacho recibieron más contaminación. Por eso no se puede dibujar una única “frontera” de Chernóbil. Los mapas de contaminación son manchas irregulares, no círculos concéntricos.'
        ],
        source: 'unscear'
      },
      {
        heading: 'La detección exterior',
        body: [
          'El 27 y el 28 de abril, en la central nuclear de Forsmark, en Suecia, los monitores detectaron radiactividad en trabajadores y en el ambiente. Las autoridades suecas comprobaron que el origen no era local y buscaron la fuente hacia el este. La presión diplomática aumentó.',
          'El 28 de abril, la agencia soviética TASS emitió un breve comunicado sobre un accidente en Chernóbil. No mencionaba la magnitud real. La comunidad internacional exigió información; la IAEA y otros organismos comenzaron a coordinar una respuesta. La transparencia llegó después que la radiación.'
        ],
        source: 'iaeaFaq'
      },
      {
        heading: 'Los territorios afectados',
        body: [
          'Las mayores extensiones contaminadas quedaron en Ucrania, Bielorrusia y la Rusia europea. Se estima que unos 150.000 km² superaron ciertos niveles de contaminación por cesio-137, aunque las cifras varían según el umbral utilizado. Millones de personas vivían en zonas con depósitos medibles; cientos de miles fueron reasentadas.',
          'Fuera de esos tres países, la contaminación fue mucho menor. En gran parte de Europa se detectaron trazas, y algunos países aplicaron restricciones temporales a la leche, las verduras o la carne. La diferencia entre “detectable” y “peligroso” es esencial: la presencia de un radionúclido no implica por sí sola un riesgo sanitario relevante.'
        ],
        source: 'iaeaFaq'
      },
      {
        heading: 'Suelo, agua, bosques y alimentos',
        body: [
          'El yodo-131, con una vida media de ocho días, fue el principal riesgo inmediato para la glándula tiroides. El cesio-137, con una vida media de unos 30 años, se convirtió en el contaminante persistente más importante. En los bosques, los suelos y algunos alimentos —setas, frutos silvestres, caza, leche de zonas específicas— las concentraciones se mantuvieron durante años.',
          'Las autoridades aplicaron medidas: arado profundo, fertilizantes de potasio, control de la leche, restricciones de acceso y monitoreo de alimentos. El bosque de pinos cercano al reactor murió y se conoció como el “Bosque Rojo”. Con el tiempo, la ausencia humana permitió que la fauna se recuperara en muchas áreas, aunque la radiación sigue afectando a organismos en los puntos más contaminados.'
        ],
        source: 'iaeaEnv'
      }
    ],
    reconstruction: 'Mapa esquemático de Europa construido con contornos de Natural Earth simplificados. Las partículas ilustran la dirección general del transporte atmosférico; no son un mapa de umbrales de contaminación ni representan una frontera física. Los datos de dosis y deposición provienen de UNSCEAR e IAEA.',
    quote: 'La radiactividad no respeta fronteras. La información tampoco debería.',
    sourceIds: ['unscear', 'iaeaFaq', 'iaeaEnv', 'whoQA', 'naturalEarth'],
    notes: {
      time: '≈ 2 min',
      body: [
        'El 27 de abril, en Suecia, los trabajadores de la central de Forsmark activaron las alarmas al entrar. La radiación venía de muy lejos. Ese hallazgo rompió el silencio: Moscú tuvo que reconocer el accidente al día siguiente, aunque sin contar toda la verdad.',
        'En el mapa pueden ver una representación de las trayectorias. Insisto: no es un mapa de fronteras de contaminación. El penacho cambió de dirección varias veces y la lluvia hizo que la deposición fuera irregular. Las zonas más afectadas fueron Ucrania, Bielorrusia y partes de Rusia. Fuera de allí, las dosis fueron bajas, aunque se detectaron trazas en casi toda Europa.',
        'La consecuencia ambiental más persistente es el cesio-137. Se fija al suelo, puede entrar en la cadena alimentaria y obligó a controles durante décadas. El yodo-131 fue el problema inmediato para los niños. La lección de este capítulo es doble: la física no entiende de fronteras y la transparencia llega tarde cuando se decide primero negar.'
      ],
      transition: 'Mientras la nube cruzaba Europa, en Chernóbil miles de personas empezaban a llegar para hacer lo imposible: limpiar, construir y encerrar el reactor. Los llamaron liquidadores.'
    },
    scene: 'Mapa de dispersión sobre Europa',
    views: [
      { id: 'plume', label: 'Dispersión' },
      { id: 'europe', label: 'Europa' },
      { id: 'north', label: 'Detección' }
    ],
    actions: [{ label: 'Metodología del mapa', modal: 'mapMethod' }],
    sourceIds: ['unscear', 'iaeaFaq', 'iaeaEnv', 'whoQA', 'naturalEarth'],
    metaLocation: 'EUROPA · 27.04—06.05.1986'
  },

  {
    id: 7,
    num: '07',
    eyebrow: '1986—1990',
    place: 'Chernóbil · Unión Soviética',
    title: 'Los que borraron el desastre con sus manos',
    subtitle: 'Liquidadores, tejados y el primer sarcófago',
    lead: 'Miles de bomberos, soldados, mineros, ingenieros y científicos fueron movilizados. Limpiaron, construyeron, cavaron y se relevaron en turnos brevísimos sobre tejados radiactivos. Su trabajo redujo la liberación y permitió encerrar el reactor; también dejó heridas que aún se estudian.',
    stats: [
      { value: '≈600.000', unit: '', label: 'personas registradas como liquidadores (estimación)', source: 'iaeaFaq' },
      { value: '120', unit: 'mSv', label: 'dosis media de 530.000 trabajadores de recuperación', source: 'unscear' },
      { value: '206', unit: 'días', label: 'para construir el primer sarcófago', source: 'wna' }
    ],
    keys: [
      { n: '01', text: 'Los liquidadores fueron un conjunto heterogéneo: militares, bomberos, mineros, técnicos, médicos y constructores.' },
      { n: '02', text: 'Sobre los tejados se retiraban grafito y combustible en turnos de menos de un minuto.' },
      { n: '03', text: 'Los mineros cavaron un túnel bajo el reactor para instalar una losa de refrigeración.' },
      { n: '04', text: 'El sarcófago se construyó en meses, pero no era hermético ni estaba pensado para durar para siempre.' }
    ],
    sections: [
      {
        heading: 'Quiénes fueron',
        body: [
          '“Liquidador” es un término amplio. Incluye a los bomberos que combatieron el incendio inicial, a los soldados que limpiaron tejados y caminos, a los mineros que excavaron bajo el reactor, a los conductores que transportaron escombros, a los científicos que midieron la radiación y a los trabajadores que construyeron el sarcófago. Muchos eran jóvenes; algunos recibieron dosis altas, otros relativamente bajas.',
          'No todos fueron héroes en el sentido épico, ni todos fueron víctimas pasivas. Fueron personas con tareas concretas, a menudo peligrosas, en un sistema que movilizó recursos enormes y ocultó información. El número exacto de participantes se desconoce; las cifras superan las 600.000 personas registradas, y muchos más participaron sin registro.'
        ],
        source: 'iaeaFaq'
      },
      {
        heading: 'El tejado',
        body: [
          'Sobre la cubierta del bloque 3 y en los alrededores del bloque 4 quedaron fragmentos de grafito y combustible. La radiación era tan intensa que los trabajos se organizaron en turnos de segundos. Los soldados, conocidos como “biorobots”, paleaban restos con palas y los arrojaban al interior del reactor destruido. Algunos usaban delantales de plomo; la protección era limitada.',
          'También se emplearon robots y máquinas teledirigidas, pero la electrónica fallaba con la radiación. La solución fue humana. Las dosis se controlaban con dosímetros y se rotaba al personal, pero el margen de error era enorme.'
        ],
        source: 'wna'
      },
      {
        heading: 'El túnel y el sarcófago',
        body: [
          'Para evitar que el combustible fundido pudiera penetrar el suelo y alcanzar el agua subterránea, se excavó un túnel desde el bloque 3 hasta debajo del reactor. Los mineros trabajaron en condiciones duras y completaron la galería en unos quince días. Bajo el reactor se instaló una losa de hormigón con refrigeración.',
          'La construcción del sarcófago comenzó en mayo de 1986. En unos 206 días se levantó una estructura de más de 400.000 m³ de hormigón y 7.300 toneladas de acero alrededor del reactor destruido. Fue una obra improvisada, construida a distancia y sin un diseño previo completo. Su objetivo era contener, no resolver el problema para siempre.'
        ],
        source: 'wna'
      },
      {
        heading: 'Los riesgos',
        body: [
          'Los efectos sobre la salud de los liquidadores son uno de los temas más estudiados y más politizados. UNSCEAR estima una dosis media de unos 120 mSv para 530.000 trabajadores registrados entre 1986 y 1990, con valores individuales muy variables. Los grupos con dosis más altas tienen un riesgo mayor de cáncer y cataratas, pero no se ha demostrado un aumento general de todas las enfermedades.',
          'Además de la radiación, los liquidadores enfrentaron estrés, condiciones laborales extremas, alcoholismo, falta de seguimiento médico y estigma social. Sus testimonios son parte de la historia del desastre y también una advertencia sobre cómo se contabiliza el costo humano.'
        ],
        source: 'unscear'
      }
    ],
    reconstruction: 'Reconstrucción de las tareas de descontaminación y construcción. Los trajes, vehículos y herramientas son representativos; no son retratos de personas reales. La grúa y el sarcófago están simplificados para mostrar su lógica constructiva.',
    quote: 'No cerraron el reactor para siempre. Compraron tiempo. El tiempo también se agota.',
    sourceIds: ['iaeaFaq', 'unscear', 'wna', 'chnpp', 'iaea'],
    notes: {
      time: '≈ 2 min',
      body: [
        'Los liquidadores no fueron un solo grupo. Fueron bomberos, soldados, mineros, cocineros, conductores, científicos, enfermeras. Su trabajo iba desde limpiar un camino hasta entrar en un tejado durante cuarenta segundos para retirar grafito.',
        'La escena muestra tres tareas: el tejado, el túnel bajo el reactor y la construcción del sarcófago. El sarcófago se levantó en unos 206 días, con más de cuatrocientas mil toneladas de materiales. Fue una hazaña de ingeniería y una solución de emergencia: no era hermético y se diseñó para durar unas dos o tres décadas.',
        'Al hablar de sus consecuencias, hay que evitar dos extremos. No fueron todos condenados a muerte, ni todos salieron indemnes. Recibieron dosis muy distintas. Los estudios encuentran riesgos adicionales en los grupos más expuestos, pero las cifras varían. Lo que sí es seguro es que su trabajo redujo la liberación y permitió estabilizar el sitio.'
      ],
      transition: 'El reactor quedó cubierto, pero la contaminación siguió en el suelo, en los alimentos y en los cuerpos. La pregunta ahora es qué le hizo la radiación a las personas y al territorio.'
    },
    scene: 'Liquidadores · tejado, túnel y sarcófago',
    views: [
      { id: 'roof', label: 'Tejados' },
      { id: 'sarcophagus', label: 'Sarcófago' },
      { id: 'tunnel', label: 'Túnel' }
    ],
    actions: [{ label: 'Cómo se construyó', modal: 'sarcophagus' }],
    sequence: {
      title: 'CONSTRUIR BAJO PRESIÓN',
      steps: [
        { label: 'Descontaminar', caption: 'Retirada de restos y limpieza de superficies en turnos breves.' },
        { label: 'Cavar', caption: 'Los mineros excavan un túnel bajo el reactor para instalar una losa de refrigeración.' },
        { label: 'Contener', caption: 'Se levantan muros y se prepara el perímetro del futuro sarcófago.' },
        { label: 'Cubrir', caption: 'En 206 días, el reactor destruido queda encerrado en una estructura de emergencia.' }
      ]
    },
    initialStep: 3,
    sourceIds: ['iaeaFaq', 'unscear', 'wna', 'chnpp', 'iaea'],
    metaLocation: 'CHERNÓBIL · 1986—1990'
  },

  {
    id: 8,
    num: '08',
    eyebrow: '1986—HOY',
    place: 'Bielorrusia · Ucrania · Rusia',
    title: 'Lo que la radiación dejó',
    subtitle: 'Salud, memoria y naturaleza en la zona de exclusión',
    lead: 'Chernóbil no terminó el 26 de abril. Durante décadas, la ciencia ha separado los efectos confirmados de las estimaciones. La lección más difícil no está solo en el núcleo del reactor: está en las personas que perdieron su hogar y en un territorio que la vida silvestre volvió a ocupar.',
    stats: [
      { value: '134', unit: '', label: 'casos de síndrome de irradiación aguda confirmados', source: 'unscear' },
      { value: '>6.000', unit: '', label: 'cánceres de tiroides en niños y adolescentes hasta 2005', source: 'unscear' },
      { value: '15', unit: '', label: 'muertes entre los casos de cáncer de tiroides (hasta 2005)', source: 'unscear' }
    ],
    keys: [
      { n: '01', text: 'El síndrome de irradiación aguda afectó a 134 trabajadores; el público general no lo sufrió.' },
      { n: '02', text: 'El yodo radiactivo en la leche elevó el cáncer de tiroides en quienes eran niños en 1986.' },
      { n: '03', text: 'No se ha demostrado un aumento general de cáncer o leucemia en la población expuesta.' },
      { n: '04', text: 'Las estimaciones a largo plazo varían según el modelo, la dosis y el periodo estudiado.' }
    ],
    sections: [
      {
        heading: 'El síndrome de irradiación aguda',
        body: [
          'El síndrome de irradiación aguda (ARS) aparece cuando una persona recibe una dosis alta en poco tiempo. En Chernóbil se confirmó en 134 trabajadores y bomberos, con dosis estimadas entre 0,8 y 16 Gy. Los síntomas incluyen náuseas, vómitos, fiebre, quemaduras, caída de glóbulos blancos e infecciones. El tratamiento requiere aislamiento, transfusiones, antibióticos y cuidados intensivos.',
          'Veintiocho de esas 134 personas murieron en los primeros tres meses. Los supervivientes sufrieron secuelas, entre ellas cataratas. La mayoría de la población no recibió dosis capaces de provocar ARS; el riesgo para el público fue de otro tipo: cáncer de tiroides por yodo radiactivo, especialmente en niños.'
        ],
        source: 'unscear'
      },
      {
        heading: 'El cáncer de tiroides',
        body: [
          'El yodo-131 se depositó en pastos y entró en la cadena alimentaria, sobre todo a través de la leche. La glándula tiroides, especialmente en niños, capta yodo con avidez. Por eso las dosis a la tiroides fueron mucho mayores que las dosis al resto del cuerpo, y el cáncer de tiroides se convirtió en el efecto sanitario más claramente atribuible al accidente.',
          'Hasta 2005 se diagnosticaron más de 6.000 casos en personas que eran niños o adolescentes en 1986, y una fracción importante se atribuye a la radiación. Alrededor de 15 de esos casos habían sido mortales. El aumento de diagnósticos también refleja el cribado intensivo: separar el efecto real del sobrediagnóstico es parte del debate científico.'
        ],
        source: 'whoQA'
      },
      {
        heading: 'Lo confirmado y lo estimado',
        body: [
          'UNSCEAR no encontró un aumento general de cáncer o leucemia en la población expuesta, aparte del cáncer de tiroides y algunas señales en trabajadores con dosis altas. Sin embargo, los estudios de riesgo no pueden demostrar la ausencia de efectos pequeños. Por eso las proyecciones varían: dependen de la dosis reconstruida, del modelo de riesgo, del periodo y de la calidad de los registros.',
          'El Foro de Chernóbil estimó que podrían producirse hasta 4.000 muertes adicionales por cáncer entre los grupos más expuestos. Un estudio del IARC/OMS proyectó unos 25.000 casos de cáncer adicionales en Europa y unas 16.000 muertes hasta 2065. Son estimaciones, no recuentos. La diferencia entre ellas no es un capricho: refleja modelos y supuestos distintos. <strong>No deben presentarse como cifras definitivas.</strong>'
        ],
        source: 'iaeaForum'
      },
      {
        heading: 'Salud mental y sociedad',
        body: [
          'El impacto psicológico y social ha sido enorme. Las personas evacuadas perdieron hogares, empleos, redes de apoyo y referencias cotidianas. Muchas vivieron con miedo a la radiación, estigma y sentimiento de abandono. Los estudios encuentran niveles más altos de ansiedad, depresión y síntomas somáticos en las poblaciones afectadas.',
          'Estos problemas no se explican solo por la dosis. La forma en que se comunicó el riesgo, la incertidumbre y la pérdida de control tuvieron un papel central. La salud mental es parte de la salud pública de un desastre radiológico, no un efecto secundario.'
        ],
        source: 'whoQA'
      },
      {
        heading: 'El territorio',
        body: [
          'Cerca de la central, la lluvia radiactiva mató los pinos de un área que se conoce como el Bosque Rojo. En las décadas siguientes, la ausencia de agricultura, caza y presión urbana permitió que muchas poblaciones de animales aumentaran. Lobos, jabalíes, ciervos y aves regresaron. Pero “más fauna” no significa “zona segura”: en los puntos calientes, la radiación sigue afectando a organismos y ecosistemas.',
          'La zona de exclusión ucraniana ocupa unos 2.600 km². Alrededor de 187 comunidades quedaron abandonadas. Unos pocos residentes mayores regresaron de forma no oficial. Para el resto, el territorio es a la vez un laboratorio natural, un lugar de memoria y una herida abierta.'
        ],
        source: 'iaeaFaq'
      }
    ],
    reconstruction: 'Diorama de la zona de exclusión en la actualidad. La vegetación, el estado de las estructuras y la fauna son representativos. No se recrean personas fallecidas ni se representa la radiación como una sustancia visible.',
    quote: 'La naturaleza regresó porque los humanos se fueron. Ese es un consuelo, no una absolución.',
    sourceIds: ['unscear', 'whoQA', 'iaeaForum', 'iaeaFaq', 'iaeaEnv'],
    notes: {
      time: '≈ 2 min 30 s',
      body: [
        'Este capítulo exige precisión. El síndrome de irradiación aguda afectó a 134 trabajadores. La población general no recibió dosis de ese nivel. El efecto más claro es el cáncer de tiroides en quienes eran niños en 1986: más de seis mil casos hasta 2005, con unas quince muertes atribuidas en ese periodo. El cribado también aumentó los diagnósticos, y eso complica la interpretación.',
        'Sobre las muertes a largo plazo, hay que resistir la tentación de dar una cifra única. El Foro de Chernóbil habló de hasta cuatro mil muertes adicionales entre los más expuestos. Otras proyecciones, como la del IARC, hablan de decenas de miles de casos en toda Europa. Son modelos, no cuerpos contados. La diferencia depende de las dosis, los supuestos y el periodo.',
        'La parte menos visible es la salud mental. La evacuación, el estigma y el miedo causaron un sufrimiento real, aunque no se mida en sieverts. Y la naturaleza: el Bosque Rojo murió, pero muchas especies se recuperaron al desaparecer la presión humana. Eso no significa que la radiación sea buena; significa que la ausencia de personas también transforma el paisaje.'
      ],
      transition: 'El sarcófago de 1986 compró tiempo, pero el tiempo pasó. A finales de los años noventa, la estructura amenazaba con fallar. La respuesta fue una de las obras de ingeniería más ambiciosas de la historia.'
    },
    scene: 'Zona de exclusión · puesto de control',
    views: [
      { id: 'checkpoint', label: 'Puesto de control' },
      { id: 'forest', label: 'Bosque' },
      { id: 'village', label: 'Aldea' }
    ],
    actions: [{ label: 'Datos de salud', modal: 'health' }],
    sourceIds: ['unscear', 'whoQA', 'iaeaForum', 'iaeaFaq', 'iaeaEnv'],
    metaLocation: 'ZONA DE EXCLUSIÓN · 2026'
  },

  {
    id: 9,
    num: '09',
    eyebrow: '1986—2026',
    place: 'Unidad 4 · Chernóbil',
    title: 'Encerrar un reactor para siempre',
    subtitle: 'Del sarcófago de hormigón al Nuevo Confinamiento Seguro',
    lead: 'El primer sarcófago fue una carrera contra el tiempo: se construyó en meses sobre un reactor destruido y nunca fue hermético. Tres décadas después, una estructura móvil de 36.000 toneladas cubrió el viejo refugio. Hoy, la guerra y un ataque con dron han vuelto a poner a prueba su seguridad.',
    stats: [
      { value: '206', unit: 'días', label: 'para levantar el primer sarcófago en 1986', source: 'wna' },
      { value: '36.000', unit: 't', label: 'peso del Nuevo Confinamiento Seguro', source: 'ebrd' },
      { value: '100', unit: 'años', label: 'vida útil de diseño del NSC', source: 'iaeaFaq' }
    ],
    keys: [
      { n: '01', text: 'El sarcófago de 1986 fue una medida de emergencia, no una solución permanente.' },
      { n: '02', text: 'El NSC se ensambló a 327 m y se deslizó sobre el reactor en noviembre de 2016.' },
      { n: '03', text: 'La estructura pesa 36.000 toneladas y fue diseñada para durar 100 años.' },
      { n: '04', text: 'En febrero de 2025, un dron dañó el NSC; la IAEA advirtió que perdió sus funciones principales de confinamiento y exige reparaciones urgentes.' }
    ],
    sections: [
      {
        heading: 'El sarcófago de 1986',
        body: [
          'Después de la explosión, el reactor quedó abierto. La prioridad era contener la liberación y permitir que los bloques 1, 2 y 3 siguieran operando. Entre mayo y noviembre de 1986 se construyó una estructura de hormigón y acero alrededor del bloque 4. Se levantó en unos 206 días, con más de 400.000 m³ de hormigón y 7.300 toneladas de acero.',
          'El sarcófago fue una solución de emergencia. No era hermético, tenía filtraciones y su diseño no permitía un desmantelamiento seguro. Se calculó una vida útil de 20 a 30 años. Ya en la década de 1990 se hicieron refuerzos y reparaciones, mientras alrededor de 200 toneladas de combustible seguían dentro.'
        ],
        source: 'wna'
      },
      {
        heading: 'El Nuevo Confinamiento Seguro',
        body: [
          'El NSC es una bóveda de acero de 165 m de largo, 257 m de ancho y 108 m de alto, con un peso aproximado de 36.000 toneladas. Se construyó a 327 m del reactor, en una zona alejada de la radiación, y se deslizó sobre el viejo sarcófago en noviembre de 2016. Es una de las estructuras móviles más grandes jamás construidas.',
          'Su función no es solo tapar: incluye ventilación, control de humedad, extinción de incendios, grúas y sistemas robóticos para retirar el combustible y los restos del reactor. Fue financiado por la comunidad internacional a través del EBRD y diseñado para 100 años. La instalación principal se completó en 2016; la puesta en servicio se prolongó hasta 2019.'
        ],
        source: 'ebrd'
      },
      {
        heading: 'La situación actual',
        body: [
          'Los bloques 1, 2 y 3 están en desmantelamiento programado. El último reactor en funcionamiento se apagó en diciembre de 2000. El combustible gastado se gestiona en instalaciones construidas en el sitio, y la zona de exclusión sigue bajo control ucraniano. La central ya no produce electricidad, pero el trabajo nuclear no ha terminado.',
          'La invasión rusa de Ucrania en 2022 interrumpió las actividades y la central estuvo ocupada durante semanas. En febrero de 2025, un ataque con dron dañó el Nuevo Confinamiento Seguro. La IAEA informó en noviembre de 2025 que la estructura perdió sus dos funciones principales: confinar materiales radiactivos y permitir el desmantelamiento seguro. Las reparaciones continúan en 2026. <strong>La historia de Chernóbil no ha terminado.</strong>'
        ],
        source: 'iaeaFaq'
      }
    ],
    reconstruction: 'Comparación a escala didáctica del reactor destruido, el sarcófago de 1986 y el Nuevo Confinamiento Seguro. Las tres etapas son reconstrucciones simplificadas; el interior del NSC no se reproduce de forma literal.',
    quote: 'El primer sarcófago contuvo el desastre con prisa. El segundo intentó contenerlo con ciencia. Ninguno puede devolver el tiempo.',
    sourceIds: ['wna', 'ebrd', 'iaeaFaq', 'chnpp', 'iaea'],
    notes: {
      time: '≈ 2 min',
      body: [
        'El sarcófago de 1986 fue una obra heroica y precaria. Se construyó en unos doscientos días y nunca fue hermético. Su vida útil se estimó en veinte o treinta años. A finales de los noventa ya había filtraciones y riesgo de colapso, y todavía quedaban alrededor de doscientas toneladas de combustible dentro.',
        'El Nuevo Confinamiento Seguro se construyó lejos del reactor para proteger a los trabajadores. Luego se deslizó sobre el viejo sarcófago en noviembre de 2016. Pesa unas treinta y seis mil toneladas, mide más de doscientos cincuenta metros de ancho y está diseñado para cien años. Incluye grúas y sistemas para desmantelar el interior, pero eso llevará décadas.',
        'La situación actual añade una capa trágica: la guerra. En 2022 la central fue ocupada; en febrero de 2025 un dron dañó el NSC. La IAEA advirtió que perdió sus funciones principales de confinamiento. Las reparaciones siguen en 2026. La lección es incómoda: ninguna estructura es definitiva si el contexto político no es estable.'
      ],
      transition: 'Chernóbil no es solo una historia de ingeniería. Es una historia sobre lo que decidimos no escuchar. Y esa es la reflexión con la que cerramos.'
    },
    scene: 'Reactor 4 · tres etapas de contención',
    views: [
      { id: 'compare', label: 'Comparación' },
      { id: 'sarcophagus', label: '1986' },
      { id: 'nsc', label: '2016' }
    ],
    actions: [{ label: 'Ficha técnica del NSC', modal: 'nsc' }],
    sequence: {
      title: 'TRES ETAPAS',
      steps: [
        { label: '1986 · ruina', caption: 'El reactor destruido queda expuesto; se improvisa el primer sarcófago.' },
        { label: '1986 · sarcófago', caption: 'Una estructura de emergencia cubre el bloque 4 en 206 días.' },
        { label: '2016 · NSC', caption: 'Una bóveda de 36.000 t se desliza sobre el viejo refugio.' }
      ]
    },
    initialStep: 2,
    sourceIds: ['wna', 'ebrd', 'iaeaFaq', 'chnpp', 'iaea'],
    metaLocation: 'UNIDAD 4 · 1986 / 2016 / 2026'
  },

  {
    id: 10,
    num: '10',
    eyebrow: 'REFLEXIÓN FINAL',
    place: 'Chernóbil · 1986—presente',
    title: '¿Qué aprendimos de Chernóbil?',
    subtitle: 'La seguridad no es un objeto: es una forma de decidir',
    lead: 'Chernóbil no fue solo un fallo técnico. Fue la convergencia de un diseño peligroso, una prueba mal comprendida, información fragmentada y una cultura que trató las advertencias como obstáculos. La pregunta que queda no es si la tecnología puede fallar, sino qué hacemos con lo que sabemos antes de que falle.',
    stats: [
      { value: '10', unit: 'días', label: 'de liberaciones que cambiaron la historia nuclear', source: 'iaea' },
      { value: '30', unit: 'km', label: 'de radio que definió una zona de exclusión', source: 'iaeaFaq' },
      { value: '40', unit: 'años', label: 'de investigación, reparación y memoria', source: 'unscear' }
    ],
    keys: [
      { n: '01', text: 'La seguridad nuclear depende de barreras técnicas, pero también de personas, procedimientos y supervisión independiente.' },
      { n: '02', text: 'Ocultar información no evita el daño: lo amplifica y destruye la confianza.' },
      { n: '03', text: 'Ninguna tecnología es segura si sus límites se conocen pero no se comunican.' },
      { n: '04', text: 'El costo humano y ambiental no se mide solo en muertes: incluye hogares, comunidades y ecosistemas.' }
    ],
    sections: [
      {
        heading: 'Seguridad nuclear',
        body: [
          'Después de Chernóbil se reforzaron los reactores RBMK, se crearon convenciones internacionales de notificación y asistencia, y se desarrolló una cultura de seguridad basada en la transparencia, el análisis de errores y la independencia de los reguladores. La seguridad no es un certificado: es una práctica que debe renovarse cuando cambian la tecnología, las personas y el contexto.',
          'También cambió la forma de diseñar. La defensa en profundidad —múltiples barreras físicas y procedimientos independientes— se volvió un principio central. En Chernóbil fallaron varias capas a la vez: el diseño, la operación, la información y la supervisión. Ninguna de ellas por separado explica el desastre; juntas lo hicieron posible.'
        ],
        source: 'iaea'
      },
      {
        heading: 'Transparencia y responsabilidad',
        body: [
          'El silencio de las primeras horas no protegió a nadie. Retrasó la evacuación, dificultó la respuesta internacional y aumentó la desconfianza. La lección no es solo “informar más rápido”, sino crear instituciones capaces de decir la verdad aunque la verdad sea incómoda. La información técnica debe llegar a quienes toman decisiones y a quienes pueden resultar afectados.',
          'La responsabilidad no se reduce a encontrar culpables. Los operadores cometieron errores, pero también trabajaron dentro de un sistema que no les explicó los riesgos, que no priorizó la seguridad y que castigaba la crítica. Una cultura que busca un chivo expiatorio aprende poco; una que analiza el sistema puede evitar la repetición.'
        ],
        source: 'insag7'
      },
      {
        heading: 'El costo humano y ambiental',
        body: [
          'Chernóbil dejó dos trabajadores muertos por las explosiones, 28 muertes por síndrome de irradiación aguda, miles de casos de cáncer de tiroides y cientos de miles de personas desplazadas. Dejó también trabajadores con secuelas, comunidades estigmatizadas y un territorio contaminado que tardará generaciones en recuperarse. Las cifras exactas de las muertes a largo plazo seguirán siendo objeto de estudio y de debate.',
          'La naturaleza regresó a partes de la zona de exclusión, pero no porque la radiación sea benigna: porque los humanos se marcharon. El paisaje es a la vez un refugio y una advertencia. La catástrofe no fue un accidente aislado; fue el resultado de decisiones acumuladas. Eso es lo que la hace enseñable.'
        ],
        source: 'unscear'
      }
    ],
    reconstruction: 'Escena de cierre. La central y el paisaje son una reconstrucción atmosférica, no una fotografía. La iluminación y la cámara buscan crear un espacio de reflexión, no documentar un lugar exacto.',
    quote: '«La distancia entre la seguridad y la catástrofe no siempre se mide en kilómetros. A veces se mide en una advertencia que nadie quiso escuchar.»',
    quoteFooter: 'Reflexión final · guion de la presentación',
    sourceIds: ['iaea', 'insag7', 'unscear', 'whoQA', 'iaeaFaq'],
    notes: {
      time: '≈ 2 min',
      body: [
        'Chernóbil nos dejó varias lecciones. La primera es que la seguridad no depende solo de una máquina. Depende de cómo se diseña, de cómo se opera, de quién supervisa y de si la información circula. La segunda es que ocultar un problema no lo elimina; solo retrasa la respuesta y multiplica el daño.',
        'La tercera es más incómoda: las advertencias técnicas suelen ser aburridas, parciales y difíciles de traducir en decisiones. Chernóbil no ocurrió porque nadie supiera nada. Ocurrió porque el conocimiento sobre los límites del reactor no se convirtió en una cultura de seguridad. Esa distancia entre saber y actuar sigue siendo el problema central.',
        'Cierro con una idea que resume la exposición: la distancia entre la seguridad y la catástrofe no siempre se mide en kilómetros. A veces se mide en una advertencia que nadie quiso escuchar. Gracias.'
      ],
      transition: 'Fin de la presentación. Puedes volver a cualquier capítulo desde la cronología o el riel lateral.'
    },
    scene: 'Amanecer sobre Chernóbil',
    views: [
      { id: 'dawn', label: 'Amanecer' },
      { id: 'plant', label: 'La central' }
    ],
    actions: [{ label: 'Fuentes y método', modal: 'about' }, { label: 'Cita final', reflection: true }],
    sourceIds: ['iaea', 'insag7', 'unscear', 'whoQA', 'iaeaFaq'],
    metaLocation: 'CHERNÓBIL · AMANECER'
  }
];

const TIMELINE = [
  { date: '1970', title: 'Se funda Prípiat', note: 'La ciudad se planifica para el personal de la central, a 3 km del complejo.', chapter: 1 },
  { date: '1977—1983', title: 'Entran en servicio los cuatro reactores', note: 'Los bloques 1 y 2 en 1977–1978; los bloques 3 y 4 en 1981 y 1983.', chapter: 1 },
  { date: '25 abr 1986 · 14:00', title: 'Se aísla el sistema de emergencia', note: 'La prueba de la turbina se prepara mientras el reactor sigue a media potencia.', chapter: 2 },
  { date: '26 abr 1986 · 00:28', title: 'La potencia cae a unos 30 MWt', note: 'El xenón envenena el núcleo y los operadores extraen barras para recuperar potencia.', chapter: 2 },
  { date: '26 abr 1986 · 01:23:40', title: 'Se pulsa AZ-5', note: 'Las barras entran; la reactividad se dispara en segundos.', chapter: 2, major: true },
  { date: '26 abr 1986 · 01:23:44', title: 'Explosiones en el bloque 4', note: 'Una explosión de vapor y una segunda explosión destruyen el reactor. El núcleo queda expuesto.', chapter: 3, major: true },
  { date: '26 abr 1986 · 01:28', title: 'Llegan los primeros bomberos', note: 'Trabajan sin información completa sobre la magnitud ni equipos adecuados.', chapter: 4 },
  { date: '26 abr 1986 · 05:00', title: 'Se controla el incendio principal', note: 'Los fuegos de las cubiertas se localizan; el bloque 3 se apaga.', chapter: 4 },
  { date: '27 abr 1986 · 14:00', title: 'Evacuación de Prípiat', note: '49.360 personas salen de la ciudad; se anuncia un regreso en tres días.', chapter: 5, major: true },
  { date: '28 abr 1986', title: 'Suecia detecta la radiación', note: 'La central de Forsmark activa la alerta; la URSS emite un comunicado breve.', chapter: 6, major: true },
  { date: 'Mayo 1986', title: 'Liberaciones y respuesta internacional', note: 'La liberación se prolonga unos diez días; comienza la movilización de liquidadores.', chapter: 6 },
  { date: 'Nov 1986', title: 'Se termina el primer sarcófago', note: 'Una estructura de emergencia cubre el bloque 4 en unos 206 días.', chapter: 7 },
  { date: '1986—1990', title: 'Trabajo de los liquidadores', note: 'Cientos de miles de personas participan en limpieza, construcción y descontaminación.', chapter: 7 },
  { date: '2000', title: 'Se apaga el último reactor', note: 'El bloque 3 deja de operar en diciembre de 2000; comienza el desmantelamiento.', chapter: 9 },
  { date: 'Nov 2016', title: 'Se instala el Nuevo Confinamiento Seguro', note: 'Una bóveda de 36.000 toneladas se desliza sobre el sarcófago.', chapter: 9, major: true },
  { date: '2019', title: 'Culmina la puesta en servicio del NSC', note: 'La estructura queda operativa con sistemas de ventilación, control y desmantelamiento.', chapter: 9 },
  { date: '2022', title: 'La guerra llega a Chernóbil', note: 'La invasión rusa ocupa temporalmente la central y interrumpe las actividades.', chapter: 9 },
  { date: '2025', title: 'Un dron daña el NSC', note: 'La IAEA advierte la pérdida de las funciones principales de confinamiento y pide reparaciones urgentes.', chapter: 9, major: true }
];

const COUNTRY_INFO = {
  UKR: { name: 'Ucrania', text: 'El accidente ocurrió en su territorio. La zona de exclusión, Prípiat y la central permanecen bajo control ucraniano; amplias zonas del norte y noroeste recibieron deposición.' },
  BLR: { name: 'Bielorrusia', text: 'Recibió una parte importante de la contaminación. Amplias áreas agrícolas y forestales quedaron bajo control radiológico y se reasentaron decenas de miles de personas.' },
  RUS: { name: 'Rusia europea', text: 'Las regiones de Briansk, Kaluga, Tula y Orel se encuentran entre las afectadas. Se aplicaron programas de control de alimentos y compensaciones.' },
  SWE: { name: 'Suecia', text: 'El 27–28 de abril de 1986, la central de Forsmark detectó radiactividad y activó la alerta internacional. Fue la primera señal exterior de que el origen estaba al este.' },
  FIN: { name: 'Finlandia', text: 'Detectó radiactividad en el ambiente y aplicó restricciones alimentarias. Las dosis medias fueron bajas, comparables a la radiación natural anual.' },
  POL: { name: 'Polonia', text: 'Recibió deposición en varias regiones y adoptó medidas de protección, incluida la distribución de yodo y restricciones a la leche.' },
  DEU: { name: 'Alemania', text: 'Se detectaron radionucleidos y se aplicaron restricciones temporales a algunos alimentos. Las dosis fueron muy inferiores a las de las zonas más afectadas.' },
  AUT: { name: 'Austria', text: 'La contaminación fue desigual, con puntos más altos en zonas de montaña. El país puso en marcha un sistema de control de alimentos y suelos.' },
  NOR: { name: 'Noruega', text: 'La deposición afectó a pastos y rebaños; se aplicaron restricciones a la carne de reno y productos lácteos en algunas regiones.' },
  GBR: { name: 'Reino Unido', text: 'En zonas de Gales, Cumbria y Escocia se impusieron restricciones a la cría de ovejas por cesio-137; algunas se mantuvieron durante años.' },
  FRA: { name: 'Francia', text: 'Se registraron niveles detectables en algunas zonas. El episodio también alimentó el debate público sobre la transparencia de la información radiológica.' },
  ITA: { name: 'Italia', text: 'Se detectaron trazas y se adoptaron restricciones temporales a alimentos importados. Las dosis medias fueron bajas.' },
  ROU: { name: 'Rumanía', text: 'Recibió deposición y aplicó medidas de control alimentario. Las dosis fueron inferiores a las de Ucrania, Bielorrusia y Rusia.' },
  HUN: { name: 'Hungría', text: 'Se detectaron niveles de radiactividad en el ambiente y en alimentos; se aplicaron controles sanitarios.' },
  CZE: { name: 'Chequia', text: 'Registró deposición irregular y adoptó controles alimentarios. La dosis media de la población fue baja.' },
  SVK: { name: 'Eslovaquia', text: 'Se detectaron radionucleidos y se aplicaron medidas de vigilancia alimentaria.' },
  LTU: { name: 'Lituania', text: 'Recibió parte del penacho y aplicó controles. La central de Ignalina, también RBMK, fue revisada y finalmente cerrada.' },
  LVA: { name: 'Letonia', text: 'Se detectó radiactividad ambiental; las autoridades adoptaron restricciones alimentarias temporales.' },
  EST: { name: 'Estonia', text: 'Se registraron niveles detectables, sin efectos agudos. La información pública fue limitada en los primeros días.' },
  DNK: { name: 'Dinamarca', text: 'Detectó radiactividad en el aire y en alimentos. Las dosis fueron bajas y comparables al fondo natural.' },
  NLD: { name: 'Países Bajos', text: 'Se detectaron trazas de radionucleidos; se aplicaron controles a productos alimentarios.' },
  BEL: { name: 'Bélgica', text: 'Se registraron niveles detectables de radiactividad y se adoptaron controles temporales.' },
  CHE: { name: 'Suiza', text: 'La deposición fue irregular; se aplicaron límites a alimentos y se monitorearon suelos de montaña.' },
  ESP: { name: 'España', text: 'Se detectaron trazas en el ambiente; las dosis fueron muy bajas. El accidente influyó en el debate nuclear de la época.' },
  PRT: { name: 'Portugal', text: 'Se detectaron niveles muy bajos de radiactividad; sin efectos sanitarios esperados.' },
  IRL: { name: 'Irlanda', text: 'Se detectaron trazas y se aplicaron controles menores a alimentos. La dosis media fue baja.' },
  GRC: { name: 'Grecia', text: 'Recibió deposición y aplicó controles alimentarios; las dosis fueron bajas.' },
  TUR: { name: 'Turquía', text: 'Se detectaron radionucleidos y se adoptaron medidas de control en alimentos, especialmente en el noreste.' },
  MDA: { name: 'Moldavia', text: 'Se registraron niveles de contaminación y controles agrícolas en algunas zonas.' },
  BGR: { name: 'Bulgaria', text: 'Detectó el paso del penacho y aplicó restricciones alimentarias temporales.' },
  default: { name: 'Europa', text: 'Se detectaron radionucleidos procedentes de Chernóbil en casi toda Europa. En la mayoría de los países, las dosis fueron muy inferiores a las de las zonas más afectadas de Ucrania, Bielorrusia y Rusia.' }
};
