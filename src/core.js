/* ============================================================
   NÚCLEO DE LA EXPERIENCIA
   Render, cámara, materiales, geometría procedural, etiquetas,
   partículas, audio ambiente y utilidades de escena.
   ============================================================ */

let THREE = null;
let OrbitControls = null;

const TAU = Math.PI * 2;
const DEG = Math.PI / 180;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const REDUCED_MOTION = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const SCENE_BUILDERS = {};

const STATE = {
  started: false,
  ready: false,
  chapter: 0,
  paused: false,
  labels: true,
  panelHidden: false,
  modalOpen: false,
  transitioning: false,
  sound: false,
  visited: new Set(),
  activeTab: 'history',
  currentView: '',
  currentStep: 0,
  sequencePlaying: false,
  quality: 0,
  lastFocus: null,
  bootError: null,
  mobile: window.innerWidth <= 900
};

const SCENE = {
  renderer: null,
  camera: null,
  controls: null,
  scene: null,
  root: null,
  module: null,
  clock: null,
  labelEls: [],
  labelData: [],
  textures: new Set(),
  cameraTween: null,
  pointerDown: null,
  raf: 0,
  firstFrame: true
};

/* ---------- Utilidades deterministas y de color ---------- */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function rr(rng, min, max) { return min + rng() * (max - min); }
function pick(rng, arr) { return arr[Math.floor(rng() * arr.length) % arr.length]; }
function vary(color, amount = 0.08, rng = Math.random) {
  const c = new THREE.Color(color);
  const f = 1 + rr(rng, -amount, amount);
  c.r = clamp(c.r * f, 0, 1); c.g = clamp(c.g * f, 0, 1); c.b = clamp(c.b * f, 0, 1);
  return c;
}
function colorLerp(a, b, t) { return new THREE.Color(a).lerp(new THREE.Color(b), t); }
function isFiniteNumber(n) { return Number.isFinite(n); }

/* ---------- Texturas procedurales compartidas ---------- */
const SHARED_TEX = {};

function trackTexture(tex) {
  SCENE.textures.add(tex);
  return tex;
}

function canvasTex(width, height, painter, options = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext('2d');
  painter(ctx, width, height);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = options.linear ? THREE.NoColorSpace : THREE.SRGBColorSpace;
  tex.wrapS = options.wrap || THREE.RepeatWrapping;
  tex.wrapT = options.wrap || THREE.RepeatWrapping;
  tex.anisotropy = SCENE.renderer ? Math.min(8, SCENE.renderer.capabilities.getMaxAnisotropy()) : 4;
  if (options.repeat) tex.repeat.set(options.repeat[0], options.repeat[1]);
  tex.needsUpdate = true;
  if (options.track !== false) trackTexture(tex);
  return tex;
}

function noiseTexture(key, opts = {}) {
  if (SHARED_TEX[key]) return SHARED_TEX[key];
  const size = opts.size || 512;
  const base = opts.base || [42, 44, 39];
  const variance = opts.variance == null ? 28 : opts.variance;
  const rng = mulberry32(opts.seed || 12345);
  const tex = canvasTex(size, size, (ctx, w, h) => {
    const img = ctx.createImageData(w, h);
    for (let i = 0; i < img.data.length; i += 4) {
      const n = (rng() - 0.5) * variance;
      img.data[i] = clamp(base[0] + n, 0, 255);
      img.data[i + 1] = clamp(base[1] + n, 0, 255);
      img.data[i + 2] = clamp(base[2] + n, 0, 255);
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    if (opts.speckle) {
      for (let i = 0; i < opts.speckle; i++) {
        ctx.fillStyle = `rgba(0,0,0,${rr(rng, 0.02, 0.12)})`;
        const s = rr(rng, 1, 4);
        ctx.fillRect(rng() * w, rng() * h, s, s);
      }
    }
    if (opts.cracks) {
      ctx.strokeStyle = 'rgba(5,6,6,.22)';
      ctx.lineWidth = 1;
      for (let i = 0; i < opts.cracks; i++) {
        ctx.beginPath();
        let x = rng() * w, y = rng() * h;
        ctx.moveTo(x, y);
        for (let j = 0; j < 4; j++) {
          x += rr(rng, -20, 20); y += rr(rng, 6, 28);
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
  }, { repeat: opts.repeat || [10, 10], track: false });
  SHARED_TEX[key] = tex;
  return tex;
}

function groundTexture(kind = 'grass') {
  if (SHARED_TEX['ground_' + kind]) return SHARED_TEX['ground_' + kind];
  const presets = {
    grass: { base: [39, 45, 33], variance: 34, speckle: 900, cracks: 0, repeat: [26, 26] },
    dead: { base: [45, 41, 31], variance: 24, speckle: 500, cracks: 0, repeat: [26, 26] },
    asphalt: { base: [24, 26, 26], variance: 17, speckle: 280, cracks: 40, repeat: [18, 18] },
    concrete: { base: [73, 73, 67], variance: 22, speckle: 260, cracks: 25, repeat: [12, 12] },
    dust: { base: [62, 57, 46], variance: 24, speckle: 420, cracks: 0, repeat: [16, 16] }
  };
  const tex = noiseTexture('ground_' + kind, presets[kind] || presets.grass);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function particleTexture(kind = 'soft') {
  const key = 'particle_' + kind;
  if (SHARED_TEX[key]) return SHARED_TEX[key];
  const size = 128;
  const tex = canvasTex(size, size, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 1, w / 2, h / 2, w / 2);
    if (kind === 'fire') {
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.22, 'rgba(255,236,180,.95)');
      g.addColorStop(0.52, 'rgba(255,160,70,.5)');
      g.addColorStop(1, 'rgba(255,100,20,0)');
    } else if (kind === 'smoke') {
      g.addColorStop(0, 'rgba(255,255,255,.72)');
      g.addColorStop(0.38, 'rgba(255,255,255,.39)');
      g.addColorStop(0.76, 'rgba(255,255,255,.12)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
    } else {
      g.addColorStop(0, 'rgba(255,255,255,.95)');
      g.addColorStop(0.35, 'rgba(255,255,255,.5)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
    }
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }, { repeat: [1, 1], wrap: THREE.ClampToEdgeWrapping, track: false });
  SHARED_TEX[key] = tex;
  return tex;
}

function textTexture(textLines, opts = {}) {
  const w = opts.width || 1024;
  const h = opts.height || 512;
  const font = opts.font || '700 150px "Arial", "Segoe UI", sans-serif';
  const color = opts.color || '#d8d2c5';
  const bg = opts.bg || 'transparent';
  const tracking = opts.tracking || 0;
  return canvasTex(w, h, (ctx) => {
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = color;
    ctx.textAlign = opts.align || 'center';
    ctx.textBaseline = 'middle';
    ctx.font = font;
    const lines = Array.isArray(textLines) ? textLines : [textLines];
    const lh = opts.lineHeight || h / (lines.length + 0.4);
    lines.forEach((line, i) => {
      const y = h / 2 + (i - (lines.length - 1) / 2) * lh;
      if (!tracking) {
        ctx.fillText(line, opts.x == null ? w / 2 : opts.x, y);
      } else {
        const chars = Array.from(line);
        const widths = chars.map((c) => ctx.measureText(c).width + tracking);
        const total = widths.reduce((a, b) => a + b, 0) - tracking;
        let x = (opts.x == null ? w / 2 : opts.x) - total / 2;
        chars.forEach((c, j) => { ctx.fillText(c, x, y); x += widths[j]; });
      }
    });
  }, { repeat: [1, 1], wrap: THREE.ClampToEdgeWrapping, track: true });
}

/* ---------- Materiales y primitivas ---------- */
function std(color, opts = {}) {
  return new THREE.MeshStandardMaterial(Object.assign({
    color,
    roughness: 0.82,
    metalness: 0.06
  }, opts));
}
function basic(color, opts = {}) {
  return new THREE.MeshBasicMaterial(Object.assign({ color, toneMapped: false }, opts));
}
function emissive(color, intensity = 1, opts = {}) {
  return new THREE.MeshStandardMaterial(Object.assign({
    color,
    emissive: color,
    emissiveIntensity: intensity,
    roughness: 0.55,
    metalness: 0.1
  }, opts));
}
function glassMat(color = 0x24333a, opacity = 0.35, opts = {}) {
  return new THREE.MeshPhysicalMaterial(Object.assign({
    color,
    transparent: true,
    opacity,
    roughness: 0.14,
    metalness: 0.25,
    transmission: 0,
    side: THREE.DoubleSide
  }, opts));
}

function addBox(parent, w, h, d, x, y, z, material, opts = {}) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  if (opts.rotY) mesh.rotation.y = opts.rotY;
  if (opts.rotX) mesh.rotation.x = opts.rotX;
  if (opts.rotZ) mesh.rotation.z = opts.rotZ;
  mesh.castShadow = opts.cast !== false;
  mesh.receiveShadow = opts.receive !== false;
  if (opts.name) mesh.name = opts.name;
  parent.add(mesh);
  return mesh;
}
function addCylinder(parent, rTop, rBottom, h, x, y, z, material, opts = {}) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBottom, h, opts.segments || 12, opts.heightSeg || 1, !!opts.open), material);
  mesh.position.set(x, y, z);
  if (opts.rotX) mesh.rotation.x = opts.rotX;
  if (opts.rotY) mesh.rotation.y = opts.rotY;
  if (opts.rotZ) mesh.rotation.z = opts.rotZ;
  mesh.castShadow = opts.cast !== false;
  mesh.receiveShadow = opts.receive !== false;
  parent.add(mesh);
  return mesh;
}
function addPlane(parent, w, h, x, y, z, material, opts = {}) {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), material);
  mesh.position.set(x, y, z);
  if (opts.rotX != null) mesh.rotation.x = opts.rotX;
  if (opts.rotY != null) mesh.rotation.y = opts.rotY;
  if (opts.rotZ != null) mesh.rotation.z = opts.rotZ;
  mesh.castShadow = opts.cast === true;
  mesh.receiveShadow = opts.receive !== false;
  parent.add(mesh);
  return mesh;
}
function addSphere(parent, r, x, y, z, material, opts = {}) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, opts.width || 16, opts.height || 12), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = opts.cast !== false;
  mesh.receiveShadow = opts.receive !== false;
  parent.add(mesh);
  return mesh;
}
function addTorus(parent, r, tube, x, y, z, material, opts = {}) {
  const mesh = new THREE.Mesh(new THREE.TorusGeometry(r, tube, opts.radial || 8, opts.tubular || 24, opts.arc || TAU), material);
  mesh.position.set(x, y, z);
  if (opts.rotX != null) mesh.rotation.x = opts.rotX;
  if (opts.rotY != null) mesh.rotation.y = opts.rotY;
  if (opts.rotZ != null) mesh.rotation.z = opts.rotZ;
  mesh.castShadow = opts.cast !== false;
  mesh.receiveShadow = opts.receive !== false;
  parent.add(mesh);
  return mesh;
}
function addLine(parent, points, material) {
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geo, material);
  parent.add(line);
  return line;
}
function addTube(parent, points, radius, material, opts = {}) {
  const curve = new THREE.CatmullRomCurve3(points);
  const geo = new THREE.TubeGeometry(curve, opts.segments || 40, radius, opts.radial || 6, false);
  const mesh = new THREE.Mesh(geo, material);
  mesh.castShadow = opts.cast === true;
  mesh.receiveShadow = false;
  parent.add(mesh);
  return mesh;
}
function addSign(parent, textLines, w, h, x, y, z, opts = {}) {
  const tex = textTexture(textLines, {
    width: opts.texWidth || 1024,
    height: opts.texHeight || 512,
    font: opts.font,
    color: opts.color || '#ddd6c7',
    bg: opts.bg || '#161919',
    tracking: opts.tracking || 0
  });
  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: !!opts.transparent,
    side: THREE.DoubleSide,
    toneMapped: false
  });
  return addPlane(parent, w, h, x, y, z, mat, { rotX: opts.rotX, rotY: opts.rotY, receive: false });
}

