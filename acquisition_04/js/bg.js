(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  // ④ ゲーム型 — ドット/ピクセルパターン背景
  const PIXEL = 20;
  let t = 0;

  const PALETTE = [
    'rgba(255,214,0,',   // yellow
    'rgba(255,41,77,',   // red
    'rgba(28,28,28,',    // black
    'rgba(248,246,241,', // cream
  ];

  function draw() {
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // 배경 블랙
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, W, H);

    // 픽셀 격자 패턴
    const cols = Math.ceil(W / PIXEL);
    const rows = Math.ceil(H / PIXEL);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const n = Math.sin(c * 0.3 + r * 0.2 + t) * Math.cos(c * 0.15 - r * 0.25 + t * 0.7);
        if (n < -0.85) {
          const ci = (c * 3 + r * 7) % PALETTE.length;
          const alpha = 0.08 + Math.abs(n) * 0.12;
          ctx.fillStyle = PALETTE[ci] + alpha + ')';
          ctx.fillRect(c * PIXEL, r * PIXEL, PIXEL - 1, PIXEL - 1);
        }
      }
    }

    // 흘러내리는 노란 픽셀 (게임 비 효과)
    const drops = 30;
    for (let i = 0; i < drops; i++) {
      const x = ((i * 137 + 50) % (W + 100)) - 50;
      const y = ((i * 83 + t * 60 * (0.5 + (i % 5) * 0.3)) % (H + PIXEL * 2)) - PIXEL;
      const alpha = 0.05 + (i % 4) * 0.04;
      ctx.fillStyle = `rgba(255,214,0,${alpha})`;
      ctx.fillRect(Math.floor(x / PIXEL) * PIXEL, Math.floor(y / PIXEL) * PIXEL, PIXEL - 1, PIXEL * (1 + i % 3) - 1);
    }
  }

  function animate() {
    t += 0.008;
    draw();
    requestAnimationFrame(animate);
  }

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();
  animate();
})();
