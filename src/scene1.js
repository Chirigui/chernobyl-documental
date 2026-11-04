/* ============================================================
   CAPÍTULO 1 · EL CONTEXTO
   Complejo de Chernóbil, estanque de refrigeración y Prípiat.
   ============================================================ */

SCENE_BUILDERS[1] = function buildChapter1() {
  const world = makeWorld('cap1-complejo');
  const rng = mulberry32(1986);
  addSky(world, {
    top: 0x102030,
    horizon: 0x8d8b78,
    bottom: 0x0a0d0e,
    stars: 240,
    sun: { position: [-190, 55, -120], color: 0xffd0a0, size: 85, opacity: 0.32 }
  });
  addFog(world, 0x1b2224, 0.0032);
  addLighting(world, {
    sky: 0xa4bdcb,
    ground: 0x25221a,
    hemi: 0.95,
    sun: 0xffd1a1,
    intensity: 2.9,
    position: [-80, 70, 55],
    shadowSizeWorld: 130,
    shadowSize: 2048,
    ambient: 0.16
  });
  addGround(world, { size: 420, texture: 'grass', repeat: 34, color: 0x8b8d78 });
  // Explanada industrial y acceso.
  const apron = addGround(world, { size: 200, texture: 'concrete', repeat: 16, color: 0x9a978d, y: 0.02 });
  apron.position.z = 12;
  apron.scale.z = 0.65;
  addGround(world, { size: 190, texture: 'asphalt', repeat: 20, color: 0x8f8e84, y: 0.04 }).position.set(0, 0.04, 44);

  // Agua del estanque de refrigeración, al sur del complejo.
  const pond = addWater(world, { width: 250, depth: 78, x: 0, z: 84, y: 0.05, color: 0x2a4147, roughness: 0.16, repeat: 28 });
  // Superficie estilizada: reflejo del cielo y ondas finas.
  const waterTex = canvasTex(512, 512, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#6c746d');
    g.addColorStop(0.36, '#3f5558');
    g.addColorStop(1, '#15282e');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    const wr = mulberry32(4021);
    for (let i = 0; i < 160; i++) {
      const y = wr() * h;
      ctx.strokeStyle = `rgba(215,210,190,${0.02 + wr() * 0.08})`;
      ctx.lineWidth = 0.6 + wr() * 1.4;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= w; x += 16) ctx.lineTo(x, y + Math.sin(x * 0.035 + i) * (1 + wr() * 2));
      ctx.stroke();
    }
  }, { repeat: [1, 1], track: true });
  waterTex.repeat.set(10, 3);
  pond.material = new THREE.MeshBasicMaterial({ map: waterTex, transparent: true, opacity: 0.92, fog: true });
  world.updaters.push((dt) => { waterTex.offset.x += dt * 0.002; waterTex.offset.y += dt * 0.0007; });
  // Orillas y canales.
  const bankMat = std(0x555843, { roughness: 1 });
  addBox(world.root, 265, 1.4, 3.5, 0, 0.5, 43, bankMat, { cast: false });
  addBox(world.root, 3, 1.1, 82, -127, 0.45, 85, bankMat, { cast: false });
  addBox(world.root, 3, 1.1, 82, 127, 0.45, 85, bankMat, { cast: false });
  // Reflejos tenues en el agua.
  for (let i = 0; i < 18; i++) {
    addBox(world.root, rr(rng, 1.5, 7), 0.02, 0.14, rr(rng, -105, 105), 0.12, rr(rng, 52, 112), basic(0x7c8071, { transparent: true, opacity: 0.18 }), { cast: false, receive: false });
  }

  const concreteTex = groundTexture('concrete').clone();
  concreteTex.needsUpdate = true; concreteTex.repeat.set(3, 3);
  trackTexture(concreteTex);
  const concrete = new THREE.MeshStandardMaterial({ map: concreteTex, color: 0xa09c90, roughness: 0.92, metalness: 0.02 });
  const concreteDark = std(0x67675f, { roughness: 0.94 });
  const concretePale = std(0x9b988d, { roughness: 0.9 });
  const roofMat = std(0x3d4442, { roughness: 0.82, metalness: 0.18 });
  const metal = std(0x6d7473, { roughness: 0.48, metalness: 0.48 });
  const darkMetal = std(0x2d3231, { roughness: 0.55, metalness: 0.55 });
  const windowMat = basic(0x28363b);
  const warmWindow = basic(0xc9a265);
  const rust = std(0x7a5743, { roughness: 0.9, metalness: 0.18 });

  const plant = new THREE.Group();
  plant.name = 'central';
  world.root.add(plant);

  // Cuatro bloques RBMK alineados. La unidad 4 se destaca al este.
  const unitX = [-48, -16, 16, 48];
  const unitGroups = [];
  unitX.forEach((x, i) => {
    const g = new THREE.Group();
    g.position.x = x;
    plant.add(g);
    unitGroups.push(g);

    // Base y cuerpo principal del reactor.
    addBox(g, 30, 2, 38, 0, 1, -4, concreteDark, { cast: true });
    addBox(g, 24, 28, 32, 0, 15, -4, concrete, { cast: true });
    addBox(g, 25.2, 2.2, 33.2, 0, 29.6, -4, roofMat, { cast: true });
    // Fachada con pilastras verticales.
    const ribMat = i === 3 ? std(0x7d7d72, { roughness: 0.9 }) : concreteDark;
    for (let k = 0; k < 5; k++) {
      addBox(g, 0.7, 23, 0.7, -10 + k * 5, 15.4, 12.2, ribMat, { cast: true });
    }
    // Franja de ventanas altas y lucernarios.
    addBox(g, 20, 2.6, 0.4, 0, 25.4, 12.25, windowMat, { cast: false, receive: false });
    addBox(g, 20, 0.4, 0.5, 0, 23.9, 12.35, metal, { cast: false });
    for (let k = 0; k < 4; k++) {
      addBox(g, 3.3, 0.65, 1.4, -8 + k * 5.3, 31.2, -4, metal, { cast: true });
    }
    // Equipos de cubierta.
    addCylinder(g, 1.6, 1.8, 4.8, 7, 33, -10, darkMetal, { segments: 10 });
    addCylinder(g, 1.2, 1.4, 3.2, -6, 32.4, -1, darkMetal, { segments: 10 });
    addBox(g, 6, 2.5, 4, -7, 32, -8, roofMat, { cast: true });

    // Puertas de servicio y pasarelas.
    addBox(g, 3.8, 4.2, 0.45, 6, 2.4, 12.2, darkMetal, { cast: false });
    addBox(g, 12, 0.35, 2.2, 0, 6.2, 13.4, metal, { cast: false });
    addBox(g, 12, 0.35, 2.2, 0, 20.4, 13.4, metal, { cast: false });
    addBox(g, 0.3, 14.2, 0.3, 8.8, 13.2, 13.3, metal, { cast: false });
    addBox(g, 0.3, 14.2, 0.3, -8.8, 13.2, 13.3, metal, { cast: false });

    // Tuberías que recorren la fachada.
    for (let k = 0; k < 3; k++) {
      addCylinder(g, 0.24, 0.24, 17, -11 + k * 1.1, 11, 12.8, metal, { rotZ: Math.PI / 2, cast: false });
    }
    // Escaleras de emergencia.
    for (let f = 0; f < 5; f++) {
      addBox(g, 2.4, 0.18, 0.8, -12.2, 4 + f * 5.1, 13.1, darkMetal, { cast: false });
    }

    // Identificación del bloque.
    addSign(g, [String(i + 1)], 2.0, 1.5, 0, 17.4, 12.32, {
      bg: '#40423d', color: '#ded6c3', font: '700 230px "Arial"', texWidth: 256, texHeight: 180, transparent: false
    });
    if (i === 3) {
      // La unidad 4, construida en 1983.
      addSign(g, ['4'], 4.2, 3.2, 0, 26.2, 12.31, {
        bg: '#5d1d18', color: '#e5d8c6', font: '700 250px "Arial"', texWidth: 512, texHeight: 512, transparent: false
      });
      const redGlow = new THREE.PointLight(0xc2432e, 1.5, 22, 2);
      redGlow.position.set(8, 30, 12);
      g.add(redGlow);
      const beacon = addSphere(g, 0.3, 8, 32.5, 12, emissive(0xcf3f2c, 3));
      beacon.userData.beacon = true;
    }
  });

  // Sala de turbinas común, delante de los reactores.
  const turbine = new THREE.Group();
  turbine.position.set(0, 0, 25);
  plant.add(turbine);
  addBox(turbine, 126, 13, 25, 0, 6.5, 0, concretePale, { cast: true });
  addBox(turbine, 127, 1.3, 26, 0, 13.4, 0, roofMat, { cast: true });
  addBox(turbine, 126.4, 0.7, 0.5, 0, 11.2, 12.55, darkMetal, { cast: false });
  addSign(turbine, ['ЧЕРНОБЫЛЬ АЭС'], 49, 3.4, 0, 9.0, 12.78, {
    bg: '#5e5c52', color: '#ded7c5', font: '600 92px "Segoe UI", Arial',
    texWidth: 1600, texHeight: 220
  });
  // Lucernarios y estructura del techo.
  for (let k = 0; k < 17; k++) {
    addBox(turbine, 4.6, 0.9, 1.8, -56 + k * 7, 14.3, -2, metal, { cast: true });
    addBox(turbine, 4.6, 0.35, 1.7, -56 + k * 7, 14.9, -2, windowMat, { cast: false, receive: false });
  }
  // Grandes puertas de la sala de turbinas.
  for (let k = 0; k < 4; k++) {
    addBox(turbine, 7.5, 8.2, 0.35, -47 + k * 31, 5.2, 12.68, darkMetal, { cast: false });
    addBox(turbine, 6.4, 0.22, 0.45, -47 + k * 31, 9.4, 12.8, metal, { cast: false });
  }
  // Galería de cables y pasarelas.
  addBox(turbine, 124, 1.1, 2.4, 0, 12.2, 13.8, metal, { cast: false });

  // Chimenea de ventilación del bloque 4, con bandas rojas y blancas.
  const stack = new THREE.Group();
  stack.position.set(64, 0, -17);
  plant.add(stack);
  addCylinder(stack, 2.2, 3.2, 58, 0, 29, 0, concretePale, { segments: 16 });
  for (let k = 0; k < 7; k++) {
    const band = new THREE.Mesh(new THREE.CylinderGeometry(2.65 - k * 0.09, 2.85 - k * 0.09, 2.3, 16), std(k % 2 ? 0xa34636 : 0xc8c1b2, { roughness: 0.75 }));
    band.position.y = 8 + k * 7.1; stack.add(band);
  }
  addCylinder(stack, 1.25, 1.65, 3.4, 0, 58.5, 0, darkMetal, { segments: 12 });
  const stackLight = addSphere(stack, 0.4, 0, 61.1, 0, emissive(0xcf3525, 3));
  const stackPoint = new THREE.PointLight(0xc33828, 1.4, 28, 2);
  stackPoint.position.set(0, 61, 0); stack.add(stackPoint);

  // Tuberías principales al descubierto y colectores.
  const pipeGroup = new THREE.Group();
  pipeGroup.position.set(0, 0, 8);
  plant.add(pipeGroup);
  for (let k = 0; k < 4; k++) {
    addCylinder(pipeGroup, 0.55, 0.55, 116, 0, 4.7 + k * 1.25, 0, metal, { rotZ: Math.PI / 2, segments: 12 });
  }
  for (let k = 0; k < 9; k++) {
    addCylinder(pipeGroup, 0.3, 0.3, 5.5, -56 + k * 14, 7.5, 1.3, darkMetal, { segments: 8 });
    addBox(pipeGroup, 1.2, 1.2, 3.4, -56 + k * 14, 8.7, 2, darkMetal, { cast: true });
  }

  // Subestación transformadora frente a la sala de turbinas.
  const yard = new THREE.Group();
  yard.position.set(-28, 0, 49);
  plant.add(yard);
  const transformerMat = std(0x4d5652, { roughness: 0.7, metalness: 0.35 });
  for (let k = 0; k < 6; k++) {
    const x = -30 + k * 13;
    addBox(yard, 4.5, 4.1, 3.2, x, 2.05, 0, transformerMat, { cast: true });
    addBox(yard, 4.8, 0.35, 3.4, x, 4.25, 0, metal, { cast: false });
    for (let r = 0; r < 3; r++) addCylinder(yard, 0.22, 0.3, 2.5, x - 1 + r, 5.6, 0, concretePale, { segments: 7 });
    // Poste de alta tensión.
    addCylinder(yard, 0.16, 0.22, 13, x + 5.6, 6.5, 0, metal, { segments: 6 });
    addBox(yard, 4.2, 0.18, 0.18, x + 5.6, 12.2, 0, metal, { cast: false });
    addBox(yard, 2.2, 0.16, 0.16, x + 5.6, 11.1, 0, metal, { cast: false });
  }
  // Cables de alta tensión que se pierden en el paisaje.
  const cableMat = new THREE.LineBasicMaterial({ color: 0x383e3d, transparent: true, opacity: 0.45 });
  for (let k = 0; k < 3; k++) {
    const pts = [];
    for (let i = 0; i < 40; i++) {
      const t = i / 39;
      pts.push(new THREE.Vector3(-28 + t * 160, 8 + Math.sin(t * Math.PI) * 2 + k * 0.7, 52 + t * 40));
    }
    addLine(yard, pts, cableMat);
  }

  // Cerca perimetral y torres de vigilancia.
  addFence(world, { length: 160, step: 6, x: 0, z: -36, color: 0x555c56 });
  addFence(world, { length: 120, step: 6, x: -80, z: 4, rot: Math.PI / 2, color: 0x555c56 });
  for (const [x, z] of [[-78, -32], [78, -32], [78, 36]]) {
    const tower = new THREE.Group();
    tower.position.set(x, 0, z);
    addCylinder(tower, 0.16, 0.22, 14, 0, 7, 0, metal, { segments: 6 });
    addBox(tower, 2.4, 1.2, 2.4, 0, 14, 0, darkMetal, { cast: true });
    addSphere(tower, 0.22, 0, 15, 0, emissive(0xc8b273, 1.7));
    plant.add(tower);
  }

  // Pequeños focos industriales.
  for (let k = 0; k < 10; k++) {
    const x = -70 + k * 15;
    addCylinder(world.root, 0.12, 0.15, 8, x, 4, 38, metal, { segments: 6 });
    const lamp = addBox(world.root, 0.7, 0.28, 0.4, x, 8.1, 38, emissive(0xd8b36d, 1.4), { cast: false });
    if (k % 3 === 0) {
      const l = new THREE.PointLight(0xffc77c, 0.55, 16, 2);
      l.position.set(x, 8.2, 38);
      world.root.add(l);
    }
  }

  // Modelo didáctico del RBMK sobre una plataforma de interpretación.
  const teaching = new THREE.Group();
  teaching.position.set(-72, 0, 42);
  teaching.rotation.y = 0.35;
  world.root.add(teaching);
  addBox(teaching, 18, 1.1, 15, 0, 0.55, 0, concreteDark, { cast: true });
  addBox(teaching, 14, 0.12, 11, 0, 1.16, 0, std(0x343b39, { roughness: 0.8 }), { cast: false });
  // Núcleo de grafito, mostrado como un corte.
  const core = new THREE.Group();
  core.position.y = 1.3;
  teaching.add(core);
  addBox(core, 8.4, 0.7, 8.4, 0, 0.35, 0, metal, { cast: true });
  const graphite = std(0x252a28, { roughness: 0.95 });
  for (let ix = 0; ix < 7; ix++) {
    for (let iz = 0; iz < 7; iz++) {
      const h = 5.2 + Math.sin(ix * 0.7 + iz * 1.3) * 0.35;
      addBox(core, 0.8, h, 0.8, -3 + ix, 0.7 + h / 2, -3 + iz, graphite, { cast: false });
    }
  }
  // Canales verticales y barras de control.
  for (let k = 0; k < 6; k++) {
    const x = -2.8 + k * 1.12;
    const rod = addCylinder(core, 0.06, 0.06, 8.3, x, 5.4, 3.62, metal, { segments: 6, cast: false });
    rod.userData.controlRod = true;
    addCylinder(core, 0.18, 0.18, 0.7, x, 9.3, 3.62, emissive(0xb99b55, 0.7), { segments: 8, cast: false });
  }
  // Separadores de vapor y tuberías.
  addCylinder(core, 1.25, 1.25, 7.2, 7.1, 5.2, -1.5, metal, { rotZ: Math.PI / 2, segments: 14 });
  addCylinder(core, 1.25, 1.25, 7.2, 7.1, 5.2, 2.2, metal, { rotZ: Math.PI / 2, segments: 14 });
  for (let k = 0; k < 4; k++) {
    addCylinder(core, 0.18, 0.18, 4.5, 4.6, 3.4 - k * 0.85, -1.5 + k * 1.2, metal, { segments: 7 });
  }
  // Turbina didáctica.
  const turbineModel = new THREE.Group();
  turbineModel.position.set(8, 0, 3.7);
  teaching.add(turbineModel);
  addBox(turbineModel, 5.6, 1.1, 2.3, 0, 1.65, 0, darkMetal, { cast: true });
  addCylinder(turbineModel, 1.0, 1.0, 3.8, 0, 2.7, 0, metal, { rotZ: Math.PI / 2, segments: 14 });
  addSphere(turbineModel, 0.25, 2.4, 3.45, 0, emissive(0xd3a552, 1.4));
  addBox(turbineModel, 2.1, 1.3, 1.8, 3.8, 1.85, 0, std(0x505953, { metalness: 0.3, roughness: 0.5 }), { cast: true });
  addLabel(world, { text: 'MODELO RBMK-1000', sub: 'corte didáctico · no a escala', position: [-72, 16.5, 42], views: ['core'] });
  addLabel(world, { text: 'GRAFITO', sub: 'moderador de neutrones', position: [-78, 8.5, 46], views: ['core'] });
  addLabel(world, { text: 'CANALES DE COMBUSTIBLE', sub: 'agua a presión', position: [-64, 9.2, 47], views: ['core'] });
  addLabel(world, { text: 'SEPARADORES DE VAPOR', sub: 'hacia la turbina', position: [-64.2, 12.2, 39], views: ['core'] });
  // Foco sobre el modelo.
  const modelLight = new THREE.PointLight(0xffc37b, 2.4, 26, 2);
  modelLight.position.set(-70, 18, 43); world.root.add(modelLight);

  // Prípiat, en el horizonte noroeste. Edificios residenciales y noria.
  const city = new THREE.Group();
  city.position.set(-95, 0, -82);
  world.root.add(city);
  const cityMat = std(0x5b625f, { roughness: 0.9 });
  const blocks = [
    [-18, -6, 11, 19, 10], [-4, 2, 9, 13, 8], [11, -8, 12, 24, 11], [27, 4, 10, 16, 9],
    [41, -10, 9, 14, 8], [-31, 9, 8, 11, 7], [58, 8, 12, 18, 9], [77, -3, 9, 12, 7]
  ];
  blocks.forEach(([x, z, w, h, d], idx) => {
    addBox(city, w, h, d, x, h / 2, z, cityMat, { cast: false, receive: true });
    const winMat = basic(0x8b7149);
    const rows = Math.max(3, Math.floor(h / 2.2));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < Math.max(2, Math.floor(w / 2.2)); c++) {
        if ((r * 7 + c * 3 + idx) % 5 === 0) {
          addPlane(city, 0.7, 0.65, x - w / 2 + 1.2 + c * 2.1, 1.5 + r * 2.1, z + d / 2 + 0.02, winMat, { receive: false });
        }
      }
    }
  });
  // Noria de Prípiat, silueta lejana.
  const wheel = new THREE.Group();
  wheel.position.set(-44, 0, -78);
  wheel.scale.setScalar(0.55);
  const wheelMat = std(0x756448, { roughness: 0.7, metalness: 0.3 });
  addTorus(wheel, 4.3, 0.12, 0, 5.1, 0, wheelMat, { rotY: Math.PI / 2, radial: 5, tubular: 30, cast: false });
  for (let i = 0; i < 8; i++) {
    const a = i / 8 * TAU;
    addCylinder(wheel, 0.055, 0.055, 4.2, 0, 5.1, 0, wheelMat, { segments: 4, cast: false }).rotation.set(a, 0, Math.PI / 2);
  }
  addBox(wheel, 0.3, 5.1, 0.3, -3.8, 2.55, 0, wheelMat, { cast: false });
  addBox(wheel, 0.3, 5.1, 0.3, 3.8, 2.55, 0, wheelMat, { cast: false });
  city.add(wheel);

  // Cielo y aves lejanas.
  const smoke = addSmokePlume(world, {
    origin: [64, 59, -17], count: 28, spread: [1.2, 0.5, 1.2],
    sizeMin: 1.4, sizeMax: 4.2, alphaMax: 0.1, color: 0xb5b3a8, life: 16, seed: 17
  });

  addLabel(world, { text: 'UNIDAD 4', sub: 'RBMK-1000 · 1983', position: [48, 37.5, 7] });
  addLabel(world, { text: 'SALA DE TURBINAS', sub: 'generación de electricidad', position: [0, 19, 38] });


  addLabel(world, { text: 'PRÍPIAT', sub: 'a 3 km de la central', position: [-95, 29, -82] });

  const beacons = [];
  world.root.traverse((o) => { if (o.userData.beacon) beacons.push(o); });
  world.updaters.push((dt, t) => {
    beacons.forEach((b, i) => {
      b.material.emissiveIntensity = 1.8 + Math.sin(t * 2.2 + i) * 1.3;
    });
    stackLight.material.emissiveIntensity = 1.6 + Math.sin(t * 1.8) * 1.2;
    stackPoint.intensity = 0.7 + Math.sin(t * 1.8) * 0.55;
    updateFlicker(modelLight, t, 2.2, 0.16, 4.2);
    world.cityLights = city;
  });

  const views = {
    plant: { position: [150, 112, 184], target: [-14, 11, 2], fov: 35 },
    core: { position: [-38, 27, 72], target: [-70, 8, 42], fov: 38 },
    city: { position: [-28, 34, 8], target: [-94, 15, -80], fov: 42 },
    water: { position: [20, 14, 185], target: [-15, 4, 70], fov: 43 }
  };
  function setView(id) {
    const v = views[id] || views.plant;
    if (id === 'city') {
      flyCamera(new THREE.Vector3(...v.position), new THREE.Vector3(...v.target), v.fov, 1.35);
    } else {
      flyCamera(new THREE.Vector3(...v.position), new THREE.Vector3(...v.target), v.fov, 1.25);
    }
  }
  function resetView() { setView('plant'); }

  return {
    root: world.root,
    labels: world.labels,
    pickables: [],
    camera: { position: views.plant.position, target: views.plant.target, fov: 35, minDistance: 18, maxDistance: 300, maxPolarAngle: Math.PI * 0.495 },
    defaultView: 'plant',
    exposure: 1.13,
    setView,
    resetView,
    setStep() {},
    playSequence() {},
    update(dt, t) {
      world.updaters.forEach((fn) => fn(dt, t));
    }
  };
};
