/* acquisition_08 — コインゲーム型 interactions */
(function() {

  /* FX canvas */
  const fx = document.getElementById('fx-canvas');
  const fxCtx = fx.getContext('2d');
  const fxParticles = [];

  function resizeFx() { fx.width = window.innerWidth; fx.height = window.innerHeight; }
  window.addEventListener('resize', resizeFx);
  resizeFx();

  /* Coin collect effect */
  function spawnCoins(x, y, count) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i - Math.PI / 2;
      const speed = 3 + Math.random() * 5;
      fxParticles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: 10 + Math.random() * 8,
        life: 1.0,
        decay: 0.04 + Math.random() * 0.02,
        isCoin: true,
      });
    }
  }

  function spawnStars(x, y) {
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      fxParticles.push({
        x, y,
        vx: Math.cos(angle) * (2 + Math.random() * 4),
        vy: Math.sin(angle) * (2 + Math.random() * 4) - 1,
        size: 4 + Math.random() * 4,
        life: 1.0,
        decay: 0.05,
        isStar: true,
        color: ['#ffd600','#ff3b3b','#00c853','#1565c0'][Math.floor(Math.random()*4)],
      });
    }
  }

  function drawFxParticle(p) {
    fxCtx.save();
    fxCtx.globalAlpha = p.life;
    if (p.isCoin) {
      const g = fxCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      g.addColorStop(0, '#fff9c4'); g.addColorStop(0.5, '#ffc107'); g.addColorStop(1, '#e65100');
      fxCtx.fillStyle = g;
      fxCtx.strokeStyle = '#e65100'; fxCtx.lineWidth = 2;
      fxCtx.beginPath(); fxCtx.arc(p.x, p.y, p.size * p.life, 0, Math.PI*2);
      fxCtx.fill(); fxCtx.stroke();
    } else if (p.isStar) {
      fxCtx.fillStyle = p.color;
      fxCtx.shadowColor = p.color; fxCtx.shadowBlur = 8;
      fxCtx.beginPath();
      const s = p.size * p.life;
      for (let i = 0; i < 4; i++) {
        const a = (Math.PI / 2) * i;
        const r1 = s, r2 = s * 0.4;
        fxCtx.lineTo(p.x + r1*Math.cos(a), p.y + r1*Math.sin(a));
        fxCtx.lineTo(p.x + r2*Math.cos(a+Math.PI/4), p.y + r2*Math.sin(a+Math.PI/4));
      }
      fxCtx.closePath(); fxCtx.fill();
    }
    fxCtx.restore();
  }

  function fxLoop() {
    fxCtx.clearRect(0,0,fx.width,fx.height);
    for (let i = fxParticles.length-1; i >= 0; i--) {
      const p = fxParticles[i];
      p.x += p.vx; p.y += p.vy; p.vy += 0.2;
      p.life -= p.decay;
      if (p.life <= 0) { fxParticles.splice(i,1); continue; }
      drawFxParticle(p);
    }
    requestAnimationFrame(fxLoop);
  }
  requestAnimationFrame(fxLoop);

  /* Coin score counter */
  let score = 0;
  const scoreEl = document.getElementById('score-count');

  function addScore(pts, x, y) {
    score += pts;
    if (scoreEl) {
      scoreEl.textContent = score.toLocaleString();
      scoreEl.style.animation = 'none';
      requestAnimationFrame(() => scoreEl.style.animation = 'scorePop 0.3s ease');
    }
    // Popup text
    const popup = document.createElement('div');
    popup.className = 'score-popup';
    popup.textContent = '+' + pts + 'PT';
    popup.style.left = (x - document.querySelector('.lp').getBoundingClientRect().left) + 'px';
    popup.style.top  = (y - document.querySelector('.lp').getBoundingClientRect().top) + 'px';
    document.querySelector('.game-stage').appendChild(popup);
    setTimeout(() => popup.remove(), 900);
  }

  /* Stage coins — clickable */
  document.querySelectorAll('.stage-coin').forEach(coin => {
    coin.addEventListener('click', e => {
      const r = coin.getBoundingClientRect();
      const cx = r.left + r.width/2;
      const cy = r.top  + r.height/2;
      spawnCoins(cx, cy, 8);
      spawnStars(cx, cy);
      addScore(100, r.left, r.top);
      coin.style.animation = 'coinCollect 0.3s ease forwards';
      setTimeout(() => {
        coin.style.animation = 'coinFloat 2s ease-in-out infinite';
        coin.style.opacity = '1';
      }, 1500);
    });
  });

  /* CTA button click */
  document.querySelectorAll('.cta-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const r = btn.getBoundingClientRect();
      spawnCoins(r.left + r.width/2, r.top, 16);
      spawnStars(r.left + r.width/2, r.top);
      score += 2100;
      if (scoreEl) scoreEl.textContent = score.toLocaleString();
    });
  });

  /* Scroll fade in */
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (!e.isIntersecting) return;
      obs.unobserve(e.target);
      setTimeout(() => e.target.classList.add('anim-fadeup'), i * 80);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.item-box, .step-card, .coin-stat').forEach(el => {
    el.style.opacity = '0';
    obs.observe(el);
  });

  /* Number count up */
  document.querySelectorAll('.coin-stat-num, .final-pt-num').forEach(el => {
    const raw = parseInt(el.textContent.replace(/[^\d]/g,''));
    if (!raw) return;
    const suffix = el.textContent.replace(/[\d,]/g,'').trim();
    const o = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return; o.disconnect();
        const dur = 1200, t0 = performance.now();
        (function tick(now) {
          const p = Math.min((now-t0)/dur,1);
          const ease = 1-Math.pow(1-p,3);
          el.textContent = Math.floor(ease*raw).toLocaleString() + (suffix||'');
          if(p<1) requestAnimationFrame(tick);
          else el.textContent = raw.toLocaleString() + (suffix||'');
        })(t0);
      });
    }, { threshold:0.5 });
    o.observe(el);
  });

  /* Item box hover — coin sound visual */
  document.querySelectorAll('.item-box').forEach(box => {
    box.addEventListener('mouseenter', () => {
      const r = box.getBoundingClientRect();
      spawnStars(r.left + r.width/2, r.top + 20);
    });
  });

})();
