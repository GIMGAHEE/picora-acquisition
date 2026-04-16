(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  // ⑤ 広告型 — ピンク/ブルーのポップなハート・星・丸パターン
  let W, H;

  const SHAPES = ['heart', 'star', 'circle', 'diamond'];
  const COLORS_PINK = ['rgba(255,114,162,', 'rgba(255,79,139,', 'rgba(227,177,246,', 'rgba(255,172,204,'];
  const COLORS_BLUE = ['rgba(39,127,250,',  'rgba(124,225,227,', 'rgba(100,180,255,', 'rgba(39,127,250,'];

  const particles = [];

  function makeParticle(i) {
    const isLeft = Math.random() < 0.5;
    const lpL = (W - 390) / 2;
    const lpR = lpL + 390;
    let x;
    if (W <= 500) x = Math.random() * W;
    else x = isLeft
      ? Math.random() * (lpL - 10)
      : lpR + 10 + Math.random() * (W - lpR - 10);

    const isPink = Math.random() < 0.5;
    const colors = isPink ? COLORS_PINK : COLORS_BLUE;

    return {
      x, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(0.2 + Math.random() * 0.4),
      size: 8 + Math.random() * 16,
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 0.2 + Math.random() * 0.25,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      life: Math.random(),
      decay: 0.002 + Math.random() * 0.003,
    };
  }

  function drawHeart(ctx, x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.3);
    ctx.bezierCurveTo(x - s * 0.5, y, x - s * 0.5, y - s * 0.5, x, y - s * 0.2);
    ctx.bezierCurveTo(x + s * 0.5, y - s * 0.5, x + s * 0.5, y, x, y + s * 0.3);
    ctx.fill();
  }

  function drawStar(ctx, x, y, s) {
    const pts = 5, r1 = s * 0.5, r2 = s * 0.2;
    ctx.beginPath();
    for (let i = 0; i < pts * 2; i++) {
      const r = i % 2 === 0 ? r1 : r2;
      const a = (i * Math.PI / pts) - Math.PI / 2;
      i === 0 ? ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a))
              : ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
    }
    ctx.closePath(); ctx.fill();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#f8f8f8';
    ctx.fillRect(0, 0, W, H);

    particles.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.alpha * Math.min(1, p.life * 3);
      ctx.fillStyle = p.color + p.alpha + ')';

      switch(p.shape) {
        case 'heart':   drawHeart(ctx, 0, 0, p.size); break;
        case 'star':    drawStar(ctx, 0, 0, p.size); break;
        case 'circle':
          ctx.beginPath(); ctx.arc(0, 0, p.size * 0.4, 0, Math.PI * 2); ctx.fill(); break;
        case 'diamond':
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 0.5);
          ctx.lineTo(p.size * 0.3, 0);
          ctx.lineTo(0, p.size * 0.5);
          ctx.lineTo(-p.size * 0.3, 0);
          ctx.closePath(); ctx.fill(); break;
      }
      ctx.restore();
    });

    ctx.globalAlpha = 1;
  }

  function update() {
    const lpL = (W - 390) / 2;
    const lpR = lpL + 390;

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotSpeed;
      p.life -= p.decay;

      if (p.life <= 0 || p.y < -30) {
        particles[i] = makeParticle(i);
        particles[i].y = H + 20;
        particles[i].life = 0.1;
      }
    });
  }

  function init() {
    particles.length = 0;
    for (let i = 0; i < 40; i++) {
      const p = makeParticle(i);
      p.life = Math.random();
      particles.push(p);
    }
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
