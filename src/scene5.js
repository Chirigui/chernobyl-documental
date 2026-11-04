/* ============================================================
   CAPÍTULO 5 · PRÍPIAT
   Ciudad habitada, evacuación y abandono. Noria, avenida,
   edificios residenciales y autobuses.
   ============================================================ */

function addWindowGrid(parent, opts) {
  const {
    w, h, d, cols, rows, yStart = 1.6, yStep = 2.6,
    litRatio = 0.45, seed = 1, sideRatio = 0.45, tone = 0xffc47a
  } = opts;
  const rng = mulberry32(seed);
  const sideCols = Math.max(1, Math.round(cols * d / Math.max(1, w) * sideRatio));
  const count = rows * cols * 2 + rows * sideCols * 2;
  const geo = new THREE.PlaneGeometry(0.82, 1.05);
  const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  const dummy = new THREE.Object3D();
  const color = new THREE.Color();
  let idx = 0;
  function addFace(face, row, col, totalCols) {
    const span = face === 'front' || face === 'back' ? w : d;
    const margin = 1.2;
    const step = (span - margin * 2) / Math.max(1, totalCols - 1);
    const lateral = -span / 2 + margin + col * step;
    const y = yStart + row * yStep;
    if (face === 'front') { dummy.position.set(lateral, y, d / 2 + 0.025); dummy.rotation.set(0, 0, 0); }
    if (face === 'back') { dummy.position.set(-lateral, y, -d / 2 - 0.025); dummy.rotation.set(0, Math.PI, 0); }
    if (face === 'left') { dummy.position.set(-w / 2 - 0.025, y, lateral); dummy.rotation.set(0, -Math.PI / 2, 0); }
    if (face === 'right') { dummy.position.set(w / 2 + 0.025, y, -lateral); dummy.rotation.set(0, Math.PI / 2, 0); }
    dummy.updateMatrix();
    mesh.setMatrixAt(idx, dummy.matrix);
    const lit = rng() < litRatio;
    if (lit) {
      color.set(tone).offsetHSL(rr(rng, -0.03, 0.03), rr(rng, -0.04, 0.02), rr(rng, -0.22, 0.02));
    } else {
      color.set(0x0b1012);
    }
    mesh.setColorAt(idx, color);
    idx++;
  }
  for (let side = 0; side < 2; side++) {
    const face = side ? 'back' : 'front';
    for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) addFace(face, row, col, cols);
  }
  for (let side = 0; side < 2; side++) {
    const face = side ? 'left' : 'right';
    for (let row = 0; row < rows; row++) for (let col = 0; col < sideCols; col++) addFace(face, row, col, sideCols);
  }
  mesh.count = idx;
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  mesh.castShadow = false; mesh.receiveShadow = false;
  parent.add(mesh);
  return { mesh, mat };
}

