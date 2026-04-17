(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;

  // 블루 계열 파스텔 버블 + 별
  const COLORS = [
    '#a8d8ff', '#7ce1e3', '#b3e5fc', '#80cbff',
    '#c5eeff', '#60b8f5', '#d6f0ff', '#99d6ff',
  ];

  const items = [];

  function makeItem() {
    const lpL = (W - 390) / 2;
    const lpR = lpL + 390;
    let x;
    if (W <= 500) x = Math.random() * W;
    else x = Math.random() < 0.5
      ? Math.random() * (lpL - 10)
      : lpR + 10 + Math.random() * (W - lpR - 10);

    const type = Math.random() < 0.6 ? 'bubble' : 'star';

    return {
      x, y: H + 30,
      type,
      size: type === 'bubble' ? 12 + Math.random() * 24 : 8 + Math.random() * 18,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(0.3 + Math.random() * 0.6),
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.015,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 0.30 + Math.random() * 0.35,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.015 + Math.random() * 0.02,
      life: 1.0,
      decay: 0.003 + Math.random() * 0.003,
    };
  }

  function drawBubble(x, y, s, alpha, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = alpha;

    // 버블 본체
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // 테두리 (살짝)
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // 하이라이트
    ctx.globalAlpha = alpha * 0.55;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(-s * 0.12, -s * 0.16, s * 0.12, s * 0.08, -0.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawStar(x, y, s, rot, alpha, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;

    const pts = 5, r1 = s * 0.5, r2 = s * 0.2;
    ctx.beginPath();
    for (let i = 0; i < pts * 2; i++) {
      const r = i % 2 === 0 ? r1 : r2;
      const a = (i * Math.PI / pts) - Math.PI / 2;
      i === 0
        ? ctx.moveTo(r * Math.cos(a), r * Math.sin(a))
        : ctx.lineTo(r * Math.cos(a), r * Math.sin(a));
    }
    ctx.closePath();
    ctx.fill();

    // 별 하이라이트
    ctx.globalAlpha = alpha * 0.35;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(-s * 0.1, -s * 0.18, s * 0.08, s * 0.05, -0.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function init() {
    items.length = 0;
    for (let i = 0; i < 38; i++) {
      const h = makeItem();
      h.y = Math.random() * H;
      h.life = 0.3 + Math.random() * 0.7;
      items.push(h);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // 배경 — 아주 연한 블루~흰색
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0,   '#f0f8ff');
    bg.addColorStop(0.5, '#eaf4ff');
    bg.addColorStop(1,   '#dff0ff');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // 연한 도트 패턴
    ctx.fillStyle = 'rgba(39,127,250,0.05)';
    const DOT = 28;
    for (let x = 0; x < W; x += DOT) {
      for (let y = 0; y < H; y += DOT) {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const t = performance.now() / 1000;

    items.forEach(h => {
      const wobbleX = Math.sin(h.wobble + t * h.wobbleSpeed * 60) * 3;
      const a = h.alpha * Math.min(1, h.life * 4);
      if (h.type === 'bubble') {
        drawBubble(h.x + wobbleX, h.y, h.size, a, h.color);
      } else {
        drawStar(h.x + wobbleX, h.y, h.size, h.rot, a, h.color);
      }
    });

    ctx.globalAlpha = 1;
  }

  function update() {
    items.forEach((h, i) => {
      h.x += h.vx;
      h.y += h.vy;
      h.rot += h.rotSpeed;
      h.wobble += h.wobbleSpeed;
      h.life -= h.decay;
      if (h.life <= 0 || h.y < -h.size * 2) {
        items[i] = makeItem();
      }
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
