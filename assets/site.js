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

    /* The pause, in two beats: the menu-bar click, then the product's
       screen — which finally leaves a truly quiet stretch of black. */
    if (black) {
      const p = (window.scrollY - black.offsetTop + vh * 0.5) /
        Math.max(1, black.offsetHeight);
      let moment = 0;
      if (p >= 0.04 && p < 0.1) moment = (p - 0.04) / 0.06;
      else if (p >= 0.1 && p < 0.26) moment = 1;
      else if (p >= 0.26 && p < 0.32) moment = 1 - (p - 0.26) / 0.06;
      let quiet = 0;
      if (p >= 0.36 && p < 0.44) quiet = (p - 0.36) / 0.08;
      else if (p >= 0.44 && p < 0.62) quiet = 1;
      else if (p >= 0.62 && p < 0.74) quiet = 1 - (p - 0.62) / 0.12;
      black.style.setProperty("--moment", moment.toFixed(3));
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

  /* The hero Mac demos the product on loop: chaos → menu → cleaning mode → back. */
  const mac = document.getElementById("mac");
  if (mac) {
    const passText = document.getElementById("mv-pass-text");
    const gibberish = "fjdklsajflkdsaf";
    const seq = [["a", 3400], ["b", 2200], ["c", 4000], ["d", 2600]];
    let idx = 0, timer = null, typeTimer = null;
    const typeGibberish = () => {
      let i = 0;
      mac.classList.remove("typed");
      passText.textContent = "";
      clearInterval(typeTimer);
      typeTimer = setInterval(() => {
        passText.textContent = gibberish.slice(0, ++i);
        if (i >= gibberish.length) { clearInterval(typeTimer); mac.classList.add("typed"); }
      }, 95);
    };
    const setState = (s) => {
      mac.classList.remove("mac--a", "mac--b", "mac--c", "mac--d");
      mac.classList.add("mac--" + s);
      if (s === "a") typeGibberish();
    };
    if (reduced) {
      setState("c");
    } else {
      const step = () => {
        setState(seq[idx][0]);
        timer = setTimeout(() => { idx = (idx + 1) % seq.length; step(); }, seq[idx][1]);
      };
      new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          if (!timer) step();
        } else {
          clearTimeout(timer);
          clearInterval(typeTimer);
          timer = null;
        }
      }, { threshold: 0.2 }).observe(mac);
    }
  }

  /* The ring works here too: press and hold three seconds, come back. */
  const unlock = document.getElementById("unlock");
  const note = document.getElementById("black-note");
  if (unlock) {
    const noteText = note ? note.textContent : "";
    let holdTimer = null;
    const finish = () => {
      holdTimer = null;
      unlock.classList.remove("holding");
      unlock.classList.add("done");
      if (note) note.textContent = "OKAY. YOU'RE BACK.";
      const target = document.getElementById("s4");
      setTimeout(() => {
        if (target) target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
        setTimeout(() => {
          unlock.classList.remove("done");
          if (note) note.textContent = noteText;
        }, 1200);
      }, 350);
    };
    const start = (e) => {
      if (holdTimer || unlock.classList.contains("done")) return;
      if (e.cancelable) e.preventDefault();
      unlock.classList.add("holding");
      holdTimer = setTimeout(finish, 3000);
    };
    const cancel = () => {
      if (!holdTimer) return;
      clearTimeout(holdTimer);
      holdTimer = null;
      unlock.classList.remove("holding");
    };
    unlock.addEventListener("pointerdown", start);
    unlock.addEventListener("pointerup", cancel);
    unlock.addEventListener("pointerleave", cancel);
    unlock.addEventListener("pointercancel", cancel);
    unlock.addEventListener("contextmenu", (e) => e.preventDefault());
    unlock.addEventListener("keydown", (e) => {
      if ((e.key === " " || e.key === "Enter") && !e.repeat) start(e);
    });
    unlock.addEventListener("keyup", cancel);
    unlock.addEventListener("blur", cancel);
  }

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
