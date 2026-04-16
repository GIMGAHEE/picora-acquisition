(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  // ② リスティング広告型 — ブルー系 + 数字・グラフ・チェック系アイコン
  const BG_TOP    = '#c8dcf8';
  const BG_BOTTOM = '#e8f0fd';
  const COLOR1    = '#1a6fe8';  // 濃いブルー
  const COLOR2    = '#5ba4f5';  // 薄いブルー

  const icons = [
    // チェックマーク（丸）
    function (ctx, x, y, s, col) {
      ctx.strokeStyle = col;
      ctx.lineWidth = s * 0.12;
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(x, y, s * 0.46, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - s*0.22, y);
      ctx.lineTo(x - s*0.04, y + s*0.2);
      ctx.lineTo(x + s*0.24, y - s*0.18);
      ctx.stroke();
    },
    // 上昇グラフ
    function (ctx, x, y, s, col) {
      ctx.strokeStyle = col;
      ctx.lineWidth = s * 0.1;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      // 軸
      ctx.beginPath();
      ctx.moveTo(x - s*0.48, y + s*0.42);
      ctx.lineTo(x - s*0.48, y - s*0.42);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - s*0.48, y + s*0.42);
      ctx.lineTo(x + s*0.48, y + s*0.42);
      ctx.stroke();
      // 折れ線
      ctx.beginPath();
      ctx.moveTo(x - s*0.35, y + s*0.2);
      ctx.lineTo(x - s*0.1, y - s*0.05);
      ctx.lineTo(x + s*0.15, y - s*0.2);
      ctx.lineTo(x + s*0.38, y - s*0.38);
      ctx.stroke();
    },
    // コイン（¥）
    function (ctx, x, y, s, col) {
      ctx.strokeStyle = col;
      ctx.lineWidth = s * 0.1;
      ctx.beginPath(); ctx.arc(x, y, s * 0.46, 0, Math.PI * 2); ctx.stroke();
      ctx.font = `bold ${s * 0.46}px sans-serif`;
      ctx.fillStyle = col;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('¥', x, y + 1);
    },
    // シールド（信頼）
    function (ctx, x, y, s, col) {
      ctx.strokeStyle = col;
      ctx.lineWidth = s * 0.1;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(x, y - s*0.5);
      ctx.lineTo(x + s*0.38, y - s*0.22);
      ctx.lineTo(x + s*0.38, y + s*0.1);
      ctx.quadraticCurveTo(x + s*0.38, y + s*0.48, x, y + s*0.52);
      ctx.quadraticCurveTo(x - s*0.38, y + s*0.48, x - s*0.38, y + s*0.1);
      ctx.lineTo(x - s*0.38, y - s*0.22);
      ctx.closePath(); ctx.stroke();
    },
    // 星（レビュー）
    function (ctx, x, y, s, col) {
      ctx.fillStyle = col;
      const pts = 5, r1 = s*0.46, r2 = s*0.18;
      ctx.beginPath();
      for (let i = 0; i < pts*2; i++) {
        const r = i%2===0 ? r1 : r2;
        const a = (i*Math.PI/pts) - Math.PI/2;
        i===0 ? ctx.moveTo(x+r*Math.cos(a), y+r*Math.sin(a))
              : ctx.lineTo(x+r*Math.cos(a), y+r*Math.sin(a));
      }
      ctx.closePath(); ctx.fill();
    },
    // スマホ（アウトライン）
    function (ctx, x, y, s, col) {
      ctx.strokeStyle = col;
      ctx.lineWidth = s * 0.1;
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.roundRect(x - s*0.34, y - s*0.54, s*0.68, s*1.08, s*0.14); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y + s*0.4, s*0.07, 0, Math.PI*2); ctx.stroke();
    },
  ];

  function drawIcon(iconFn, x, y, size, angle, alpha, col) {
    ctx.save();
    ctx.translate(x, y); ctx.rotate(angle);
    ctx.globalAlpha = alpha;
    iconFn(ctx, 0, 0, size, col);
    ctx.restore();
  }

  function draw() {
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, BG_TOP);
    grad.addColorStop(1, BG_BOTTOM);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const lpLeft  = (canvas.width - 390) / 2;
    const lpRight = lpLeft + 390;

    const layers = [
      { GRID: 58, SIZE: 13, alphaBase: 0.32 },
      { GRID: 96, SIZE: 26, alphaBase: 0.22 },
    ];

    layers.forEach(({ GRID, SIZE, alphaBase }, li) => {
      let idx = li * 37;
      for (let row = 0; row * GRID < canvas.height + GRID; row++) {
        for (let col = 0; col * GRID < canvas.width + GRID; col++) {
          const x = col * GRID + (row % 2 === 0 ? 0 : GRID * 0.5);
          const y = row * GRID + (li === 1 ? GRID * 0.5 : 0);
          const inLP = x + SIZE > lpLeft && x - SIZE < lpRight;
          if (inLP) { idx++; continue; }
          const angle = ((row * 9 + col * 11 + li * 5) % 20 - 10) * (Math.PI / 180) * 2;
          const alpha = alphaBase * (0.7 + 0.3 * Math.sin(row + col * 1.5));
          const col2  = (row + col) % 3 === 0 ? COLOR1 : COLOR2;
          drawIcon(icons[(row * 4 + col * 7 + idx) % icons.length], x, y, SIZE, angle, alpha, col2);
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
