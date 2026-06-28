/**
 * beautify.js
 * Beautiful visual additions: rose petals, floating hearts, shooting stars,
 * constellation sparkles, touch ripples, golden ribbon, floating orbs.
 */

(function () {
  'use strict';

  /* =========================================================
     UTILITY
     ========================================================= */
  const rand  = (a, b) => Math.random() * (b - a) + a;
  const randI = (a, b) => Math.floor(rand(a, b + 1));
  const randEl = arr => arr[Math.floor(Math.random() * arr.length)];
  const PI2 = Math.PI * 2;

  /* =========================================================
     1.  ROSE PETALS  — full-screen CSS elements
     ========================================================= */
  function initPetals() {
    const style = document.createElement('style');
    style.textContent = `
      .petal {
        position: fixed;
        top: -60px;
        pointer-events: none;
        z-index: 8;
        will-change: transform, opacity;
        animation: petalFall linear infinite;
      }
      @keyframes petalFall {
        0%   { transform: translateY(0) translateX(0) rotate(0deg) scale(1); opacity: 0; }
        5%   { opacity: 1; }
        90%  { opacity: 0.7; }
        100% { transform: translateY(110vh) translateX(var(--sway)) rotate(var(--spin)) scale(0.7); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    const colors = ['#ff9ebc', '#ffb3c6', '#ffc8d6', '#ffafc9', '#ff85ab', '#f9c6d8', '#ffd6e5'];
    const shapes = [
      // tear-drop petal
      `<svg viewBox="0 0 20 28" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 2 C14 8 18 14 10 26 C2 14 6 8 10 2Z" fill="COLOR" opacity="0.88"/>
      </svg>`,
      // round petal
      `<svg viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="11" cy="13" rx="9" ry="11" fill="COLOR" opacity="0.82"/>
      </svg>`,
      // wide petal
      `<svg viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 2 C24 4 28 10 15 19 C2 10 6 4 15 2Z" fill="COLOR" opacity="0.8"/>
      </svg>`,
    ];

    const NUM = 28;
    for (let i = 0; i < NUM; i++) spawnPetal(shapes, colors, i * (14000 / NUM));

    function spawnPetal(shapes, colors, delay) {
      const el = document.createElement('div');
      el.className = 'petal';
      const color  = randEl(colors);
      const svg    = randEl(shapes).replace('COLOR', color);
      const size   = rand(12, 24);
      const left   = rand(0, 100);
      const dur    = rand(9, 18);
      const sway   = rand(-120, 120);
      const spin   = rand(180, 540) * (Math.random() > 0.5 ? 1 : -1);

      el.innerHTML = svg;
      el.style.cssText = `
        left: ${left}%;
        width: ${size}px;
        height: ${size * 1.3}px;
        --sway: ${sway}px;
        --spin: ${spin}deg;
        animation-duration: ${dur}s;
        animation-delay: -${delay / 1000}s;
      `;
      document.body.appendChild(el);
    }
  }

  /* =========================================================
     2.  FLOATING HEARTS  — periodic CSS hearts
     ========================================================= */
  function initHearts() {
    const style = document.createElement('style');
    style.textContent = `
      .fheart {
        position: fixed;
        bottom: -60px;
        pointer-events: none;
        z-index: 8;
        font-size: 22px;
        will-change: transform, opacity;
        animation: heartRise ease-out forwards;
        user-select: none;
      }
      @keyframes heartRise {
        0%   { transform: translateY(0) scale(0.5) rotate(var(--r)); opacity: 0; }
        10%  { opacity: 1; }
        80%  { opacity: 0.6; }
        100% { transform: translateY(-110vh) scale(1.1) rotate(var(--r2)); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    const emojis = ['❤️','💖','💗','💓','💝','🌸','✨','💕'];

    function launch() {
      const el = document.createElement('div');
      el.className = 'fheart';
      el.textContent = randEl(emojis);
      const r  = rand(-25, 25);
      const r2 = rand(-40, 40);
      el.style.cssText = `
        left: ${rand(5, 92)}%;
        font-size: ${rand(14, 30)}px;
        --r: ${r}deg;
        --r2: ${r2}deg;
        animation-duration: ${rand(4, 8)}s;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 9000);
    }

    launch();
    setInterval(launch, 1400);
  }

  /* =========================================================
     3.  SHOOTING STARS  — canvas overlay
     ========================================================= */
  function initShootingStars() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position: fixed; top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: none; z-index: 9;
    `;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let W, H;
    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const stars = [];

    function createStar() {
      const angle = rand(-0.4, 0.4) + Math.PI * 0.25; // diagonal downward
      const speed = rand(8, 20);
      return {
        x: rand(0, W),
        y: rand(0, H * 0.45),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        len: rand(60, 160),
        life: 0,
        maxLife: rand(40, 80),
        color: randEl(['#fff','#ffe8a0','#c8aaff','#aaddff']),
        width: rand(1, 2.5),
      };
    }

    let frame = 0;
    function draw() {
      requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);
      frame++;

      // spawn a new star occasionally
      if (frame % randI(90, 200) === 0) stars.push(createStar());

      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life++;
        const progress = s.life / s.maxLife;
        const alpha = progress < 0.15 ? progress / 0.15
                    : progress > 0.75 ? 1 - (progress - 0.75) / 0.25
                    : 1;

        const tailX = s.x - s.vx * (s.len / (s.width * 10));
        const tailY = s.y - s.vy * (s.len / (s.width * 10));
        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, s.color);

        ctx.save();
        ctx.globalAlpha = alpha * 0.9;
        ctx.strokeStyle = grad;
        ctx.lineWidth = s.width;
        ctx.shadowBlur = 8;
        ctx.shadowColor = s.color;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
        // bright head dot
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.width * 1.5, 0, PI2);
        ctx.fillStyle = '#fff';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();

        if (s.life >= s.maxLife || s.x > W + 200 || s.y > H + 200) {
          stars.splice(i, 1);
        }
      }
    }
    draw();
  }

  /* =========================================================
     4.  CONSTELLATION SPARKLES  — twinkling star field
     ========================================================= */
  function initConstellations() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position: fixed; top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: none; z-index: 2;
    `;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let W, H;
    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      buildStars();
    }

    const STAR_COUNT = 120;
    let stars = [];

    function buildStars() {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: rand(0, W),
          y: rand(0, H * 0.7),
          r: rand(0.4, 1.8),
          phase: rand(0, PI2),
          speed: rand(0.4, 1.4),
          color: randEl(['#ffffff','#ffe8b0','#c8b8ff','#b0e8ff']),
        });
      }
    }

    resize();
    window.addEventListener('resize', () => { resize(); });

    // Draw connecting lines for nearby stars
    const LINE_DIST = 90;

    let t = 0;
    function draw() {
      requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);
      t += 0.012;

      // constellation lines
      ctx.save();
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINE_DIST) {
            const alpha = (1 - dist / LINE_DIST) * 0.12;
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = '#c8aaff';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      // stars
      stars.forEach(s => {
        const pulse = 0.5 + 0.5 * Math.sin(t * s.speed + s.phase);
        const alpha = 0.3 + 0.7 * pulse;
        const radius = s.r * (0.8 + 0.4 * pulse);

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = 6 * pulse;
        ctx.shadowColor = s.color;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, radius, 0, PI2);
        ctx.fill();
        ctx.restore();
      });
    }
    draw();
  }

  /* =========================================================
     5.  TOUCH / CLICK RIPPLE  — golden burst on tap
     ========================================================= */
  function initTouchRipple() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position: fixed; top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: none; z-index: 998;
    `;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    });

    const ripples = [];
    const sparks  = [];

    function addRipple(x, y) {
      // rings
      for (let i = 0; i < 3; i++) {
        ripples.push({ x, y, r: 0, maxR: rand(40, 100), life: 0, delay: i * 8 });
      }
      // spark particles
      const NUM = randI(8, 16);
      for (let i = 0; i < NUM; i++) {
        const angle = (i / NUM) * PI2 + rand(-0.3, 0.3);
        const speed = rand(2, 6);
        sparks.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - rand(1, 3),
          life: 0, maxLife: randI(30, 55),
          r: rand(1.5, 3.5),
          color: randEl(['#d4af37','#f3e5ab','#fff','#ffcc66','#ff9ebc']),
        });
      }
    }

    document.addEventListener('click',     e => addRipple(e.clientX, e.clientY));
    document.addEventListener('touchstart', e => {
      const t = e.touches[0];
      addRipple(t.clientX, t.clientY);
    }, { passive: true });

    function draw() {
      requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);

      // ripple rings
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.life++;
        if (rp.life < rp.delay) continue;
        const prog = (rp.life - rp.delay) / 30;
        rp.r = rp.maxR * Math.min(prog, 1);
        const alpha = Math.max(0, 1 - prog);

        ctx.save();
        ctx.globalAlpha = alpha * 0.6;
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#d4af37';
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, PI2);
        ctx.stroke();
        ctx.restore();

        if (prog >= 1) ripples.splice(i, 1);
      }

      // spark particles
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.12; // gravity
        s.life++;
        const alpha = 1 - s.life / s.maxLife;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * alpha, 0, PI2);
        ctx.fill();
        ctx.restore();

        if (s.life >= s.maxLife) sparks.splice(i, 1);
      }
    }
    draw();
  }

  /* =========================================================
     6.  GOLDEN FLOATING ORBS  — ambient bokeh lights
     ========================================================= */
  function initOrbs() {
    const style = document.createElement('style');
    style.textContent = `
      .orb {
        position: fixed;
        border-radius: 50%;
        pointer-events: none;
        z-index: 3;
        will-change: transform, opacity;
        mix-blend-mode: screen;
        animation: orbFloat ease-in-out infinite alternate;
      }
      @keyframes orbFloat {
        0%   { transform: translate(0, 0) scale(1); opacity: var(--oa); }
        50%  { transform: translate(var(--dx), var(--dy)) scale(1.15); }
        100% { transform: translate(calc(var(--dx) * -0.5), calc(var(--dy) * 1.5)) scale(0.9); opacity: calc(var(--oa) * 0.6); }
      }
    `;
    document.head.appendChild(style);

    const orbColors = [
      'radial-gradient(circle, rgba(212,175,55,0.55) 0%, transparent 70%)',
      'radial-gradient(circle, rgba(154,123,181,0.45) 0%, transparent 70%)',
      'radial-gradient(circle, rgba(255,158,188,0.4) 0%, transparent 70%)',
      'radial-gradient(circle, rgba(136,212,209,0.4) 0%, transparent 70%)',
      'radial-gradient(circle, rgba(255,200,100,0.5) 0%, transparent 70%)',
    ];

    for (let i = 0; i < 14; i++) {
      const el = document.createElement('div');
      el.className = 'orb';
      const size = rand(60, 200);
      const oa   = rand(0.3, 0.7);
      el.style.cssText = `
        left: ${rand(0, 95)}%;
        top:  ${rand(0, 85)}%;
        width:  ${size}px;
        height: ${size}px;
        background: ${randEl(orbColors)};
        --dx: ${rand(-30, 30)}px;
        --dy: ${rand(-40, 40)}px;
        --oa: ${oa};
        animation-duration: ${rand(6, 16)}s;
        animation-delay: -${rand(0, 12)}s;
      `;
      document.body.appendChild(el);
    }
  }

  /* =========================================================
     7.  BIRTHDAY MESSAGE SPARKLES around finale title
     ========================================================= */
  function initFinaleSparkles() {
    const finale = document.getElementById('scene9-finale');
    if (!finale) return;

    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        launchFinaleStars();
        obs.disconnect();
      }
    }, { threshold: 0.4 });
    obs.observe(finale);

    function launchFinaleStars() {
      const style = document.createElement('style');
      style.textContent = `
        .fstar {
          position: absolute;
          pointer-events: none;
          font-size: 1.4em;
          will-change: transform, opacity;
          animation: fstarPop 1.6s ease forwards;
        }
        @keyframes fstarPop {
          0%   { transform: translate(0,0) scale(0) rotate(0deg); opacity: 0; }
          30%  { opacity: 1; }
          80%  { opacity: 0.8; }
          100% { transform: translate(var(--tx), var(--ty)) scale(1.2) rotate(var(--tr)); opacity: 0; }
        }
      `;
      document.head.appendChild(style);

      const emojis = ['✨','⭐','🌟','💫','🎉','🎊','🌺','💖','🎈'];
      const title = finale.querySelector('.finale-title');
      const rect  = title ? title.getBoundingClientRect() : { left: 100, top: 100, width: 300, height: 60 };

      for (let i = 0; i < 30; i++) {
        setTimeout(() => {
          const el = document.createElement('div');
          el.className = 'fstar';
          el.textContent = randEl(emojis);
          el.style.cssText = `
            left: ${rect.left + rand(0, rect.width)}px;
            top:  ${rect.top  + rand(-20, rect.height + 20)}px;
            --tx: ${rand(-120, 120)}px;
            --ty: ${rand(-100, -200)}px;
            --tr: ${rand(-360, 360)}deg;
            animation-delay: ${rand(0, 0.8)}s;
            z-index: 300;
          `;
          document.body.appendChild(el);
          setTimeout(() => el.remove(), 2500);
        }, i * 60);
      }
    }
  }

  /* =========================================================
     8.  GOLDEN FLOATING RIBBON at the top of the page
     ========================================================= */
  function initRibbon() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position: fixed; top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: none; z-index: 4;
    `;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    });

    // A few lazily drifting ribbon segments (sine wave lines)
    const ribbons = Array.from({ length: 5 }, (_, i) => ({
      phase:  rand(0, PI2),
      speed:  rand(0.005, 0.015),
      amp:    rand(20, 60),
      y:      rand(H * 0.05, H * 0.35),
      color:  randEl(['#d4af37','#f3e5ab','#c8aaff','#ffb3c6','#88d4d1']),
      width:  rand(1.5, 3),
      alpha:  rand(0.08, 0.18),
      freq:   rand(0.004, 0.009),
    }));

    let t = 0;
    function draw() {
      requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);
      t += 0.5;

      ribbons.forEach(rb => {
        rb.phase += rb.speed;
        ctx.save();
        ctx.globalAlpha = rb.alpha;
        ctx.strokeStyle = rb.color;
        ctx.lineWidth   = rb.width;
        ctx.shadowBlur  = 8;
        ctx.shadowColor = rb.color;
        ctx.beginPath();
        for (let x = 0; x <= W; x += 4) {
          const y = rb.y + Math.sin(x * rb.freq + rb.phase) * rb.amp;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      });
    }
    draw();
  }

  /* =========================================================
     INIT ALL
     ========================================================= */
  function init() {
    initConstellations();
    initOrbs();
    initRibbon();
    initShootingStars();
    initPetals();
    initHearts();
    initTouchRipple();
    initFinaleSparkles();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
