/* acquisition_07 — ネオン・サイバー型 animations */
(function() {

  /* FX canvas for click effects */
  const fx = document.createElement('canvas');
  fx.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:9999;pointer-events:none;';
  document.body.appendChild(fx);
  const fxCtx = fx.getContext('2d');
  const particles = [];

  function resizeFx() { fx.width = window.innerWidth; fx.height = window.innerHeight; }
  window.addEventListener('resize', resizeFx);
  resizeFx();

  const FX_COLORS = ['#ff2d7a','#00f5ff','#ffd600','#bf00ff','#ffffff'];

  function spawnRing(x, y) {
    for (let i = 0; i < 24; i++) {
      const angle = (Math.PI * 2 / 24) * i;
      const speed = 3 + Math.random() * 5;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        color: FX_COLORS[Math.floor(Math.random() * FX_COLORS.length)],
        life: 1.0,
        decay: 0.04 + Math.random() * 0.03,
        glow: true,
      });
    }
    /* Center flash */
    particles.push({ x, y, vx:0, vy:0, size:30, color:'rgba(255,255,255,0.6)', life:1, decay:0.12, isFlash:true });
  }

  function drawFx() {
    fxCtx.clearRect(0, 0, fx.width, fx.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life -= p.decay;
      if (p.life <= 0) { particles.splice(i,1); continue; }

      fxCtx.save();
      fxCtx.globalAlpha = p.life;
      if (p.isFlash) {
        const g = fxCtx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.size*p.life);
        g.addColorStop(0, 'rgba(255,255,255,0.8)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        fxCtx.fillStyle = g;
        fxCtx.beginPath(); fxCtx.arc(p.x,p.y,p.size*p.life,0,Math.PI*2); fxCtx.fill();
      } else {
        if (p.glow) { fxCtx.shadowColor = p.color; fxCtx.shadowBlur = 12; }
        fxCtx.fillStyle = p.color;
        fxCtx.beginPath(); fxCtx.arc(p.x,p.y,p.size*p.life,0,Math.PI*2); fxCtx.fill();
      }
      fxCtx.restore();
    }
    requestAnimationFrame(drawFx);
  }
  requestAnimationFrame(drawFx);

  /* Click effects on CTA */
  function popText(text, x, y, color) {
    const el = document.createElement('div');
    el.textContent = text;
    el.style.cssText = `
      position:fixed; left:${x}px; top:${y}px;
      transform:translate(-50%,-50%);
      font-family:'Orbitron',monospace; font-size:16px; font-weight:900;
      color:${color}; text-shadow:0 0 10px ${color};
      pointer-events:none; z-index:99999; white-space:nowrap;
      transition: transform 0.6s ease-out, opacity 0.6s ease-out;
    `;
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      el.style.transform = `translate(-50%, calc(-50% - 60px)) scale(1.3)`;
      el.style.opacity = '0';
    });
    setTimeout(() => el.remove(), 700);
  }

  document.querySelectorAll('.cta-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const r = btn.getBoundingClientRect();
      spawnRing(r.left + r.width/2, r.top + r.height/2);
      popText('GET 2,100PT!', r.left + r.width/2, r.top - 10, '#ffd600');
    });
  });

  /* Scroll intersection fadeup */
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (!e.isIntersecting) return;
      obs.unobserve(e.target);
      e.target.style.animationDelay = (i * 0.1) + 's';
      e.target.classList.add('anim-fadeup');
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reason-item, .step-item, .stat-card, .final-point-box').forEach(el => {
    el.style.opacity = '0';
    obs.observe(el);
  });

  /* Number counter */
  document.querySelectorAll('.stat-num, .final-pt-num').forEach(el => {
    const raw = el.textContent.replace(/[^\d.]/g,'');
    const isFloat = raw.includes('.');
    const target = parseFloat(raw);
    const suffix = el.textContent.replace(raw,'');
    if (!target) return;

    const o = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        o.disconnect();
        const dur = 1400; const t0 = performance.now();
        (function tick(now) {
          const p = Math.min((now-t0)/dur, 1);
          const ease = 1 - Math.pow(1-p, 4);
          const val = ease * target;
          el.textContent = (isFloat ? val.toFixed(1) : Math.floor(val).toLocaleString()) + suffix;
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = (isFloat ? target.toFixed(1) : target.toLocaleString()) + suffix;
        })(t0);
      });
    }, { threshold: 0.5 });
    o.observe(el);
  });

  /* Reason icon hover pop */
  document.querySelectorAll('.reason-icon').forEach(icon => {
    icon.style.transition = 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)';
  });

  /* Glitch effect on header logo */
  const logo = document.querySelector('.header-logo');
  if (logo) {
    setInterval(() => {
      if (Math.random() > 0.7) {
        logo.style.textShadow = `3px 0 #ff2d7a, -3px 0 #00f5ff, 0 0 20px #00f5ff`;
        logo.style.transform = `translateX(${Math.random() < 0.5 ? 2 : -2}px)`;
        setTimeout(() => {
          logo.style.textShadow = '';
          logo.style.transform = '';
        }, 80);
      }
    }, 2000);
  }

  /* Scan line effect on page scroll */
  const scanLine = document.createElement('div');
  scanLine.style.cssText = `
    position:fixed; left:0; right:0; height:2px;
    background:linear-gradient(90deg,transparent,rgba(0,245,255,0.4),transparent);
    z-index:9000; pointer-events:none;
    opacity:0; transition:opacity 0.1s;
    box-shadow: 0 0 10px rgba(0,245,255,0.6);
  `;
  document.body.appendChild(scanLine);

  let scanTimer;
  window.addEventListener('scroll', () => {
    clearTimeout(scanTimer);
    scanLine.style.top = (window.scrollY % window.innerHeight) + 'px';
    scanLine.style.opacity = '1';
    scanTimer = setTimeout(() => scanLine.style.opacity = '0', 300);
  });

})();
