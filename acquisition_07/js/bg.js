(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;

  /* Neon cyber particle system */
  const COLORS = [
    'rgba(255,45,122,',   // neon pink
    'rgba(0,245,255,',    // neon cyan
    'rgba(255,214,0,',    // neon gold
    'rgba(191,0,255,',    // neon purple
  ];

  const particles = [];
  const lines = [];

  function makeParticle() {
    const lpL = (W - 390) / 2;
    const lpR = lpL + 390;
    let x;
    if (W <= 500) x = Math.random() * W;
    else x = Math.random() < 0.5
      ? Math.random() * (lpL - 10)
      : lpR + 10 + Math.random() * (W - lpR - 10);

    return {
      x, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -(0.2 + Math.random() * 0.8),
      size: 1 + Math.random() * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 0.4 + Math.random() * 0.5,
      life: Math.random(),
      decay: 0.003 + Math.random() * 0.004,
      glow: Math.random() < 0.3,
    };
  }

  function init() {
    particles.length = 0;
    for (let i = 0; i < 60; i++) {
      const p = makeParticle();
      p.life = Math.random();
      particles.push(p);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* 배경 */
    ctx.fillStyle = '#060612';
    ctx.fillRect(0, 0, W, H);

    /* 사이드 그라데이션 글로우 */
    const lpL = (W - 390) / 2;
    if (lpL > 20) {
      const glowL = ctx.createRadialGradient(lpL * 0.4, H * 0.3, 0, lpL * 0.4, H * 0.3, 200);
      glowL.addColorStop(0, 'rgba(255,45,122,0.08)');
      glowL.addColorStop(1, 'transparent');
      ctx.fillStyle = glowL;
      ctx.fillRect(0, 0, W, H);

      const lpR = lpL + 390;
      const glowR = ctx.createRadialGradient(lpR + (W - lpR) * 0.6, H * 0.6, 0, lpR + (W - lpR) * 0.6, H * 0.6, 180);
      glowR.addColorStop(0, 'rgba(0,245,255,0.08)');
      glowR.addColorStop(1, 'transparent');
      ctx.fillStyle = glowR;
      ctx.fillRect(0, 0, W, H);
    }

    const t = performance.now() / 1000;

    /* 파티클 연결선 */
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,245,255,${0.08 * (1 - dist/100)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    /* 파티클 */
    particles.forEach(p => {
      const a = p.alpha * Math.min(1, p.life * 3);
      ctx.save();
      if (p.glow) {
        ctx.shadowColor = p.color + '1)';
        ctx.shadowBlur = 15;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color + a + ')';
      ctx.fill();
      ctx.restore();
    });

    ctx.globalAlpha = 1;
  }

  function update() {
    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      if (p.life <= 0 || p.y < -10) particles[i] = makeParticle();
    });
  }

  let last = 0;
  function animate(ts) {
    if (ts - last > 16) { update(); draw(); last = ts; }
    requestAnimationFrame(animate);
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    init();
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(animate);
})();
