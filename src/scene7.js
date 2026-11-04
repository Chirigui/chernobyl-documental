/* ============================================================
   CAPÍTULO 7 · LOS LIQUIDADORES
   Tejados, túnel bajo el reactor y construcción del sarcófago.
   ============================================================ */

SCENE_BUILDERS[7] = function buildChapter7() {
  const world = makeWorld('cap7-liquidadores');
  addSky(world, {
    top: 0x39464a, horizon: 0xa19880, bottom: 0x111515,
    stars: 0, sun: { position: [-120, 90, -150], color: 0xe0d0aa, size: 40, opacity: 0.08 }
  });
  addFog(world, 0x5c584c, 0.0075);
  addLighting(world, {
    sky: 0xa8b0aa, ground: 0x302b22, hemi: 0.72,
    sun: 0xd9c9a7, intensity: 2.0, position: [-65, 75, 55],
    shadowSizeWorld: 80, shadowSize: 2048, ambient: 0.08
  });
  addGround(world, { size: 260, texture: 'dust', repeat: 28, color: 0x9b927e });
  addGround(world, { size: 100, texture: 'concrete', repeat: 16, color: 0x8b877a, y: 0.02 });
  const rng = mulberry32(1987);

  const concrete = std(0x817e72, { roughness: 0.95 });
  const concreteDark = std(0x5c5b52, { roughness: 0.96 });
  const metal = std(0x5d6562, { roughness: 0.5, metalness: 0.48 });
  const darkMetal = std(0x2b2f2c, { roughness: 0.6, metalness: 0.4 });
  const rust = std(0x76543d, { roughness: 0.9, metalness: 0.2 });
  const orange = std(0xb37935, { roughness: 0.7 });
  const lead = std(0x333733, { roughness: 0.86 });

  // Restos del bloque 4 al fondo.
  const reactor = new THREE.Group();
  reactor.position.set(0, 0, -15);
  world.root.add(reactor);
  addBox(reactor, 43, 22, 27, 0, 11, 0, concrete, { cast: true });
  addBox(reactor, 44, 1.4, 28, 2, 23, 0, std(0x4c4c45, { roughness: 1 }), { cast: true });
  addBox(reactor, 19, 11, 1.1, -5, 12, 13.55, std(0x1d201d, { roughness: 1 }), { cast: false });
  for (let i = 0; i < 8; i++) {
    addBox(reactor, rr(rng, 2, 4), rr(rng, 2, 6), 1.4, -18 + i * 5, 19 + rr(rng, -2, 3), 13.7, std(0x4e4d44, { roughness: 1 }), { rotZ: rr(rng, -0.2, 0.2), cast: true });
  }
  addRubble(world, { count: 90, center: [0, 0, 4], spread: 24, color: 0x615f56, seed: 71 });
  // Restos de grafito.
  for (let i = 0; i < 24; i++) {
    addBox(world.root, rr(rng, 0.3, 1.1), rr(rng, 0.15, 0.5), rr(rng, 0.3, 1.1), rr(rng, -16, 16), 0.18, rr(rng, 2, 20), std(0x292c29, { roughness: 1 }), { rotY: rr(rng, 0, TAU), cast: true });
  }

  // Tejado de trabajo: plataforma con restos y bio-robots.
  const roof = new THREE.Group();
  roof.position.set(-1, 14.6, 10);
  world.root.add(roof);
  addBox(roof, 22, 0.8, 13, 0, 0, 0, concreteDark, { cast: true });
  // Estructura de apoyo del techo de trabajo.
  for (const [sx, sz] of [[-9, -5], [9, -5], [-9, 5], [9, 5], [0, -5], [0, 5]]) {
    addBox(world.root, 0.45, 14.2, 0.45, -1 + sx, 7.1, 10 + sz, metal, { cast: false });
    addBox(world.root, 2.0, 0.25, 2.0, -1 + sx, 0.25, 10 + sz, concreteDark, { cast: false });
  }
  for (let i = 0; i < 3; i++) {
    addBox(world.root, 19, 0.18, 0.35, -1, 4 + i * 4.2, 5.1, metal, { cast: false });
    addBox(world.root, 19, 0.18, 0.35, -1, 4 + i * 4.2, 14.9, metal, { cast: false });
  }
  addBox(roof, 22.2, 0.25, 13.2, 0, 0.5, 0, std(0x3c3d38, { roughness: 1 }), { cast: false });
  // Pretil y barandilla.
  addBox(roof, 22, 1.1, 0.25, 0, 1, -6.6, metal, { cast: false });
  addBox(roof, 22, 1.1, 0.25, 0, 1, 6.6, metal, { cast: false });
  // Montones de grafito y escombros.
  for (let i = 0; i < 30; i++) {
    addBox(roof, rr(rng, 0.2, 1.0), rr(rng, 0.1, 0.35), rr(rng, 0.2, 1.0), rr(rng, -9, 9), 0.8 + rr(rng, 0, 0.3), rr(rng, -5, 5), std(i % 4 ? 0x3a3b36 : 0x23251f, { roughness: 1 }), { rotY: rr(rng, 0, TAU), cast: true });
  }
  // Trabajadores del tejado.
  const roofWorkers = [];
  for (let i = 0; i < 5; i++) {
    const f = makeFigure({
      coat: 0x4e554d, pants: 0x30352f, accent: 0xb08c4d,
      helmet: 0xc9c2ad, skin: 0x9b7258, apron: true, noTank: true, noVest: true, scale: 0.92
    });
    f.position.set(-7 + i * 3.3, 0.7, -1.7 + (i % 2) * 2.9);
    f.rotation.y = rr(rng, 0, TAU);
    roof.add(f); roofWorkers.push(f);
    // Pala.
    const shovel = addCylinder(f, 0.03, 0.04, 1.2, 0.25, 0.75, 0.2, metal, { rotZ: 0.55, segments: 5, cast: false });
    addBox(f, 0.32, 0.05, 0.4, 0.55, 0.28, 0.3, metal, { rotZ: 0.55, cast: false });
  }
  addLabel(world, { text: 'TEJADO DEL BLOQUE 3', sub: 'turnos de menos de un minuto', position: [-1, 20.5, 10], views: ['roof'] });
  addLabel(world, { text: 'BIO-ROBOTS', sub: 'personal con palas y protección limitada', position: [5.5, 17.5, 10], views: ['roof'] });

  // Túnel de refrigeración bajo el reactor.
  const tunnel = new THREE.Group();
  tunnel.position.set(-15, 0, 16);
  tunnel.rotation.y = 0.18;
  world.root.add(tunnel);
  addBox(tunnel, 10, 7, 4, 0, 3.5, 0, concrete, { cast: true });
  addBox(tunnel, 7, 4.7, 0.4, 0, 2.35, 2.1, std(0x101412, { roughness: 1 }), { cast: false });
  addBox(tunnel, 10.4, 0.8, 5, 0, 7.1, 0, concreteDark, { cast: false });
  // Cerchas metálicas y vagoneta.
  for (let i = 0; i < 4; i++) {
    addBox(tunnel, 0.25, 4.2, 0.25, -2.4 + i * 1.6, 2.4, 2.4, rust, { cast: false });
  }
  addBox(tunnel, 10.8, 0.3, 0.8, 0, 4.6, 2.5, metal, { cast: false });
  const cart = new THREE.Group();
  cart.position.set(1.5, 0.4, 2.6);
  addBox(cart, 2.0, 1.0, 1.4, 0, 0.6, 0, darkMetal, { cast: true });
  [[-0.7, -0.45], [0.7, -0.45], [-0.7, 0.45], [0.7, 0.45]].forEach(([x, z]) => {
    addCylinder(cart, 0.18, 0.18, 0.12, x, 0.18, z, metal, { rotZ: Math.PI / 2, segments: 8, cast: false });
  });
  addBox(cart, 1.8, 0.12, 1.2, 0, 1.3, 0, rust, { cast: false });
  tunnel.add(cart);
  const tunnelLight = new THREE.PointLight(0xffc987, 1.5, 13, 2);
  tunnelLight.position.set(0, 3.4, 1.5); tunnel.add(tunnelLight);
  // Mineros.
  for (let i = 0; i < 3; i++) {
    const f = makeFigure({
      coat: 0x555a4f, pants: 0x2b2f2c, accent: 0x8c743e, helmet: 0xc7bba1,
      skin: 0x9b755c, noTank: true, noVest: true, scale: 0.94
    });
    f.position.set(-2.1 + i * 1.8, 0, 4.3);
    f.rotation.y = rr(rng, -0.5, 0.5);
    tunnel.add(f);
  }
  addLabel(world, { text: 'TÚNEL DE REFRIGERACIÓN', sub: 'excavado bajo el reactor · 15 días', position: [-15, 10.5, 17], views: ['tunnel'] });
  addLabel(world, { text: 'LOSA DE HORMIGÓN', sub: 'barrera contra el combustible fundido', position: [-11, 5.0, 18], views: ['tunnel'] });

  // Sarcófago en construcción.
  const sarc = new THREE.Group();
  sarc.position.set(0, 0, -13);
  world.root.add(sarc);
  // Cuerpo de contención, cuatro muros inclinados.
  const walls = [];
  const wallMats = std(0x767467, { roughness: 0.96 });
  // Muro frontal y trasero.
  const frontWall = addBox(sarc, 28, 11, 1.8, 0, 5.5, 13.2, wallMats, { cast: true });
  const backWall = addBox(sarc, 28, 13, 1.8, 0, 6.5, -13.2, wallMats, { cast: true });
  frontWall.rotation.x = -0.08;
  walls.push(frontWall, backWall);
  // Muros laterales con contrafuertes.
  [-14, 14].forEach((x) => {
    const wall = addBox(sarc, 1.8, 12, 27, x, 6, 0, wallMats, { cast: true });
    wall.rotation.z = x < 0 ? -0.06 : 0.06;
    walls.push(wall);
    for (let i = 0; i < 4; i++) {
      addBox(sarc, 2.6, 8, 1.6, x, 4, -10 + i * 6.6, concreteDark, { rotZ: x < 0 ? -0.1 : 0.1, cast: true });
    }
  });
  // Cubierta inclinada, se activa en la etapa final.
  const cover = new THREE.Group();
  cover.position.y = 13.6;
  sarc.add(cover);
  addBox(cover, 30, 1.3, 28, 0, 0, 0, std(0x55534a, { roughness: 0.9, metalness: 0.2 }), { cast: true });
  addBox(cover, 30.5, 0.3, 28.5, 0, 0.8, 0, darkMetal, { cast: false });
  const coverVent = addCylinder(cover, 1.7, 2.1, 7, -3, 4.0, 3, rust, { segments: 10, cast: true });
  addCylinder(cover, 1.4, 1.7, 5, 7, 3.2, -4, metal, { segments: 10, cast: true });
  cover.visible = false;
  // Aberturas y detalles.
  addBox(sarc, 12, 3, 1.6, 8, 2.0, 13.3, std(0x20241f, { roughness: 1 }), { cast: false });
  addBox(sarc, 4, 5, 1.5, -7, 3, 13.3, darkMetal, { cast: false });
  addBox(sarc, 6, 0.4, 2.0, -7, 6.0, 13.7, metal, { cast: false });
  addLabel(world, { text: 'PRIMER SARCÓFAGO', sub: '206 días · 1986', position: [8, 19.5, -2], views: ['sarcophagus'] });
  addLabel(world, { text: 'MURO DE CONTENCIÓN', sub: 'hormigón armado', position: [-12, 11, 2], views: ['sarcophagus'] });
  addLabel(world, { text: 'GRÚA TORRE', sub: 'izaje de materiales', position: [23, 37, 2], views: ['sarcophagus'] });

  // Grúa torre y andamios.
  const crane = new THREE.Group();
  crane.position.set(23, 0, 2);
  world.root.add(crane);
  const craneMat = std(0xb39b51, { roughness: 0.7, metalness: 0.28 });
  addBox(crane, 2.8, 1.2, 2.8, 0, 0.6, 0, concreteDark, { cast: true });
  // Mástil de celosía simplificado.
  for (let i = 0; i < 13; i++) {
    addBox(crane, 0.18, 1.4, 0.18, -1.1, 1.7 + i * 2.7, -1.1, craneMat, { cast: false });
    addBox(crane, 0.18, 1.4, 0.18, 1.1, 1.7 + i * 2.7, -1.1, craneMat, { cast: false });
    addBox(crane, 0.18, 1.4, 0.18, -1.1, 1.7 + i * 2.7, 1.1, craneMat, { cast: false });
    addBox(crane, 0.18, 1.4, 0.18, 1.1, 1.7 + i * 2.7, 1.1, craneMat, { cast: false });
    addBox(crane, 2.2, 0.1, 0.1, 0, 2.3 + i * 2.7, -1.1, craneMat, { cast: false });
    addBox(crane, 0.1, 0.1, 2.2, 1.1, 2.3 + i * 2.7, 0, craneMat, { cast: false });
  }
  const jib = new THREE.Group();
  jib.position.y = 32;
  crane.add(jib);
  addBox(jib, 26, 0.8, 1.2, -6, 0, 0, craneMat, { cast: true });
  addBox(jib, 6, 1.2, 1.8, 3.8, 0.2, 0, darkMetal, { cast: true });
  addBox(jib, 0.12, 0.12, 0.12, -18, 0.2, 0, metal, { cast: false });
  addCylinder(jib, 0.06, 0.06, 12, -18, -5.9, 0, metal, { segments: 4, cast: false });
  const hook = new THREE.Group();
  hook.position.set(-18, -11.6, 0); jib.add(hook);
  addBox(hook, 1.4, 1.2, 1.4, 0, 0, 0, orange, { cast: true });
  addCylinder(hook, 0.12, 0.12, 1.6, 0, 1.2, 0, metal, { segments: 5, cast: false });
  // Andamios junto al muro.
  const scaffold = new THREE.Group();
  scaffold.position.set(-12, 0, 2);
  world.root.add(scaffold);
  for (let i = 0; i < 4; i++) {
    addCylinder(scaffold, 0.06, 0.06, 13, -5 + i * 3.4, 6.5, 8.5, metal, { segments: 4, cast: false });
    addCylinder(scaffold, 0.06, 0.06, 13, -5 + i * 3.4, 6.5, 11.3, metal, { segments: 4, cast: false });
  }
  for (let i = 0; i < 5; i++) {
    addBox(scaffold, 11.5, 0.12, 3, -2.9, 1.4 + i * 2.7, 9.9, metal, { cast: false });
  }
  // Materiales y bidones.
  for (let i = 0; i < 7; i++) {
    addCylinder(world.root, 0.35, 0.4, 1.1, 21 + i * 1.1, 0.6, 10, std(i % 2 ? 0x5c675d : 0x9b6b35, { roughness: 0.8, metalness: 0.2 }), { segments: 10, cast: true });
  }
  for (let i = 0; i < 6; i++) {
    addBox(world.root, 2.1, 0.45, 1.4, -21 + i * 2.4, 0.25, 23, std(0x5d5b4d), { cast: true });
  }

  // Trabajadores de tierra y deambulación.
  const groundWorkers = [];
  for (let i = 0; i < 8; i++) {
    const f = makeFigure({
      coat: i % 3 === 0 ? 0x5e645a : 0x474d44, pants: 0x2b302c,
      accent: 0xa98445, helmet: i % 2 ? 0xd1c7ae : 0xc37a3e,
      skin: 0x9f7860, apron: i % 4 === 0, noVest: true, noTank: true, scale: rr(rng, 0.92, 1.04)
    });
    f.position.set(rr(rng, -17, 19), 0, rr(rng, 8, 24));
    f.rotation.y = rr(rng, 0, TAU);
    world.root.add(f); groundWorkers.push(f);
  }
  // Un trabajador sobre una escalera.
  const ladder = makeFigure({ coat: 0x555c53, pants: 0x2b302c, accent: 0xa98445, helmet: 0xd1c7ae, skin: 0x9a7259, noVest: true, noTank: true, scale: 0.95 });
  ladder.position.set(19.5, 2.2, 12); ladder.rotation.y = -0.9; world.root.add(ladder);
  addBox(world.root, 0.9, 5.2, 0.8, 19.5, 2.6, 11.2, metal, { rotY: -0.25, cast: false });

  addDust(world, { count: 100, center: [0, 4, 8], spread: [24, 5, 20], sizeMin: 0.04, sizeMax: 0.2, color: 0xd0bd9d, seed: 33 });
  const steam = addSmokePlume(world, { origin: [0, 12, -2], count: 55, spread: [9, 3, 8], sizeMin: 2, sizeMax: 7, alphaMax: 0.13, color: 0xb4ac99, life: 12, seed: 5 });

  // Secuencia de construcción.
  let step = 3;
  let playing = false;
  let stageTime = 0;
  let seqTick = performance.now();
  const durations = [3.0, 3.2, 3.2, 3.4];
  let craneAngle = 0;
  function applyStep(index, instant) {
    step = clamp(index, 0, 3);
    stageTime = 0;
    seqTick = performance.now();
    // Las paredes y la cubierta crecen por etapas.
    walls.forEach((w, i) => {
      if (w.userData.baseY == null) w.userData.baseY = w.position.y;
      const target = step >= 2 ? 1 : 0.35;
      w.userData.targetScaleY = target;
      if (instant) {
        w.scale.y = target;
        w.position.y = w.userData.baseY * target;
      }
    });
    cover.visible = step >= 3;
    if (step >= 3) cover.position.y = 13.6;
    if (instant) cover.position.y = 13.6;
    // Los andamios acompañan la obra.
    scaffold.visible = step < 3;
    updateSequenceUI(step);
  }
  function setStep(index, instant) { playing = false; applyStep(index, instant); }
  function playSequence() {
    // setStep() detiene la reproducción por diseño; por eso se reactiva después.
    setStep(0, true);
    playing = true;
    stageTime = 0;
    seqTick = performance.now();
    updateSequenceUI(0);
  }
  applyStep(3, true);

  const views = {
    roof: { position: [12, 21, 26], target: [0, 16, 10], fov: 44 },
    tunnel: { position: [8, 6, 31], target: [-15, 4, 16], fov: 46 },
    sarcophagus: { position: [56, 39, 60], target: [0, 9, -5], fov: 43 }
  };
  function setView(id) {
    const v = views[id] || views.sarcophagus;
    flyCamera(new THREE.Vector3(...v.position), new THREE.Vector3(...v.target), v.fov, 1.25);
  }
  function resetView() { setView('roof'); }

  return {
    root: world.root,
    labels: world.labels,
    pickables: [],
    camera: { position: views.roof.position, target: views.roof.target, fov: 44, minDistance: 9, maxDistance: 130, minPolarAngle: 0.18, maxPolarAngle: Math.PI * 0.49 },
    defaultView: 'roof',
    exposure: 1.16,
    setView,
    resetView,
    setStep,
    playSequence,
    update(dt, t) {
      world.updaters.forEach((fn) => fn(dt, t));
      craneAngle += dt * 0.12;
      jib.rotation.y = Math.sin(craneAngle) * 0.22;
      hook.position.y = -11.6 + Math.sin(t * 0.6) * 0.6;
      jib.children.forEach((c) => {});
      roofWorkers.forEach((f, i) => {
        f.rotation.y += Math.sin(t * 0.35 + i) * 0.0015;
        f.position.y = 0.7 + Math.sin(t * 1.6 + i) * 0.012;
      });
      walls.forEach((w) => {
        const target = w.userData.targetScaleY == null ? 1 : w.userData.targetScaleY;
        w.scale.y = lerp(w.scale.y, target, 0.045);
        w.position.y = w.userData.baseY * w.scale.y;
      });
      const nowMs = performance.now();
      const seqDt = Math.min(1.0, Math.max(0, (nowMs - seqTick) / 1000));
      seqTick = nowMs;
      if (playing) {
        stageTime += seqDt;
        if (stageTime > durations[step]) {
          if (step < 3) applyStep(step + 1, false);
          else { playing = false; STATE.sequencePlaying = false; }
        }
      }
    }
  };
};
