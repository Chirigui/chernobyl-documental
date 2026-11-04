/* ============================================================
   CAPÍTULO 6 · LA NUBE QUE CRUZÓ EUROPA
   Mapa 3D de Europa, detección exterior y dispersión esquemática.
   Los contornos son reales; el penacho es una reconstrucción
   didáctica, no una frontera de contaminación.
   ============================================================ */

SCENE_BUILDERS[6] = function buildChapter6() {
  const world = makeWorld('cap6-mapa');
  const sky = addSky(world, {
    top: 0x05080b, horizon: 0x1d2529, bottom: 0x030405,
    stars: 160
  });
  addFog(world, 0x050708, 0.0022);
  addLighting(world, {
    sky: 0x879b9f, ground: 0x101412, hemi: 0.65,
    sun: 0xbfc7c1, intensity: 1.5, position: [35, 100, 45],
    shadow: false, ambient: 0.14
  });
  addGround(world, { size: 340, texture: 'concrete', repeat: 24, color: 0x191f21, y: -1.2 });

  const centerLon = 23, centerLat = 52.5;
  const sx = 1.78, sz = 2.18;
  const mapGroup = new THREE.Group();
  mapGroup.rotation.x = -Math.PI / 2;
  world.root.add(mapGroup);

  // Plataforma y retícula.
  const base = addBox(world.root, 136, 2.4, 94, -4, -1.0, 0, std(0x111719, { roughness: 0.8, metalness: 0.25 }), { cast: false });
  const plate = addBox(world.root, 131, 0.7, 89, -4, -0.1, 0, std(0x202a2b, { roughness: 0.7, metalness: 0.2 }), { cast: false });
  // Retícula de meridianos y paralelos.
  const gridMat = new THREE.LineBasicMaterial({ color: 0x667573, transparent: true, opacity: 0.15 });
  for (let lon = -10; lon <= 40; lon += 10) {
    const x = (lon - centerLon) * sx;
    addLine(world.root, [new THREE.Vector3(x, 0.02, -45), new THREE.Vector3(x, 0.02, 45)], gridMat);
  }
  for (let lat = 36; lat <= 68; lat += 4) {
    const z = -(lat - centerLat) * sz;
    addLine(world.root, [new THREE.Vector3(-58, 0.02, z), new THREE.Vector3(58, 0.02, z)], gridMat);
  }
  // Mar / fondo.
  const seaMat = new THREE.MeshStandardMaterial({
    color: 0x0b1417, roughness: 0.3, metalness: 0.5, transparent: true, opacity: 0.84
  });
  addBox(world.root, 132, 0.16, 90, -4, -0.62, 0, seaMat, { cast: false });

  const palette = [0x465250, 0x4b5653, 0x3f4b4a, 0x505a56, 0x414e4d, 0x55605b, 0x3c4848];
  const countryMeshes = [];
  const labels = [];

  function toMap(lon, lat, y = 0.72) {
    return new THREE.Vector3((lon - centerLon) * sx, y, -(lat - centerLat) * sz);
  }

  EUROPE_GEO.forEach((country, ci) => {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({
      color: palette[ci % palette.length],
      roughness: 0.78,
      metalness: 0.08,
      emissive: 0x000000,
      emissiveIntensity: 0
    });
    country.polys.forEach((rings) => {
      if (!rings.length) return;
      const shape = new THREE.Shape();
      rings[0].forEach(([lon, lat], i) => {
        const x = (lon - centerLon) * sx;
        const y = (lat - centerLat) * sz;
        if (i === 0) shape.moveTo(x, y); else shape.lineTo(x, y);
      });
      shape.closePath();
      for (let i = 1; i < rings.length; i++) {
        const hole = new THREE.Path();
        rings[i].forEach(([lon, lat], j) => {
          const x = (lon - centerLon) * sx;
          const y = (lat - centerLat) * sz;
          if (j === 0) hole.moveTo(x, y); else hole.lineTo(x, y);
        });
        hole.closePath();
        shape.holes.push(hole);
      }
      const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.55, bevelEnabled: false, curveSegments: 1 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = false;
      mesh.receiveShadow = true;
      mesh.userData.country = country.id;
      group.add(mesh);
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 26), new THREE.LineBasicMaterial({
        color: 0x7d8984, transparent: true, opacity: 0.48
      }));
      group.add(edges);
      countryMeshes.push(mesh);
    });
    mapGroup.add(group);
  });
  mapGroup.updateMatrixWorld(true);

  // Etiquetas de países principales y puntos de referencia.
  const labelDefs = [
    { text: 'RUSIA EUROPEA', sub: 'regiones de Briansk', lon: 37.0, lat: 55.4 },
    { text: 'POLONIA', sub: 'medidas de protección', lon: 19.3, lat: 52.1 },
    { text: 'ALEMANIA', sub: 'trazas medibles', lon: 10.2, lat: 51.1 },
    { text: 'FRANCIA', sub: 'detección exterior', lon: 2.2, lat: 46.6 },
    { text: 'RUMANÍA', sub: 'control alimentario', lon: 24.8, lat: 45.9 }
  ];
  labelDefs.forEach((d) => addLabel(world, { text: d.text, sub: d.sub, position: toMap(d.lon, d.lat, 2.1) }));

  // Pines: Chernóbil y Forsmark.
  function makePin(lon, lat, color, size = 0.32) {
    const pos = toMap(lon, lat, 0.68);
    const g = new THREE.Group();
    g.position.copy(pos);
    const stem = addCylinder(g, 0.035, 0.035, 3.4, 0, 1.8, 0, std(0xdad4c4, { metalness: 0.2, roughness: 0.4 }), { segments: 5, cast: false });
    const glow = addSphere(g, size, 0, 3.6, 0, emissive(color, 2.2), { cast: false });
    const halo = addSphere(g, size * 1.8, 0, 3.6, 0, new THREE.MeshBasicMaterial({
      color, transparent: true, opacity: 0.15, depthWrite: false, blending: THREE.AdditiveBlending
    }), { cast: false });
    world.root.add(g);
    return { group: g, glow, halo, color };
  }
  const chernobylPin = makePin(30.1, 51.39, 0xd04431, 0.38);
  const forsmarkPin = makePin(18.17, 60.37, 0xe0b25d, 0.28);
  addLabel(world, { text: 'CHERNÓBIL', sub: '30.1° E · 51.4° N', position: toMap(30.1, 51.39, 5.2) });
  addLabel(world, { text: 'FORSMAK', sub: 'detección exterior · 27–28 abr', position: toMap(18.17, 60.37, 5.0) });
  // Añadir los pines a la selección.
  countryMeshes.push(chernobylPin.glow, forsmarkPin.glow);

  // Trayectorias esquemáticas del penacho.
  const paths = [
    {
      name: 'norte',
      points: [[30.1, 51.39], [27, 54.3], [22, 56.5], [18.5, 58.8], [18.2, 60.4]],
      color: 0xd7a247
    },
    {
      name: 'centro',
      points: [[30.1, 51.39], [26, 52.2], [21, 52.8], [15, 52.1], [9.5, 50.6], [5.0, 49.0]],
      color: 0xc49144
    },
    {
      name: 'sur',
      points: [[30.1, 51.39], [28, 49.5], [25, 47.6], [21.5, 45.7], [18, 44.0]],
      color: 0x9c743b
    }
  ];
  const curves = [];
  const plumeGroup = new THREE.Group();
  world.root.add(plumeGroup);
  paths.forEach((p) => {
    const pts = p.points.map(([lon, lat], i) => toMap(lon, lat, 2.0 + i * 0.28));
    const curve = new THREE.CatmullRomCurve3(pts);
    curves.push(curve);
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 70, 0.11, 4, false), new THREE.MeshBasicMaterial({
      color: p.color, transparent: true, opacity: 0.25, depthWrite: false, blending: THREE.AdditiveBlending
    }));
    plumeGroup.add(tube);
    const dashed = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(80)),
      new THREE.LineDashedMaterial({ color: p.color, dashSize: 1.2, gapSize: 1.6, transparent: true, opacity: 0.45 })
    );
    dashed.computeLineDistances();
    plumeGroup.add(dashed);
  });
  const plume = createParticleField(world, {
    count: 240, center: [0, 3, 0], spread: [58, 2, 42],
    sizeMin: 0.2, sizeMax: 0.9, alphaMin: 0.08, alphaMax: 0.65,
    color: 0xd7a247, colorVary: 0.03, texture: 'soft', additive: true, seed: 66, renderOrder: 4
  });
  plume.points.visible = false;
  plumeGroup.visible = false;
  const plumeData = [];
  const prng = mulberry32(617);
  for (let i = 0; i < 240; i++) {
    plumeData.push({ curve: i % 5 === 0 ? 2 : (i % 3 === 0 ? 1 : 0), p: prng(), speed: rr(prng, 0.008, 0.03), jitter: rr(prng, -0.8, 0.8) });
  }

  // Línea de detección Chernóbil → Forsmark.
  const detectCurve = new THREE.CatmullRomCurve3([
    toMap(30.1, 51.39, 3.4), toMap(26.4, 55.1, 3.6), toMap(21.9, 58.0, 3.8), toMap(18.2, 60.4, 4.1)
  ]);
  const detectionLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(detectCurve.getPoints(70)),
    new THREE.LineDashedMaterial({ color: 0xe0b25d, dashSize: 1.4, gapSize: 1.2, transparent: true, opacity: 0.55 })
  );
  detectionLine.computeLineDistances();
  world.root.add(detectionLine);
  detectionLine.visible = false;

  // Anillos de pulso en Forsmark.
  const pulses = [];
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(1, 1.1, 48), new THREE.MeshBasicMaterial({
      color: 0xe0b25d, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false,
      blending: THREE.AdditiveBlending
    }));
    ring.rotation.x = -Math.PI / 2;
    ring.position.copy(toMap(18.17, 60.37, 0.85));
    world.root.add(ring);
    pulses.push({ mesh: ring, t: i / 3 });
  }

  // Una nota de método sobre la propia mesa.
  addSign(world.root, ['ESQUEMA DE DISPERSIÓN', 'NO ES UN MAPA DE UMBRALES'], 24, 3.0, -34, 0.18, 38, {
    bg: '#0b1112', color: '#b8ad96', font: '500 42px "IBM Plex Mono", monospace',
    texWidth: 1400, texHeight: 220, rotX: -Math.PI / 2, transparent: false
  });

  // Materiales para hover/selección.
  let hovered = null;
  let selected = null;
  function clearHover() {
    if (!hovered) return;
    const m = hovered.material;
    if (hovered === selected) {
      m.emissive.setHex(0x5d431e); m.emissiveIntensity = 0.6;
    } else {
      m.emissive.setHex(0x000000); m.emissiveIntensity = 0;
    }
    hovered = null;
  }
  function setHover(hit, event) {
    if (hovered && (!hit || hovered !== hit.object)) clearHover();
    if (!hit) { hideMapTooltip(); return; }
    const country = hit.object.userData.country;
    if (!country) { hideMapTooltip(); return; }
    hovered = hit.object;
    const m = hovered.material;
    if (m.emissive) { m.emissive.setHex(0x8a6228); m.emissiveIntensity = 0.45; }
    const info = COUNTRY_INFO[country] || COUNTRY_INFO.default;
    setMapTooltip(`<b>${info.name}</b>CLIC PARA LEER SU FICHA`, event);
  }
  function onPick(hit) {
    const country = hit.object.userData.country;
    if (!country) return;
    if (selected) {
      selected.material.emissive.setHex(0x000000);
      selected.material.emissiveIntensity = 0;
    }
    selected = hit.object;
    selected.material.emissive.setHex(0x5d431e);
    selected.material.emissiveIntensity = 0.65;
    showMapCard(country);
    hideMapTooltip();
  }

  function setView(id) {
    if (id !== 'north') closeMapCard();
    if (id === 'plume') {
      plumeGroup.visible = true;
      plume.points.visible = true;
      detectionLine.visible = false;
      flyCamera(new THREE.Vector3(4, 72, 82), new THREE.Vector3(-10, 0, -6), 45, 1.3);
    } else if (id === 'north') {
      plumeGroup.visible = true;
      plume.points.visible = true;
      detectionLine.visible = true;
      if (selected) { selected.material.emissive.setHex(0); selected.material.emissiveIntensity = 0; }
      const sweden = countryMeshes.find((m) => m.userData.country === 'SWE');
      if (sweden) {
        selected = sweden;
        sweden.material.emissive.setHex(0x6b4a1e);
        sweden.material.emissiveIntensity = 0.7;
      }
      showMapCard('SWE');
      flyCamera(new THREE.Vector3(22, 45, 26), new THREE.Vector3(-8, 0, -17), 44, 1.4);
    } else {
      plumeGroup.visible = false;
      plume.points.visible = false;
      detectionLine.visible = false;
      flyCamera(new THREE.Vector3(0, 92, 118), new THREE.Vector3(-14, 0, -1), 45, 1.35);
    }
  }
  function resetView() { setView('plume'); }

  // Cámara inicial. El panel derecho ocupa una parte de la pantalla;
  // descentramos ligeramente el mapa para que Europa quede a la izquierda.
  setCameraImmediate(new THREE.Vector3(4, 72, 82), new THREE.Vector3(-10, 0, -6), 45);
  updateSequenceUI(0);

  return {
    root: world.root,
    labels: world.labels,
    pickables: countryMeshes,
    camera: { position: [4, 72, 82], target: [-10, 0, -6], fov: 45, minDistance: 40, maxDistance: 200, minPolarAngle: 0.2, maxPolarAngle: 1.25 },
    defaultView: 'plume',
    exposure: 1.14,
    setView,
    resetView,
    setStep() {},
    playSequence() {},
    onHover: setHover,
    onPick,
    update(dt, t) {
      world.updaters.forEach((fn) => fn(dt, t));
      if (plume.points.visible) {
        for (let i = 0; i < plumeData.length; i++) {
          const d = plumeData[i];
          d.p += d.speed * dt;
          if (d.p > 1) d.p -= 1;
          const pos = curves[d.curve].getPoint(d.p);
          plume.positions[i * 3] = pos.x + Math.sin(t * 0.8 + i) * 0.45 + d.jitter * d.p;
          plume.positions[i * 3 + 1] = pos.y + 0.3 + Math.sin(t * 1.1 + i) * 0.25;
          plume.positions[i * 3 + 2] = pos.z + Math.cos(t * 0.7 + i) * 0.45;
          plume.alphas[i] = Math.sin(Math.PI * d.p) * 0.42 + 0.06;
        }
        plume.update();
      }
      pulses.forEach((p, i) => {
        p.t += dt * 0.32;
        if (p.t > 1) p.t -= 1;
        const s = 1 + p.t * 8;
        p.mesh.scale.setScalar(s);
        p.mesh.material.opacity = (1 - p.t) * 0.35;
      });
      chernobylPin.glow.material.emissiveIntensity = 1.8 + Math.sin(t * 2.4) * 1.2;
      forsmarkPin.glow.material.emissiveIntensity = 1.3 + Math.max(0, Math.sin(t * 3.1)) * 1.4;
      chernobylPin.halo.material.opacity = 0.09 + Math.sin(t * 2.4) * 0.04;
      forsmarkPin.halo.material.opacity = 0.07 + Math.sin(t * 3.1) * 0.04;
    }
  };
};
