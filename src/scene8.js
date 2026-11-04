/* ============================================================
   CAPÍTULO 8 · CONSECUENCIAS
   Puesto de control, aldea abandonada, Bosque Rojo y fauna.
   ============================================================ */

SCENE_BUILDERS[8] = function buildChapter8() {
  const world = makeWorld('cap8-zona');
  addSky(world, {
    top: 0x1a2930, horizon: 0xb08f66, bottom: 0x080c0c,
    stars: 70, sun: { position: [-160, 28, -80], color: 0xffc18a, size: 46, opacity: 0.18 }
  });
  addFog(world, 0x4a4b41, 0.009);
  addLighting(world, {
    sky: 0x8c9c99, ground: 0x29271e, hemi: 0.53,
    sun: 0xd7bf9c, intensity: 1.4, position: [-60, 35, 50],
    shadowSizeWorld: 70, shadowSize: 2048, ambient: 0.07
  });
  addGround(world, { size: 300, texture: 'grass', repeat: 30, color: 0x777c65 });
  addGround(world, { size: 110, texture: 'dead', repeat: 18, color: 0x807764, y: 0.015 });
  const rng = mulberry32(2040);

  const road = addBox(world.root, 8.5, 0.09, 120, 0, 0.06, -7, std(0x4f5048, { roughness: 0.98 }), { cast: false });
  road.receiveShadow = true;
  for (let i = 0; i < 7; i++) {
    addBox(world.root, 0.18, 0.012, 4.5, 0, 0.12, -48 + i * 15, std(0xb2a991, { roughness: 0.8 }), { cast: false });
  }
  // Grietas y maleza en el asfalto.
  for (let i = 0; i < 26; i++) {
    addBox(world.root, rr(rng, 0.5, 2.8), 0.02, 0.08, rr(rng, -4, 4), 0.13, rr(rng, -60, 40), std(0x252820, { roughness: 1 }), { rotY: rr(rng, -0.4, 0.4), cast: false });
  }

  const concrete = std(0x858176, { roughness: 0.95 });
  const concreteDark = std(0x56574f, { roughness: 0.98 });
  const metal = std(0x57605b, { roughness: 0.55, metalness: 0.45 });
  const rust = std(0x70513b, { roughness: 0.9 });
  const dark = std(0x242824, { roughness: 0.95 });
  const fadedRed = std(0x8f4a35, { roughness: 0.9 });
  const fadedWhite = std(0xbbb39f, { roughness: 0.9 });

  // Puesto de control.
  const checkpoint = new THREE.Group();
  checkpoint.position.set(0, 0, 2);
  world.root.add(checkpoint);
  addBox(checkpoint, 26, 0.25, 14, 0, 0.14, 0, std(0x6e6a5d, { roughness: 1 }), { cast: false });
  // Garita.
  addBox(checkpoint, 5.5, 4.2, 5, -8.5, 2.1, 2.8, concreteDark, { cast: true });
  addBox(checkpoint, 6, 0.35, 5.4, -8.5, 4.35, 2.8, dark, { cast: true });
  addBox(checkpoint, 3.4, 1.6, 0.15, -8.5, 2.8, 5.32, glassMat(0x172226, 0.5), { cast: false });
  addBox(checkpoint, 3.4, 0.3, 0.2, -8.5, 3.6, 5.33, metal, { cast: false });
  addBox(checkpoint, 1.2, 2.2, 0.2, -6.4, 1.1, 5.35, dark, { cast: false });
  // Barrera y bloques.
  addBox(checkpoint, 0.35, 1.1, 0.35, -2.8, 0.65, 5.2, metal, { cast: false });
  const barrier = new THREE.Group();
  barrier.position.set(-4.8, 1.2, 5.2);
  addBox(barrier, 9.2, 0.24, 0.18, 4.4, 0, 0, fadedRed, { cast: false });
  for (let i = 0; i < 5; i++) addBox(barrier, 0.95, 0.26, 0.19, 0.7 + i * 1.65, 0.01, 0, fadedWhite, { cast: false });
  barrier.rotation.z = 1.1;
  checkpoint.add(barrier);
  // Bloques de hormigón.
  for (let i = 0; i < 3; i++) {
    addBox(checkpoint, 2.8, 2.4, 2.8, 5 + i * 4.2, 1.2, 4.2, concrete, { cast: true });
    addBox(checkpoint, 2.9, 0.3, 2.9, 5 + i * 4.2, 2.45, 4.2, concreteDark, { cast: false });
  }
  // Cartel de la zona.
  const signGroup = new THREE.Group();
  signGroup.position.set(8.6, 0, 6.2);
  signGroup.rotation.y = -0.12;
  checkpoint.add(signGroup);
  addBox(signGroup, 0.35, 5.2, 0.35, -4, 2.6, 0, metal, { cast: true });
  addBox(signGroup, 0.35, 5.2, 0.35, 4, 2.6, 0, metal, { cast: true });
  addBox(signGroup, 9, 4.8, 0.25, 0, 3.1, 0, std(0x3b3f38), { cast: true });
  addSign(signGroup, ['ЗОНА ВІДЧУЖЕННЯ', 'CHÓRNOBYL · 30 km'], 8.5, 4.2, 0, 3.1, 0.16, {
    bg: '#30352f', color: '#d6cbb2', font: '600 58px "Segoe UI", Arial',
    texWidth: 1400, texHeight: 500, transparent: false
  });
  // Trefoil de advertencia 3D.
  const trefoil = makeTrefoilSign();
  trefoil.position.set(-2.2, 2.9, 7.9); trefoil.scale.setScalar(1.25);
  checkpoint.add(trefoil);
  const signLight = new THREE.PointLight(0xe0c485, 1.2, 15, 2);
  signLight.position.set(3, 5.5, 9.5); checkpoint.add(signLight);

  // Torre de vigilancia.
  const tower = new THREE.Group();
  tower.position.set(11, 0, -4);
  world.root.add(tower);
  for (let i = 0; i < 4; i++) {
    const x = i < 2 ? -1.5 : 1.5, z = i % 2 ? -1.5 : 1.5;
    addCylinder(tower, 0.1, 0.18, 10, x, 5, z, metal, { segments: 5 });
  }
  addBox(tower, 4, 2.8, 4, 0, 10.4, 0, std(0x4f5955, { roughness: 0.8 }), { cast: true });
  addBox(tower, 4.4, 0.2, 4.4, 0, 11.9, 0, dark, { cast: true });
  addBox(tower, 3.2, 1.0, 0.12, 0, 10.9, 2.06, glassMat(0x192427, 0.4), { cast: false });
  addSign(tower, ['ЗОНА'], 3.2, 1.2, 0, 9.0, 2.12, {
    bg: '#2b302b', color: '#bdb399', font: '600 90px "Segoe UI", Arial', texWidth: 512, texHeight: 200
  });
  addLabel(world, { text: 'PUESTO DE CONTROL', sub: 'entrada a la zona de exclusión', position: [1, 8.6, 8] });
  addLabel(world, { text: 'TORRE DE VIGILANCIA', sub: 'control de acceso', position: [11, 14.5, -4] });

  // Alambre perimetral a ambos lados de la carretera.
  addFence(world, { length: 76, step: 4, x: -26, z: 0, rot: 0, color: 0x515b55 });
  addFence(world, { length: 76, step: 4, x: 26, z: 0, rot: 0, color: 0x515b55 });

  // Aldea abandonada a la derecha.
  const village = new THREE.Group();
  village.position.set(21, 0, -21);
  world.root.add(village);
  function house(x, z, w, d, h, ruin) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    village.add(g);
    addBox(g, w, h, d, 0, h / 2, 0, std(0x8c8069, { roughness: 1 }), { cast: true });
    // Tejado a dos aguas.
    if (!ruin) {
      const roofL = addBox(g, w / 2 + 0.6, 0.3, d + 1, -w / 4, h + 0.7, 0, std(0x4c4136, { roughness: 1 }), { cast: true });
      roofL.rotation.z = 0.36;
      const roofR = addBox(g, w / 2 + 0.6, 0.3, d + 1, w / 4, h + 0.7, 0, std(0x4c4136, { roughness: 1 }), { cast: true });
      roofR.rotation.z = -0.36;
    } else {
      const half = addBox(g, w * 0.55, 0.26, d + 0.8, -w * 0.2, h + 0.2, 0, std(0x3b332c, { roughness: 1 }), { cast: true });
      half.rotation.z = 0.5;
      addBox(g, w * 0.14, 0.2, d + 0.4, 0, h + 0.2, 0.7, std(0x342e27, { roughness: 1 }), { rotZ: -0.3, cast: false });
    }
    // Ventanas y puerta.
    addBox(g, 1.15, 1.1, 0.12, -w * 0.25, h * 0.55, d / 2 + 0.07, basic(0x101615), { cast: false, receive: false });
    addBox(g, 1.15, 1.1, 0.12, w * 0.25, h * 0.55, d / 2 + 0.07, basic(0x101615), { cast: false, receive: false });
    addBox(g, 1.0, 2.0, 0.14, 0, 1.0, d / 2 + 0.07, basic(0x111411), { cast: false, receive: false });
    // Maleza.
    for (let i = 0; i < 7; i++) {
      const bush = new THREE.Mesh(new THREE.ConeGeometry(rr(rng, 0.3, 0.8), rr(rng, 0.6, 1.6), 5), std(0x34412e, { roughness: 1 }));
      bush.position.set(rr(rng, -w / 2, w / 2), 0.5, rr(rng, -d / 2, d / 2));
      g.add(bush);
    }
    return g;
  }
  house(-4, 0, 6.5, 5.5, 4.0, false);
  house(5, -4, 7.2, 6.0, 4.5, true);
  house(-2, 9, 5.4, 4.8, 3.6, true);
  house(8, 8, 5, 4, 3.5, false);
  // Coche abandonado.
  const car = makeCar(0.9, 0x525b55);
  car.position.set(2, 0.1, 2); car.rotation.y = 2.1; village.add(car);
  addLabel(world, { text: 'ALDEA ABANDONADA', sub: 'casas, objetos y memoria', position: [21, 8.4, -14] });

  // Bosque Rojo y árboles.
  addTrees(world, { count: 90, center: [-27, 0, -33], spreadX: 28, spreadZ: 35, scale: 1.15, seed: 19, trunkColor: 0x44352a, foliageColor: 0x293329 });
  addTrees(world, { count: 34, center: [31, 0, -46], spreadX: 23, spreadZ: 24, scale: 0.9, seed: 31 });
  const dead = new THREE.Group();
  world.root.add(dead);
  const deadMat = std(0x5a4f40, { roughness: 1 });
  for (let i = 0; i < 22; i++) {
    const x = rr(rng, -44, -9), z = rr(rng, -50, -18);
    const h = rr(rng, 4, 9);
    addCylinder(dead, rr(rng, 0.06, 0.13), rr(rng, 0.12, 0.23), h, x, h / 2, z, deadMat, { segments: 5, cast: true });
    for (let b = 0; b < 3; b++) {
      const branch = addCylinder(dead, 0.025, 0.04, rr(rng, 1.2, 2.6), x, h * rr(rng, 0.55, 0.9), z, deadMat, { segments: 4, cast: false });
      branch.rotation.z = rr(rng, -1.2, 1.2);
      branch.rotation.y = rr(rng, 0, TAU);
    }
  }
  addLabel(world, { text: 'BOSQUE ROJO', sub: 'pinos muertos por la radiación', position: [-28, 13, -32] });

  // Radar Duga, silueta lejana.
  const duga = new THREE.Group();
  duga.position.set(-55, 0, -48);
  world.root.add(duga);
  const lattice = std(0x3c4543, { roughness: 0.7, metalness: 0.4 });
  for (let i = 0; i < 4; i++) {
    addBox(duga, 0.6, 18, 0.6, -10 + i * 7, 9, 0, lattice, { cast: false });
    addBox(duga, 0.4, 15, 0.4, -7 + i * 7, 10, -1.5, lattice, { cast: false });
  }
  for (let i = 0; i < 5; i++) addBox(duga, 28, 0.4, 0.8, 0, 5 + i * 3.2, 0, lattice, { cast: false });
  for (let i = 0; i < 20; i++) addBox(duga, 0.25, 3.1, 0.3, -13 + i * 1.4, 5, 0.7, lattice, { cast: false });
  // Silueta del NSC en el horizonte.
  const farPlant = new THREE.Group();
  farPlant.position.set(15, 0, -92);
  world.root.add(farPlant);
  const silhouette = basic(0x101718);
  addBox(farPlant, 60, 18, 13, 0, 9, 0, silhouette, { cast: false, receive: false });
  addBox(farPlant, 38, 7, 22, 8, 10, 0, silhouette, { cast: false, receive: false });
  addBox(farPlant, 4, 35, 4, -18, 17.5, 0, silhouette, { cast: false, receive: false });

  // Fauna: tres ciervos.
  const deerGroup = new THREE.Group();
  world.root.add(deerGroup);
  const deerMat = std(0x6d5641, { roughness: 1 });
  const deerDark = std(0x3d3024, { roughness: 1 });
  const deerLegs = [];
  function makeDeer(x, z, ry, scale = 1) {
    const g = new THREE.Group();
    g.position.set(x, 0, z); g.rotation.y = ry;
    addBox(g, 1.7, 0.85, 0.65, 0, 1.15, 0, deerMat, { cast: true });
    addBox(g, 0.58, 0.8, 0.5, 0.7, 1.55, 0, deerMat, { rotZ: -0.2, cast: true });
    addBox(g, 0.55, 0.45, 0.45, 1.0, 1.95, 0, deerMat, { cast: true });
    addBox(g, 0.22, 0.18, 0.52, 1.1, 1.72, 0, deerDark, { cast: false });
    for (let i = 0; i < 2; i++) {
      addCylinder(g, 0.04, 0.05, 0.7, 1.0, 2.18 + i * 0.1, -0.15 + i * 0.3, deerDark, { rotZ: -0.2, segments: 4, cast: false });
    }
    const legs = [];
    [[-0.6, -0.22], [-0.6, 0.22], [0.6, -0.22], [0.6, 0.22]].forEach(([lx, lz]) => {
      const leg = addCylinder(g, 0.05, 0.06, 0.85, lx, 0.43, lz, deerDark, { segments: 5, cast: false });
      legs.push(leg);
    });
    g.scale.setScalar(scale);
    deerGroup.add(g);
    deerLegs.push({ g, legs, phase: rr(rng, 0, TAU), baseX: x, baseZ: z });
    return g;
  }
  makeDeer(-10, -8, 1.2, 1.1);
  makeDeer(-5, -12, 2.4, 0.9);
  makeDeer(5, -17, 0.5, 0.85);

  // Estación de monitoreo y trefoil.
  const monitor = new THREE.Group();
  monitor.position.set(-8.5, 0, 10);
  world.root.add(monitor);
  addCylinder(monitor, 0.06, 0.08, 2.4, 0, 1.2, 0, metal, { segments: 5 });
  addBox(monitor, 1.2, 0.8, 0.5, 0, 2.5, 0, std(0x4c554e), { cast: true });
  addBox(monitor, 0.8, 0.4, 0.06, 0, 2.55, 0.28, basic(0xb59e58), { cast: false, receive: false });
  addBox(monitor, 0.06, 0.35, 0.06, -0.4, 2.0, 0, metal, { cast: false });
  addBox(monitor, 0.06, 0.35, 0.06, 0.4, 2.0, 0, metal, { cast: false });
  addLabel(world, { text: 'MONITOREO', sub: 'la radiación se mide, no se ve', position: [-8.5, 4.2, 10] });

  addDust(world, { count: 80, center: [0, 3, 0], spread: [28, 3, 26], sizeMin: 0.02, sizeMax: 0.12, color: 0xd2c19f, seed: 71 });
  addLabel(world, { text: 'RADAR DUGA-1', sub: 'infraestructura soviética en la zona', position: [-55, 22, -48] });
  addLabel(world, { text: 'NUEVO CONFINAMIENTO', sub: 'silueta al horizonte', position: [20, 27, -91] });

  const views = {
    checkpoint: { position: [25, 10, 36], target: [1, 4.5, 1], fov: 46 },
    forest: { position: [23, 11, 17], target: [-17, 6, -23], fov: 43 },
    village: { position: [-4, 8, 12], target: [23, 5, -17], fov: 45 }
  };
  function setView(id) {
    const v = views[id] || views.checkpoint;
    flyCamera(new THREE.Vector3(...v.position), new THREE.Vector3(...v.target), v.fov, 1.25);
  }
  function resetView() { setView('checkpoint'); }

  return {
    root: world.root,
    labels: world.labels,
    pickables: [],
    camera: { position: views.checkpoint.position, target: views.checkpoint.target, fov: 46, minDistance: 8, maxDistance: 110, minPolarAngle: 0.18, maxPolarAngle: Math.PI * 0.49 },
    defaultView: 'checkpoint',
    exposure: 1.06,
    setView,
    resetView,
    setStep() {},
    playSequence() {},
    update(dt, t) {
      world.updaters.forEach((fn) => fn(dt, t));
      deerLegs.forEach((d, i) => {
        const walk = Math.sin(t * 1.2 + d.phase) * 0.4;
        d.g.position.x = d.baseX + Math.sin(t * 0.09 + d.phase) * 2.0;
        d.g.position.z = d.baseZ + Math.cos(t * 0.075 + d.phase) * 1.2;
        d.legs.forEach((leg, li) => {
          leg.rotation.x = Math.sin(t * 2.4 + li * Math.PI / 2 + d.phase) * 0.22;
        });
      });
    }
  };
};

function makeTrefoilSign() {
  // Pictograma de radiación dibujado a mano sobre lienzo.
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#d7a247'; ctx.beginPath(); ctx.arc(256, 256, 245, 0, TAU); ctx.fill();
  ctx.fillStyle = '#181b19';
  const cx = 256, cy = 256, R = 190, r = 72;
  for (let i = 0; i < 3; i++) {
    const a = -Math.PI / 2 + i * TAU / 3;
    ctx.beginPath();
    ctx.arc(cx, cy, R, a - 0.48, a + 0.48);
    ctx.arc(cx, cy, r, a + 0.75, a - 0.75, true);
    ctx.closePath();
    ctx.fill();
  }
  ctx.beginPath(); ctx.arc(cx, cy, 44, 0, TAU); ctx.fill();
  const finalTex = new THREE.CanvasTexture(canvas);
  finalTex.colorSpace = THREE.SRGBColorSpace;
  trackTexture(finalTex);
  const mat = new THREE.MeshBasicMaterial({ map: finalTex, transparent: true, side: THREE.DoubleSide, toneMapped: false });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 2.1), mat);
  return mesh;
}
