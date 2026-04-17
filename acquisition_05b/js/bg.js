(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;

  const COLORS = [
    '#a8d8ff', '#7ce1e3', '#b3e5fc',
    '#80cbff', '#c5eeff', '#60b8f5',
  ];

  const bubbles = [];

  function makeBubble() {
    const lpL = (W - 390) / 2;
    const lpR = lpL + 390;
    let x;
    if (W <= 500) x = Math.random() * W;
    else x = Math.random() < 0.5
      ? Math.random() * (lpL - 10)
      : lpR + 10 + Math.random() * (W - lpR - 10);

    const r = 28 + Math.random() * 52; // 크게 28~80px

    return {
      x,
      y: H + r + 10,
      r,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(0.18 + Math.random() * 0.28), // 느리게
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.008 + Math.random() * 0.012,
      wobbleAmp: 1.5 + Math.random() * 2.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 0.18 + Math.random() * 0.22,
      life: 1.0,
      decay: 0.0015 + Math.random() * 0.002,
    };
  }

  function drawBubble(b) {
    const { x, y, r, color, alpha } = b;
    ctx.save();

    // 바깥 테두리 (비누방울 느낌)
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = color.replace(')', ',0.5)').replace('rgb', 'rgba');
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = alpha * 1.2;
    ctx.stroke();

    // 내부 채우기 (반투명)
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(
      x - r * 0.28, y - r * 0.28, r * 0.05,
      x, y, r
    );
    grad.addColorStop(0, color + 'aa');
    grad.addColorStop(0.5, color + '44');
    grad.addColorStop(1, color + '11');
    ctx.fillStyle = grad;
    ctx.globalAlpha = alpha;
    ctx.fill();

    // 상단 하이라이트 (비누방울 광택)
    ctx.beginPath();
    ctx.ellipse(
      x - r * 0.28, y - r * 0.3,
      r * 0.22, r * 0.13,
      -0.5, 0, Math.PI * 2
    );
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.globalAlpha = alpha * 1.4;
    ctx.fill();

    // 오른쪽 하단 작은 반사
    ctx.beginPath();
    ctx.ellipse(
      x + r * 0.3, y + r * 0.3,
      r * 0.08, r * 0.05,
      0.8, 0, Math.PI * 2
    );
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.globalAlpha = alpha;
    ctx.fill();

    ctx.restore();
  }

  function init() {
    bubbles.length = 0;
    for (let i = 0; i < 22; i++) {
      const b = makeBubble();
      b.y = Math.random() * H;
      b.life = 0.4 + Math.random() * 0.6;
      bubbles.push(b);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // 배경
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0,   '#f0f8ff');
    bg.addColorStop(0.5, '#eaf4ff');
    bg.addColorStop(1,   '#dff0ff');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // 연한 도트
    ctx.fillStyle = 'rgba(39,127,250,0.04)';
    const DOT = 32;
    for (let x = 0; x < W; x += DOT)
      for (let y = 0; y < H; y += DOT) {
        ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();
      }

    const t = performance.now() / 1000;
    bubbles.forEach(b => {
      const fadeAlpha = b.alpha * Math.min(1, b.life * 5);
      const wobbleX = Math.sin(b.wobble + t * b.wobbleSpeed * 60) * b.wobbleAmp;
      const savedAlpha = b.alpha;
      b.alpha = fadeAlpha;
      drawBubble({ ...b, x: b.x + wobbleX });
      b.alpha = savedAlpha;
    });
  }

  function update() {
    bubbles.forEach((b, i) => {
      b.x += b.vx;
      b.y += b.vy;
      b.wobble += b.wobbleSpeed;
      b.life -= b.decay;
      if (b.life <= 0 || b.y < -b.r * 2) {
        bubbles[i] = makeBubble();
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
