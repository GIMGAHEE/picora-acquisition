(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  // ③ 金融クリーン型 — ダークネイビー + ゴールドの幾何学パターン
  const NAVY  = '#0d1b3e';
  const GOLD  = '#c9a84c';
  const ALPHA = 0.22;

  const shapes = [
    // ダイヤモンド
    function(ctx, x, y, s) {
      ctx.beginPath();
      ctx.moveTo(x, y - s*0.50);
      ctx.lineTo(x + s*0.36, y);
      ctx.lineTo(x, y + s*0.50);
      ctx.lineTo(x - s*0.36, y);
      ctx.closePath(); ctx.stroke();
    },
    // 正方形（回転）
    function(ctx, x, y, s) {
      ctx.beginPath();
      ctx.rect(x - s*0.36, y - s*0.36, s*0.72, s*0.72);
      ctx.stroke();
    },
    // 円
    function(ctx, x, y, s) {
      ctx.beginPath(); ctx.arc(x, y, s*0.44, 0, Math.PI*2); ctx.stroke();
    },
    // 二重円
    function(ctx, x, y, s) {
      ctx.beginPath(); ctx.arc(x, y, s*0.44, 0, Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y, s*0.24, 0, Math.PI*2); ctx.stroke();
    },
    // クロス
    function(ctx, x, y, s) {
      ctx.beginPath(); ctx.moveTo(x - s*0.40, y); ctx.lineTo(x + s*0.40, y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, y - s*0.40); ctx.lineTo(x, y + s*0.40); ctx.stroke();
    },
    // 三角形
    function(ctx, x, y, s) {
      ctx.beginPath();
      ctx.moveTo(x, y - s*0.46);
      ctx.lineTo(x + s*0.40, y + s*0.28);
      ctx.lineTo(x - s*0.40, y + s*0.28);
      ctx.closePath(); ctx.stroke();
    },
    // 小さい点
    function(ctx, x, y, s) {
      ctx.beginPath(); ctx.arc(x, y, s*0.12, 0, Math.PI*2); ctx.fill();
    },
  ];

  function drawShape(shapeFn, x, y, size, angle, alpha) {
    ctx.save();
    ctx.translate(x, y); ctx.rotate(angle);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = GOLD;
    ctx.fillStyle = GOLD;
    ctx.lineWidth = 0.8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    shapeFn(ctx, 0, 0, size);
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ネイビー背景
    ctx.fillStyle = NAVY;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2レイヤー
    const layers = [
      { GRID: 60, SIZE: 14, alphaBase: 0.20 },
      { GRID: 100, SIZE: 28, alphaBase: 0.12 },
    ];

    layers.forEach(({ GRID, SIZE, alphaBase }, li) => {
      let idx = li * 47;
      for (let row = 0; row * GRID < canvas.height + GRID; row++) {
        for (let col = 0; col * GRID < canvas.width + GRID; col++) {
          const x = col * GRID + (row % 2 === 0 ? 0 : GRID * 0.5);
          const y = row * GRID + (li === 1 ? GRID * 0.5 : 0);
          const angle = ((row * 11 + col * 7 + li * 13) % 8) * (Math.PI / 4);
          const t = Math.abs(Math.sin(row * 0.8 + col * 1.2));
          const alpha = alphaBase * (0.6 + 0.4 * t);
          drawShape(shapes[(row * 3 + col * 7 + idx) % shapes.length], x, y, SIZE, angle, alpha);
          idx++;
        }
      }
    });
  }

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
  }

  window.addEventListener('resize', resize);
  resize();
})();
