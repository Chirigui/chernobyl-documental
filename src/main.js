/* ============================================================
   ARRANQUE
   1. Comprueba WebGL.
   2. Carga Three.js y OrbitControls desde CDN con import map.
   3. Construye la primera escena detrás de la portada.
   4. Habilita el botón de entrada.
   ============================================================ */

(function () {
  let bootStarted = false;

  async function boot() {
    if (bootStarted) return;
    bootStarted = true;
    if (!webglAvailable()) {
      showFallback('Tu navegador no tiene WebGL disponible. La experiencia 3D no puede iniciarse.');
      return;
    }
    try {
      const threeModule = await import('three');
      THREE = threeModule;
      const orbitModule = await import('three/addons/controls/OrbitControls.js');
      OrbitControls = orbitModule.OrbitControls;
      if (!THREE || !OrbitControls) throw new Error('No se pudieron cargar los módulos 3D.');

      setupThree();
      initUI();
      // Preconstruye el capítulo 1 detrás de la portada para evitar un salto negro.
      await goToChapter(0, { silent: true, force: true });
      setBootReady();
      window.__CHERNOBYL_READY__ = true;
      document.body.dataset.ready = 'true';
      console.info('%cCHERNÓBIL · experiencia 3D lista', 'color:#d7a247;font-weight:bold');
    } catch (err) {
      console.error('No se pudo iniciar la experiencia:', err);
      STATE.bootError = err;
      const errorBox = $('#start-error');
      if (errorBox) {
        errorBox.hidden = false;
        errorBox.querySelector('button')?.addEventListener('click', () => showFallback('No se pudo cargar el motor 3D.'));
      }
      const enter = $('#enter-btn');
      if (enter) {
        enter.disabled = false;
        $('#enter-label').textContent = 'ABRIR MODO LECTURA';
        enter.addEventListener('click', () => showFallback('No se pudo cargar el motor 3D.'));
      }
      // Si el fallo ocurre antes de que el usuario vea la portada, ofrecemos
      // el documento completo en lugar de una pantalla bloqueada.
      setTimeout(() => {
        if (!STATE.ready) showFallback('El motor 3D no pudo cargarse desde la red.');
      }, 1200);
    }
  }

  window.addEventListener('error', (event) => {
    if (!STATE.ready) {
      console.error('Error global durante el arranque:', event.error || event.message);
    }
  });
  window.addEventListener('unhandledrejection', (event) => {
    if (!STATE.ready) {
      console.error('Promesa rechazada durante el arranque:', event.reason);
    }
  });

  boot();
})();
