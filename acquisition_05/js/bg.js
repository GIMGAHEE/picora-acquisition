(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;

  // 색상 — 핑크 계열만, 파스텔톤
  const COLORS = [
    '#ffb3cc', '#ff80aa', '#ffc8dd', '#ff99bb',
    '#ffaac5', '#ffd6e7', '#ff72a2', '#ffe0ee',
  ];

  const hearts = [];

  function makeHeart() {
    const lpL = (W - 390) / 2;
    const lpR = lpL + 390;
    let x;
    if (W <= 500) x = Math.random() * W;
    else x = Math.random() < 0.5
      ? Math.random() * (lpL - 10)
      : lpR + 10 + Math.random() * (W - lpR - 10);

    return {
      x,
      y: H + 30,
      size: 10 + Math.random() * 22,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -(0.4 + Math.random() * 0.7),
      rot: (Math.random() - 0.5) * 0.4,
      rotSpeed: (Math.random() - 0.5) * 0.012,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 0.35 + Math.random() * 0.35,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.02 + Math.random() * 0.02,
      life: 1.0,
      decay: 0.003 + Math.random() * 0.003,
    };
  }

  function drawHeart(x, y, s, rot, alpha, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    // 하트 경로
    ctx.moveTo(0, s * 0.25);
    ctx.bezierCurveTo(-s * 0.5, -s * 0.1, -s * 0.5, -s * 0.55, 0, -s * 0.2);
    ctx.bezierCurveTo(s * 0.5, -s * 0.55, s * 0.5, -s * 0.1, 0, s * 0.25);
    ctx.fill();

    // 하이라이트 (더 귀엽게)
    ctx.globalAlpha = alpha * 0.4;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(-s * 0.14, -s * 0.22, s * 0.1, s * 0.07, -0.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function init() {
    hearts.length = 0;
    for (let i = 0; i < 35; i++) {
      const h = makeHeart();
      h.y = Math.random() * H; // 처음엔 화면 전체에 분산
      h.life = 0.3 + Math.random() * 0.7;
      hearts.push(h);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // 배경 — 아주 연한 핑크~흰색
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0,   '#fff5f8');
    bg.addColorStop(0.5, '#fff0f5');
    bg.addColorStop(1,   '#ffe8f0');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // 아주 연한 도트 패턴
    ctx.fillStyle = 'rgba(255,114,162,0.06)';
    const DOT = 28;
    for (let x = 0; x < W; x += DOT) {
      for (let y = 0; y < H; y += DOT) {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const t = performance.now() / 1000;

    // 하트 렌더링
    hearts.forEach(h => {
      const wobbleX = Math.sin(h.wobble + t * h.wobbleSpeed * 60) * 3;
      drawHeart(
        h.x + wobbleX, h.y,
        h.size, h.rot,
        h.alpha * Math.min(1, h.life * 4),
        h.color
      );
    });

    ctx.globalAlpha = 1;
  }

  function update() {
    hearts.forEach((h, i) => {
      h.x  += h.vx;
      h.y  += h.vy;
      h.rot += h.rotSpeed;
      h.wobble += h.wobbleSpeed;
      h.life -= h.decay;

      if (h.life <= 0 || h.y < -h.size * 2) {
        hearts[i] = makeHeart();
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
