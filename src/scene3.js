/* ============================================================
   CAPÍTULO 3 · LA EXPLOSIÓN DEL REACTOR 4
   Edificio en corte, núcleo RBMK, explosión de vapor,
   segunda explosión, incendio y liberación de partículas.
   ============================================================ */

SCENE_BUILDERS[3] = function buildChapter3() {
  const world = makeWorld('cap3-explosion');
  addSky(world, {
    top: 0x060b10, horizon: 0x393329, bottom: 0x030404,
    stars: 380, sun: { position: [-120, 22, -210], color: 0x9b927c, size: 35, opacity: 0.16 }
  });
  addFog(world, 0x101314, 0.0058);
  addLighting(world, {
    sky: 0x6f8592, ground: 0x1a1510, hemi: 0.76,
    sun: 0xb5c3c8, intensity: 1.35, position: [-70, 80, -40],
    shadowSizeWorld: 110, shadowSize: 2048, ambient: 0.18
  });
  const frontFill = new THREE.PointLight(0x9fb3bf, 1.1, 65, 2);
  frontFill.position.set(26, 25, 38); world.root.add(frontFill);
  const fireBounce = new THREE.PointLight(0xff9a50, 0.8, 55, 2);
  fireBounce.position.set(0, 9, 22); world.root.add(fireBounce);
  addGround(world, { size: 300, texture: 'concrete', repeat: 26, color: 0x7d7c73 });
  // Plataforma de lectura y escombros.
  addGround(world, { size: 90, texture: 'asphalt', repeat: 14, color: 0x6b6a61, y: 0.02 }).position.set(0, 0.02, 0);

  const rng = mulberry32(26041986);
  const concrete = std(0x8a8779, { roughness: 0.93 });
  const concreteDark = std(0x565750, { roughness: 0.95 });
  const graphite = std(0x1e2321, { roughness: 1 });
  const metal = std(0x606967, { roughness: 0.4, metalness: 0.55 });
  const darkMetal = std(0x282d2b, { roughness: 0.56, metalness: 0.5 });
  const rust = std(0x6b4b37, { roughness: 0.9, metalness: 0.2 });
  const glass = glassMat(0x1c2c31, 0.5);

  const shell = new THREE.Group();
  world.root.add(shell);
  const ruin = new THREE.Group();
  ruin.visible = false;
  world.root.add(ruin);

  // Losa de cimentación.
  addBox(shell, 50, 2.2, 44, 0, 1.1, 0, concreteDark, { cast: true });
  addBox(ruin, 50, 2.2, 44, 0, 1.1, 0, concreteDark, { cast: true });

  // Muros trasero y laterales.
  const sideWalls = [];
  sideWalls.push(addBox(shell, 46, 31, 1.0, 0, 17.7, -19.5, concrete, { cast: true }));
  sideWalls.push(addBox(shell, 1.0, 31, 38, -23, 17.7, 0, concrete, { cast: true }));
  sideWalls.push(addBox(shell, 1.0, 31, 38, 23, 17.7, 0, concrete, { cast: true }));
  // Costillas de la fachada lateral.
  for (let i = 0; i < 7; i++) {
    addBox(shell, 0.5, 27, 0.8, -22.6, 16, -15 + i * 5, concreteDark, { cast: false });
    addBox(shell, 0.5, 27, 0.8, 22.6, 16, -15 + i * 5, concreteDark, { cast: false });
  }

  // Fachada frontal desmontable para el corte.
  const frontWall = new THREE.Group();
  shell.add(frontWall);
  addBox(frontWall, 46, 30, 1.2, 0, 16, 19.3, concrete, { cast: true });
  for (let i = 0; i < 8; i++) addBox(frontWall, 0.7, 25, 0.6, -20 + i * 5.7, 15.5, 19.95, concreteDark, { cast: false });
  addBox(frontWall, 15, 3.2, 0.5, 0, 25.5, 19.98, basic(0x283a3d), { cast: false, receive: false });
  addSign(frontWall, ['4'], 4.6, 3.8, 0, 27.6, 20.27, {
    bg: '#5d1d18', color: '#e5d8c6', font: '700 280px "Arial"', texWidth: 512, texHeight: 512
  });
  addBox(frontWall, 6.8, 4.8, 0.5, 13, 3.2, 19.98, darkMetal, { cast: false });
  addBox(frontWall, 4.2, 0.3, 1.2, -4, 5.8, 20.3, metal, { cast: false });

  // Cubierta desmontable.
  const roof = new THREE.Group();
  shell.add(roof);
  addBox(roof, 48, 1.4, 40.5, 0, 33, 0, std(0x4c5150, { roughness: 0.7, metalness: 0.28 }), { cast: true });
  for (let i = 0; i < 7; i++) {
    addBox(roof, 6.1, 1.1, 2.1, -18 + i * 6, 34.4, -10 + (i % 2) * 6, metal, { cast: true });
    addBox(roof, 5.8, 0.35, 1.8, -18 + i * 6, 35.1, -10 + (i % 2) * 6, darkMetal, { cast: false });
  }
  // Vigas y conductos.
  for (let i = 0; i < 5; i++) {
    addBox(roof, 47, 0.5, 0.7, 0, 33.8, -17 + i * 8.5, metal, { cast: false });
  }
  addCylinder(roof, 1.4, 1.7, 12, 15, 38.5, -8, rust, { segments: 12, cast: true });
  addCylinder(roof, 0.9, 1.1, 8, 19, 36.5, 8, metal, { segments: 10, cast: true });

  // Núcleo, visible cuando se retira la fachada.
  const reactor = new THREE.Group();
  world.root.add(reactor);
  addCylinder(reactor, 10.3, 10.8, 1.7, 0, 2.9, 0, darkMetal, { segments: 32, cast: true });
  addCylinder(reactor, 10.0, 10.0, 1.1, 0, 4.0, 0, graphite, { segments: 32, cast: true });
  // Bloque de grafito y canales verticales.
  addCylinder(reactor, 8.5, 8.5, 15.5, 0, 12.3, 0, graphite, { segments: 32, cast: true });
  addCylinder(reactor, 8.65, 8.65, 0.25, 0, 5.2, 0, metal, { segments: 32, cast: false });
  addCylinder(reactor, 8.65, 8.65, 0.25, 0, 19.5, 0, metal, { segments: 32, cast: false });
  const channels = [];
  const channelMat = emissive(0xbf562d, 0.25);
  for (let i = 0; i < 42; i++) {
    const a = i / 42 * TAU;
    const r = i % 3 === 0 ? 3.0 : i % 3 === 1 ? 5.3 : 7.2;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    const h = 15.8;
    const c = addCylinder(reactor, 0.14, 0.14, h, x, 12.2, z, channelMat, { segments: 6, cast: false });
    channels.push(c);
  }
  // Canales con combustible visible en el corte frontal.
  for (let i = 0; i < 15; i++) {
    const x = -6.4 + (i % 5) * 3.2;
    const z = 7.9;
    addCylinder(reactor, 0.18, 0.18, 15.8, x, 12.2, z, std(0x3b3a33, { roughness: 0.6, metalness: 0.3 }), { segments: 6, cast: false });
    const fuel = addCylinder(reactor, 0.1, 0.1, 12, x, 11.6, z + 0.14, emissive(0xd87931, 0.4), { segments: 5, cast: false });
    fuel.userData.fuel = true;
  }
  // Estructura superior del núcleo: losa Elena y tapa.
  const cover = new THREE.Group();
  cover.position.y = 0;
  reactor.add(cover);
  addCylinder(cover, 11.2, 11.6, 1.8, 0, 21.6, 0, std(0x5d625c, { roughness: 0.8, metalness: 0.2 }), { segments: 32, cast: true });
  addCylinder(cover, 10.4, 10.4, 0.6, 0, 22.8, 0, metal, { segments: 32, cast: true });
  const boltGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.5, 6);
  const bolts = new THREE.InstancedMesh(boltGeo, metal, 46);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 46; i++) {
    const a = i / 46 * TAU;
    dummy.position.set(Math.cos(a) * 10.4, 23.1, Math.sin(a) * 10.4);
    dummy.updateMatrix(); bolts.setMatrixAt(i, dummy.matrix);
  }
  bolts.instanceMatrix.needsUpdate = true;
  cover.add(bolts);
  // Vigas superiores y rods.
  for (let i = 0; i < 6; i++) {
    addBox(cover, 0.4, 1.2, 21, -9 + i * 3.6, 23.6, 0, darkMetal, { cast: false });
  }
  const rodGroup = new THREE.Group();
  rodGroup.position.y = 0;
  reactor.add(rodGroup);
  const controlRods = [];
  const rodMat = std(0x8b9287, { metalness: 0.5, roughness: 0.32 });
  for (let i = 0; i < 18; i++) {
    const a = i / 18 * TAU;
    const x = Math.cos(a) * (i % 2 ? 4.5 : 7.3);
    const z = Math.sin(a) * (i % 2 ? 4.5 : 7.3);
    const rod = addCylinder(rodGroup, 0.1, 0.1, 8.5, x, 27.7, z, rodMat, { segments: 5, cast: false });
    controlRods.push(rod);
    addCylinder(rodGroup, 0.2, 0.2, 0.5, x, 31.9, z, emissive(0xa98b4d, 0.45), { segments: 8, cast: false });
  }
  // Separadores de vapor y bombas.
  for (let i = 0; i < 4; i++) {
    addCylinder(reactor, 1.6, 1.6, 9.5, -10 + i * 6.5, 18.5, -9, metal, { rotZ: Math.PI / 2, segments: 14, cast: true });
    addCylinder(reactor, 1.2, 1.2, 4.2, -8 + i * 5.8, 8.5, 10, darkMetal, { rotZ: Math.PI / 2, segments: 12, cast: true });
  }
  for (let i = 0; i < 8; i++) {
    addCylinder(reactor, 0.24, 0.24, 9, -14 + i * 4, 17.9, -5, metal, { segments: 7, cast: false });
  }

  // Sala de turbinas del bloque 4, delante.
  const turbine = new THREE.Group();
  turbine.position.set(0, 0, 32);
  world.root.add(turbine);
  addBox(turbine, 54, 14, 20, 0, 7, 0, std(0x77776c, { roughness: 0.9 }), { cast: true });
  addBox(turbine, 55, 1.0, 21, 0, 14.5, 0, darkMetal, { cast: true });
  for (let i = 0; i < 4; i++) {
    addCylinder(turbine, 1.8, 1.8, 9, -15 + i * 10, 7.4, 0, metal, { rotZ: Math.PI / 2, segments: 14, cast: true });
    addBox(turbine, 5.7, 2.7, 4, -15 + i * 10, 4.5, 0, darkMetal, { cast: true });
  }
  addBox(turbine, 51, 0.5, 18, 0, 14.2, 0, metal, { cast: false });
  addSign(turbine, ['МАШИННЫЙ ЗАЛ'], 22, 3.2, 0, 10.8, 10.15, {
    bg: '#3a3d39', color: '#c9c3b4', font: '600 60px "Segoe UI", Arial', texWidth: 1200, texHeight: 200
  });

  // Estructuras anexas y torre de ventilación.
  const annex = new THREE.Group();
  annex.position.set(-34, 0, -2);
  world.root.add(annex);
  addBox(annex, 17, 21, 28, 0, 10.5, 0, concreteDark, { cast: true });
  addBox(annex, 18, 1, 29, 0, 21.5, 0, darkMetal, { cast: false });
  for (let i = 0; i < 4; i++) addBox(annex, 0.5, 16, 0.5, -7, 10, -10 + i * 6, concrete, { cast: false });
  const stack = new THREE.Group();
  stack.position.set(38, 0, -10);
  world.root.add(stack);
  addCylinder(stack, 1.8, 2.7, 58, 0, 29, 0, concrete, { segments: 14 });
  for (let i = 0; i < 8; i++) {
    const band = new THREE.Mesh(new THREE.CylinderGeometry(2.2 - i * 0.08, 2.5 - i * 0.08, 2.0, 14), std(i % 2 ? 0x9c3a2c : 0xbeb9a9, { roughness: 0.7 }));
    band.position.y = 8 + i * 6.35; stack.add(band);
  }
  addSphere(stack, 0.3, 0, 58.5, 0, emissive(0xcd3828, 2.4), { cast: false });

  // Ruina: muros quebrados, forjados y escombros.
  const brokenMat = std(0x767368, { roughness: 1 });
  [
    [-20, 10, -19.5, 7, 20, 1.5, 0],
    [17, 8, -19.5, 12, 16, 1.6, -0.06],
    [-23, 13, -7, 1.4, 25, 12, 0.05],
    [23, 8, 6, 1.6, 16, 15, -0.1],
    [19, 3.5, 12, 8, 6.5, 6, -0.2]
  ].forEach(([x, y, z, w, h, d, rz]) => {
    addBox(ruin, w, h, d, x, y, z, brokenMat, { rotZ: rz, cast: true });
  });
  const ruinFront = addBox(ruin, 29, 8, 1.2, 0, 4, 19, brokenMat, { rotZ: 0.03, cast: true });
  // Gran pared superviviente, silueta de la explosión.
  addBox(ruin, 8.5, 27, 2.2, -16.5, 13.5, -17.5, brokenMat, { rotZ: 0.04, cast: true });
  for (let i = 0; i < 8; i++) {
    addBox(ruin, rr(rng, 1.2, 3.2), rr(rng, 1.5, 5.5), 2.4, -20 + i * 1.4, 27 + rr(rng, -1, 3), -17.5, brokenMat, { rotZ: rr(rng, -0.2, 0.2), cast: true });
  }
  // Varillas y vigas retorcidas.
  for (let i = 0; i < 12; i++) {
    const bar = addCylinder(ruin, 0.035, 0.035, rr(rng, 2, 7), rr(rng, -20, 20), rr(rng, 4, 22), rr(rng, -16, 18), metal, { segments: 4, cast: false });
    bar.rotation.z = rr(rng, -0.9, 0.9); bar.rotation.x = rr(rng, -0.4, 0.4);
  }
  // Forjados caídos.
  for (let i = 0; i < 8; i++) {
    addBox(ruin, rr(rng, 5, 13), 0.5, rr(rng, 3, 8), rr(rng, -16, 16), rr(rng, 3, 10), rr(rng, -10, 18), std(0x464740, { roughness: 1 }), { rotZ: rr(rng, -0.35, 0.35), rotY: rr(rng, 0, TAU), cast: true });
  }
  addRubble({ root: ruin }, { count: 95, center: [0, 0, 10], spread: 27, color: 0x5a5a51, seed: 808 });

  // Iluminación de emergencia y fuego.
  const emergency = new THREE.PointLight(0xd05a3c, 1.4, 45, 2);
  emergency.position.set(0, 14, 12); world.root.add(emergency);
  const coreLight = new THREE.PointLight(0xff8c40, 0, 48, 2);
  coreLight.position.set(0, 17, 9); world.root.add(coreLight);
  const fireLight = new THREE.PointLight(0xff6a2a, 0, 55, 2);
  fireLight.position.set(0, 11, 28); world.root.add(fireLight);
  const wallGlowLight = new THREE.PointLight(0xffb06a, 0, 38, 2);
  wallGlowLight.position.set(0, 17, 17); world.root.add(wallGlowLight);
  const fire = addFire(world, { origin: [0, 13, 3], count: 130, spread: [7, 4, 5], sizeMin: 1.0, sizeMax: 5.0, seed: 13 });
  const roofFire = addFire(world, { origin: [0, 7.4, 31], count: 75, spread: [16, 2, 8], sizeMin: 0.6, sizeMax: 2.8, seed: 41 });
  const smoke = addSmokePlume(world, { origin: [0, 25, 5], count: 145, spread: [8, 6, 8], sizeMin: 6, sizeMax: 22, alphaMax: 0.38, color: 0xa59d8e, life: 18, seed: 21 });
  const roofSmoke = addSmokePlume(world, { origin: [0, 11, 30], count: 65, spread: [13, 2, 7], sizeMin: 3, sizeMax: 12, alphaMax: 0.22, color: 0x8e887b, life: 14, seed: 44 });
  const coreGlow = addGlow(world, [0, 16, 8], 0xff8b3a, 12, 0.2);
  coreGlow.visible = false;
  const wallGlow = addGlow(world, [-1, 13, 16], 0xff6c2c, 9, 0.14);
  wallGlow.visible = false;
  const coreSpot = new THREE.SpotLight(0xffd4a5, 4.5, 70, 0.46, 0.6, 1.2);
  coreSpot.position.set(-6, 38, 24);
  coreSpot.target.position.set(0, 12, 0);
  world.root.add(coreSpot.target); world.root.add(coreSpot);
  fire.points.visible = false;
  roofFire.points.visible = false;
  smoke.points.visible = false;
  roofSmoke.points.visible = false;

  // Destello y onda de choque.
  const flash = addGlow(world, [0, 18, 0], 0xffd9a0, 50, 0);
  flash.visible = false;
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.8, 1.0, 64), new THREE.MeshBasicMaterial({
    color: 0xffc27a, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending
  }));
  ring.rotation.x = -Math.PI / 2; ring.position.y = 4.5; world.root.add(ring);
  let ringT = 0;
  const flashLight = new THREE.PointLight(0xffd7a0, 0, 80, 2);
  flashLight.position.set(0, 19, 5); world.root.add(flashLight);

  // Partículas de escape y chispas.
  const sparks = createParticleField(world, {
    count: 120, center: [0, 14, 4], spread: [8, 7, 8], sizeMin: 0.1, sizeMax: 0.6,
    alphaMin: 0.1, alphaMax: 0.8, color: 0xffb35b, colorVary: 0.08, texture: 'fire',
    additive: true, seed: 76
  });
  sparks.points.visible = false;
  const sparkV = [];
  for (let i = 0; i < 120; i++) sparkV.push({ x: rr(rng, -2.2, 2.2), y: rr(rng, 2, 9), z: rr(rng, -2.2, 2.2) });

  // Escombros animados.
  const debris = [];
  const debrisGeo = new THREE.BoxGeometry(1, 1, 1);
  for (let i = 0; i < 46; i++) {
    const m = new THREE.Mesh(debrisGeo, std(i % 6 === 0 ? 0x8a4a2e : i % 3 === 0 ? 0x484943 : 0x6b6658, { roughness: 0.95 }));
    m.scale.set(rr(rng, 0.3, 2.6), rr(rng, 0.2, 1.4), rr(rng, 0.3, 2.2));
    m.position.set(rr(rng, -6, 6), rr(rng, 17, 26), rr(rng, -6, 6));
    m.visible = false;
    m.castShadow = true;
    m.userData = { v: new THREE.Vector3(), rot: new THREE.Vector3(), settled: false };
    world.root.add(m);
    debris.push(m);
  }
  function launchDebris(power) {
    debris.forEach((m, i) => {
      m.visible = true;
      m.userData.settled = false;
      const a = rr(rng, 0, TAU);
      m.position.set(rr(rng, -4, 4), rr(rng, 16, 22), rr(rng, -4, 4));
      m.userData.v.set(Math.cos(a) * rr(rng, 4, 14) * power, rr(rng, 6, 20) * power, Math.sin(a) * rr(rng, 4, 14) * power);
      m.userData.rot.set(rr(rng, -4, 4), rr(rng, -4, 4), rr(rng, -4, 4));
    });
  }
  function settleDebris() {
    debris.forEach((m) => {
      m.visible = true;
      m.userData.settled = true;
      const a = rr(rng, 0, TAU);
      const r = rr(rng, 8, 26);
      m.position.set(Math.cos(a) * r, m.scale.y * 0.45 + 0.1, Math.sin(a) * r + 8);
      m.rotation.set(rr(rng, 0, TAU), rr(rng, 0, TAU), rr(rng, 0, TAU));
    });
  }
  function hideDebris() {
    debris.forEach((m) => { m.visible = false; m.userData.settled = false; });
  }

  // Fuego sobre el techo de turbinas y brasas en el entorno.
  addGlow(world, [0, 18, 0], 0xff7c2a, 18, 0.16);

  // Etiquetas.
  addLabel(world, { text: 'TAPA SUPERIOR', sub: '≈1.000 t · desplazada por la presión', position: [17, 27.4, 4], views: ['cut', 'core'] });
  addLabel(world, { text: 'NÚCLEO DE GRAFITO', sub: 'canales verticales y combustible', position: [0, 12.8, 8.1], views: ['cut', 'core'] });
  addLabel(world, { text: 'BARRAS DE CONTROL', sub: 'inserción de emergencia', position: [8.7, 30.4, 0], views: ['cut', 'core'] });
  addLabel(world, { text: 'SEPARADORES DE VAPOR', sub: 'cuatro lazos de refrigeración', position: [-11, 21.4, -9], views: ['cut', 'core'] });
  addLabel(world, { text: 'SALA DE TURBINAS', sub: 'incendio en la cubierta', position: [0, 17.5, 32], views: ['building'] });
  addLabel(world, { text: 'EDIFICIO DEL REACTOR', sub: 'sin contención integral', position: [-13.5, 35.4, 19], views: ['building'] });

  let step = 5;
  let playing = false;
  let stageTime = 0;
  let seqTick = performance.now();
  const stageDurations = [2.2, 1.4, 1.6, 2.2, 1.8, 2.6];
  let coverY = 0;
  let coverX = 0;
  let coverZ = 0;
  let coverRot = 0;
  let rodY = 0;
  let flashOpacity = 0;
  let flashTarget = 0;
  let shake = 0;
  let activeView = 'cut';
  const isRuined = () => step >= 3;

  function applyViewVisibility() {
    const cut = activeView === 'cut' || activeView === 'core';
    if (!isRuined()) {
      shell.visible = true;
      ruin.visible = false;
      frontWall.visible = !cut;
      roof.visible = !cut;
      turbine.visible = !cut;
      sideWalls.forEach((w) => { w.visible = true; });
      ruinFront.visible = true;
    } else if (cut) {
      shell.visible = true;
      ruin.visible = false;
      frontWall.visible = false;
      roof.visible = false;
      turbine.visible = false;
      sideWalls[0].visible = true;
      sideWalls[1].visible = true;
      sideWalls[2].visible = false;
      ruinFront.visible = false;
    } else {
      shell.visible = false;
      ruin.visible = true;
      frontWall.visible = false;
      roof.visible = false;
      turbine.visible = true;
      ruinFront.visible = true;
    }
  }

  function resetVisualState() {
    shell.visible = true;
    ruin.visible = false;
    frontWall.visible = true;
    roof.visible = true;
    cover.position.set(0, 0, 0);
    cover.rotation.set(0, 0, 0);
    coverY = 0; coverX = 0; coverZ = 0; coverRot = 0;
    rodY = 0; rodGroup.position.y = 0;
    fire.points.visible = false;
    roofFire.points.visible = false;
    smoke.points.visible = false;
    roofSmoke.points.visible = false;
    sparks.points.visible = false;
    coreGlow.visible = false;
    wallGlow.visible = false;
    ruinFront.visible = true;
    flash.visible = false; flashOpacity = 0; flashTarget = 0;
    ring.material.opacity = 0; ringT = 0; ring.scale.setScalar(1);
    hideDebris();
    coreLight.intensity = 0;
    fireLight.intensity = 0;
    wallGlowLight.intensity = 0;
    emergency.intensity = 0.8;
    channels.forEach((c) => c.material.emissiveIntensity = 0.18);
  }

  function triggerExplosion(second) {
    if (!second) {
      flash.visible = true; flashOpacity = 1; flashTarget = 0.9;
      flashLight.intensity = 9;
      ringT = 0.01;
      launchDebris(1.0);
      AUDIO.impact('explosion');
    } else {
      flash.visible = true; flashOpacity = 0.9;
      flashLight.intensity = 7;
      ringT = 0.01;
      launchDebris(0.72);
      AUDIO.impact('flash');
    }
    shake = second ? 0.35 : 0.7;
  }

  function applyStep(index, instant) {
    const previous = step;
    step = clamp(index, 0, 5);
    stageTime = 0;
    seqTick = performance.now();
    if (step < 3) {
      resetVisualState();
      rodY = step >= 1 ? (step >= 2 ? 1.0 : 0.35) : 0;
      coverY = 0; coverX = 0; coverZ = 0;
      emergency.intensity = step >= 4 ? 1.8 : 0.5;
      channels.forEach((c) => c.material.emissiveIntensity = 0.18 + step * 0.16);
    } else {
      fire.points.visible = true;
      roofFire.points.visible = step >= 4;
      smoke.points.visible = true;
      roofSmoke.points.visible = step >= 4;
      sparks.points.visible = true;
      coreGlow.visible = true;
      wallGlow.visible = true;
      coverX = 17;
      coverZ = 4;
      coverY = step >= 4 ? 6.5 : 4.5;
      coverRot = step >= 4 ? 0.62 : 0.38;
      if (instant) {
        cover.position.set(coverX, coverY, coverZ);
        cover.rotation.z = coverRot;
      }
      coreLight.intensity = step >= 4 ? 8.0 : 5.0;
      fireLight.intensity = step >= 4 ? 5.0 : 2.6;
      wallGlowLight.intensity = step >= 4 ? 3.2 : 1.5;
      coreSpot.intensity = 4.5;
      emergency.intensity = 1.4;
      channels.forEach((c) => c.material.emissiveIntensity = 0.42);
      if (instant) {
        settleDebris();
        flash.visible = false;
      } else if (previous < 3) {
        settleDebris();
      }
    }
    applyViewVisibility();
    if (!instant) {
      if (step === 3 && previous < 3) triggerExplosion(false);
      if (step === 4 && previous === 3) triggerExplosion(true);
    }
    if (!instant) updateSequenceUI(step);
  }

  function setStep(index, instant) {
    playing = false;
    applyStep(index, !!instant);
    if (instant) {
      rodGroup.position.y = rodY;
      cover.position.y = coverY;
      cover.rotation.z = coverRot;
    }
  }
  function playSequence() {
    // setStep() detiene la reproducción por diseño; por eso se reactiva después.
    setStep(0, true);
    playing = true;
    stageTime = 0;
    seqTick = performance.now();
    STATE.sequencePlaying = true;
    updateSequenceUI(0);
  }

  function setView(id) {
    activeView = id;
    applyViewVisibility();
    if (id === 'cut') {
      flyCamera(new THREE.Vector3(47, 36, 59), new THREE.Vector3(0, 11, 0), 42, 1.25);
    } else if (id === 'core') {
      flyCamera(new THREE.Vector3(31, 28, 34), new THREE.Vector3(0, 14, 0), 39, 1.2);
    } else {
      flyCamera(new THREE.Vector3(58, 34, 66), new THREE.Vector3(0, 15, 0), 43, 1.3);
    }
  }
  function resetView() { setView('building'); }

  // Vista inicial: corte de la ruina, sin destello.
  resetVisualState();
  fire.points.visible = true; roofFire.points.visible = true; smoke.points.visible = true; roofSmoke.points.visible = true; sparks.points.visible = true;
  coreGlow.visible = true; wallGlow.visible = true;
  coverX = 17; coverZ = 4;
  cover.position.set(17, 6.5, 4); cover.rotation.z = 0.62; coverY = 6.5; coverRot = 0.62;
  settleDebris();
  coreLight.intensity = 8.0; fireLight.intensity = 5.0; wallGlowLight.intensity = 3.2; coreSpot.intensity = 4.5; emergency.intensity = 1.4;
  channels.forEach((c) => c.material.emissiveIntensity = 0.42);
  applyViewVisibility();
  updateSequenceUI(5);

  return {
    root: world.root,
    labels: world.labels,
    pickables: [],
    camera: { position: [47, 36, 59], target: [0, 11, 0], fov: 42, minDistance: 9, maxDistance: 170, minPolarAngle: 0.15, maxPolarAngle: Math.PI * 0.49 },
    defaultView: 'cut',
    exposure: 1.22,
    setView,
    resetView,
    setStep,
    playSequence,
    update(dt, t) {
      world.updaters.forEach((fn) => fn(dt, t));
      // Movimiento de las barras y la tapa.
      rodGroup.position.y = lerp(rodGroup.position.y, rodY, 0.09);
      if (step >= 3) {
        cover.position.x = lerp(cover.position.x, coverX, 0.06);
        cover.position.y = lerp(cover.position.y, coverY, 0.06);
        cover.position.z = lerp(cover.position.z, coverZ, 0.06);
        cover.rotation.z = lerp(cover.rotation.z, coverRot, 0.06);
      }
      // Brasas.
      if (sparks.points.visible) {
        for (let i = 0; i < sparkV.length; i++) {
          sparks.positions[i * 3] += sparkV[i].x * dt;
          sparks.positions[i * 3 + 1] += sparkV[i].y * dt;
          sparks.positions[i * 3 + 2] += sparkV[i].z * dt;
          sparks.alphas[i] *= 0.995;
          if (sparks.positions[i * 3 + 1] > 40 || sparks.alphas[i] < 0.01) {
            sparks.positions[i * 3] = rr(rng, -5, 5);
            sparks.positions[i * 3 + 1] = rr(rng, 8, 18);
            sparks.positions[i * 3 + 2] = rr(rng, 0, 10);
            sparks.alphas[i] = rr(rng, 0.2, 0.9);
          }
        }
        sparks.update();
      }
      // Escombros.
      debris.forEach((m) => {
        if (!m.visible || m.userData.settled) return;
        const d = m.userData;
        d.v.y -= 22 * dt;
        m.position.addScaledVector(d.v, dt);
        m.rotation.x += d.rot.x * dt;
        m.rotation.y += d.rot.y * dt;
        m.rotation.z += d.rot.z * dt;
        if (m.position.y < m.scale.y * 0.4 + 0.2) {
          m.position.y = m.scale.y * 0.4 + 0.2;
          d.v.multiplyScalar(0.25);
          d.v.y = Math.abs(d.v.y) * 0.18;
          if (Math.abs(d.v.y) < 1.2) { d.settled = true; d.v.set(0, 0, 0); }
        }
      });
      // Fuego y humo.
      if (step >= 3) {
        fireLight.intensity = (step >= 4 ? 2.6 : 1.2) + Math.sin(t * 7.3) * 0.6 + Math.sin(t * 13.1) * 0.25;
        coreLight.intensity = (step >= 4 ? 4.4 : 2.2) + Math.sin(t * 4.1) * 0.6;
        emergency.intensity = 1.0 + Math.sin(t * 3.3) * 0.35;
      }
      // Flash y onda de choque.
      if (flash.visible) {
        flashOpacity = lerp(flashOpacity, flashTarget, 0.08);
        flash.material.opacity = flashOpacity;
        flash.scale.setScalar(lerp(flash.scale.x, 65, 0.16));
        flashTarget *= 0.9;
        flashLight.intensity *= 0.88;
        if (flashOpacity < 0.015) flash.visible = false;
      }
      if (ringT > 0) {
        ringT += dt;
        const p = ringT / 1.3;
        ring.scale.setScalar(1 + p * 28);
        ring.material.opacity = Math.max(0, 0.5 * (1 - p));
        if (p >= 1) { ringT = 0; ring.material.opacity = 0; }
      }
      if (shake > 0.001) {
        emergency.position.x = Math.sin(t * 45) * shake * 0.4;
        emergency.position.z = 12 + Math.cos(t * 39) * shake * 0.4;
        shake *= 0.94;
      }
      const nowMs = performance.now();
      const seqDt = Math.min(1.0, Math.max(0, (nowMs - seqTick) / 1000));
      seqTick = nowMs;
      if (playing) {
        stageTime += seqDt;
        if (stageTime > stageDurations[step]) {
          if (step < 5) applyStep(step + 1, false);
          else { playing = false; STATE.sequencePlaying = false; }
        }
      }
    }
  };
};
