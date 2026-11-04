/* ============================================================
   CAPÍTULO 10 · REFLEXIÓN FINAL
   Amanecer sobre la central. Silencio, escala y memoria.
   ============================================================ */

SCENE_BUILDERS[10] = function buildChapter10() {
  const world = makeWorld('cap10-amanecer');
  addSky(world, {
    top: 0x16212b, horizon: 0xd1a06a, bottom: 0x0a0c0c,
    stars: 30,
    sun: { position: [-145, 12, -230], color: 0xffd09a, size: 90, opacity: 0.45 }
  });
  addFog(world, 0x3d403d, 0.0072);
  addLighting(world, {
    sky: 0x94a4aa, ground: 0x2b261d, hemi: 0.45,
    sun: 0xffc58b, intensity: 1.45, position: [-100, 22, 40],
    shadowSizeWorld: 90, shadowSize: 2048, ambient: 0.05
  });
  addGround(world, { size: 360, texture: 'grass', repeat: 36, color: 0x777663 });

  const rng = mulberry32(2026);
  // Campo y hierba baja.
  addTrees(world, { count: 40, center: [-55, 0, -40], spreadX: 35, spreadZ: 40, scale: 0.9, seed: 12, trunkColor: 0x2a241b, foliageColor: 0x242c25 });
  addTrees(world, { count: 35, center: [55, 0, -48], spreadX: 30, spreadZ: 35, scale: 0.8, seed: 22, trunkColor: 0x2a241b, foliageColor: 0x202822 });
  // Camino rural hacia la central.
  const road = addBox(world.root, 7, 0.08, 130, -8, 0.06, -15, std(0x4d4d44, { roughness: 0.98 }), { cast: false });
  road.rotation.y = -0.06;
  for (let i = 0; i < 16; i++) {
    addBox(world.root, 0.18, 0.02, 4, -8 + Math.sin(i) * 0.8, 0.12, -68 + i * 9, std(0xaaa18a, { roughness: 0.9 }), { cast: false });
  }
  // Postes de una vieja línea eléctrica.
  for (let i = 0; i < 5; i++) {
    const x = -26 + i * 12, z = 20 - i * 18;
    addCylinder(world.root, 0.11, 0.16, 7, x, 3.5, z, std(0x3d403a, { roughness: 0.9 }), { segments: 6 });
    addBox(world.root, 3.4, 0.12, 0.12, x, 6.5, z, std(0x3d403a), { cast: false });
  }

  // Silueta de la central en el horizonte.
  const plant = new THREE.Group();
  plant.position.set(-2, 0, -92);
  world.root.add(plant);
  const silhouette = std(0x1c2526, { roughness: 1, metalness: 0.05 });
  const silhouette2 = std(0x151d1e, { roughness: 1, metalness: 0.05 });
  addBox(plant, 102, 3, 22, 0, 1.5, 0, silhouette2, { cast: false, receive: false });
  // Cuatro bloques.
  [-42, -14, 14, 42].forEach((x, i) => {
    addBox(plant, 21, 18, 20, x, 10, 0, i === 3 ? silhouette : silhouette2, { cast: false, receive: false });
    addBox(plant, 22, 2, 21, x, 19, 0, silhouette2, { cast: false, receive: false });
    addBox(plant, 15, 2.6, 0.4, x, 14, 10.2, basic(0x283534), { cast: false, receive: false });
    addBox(plant, 2.4, 4.5, 2.4, x + 6, 22, -4, silhouette2, { cast: false, receive: false });
  });
  // Sala de turbinas.
  addBox(plant, 98, 10, 16, 0, 5, 17, silhouette, { cast: false, receive: false });
  // Torre de ventilación.
  addCylinder(plant, 1.4, 2.0, 47, 60, 24, -3, silhouette, { segments: 10, cast: false });
  // NSC: arco silueta.
  const archShape = new THREE.Shape();
  archShape.moveTo(-24, 0);
  archShape.lineTo(-24, 6);
  archShape.absarc(0, 6, 24, Math.PI, 0, true);
  archShape.lineTo(24, 0);
  archShape.closePath();
  const archGeo = new THREE.ExtrudeGeometry(archShape, { depth: 26, bevelEnabled: false, curveSegments: 24 });
  archGeo.translate(0, 0, -13);
  const arch = new THREE.Mesh(archGeo, silhouette);
  arch.position.set(6, 0, -2);
  plant.add(arch);
  // Luces de seguridad tenues.
  const redDot = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6), emissive(0xbc3325, 2.2));
  redDot.position.set(60, 48, -3); plant.add(redDot);
  const amberDot = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), emissive(0xd0a04c, 1.6));
  amberDot.position.set(6, 28, 10); plant.add(amberDot);
  addLabel(world, { text: 'NUEVO CONFINAMIENTO', sub: 'la respuesta que sigue en obra', position: [14, 31, -77] });


  // Aves: pequeñas siluetas que cruzan el amanecer.
  const birds = new THREE.Group();
  world.root.add(birds);
  for (let i = 0; i < 7; i++) {
    const b = new THREE.Group();
    const wingMat = basic(0x1b2223);
    const w1 = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.08), wingMat);
    const w2 = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.08), wingMat);
    w1.position.x = -0.4; w2.position.x = 0.4;
    b.add(w1, w2);
    b.position.set(-20 + i * 7, 20 + (i % 3) * 3, -55 + (i % 2) * 5);
    b.scale.setScalar(0.6 + i * 0.05);
    b.userData.phase = rr(rng, 0, TAU);
    birds.add(b);
  }

  // Destellos y reflejos de amanecer en el suelo.
  addGlow(world, [-145, 12, -230], 0xffd29c, 130, 0.18);
  addDust(world, { count: 60, center: [-10, 5, -30], spread: [60, 6, 35], sizeMin: 0.03, sizeMax: 0.13, color: 0xe0c8a5, seed: 27 });

  addSmokePlume(world, {
    origin: [58, 48, -95], count: 22, spread: [1, 1, 1],
    sizeMin: 1.5, sizeMax: 4.5, alphaMax: 0.12, color: 0xb9b09f, life: 14, seed: 9
  });

  const views = {
    dawn: { position: [55, 16, 122], target: [-4, 11, -80], fov: 42 },
    plant: { position: [74, 30, 90], target: [0, 14, -73], fov: 40 }
  };
  function setView(id) {
    const v = views[id] || views.dawn;
    flyCamera(new THREE.Vector3(...v.position), new THREE.Vector3(...v.target), v.fov, 1.6);
  }
  function resetView() { setView('dawn'); }

  return {
    root: world.root,
    labels: world.labels,
    pickables: [],
    camera: { position: views.dawn.position, target: views.dawn.target, fov: 42, minDistance: 12, maxDistance: 240, minPolarAngle: 0.1, maxPolarAngle: Math.PI * 0.48 },
    defaultView: 'dawn',
    exposure: 1.06,
    setView,
    resetView,
    setStep() {},
    playSequence() {},
    update(dt, t) {
      world.updaters.forEach((fn) => fn(dt, t));
      birds.children.forEach((b, i) => {
        b.position.x += dt * (1.2 + i * 0.12);
        b.position.y += Math.sin(t * 0.5 + b.userData.phase) * dt * 0.06;
        if (b.position.x > 58) b.position.x = -50;
        const flap = Math.sin(t * 5 + b.userData.phase) * 0.24;
        b.children[0].rotation.z = flap;
        b.children[1].rotation.z = -flap;
      });
      // Deriva atmosférica mínima.
      redDot.material.emissiveIntensity = 1.6 + Math.sin(t * 1.7) * 0.5;
    }
  };
};
