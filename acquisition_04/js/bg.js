(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  const PIXEL = 4;
  let W, H;

  // 갤럭시 중심 (사이드 한쪽에 고정)
  let GX, GY;

  const stars     = [];  // 일반 별
  const galStars  = [];  // 갤럭시 별
  const blocks    = [];  // 픽셀 블록

  const COLORS = ['#ffd600','#ff294d','#00e5ff','#69ff47','#ff9800','#fff'];

  function snap(v) { return Math.round(v / PIXEL) * PIXEL; }
  function rand(a, b) { return a + Math.random() * (b - a); }

  function lpBounds() {
    const l = (W - 390) / 2;
    return { l, r: l + 390 };
  }

  function sideX() {
    const { l, r } = lpBounds();
    if (l < 80) return Math.random() * W;
    return Math.random() < 0.5
      ? rand(20, l - 20)
      : rand(r + 20, W - 20);
  }

  function initGalaxy() {
    const { l, r } = lpBounds();
    // 갤럭시는 오른쪽 사이드 중간에
    GX = l < 80 ? W * 0.75 : rand(r + 40, W - 40);
    GY = H * rand(0.25, 0.55);

    galStars.length = 0;
    const COUNT = 320;
    for (let i = 0; i < COUNT; i++) {
      // 나선 갤럭시 형태
      const arm   = Math.floor(Math.random() * 2); // 2개 팔
      const angle = arm * Math.PI + rand(0, Math.PI * 2.5);
      const dist  = Math.pow(Math.random(), 0.6) * 130;
      const spread = dist * 0.18;
      const px = GX + Math.cos(angle) * dist + rand(-spread, spread);
      const py = GY + Math.sin(angle) * dist * 0.55 + rand(-spread, spread); // y 압축

      const brightness = 1 - dist / 160;
      const isCore = dist < 25;

      galStars.push({
        x: snap(px), y: snap(py),
        size: isCore ? PIXEL * 2 : (Math.random() < 0.15 ? PIXEL * 1.5 : PIXEL),
        phase: rand(0, Math.PI * 2),
        speed: rand(0.015, 0.045),
        // 중심=흰색/노랑, 팔=파랑/보라/노랑
        color: isCore
          ? (Math.random() < 0.6 ? '#fffde0' : '#ffd600')
          : (['#c8e0ff','#a0c4ff','#ffd600','#ffe680','#ffffff'][Math.floor(Math.random() * 5)]),
        alpha: 0.1 + brightness * 0.7,
        twinkleAmp: isCore ? 0.1 : rand(0.2, 0.6),
      });
    }
  }

  function initStars() {
    stars.length = 0;
    for (let i = 0; i < 80; i++) {
      stars.push({
        x: snap(rand(0, W)), y: snap(rand(0, H)),
        size: Math.random() < 0.2 ? PIXEL * 2 : PIXEL,
        phase: rand(0, Math.PI * 2),
        speed: rand(0.01, 0.03),
        color: Math.random() < 0.6 ? '#fff' : COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: rand(0.08, 0.35),
      });
    }
  }

  function initBlocks() {
    blocks.length = 0;
    for (let i = 0; i < 14; i++) {
      blocks.push(makeBlock());
    }
  }

  function makeBlock() {
    return {
      x: snap(sideX()),
      y: snap(rand(H * 0.3, H)),
      vx: (Math.random() < 0.5 ? 1 : -1) * rand(0.3, 0.9),
      vy: -rand(0.5, 1.4),
      size: PIXEL * (Math.random() < 0.4 ? 2 : 1),
      color: COLORS[Math.floor(Math.random() * 5)],
      alpha: rand(0.12, 0.28),
      life: 1.0,
      decay: rand(0.003, 0.006),
    };
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // 배경
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0,   '#06060f');
    bg.addColorStop(0.5, '#0c0c1e');
    bg.addColorStop(1,   '#080810');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // 픽셀 그리드 (아주 연하게)
    ctx.strokeStyle = 'rgba(255,214,0,0.025)';
    ctx.lineWidth = 1;
    const GRID = 24;
    for (let x = 0; x < W; x += GRID) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += GRID) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    const t = performance.now() / 1000;

    // 갤럭시 글로우 (중심부 빛 번짐)
    const glow = ctx.createRadialGradient(GX, GY, 0, GX, GY, 90);
    glow.addColorStop(0,   'rgba(180,160,255,0.12)');
    glow.addColorStop(0.4, 'rgba(100,80,200,0.06)');
    glow.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // 갤럭시 별 렌더링
    galStars.forEach(s => {
      const tw = s.alpha * (1 - s.twinkleAmp + s.twinkleAmp * (0.5 + 0.5 * Math.sin(s.phase + t * s.speed * 60)));
      ctx.globalAlpha = Math.min(1, tw);
      ctx.fillStyle = s.color;
      ctx.fillRect(snap(s.x), snap(s.y), s.size, s.size);
    });

    // 일반 배경 별
    stars.forEach(s => {
      const tw = s.alpha * (0.5 + 0.5 * Math.sin(s.phase + t * s.speed * 60));
      ctx.globalAlpha = tw;
      ctx.fillStyle = s.color;
      ctx.fillRect(snap(s.x), snap(s.y), s.size, s.size);
      // 큰 별 십자
      if (s.size === PIXEL * 2 && tw > 0.2) {
        ctx.globalAlpha = tw * 0.35;
        ctx.fillRect(snap(s.x) - PIXEL*2, snap(s.y) + PIXEL/2, PIXEL*6, PIXEL);
        ctx.fillRect(snap(s.x) + PIXEL/2, snap(s.y) - PIXEL*2, PIXEL, PIXEL*6);
      }
    });

    // 픽셀 블록
    blocks.forEach(b => {
      ctx.globalAlpha = b.alpha * b.life;
      ctx.fillStyle = b.color;
      ctx.fillRect(snap(b.x), snap(b.y), b.size, b.size);
    });

    ctx.globalAlpha = 1;
  }

  function update() {
    blocks.forEach(b => {
      b.x += b.vx;
      b.y += b.vy;
      b.life -= b.decay;
      if (b.life <= 0 || b.y < -PIXEL * 6) {
        Object.assign(b, makeBlock());
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
    initGalaxy();
    initStars();
    initBlocks();
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(animate);
})();
