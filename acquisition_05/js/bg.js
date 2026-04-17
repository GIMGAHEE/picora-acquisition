(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;

  // URLでカラー判定
  const isBlue = new URLSearchParams(location.search).get('color') === 'blue';

  // 핑크는 하트 80%, 블루는 별/원 위주
  const SHAPES_PINK = ['heart','heart','heart','heart','heart','star','circle','heart'];
  const SHAPES_BLUE = ['star','star','circle','diamond','circle','star','heart'];
  const SHAPES = isBlue ? SHAPES_BLUE : SHAPES_PINK;

  const COLORS_PINK = [
    'rgba(255,114,162,',
    'rgba(255,79,139,',
    'rgba(255,172,204,',
    'rgba(255,200,225,',
    'rgba(227,177,246,',
  ];
  const COLORS_BLUE = [
    'rgba(39,127,250,',
    'rgba(124,225,227,',
    'rgba(100,180,255,',
    'rgba(160,200,255,',
  ];
  const COLORS = isBlue ? COLORS_BLUE : COLORS_PINK;
  const BG_COLOR = isBlue ? '#f0f7ff' : '#fff5f8';

  const particles = [];

  function makeParticle() {
    const lpL = (W - 390) / 2;
    const lpR = lpL + 390;
    let x;
    if (W <= 500) x = Math.random() * W;
    else x = Math.random() < 0.5
      ? Math.random() * (lpL - 10)
      : lpR + 10 + Math.random() * (W - lpR - 10);

    return {
      x, y: Math.random() * H + H,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -(0.4 + Math.random() * 0.7),
      size: 10 + Math.random() * 22,
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 0.25 + Math.random() * 0.35,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.025,
      life: Math.random(),
      decay: 0.0015 + Math.random() * 0.002,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.02 + Math.random() * 0.03,
    };
  }

  function drawHeart(ctx, x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.35);
    ctx.bezierCurveTo(x - s * 0.55, y + s * 0.05, x - s * 0.55, y - s * 0.45, x, y - s * 0.15);
    ctx.bezierCurveTo(x + s * 0.55, y - s * 0.45, x + s * 0.55, y + s * 0.05, x, y + s * 0.35);
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
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, W, H);

    particles.forEach(p => {
      ctx.save();
      ctx.translate(p.x + Math.sin(p.wobble) * 8, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.alpha * Math.min(1, p.life * 4) * Math.min(1, (1 - p.life) * 8);
      ctx.fillStyle = p.color + p.alpha + ')';

      switch(p.shape) {
        case 'heart':
          drawHeart(ctx, 0, 0, p.size); break;
        case 'star':
          drawStar(ctx, 0, 0, p.size); break;
        case 'circle':
          ctx.beginPath(); ctx.arc(0, 0, p.size * 0.42, 0, Math.PI * 2); ctx.fill(); break;
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
    particles.forEach((p, i) => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.rot += p.rotSpeed;
      p.wobble += p.wobbleSpeed;
      p.life -= p.decay;

      if (p.life <= 0 || p.y < -40) {
        particles[i] = makeParticle();
        particles[i].y = H + 20;
        particles[i].life = 0.05;
      }
    });
  }

  function init() {
    particles.length = 0;
    for (let i = 0; i < 50; i++) {
      const p = makeParticle();
      p.y = Math.random() * H;  // 초기 분산
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
