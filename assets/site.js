/* Shared motion: scene time, drift parallax, progress, the quiet stretch,
   and the accidental-keystrokes moment. No dependencies. */
(() => {
  const scenes = Array.from(document.querySelectorAll(".scene[data-time]"));
  const timeEl = document.getElementById("time-value");
  const bar = document.getElementById("progress-bar");
  const black = document.getElementById("black-scene");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const update = () => {
    const vh = window.innerHeight;
    const max = Math.max(1, document.documentElement.scrollHeight - vh);
    if (bar) bar.style.height = `${(window.scrollY / max) * 100}%`;

    const focus = window.scrollY + vh * 0.38;
    let current = scenes[0];
    for (const scene of scenes) {
      const top = scene.offsetTop;
      if (top <= focus) current = scene;
      /* only animate scenes near the viewport; skip the rest entirely */
      if (!reduced && top < window.scrollY + vh * 1.5 &&
          top + scene.offsetHeight > window.scrollY - vh * 0.5) {
        const local = (focus - top) / Math.max(1, scene.offsetHeight);
        const drift = Math.round(Math.max(-1, Math.min(1, local - 0.5)) * -34);
        if (scene._drift !== drift) {
          scene._drift = drift;
          scene.style.setProperty("--drift", `${drift}px`);
        }
      }
    }
    if (timeEl && current.dataset.time !== timeEl.textContent) {
      timeEl.textContent = current.dataset.time;
    }

    /* The pause: text settles in, holds, then leaves a truly quiet screen. */
    if (black) {
      const p = (window.scrollY - black.offsetTop + vh * 0.5) /
        Math.max(1, black.offsetHeight);
      let quiet = 1;
      if (p < 0.1) quiet = Math.max(0, p / 0.1);
      else if (p > 0.45) quiet = Math.max(0, 1 - (p - 0.45) / 0.16);
      black.style.setProperty("--quiet", quiet.toFixed(3));
    }
  };

  /* coalesce scroll events into one style pass per frame */
  let ticking = false;
  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; update(); });
  };
  addEventListener("scroll", requestUpdate, { passive: true });
  addEventListener("resize", requestUpdate, { passive: true });
  update();

  /* Accidental keystrokes, replayed once, briefly. */
  const passwordText = document.getElementById("password-text");
  if (passwordText) {
    const full = passwordText.dataset.text || "";
    if (reduced) {
      passwordText.textContent = full;
      passwordText.parentElement.classList.add("typed");
    } else {
      let played = false;
      new IntersectionObserver((entries, observer) => {
        if (!entries.some((e) => e.isIntersecting) || played) return;
        played = true;
        observer.disconnect();
        let i = 0;
        const tick = () => {
          passwordText.textContent = full.slice(0, ++i);
          if (i < full.length) setTimeout(tick, 46 + Math.random() * 60);
          else passwordText.parentElement.classList.add("typed");
        };
        setTimeout(tick, 350);
      }, { threshold: 0.55 }).observe(passwordText.parentElement);
    }
  }
})();
