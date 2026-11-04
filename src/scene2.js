/* ============================================================
   CAPÍTULO 2 · LA NOCHE DEL ACCIDENTE
   Sala de control del bloque 4: paneles, operadores, telemetría
   y secuencia de la prueba de seguridad.
   ============================================================ */

SCENE_BUILDERS[2] = function buildChapter2() {
  const world = makeWorld('cap2-sala-control');
  addSky(world, { top: 0x030405, horizon: 0x090a0a, bottom: 0x020303, radius: 80 });
  addLighting(world, {
    sky: 0x2a3432, ground: 0x0c0c0a, hemi: 0.34,
    sun: 0xf0d2a0, intensity: 0.35, position: [0, 20, 8],
    shadow: false, ambient: 0.08
  });
  addFog(world, 0x050707, 0.006);

  const room = new THREE.Group();
  world.root.add(room);
  const W = 30, D = 22, H = 10.5;

  // Suelo técnico: baldosas oscuras con juntas.
  const floorTex = canvasTex(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#232724'; ctx.fillRect(0, 0, w, h);
    const s = 64;
    for (let y = 0; y < h; y += s) for (let x = 0; x < w; x += s) {
      ctx.fillStyle = ((x / s + y / s) % 2) ? '#1e2220' : '#282c27';
      ctx.fillRect(x + 1, y + 1, s - 2, s - 2);
      ctx.fillStyle = 'rgba(255,255,255,.015)';
      ctx.fillRect(x + 2, y + 2, s - 4, 1);
    }
    ctx.strokeStyle = 'rgba(0,0,0,.36)'; ctx.lineWidth = 2;
    for (let y = 0; y < h; y += s) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    for (let x = 0; x < w; x += s) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  }, { repeat: [8, 6], track: true });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({
    map: floorTex, roughness: 0.82, metalness: 0.06
  }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = 0.01; floor.receiveShadow = true;
  room.add(floor);

  // Muros: panel verde industrial abajo, hormigón arriba.
  const wallLower = std(0x303733, { roughness: 0.86, metalness: 0.05 });
  const wallUpper = std(0x68685e, { roughness: 0.93 });
  const wallDark = std(0x242a27, { roughness: 0.9 });
  const ceilingMat = std(0x3d423d, { roughness: 0.92 });
  const metal = std(0x555e5a, { roughness: 0.52, metalness: 0.45 });
  const blackMetal = std(0x1b201e, { roughness: 0.62, metalness: 0.35 });
  const beige = std(0xa7a08d, { roughness: 0.8 });

  // Pared trasera.
  addBox(room, W, 4.2, 0.5, 0, 2.1, -D / 2, wallLower, { cast: false });
  addBox(room, W, H - 4.2, 0.5, 0, 4.2 + (H - 4.2) / 2, -D / 2, wallUpper, { cast: false });
  // Paredes laterales.
  [-W / 2, W / 2].forEach((x) => {
    addBox(room, 0.5, 4.2, D, x, 2.1, 0, wallLower, { cast: false });
    addBox(room, 0.5, H - 4.2, D, x, 4.2 + (H - 4.2) / 2, 0, wallUpper, { cast: false });
    // Pilastras y costillas.
    for (let z = -9; z <= 9; z += 4.5) addBox(room, 0.25, H, 0.35, x + (x < 0 ? 0.26 : -0.26), H / 2, z, wallDark, { cast: false });
  });
  // Techo con vigas y casetones.
  addBox(room, W, 0.35, D, 0, H, 0, ceilingMat, { cast: false });
  for (let z = -9; z <= 9; z += 3) {
    addBox(room, W - 1, 0.12, 0.2, 0, H - 0.24, z, metal, { cast: false });
  }
  for (let x = -12; x <= 12; x += 4) {
    addBox(room, 0.45, 0.6, D, x, H - 0.35, 0, metal, { cast: false });
  }
  // Paneles acústicos del techo, con marco visible.
  for (let z = -7; z <= 7; z += 4.5) {
    for (let x = -11; x <= 11; x += 5.5) {
      addBox(room, 3.8, 0.16, 1.7, x, H - 0.5, z, blackMetal, { cast: false });
      addBox(room, 3.15, 0.05, 1.15, x, H - 0.6, z, emissive(0xd9e2d0, 0.22), { cast: false, receive: false });
    }
  }

  // Iluminación práctica: luminarias y focos de techo.
  for (let i = 0; i < 5; i++) {
    const p = new THREE.PointLight(0xe4ebd9, 2.0, 18, 2);
    p.position.set(-10 + i * 5, 8.5, -3 + (i % 2) * 5);
    room.add(p);
  }
  const warmFill = new THREE.PointLight(0xe7c88e, 1.15, 17, 2);
  warmFill.position.set(0, 4.2, 4); room.add(warmFill);
  const deskFill = new THREE.PointLight(0xffd7a0, 1.3, 9, 2);
  deskFill.position.set(0, 4.2, 3.2); room.add(deskFill);
  const boardFill = new THREE.PointLight(0xb8c9aa, 0.55, 12, 2);
  boardFill.position.set(0, 7, -6); room.add(boardFill);

  // Panel mural sinóptico del reactor, al fondo.
  const boardW = 16, boardH = 6.2;
  const boardTex = canvasTex(1400, 620, (ctx, w, h) => {
    ctx.fillStyle = '#0b1210'; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(198,210,184,.16)'; ctx.lineWidth = 2;
    for (let x = 0; x < w; x += 35) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += 35) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(215,162,71,.65)'; ctx.lineWidth = 3;
    ctx.strokeRect(78, 80, 520, 420);
    ctx.strokeStyle = 'rgba(190,205,180,.45)'; ctx.lineWidth = 1;
    for (let x = 110; x <= 566; x += 28) { ctx.beginPath(); ctx.moveTo(x, 80); ctx.lineTo(x, 500); ctx.stroke(); }
    for (let y = 110; y <= 470; y += 30) { ctx.beginPath(); ctx.moveTo(78, y); ctx.lineTo(598, y); ctx.stroke(); }
    ctx.fillStyle = 'rgba(215,162,71,.9)';
    for (let i = 0; i < 18; i++) {
      const x = 95 + (i % 9) * 58, y = 100 + Math.floor(i / 9) * 190;
      ctx.fillRect(x, y, 5, 30);
    }
    ctx.fillStyle = '#b9c4b3'; ctx.font = '24px "Segoe UI", Arial'; ctx.letterSpacing = '3px';
    ctx.fillText('РЕАКТОР 4 · КАНАЛЫ', 78, 45);
    ctx.fillStyle = '#7b8776'; ctx.font = '18px "Segoe UI", Arial';
    ctx.fillText('ТЕПЛОНОСИТЕЛЬ / ПАР', 660, 130);
    // Diagrama de lazo.
    ctx.strokeStyle = 'rgba(215,162,71,.55)'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(660, 180); ctx.lineTo(940, 180); ctx.lineTo(940, 440); ctx.lineTo(660, 440); ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(760, 180); ctx.lineTo(760, 440); ctx.moveTo(850, 180); ctx.lineTo(850, 440); ctx.stroke();
    ctx.fillStyle = '#7b8776'; ctx.font = '16px "Segoe UI", Arial';
    ctx.fillText('НАСОСЫ', 680, 330); ctx.fillText('СЕПАРАТОРЫ', 790, 330); ctx.fillText('ТУРБИНА', 982, 330);
    ctx.strokeStyle = '#5b6b5e'; ctx.lineWidth = 2;
    ctx.strokeRect(70, 545, 1250, 45);
    ctx.fillStyle = '#9dab95'; ctx.font = '18px "Segoe UI", Arial';
    ctx.fillText('СИСТЕМА УПРАВЛЕНИЯ И ЗАЩИТЫ  ·  РБМК-1000', 86, 575);
    ctx.fillStyle = '#b33a2e'; ctx.beginPath(); ctx.arc(1290, 68, 8, 0, TAU); ctx.fill();
    ctx.fillStyle = '#d7a247'; ctx.font = '14px "IBM Plex Mono", monospace';
    ctx.fillText('01:23', 1220, 73);
  }, { repeat: [1, 1], wrap: THREE.ClampToEdgeWrapping, track: true });
  const board = addPlane(room, boardW, boardH, 0, 6.5, -D / 2 + 0.28, new THREE.MeshBasicMaterial({
    map: boardTex, toneMapped: false
  }), { receive: false });
  addBox(room, boardW + 0.5, boardH + 0.5, 0.28, 0, 6.5, -D / 2 + 0.12, blackMetal, { cast: false });
  // Recolocar el panel ligeramente por delante del marco.
  board.position.z = -D / 2 + 0.29;
  addBox(room, 0.18, 3.3, 0.28, -W / 2 + 3.6, 3.2, -D / 2 + 0.4, metal, { cast: false });

  // Banco de 15 barras de control, visible tras el puesto central.
  const rodBank = new THREE.Group();
  rodBank.position.set(-5.3, 4.3, -8.9);
  room.add(rodBank);
  addBox(rodBank, 6.2, 0.45, 0.8, 0, -1.3, 0, blackMetal, { cast: false });
  addBox(rodBank, 6.2, 0.3, 0.8, 0, 2.55, 0, blackMetal, { cast: false });
  const rodMeshes = [];
  const rodMat = std(0x7b857d, { metalness: 0.5, roughness: 0.35 });
  for (let i = 0; i < 15; i++) {
    const x = -2.8 + i * 0.4;
    const rod = addCylinder(rodBank, 0.055, 0.055, 3.2, x, 0.65, 0, rodMat, { segments: 6, cast: false });
    rodMeshes.push(rod);
    const cap = addBox(rodBank, 0.15, 0.12, 0.15, x, 2.25, 0, i < 8 ? emissive(0xd7a247, 1.4) : std(0x3e4540), { cast: false });
    rod.userData.cap = cap;
  }
  addLabel(world, { text: 'BARRAS DE CONTROL', sub: 'margen operativo · 15 mínimo', position: [-5.3, 10.2, -8.8] });

  // Puesto central de control.
  const desk = new THREE.Group();
  desk.position.set(-1.2, 0, 1.5);
  room.add(desk);
  addBox(desk, 12.4, 1.1, 4.4, 0, 0.55, 0, blackMetal, { cast: true });
  addBox(desk, 13.1, 0.28, 4.8, 0, 1.16, 0, beige, { cast: true });
  // Paneles inclinados con textura de instrumentos.
  const panelTex = canvasTex(1400, 600, (ctx, w, h) => {
    ctx.fillStyle = '#b0a994'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#252a26'; ctx.fillRect(10, 10, w - 20, h - 20);
    ctx.strokeStyle = 'rgba(235,232,215,.25)'; ctx.lineWidth = 2;
    for (let x = 20; x < w; x += 70) { ctx.beginPath(); ctx.moveTo(x, 10); ctx.lineTo(x, h - 10); ctx.stroke(); }
    for (let y = 20; y < h; y += 70) { ctx.beginPath(); ctx.moveTo(10, y); ctx.lineTo(w - 10, y); ctx.stroke(); }
    const rrng = mulberry32(412);
    for (let i = 0; i < 46; i++) {
      const x = 40 + rrng() * (w - 80), y = 40 + rrng() * (h - 80);
      const type = rrng();
      if (type < 0.5) {
        ctx.strokeStyle = 'rgba(218,215,194,.55)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(x, y, 18, 0, TAU); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(rrng() * TAU) * 14, y + Math.sin(rrng() * TAU) * 14); ctx.stroke();
      } else {
        ctx.fillStyle = rrng() > 0.7 ? '#b23a2c' : '#b99c5b';
        ctx.beginPath(); ctx.arc(x, y, 4.5, 0, TAU); ctx.fill();
      }
      ctx.fillStyle = 'rgba(220,215,195,.42)'; ctx.font = '11px "IBM Plex Mono", monospace';
      ctx.fillText(['МОЩНОСТЬ', 'ДАВЛЕНИЕ', 'УРОВЕНЬ', 'РАСХОД', 'ТУРБИНА'][i % 5], x - 20, y + 37);
    }
    ctx.fillStyle = 'rgba(215,162,71,.9)'; ctx.font = '700 44px "Arial", "Segoe UI"';
    ctx.fillText('АЗ-5', w - 220, h - 45);
    ctx.strokeStyle = 'rgba(215,162,71,.5)'; ctx.lineWidth = 5;
    ctx.strokeRect(w - 248, h - 100, 190, 75);
  }, { repeat: [1, 1], wrap: THREE.ClampToEdgeWrapping, track: true });
  const panelMat = new THREE.MeshBasicMaterial({ map: panelTex, toneMapped: false });
  addBox(desk, 12.2, 0.16, 2.8, 0, 1.38, 0.4, new THREE.MeshStandardMaterial({
    map: panelTex, roughness: 0.55, metalness: 0.12
  }), { rotX: -0.26, cast: false });
  // Pequeños controles 3D sobre el panel.
  const btnGeo = new THREE.BoxGeometry(0.12, 0.06, 0.12);
  const buttons = new THREE.Group();
  desk.add(buttons);
  for (let i = 0; i < 24; i++) {
    const b = new THREE.Mesh(btnGeo, i % 7 === 0 ? emissive(0xba392c, 1.3) : i % 5 === 0 ? emissive(0xd7a247, 1.2) : std(0x454c48));
    b.position.set(-5.4 + (i % 12) * 0.95, 1.28 + Math.sin(i) * 0.01, -0.55 + Math.floor(i / 12) * 1.15);
    b.castShadow = false;
    buttons.add(b);
  }
  for (let i = 0; i < 6; i++) {
    addCylinder(desk, 0.15, 0.17, 0.2, -3.8 + i * 1.5, 1.33, 1.3, metal, { segments: 10, cast: false });
  }
  // Botón AZ-5 con protección.
  const az5 = new THREE.Group();
  az5.position.set(4.3, 1.37, 1.1);
  desk.add(az5);
  addBox(az5, 0.72, 0.15, 0.62, 0, 0, 0, std(0x232724), { cast: false });
  const az5button = addCylinder(az5, 0.2, 0.22, 0.14, 0, 0.14, 0, emissive(0xc23a28, 2.2), { segments: 12 });
  addBox(az5, 0.82, 0.3, 0.06, 0, 0.28, -0.26, glassMat(0x80908a, 0.2), { cast: false });
  addLabel(world, { text: 'AZ-5', sub: 'parada de emergencia', position: [3.1, 2.9, 2.7] });

  // Sillas y operadores.
  function chair(x, z, rot) {
    const g = new THREE.Group();
    g.position.set(x, 0, z); g.rotation.y = rot;
    addCylinder(g, 0.13, 0.2, 0.5, 0, 0.3, 0, metal, { segments: 6 });
    addBox(g, 0.75, 0.16, 0.7, 0, 0.62, 0, std(0x2b302c));
    addBox(g, 0.72, 0.72, 0.12, 0, 1.03, -0.32, std(0x2b302c));
    addBox(g, 0.08, 0.3, 0.55, 0, 0.75, 0, metal, { cast: false });
    desk.add(g);
    return g;
  }
  chair(-2.8, 3.5, 0.1);
  chair(0.9, 3.6, -0.05);
  chair(3.4, 3.35, -0.14);
  const op1 = makeFigure({ coat: 0xc1bca9, pants: 0x333632, accent: 0x7b7564, skin: 0xa57e63, noHelmet: true, noTank: true, noVest: true, scale: 1.0 });
  op1.position.set(-2.8, 0, 4.4); op1.rotation.y = Math.PI; room.add(op1);
  const op2 = makeFigure({ coat: 0xb9b4a1, pants: 0x2f3330, accent: 0x756f5e, skin: 0x9d7459, noHelmet: true, noTank: true, noVest: true, scale: 0.99 });
  op2.position.set(1.0, 0, 4.35); op2.rotation.y = Math.PI + 0.1; room.add(op2);
  const op3 = makeFigure({ coat: 0x8d9388, pants: 0x292d29, accent: 0x625c4d, skin: 0x9b745b, noHelmet: true, noTank: true, noVest: true, scale: 1.02 });
  op3.position.set(4.4, 0, 3.4); op3.rotation.y = -1.0; room.add(op3);
  const chief = makeFigure({ coat: 0x5c625a, pants: 0x2b2e2a, accent: 0x8f6c35, skin: 0xa27b62, noHelmet: true, noTank: true, noVest: true, scale: 1.04 });
  chief.position.set(-5.4, 0, -1.0); chief.rotation.y = 0.25; room.add(chief);
  addLabel(world, { text: 'JEFE DE TURNO', sub: 'puesto de supervisión', position: [-5.4, 2.8, -0.6] });

  // Consolas laterales.
  [-11.5, 11.5].forEach((x, side) => {
    const sideDesk = new THREE.Group();
    sideDesk.position.set(x, 0, -1.5); sideDesk.rotation.y = side < 0 ? 0.35 : -0.35;
    room.add(sideDesk);
    addBox(sideDesk, 3.2, 1.05, 6.6, 0, 0.55, 0, blackMetal, { cast: true });
    addBox(sideDesk, 3.35, 0.18, 6.8, 0, 1.15, 0, beige, { cast: false });
    addBox(sideDesk, 2.5, 0.1, 5.4, 0, 1.26, 0, new THREE.MeshBasicMaterial({ map: panelTex, toneMapped: false }), { rotX: -0.1, cast: false });
  });

  // Indicador analógico de potencia.
  const gauge = new THREE.Group();
  gauge.position.set(9.5, 5.9, -D / 2 + 0.32);
  room.add(gauge);
  addCylinder(gauge, 1.15, 1.15, 0.25, 0, 0, 0, blackMetal, { rotX: Math.PI / 2, segments: 24, cast: false });
  const gaugeFace = canvasTex(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#d6cfba'; ctx.beginPath(); ctx.arc(w / 2, h / 2, 240, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#222723'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(w / 2, h / 2, 225, 0, TAU); ctx.stroke();
    for (let i = 0; i < 45; i++) {
      const a = -Math.PI * 0.78 + (i / 44) * Math.PI * 1.56;
      const r1 = 185, r2 = i % 5 === 0 ? 140 : 162;
      ctx.strokeStyle = i > 32 ? '#a83227' : '#2b302b'; ctx.lineWidth = i % 5 === 0 ? 5 : 2;
      ctx.beginPath(); ctx.moveTo(w / 2 + Math.cos(a) * r1, h / 2 + Math.sin(a) * r1);
      ctx.lineTo(w / 2 + Math.cos(a) * r2, h / 2 + Math.sin(a) * r2); ctx.stroke();
    }
    ctx.fillStyle = '#262b26'; ctx.font = '700 58px "Arial"'; ctx.textAlign = 'center';
    ctx.fillText('MW', w / 2, h / 2 + 100);
    ctx.font = '24px "Segoe UI"'; ctx.fillText('МОЩНОСТЬ', w / 2, h / 2 + 140);
  }, { repeat: [1, 1], wrap: THREE.ClampToEdgeWrapping, track: true });
  addPlane(gauge, 2.1, 2.1, 0, 0, 0.15, new THREE.MeshBasicMaterial({ map: gaugeFace, toneMapped: false }), { receive: false });
  const needle = new THREE.Group();
  needle.position.z = 0.2;
  gauge.add(needle);
  const needleMesh = addBox(needle, 0.07, 1.35, 0.04, 0, 0.55, 0, std(0x2a2019, { roughness: 0.4 }), { cast: false });
  needleMesh.geometry.translate(0, 0.15, 0);
  addCylinder(needle, 0.12, 0.12, 0.1, 0, 0, 0, emissive(0x9c392b, 1.2), { rotX: Math.PI / 2, segments: 12, cast: false });
  addLabel(world, { text: 'POTENCIA TÉRMICA', sub: 'MWt · indicador analógico', position: [9.5, 8.2, -8.8] });

  // Reloj de pared.
  const clock = new THREE.Group();
  clock.position.set(-9.1, 7.6, -D / 2 + 0.3);
  room.add(clock);
  addCylinder(clock, 0.85, 0.85, 0.18, 0, 0, 0, blackMetal, { rotX: Math.PI / 2, segments: 24, cast: false });
  const clockFace = canvasTex(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#d9d2bf'; ctx.beginPath(); ctx.arc(w / 2, h / 2, 236, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#262b26'; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(w / 2, h / 2, 220, 0, TAU); ctx.stroke();
    ctx.fillStyle = '#262b26'; ctx.textAlign = 'center'; ctx.font = '700 38px "Segoe UI"';
    for (let i = 1; i <= 12; i++) {
      const a = -Math.PI / 2 + i / 12 * TAU;
      ctx.fillText(String(i), w / 2 + Math.cos(a) * 175, h / 2 + Math.sin(a) * 175 + 12);
    }
    ctx.strokeStyle = '#a63429'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(w / 2, h / 2); ctx.lineTo(w / 2 + 55, h / 2 - 145); ctx.stroke();
    ctx.strokeStyle = '#262b26'; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(w / 2, h / 2); ctx.lineTo(w / 2 - 115, h / 2 - 55); ctx.stroke();
  }, { repeat: [1, 1], wrap: THREE.ClampToEdgeWrapping, track: true });
  addPlane(clock, 1.5, 1.5, 0, 0, 0.12, new THREE.MeshBasicMaterial({ map: clockFace, toneMapped: false }), { receive: false });

  // Pantalla de telemetría dinámica.
  const displayCanvas = document.createElement('canvas');
  displayCanvas.width = 800; displayCanvas.height = 460;
  const displayCtx = displayCanvas.getContext('2d');
  const displayTex = new THREE.CanvasTexture(displayCanvas);
  displayTex.colorSpace = THREE.SRGBColorSpace;
  displayTex.needsUpdate = true;
  trackTexture(displayTex);
  const display = new THREE.Group();
  display.position.set(6.6, 3.5, -D / 2 + 0.4);
  room.add(display);
  addBox(display, 4.9, 2.95, 0.3, 0, 0, 0, blackMetal, { cast: false });
  addPlane(display, 4.5, 2.55, 0, 0, 0.17, new THREE.MeshBasicMaterial({ map: displayTex, toneMapped: false }), { receive: false });
  const displayLight = new THREE.PointLight(0xd7a247, 0.25, 6, 2);
  displayLight.position.set(0, 0, 1); display.add(displayLight);

  function drawDisplay(step) {
    const ctx = displayCtx, w = 800, h = 460;
    ctx.fillStyle = '#0a0f0c'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(215,162,71,.08)';
    for (let y = 0; y < h; y += 6) ctx.fillRect(0, y, w, 1);
    ctx.fillStyle = '#d7a247'; ctx.font = '24px "IBM Plex Mono", monospace';
    ctx.fillText('БЛОК 4 · СИСТЕМА КОНТРОЛЯ', 34, 46);
    ctx.fillStyle = '#7e8b79'; ctx.font = '17px "IBM Plex Mono", monospace';
    ctx.fillText('26.04.1986', 34, 78);
    const data = [
      { time: '00:28', power: '30', orm: '—', state: 'НЕУСТОЙЧИВО', color: '#d7a247' },
      { time: '01:00', power: '200', orm: '8 / 15', state: 'НИЗКИЙ ЗАПАС', color: '#d7a247' },
      { time: '01:19', power: '200', orm: '8 / 15', state: 'НЕСТАБИЛЬНО', color: '#c34532' },
      { time: '01:23:04', power: '200', orm: '8 / 15', state: 'ИСПЫТАНИЕ', color: '#c34532' },
      { time: '01:23:40', power: '↑', orm: '8 / 15', state: 'АЗ-5', color: '#d65a42' },
      { time: '01:23:43', power: '> 530', orm: '—', state: 'АВАРИЯ', color: '#e4624a' }
    ];
    const d = data[clamp(step, 0, data.length - 1)];
    ctx.fillStyle = '#7e8b79'; ctx.font = '18px "IBM Plex Mono", monospace';
    ctx.fillText('ВРЕМЯ', 34, 130); ctx.fillText('МОЩНОСТЬ, MWt', 272, 130); ctx.fillText('ОРМ', 580, 130);
    ctx.fillStyle = '#e6dfcd'; ctx.font = '42px "IBM Plex Mono", monospace';
    ctx.fillText(d.time, 34, 180); ctx.fillText(d.power, 272, 180); ctx.fillText(d.orm, 580, 180);
    ctx.strokeStyle = 'rgba(215,162,71,.25)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(34, 208); ctx.lineTo(766, 208); ctx.stroke();
    ctx.fillStyle = d.color; ctx.font = '30px "IBM Plex Mono", monospace';
    ctx.fillText(d.state, 34, 263);
    ctx.fillStyle = '#7e8b79'; ctx.font = '16px "IBM Plex Mono", monospace';
    ctx.fillText('ГЛАВНЫЙ ЩИТ УПРАВЛЕНИЯ · БЛОК 4', 34, 422);
    ctx.fillStyle = '#b33a2e'; ctx.fillRect(34, 360, 732, 5);
    for (let i = 0; i < 26; i++) {
      ctx.fillStyle = i < 8 ? '#d7a247' : '#3b443b';
      ctx.fillRect(34 + i * 28, 310, 18, 30);
    }
    displayTex.needsUpdate = true;
  }

  // Cables, papeles y detalles.
  addBox(desk, 0.5, 0.02, 0.36, -1.2, 1.37, 2.0, std(0xd8d0bb), { cast: false });
  addBox(desk, 0.34, 0.02, 0.5, 0.4, 1.37, 2.15, std(0xc7bda7), { cast: false });
  addCylinder(desk, 0.08, 0.07, 0.16, 2.2, 1.4, 2.0, std(0xe2d9c3), { segments: 10, cast: false });
  const cableMat = new THREE.LineBasicMaterial({ color: 0x151a17, transparent: true, opacity: 0.7 });
  for (let i = 0; i < 8; i++) {
    const pts = [];
    for (let k = 0; k < 10; k++) {
      pts.push(new THREE.Vector3(-8 + i * 2.2, 0.18 + Math.sin(k * 0.4 + i) * 0.05, 3.8 + k * 0.17));
    }
    addLine(room, pts, cableMat);
  }

  // Polvo suspendido.
  addDust(world, { count: 76, center: [0, 5, -1], spread: [12, 4.5, 7], sizeMin: 0.02, sizeMax: 0.1, color: 0xe2d8be, seed: 31 });
  addLabel(world, { text: 'PANEL SINÓPTICO', sub: 'estado del reactor', position: [0, 10.1, -8.7] });

  // Animación por pasos.
  let step = 3;
  let playing = false;
  let stageTime = 0;
  let seqTick = performance.now();
  const stageDurations = [2.2, 1.8, 2.7, 2.1, 2.2, 2.4];
  let needleTarget = -0.8;
  let rodTargets = Array(15).fill(0);
  let alarmTarget = 0;
  function applyStep(index, silent) {
    step = clamp(index, 0, 5);
    stageTime = 0;
    seqTick = performance.now();
    const cfg = [
      { needle: -0.2, inserted: 15, alarm: 0 },
      { needle: -0.08, inserted: 15, alarm: 0 },
      { needle: -0.55, inserted: 15, alarm: 0.1 },
      { needle: -0.48, inserted: 8, alarm: 0.15 },
      { needle: -0.2, inserted: 8, alarm: 0.55 },
      { needle: 0.95, inserted: 8, alarm: 1.2 }
    ][step];
    needleTarget = cfg.needle;
    rodTargets = Array.from({ length: 15 }, (_, i) => i < cfg.inserted ? 0 : 2.0);
    alarmTarget = cfg.alarm;
    drawDisplay(step);
    if (!silent) updateSequenceUI(step);
  }
  function setStep(index, instant) {
    playing = false;
    applyStep(index, false);
    if (instant) {
      needle.rotation.z = needleTarget;
      rodMeshes.forEach((r, i) => { r.position.y = 0.65 + rodTargets[i]; });
    }
  }
  function playSequence() {
    playing = true;
    stageTime = 0;
    seqTick = performance.now();
    applyStep(0, false);
  }
  drawDisplay(step);
  needle.rotation.z = -0.48;
  rodMeshes.forEach((r, i) => { r.position.y = 0.65 + (i < 8 ? 0 : 2.0); });

  // Pequeño parpadeo del piloto de alarma.
  const alarmLight = new THREE.PointLight(0xd84b34, 0, 8, 2);
  alarmLight.position.set(-5.3, 9.2, -7.2); room.add(alarmLight);
  const alarmBulb = addSphere(room, 0.13, -5.3, 9.2, -7.8, emissive(0x9b2d22, 0.4), { cast: false });
  addLabel(world, { text: 'ALARMA', sub: 'señal de emergencia', position: [-5.3, 11.2, -7.8] });

  const views = {
    room: { position: [0, 4.2, 16.8], target: [-1, 2.8, -3], fov: 55 },
    desk: { position: [3.8, 3.25, 8.6], target: [0.5, 2.2, 1.3], fov: 52 },
    core: { position: [-1.8, 5.4, 7.6], target: [-3.6, 5.8, -8.2], fov: 47 }
  };
  function setView(id) {
    const v = views[id] || views.room;
    flyCamera(new THREE.Vector3(...v.position), new THREE.Vector3(...v.target), v.fov, 1.15);
  }
  function resetView() { setView('room'); }

  return {
    root: world.root,
    labels: world.labels,
    pickables: [],
    camera: { position: views.room.position, target: views.room.target, fov: 55, minDistance: 3.6, maxDistance: 23, minPolarAngle: 0.58, maxPolarAngle: Math.PI * 0.48 },
    defaultView: 'room',
    exposure: 1.18,
    setView,
    resetView,
    setStep,
    playSequence,
    update(dt, t) {
      world.updaters.forEach((fn) => fn(dt, t));
      needle.rotation.z = lerp(needle.rotation.z, needleTarget, 0.08);
      rodMeshes.forEach((r, i) => {
        r.position.y = lerp(r.position.y, 0.65 + rodTargets[i], 0.075);
        if (r.userData.cap) r.userData.cap.position.y = r.position.y - 0.65 + 2.25;
      });
      const flicker = 0.7 + Math.sin(t * 7.4) * 0.15 + Math.sin(t * 17.1) * 0.06;
      alarmLight.intensity = alarmTarget * flicker * 3.2;
      alarmBulb.material.emissiveIntensity = 0.4 + alarmTarget * flicker * 2.8;
      displayLight.intensity = 0.22 + Math.sin(t * 1.3) * 0.03;
      warmFill.intensity = 0.7 + Math.sin(t * 0.8) * 0.04;
      const nowMs = performance.now();
      const seqDt = Math.min(1.0, Math.max(0, (nowMs - seqTick) / 1000));
      seqTick = nowMs;
      if (playing) {
        stageTime += seqDt;
        if (stageTime > stageDurations[step]) {
          if (step < 5) {
            applyStep(step + 1, false);
          } else {
            playing = false;
            STATE.sequencePlaying = false;
          }
        }
      }
    }
  };
};
