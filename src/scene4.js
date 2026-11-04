/* ============================================================
   CAPÍTULO 4 · PRIMERAS HORAS
   Bomberos, camiones, mangueras y el bloque 4 en llamas.
   ============================================================ */

SCENE_BUILDERS[4] = function buildChapter4() {
  const world = makeWorld('cap4-bomberos');
  addSky(world, {
    top: 0x030507, horizon: 0x2f241b, bottom: 0x030404,
    stars: 220, sun: { position: [-150, 18, -110], color: 0x8f836e, size: 26, opacity: 0.08 }
  });
  addFog(world, 0x12110e, 0.0075);
  addLighting(world, {
    sky: 0x4b5d65, ground: 0x1b100c, hemi: 0.5,
    sun: 0xaebbc0, intensity: 0.9, position: [-55, 65, 20],
    shadowSizeWorld: 60, shadowSize: 2048, ambient: 0.1
  });
  const areaFill = new THREE.PointLight(0x9eb4c1, 1.8, 60, 2);
  areaFill.position.set(22, 18, 30); world.root.add(areaFill);
  const fireFill = new THREE.PointLight(0xff8a4a, 9.0, 75, 2);
  fireFill.position.set(0, 10, -17); world.root.add(fireFill);
  const crewRim = new THREE.SpotLight(0xffe1b0, 5.5, 52, 0.5, 0.55, 1.2);
  crewRim.position.set(22, 12, 30);
  crewRim.target.position.set(0, 2, 12);
  world.root.add(crewRim.target); world.root.add(crewRim);
  const coolKey = new THREE.SpotLight(0xbdd4df, 10, 55, 0.55, 0.6, 1.2);
  coolKey.position.set(-18, 14, 27);
  coolKey.target.position.set(0, 2, 11);
  world.root.add(coolKey.target); world.root.add(coolKey);
  const crewKey = new THREE.SpotLight(0xffd3a0, 4.6, 46, 0.58, 0.65, 1.2);
  crewKey.position.set(-13, 9, 20);
  crewKey.target.position.set(0, 2, 6);
  world.root.add(crewKey.target); world.root.add(crewKey);
  const crewWash = new THREE.PointLight(0xffd2a0, 4.5, 32, 2);
  crewWash.position.set(0, 3.8, 20); world.root.add(crewWash);
  // Torre de iluminación portátil.
  const lightTower = new THREE.Group();
  lightTower.position.set(30, 0, 10);
  world.root.add(lightTower);
  addBox(lightTower, 2.6, 0.35, 2.0, 0, 0.2, 0, std(0x252a28, { roughness: 0.6, metalness: 0.4 }), { cast: false });
  addCylinder(lightTower, 0.1, 0.15, 6.2, 0, 3.25, 0, std(0x565e5c, { roughness: 0.48, metalness: 0.5 }), { segments: 6 });
  addBox(lightTower, 3.1, 0.22, 0.4, 0, 6.2, 0, std(0x565e5c, { roughness: 0.48, metalness: 0.5 }), { cast: false });
  for (let i = 0; i < 2; i++) {
    addBox(lightTower, 0.7, 0.45, 0.25, -0.8 + i * 1.6, 6.4, 0.2, emissive(0xffe6bc, 3.2), { cast: false });
  }
  const towerLight = new THREE.SpotLight(0xffe3b6, 8, 50, 0.42, 0.7, 1.4);
  towerLight.position.set(0, 6.4, 0.2);
  towerLight.target.position.set(-16, 3, -20);
  lightTower.add(towerLight.target); lightTower.add(towerLight);
  addGround(world, { size: 190, texture: 'asphalt', repeat: 22, color: 0x6c6a60 });
  addGround(world, { size: 65, texture: 'concrete', repeat: 12, color: 0x817b6c, y: 0.02 });

  const concrete = std(0x817d70, { roughness: 0.96 });
  const charred = std(0x34322c, { roughness: 1 });
  const metal = std(0x565e5c, { roughness: 0.48, metalness: 0.5 });
  const darkMetal = std(0x252a28, { roughness: 0.6, metalness: 0.4 });
  const rng = mulberry32(2604);

  // Bloque 4 dañado al fondo.
  const building = new THREE.Group();
  building.position.set(0, 0, -32);
  world.root.add(building);
  addBox(building, 47, 24, 25, 0, 12, 0, concrete, { cast: true });
  addBox(building, 48, 2.1, 26, 0, 24.2, 0, charred, { cast: true });
  // Boca del edificio destruida: un hueco negro con estructura interior.
  addBox(building, 27, 17, 1.2, -4, 13.5, 12.55, charred, { cast: false });
  addBox(building, 16, 6, 1.0, 5, 20, 12.6, std(0x171716, { roughness: 1 }), { cast: false });
  // Bordes quebrados.
  for (let i = 0; i < 11; i++) {
    const x = -21 + i * 4.1;
    addBox(building, rr(rng, 1.2, 4.0), rr(rng, 1.2, 6.5), 1.5, x + rr(rng, -0.5, 0.5), 22 + rr(rng, -1, 4), 12.7, std(0x555046, { roughness: 1 }), { rotZ: rr(rng, -0.2, 0.2), cast: true });
  }
  // Ventanas superiores y costillas.
  for (let i = 0; i < 7; i++) {
    addBox(building, 0.8, 20, 0.7, -21 + i * 7, 11, 12.85, std(0x4e4d46, { roughness: 0.9 }), { cast: false });
  }
  for (let i = 0; i < 5; i++) {
    addBox(building, 5.5, 2.1, 0.5, -17 + i * 8.5, 20, 12.9, basic(0x151a18), { cast: false, receive: false });
  }
  addSign(building, ['4'], 5.2, 4.2, 15, 17.7, 12.95, {
    bg: '#5c1c16', color: '#e3d7c5', font: '700 280px "Arial"', texWidth: 512, texHeight: 512
  });
  // Estructura interior incandescente.
  addBox(building, 19, 12, 2.2, -4, 10, 8, std(0x38241a, { roughness: 1, emissive: 0x5a2110, emissiveIntensity: 0.8 }), { cast: false });
  addGlow(world, [0, 13, -19.5], 0xff6b2a, 7, 0.12);
  const buildingFire = addFire(world, {
    origin: [1, 11, -19.4], count: 230, spread: [15, 5, 2.0],
    sizeMin: 0.25, sizeMax: 1.15, seed: 57
  });
  const roofFire = addFire(world, {
    origin: [0, 24, -24], count: 85, spread: [18, 2, 2.0],
    sizeMin: 0.2, sizeMax: 0.9, seed: 29
  });
  // Llamas con textura procedural, en lugar de conos geométricos.
  const flameTexture = canvasTex(192, 320, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h * 0.68, 2, w / 2, h * 0.58, h * 0.52);
    g.addColorStop(0, 'rgba(255,255,235,1)');
    g.addColorStop(0.18, 'rgba(255,236,160,.98)');
    g.addColorStop(0.42, 'rgba(255,154,54,.82)');
    g.addColorStop(0.72, 'rgba(190,48,14,.35)');
    g.addColorStop(1, 'rgba(80,10,4,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(w * 0.5, h * 0.02);
    ctx.bezierCurveTo(w * 0.18, h * 0.35, w * 0.26, h * 0.62, w * 0.5, h * 0.98);
    ctx.bezierCurveTo(w * 0.8, h * 0.68, w * 0.9, h * 0.4, w * 0.5, h * 0.02);
    ctx.fill();
  }, { repeat: [1, 1], wrap: THREE.ClampToEdgeWrapping, track: true });
  const flames = [];
  [[-13, 6.2, -19.3, 3.6, 8], [-8.8, 10.2, -19.3, 4.8, 11], [-3.2, 14.2, -19.3, 3.2, 7], [3.4, 6.8, -19.3, 5.2, 12], [8.2, 11.5, -19.3, 3.8, 9], [14, 7.2, -19.3, 3.2, 7], [-1.5, 18, -24, 2.8, 6], [7, 19, -24, 2.2, 5]].forEach(([x, y, z, sw, sh], i) => {
    const mat = new THREE.SpriteMaterial({
      map: flameTexture, color: 0xffb35d, transparent: true, opacity: 0.75,
      depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false
    });
    const f = new THREE.Sprite(mat);
    f.position.set(x, y, z);
    f.scale.set(sw, sh, 1);
    f.userData.baseScale = [sw, sh];
    f.userData.phase = i * 1.37;
    world.root.add(f);
    flames.push(f);
  });
  // Focos de fuego en los huecos de la fachada.
  [[-10, 7, -19.2], [-3, 14, -19.2], [6, 10, -19.2], [13, 5, -19.2]].forEach((p) => {
    const g = addGlow(world, p, 0xff8d3d, 2.2, 0.18);
    g.userData.fireGlow = true;
  });
  const smoke = addSmokePlume(world, {
    origin: [1, 23, -19], count: 120, spread: [14, 4, 5],
    sizeMin: 3, sizeMax: 11, alphaMax: 0.34, color: 0x9b9180, life: 15, seed: 88
  });

  // Escombros y restos alrededor del edificio.
  addRubble(world, { count: 70, center: [0, 0, -6], spread: 22, color: 0x54534b, seed: 123 });
  const roofSlab = addBox(world.root, 10, 0.5, 5.5, 14, 0.5, -5, std(0x4b4a41, { roughness: 1 }), { rotZ: -0.22, cast: true });
  roofSlab.rotation.x = 0.12;
  const beam = addBox(world.root, 13, 0.45, 0.8, -10, 0.55, -5.5, metal, { rotY: 0.35, cast: true });
  addPuddle(world, 9, 3, 3.2, 0x1b2321);
  addPuddle(world, -7, 6, 4.4, 0x1a2220);

  // Camión de bomberos.
  const truck = makeFireTruck(1.15);
  truck.position.set(-16, 0, 10);
  truck.rotation.y = 0.5;
  world.root.add(truck);
  // Segundo vehículo más atrás.
  const truck2 = makeFireTruck(1.02);
  truck2.position.set(12, 0, -2);
  truck2.rotation.y = -0.65;
  world.root.add(truck2);

  // Mangueras: curvas desde los camiones hacia los bomberos.
  const hoseMat = std(0x2e312e, { roughness: 0.9 });
  const hosePath = [
    new THREE.Vector3(-13.2, 0.2, 12), new THREE.Vector3(-9, 0.16, 14.5),
    new THREE.Vector3(-5.2, 0.15, 15.8), new THREE.Vector3(-2.2, 0.16, 14.2)
  ];
  addTube(world.root, hosePath, 0.09, hoseMat, { segments: 50, radial: 5, cast: false });
  const hosePath2 = [
    new THREE.Vector3(9.7, 0.2, -1), new THREE.Vector3(7.2, 0.15, 6),
    new THREE.Vector3(4.4, 0.15, 11.2), new THREE.Vector3(2.6, 0.16, 13.6)
  ];
  addTube(world.root, hosePath2, 0.08, hoseMat, { segments: 40, radial: 5, cast: false });

  // Bomberos.
  const crew = new THREE.Group();
  world.root.add(crew);
  const firefighterData = [
    { x: -2.2, z: 14.2, ry: -0.15, scale: 1.24 },
    { x: 2.6, z: 13.6, ry: -0.45, scale: 1.18 },
    { x: -6.4, z: 12.4, ry: 0.2, scale: 1.22 },
    { x: 7.2, z: 10.8, ry: -0.8, scale: 1.25 },
    { x: -10.2, z: 9.5, ry: 0.5, scale: 1.16 },
    { x: 11.4, z: 8.2, ry: -0.35, scale: 1.2 }
  ];
  const firefighters = [];
  firefighterData.forEach((d, i) => {
    const f = makeFigure({
      coat: i < 2 ? 0x373b34 : 0x2c302d,
      pants: 0x242824, accent: 0xb39052, helmet: i % 2 ? 0xb05b2c : 0x9a3427,
      skin: 0x9a745c, scale: d.scale, noVest: false
    });
    f.position.set(d.x, 0, d.z); f.rotation.y = d.ry;
    crew.add(f); firefighters.push(f);
  });
  // Bombero arrodillado con herramienta.
  const kneeling = makeFigure({ coat: 0x30352f, pants: 0x222621, accent: 0xb39052, helmet: 0xa9492f, skin: 0x987158, scale: 1.0, noVest: false });
  kneeling.position.set(7.8, 0, 8.8); kneeling.rotation.y = -1.1; kneeling.rotation.x = -0.08;
  world.root.add(kneeling);

  // Boquillas y chorros de agua.
  function addWaterJet(origin, target, strength = 1) {
    const count = 80;
    const field = createParticleField(world, {
      count, center: [origin[0], origin[1], origin[2]], spread: [0.1, 0.1, 0.1],
      sizeMin: 0.03, sizeMax: 0.16, alphaMin: 0.06, alphaMax: 0.34,
      color: 0xbfd8de, colorVary: 0.03, texture: 'soft', seed: 200 + Math.floor(origin[0] * 3),
      renderOrder: 2
    });
    const rng = mulberry32(441 + Math.floor(origin[0] * 7));
    const data = [];
    for (let i = 0; i < count; i++) data.push({ p: rng(), speed: rr(rng, 0.35, 0.55), jitter: rr(rng, -0.35, 0.35) });
    const from = new THREE.Vector3(...origin);
    const to = new THREE.Vector3(...target);
    const mid = from.clone().lerp(to, 0.55); mid.y += 4.6 * strength;
    const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
    world.updaters.push((dt, t) => {
      for (let i = 0; i < count; i++) {
        const d = data[i];
        d.p += d.speed * dt;
        if (d.p > 1) d.p -= 1;
        const p = d.p;
        const pos = curve.getPoint(p);
        field.positions[i * 3] = pos.x + Math.sin(t * 9 + i) * 0.06 + d.jitter * p;
        field.positions[i * 3 + 1] = pos.y + Math.cos(t * 11 + i) * 0.05;
        field.positions[i * 3 + 2] = pos.z + Math.cos(t * 8 + i) * 0.05;
        const edge = Math.min(1, p * 4) * Math.min(1, (1 - p) * 8);
        field.alphas[i] = 0.12 + edge * 0.32;
      }
      field.update();
    });
    return field;
  }
  addWaterJet([-2.2, 1.5, 14.1], [0.0, 10.5, -7], 1.0);
  addWaterJet([2.6, 1.4, 13.5], [3.0, 8.0, -5], 0.85);
  addWaterJet([-6.4, 1.4, 12.3], [-2.0, 12.0, -7], 0.8);

  // Balizas de los camiones.
  const beacons = [];
  truck.traverse((o) => { if (o.isPointLight && o.color.r > 0.8) beacons.push(o); });
  truck2.traverse((o) => { if (o.isPointLight && o.color.r > 0.8) beacons.push(o); });

  // Cinta de cordón y conos.
  for (let i = 0; i < 7; i++) {
    const cone = new THREE.Group();
    cone.position.set(-7 + i * 3.6, 0, 15.2);
    addCylinder(cone, 0.02, 0.26, 0.7, 0, 0.35, 0, std(0xa3672c, { roughness: 0.8 }), { segments: 10 });
    addCylinder(cone, 0.19, 0.21, 0.16, 0, 0.23, 0, std(0xd4c6a4, { roughness: 0.8 }), { segments: 10, cast: false });
    world.root.add(cone);
  }

  // Restos metálicos y vigas retorcidas.
  for (let i = 0; i < 8; i++) {
    addBox(world.root, rr(rng, 2, 8), 0.2, 0.22, rr(rng, -18, 18), rr(rng, 0.2, 3.6), rr(rng, -9, 9), metal, { rotZ: rr(rng, -0.8, 0.8), rotY: rr(rng, 0, TAU), cast: true });
  }

  addDust(world, { count: 90, center: [0, 3, 3], spread: [18, 3.5, 13], sizeMin: 0.03, sizeMax: 0.13, color: 0xb8a48d, seed: 9 });
  addLabel(world, { text: 'BLOQUE 4', sub: 'núcleo expuesto · edificio dañado', position: [0, 28.5, -28] });
  addLabel(world, { text: 'BOMBEROS DE PRÍPIAT', sub: 'primeros equipos · 01:28', position: [-2.2, 4.5, 14] });
  addLabel(world, { text: 'CUBIERTA EN LLAMAS', sub: 'bitumen y restos incandescentes', position: [8.5, 27.5, -23] });
  addLabel(world, { text: 'MANGUERAS DE AGUA', sub: 'sin protección radiológica adecuada', position: [-8, 2.3, 14] });
  addLabel(world, { text: 'VEHÍCULO DE EMERGENCIA', sub: 'modelo genérico de la época', position: [-16, 4.0, 12] });

  const views = {
    fire: { position: [18, 4.5, 28], target: [0, 4.5, 2], fov: 56 },
    crew: { position: [11, 3.4, 25], target: [0, 2.2, 12], fov: 47 },
    roof: { position: [20, 16, 20], target: [4, 22, -24], fov: 45 }
  };
  function setView(id) {
    const v = views[id] || views.fire;
    flyCamera(new THREE.Vector3(...v.position), new THREE.Vector3(...v.target), v.fov, 1.2);
  }
  function resetView() { setView('fire'); }
  updateSequenceUI(0);

  return {
    root: world.root,
    labels: world.labels,
    pickables: [],
    camera: { position: views.fire.position, target: views.fire.target, fov: 56, minDistance: 4.5, maxDistance: 90, minPolarAngle: 0.2, maxPolarAngle: Math.PI * 0.49 },
    defaultView: 'fire',
    exposure: 1.28,
    setView,
    resetView,
    setStep() {},
    playSequence() {},
    update(dt, t) {
      world.updaters.forEach((fn) => fn(dt, t));
      beacons.forEach((b, i) => { b.intensity = 0.5 + Math.max(0, Math.sin(t * 5.5 + i * 1.7)) * 1.8; });
      firefighters.forEach((f, i) => {
        f.rotation.z = Math.sin(t * 0.8 + i) * 0.018;
        f.position.y = Math.sin(t * 1.3 + i) * 0.015;
      });
      flames.forEach((f, i) => {
        const p = f.userData.phase;
        const sx = 0.88 + Math.sin(t * 5.3 + p) * 0.15;
        const sy = 0.9 + Math.sin(t * 7.7 + p) * 0.16 + Math.sin(t * 13.1 + p) * 0.07;
        f.scale.set(f.userData.baseScale[0] * sx, f.userData.baseScale[1] * sy, 1);
        f.material.opacity = 0.42 + Math.max(0, Math.sin(t * 6.4 + p)) * 0.36;
        f.material.rotation = Math.sin(t * 1.8 + p) * 0.06;
      });
      buildingFire.points.visible = true;
      roofFire.points.visible = true;
    }
  };
};
