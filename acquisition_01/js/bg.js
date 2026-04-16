(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  // ① ポイントアプリ型 — 연두/노랑 그라데이션 배경 + 코인/별/선물 촘촘하게
  const BG_TOP    = '#c8e87a';
  const BG_BOTTOM = '#fff8c0';
  const COLOR     = '#7ab82a';
  const ALPHA     = 0.45;

  const icons = [
    // コイン（P）
    function (ctx, x, y, s) {
      ctx.beginPath(); ctx.arc(x, y, s * 0.48, 0, Math.PI * 2); ctx.fill();
      ctx.save();
      ctx.globalAlpha *= 1.6;
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.font = `bold ${s * 0.52}px sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('P', x, y + 1);
      ctx.restore();
    },
    // 星
    function (ctx, x, y, s) {
      const pts = 5, r1 = s * 0.48, r2 = s * 0.20;
      ctx.beginPath();
      for (let i = 0; i < pts * 2; i++) {
        const r = i % 2 === 0 ? r1 : r2;
        const a = (i * Math.PI / pts) - Math.PI / 2;
        i === 0 ? ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a))
                : ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
      }
      ctx.closePath(); ctx.fill();
    },
    // ギフトボックス
    function (ctx, x, y, s) {
      ctx.beginPath(); ctx.roundRect(x - s*0.42, y - s*0.1, s*0.84, s*0.58, s*0.06); ctx.fill();
      ctx.beginPath(); ctx.roundRect(x - s*0.42, y - s*0.28, s*0.84, s*0.2, s*0.04); ctx.fill();
      ctx.save();
      ctx.globalAlpha *= 0.4;
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.rect(x - s*0.06, y - s*0.28, s*0.12, s*0.86); ctx.fill();
      ctx.restore();
    },
    // ハート
    function (ctx, x, y, s) {
      ctx.beginPath();
      ctx.moveTo(x, y + s * 0.35);
      ctx.bezierCurveTo(x - s*0.6, y, x - s*0.6, y - s*0.5, x, y - s*0.15);
      ctx.bezierCurveTo(x + s*0.6, y - s*0.5, x + s*0.6, y, x, y + s*0.35);
      ctx.fill();
    },
    // スマホ（丸っこく）
    function (ctx, x, y, s) {
      ctx.beginPath(); ctx.roundRect(x - s*0.36, y - s*0.56, s*0.72, s*1.12, s*0.18); ctx.fill();
      ctx.save();
      ctx.globalAlpha *= 0.35;
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.roundRect(x - s*0.26, y - s*0.44, s*0.52, s*0.72, s*0.10); ctx.fill();
      ctx.restore();
    },
    // ダイヤ
    function (ctx, x, y, s) {
      ctx.beginPath();
      ctx.moveTo(x, y - s*0.5);
      ctx.lineTo(x + s*0.4, y - s*0.1);
      ctx.lineTo(x, y + s*0.5);
      ctx.lineTo(x - s*0.4, y - s*0.1);
      ctx.closePath(); ctx.fill();
    },
  ];

  function drawIcon(iconFn, x, y, size, angle, alpha) {
    ctx.save();
    ctx.translate(x, y); ctx.rotate(angle);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = COLOR;
    iconFn(ctx, 0, 0, size);
    ctx.restore();
  }

  function draw() {
    // グラデーション背景（全面）
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, BG_TOP);
    grad.addColorStop(1, BG_BOTTOM);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const lpLeft  = (canvas.width - 390) / 2;
    const lpRight = lpLeft + 390;

    // サイズ違いの2レイヤーで密度アップ
    const layers = [
      { GRID: 60, SIZE: 14, alphaBase: 0.38 },
      { GRID: 95, SIZE: 24, alphaBase: 0.28 },
    ];

    layers.forEach(({ GRID, SIZE, alphaBase }, li) => {
      let idx = li * 31;
      for (let row = 0; row * GRID < canvas.height + GRID; row++) {
        for (let col = 0; col * GRID < canvas.width + GRID; col++) {
          const x = col * GRID + (row % 2 === 0 ? 0 : GRID * 0.5);
          const y = row * GRID + (li === 1 ? GRID * 0.5 : 0);
          // LP中央は薄く描く（完全スキップしない）
          const inLP = x + SIZE > lpLeft && x - SIZE < lpRight;
          if (inLP) { idx++; continue; }
          const angle = ((row * 11 + col * 7 + li * 3) % 24 - 12) * (Math.PI / 180) * 2.5;
          const alpha = alphaBase * (0.7 + 0.3 * Math.sin(row * 0.9 + col * 1.3));
          drawIcon(icons[(row * 5 + col * 3 + idx) % icons.length], x, y, SIZE, angle, alpha);
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