/* ---------- Cielo, atmósfera y luces ---------- */
function addSky(world, opts = {}) {
  const top = new THREE.Color(opts.top || 0x101b25);
  const horizon = new THREE.Color(opts.horizon || 0x5d5b50);
  const bottom = new THREE.Color(opts.bottom || 0x080a0a);
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      topColor: { value: top },
      horizonColor: { value: horizon },
      bottomColor: { value: bottom },
      offset: { value: opts.offset == null ? 0.04 : opts.offset },
      exponent: { value: opts.exponent == null ? 0.8 : opts.exponent }
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main(){
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 topColor; uniform vec3 horizonColor; uniform vec3 bottomColor;
      uniform float offset; uniform float exponent;
      varying vec3 vWorldPosition;
      void main(){
        float h = normalize(vWorldPosition).y;
        vec3 col = mix(horizonColor, topColor, pow(max(h + offset, 0.0), exponent));
        col = mix(bottomColor, col, smoothstep(-0.22, 0.02, h));
        gl_FragColor = vec4(col, 1.0);
      }
    `
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(opts.radius || 700, 32, 20), mat);
  sky.frustumCulled = false;
  world.root.add(sky);
  if (opts.stars) addStars(world, opts.stars, opts.radius || 650);
  if (opts.sun) {
    const pos = new THREE.Vector3(...opts.sun.position);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: particleTexture('soft'),
      color: opts.sun.color || 0xffcf9b,
      transparent: true,
      opacity: opts.sun.opacity == null ? 0.55 : opts.sun.opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false
    }));
    glow.position.copy(pos);
    glow.scale.setScalar(opts.sun.size || 75);
    world.root.add(glow);
  }
  return sky;
}

function addStars(world, count = 500, radius = 650) {
  const rng = mulberry32(9182);
  const pos = [];
  for (let i = 0; i < count; i++) {
    const phi = rr(rng, 0, TAU);
    const theta = Math.acos(rr(rng, 0.05, 1));
    const r = radius * rr(rng, 0.8, 1);
    pos.push(r * Math.sin(theta) * Math.cos(phi), r * Math.cos(theta), r * Math.sin(theta) * Math.sin(phi));
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xcfd6d4, size: 0.8, sizeAttenuation: false, transparent: true, opacity: 0.62,
    depthWrite: false, fog: false
  });
  const stars = new THREE.Points(geo, mat);
  stars.frustumCulled = false;
  world.root.add(stars);
  return stars;
}

function addLighting(world, opts = {}) {
  const hemi = new THREE.HemisphereLight(opts.sky || 0x8496a4, opts.ground || 0x1c1711, opts.hemi == null ? 0.65 : opts.hemi);
  world.root.add(hemi);
  if (opts.ambient) {
    world.root.add(new THREE.AmbientLight(opts.ambientColor || 0xffffff, opts.ambient));
  }
  const sun = new THREE.DirectionalLight(opts.sun || 0xffd3a0, opts.intensity == null ? 2.2 : opts.intensity);
  sun.position.set(...(opts.position || [-45, 55, 30]));
  sun.target.position.set(...(opts.target || [0, 0, 0]));
  world.root.add(sun.target);
  sun.castShadow = opts.shadow !== false;
  if (sun.castShadow) {
    sun.shadow.mapSize.set(opts.shadowSize || 2048, opts.shadowSize || 2048);
    const d = opts.shadowSizeWorld || 75;
    sun.shadow.camera.left = -d; sun.shadow.camera.right = d;
    sun.shadow.camera.top = d; sun.shadow.camera.bottom = -d;
    sun.shadow.camera.near = 0.5; sun.shadow.camera.far = 240;
    sun.shadow.bias = -0.0007;
    sun.shadow.normalBias = 0.035;
  }
  world.root.add(sun);
  return { hemi, sun };
}

function addGround(world, opts = {}) {
  const size = opts.size || 340;
  const kind = opts.texture || 'asphalt';
  const tex = groundTexture(kind).clone();
  tex.needsUpdate = true;
  const rep = opts.repeat || 24;
  tex.repeat.set(rep, rep);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  trackTexture(tex);
  const mat = new THREE.MeshStandardMaterial({
    map: tex,
    color: opts.color || 0xffffff,
    roughness: opts.roughness == null ? 0.96 : opts.roughness,
    metalness: opts.metalness == null ? 0.02 : opts.metalness
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size, 1, 1), mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = opts.y == null ? 0 : opts.y;
  mesh.receiveShadow = true;
  world.root.add(mesh);
  return mesh;
}

function addWater(world, opts = {}) {
  const w = opts.width || 220;
  const d = opts.depth || 120;
  const tex = groundTexture('asphalt').clone();
  tex.needsUpdate = true;
  tex.repeat.set(opts.repeat || 22, opts.repeat || 22);
  trackTexture(tex);
  const mat = new THREE.MeshStandardMaterial({
    map: tex,
    color: opts.color || 0x263b40,
    roughness: opts.roughness == null ? 0.28 : opts.roughness,
    metalness: 0.45,
    transparent: true,
    opacity: opts.opacity == null ? 0.92 : opts.opacity
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(opts.x || 0, opts.y == null ? 0.03 : opts.y, opts.z || 0);
  mesh.receiveShadow = true;
  world.root.add(mesh);
  if (opts.animate !== false) {
    world.updaters.push((dt) => {
      tex.offset.x += dt * 0.005;
      tex.offset.y += dt * 0.002;
    });
  }
  return mesh;
}

function addFog(world, color = 0x0c1113, density = 0.008) {
  world.scene.fog = new THREE.FogExp2(color, density);
}

/* ---------- Partículas ---------- */
function createParticleField(world, opts = {}) {
  const count = opts.count || 100;
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const alphas = new Float32Array(count);
  const colors = new Float32Array(count * 3);
  const rng = mulberry32(opts.seed || 42);
  const color = new THREE.Color(opts.color || 0xffffff);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = opts.center ? opts.center[0] + rr(rng, -opts.spread[0], opts.spread[0]) : rr(rng, -10, 10);
    positions[i * 3 + 1] = opts.center ? opts.center[1] + rr(rng, 0, opts.spread[1]) : rr(rng, 0, 10);
    positions[i * 3 + 2] = opts.center ? opts.center[2] + rr(rng, -opts.spread[2], opts.spread[2]) : rr(rng, -10, 10);
    sizes[i] = rr(rng, opts.sizeMin || 0.5, opts.sizeMax || 2);
    alphas[i] = rr(rng, opts.alphaMin == null ? 0.15 : opts.alphaMin, opts.alphaMax == null ? 0.6 : opts.alphaMax);
    const c = color.clone();
    if (opts.colorVary) c.offsetHSL(rr(rng, -opts.colorVary, opts.colorVary), 0, rr(rng, -opts.colorVary, opts.colorVary));
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  geo.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));
  geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
  const tex = particleTexture(opts.texture || 'soft');
  const pixelRatio = SCENE.renderer ? SCENE.renderer.getPixelRatio() : 1;
  const height = SCENE.renderer ? SCENE.renderer.domElement.height : window.innerHeight * pixelRatio;
  const fov = SCENE.camera ? SCENE.camera.fov : 42;
  const scale = height / (2 * Math.tan(fov * DEG / 2));
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      pointTexture: { value: tex },
      uScale: { value: scale }
    },
    vertexShader: `
      attribute float aSize; attribute float aAlpha; attribute vec3 aColor;
      varying float vAlpha; varying vec3 vColor;
      uniform float uScale;
      void main(){
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * uScale / max(1.0, -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
        vAlpha = aAlpha; vColor = aColor;
      }
    `,
    fragmentShader: `
      uniform sampler2D pointTexture;
      varying float vAlpha; varying vec3 vColor;
      void main(){
        vec4 t = texture2D(pointTexture, gl_PointCoord);
        float a = t.a * vAlpha;
        if(a < 0.003) discard;
        gl_FragColor = vec4(vColor, a);
      }
    `,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: opts.additive ? THREE.AdditiveBlending : THREE.NormalBlending
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  points.renderOrder = opts.renderOrder || 2;
  world.root.add(points);
  return {
    points,
    positions,
    sizes,
    alphas,
    colors,
    rng,
    geo,
    mat,
    update() {
      geo.attributes.position.needsUpdate = true;
      geo.attributes.aAlpha.needsUpdate = true;
      geo.attributes.aSize.needsUpdate = true;
    }
  };
}

function addDust(world, opts = {}) {
  const field = createParticleField(world, {
    count: opts.count || 90,
    center: opts.center || [0, 5, 0],
    spread: opts.spread || [20, 10, 20],
    sizeMin: opts.sizeMin || 0.05,
    sizeMax: opts.sizeMax || 0.22,
    alphaMin: 0.05,
    alphaMax: 0.34,
    color: opts.color || 0xcfc6b4,
    texture: 'soft',
    seed: opts.seed || 88
  });
  const speeds = new Float32Array(field.positions.length / 3);
  for (let i = 0; i < speeds.length; i++) speeds[i] = 0.03 + field.rng() * 0.12;
  world.updaters.push((dt, t) => {
    for (let i = 0; i < field.positions.length / 3; i++) {
      field.positions[i * 3] += Math.sin(t * 0.25 + i) * dt * 0.035;
      field.positions[i * 3 + 1] += speeds[i] * dt;
      field.positions[i * 3 + 2] += Math.cos(t * 0.2 + i * 1.7) * dt * 0.03;
      if (field.positions[i * 3 + 1] > (opts.center ? opts.center[1] : 5) + (opts.spread ? opts.spread[1] : 10)) {
        field.positions[i * 3 + 1] = (opts.center ? opts.center[1] : 5) - (opts.spread ? opts.spread[1] : 10) * 0.2;
      }
    }
    field.update();
  });
  return field;
}

function addSmokePlume(world, opts = {}) {
  const origin = opts.origin || [0, 12, 0];
  const count = opts.count || 90;
  const field = createParticleField(world, {
    count,
    center: [origin[0], origin[1], origin[2]],
    spread: opts.spread || [4, 2, 4],
    sizeMin: opts.sizeMin || 2.2,
    sizeMax: opts.sizeMax || 8,
    alphaMin: 0.02,
    alphaMax: opts.alphaMax || 0.16,
    color: opts.color || 0x9b9489,
    colorVary: 0.05,
    texture: 'smoke',
    seed: opts.seed || 23,
    renderOrder: 1
  });
  const rng = mulberry32(opts.seed || 23);
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      life: rng() * (opts.life || 12),
      maxLife: (opts.life || 12) * rr(rng, 0.6, 1.4),
      speed: rr(rng, 0.7, 2.3),
      drift: [rr(rng, -0.5, 1.2), rr(rng, 0.2, 0.9), rr(rng, -0.4, 0.5)],
      baseAlpha: field.alphas[i]
    });
  }
  world.updaters.push((dt) => {
    for (let i = 0; i < count; i++) {
      const d = data[i];
      d.life += dt;
      if (d.life > d.maxLife) {
        d.life = 0;
        field.positions[i * 3] = origin[0] + rr(rng, -2.2, 2.2);
        field.positions[i * 3 + 1] = origin[1] + rr(rng, -1, 1);
        field.positions[i * 3 + 2] = origin[2] + rr(rng, -2.2, 2.2);
        d.maxLife = (opts.life || 12) * rr(rng, 0.6, 1.4);
      }
      const p = d.life / d.maxLife;
      field.positions[i * 3] += d.drift[0] * dt * (0.3 + p);
      field.positions[i * 3 + 1] += d.drift[1] * dt * (0.7 + p);
      field.positions[i * 3 + 2] += d.drift[2] * dt * (0.3 + p);
      field.alphas[i] = d.baseAlpha * Math.sin(Math.PI * p) * (0.6 + 0.4 * (1 - p));
      field.sizes[i] = lerp(opts.sizeMin || 2.2, opts.sizeMax || 8, p);
    }
    field.update();
  });
  return field;
}

function addFire(world, opts = {}) {
  const origin = opts.origin || [0, 5, 0];
  const count = opts.count || 70;
  const field = createParticleField(world, {
    count,
    center: [origin[0], origin[1], origin[2]],
    spread: opts.spread || [5, 2.5, 5],
    sizeMin: opts.sizeMin || 0.8,
    sizeMax: opts.sizeMax || 3.3,
    alphaMin: 0.2,
    alphaMax: 0.85,
    color: opts.color || 0xffa640,
    colorVary: 0.06,
    texture: 'fire',
    additive: true,
    seed: opts.seed || 8,
    renderOrder: 3
  });
  const rng = mulberry32(opts.seed || 8);
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      life: rng() * 2,
      maxLife: rr(rng, 0.7, 1.8),
      speed: rr(rng, 0.8, 2.8),
      drift: rr(rng, -0.35, 0.35)
    });
  }
  world.updaters.push((dt, t) => {
    for (let i = 0; i < count; i++) {
      const d = data[i];
      d.life += dt;
      if (d.life > d.maxLife) {
        d.life = 0;
        field.positions[i * 3] = origin[0] + rr(rng, -(opts.spread ? opts.spread[0] : 5), (opts.spread ? opts.spread[0] : 5));
        field.positions[i * 3 + 1] = origin[1] + rr(rng, -0.8, 1);
        field.positions[i * 3 + 2] = origin[2] + rr(rng, -(opts.spread ? opts.spread[2] : 5), (opts.spread ? opts.spread[2] : 5));
      }
      const p = d.life / d.maxLife;
      field.positions[i * 3 + 1] += d.speed * dt * (0.75 + p * 0.7);
      field.positions[i * 3] += Math.sin(t * 2.2 + i) * dt * 0.16 + d.drift * dt;
      field.positions[i * 3 + 2] += Math.cos(t * 1.8 + i * 0.6) * dt * 0.13;
      field.alphas[i] = (1 - p) * rr(rng, 0.5, 0.92);
      field.sizes[i] = lerp(opts.sizeMin || 0.8, opts.sizeMax || 3.3, p);
      const c = colorLerp(0xffe0a0, 0xb52a18, p);
      field.colors[i * 3] = c.r; field.colors[i * 3 + 1] = c.g; field.colors[i * 3 + 2] = c.b;
    }
    field.update();
    field.geo.attributes.aColor.needsUpdate = true;
  });
  return field;
}

function addGlow(world, pos, color, size, opacity = 0.5) {
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: particleTexture('soft'),
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false
  }));
  sprite.position.set(...pos);
  sprite.scale.setScalar(size);
  world.root.add(sprite);
  return sprite;
}

/* ---------- Árboles, vehículos y figuras ---------- */
function addTrees(world, opts = {}) {
  const count = opts.count || 80;
  const rng = mulberry32(opts.seed || 55);
  const center = opts.center || [0, 0, 0];
  const spreadX = opts.spreadX || 50;
  const spreadZ = opts.spreadZ || 50;
  const dead = !!opts.dead;
  const scale = opts.scale || 1;
  const trunkMat = std(opts.trunkColor || 0x45382b, { roughness: 1 });
  const foliageMat = std(opts.foliageColor || 0x273128, { roughness: 1 });
  const trunkGeo = new THREE.CylinderGeometry(0.09 * scale, 0.18 * scale, 2.2 * scale, 5);
  const trunk = new THREE.InstancedMesh(trunkGeo, trunkMat, count);
  trunk.castShadow = false; trunk.receiveShadow = true;
  const foliageGeo = new THREE.ConeGeometry(1.1 * scale, 3.1 * scale, 6);
  const foliage = new THREE.InstancedMesh(foliageGeo, foliageMat, count);
  foliage.castShadow = false; foliage.receiveShadow = true;
  const dummy = new THREE.Object3D();
  const colorObj = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const x = center[0] + rr(rng, -spreadX, spreadX);
    const z = center[2] + rr(rng, -spreadZ, spreadZ);
    const s = rr(rng, 0.65, 1.35);
    dummy.position.set(x, 1.1 * scale * s, z);
    dummy.rotation.y = rr(rng, 0, TAU);
    dummy.scale.setScalar(s);
    dummy.updateMatrix();
    trunk.setMatrixAt(i, dummy.matrix);
    if (dead) {
      dummy.position.y = 1.35 * scale * s;
      dummy.scale.set(0.2, s, 0.2);
      dummy.updateMatrix();
      foliage.setMatrixAt(i, dummy.matrix);
      colorObj.set(0x65594a);
    } else {
      dummy.position.y = 3.25 * scale * s;
      dummy.scale.set(s, s * rr(rng, 0.8, 1.2), s);
      dummy.updateMatrix();
      foliage.setMatrixAt(i, dummy.matrix);
      colorObj.setHSL(rr(rng, 0.25, 0.34), rr(rng, 0.14, 0.3), rr(rng, 0.14, 0.24));
    }
    foliage.setColorAt(i, colorObj);
  }
  trunk.instanceMatrix.needsUpdate = true;
  foliage.instanceMatrix.needsUpdate = true;
  if (foliage.instanceColor) foliage.instanceColor.needsUpdate = true;
  world.root.add(trunk, foliage);
  return { trunk, foliage };
}

function makeFigure(opts = {}) {
  const group = new THREE.Group();
  const scale = opts.scale || 1;
  const coat = std(opts.coat || 0x2a2b28, { roughness: 0.92 });
  const pants = std(opts.pants || 0x20221f, { roughness: 0.95 });
  const skin = std(opts.skin || 0x9b7965, { roughness: 0.9 });
  const accent = std(opts.accent || 0x9f7a3c, { roughness: 0.8 });
  const helmetMat = std(opts.helmet || 0xb8752b, { roughness: 0.65, metalness: 0.1 });
  // piernas
  const legGeo = new THREE.CylinderGeometry(0.1, 0.09, 0.72, 6);
  const legL = new THREE.Mesh(legGeo, pants); legL.position.set(-0.11, 0.38, 0);
  const legR = legL.clone(); legR.position.x = 0.11;
  // torso
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.48, 4, 8), coat);
  torso.position.y = 1.03; torso.castShadow = true;
  // brazos
  const armGeo = new THREE.CylinderGeometry(0.075, 0.065, 0.66, 6);
  const armL = new THREE.Mesh(armGeo, coat); armL.position.set(-0.29, 0.99, 0); armL.rotation.z = 0.08;
  const armR = armL.clone(); armR.position.x = 0.29; armR.rotation.z = -0.08;
  // cabeza
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.145, 10, 8), skin); head.position.y = 1.46;
  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 8, 0, TAU, 0, Math.PI / 2), helmetMat);
  helmet.position.y = 1.5; helmet.scale.y = 0.9;
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.03, 12), helmetMat);
  brim.position.y = 1.48;
  const vest = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.28, 0.25), accent);
  vest.position.y = 1.1;
  const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8), std(0x555b5c, { metalness: 0.65, roughness: 0.3 }));
  tank.position.set(0, 1.08, -0.19);
  [legL, legR, torso, armL, armR, head, helmet, brim, vest, tank].forEach((o) => {
    o.castShadow = true; o.receiveShadow = true; group.add(o);
  });
  if (opts.noHelmet) { helmet.visible = false; brim.visible = false; }
  if (opts.noTank) tank.visible = false;
  if (opts.noVest) vest.visible = false;
  if (opts.apron) {
    const apron = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.64, 0.27), std(0x272926, { roughness: 0.9 }));
    apron.position.set(0, 0.98, 0.02); apron.castShadow = true; group.add(apron);
  }
  group.scale.setScalar(scale);
  group.userData.head = head;
  return group;
}

function makeFireTruck(scale = 1) {
  const g = new THREE.Group();
  const red = std(0x9c2f24, { roughness: 0.6, metalness: 0.15 });
  const dark = std(0x1c1e1d, { roughness: 0.9 });
  const white = std(0xcfcdc3, { roughness: 0.7 });
  const metal = std(0x777d7d, { roughness: 0.4, metalness: 0.55 });
  const glass = glassMat(0x1b2b30, 0.7, { roughness: 0.08, metalness: 0.2 });
  addBox(g, 2.1, 0.55, 4.5, 0, 0.62, 0, red);
  addBox(g, 2.15, 1.1, 1.55, 0, 1.35, 1.35, red);
  addBox(g, 1.9, 0.45, 1.6, 0, 1.92, 1.36, red);
  addPlane(g, 1.7, 0.52, 0, 1.66, 2.14, glass, { rotX: 0, receive: false });
  addBox(g, 2.16, 0.22, 0.25, 0, 0.86, 2.24, white);
  addBox(g, 2.0, 1.3, 2.5, 0, 1.28, -1.18, red);
  addBox(g, 2.02, 0.1, 2.5, 0, 1.96, -1.2, white);
  // escalera
  addBox(g, 0.1, 0.1, 3.6, -0.6, 2.15, -1.1, metal);
  addBox(g, 0.1, 0.1, 3.6, 0.6, 2.15, -1.1, metal);
  for (let i = 0; i < 7; i++) addBox(g, 1.2, 0.035, 0.35, 0, 2.15, 0.4 - i * 0.52, metal);
  // ruedas
  const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.28, 12);
  const wheelMat = std(0x111313, { roughness: 0.95 });
  [[-1.1, 1.35], [1.1, 1.35], [-1.1, -1.35], [1.1, -1.35]].forEach(([x, z]) => {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.rotation.z = Math.PI / 2; wheel.position.set(x, 0.38, z); wheel.castShadow = true; g.add(wheel);
  });
  const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.16, 0.14, 10), emissive(0xc23526, 2.5));
  beacon.position.set(0, 2.22, 1.35); g.add(beacon);
  const beaconLight = new THREE.PointLight(0xff3d25, 1.1, 8, 2);
  beaconLight.position.set(0, 2.4, 1.35); g.add(beaconLight);
  g.userData.beacon = beaconLight;
  g.scale.setScalar(scale);
  return g;
}

function makeBus(scale = 1) {
  const g = new THREE.Group();
  const body = std(0xb48b39, { roughness: 0.8 });
  const cream = std(0xcfc7ae, { roughness: 0.8 });
  const dark = std(0x171918, { roughness: 0.95 });
  const glass = glassMat(0x1b2a2e, 0.75);
  addBox(g, 2.35, 2.1, 7.8, 0, 1.45, 0, body);
  addBox(g, 2.36, 0.32, 7.82, 0, 2.25, 0, cream);
  addBox(g, 2.37, 0.16, 7.84, 0, 1.7, 0, cream);
  addBox(g, 2.1, 0.8, 0.06, 0, 1.68, 3.91, glass);
  addBox(g, 2.1, 0.8, 0.06, 0, 1.68, -3.91, glass);
  for (let i = 0; i < 5; i++) {
    addPlane(g, 1.0, 0.65, 1.19, 1.75, -2.6 + i * 1.3, glass, { rotY: Math.PI / 2, receive: false });
    addPlane(g, 1.0, 0.65, -1.19, 1.75, -2.6 + i * 1.3, glass, { rotY: -Math.PI / 2, receive: false });
  }
  const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 12);
  [[-1.2, 2.4], [1.2, 2.4], [-1.2, -2.4], [1.2, -2.4]].forEach(([x, z]) => {
    const w = new THREE.Mesh(wheelGeo, dark); w.rotation.z = Math.PI / 2; w.position.set(x, 0.4, z); g.add(w);
  });
  g.scale.setScalar(scale);
  return g;
}

function makeCar(scale = 1, color = 0x4b5654) {
  const g = new THREE.Group();
  const paint = std(color, { roughness: 0.55, metalness: 0.3 });
  const glass = glassMat(0x1a2529, 0.8);
  addBox(g, 1.9, 0.48, 4.1, 0, 0.52, 0, paint);
  addBox(g, 1.65, 0.55, 2.0, 0, 0.94, -0.15, paint);
  addBox(g, 1.5, 0.42, 1.9, 0, 0.98, -0.15, glass);
  const wheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.24, 10);
  [[-0.95, 1.25], [0.95, 1.25], [-0.95, -1.25], [0.95, -1.25]].forEach(([x, z]) => {
    const w = new THREE.Mesh(wheelGeo, std(0x111313)); w.rotation.z = Math.PI / 2; w.position.set(x, 0.3, z); g.add(w);
  });
  g.scale.setScalar(scale);
  return g;
}

function makeTruck(scale = 1) {
  const g = new THREE.Group();
  const body = std(0x5f665c, { roughness: 0.85 });
  const cab = std(0x646b5f, { roughness: 0.72 });
  const canvasMat = std(0x4b4a3c, { roughness: 1 });
  addBox(g, 2.3, 0.65, 5.9, 0, 0.85, 0, body);
  addBox(g, 2.2, 1.4, 1.7, 0, 1.55, 2.0, cab);
  addBox(g, 2.24, 1.0, 3.5, 0, 1.55, -1.1, canvasMat);
  const wheelGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.3, 10);
  [[-1.15, 2.0], [1.15, 2.0], [-1.15, -1.8], [1.15, -1.8]].forEach(([x, z]) => {
    const w = new THREE.Mesh(wheelGeo, std(0x111313)); w.rotation.z = Math.PI / 2; w.position.set(x, 0.45, z); g.add(w);
  });
  g.scale.setScalar(scale);
  return g;
}

/* ---------- Gestión de escena y cámara ---------- */
function makeWorld(name) {
  const root = new THREE.Group();
  root.name = name || 'escena';
  return {
    root,
    scene: SCENE.scene,
    labels: [],
    pickables: [],
    updaters: [],
    time: 0
  };
}

function addLabel(world, data) {
  const pos = data.position instanceof THREE.Vector3 ? data.position.clone() : new THREE.Vector3(...data.position);
  world.labels.push({
    text: data.text || '',
    sub: data.sub || '',
    position: pos,
    object: data.object || null,
    offset: data.offset || null,
    views: data.views || null
  });
}

function buildLabelLayer() {
  const layer = $('#label-layer');
  layer.innerHTML = '';
  SCENE.labelEls = [];
  SCENE.labelData = SCENE.module ? SCENE.module.labels : [];
  SCENE.labelData.forEach((label, i) => {
    const el = document.createElement('div');
    el.className = 'label-item';
    el.dataset.index = i;
    const dot = document.createElement('span'); dot.className = 'label-dot';
    const text = document.createElement('span'); text.className = 'label-text';
    const b = document.createElement('b'); b.textContent = label.text;
    text.appendChild(b);
    if (label.sub) {
      const small = document.createElement('small'); small.textContent = label.sub;
      text.appendChild(small);
    }
    el.appendChild(dot); el.appendChild(text);
    layer.appendChild(el);
    SCENE.labelEls.push(el);
  });
  layer.classList.toggle('labels-off', !STATE.labels);
}

function updateLabels() {
  if (!SCENE.camera || !SCENE.labelData.length) return;
  const width = window.innerWidth;
  const height = window.innerHeight;
  const panel = $('#narrative');
  const panelVisible = panel && !STATE.panelHidden && getComputedStyle(panel).visibility !== 'hidden';
  const rect = panelVisible ? panel.getBoundingClientRect() : null;
  const safeRight = rect ? rect.left - 12 : width - 12;
  const topSafe = STATE.mobile ? 64 : 76;
  const bottomSafe = height - (STATE.mobile ? 76 : 96);
  const temp = new THREE.Vector3();
  SCENE.labelData.forEach((label, i) => {
    const el = SCENE.labelEls[i];
    if (!el) return;
    if (label.views && !label.views.includes(STATE.currentView)) {
      el.classList.remove('is-visible');
      return;
    }
    const pos = temp.copy(label.position);
    if (label.object) label.object.getWorldPosition(pos);
    if (label.offset) pos.add(label.offset);
    pos.project(SCENE.camera);
    const behind = pos.z > 1;
    const x = (pos.x * 0.5 + 0.5) * width;
    const y = (-pos.y * 0.5 + 0.5) * height;
    const visible = !behind && x > 30 && x < safeRight && y > topSafe && y < bottomSafe;
    el.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
    el.classList.toggle('is-visible', visible && STATE.labels);
  });
}

function setCameraImmediate(position, target, fov = 42) {
  if (!SCENE.camera || !SCENE.controls) return;
  SCENE.camera.fov = fov;
  SCENE.camera.position.copy(position);
  SCENE.controls.target.copy(target);
  SCENE.camera.updateProjectionMatrix();
  SCENE.controls.update();
  SCENE.cameraTween = null;
}

function flyCamera(position, target, fov = 42, duration = 1.15) {
  if (!SCENE.camera || !SCENE.controls) return;
  if (REDUCED_MOTION) {
    setCameraImmediate(position, target, fov);
    return;
  }
  SCENE.cameraTween = {
    fromPos: SCENE.camera.position.clone(),
    toPos: position.clone ? position.clone() : new THREE.Vector3(...position),
    fromTarget: SCENE.controls.target.clone(),
    toTarget: target.clone ? target.clone() : new THREE.Vector3(...target),
    fromFov: SCENE.camera.fov,
    toFov: fov,
    started: performance.now(),
    duration: Math.max(0.2, duration) * 1000
  };
}

function updateCameraTween() {
  const tw = SCENE.cameraTween;
  if (!tw) return;
  const raw = clamp((performance.now() - tw.started) / tw.duration, 0, 1);
  const k = smooth(raw);
  SCENE.camera.position.lerpVectors(tw.fromPos, tw.toPos, k);
  SCENE.controls.target.lerpVectors(tw.fromTarget, tw.toTarget, k);
  SCENE.camera.fov = lerp(tw.fromFov, tw.toFov, k);
  SCENE.camera.updateProjectionMatrix();
  if (raw >= 1) SCENE.cameraTween = null;
}

/* ---------- Audio ambiente procedural ---------- */
const AUDIO = {
  ctx: null,
  master: null,
  noiseSource: null,
  noiseFilter: null,
  noiseGain: null,
  droneA: null,
  droneB: null,
  droneGain: null,
  enabled: false,
  current: 0,
  clickTimer: 0,
  init() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.0;
    this.master.connect(this.ctx.destination);

    const bufferSize = this.ctx.sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      last = 0.985 * last + 0.015 * white;
      data[i] = last * 3.2;
    }
    this.noiseSource = this.ctx.createBufferSource();
    this.noiseSource.buffer = buffer;
    this.noiseSource.loop = true;
    this.noiseFilter = this.ctx.createBiquadFilter();
    this.noiseFilter.type = 'lowpass';
    this.noiseFilter.frequency.value = 420;
    this.noiseFilter.Q.value = 0.6;
    this.noiseGain = this.ctx.createGain();
    this.noiseGain.gain.value = 0.25;
    this.noiseSource.connect(this.noiseFilter).connect(this.noiseGain).connect(this.master);
    this.noiseSource.start();

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.value = 0.2;
    this.droneGain.connect(this.master);
    this.droneA = this.ctx.createOscillator();
    this.droneA.type = 'sine'; this.droneA.frequency.value = 49;
    this.droneB = this.ctx.createOscillator();
    this.droneB.type = 'triangle'; this.droneB.frequency.value = 98.5;
    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass'; lowpass.frequency.value = 190;
    const gB = this.ctx.createGain(); gB.gain.value = 0.12;
    this.droneA.connect(this.droneGain);
    this.droneB.connect(gB).connect(lowpass).connect(this.droneGain);
    this.droneA.start(); this.droneB.start();
  },
  profile(index) {
    this.current = index;
    if (!this.ctx || !this.enabled) return;
    const profiles = [
      { filter: 300, noise: 0.22, drone: 0.16, freq: 42 },
      { filter: 850, noise: 0.08, drone: 0.34, freq: 50 },
      { filter: 220, noise: 0.3, drone: 0.22, freq: 35 },
      { filter: 1300, noise: 0.22, drone: 0.05, freq: 42 },
      { filter: 380, noise: 0.18, drone: 0.08, freq: 42 },
      { filter: 500, noise: 0.12, drone: 0.1, freq: 55 },
      { filter: 900, noise: 0.16, drone: 0.06, freq: 45 },
      { filter: 460, noise: 0.25, drone: 0.05, freq: 40 },
      { filter: 520, noise: 0.17, drone: 0.13, freq: 48 },
      { filter: 300, noise: 0.15, drone: 0.08, freq: 36 }
    ];
    const p = profiles[index] || profiles[0];
    const now = this.ctx.currentTime;
    this.noiseFilter.frequency.cancelScheduledValues(now);
    this.noiseFilter.frequency.linearRampToValueAtTime(p.filter, now + 1.2);
    this.noiseGain.gain.cancelScheduledValues(now);
    this.noiseGain.gain.linearRampToValueAtTime(p.noise * 0.12, now + 1.2);
    this.droneGain.gain.cancelScheduledValues(now);
    this.droneGain.gain.linearRampToValueAtTime(p.drone * 0.12, now + 1.2);
    this.droneA.frequency.cancelScheduledValues(now);
    this.droneA.frequency.linearRampToValueAtTime(p.freq, now + 1.5);
    this.setClicks(index === 3);
  },
  setClicks(active) {
    if (this.clickTimer) { clearTimeout(this.clickTimer); this.clickTimer = 0; }
    if (!active || !this.enabled || !this.ctx) return;
    const click = () => {
      if (!this.enabled || !this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square'; osc.frequency.value = 1100 + Math.random() * 900;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.025, t + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
      osc.connect(gain).connect(this.master);
      osc.start(t); osc.stop(t + 0.05);
      this.clickTimer = setTimeout(click, 260 + Math.random() * 980);
    };
    this.clickTimer = setTimeout(click, 500);
  },
  toggle(force) {
    this.init();
    if (!this.ctx) return false;
    this.enabled = force;
    if (force) {
      this.ctx.resume();
      const now = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.linearRampToValueAtTime(0.55, now + 1.2);
      this.profile(this.current);
    } else {
      const now = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.linearRampToValueAtTime(0.0001, now + 0.5);
      this.setClicks(false);
    }
    return true;
  },
  impact(type) {
    if (!this.enabled || !this.ctx) return;
    const t = this.ctx.currentTime;
    if (type === 'explosion') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(95, t);
      osc.frequency.exponentialRampToValueAtTime(24, t + 1.9);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.7, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.5);
      osc.connect(gain).connect(this.master);
      osc.start(t); osc.stop(t + 2.6);
      const bufferSize = Math.floor(this.ctx.sampleRate * 1.2);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      const src = this.ctx.createBufferSource(); src.buffer = buffer;
      const filter = this.ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 420;
      const g2 = this.ctx.createGain(); g2.gain.value = 0.35;
      src.connect(filter).connect(g2).connect(this.master);
      src.start(t);
    } else if (type === 'flash') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth'; osc.frequency.value = 62;
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      osc.connect(gain).connect(this.master);
      osc.start(t); osc.stop(t + 0.2);
    }
  }
};

/* ---------- Gestión de escena ---------- */
function setupThree() {
  const canvas = $('#webgl');
  SCENE.renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: false
  });
  SCENE.renderer.setSize(window.innerWidth, window.innerHeight, false);
  SCENE.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  SCENE.renderer.outputColorSpace = THREE.SRGBColorSpace;
  SCENE.renderer.toneMapping = THREE.ACESFilmicToneMapping;
  SCENE.renderer.toneMappingExposure = 1.02;
  SCENE.renderer.shadowMap.enabled = true;
  SCENE.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  SCENE.scene = new THREE.Scene();
  SCENE.camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 1800);
  SCENE.camera.position.set(55, 30, 60);
  SCENE.clock = new THREE.Clock();
  SCENE.controls = new OrbitControls(SCENE.camera, canvas);
  SCENE.controls.enableDamping = true;
  SCENE.controls.dampingFactor = 0.065;
  SCENE.controls.enablePan = false;
  SCENE.controls.minPolarAngle = 0.12;
  SCENE.controls.maxPolarAngle = Math.PI * 0.495;
  SCENE.controls.rotateSpeed = 0.55;
  SCENE.controls.zoomSpeed = 0.8;
  SCENE.controls.target.set(0, 8, 0);
  applyCompositionOffset();
  $('#quality-readout').textContent = `WEBGL · ${Math.min(window.devicePixelRatio || 1, 1.6).toFixed(1)}×`;
  canvas.addEventListener('pointerdown', () => { SCENE.cameraTween = null; });

  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      SCENE.clock.stop();
    } else {
      SCENE.clock.start();
      SCENE.clock.getDelta();
    }
  });
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    showToast('Se perdió el contexto WebGL. Recarga la página para continuar.');
  });
  startRenderLoop();
}

function onResize() {
  if (!SCENE.renderer || !SCENE.camera) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  SCENE.camera.aspect = w / h;
  SCENE.camera.updateProjectionMatrix();
  SCENE.renderer.setSize(w, h, false);
  const dpr = [1.6, 1.3, 1.05][STATE.quality] || 1.6;
  SCENE.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dpr));
  $('#quality-readout').textContent = `WEBGL · ${(Math.min(window.devicePixelRatio || 1, dpr)).toFixed(1)}×`;
  STATE.mobile = w <= 900;
  applyCompositionOffset();
}

function compositionOffset() {
  if (STATE.mobile || STATE.panelHidden) return 0;
  const panel = $('#narrative');
  if (!panel) return 0;
  const rect = panel.getBoundingClientRect();
  if (!rect || rect.width < 2) return 0;
  return Math.min(330, rect.width * 0.56);
}

// Desplaza la cámara hacia la izquierda para que el panel no tape el centro
// de la composición. La interfaz conserva así su propio espacio visual.
function applyCompositionOffset() {
  if (!SCENE.camera) return;
  const w = window.innerWidth, h = window.innerHeight;
  const off = compositionOffset();
  if (off > 0) {
    SCENE.camera.setViewOffset(w, h, off, 0, w, h);
  } else {
    SCENE.camera.clearViewOffset();
  }
  SCENE.camera.aspect = w / h;
  SCENE.camera.updateProjectionMatrix();
}

function startRenderLoop() {
  let last = performance.now();
  let fpsTime = 0;
  let fpsFrames = 0;
  let qualityChecked = false;
  function frame(now) {
    SCENE.raf = requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.06);
    last = now;
    if (!SCENE.renderer || !SCENE.scene || !SCENE.camera) return;
    if (SCENE.controls) SCENE.controls.update();
    updateCameraTween();
    if (SCENE.module && !STATE.paused && !document.hidden) {
      SCENE.module.update(dt, now / 1000);
    }
    // Mantiene sincronizado el botón cuando una secuencia termina sola.
    if (STATE.sequencePlaying !== STATE._lastSequencePlaying) {
      STATE._lastSequencePlaying = STATE.sequencePlaying;
      syncSequenceButton();
    }
    updateLabels();
    if (!STATE.started && SCENE.module) {
      // Deriva muy lenta durante la portada.
      if (!STATE.paused) SCENE.controls.target.x += Math.sin(now / 9000) * 0.0003;
    }
    SCENE.renderer.render(SCENE.scene, SCENE.camera);

    if (!qualityChecked) {
      fpsTime += dt; fpsFrames++;
      if (fpsTime > 3.2) {
        qualityChecked = true;
        const avg = fpsFrames / fpsTime;
        if (avg < 38 && STATE.quality < 2) {
          STATE.quality++;
          onResize();
        }
      }
    }
  }
  SCENE.raf = requestAnimationFrame(frame);
}

function disposeObject3D(obj) {
  if (!obj) return;
  obj.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
    if (o.material) {
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      mats.forEach((m) => {
        if (!m) return;
        m.dispose();
      });
    }
  });
}

function destroyScene() {
  if (SCENE.root) {
    SCENE.scene.remove(SCENE.root);
    disposeObject3D(SCENE.root);
    SCENE.root = null;
  }
  SCENE.textures.forEach((t) => { try { t.dispose(); } catch (e) {} });
  SCENE.textures.clear();
  SCENE.scene.fog = null;
  SCENE.module = null;
  SCENE.labelData = [];
  SCENE.labelEls = [];
  $('#label-layer').innerHTML = '';
  closeMapCard();
}

function installScene(module) {
  destroyScene();
  const canvas = $('#webgl');
  if (canvas) canvas.style.opacity = '1';
  SCENE.module = module;
  SCENE.root = module.root;
  SCENE.renderer.toneMappingExposure = module.exposure == null ? 1.1 : module.exposure;
  SCENE.scene.add(module.root);
  // Iluminación cinematográfica: sin caída cuadrática, las lámparas
  // prácticas iluminan el espacio a la escala de estos dioramas.
  SCENE.root.traverse((o) => {
    if (o.isPointLight || o.isSpotLight) {
      o.decay = 1;
      o.intensity *= 4;
    }
  });
  if (module.fog) SCENE.scene.fog = module.fog;
  buildLabelLayer();
  const d = module.defaultView || (CHAPTERS[STATE.chapter].views && CHAPTERS[STATE.chapter].views[0].id);
  STATE.currentView = d;
  if (d && module.setView) module.setView(d, true);
  $$('.view-pill').forEach((b) => b.classList.toggle('is-active', b.dataset.view === d));
  if (module.setStep && CHAPTERS[STATE.chapter].sequence) {
    const initial = CHAPTERS[STATE.chapter].initialStep == null ? 0 : CHAPTERS[STATE.chapter].initialStep;
    STATE.currentStep = initial;
    module.setStep(initial, true);
  }
  if (module.camera) {
    SCENE.controls.minDistance = module.camera.minDistance || 4;
    SCENE.controls.maxDistance = module.camera.maxDistance || 180;
    SCENE.controls.minPolarAngle = module.camera.minPolarAngle == null ? 0.12 : module.camera.minPolarAngle;
    SCENE.controls.maxPolarAngle = module.camera.maxPolarAngle == null ? Math.PI * 0.495 : module.camera.maxPolarAngle;
    setCameraImmediate(
      new THREE.Vector3(...module.camera.position),
      new THREE.Vector3(...module.camera.target),
      module.camera.fov || 42
    );
    applyCompositionOffset();
  }
  SCENE.clock.start();
  SCENE.firstFrame = true;
}

/* ---------- Etiquetas, tarjeta de mapa y puntero ---------- */
function showMapCard(code) {
  const card = $('#map-card');
  const info = COUNTRY_INFO[code] || COUNTRY_INFO.default;
  $('#map-card-title').textContent = info.name;
  $('#map-card-text').textContent = info.text;
  card.hidden = false;
  card.classList.remove('is-entering');
  void card.offsetWidth;
  card.classList.add('is-entering');
  card.dataset.country = code;
}
function closeMapCard() {
  const card = $('#map-card');
  if (card) { card.hidden = true; card.dataset.country = ''; }
}
function setMapTooltip(text, event) {
  const tip = $('#map-tooltip');
  if (!text) { tip.classList.remove('is-visible'); return; }
  tip.innerHTML = text;
  tip.style.left = `${event.clientX}px`;
  tip.style.top = `${event.clientY}px`;
  tip.classList.add('is-visible');
}
function hideMapTooltip() { $('#map-tooltip').classList.remove('is-visible'); }

function installPointerEvents() {
  const canvas = $('#webgl');
  let downX = 0, downY = 0;
  canvas.addEventListener('pointerdown', (e) => { downX = e.clientX; downY = e.clientY; });
  canvas.addEventListener('pointerup', (e) => {
    if (Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY) > 6) return;
    if (!SCENE.module || !SCENE.module.pickables || !SCENE.module.pickables.length) return;
    const hit = pickAt(e);
    if (hit && SCENE.module.onPick) SCENE.module.onPick(hit, e);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!SCENE.module || !SCENE.module.pickables || !SCENE.module.pickables.length) return;
    const hit = pickAt(e);
    canvas.style.cursor = hit ? 'pointer' : 'grab';
    if (SCENE.module.onHover) SCENE.module.onHover(hit, e);
  });
  canvas.addEventListener('pointerleave', () => {
    hideMapTooltip();
    if (SCENE.module && SCENE.module.onHover) SCENE.module.onHover(null, null);
  });
}

function pickAt(event) {
  if (!SCENE.module || !SCENE.module.pickables.length) return null;
  const rect = SCENE.renderer.domElement.getBoundingClientRect();
  const pointer = new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1
  );
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(pointer, SCENE.camera);
  const hits = raycaster.intersectObjects(SCENE.module.pickables, false);
  return hits.length ? hits[0] : null;
}

/* ---------- Utilidades de escena ---------- */
function addRubble(world, opts = {}) {
  const rng = mulberry32(opts.seed || 77);
  const count = opts.count || 40;
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const mat = std(opts.color || 0x67665f, { roughness: 1 });
  const inst = new THREE.InstancedMesh(geo, mat, count);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < count; i++) {
    const s = rr(rng, 0.2, 1.3);
    dummy.position.set(
      (opts.center ? opts.center[0] : 0) + rr(rng, -(opts.spread || 15), (opts.spread || 15)),
      s * 0.4,
      (opts.center ? opts.center[2] : 0) + rr(rng, -(opts.spread || 15), (opts.spread || 15))
    );
    dummy.rotation.set(rr(rng, 0, TAU), rr(rng, 0, TAU), rr(rng, 0, TAU));
    dummy.scale.set(s * rr(rng, 0.6, 1.8), s * rr(rng, 0.3, 0.9), s * rr(rng, 0.6, 1.8));
    dummy.updateMatrix();
    inst.setMatrixAt(i, dummy.matrix);
  }
  inst.instanceMatrix.needsUpdate = true;
  inst.castShadow = true; inst.receiveShadow = true;
  world.root.add(inst);
  return inst;
}

function addTrench(world, opts = {}) {
  const w = opts.width || 10;
  const d = opts.depth || 10;
  const h = opts.height || 0.1;
  const mat = std(opts.color || 0x2c2a24, { roughness: 1 });
  return addBox(world.root, w, h, d, opts.x || 0, opts.y || 0, opts.z || 0, mat, { cast: false, receive: true });
}

function addFence(world, opts = {}) {
  const length = opts.length || 60;
  const step = opts.step || 4;
  const x = opts.x || 0, z = opts.z || 0, rot = opts.rot || 0;
  const postMat = std(0x5e625d, { metalness: 0.4, roughness: 0.6 });
  const wireMat = new THREE.LineBasicMaterial({ color: opts.color || 0x4d5450, transparent: true, opacity: 0.55 });
  const n = Math.ceil(length / step);
  const g = new THREE.Group();
  for (let i = 0; i <= n; i++) {
    const lx = -length / 2 + i * step;
    addCylinder(g, 0.04, 0.045, 2.4, lx, 1.2, 0, postMat, { segments: 5 });
  }
  const points1 = [], points2 = [];
  for (let i = 0; i <= n; i++) {
    const lx = -length / 2 + i * step;
    points1.push(new THREE.Vector3(lx, 2.3, 0));
    points2.push(new THREE.Vector3(lx, 0.15, 0));
  }
  addLine(g, points1, wireMat);
  addLine(g, points2, wireMat);
  g.position.set(x, 0, z); g.rotation.y = rot;
  world.root.add(g);
  return g;
}

function addPuddle(world, x, z, r, color = 0x131c1f) {
  const p = new THREE.Mesh(new THREE.CircleGeometry(r, 24), new THREE.MeshStandardMaterial({
    color, roughness: 0.18, metalness: 0.55, transparent: true, opacity: 0.82
  }));
  p.rotation.x = -Math.PI / 2; p.position.set(x, 0.02, z); p.receiveShadow = true;
  world.root.add(p);
  return p;
}

function updateFlicker(light, t, base, amp, speed = 8) {
  light.intensity = base + Math.sin(t * speed) * amp + Math.sin(t * speed * 2.7) * amp * 0.5;
}

/* ---------- Navegación y estado de capítulo ---------- */
async function goToChapter(index, opts = {}) {
  index = clamp(index, 0, CHAPTERS.length - 1);
  if (STATE.transitioning) return;
  if (index === STATE.chapter && !opts.force) return;
  STATE.transitioning = true;
  STATE.paused = false;
  STATE.sequencePlaying = false;
  document.body.classList.remove('paused');
  $('#btn-pause').classList.remove('is-paused');
  $('#btn-pause').setAttribute('aria-pressed', 'false');
  closeMapCard();
  const chapter = CHAPTERS[index];
  if (!opts.silent) {
    showTransition(chapter);
    await delay(620);
  }
  STATE.chapter = index;
  STATE.activeTab = 'history';
  renderChapterUI(chapter);
  let module = null;
  try {
    const builder = SCENE_BUILDERS[chapter.id];
    if (!builder) throw new Error(`No hay constructor para el capítulo ${chapter.id}`);
    module = await Promise.resolve(builder());
    installScene(module);
  } catch (err) {
    console.error('Error al construir la escena:', err);
    destroyScene();
    showSceneError(err);
  }
  STATE.used = true;
  $('#app').dataset.chapter = String(chapter.id);
  updateNavigation();
  if (!opts.silent) {
    hideTransition();
    await delay(560);
  }
  STATE.transitioning = false;
  if (STATE.started) AUDIO.profile(chapter.id - 1);
}

function showTransition(chapter) {
  const el = $('#chapter-transition');
  $('#ct-num').textContent = chapter.num;
  $('#ct-title').textContent = chapter.title;
  $('#ct-place').textContent = chapter.place;
  el.classList.remove('is-leaving');
  el.classList.add('is-active');
  el.setAttribute('aria-hidden', 'false');
}
function hideTransition() {
  const el = $('#chapter-transition');
  el.classList.add('is-leaving');
  setTimeout(() => {
    el.classList.remove('is-active', 'is-leaving');
    el.setAttribute('aria-hidden', 'true');
  }, 620);
}

/* ---------- Progreso, navegación y UI ---------- */
function renderRail() {
  const list = $('#rail-list');
  list.innerHTML = '';
  CHAPTERS.forEach((ch, i) => {
    const li = document.createElement('li');
    li.className = 'rail-item';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'rail-btn';
    btn.dataset.chapter = String(i);
    btn.setAttribute('aria-label', `Capítulo ${ch.num}: ${ch.title}`);
    btn.textContent = ch.num;
    const label = document.createElement('span');
    label.className = 'rail-label';
    label.textContent = `Cap. ${ch.num} — ${ch.title}`;
    li.appendChild(btn); li.appendChild(label);
    list.appendChild(li);
  });
  list.addEventListener('click', (e) => {
    const btn = e.target.closest('.rail-btn');
    if (!btn) return;
    goToChapter(Number(btn.dataset.chapter));
  });
}

function renderPanelDots() {
  const el = $('#panel-dots');
  el.innerHTML = '';
  CHAPTERS.forEach((_, i) => {
    const dot = document.createElement('i');
    if (i === STATE.chapter) dot.classList.add('is-active');
    else if (STATE.visited.has(i)) dot.classList.add('is-visited');
    el.appendChild(dot);
  });
}

function updateNavigation() {
  $$('.rail-btn').forEach((b, i) => {
    b.classList.toggle('is-active', i === STATE.chapter);
    b.classList.toggle('is-visited', STATE.visited.has(i) && i !== STATE.chapter);
    if (i === STATE.chapter) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
  });
  STATE.visited.add(STATE.chapter);
  renderPanelDots();
  $('#current-num').textContent = CHAPTERS[STATE.chapter].num;
  $('#progress-fill').style.width = `${((STATE.chapter + 1) / CHAPTERS.length) * 100}%`;
  $('#btn-prev').disabled = STATE.chapter === 0;
  $('#btn-next').disabled = STATE.chapter === CHAPTERS.length - 1;
  $('#btn-prev').setAttribute('aria-disabled', STATE.chapter === 0 ? 'true' : 'false');
  $('#btn-next').setAttribute('aria-disabled', STATE.chapter === CHAPTERS.length - 1 ? 'true' : 'false');
  $('#btn-prev-panel').disabled = STATE.chapter === 0;
  $('#btn-next-panel').disabled = STATE.chapter === CHAPTERS.length - 1;
  $('#current-num').textContent = CHAPTERS[STATE.chapter].num;
  const times = ['1986', '01:23:40', '01:23:44', '01:28', '27.04.1986', '28.04.1986', '1986—1990', '2026', '2016—2026', 'PRESENTE'];
  $('#topbar-time').textContent = times[STATE.chapter] || '1986';
  $('#topbar-location').textContent = CHAPTERS[STATE.chapter].metaLocation || CHAPTERS[STATE.chapter].place.toUpperCase();
}

function renderChapterUI(ch) {
  $('#chapter-index').textContent = ch.num;
  $('#chapter-eyebrow').textContent = ch.eyebrow;
  $('#chapter-place').textContent = ch.place;
  $('#chapter-title').textContent = ch.title;
  $('#chapter-subtitle').textContent = ch.subtitle;
  $('#chapter-lead').textContent = ch.lead;
  const stats = $('#stat-row');
  stats.innerHTML = '';
  ch.stats.forEach((s) => {
    const div = document.createElement('div');
    div.className = 'stat';
    const strong = document.createElement('strong');
    strong.innerHTML = `${s.value}${s.unit ? `<span class="unit">${s.unit}</span>` : ''}`;
    const label = document.createElement('span');
    label.textContent = s.label;
    div.appendChild(strong); div.appendChild(label);
    if (s.source && SOURCES[s.source]) {
      const src = document.createElement('button');
      src.type = 'button'; src.className = 'src-inline'; src.dataset.source = s.source;
      src.textContent = SOURCES[s.source].short;
      div.appendChild(src);
    }
    stats.appendChild(div);
  });
  const keys = $('#key-grid');
  keys.innerHTML = ch.keys.map((k) => `<div class="key-item"><span>${k.n}</span><p>${k.text}</p></div>`).join('');
  const story = $('#story');
  story.innerHTML = ch.sections.map((sec) => {
    const body = sec.body.map((p) => `<p>${p}</p>`).join('');
    const src = sec.source && SOURCES[sec.source]
      ? `<button type="button" class="src-inline" data-source="${sec.source}">${SOURCES[sec.source].short}</button>`
      : '';
    return `<section><h3>${sec.heading}${src}</h3>${body}</section>`;
  }).join('');
  $('#reconstruction-text').textContent = ch.reconstruction;
  $('#chapter-source-line').innerHTML = `<span>Fuentes del capítulo</span>` +
    Array.from(new Set(ch.sourceIds)).map((id) => SOURCES[id]
      ? `<button type="button" class="src-inline" data-source="${id}">${SOURCES[id].short}</button>`
      : '').join('');
  const quote = $('#chapter-quote');
  if (ch.quote) {
    quote.innerHTML = `${ch.quote}${ch.quoteFooter ? `<footer>${ch.quoteFooter}</footer>` : '<footer>REFLEXIÓN DEL GUION</footer>'}`;
    quote.style.display = '';
  } else {
    quote.style.display = 'none';
  }
  $('#notes-time').textContent = ch.notes.time;
  $('#notes-body').innerHTML = ch.notes.body.map((p) => `<p>${p}</p>`).join('');
  $('#transition-text').textContent = ch.notes.transition;
  $('#panel-scroll').scrollTop = 0;
  setTab(STATE.activeTab);
  renderSceneControls(ch);
  updateSceneMeta(ch);
}

function updateSceneMeta(ch) {
  $('#scene-mode').textContent = 'RECONSTRUCCIÓN 3D EN TIEMPO REAL';
  $('#scene-location').textContent = ch.metaLocation || 'CHERNÓBIL';
  $('#topbar-location').textContent = ch.metaLocation || ch.place.toUpperCase();
}

function setTab(tab) {
  STATE.activeTab = tab;
  $$('.tab[data-tab]').forEach((b) => {
    const active = b.dataset.tab === tab;
    b.classList.toggle('is-active', active);
    b.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  const history = $('#panel-history'), notes = $('#panel-notes');
  if (history) { history.hidden = tab !== 'history'; history.classList.toggle('is-active', tab === 'history'); }
  if (notes) { notes.hidden = tab !== 'notes'; notes.classList.toggle('is-active', tab === 'notes'); }
  $('#panel-scroll').scrollTop = 0;
}

function renderSceneControls(ch) {
  const views = $('#view-pills');
  views.innerHTML = (ch.views || []).map((v, i) => `<button type="button" class="view-pill${i === 0 ? ' is-active' : ''}" data-view="${v.id}">${v.label}</button>`).join('');
  const actions = $('#scene-actions');
  const buttons = [];
  if (ch.sequence) {
    const labels = { 5: 'Reproducir evacuación', 7: 'Reproducir construcción', 9: 'Recorrer etapas' };
    buttons.push(`<button type="button" class="action-btn is-primary" data-play-sequence="true" aria-pressed="false"><span class="action-ico">▶</span><span class="action-label">${labels[ch.id] || 'Reproducir secuencia'}</span></button>`);
  }
  (ch.actions || []).forEach((a) => {
    if (a.reflection) {
      buttons.push(`<button type="button" class="action-btn" data-reflection="true"><span class="action-ico">“</span>${a.label}</button>`);
    } else {
      buttons.push(`<button type="button" class="action-btn" data-modal="${a.modal}"><span class="action-ico">◇</span>${a.label}</button>`);
    }
  });
  if (!buttons.length) {
    buttons.push(`<button type="button" class="action-btn is-ghost" data-reset-view="true"><span class="action-ico">⌖</span>Centrar cámara</button>`);
  }
  actions.innerHTML = buttons.join('');
  const seq = $('#sequence-strip');
  if (ch.sequence) {
    seq.hidden = false;
    $('#sequence-title').textContent = ch.sequence.title;
    $('#sequence-track').innerHTML = ch.sequence.steps.map((s, i) =>
      `<button type="button" class="seq-step" data-step="${i}" aria-label="Paso ${i + 1}: ${s.label}"><span>${String(i + 1).padStart(2, '0')} · ${s.label}</span></button>`
    ).join('');
    STATE.currentStep = ch.initialStep == null ? 0 : ch.initialStep;
    updateSequenceUI(STATE.currentStep);
  } else {
    seq.hidden = true;
  }
}

function updateSequenceUI(step) {
  const ch = CHAPTERS[STATE.chapter];
  if (!ch || !ch.sequence) return;
  const safe = clamp(step, 0, ch.sequence.steps.length - 1);
  STATE.currentStep = safe;
  $$('.seq-step').forEach((b, i) => {
    b.classList.toggle('is-active', i === safe);
    b.classList.toggle('is-past', i < safe);
    b.setAttribute('aria-current', i === safe ? 'step' : 'false');
  });
  $('#sequence-step-label').textContent = `PASO ${String(safe + 1).padStart(2, '0')} / ${String(ch.sequence.steps.length).padStart(2, '0')}`;
  const s = ch.sequence.steps[safe];
  $('#sequence-caption').innerHTML = `<b>${s.label}.</b> ${s.caption}`;
  syncSequenceButton();
}

function syncSequenceButton() {
  const btn = $('#scene-actions [data-play-sequence]');
  if (!btn) return;
  const ch = CHAPTERS[STATE.chapter];
  if (!ch || !ch.sequence) return;
  const labels = { 5: 'Reproducir evacuación', 7: 'Reproducir construcción', 9: 'Recorrer etapas' };
  const endedLabels = { 5: 'Repetir evacuación', 7: 'Repetir construcción', 9: 'Volver a recorrer' };
  const ended = STATE.currentStep >= ch.sequence.steps.length - 1;
  const pausedSequence = !!STATE.sequencePlaying && STATE.paused;
  const playing = !!STATE.sequencePlaying && !STATE.paused;
  const icon = playing ? '❚❚' : pausedSequence ? '▶' : ended ? '↻' : '▶';
  const label = playing ? 'Detener secuencia' : pausedSequence ? 'Reanudar secuencia' : ended ? (endedLabels[ch.id] || 'Repetir secuencia') : (labels[ch.id] || 'Reproducir secuencia');
  btn.innerHTML = `<span class="action-ico">${icon}</span><span class="action-label">${label}</span>`;
  btn.classList.toggle('is-playing', playing);
  btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
  const strip = $('#sequence-strip');
  if (strip) strip.classList.toggle('is-playing', playing);
}

function setView(id) {
  if (!SCENE.module || !SCENE.module.setView) return;
  STATE.currentView = id;
  $$('.view-pill').forEach((b) => b.classList.toggle('is-active', b.dataset.view === id));
  SCENE.module.setView(id);
}

function showSceneError(err) {
  const webgl = $('#webgl');
  webgl.style.opacity = '0';
  showToast('No se pudo construir la escena 3D. El contenido y las fuentes siguen disponibles.');
  console.error(err);
}

/* ---------- Portada e inicio ---------- */
function setBootReady() {
  STATE.ready = true;
  const btn = $('#enter-btn');
  btn.disabled = false;
  $('#enter-label').textContent = 'ENTRAR AL ARCHIVO';
}

function beginExperience() {
  if (!STATE.ready || STATE.started) return;
  STATE.started = true;
  const start = $('#start-screen');
  start.classList.add('is-leaving');
  $('#app').classList.remove('is-intro');
  setTimeout(() => { start.style.display = 'none'; }, 950);
  if (STATE.sound) AUDIO.toggle(true);
  AUDIO.profile(STATE.chapter);
  setTimeout(() => $('#narrative').focus({ preventScroll: true }), 700);
}

function updateSoundUI() {
  const btn = $('#btn-sound');
  btn.setAttribute('aria-pressed', STATE.sound ? 'true' : 'false');
  $('#sound-ico').textContent = STATE.sound ? '◉' : '◌';
  $('#sound-label').textContent = STATE.sound ? 'Silencio' : 'Sonido';
}

/* ---------- Toast ---------- */
let toastTimer = 0;
function showToast(msg, duration = 3200) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-visible'), duration);
}
