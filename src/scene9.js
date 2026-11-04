/* ============================================================
   CAPÍTULO 9 · ENCERRAR UN REACTOR
   Comparación museográfica: ruina, sarcófago de 1986 y NSC.
   ============================================================ */

SCENE_BUILDERS[9] = function buildChapter9() {
  const world = makeWorld('cap9-contencion');
  addSky(world, { top: 0x070b0d, horizon: 0x222a2b, bottom: 0x030505, radius: 140, stars: 40 });
  addFog(world, 0x090c0d, 0.0048);
  const lighting = addLighting(world, {
    sky: 0x849697, ground: 0x1b1d18, hemi: 0.62,
    sun: 0xd0d7cf, intensity: 1.55, position: [35, 70, 60],
    shadowSizeWorld: 80, shadowSize: 2048, ambient: 0.2
  });
  const backFill = new THREE.PointLight(0x9eb8b7, 2.4, 90, 2);
  backFill.position.set(-8, 22, 24); world.root.add(backFill);
  const floorFill = new THREE.PointLight(0xb6c4bb, 1.4, 80, 2);
  floorFill.position.set(-8, 8, 32); world.root.add(floorFill);
  addGround(world, { size: 260, texture: 'concrete', repeat: 26, color: 0x2c3333, y: 0 });
  // Base de museo.
  addBox(world.root, 135, 0.35, 50, -10, 0.15, -1, std(0x171d1e, { roughness: 0.7, metalness: 0.18 }), { cast: false });
  const grid = new THREE.GridHelper(130, 36, 0x4a5655, 0x2a3333);
  grid.position.set(-10, 0.36, -1); world.root.add(grid);

  const concrete = std(0x918f83, { roughness: 0.9 });
  const darkConcrete = std(0x66675e, { roughness: 0.95 });
  const charred = std(0x383832, { roughness: 1 });
  const steel = std(0x7a8582, { roughness: 0.4, metalness: 0.58 });
  const rust = std(0x825a41, { roughness: 0.9, metalness: 0.2 });
  const rng = mulberry32(2016);

  const positions = [-34, -6, 22];
  const models = [];

  function plinth(x, label, sub) {
    const g = new THREE.Group();
    g.position.set(x, 0, 0);
    world.root.add(g);
    addBox(g, 25, 1.0, 23, 0, 0.85, 0, std(0x363e3e, { roughness: 0.8, metalness: 0.12 }), { cast: true });
    addBox(g, 25.6, 0.2, 23.6, 0, 1.36, 0, std(0x1c2323), { cast: false });
    addSign(g, [label, sub], 10, 2.1, 0, 0.55, 11.62, {
      bg: '#171d1d', color: '#b7b09e', font: '500 48px "IBM Plex Mono", monospace',
      texWidth: 1000, texHeight: 240
    });
    return g;
  }

  // 1. Ruina del reactor.
  const ruin = new THREE.Group();
  ruin.position.set(0, 1.45, 0);
  const p1 = plinth(positions[0], '1986 · RUINA', 'REACTOR DESTRUIDO');
  p1.add(ruin);
  addBox(ruin, 21, 11, 17, 0, 5.5, 0, concrete, { cast: true });
  addBox(ruin, 22, 1.0, 18, 0, 11.4, 0, charred, { cast: true });
  // Abertura y estructura rota.
  addBox(ruin, 11, 9, 1.0, -3.5, 5.0, 8.6, charred, { cast: false });
  addBox(ruin, 8, 3.2, 0.8, 3.5, 9.8, 8.6, std(0x1b1d1a, { roughness: 1 }), { cast: false });
  for (let i = 0; i < 9; i++) {
    addBox(ruin, rr(rng, 1.2, 3.2), rr(rng, 1.2, 4.5), 1.0, -9 + i * 2.2, 11 + rr(rng, -1, 2), 8.75, std(0x514f46, { roughness: 1 }), { rotZ: rr(rng, -0.3, 0.3), cast: true });
  }
  addBox(ruin, 12, 0.5, 0.8, 1, 8.5, 2, steel, { rotZ: 0.3, rotY: 0.2, cast: true });
  addBox(ruin, 0.5, 7, 0.7, 6, 3.5, 5, steel, { rotZ: 0.5, cast: true });
  addRubble({ root: ruin }, { count: 40, center: [0, 0, 4], spread: 8, color: 0x535147, seed: 6 });
  // Restos de grafito.
  for (let i = 0; i < 12; i++) {
    addBox(ruin, rr(rng, 0.2, 0.6), rr(rng, 0.1, 0.3), rr(rng, 0.2, 0.6), rr(rng, -6, 6), 0.2, rr(rng, 1, 7), std(0x242723, { roughness: 1 }), { rotY: rr(rng, 0, TAU), cast: true });
  }
  addLabel(world, { text: 'REACTOR DESTRUIDO', sub: 'núcleo expuesto · 1986', position: [positions[0], 16.2, 0] });
  models.push({ group: p1, spot: null, x: positions[0] });

  // 2. Sarcófago de 1986.
  const sarc = new THREE.Group();
  sarc.position.set(0, 1.45, 0);
  const p2 = plinth(positions[1], '1986 · SARCÓFAGO', '206 DÍAS');
  p2.add(sarc);
  addBox(sarc, 22, 10, 18, 0, 5, 0, darkConcrete, { cast: true });
  addBox(sarc, 24, 1.2, 20, 0, 10.5, 0, std(0x54564e, { roughness: 0.95 }), { cast: true });
  // Muros inclinados.
  [-11.5, 11.5].forEach((x) => {
    const wall = addBox(sarc, 1.6, 11, 19, x, 5.5, 0, concrete, { rotZ: x < 0 ? -0.08 : 0.08, cast: true });
    for (let i = 0; i < 3; i++) {
      addBox(sarc, 2.4, 7, 1.4, x, 3.5, -6.5 + i * 6.5, darkConcrete, { rotZ: x < 0 ? -0.12 : 0.12, cast: true });
    }
  });
  addBox(sarc, 23, 1.5, 19, 0, 11.7, 0, std(0x474a43), { rotZ: 0.03, cast: true });
  addBox(sarc, 5, 3.2, 1.2, 4, 2.1, 9.4, std(0x1e221f), { cast: false });
  addCylinder(sarc, 1.3, 1.6, 5, -5, 14.0, -4, rust, { segments: 10, cast: true });
  addCylinder(sarc, 0.9, 1.1, 3.8, 6, 13.2, 2, steel, { segments: 10, cast: true });
  addBox(sarc, 0.6, 6, 0.6, -9, 3, 8, steel, { cast: false });
  addBox(sarc, 9, 0.4, 0.6, -5, 6.1, 8.1, steel, { cast: false });
  addLabel(world, { text: 'PRIMER SARCÓFAGO', sub: 'estructura de emergencia', position: [positions[1], 18.6, 0] });
  models.push({ group: p2, spot: null, x: positions[1] });

  // 3. NSC: arco de acero que cubre el sarcófago.
  const nsc = new THREE.Group();
  nsc.position.set(0, 1.45, 0);
  const p3 = plinth(positions[2], '2016 · NSC', 'NUEVO CONFINAMIENTO SEGURO');
  p3.add(nsc);
  // Interior: sarcófago reducido.
  const inner = new THREE.Group();
  inner.position.set(0, 0, -4);
  nsc.add(inner);
  addBox(inner, 18, 7, 12, 0, 3.5, 0, darkConcrete, { cast: true });
  addBox(inner, 20, 0.9, 13, 0, 7.3, 0, std(0x494b44), { cast: true });
  addBox(inner, 2.0, 5, 1.0, -6, 2.5, 6.2, charred, { cast: false });
  addBox(inner, 2.0, 5, 1.0, 6, 2.5, 6.2, charred, { cast: false });
  // Arco: perfil exterior y hueco interior extruido.
  const outer = new THREE.Shape();
  const halfW = 15, legs = 5.2, R = halfW, depth = 24;
  outer.moveTo(-halfW, 0);
  outer.lineTo(-halfW, legs);
  outer.absarc(0, legs, R, Math.PI, 0, true);
  outer.lineTo(halfW, 0);
  outer.closePath();
  const hole = new THREE.Path();
  const inW = halfW - 1.5, inR = inW;
  hole.moveTo(-inW, 0);
  hole.lineTo(-inW, legs);
  hole.absarc(0, legs, inR, Math.PI, 0, true);
  hole.lineTo(inW, 0);
  hole.closePath();
  outer.holes.push(hole);
  const archGeo = new THREE.ExtrudeGeometry(outer, { depth, bevelEnabled: false, curveSegments: 40 });
  archGeo.translate(0, 0, -depth / 2);
  const archMat = new THREE.MeshStandardMaterial({ color: 0x8d9995, roughness: 0.42, metalness: 0.62 });
  const arch = new THREE.Mesh(archGeo, archMat);
  arch.castShadow = true; arch.receiveShadow = true;
  arch.position.y = 0; nsc.add(arch);
  // Aristas del arco.
  const archEdges = new THREE.LineSegments(new THREE.EdgesGeometry(archGeo, 20), new THREE.LineBasicMaterial({
    color: 0x2b3534, transparent: true, opacity: 0.6
  }));
  nsc.add(archEdges);
  // Costillas y detalles de fachada.
  for (let i = 0; i < 5; i++) {
    const z = -8 + i * 4;
    const rib = new THREE.Mesh(new THREE.TorusGeometry(14.9, 0.12, 5, 40, Math.PI), std(0x4b5855, { metalness: 0.5, roughness: 0.4 }));
    rib.rotation.z = 0; rib.position.set(0, 5.2, z); nsc.add(rib);
  }
  for (let i = 0; i < 4; i++) {
    addBox(nsc, 0.25, 20, 0.3, -14.6, 10, -9 + i * 6, steel, { cast: false });
  }
  addBox(nsc, 29.8, 0.35, 24, 0, 0.3, 0, std(0x333d3c), { cast: false });
  // Rieles y pasarela.
  [-16.5, 16.5].forEach((z) => {
    addBox(nsc, 32, 0.2, 0.25, 0, 0.35, z, steel, { cast: false });
  });
  addBox(nsc, 30, 0.2, 1.2, 0, 0.36, 13.8, rust, { cast: false });
  // Panel frontal con puerta técnica.
  addBox(nsc, 7, 5, 0.5, -11, 2.5, 12.2, std(0x59615d, { roughness: 0.5, metalness: 0.3 }), { cast: false });
  addSign(nsc, ['NSC'], 6.2, 2.0, -11, 6.0, 12.48, {
    bg: '#2c3532', color: '#ddd6c4', font: '700 120px "Barlow Condensed", Arial', texWidth: 600, texHeight: 220
  });
  addLabel(world, { text: 'NUEVO CONFINAMIENTO', sub: '36.000 t · 100 años de diseño', position: [positions[2], 23.5, 0] });
  models.push({ group: p3, spot: null, x: positions[2] });

  // Iluminación museográfica con focos.
  models.forEach((m, i) => {
    const spot = new THREE.SpotLight(i === 2 ? 0xcfe2da : 0xf0dfc0, i === 2 ? 7.5 : 5.4, 75, 0.55, 0.62, 1.2);
    spot.position.set(m.x, 36, 22);
    spot.target.position.set(m.x, 6, 0);
    world.root.add(spot.target);
    world.root.add(spot);
    m.spot = spot;
  });
  // Luces de separación.
  for (let i = 0; i < 6; i++) {
    const strip = new THREE.PointLight(0xa8bdb8, 1.1, 40, 2);
    strip.position.set(-58 + i * 20, 9, 25);
    world.root.add(strip);
  }
  // Pared de fondo con franjas museográficas.
  addBox(world.root, 150, 26, 1.0, -8, 13, -26, std(0x141a1b, { roughness: 0.9 }), { cast: false });
  for (let i = 0; i < 3; i++) {
    addBox(world.root, 0.16, 18, 0.2, -40 + i * 34, 13, -25.4, emissive(0x8fa39c, 0.6), { cast: false });
  }
  // Partículas de polvo de museo.
  addDust(world, { count: 70, center: [-10, 8, 0], spread: [55, 8, 22], sizeMin: 0.03, sizeMax: 0.12, color: 0xd4cdbd, seed: 18 });

  let step = 2;
  let playing = false;
  let stageTime = 0;
  let seqTick = performance.now();
  const durations = [3.8, 3.8, 4.4];
  function applyStep(index, instant) {
    step = clamp(index, 0, 2);
    stageTime = 0;
    seqTick = performance.now();
    models.forEach((m, i) => {
      if (m.spot) m.spot.intensity = i === step ? 7.5 : 2.2;
    });
    updateSequenceUI(step);
  }
  function setStep(index, instant) { playing = false; applyStep(index, !!instant); }
  function playSequence() {
    // setStep() detiene la reproducción por diseño; por eso se reactiva después.
    setStep(0, true);
    playing = true;
    stageTime = 0;
    seqTick = performance.now();
    updateSequenceUI(0);
  }
  applyStep(2, true);

  const views = {
    compare: { position: [-8, 49, 104], target: [-8, 8, 0], fov: 47 },
    sarcophagus: { position: [-8, 23, 42], target: [-6, 9, 0], fov: 42 },
    nsc: { position: [22, 25, 44], target: [22, 10, 0], fov: 43 }
  };
  function setView(id) {
    const v = views[id] || views.compare;
    flyCamera(new THREE.Vector3(...v.position), new THREE.Vector3(...v.target), v.fov, 1.3);
  }
  function resetView() { setView('compare'); }

  return {
    root: world.root,
    labels: world.labels,
    pickables: [],
    camera: { position: views.compare.position, target: views.compare.target, fov: 47, minDistance: 18, maxDistance: 140, minPolarAngle: 0.2, maxPolarAngle: Math.PI * 0.49 },
    defaultView: 'compare',
    exposure: 1.28,
    setView,
    resetView,
    setStep,
    playSequence,
    update(dt, t) {
      world.updaters.forEach((fn) => fn(dt, t));
      models.forEach((m, i) => {
        if (!m.spot) return;
        const base = i === step ? 7.5 : 2.2;
        m.spot.intensity = lerp(m.spot.intensity, base, 0.05);
      });
      // Pequeño destello en el borde del arco.
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
