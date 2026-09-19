(() => {
  const ROOT = "./assets/pulse/animated/";
  const FRAMES = {
    rest: `${ROOT}rest.png`,
    blink: `${ROOT}blink.png`,
    smile: `${ROOT}smile.png`,
    wave: `${ROOT}wave.png`
  };
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let activeImage = null;
  let blinkTimer = 0;
  let waveTimer = 0;
  let returnTimer = 0;

  Object.values(FRAMES).forEach(src => {
    const image = new Image();
    image.src = src;
  });

  function clearTimers() {
    clearTimeout(blinkTimer);
    clearTimeout(waveTimer);
    clearTimeout(returnTimer);
  }

  function show(name, duration = 0) {
    if (!activeImage?.isConnected || reduceMotion.matches) return;
    activeImage.classList.add("pulse-frame-change");
    requestAnimationFrame(() => {
      if (!activeImage?.isConnected) return;
      activeImage.src = FRAMES[name];
      activeImage.dataset.pulseFrame = name;
      requestAnimationFrame(() => activeImage?.classList.remove("pulse-frame-change"));
    });
    clearTimeout(returnTimer);
    if (duration) returnTimer = setTimeout(() => show("rest"), duration);
  }

  function schedule() {
    clearTimers();
    if (!activeImage || reduceMotion.matches) return;
    blinkTimer = setTimeout(function blink() {
      show("blink", 170);
      blinkTimer = setTimeout(blink, 4300 + Math.random() * 2600);
    }, 2600 + Math.random() * 1800);
    waveTimer = setTimeout(function wave() {
      show("wave", 850);
      waveTimer = setTimeout(wave, 10500 + Math.random() * 4500);
    }, 7200 + Math.random() * 2500);
  }

  function attach() {
    const image = document.querySelector(".hero .pulse");
    if (!image || image === activeImage) return;
    activeImage = image;
    const levelOne = /level-01\.webp(?:$|[?#])/.test(image.getAttribute("src") || "");
    if (!levelOne) {
      clearTimers();
      return;
    }
    image.src = FRAMES.rest;
    image.dataset.pulseAnimated = "true";
    image.alt = "Pulse animé";
    schedule();
  }

  const observer = new MutationObserver(attach);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  reduceMotion.addEventListener?.("change", schedule);
  addEventListener("pagehide", clearTimers);
  attach();

  document.addEventListener("click", event => {
    if (!activeImage?.isConnected || !activeImage.dataset.pulseAnimated) return;
    if (event.target.closest(".check,.move-option,.open-bag,.nano-confirm")) {
      setTimeout(() => {
        attach();
        show("smile", 900);
      }, 40);
    }
  }, true);
})();