SCENE_BUILDERS[5] = function buildChapter5() {
  const world = makeWorld('cap5-pripyat');
  const rng = mulberry32(2704);
  const sky = addSky(world, {
    top: 0x1a2635, horizon: 0xb18458, bottom: 0x0a0c0d,
    stars: 90, sun: { position: [-120, 32, -180], color: 0xffbf7d, size: 58, opacity: 0.3 }
  });
  addFog(world, 0x3a3128, 0.0042);
  const lighting = addLighting(world, {
    sky: 0x8198a8, ground: 0x2a2118, hemi: 0.64,
    sun: 0xffc07e, intensity: 2.35, position: [-80, 42, 55],
    shadowSizeWorld: 70, shadowSize: 2048, ambient: 0.08
  });
  addGround(world, { size: 300, texture: 'grass', repeat: 26, color: 0x85816a });
  addGround(world, { size: 240, texture: 'asphalt', repeat: 18, color: 0x75746b, y: 0.025 });
  // Avenida central.
  const avenue = addBox(world.root, 16, 0.08, 150, 0, 0.05, -15, std(0x4a4b44, { roughness: 0.95 }), { cast: false });
  avenue.receiveShadow = true;
  // Líneas viales.
  for (let i = 0; i < 14; i++) {
    addBox(world.root, 0.22, 0.018, 3.6, 0, 0.1, -70 + i * 10, std(0xb9b09a, { roughness: 0.8 }), { cast: false });
  }
  // Aceras.
  addBox(world.root, 4.5, 0.23, 150, -10.2, 0.13, -15, std(0x85837a, { roughness: 1 }), { cast: false });
  addBox(world.root, 4.5, 0.23, 150, 10.2, 0.13, -15, std(0x85837a, { roughness: 1 }), { cast: false });

  const concrete = std(0x8c897c, { roughness: 0.94 });
  const panelA = std(0x918e80, { roughness: 0.92 });
  const panelB = std(0x7d7d72, { roughness: 0.93 });
  const dark = std(0x30332f, { roughness: 0.9 });
  const metal = std(0x656b65, { roughness: 0.5, metalness: 0.4 });
  const yellow = std(0xb59645, { roughness: 0.7, metalness: 0.25 });
  const rust = std(0x72503c, { roughness: 0.92, metalness: 0.15 });

  const blocks = [];
  function apartment(x, z, w, d, floors, seed, opts = {}) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    world.root.add(g);
    const h = floors * 2.75 + 1.2;
    const mat = opts.mat || (seed % 2 ? panelA : panelB);
    addBox(g, w, h, d, 0, h / 2, 0, mat, { cast: true });
    addBox(g, w + 0.4, 0.65, d + 0.4, 0, h + 0.3, 0, dark, { cast: true });
    // Junta vertical de paneles.
    addBox(g, 0.15, h, d + 0.03, 0, h / 2, d / 2 + 0.02, std(0x6f6d64), { cast: false });
    const windows = addWindowGrid(g, {
      w, h, d, cols: Math.max(3, Math.round(w / 2.8)), rows: floors,
      yStart: 1.8, yStep: 2.75, litRatio: opts.litRatio == null ? 0.55 : opts.litRatio,
      seed, tone: 0xffc274
    });
    // Balcones.
    for (let f = 1; f < floors; f += 2) {
      addBox(g, w * 0.34, 0.18, 1.25, -w * 0.2, 1.9 + f * 2.75, d / 2 + 0.62, concrete, { cast: false });
      addBox(g, w * 0.34, 0.6, 0.08, -w * 0.2, 2.23 + f * 2.75, d / 2 + 1.24, metal, { cast: false });
    }
    // Entrada.
    addBox(g, 3.4, 2.2, 0.5, 0, 1.1, d / 2 + 0.04, dark, { cast: false });
    addBox(g, 5, 0.22, 1.7, 0, 2.4, d / 2 + 0.65, concrete, { cast: false });
    // Antena.
    addCylinder(g, 0.035, 0.05, 3.4, w * 0.25, h + 2, 0, metal, { segments: 4, cast: false });
    blocks.push({ group: g, mat, windows, h, w, d, x, z });
    return g;
  }
  apartment(-31, 12, 18, 12, 6, 11);
  apartment(-22, -18, 16, 12, 8, 23);
  apartment(21, 0, 18, 12, 5, 37);
  apartment(23, -24, 17, 12, 7, 49);
  apartment(-24, -40, 18, 12, 5, 61);
  apartment(0, -45, 20, 13, 7, 73, { mat: panelA });

  // Palacio de Cultura Energetik, al fondo derecho.
  const palace = new THREE.Group();
  palace.position.set(23, 0, -10);
  palace.rotation.y = -0.04;
  world.root.add(palace);
  addBox(palace, 25, 8.5, 13, 0, 4.25, 0, concrete, { cast: true });
  addBox(palace, 26, 0.8, 14, 0, 8.8, 0, dark, { cast: true });
  for (let i = 0; i < 7; i++) addBox(palace, 0.65, 6.8, 0.8, -10.5 + i * 3.5, 3.5, 6.9, std(0x9e9a8b), { cast: false });
  addBox(palace, 20, 5.2, 0.4, 0, 4.1, 6.95, basic(0x1b2528), { cast: false, receive: false });
  addSign(palace, ['ЭНЕРГЕТИК'], 15, 2.2, 0, 8.1, 13.1, {
    bg: '#343b36', color: '#d6cbb2', font: '600 90px "Segoe UI", Arial', texWidth: 1400, texHeight: 220
  });
  addBox(palace, 8, 3.6, 4.5, 0, 1.8, 8, concrete, { cast: true });
  addBox(palace, 11, 0.3, 6, 0, 3.7, 8, concrete, { cast: false });

  // Noria de Prípiat: nunca llegó a inaugurarse.
  const wheel = new THREE.Group();
  wheel.position.set(-20, 0, 0);
  wheel.rotation.y = 0.22;
  world.root.add(wheel);
  addBox(wheel, 2.8, 0.7, 3.6, 0, 0.35, 0, concrete, { cast: true });
  // Patas en A.
  const legMat = std(0x8f7b4b, { roughness: 0.8, metalness: 0.2 });
  [-5.2, 5.2].forEach((x) => {
    addBox(wheel, 0.5, 9.2, 0.5, x, 4.6, 0, legMat, { rotZ: x < 0 ? -0.18 : 0.18, cast: true });
    addBox(wheel, 0.35, 3.2, 0.35, x * 0.72, 2.4, 0, legMat, { rotZ: x < 0 ? 0.48 : -0.48, cast: true });
  });
  addCylinder(wheel, 0.3, 0.3, 11.6, 0, 8.2, 0, metal, { rotZ: Math.PI / 2, segments: 12, cast: true });
  const wheelMats = [];
  const rimMat = std(0xa08b4e, { roughness: 0.72, metalness: 0.25 });
  wheelMats.push(rimMat);
  addTorus(wheel, 7.4, 0.16, 0, 8.2, 0, rimMat, { radial: 6, tubular: 36, cast: true });
  addTorus(wheel, 6.9, 0.08, 0, 8.2, 0.2, rimMat, { radial: 5, tubular: 36, cast: false });
  const gondolaMat = std(0xb29243, { roughness: 0.7, metalness: 0.15 });
  wheelMats.push(gondolaMat);
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * TAU;
    const x = Math.cos(a) * 7.15;
    const y = 8.2 + Math.sin(a) * 7.15;
    const spoke = addCylinder(wheel, 0.055, 0.055, 7.3, Math.cos(a) * 3.6, 8.2 + Math.sin(a) * 3.6, 0, rimMat, { segments: 4, cast: false });
    spoke.rotation.z = a + Math.PI / 2;
    addBox(wheel, 1.5, 1.3, 1.1, x, y - 1.1, 0, gondolaMat, { rotZ: a, cast: true });
    addBox(wheel, 1.6, 0.12, 1.2, x, y - 0.42, 0, dark, { rotZ: a, cast: false });
    addBox(wheel, 0.1, 0.65, 0.1, x, y - 0.45, 0, rimMat, { cast: false });
  }
  addLabel(world, { text: 'NORIA DE PRÍPIAT', sub: 'debía abrir el 1 de mayo de 1986', position: [-20, 18.5, 0] });

  // Parque infantil.
  const park = new THREE.Group();
  park.position.set(14, 0, -18);
  world.root.add(park);
  addBox(park, 12, 0.18, 9, 0, 0.12, 0, std(0x6c6a5c, { roughness: 1 }), { cast: false });
  addCylinder(park, 0.12, 0.16, 2.4, -3, 1.2, 0, metal, { segments: 6 });
  addCylinder(park, 0.12, 0.16, 2.4, 3, 1.2, 0, metal, { segments: 6 });
  addBox(park, 6.4, 0.16, 0.5, 0, 2.4, 0, metal, { rotZ: 0, cast: true });
  addBox(park, 2.6, 0.12, 0.7, -1.1, 0.85, 1.4, std(0x8b6b3d), { cast: true });
  addBox(park, 2.6, 0.12, 0.7, 1.1, 0.85, 1.4, std(0x8b6b3d), { cast: true });
  addCylinder(park, 0.09, 0.09, 2.1, -3, 1.1, 2.1, metal, { rotZ: -0.45, segments: 5 });
  addCylinder(park, 0.09, 0.09, 2.1, 3, 1.1, 2.1, metal, { rotZ: 0.45, segments: 5 });

  // Árboles de la ciudad.
  addTrees(world, { count: 48, center: [-13, 0, -9], spreadX: 17, spreadZ: 48, scale: 0.75, seed: 5, trunkColor: 0x4e3d2b, foliageColor: 0x3b4a32 });
  // Vegetación que aparece tras el abandono.
  const overgrowth = new THREE.Group();
  world.root.add(overgrowth);
  const treeWorld = { root: overgrowth };
  const overTrees = addTrees(treeWorld, { count: 75, center: [0, 0, -12], spreadX: 38, spreadZ: 55, scale: 0.8, seed: 17, trunkColor: 0x3b3022, foliageColor: 0x293525 });
  overgrowth.visible = true;
  [overTrees.trunk.material, overTrees.foliage.material].forEach((m) => { m.transparent = true; m.opacity = 0; });
  // Pequeñas balsas de vegetación.
  for (let i = 0; i < 28; i++) {
    const bush = new THREE.Mesh(new THREE.ConeGeometry(rr(rng, 0.5, 1.3), rr(rng, 0.8, 1.8), 6), std(0x2f3b2b, { roughness: 1, transparent: true, opacity: 0 }));
    bush.position.set(rr(rng, -32, 32), rr(rng, 0.4, 0.8), rr(rng, -60, 20));
    overgrowth.add(bush);
  }

  // Farolas.
  const streetLights = [];
  const lampMats = [];
  for (let i = 0; i < 6; i++) {
    const x = i % 2 ? -11.8 : 11.8;
    const z = 18 - i * 14;
    const post = new THREE.Group(); post.position.set(x, 0, z);
    addCylinder(post, 0.1, 0.16, 5.8, 0, 2.9, 0, metal, { segments: 6 });
    addBox(post, 1.6, 0.1, 0.1, x < 0 ? 0.75 : -0.75, 5.75, 0, metal, { cast: false });
    const lampMat = emissive(0xd8bc79, 1.4);
    lampMats.push(lampMat);
    addSphere(post, 0.24, x < 0 ? 1.48 : -1.48, 5.7, 0, lampMat, { cast: false });
    if (i < 3) {
      const l = new THREE.PointLight(0xffca7a, 1.3, 18, 2);
      l.position.set(x < 0 ? 1.48 : -1.48, 5.7, 0); post.add(l); streetLights.push(l);
    }
    world.root.add(post);
  }

  // Autobuses de evacuación.
  const buses = new THREE.Group();
  world.root.add(buses);
  const busList = [];
  for (let i = 0; i < 5; i++) {
    const b = makeBus(1.0);
    b.position.set(i % 2 ? -3.8 : 3.8, 0, 40 + i * 9);
    b.rotation.y = 0;
    b.visible = false;
    b.userData.startZ = 40 + i * 9;
    b.userData.endZ = 8 - i * 8;
    buses.add(b); busList.push(b);
  }

  // Coches de la ciudad.
  const cars = [];
  const carColors = [0x6a7b78, 0x8b7d5e, 0x5d4b3d, 0x8e908a];
  [[-6, 9, 0.1], [7, -6, 3.1], [-7, -22, 0.3], [6, 17, 3.2]].forEach(([x, z, ry], i) => {
    const c = makeCar(0.9, carColors[i % carColors.length]);
    c.position.set(x, 0.1, z); c.rotation.y = ry;
    world.root.add(c); cars.push(c);
  });

  // Personas y vida cotidiana.
  const people = new THREE.Group();
  world.root.add(people);
  const peopleData = [];
  const clothes = [0x606c6d, 0x8f6a56, 0x5b5a45, 0x7d5c59, 0x48545a, 0x9a8360, 0x5a4c6b, 0x777267];
  for (let i = 0; i < 15; i++) {
    const adult = makeFigure({
      coat: clothes[i % clothes.length],
      pants: i % 2 ? 0x2b2e2d : 0x3d3b35,
      accent: 0x846b46,
      skin: i % 3 ? 0xa17d63 : 0x7f5b45,
      noHelmet: true, noTank: true, noVest: true,
      scale: i < 4 ? rr(rng, 0.6, 0.72) : rr(rng, 0.9, 1.0)
    });
    const x = rr(rng, -8, 8);
    const z = rr(rng, -6, 20);
    const base = new THREE.Vector3(x, 0, z);
    adult.position.copy(base);
    adult.rotation.y = rr(rng, 0, TAU);
    people.add(adult);
    peopleData.push({ mesh: adult, base, phase: rr(rng, 0, TAU), speed: rr(rng, 0.6, 1.2) });
  }
  addLabel(world, { text: 'AVENIDA CENTRAL', sub: 'una ciudad de 49.360 habitantes', position: [0, 7.5, 2] });
  addLabel(world, { text: 'AUTOBUSES DE EVACUACIÓN', sub: '27 de abril · 14:00', position: [-7, 4.5, 12] });
  addLabel(world, { text: 'PALACIO DE CULTURA', sub: 'ENERGETIK', position: [23, 12, -3] });

  // Portón de Prípiat.
  const gate = new THREE.Group();
  gate.position.set(-14, 0, 17);
  gate.rotation.y = 0.25;
  world.root.add(gate);
  addBox(gate, 0.6, 6, 0.6, -8, 3, 0, metal, { cast: true });
  addBox(gate, 0.6, 6, 0.6, 8, 3, 0, metal, { cast: true });
  addSign(gate, ['ПРИПЯТЬ', 'PRIPYAT'], 12, 3.4, 0, 6.4, 0, {
    bg: '#36403a', color: '#ddd5be', font: '600 64px "Segoe UI", Arial', texWidth: 1400, texHeight: 400
  });

  const skyDayTop = new THREE.Color(0x1a2635);
  const skyDayHorizon = new THREE.Color(0xb18458);
  const skyAbandonedTop = new THREE.Color(0x1a2428);
  const skyAbandonedHorizon = new THREE.Color(0x5c5f59);
  const fogColorDay = new THREE.Color(0x3a3128);
  const fogColorAbandoned = new THREE.Color(0x3a3c39);
  const fog = SCENE.scene.fog;

  let life = 1, evac = 0, abandon = 0;
  let targetLife = 1, targetEvac = 0, targetAbandon = 0;
  let step = 0;
  let playing = false;
  let stageTime = 0;
  let seqTick = performance.now();
  // La primera etapa es más breve para que la evacuación empiece enseguida.
  const durations = [2.4, 5.6, 4.4];

  function applyStep(index, instant) {
    step = clamp(index, 0, 2);
    if (step === 0) { targetLife = 1; targetEvac = 0; targetAbandon = 0; }
    if (step === 1) { targetLife = 0.42; targetEvac = 1; targetAbandon = 0.18; }
    if (step === 2) { targetLife = 0; targetEvac = 0; targetAbandon = 1; }
    stageTime = 0;
    seqTick = performance.now();
    if (instant) {
      life = targetLife; evac = targetEvac; abandon = targetAbandon;
    }
    updateSequenceUI(step);
  }
  function setStep(index, instant) {
    playing = false;
    applyStep(index, instant);
  }
  function playSequence() {
    // setStep() detiene la reproducción por diseño; por eso se reactiva después.
    setStep(0, true);
    playing = true;
    stageTime = 0;
    seqTick = performance.now();
    updateSequenceUI(0);
  }

  const views = {
    avenue: { position: [30, 20, 55], target: [-4, 7, -15], fov: 51 },
    wheel: { position: [5, 10, 24], target: [-20, 9, 0], fov: 43 },
    blocks: { position: [34, 18, 18], target: [-2, 9, -9], fov: 49 }
  };
  function setView(id) {
    const v = views[id] || views.avenue;
    flyCamera(new THREE.Vector3(...v.position), new THREE.Vector3(...v.target), v.fov, 1.25);
  }
  function resetView() { setView('avenue'); }

  // aplicación inicial
  applyStep(0, true);

  return {
    root: world.root,
    labels: world.labels,
    pickables: [],
    camera: { position: views.avenue.position, target: views.avenue.target, fov: 51, minDistance: 10, maxDistance: 120, minPolarAngle: 0.18, maxPolarAngle: Math.PI * 0.49 },
    defaultView: 'avenue',
    exposure: 1.12,
    setView,
    resetView,
    setStep,
    playSequence,
    update(dt, t) {
      world.updaters.forEach((fn) => fn(dt, t));
      const k = clamp(dt * 0.75, 0, 1);
      life = lerp(life, targetLife, k);
      evac = lerp(evac, targetEvac, k);
      abandon = lerp(abandon, targetAbandon, k);
      // Cielo y niebla.
      const top = skyDayTop.clone().lerp(skyAbandonedTop, abandon);
      const hor = skyDayHorizon.clone().lerp(skyAbandonedHorizon, abandon);
      sky.material.uniforms.topColor.value.copy(top);
      sky.material.uniforms.horizonColor.value.copy(hor);
      fog.color.copy(fogColorDay.clone().lerp(fogColorAbandoned, abandon));
      fog.density = lerp(0.0042, 0.009, abandon);
      lighting.sun.intensity = lerp(2.35, 0.58, abandon);
      lighting.hemi.intensity = lerp(0.64, 0.38, abandon);
      lighting.sun.color.copy(new THREE.Color(0xffc07e).lerp(new THREE.Color(0xa3b2b3), abandon));
      // Ventanas.
      blocks.forEach((b) => {
        b.windows.mat.color.copy(new THREE.Color(0xffffff).lerp(new THREE.Color(0x0d1213), abandon).multiplyScalar(0.28 + life * 0.72));
      });
      // Farolas.
      streetLights.forEach((l, i) => { l.intensity = life * (1.1 + Math.sin(t * 2.1 + i) * 0.03); });
      lampMats.forEach((m) => { m.emissiveIntensity = life * 1.3; });
      // Vegetación invasora.
      const opacity = clamp(abandon * 1.25 - 0.1, 0, 1);
      [overTrees.trunk.material, overTrees.foliage.material].forEach((m) => { m.opacity = opacity; m.depthWrite = opacity > 0.2; });
      overgrowth.children.forEach((c) => {
        if (c.material && c.material.transparent && c.material !== overTrees.trunk.material && c.material !== overTrees.foliage.material) {
          c.material.opacity = opacity;
          c.material.depthWrite = opacity > 0.2;
        }
      });
      // Autobuses.
      buses.visible = evac > 0.02;
      busList.forEach((b, i) => {
        const p = smooth(clamp(evac * 1.25, 0, 1));
        b.position.z = lerp(b.userData.startZ, b.userData.endZ, p);
        b.position.x = i % 2 ? -3.8 : 3.8;
        b.position.y = 0.02;
        b.visible = evac > 0.04 && abandon < 0.7;
      });
      // Personas.
      people.visible = life > 0.03;
      peopleData.forEach((p, i) => {
        const walk = clamp(evac * 1.7 - i * 0.04, 0, 1);
        if (walk > 0.92) {
          p.mesh.visible = false;
        } else {
          p.mesh.visible = life > 0.03;
          const targetZ = 11.2;
          const targetX = i % 2 ? -2.2 : 2.2;
          p.mesh.position.x = lerp(p.base.x, targetX, smooth(walk));
          p.mesh.position.z = lerp(p.base.z, targetZ, smooth(walk));
          p.mesh.position.y = Math.sin(t * 2.1 + p.phase) * 0.012;
          if (walk > 0.05) p.mesh.rotation.y = Math.atan2(targetX - p.mesh.position.x, targetZ - p.mesh.position.z);
          else p.mesh.rotation.y = p.phase;
        }
      });
      // Coches.
      cars.forEach((c, i) => {
        c.visible = abandon < 0.65;
        if (i === 3 && evac > 0.1) c.position.z += dt * 0.8;
      });
      // Balanceo de la noria, sin sugerir que funcionaba.
      wheel.rotation.z = Math.sin(t * 0.18) * 0.004;
      const nowMs = performance.now();
      const seqDt = Math.min(1.0, Math.max(0, (nowMs - seqTick) / 1000));
      seqTick = nowMs;
      if (playing) {
        stageTime += seqDt;
        if (stageTime > durations[step]) {
          if (step < 2) applyStep(step + 1, false);
          else { playing = false; STATE.sequencePlaying = false; }
        }
      }
    }
  };
};
