(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  const PIXEL = 8; // 픽셀 단위
  let W, H;

  // 별 파티클
  const stars = [];
  const STAR_COUNT = 60;

  // 떠다니는 픽셀 블록
  const blocks = [];
  const BLOCK_COUNT = 18;

  const COLORS = ['#ffd600', '#ff294d', '#00e5ff', '#69ff47', '#ff9800'];

  function snap(v) { return Math.round(v / PIXEL) * PIXEL; }

  function initStars() {
    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        size: Math.random() < 0.3 ? 2 : 1,
        phase: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.03,
        color: Math.random() < 0.7 ? '#fff' : COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
  }

  function initBlocks() {
    blocks.length = 0;
    const lpL = (W - 390) / 2;
    const lpR = lpL + 390;
    for (let i = 0; i < BLOCK_COUNT; i++) {
      let x;
      if (lpL < 80) {
        x = Math.random() * W;
      } else {
        x = Math.random() < 0.5
          ? Math.random() * (lpL - 40)
          : lpR + 40 + Math.random() * (W - lpR - 40);
      }
      blocks.push({
        x: snap(x),
        y: snap(Math.random() * H),
        vx: (Math.random() < 0.5 ? 1 : -1) * (PIXEL * 0.3 + Math.random() * PIXEL * 0.3),
        vy: -PIXEL * (0.2 + Math.random() * 0.4),
        size: PIXEL * (Math.random() < 0.4 ? 2 : 1),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 0.15 + Math.random() * 0.25,
        life: 1.0,
        decay: 0.002 + Math.random() * 0.003,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // 배경 — 다크 네이비/블랙 그라데이션
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0,   '#0a0a1a');
    bg.addColorStop(0.5, '#111122');
    bg.addColorStop(1,   '#0d0d0d');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // 미묘한 픽셀 그리드 (아주 연하게)
    ctx.strokeStyle = 'rgba(255,214,0,0.03)';
    ctx.lineWidth = 1;
    const GRID = 24;
    for (let x = 0; x < W; x += GRID) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += GRID) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    const now = performance.now() / 1000;

    // 별 반짝임
    stars.forEach(s => {
      const tw = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(s.phase + now * s.speed * 60));
      ctx.globalAlpha = tw * 0.7;
      ctx.fillStyle = s.color;
      // 픽셀 단위로 snap
      const sx = snap(s.x), sy = snap(s.y);
      ctx.fillRect(sx, sy, s.size * PIXEL / 2, s.size * PIXEL / 2);

      // 큰 별은 십자 빛
      if (s.size === 2 && tw > 0.7) {
        ctx.globalAlpha = (tw - 0.7) * 0.4;
        ctx.fillRect(sx - PIXEL, sy + PIXEL/4, PIXEL * 3, PIXEL / 2);
        ctx.fillRect(sx + PIXEL/4, sy - PIXEL, PIXEL / 2, PIXEL * 3);
      }
    });

    // 떠다니는 픽셀 블록
    blocks.forEach(b => {
      ctx.globalAlpha = b.alpha * b.life;
      ctx.fillStyle = b.color;
      ctx.fillRect(snap(b.x), snap(b.y), b.size, b.size);
    });

    ctx.globalAlpha = 1;
  }

  function update() {
    const now = performance.now() / 1000;
    const lpL = (W - 390) / 2;
    const lpR = lpL + 390;

    // 블록 업데이트
    blocks.forEach((b, i) => {
      b.x += b.vx * 0.016 * 60;
      b.y += b.vy * 0.016 * 60;
      b.life -= b.decay;

      // 수명 다하면 재생성
      if (b.life <= 0 || b.y < -PIXEL * 4) {
        let x;
        if (lpL < 80) {
          x = Math.random() * W;
        } else {
          x = Math.random() < 0.5
            ? Math.random() * (lpL - 40)
            : lpR + 40 + Math.random() * (W - lpR - 40);
        }
        b.x = snap(x);
        b.y = snap(H + PIXEL * 2);
        b.vx = (Math.random() < 0.5 ? 1 : -1) * (PIXEL * 0.3 + Math.random() * PIXEL * 0.3);
        b.vy = -PIXEL * (0.2 + Math.random() * 0.4);
        b.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        b.alpha = 0.15 + Math.random() * 0.25;
        b.life = 1.0;
        b.decay = 0.002 + Math.random() * 0.003;
      }
    });
  }

  let lastTime = 0;
  function animate(ts) {
    const dt = ts - lastTime;
    lastTime = ts;
    if (dt < 100) update();
    draw();
    requestAnimationFrame(animate);
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initStars();
    initBlocks();
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(animate);
})();
