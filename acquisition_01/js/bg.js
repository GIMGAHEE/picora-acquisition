(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  const BG_TOP    = '#d4edaa';
  const BG_BOTTOM = '#fffce0';
  const COLOR     = '#7ab82a';

  const icons = [
    // スマホ
    function (ctx, x, y, s) {
      ctx.beginPath(); ctx.roundRect(x - s*0.38, y - s*0.58, s*0.76, s*1.16, s*0.16); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y + s*0.42, s*0.08, 0, Math.PI*2); ctx.stroke();
    },
    // コイン（P）
    function (ctx, x, y, s) {
      ctx.beginPath(); ctx.arc(x, y, s*0.46, 0, Math.PI*2); ctx.stroke();
      ctx.font = `bold ${s*0.46}px sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('P', x, y + 1);
    },
    // ショッピングバッグ
    function (ctx, x, y, s) {
      ctx.beginPath(); ctx.roundRect(x - s*0.42, y - s*0.28, s*0.84, s*0.76, s*0.10); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - s*0.18, y - s*0.28);
      ctx.quadraticCurveTo(x - s*0.18, y - s*0.65, x, y - s*0.65);
      ctx.quadraticCurveTo(x + s*0.18, y - s*0.65, x + s*0.18, y - s*0.28);
      ctx.stroke();
    },
    // ギフト
    function (ctx, x, y, s) {
      ctx.beginPath(); ctx.roundRect(x - s*0.42, y - s*0.12, s*0.84, s*0.60, s*0.08); ctx.stroke();
      ctx.beginPath(); ctx.rect(x - s*0.42, y - s*0.28, s*0.84, s*0.18); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, y - s*0.28); ctx.lineTo(x, y + s*0.48); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, y - s*0.28);
      ctx.bezierCurveTo(x - s*0.28, y - s*0.58, x - s*0.48, y - s*0.12, x, y - s*0.12); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, y - s*0.28);
      ctx.bezierCurveTo(x + s*0.28, y - s*0.58, x + s*0.48, y - s*0.12, x, y - s*0.12); ctx.stroke();
    },
    // 星
    function (ctx, x, y, s) {
      const pts = 5, r1 = s*0.48, r2 = s*0.20;
      ctx.beginPath();
      for (let i = 0; i < pts*2; i++) {
        const r = i%2===0 ? r1 : r2;
        const a = (i*Math.PI/pts) - Math.PI/2;
        i===0 ? ctx.moveTo(x+r*Math.cos(a), y+r*Math.sin(a))
              : ctx.lineTo(x+r*Math.cos(a), y+r*Math.sin(a));
      }
      ctx.closePath(); ctx.stroke();
    },
    // クレジットカード
    function (ctx, x, y, s) {
      ctx.beginPath(); ctx.roundRect(x - s*0.52, y - s*0.32, s*1.04, s*0.64, s*0.09); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - s*0.52, y - s*0.08); ctx.lineTo(x + s*0.52, y - s*0.08); ctx.stroke();
      ctx.beginPath(); ctx.roundRect(x - s*0.38, y + s*0.06, s*0.28, s*0.14, s*0.04); ctx.stroke();
    },
    // ハート
    function (ctx, x, y, s) {
      ctx.beginPath();
      ctx.moveTo(x, y + s*0.38);
      ctx.bezierCurveTo(x - s*0.58, y + s*0.05, x - s*0.58, y - s*0.46, x, y - s*0.14);
      ctx.bezierCurveTo(x + s*0.58, y - s*0.46, x + s*0.58, y + s*0.05, x, y + s*0.38);
      ctx.stroke();
    },
    // 財布
    function (ctx, x, y, s) {
      ctx.beginPath(); ctx.roundRect(x - s*0.48, y - s*0.32, s*0.96, s*0.64, s*0.10); ctx.stroke();
      ctx.beginPath(); ctx.roundRect(x + s*0.06, y - s*0.18, s*0.32, s*0.36, s*0.10); ctx.stroke();
      ctx.beginPath(); ctx.arc(x + s*0.24, y, s*0.09, 0, Math.PI*2); ctx.stroke();
    },
    // アンケート用紙
    function (ctx, x, y, s) {
      ctx.beginPath(); ctx.roundRect(x - s*0.38, y - s*0.56, s*0.76, s*1.12, s*0.08); ctx.stroke();
      [-0.28, -0.04, 0.20].forEach(dy => {
        ctx.beginPath(); ctx.moveTo(x - s*0.20, y + s*dy); ctx.lineTo(x + s*0.20, y + s*dy); ctx.stroke();
      });
    },
    // リボン（かわいい）
    function (ctx, x, y, s) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(x - s*0.1, y - s*0.3, x - s*0.5, y - s*0.4, x - s*0.48, y - s*0.05);
      ctx.bezierCurveTo(x - s*0.46, y + s*0.3, x - s*0.1, y + s*0.2, x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(x + s*0.1, y - s*0.3, x + s*0.5, y - s*0.4, x + s*0.48, y - s*0.05);
      ctx.bezierCurveTo(x + s*0.46, y + s*0.3, x + s*0.1, y + s*0.2, x, y);
      ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y, s*0.09, 0, Math.PI*2); ctx.stroke();
    },
  ];

  function drawIcon(iconFn, x, y, size, angle, alpha) {
    ctx.save();
    ctx.translate(x, y); ctx.rotate(angle);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = COLOR;
    ctx.fillStyle   = COLOR;
    ctx.lineWidth   = size * 0.11;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    iconFn(ctx, 0, 0, size);
    ctx.restore();
  }

  function draw() {
    // グラデーション背景
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, BG_TOP);
    grad.addColorStop(1, BG_BOTTOM);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const lpLeft  = (canvas.width - 390) / 2;
    const lpRight = lpLeft + 390;

    // 2レイヤー：小さいのと大きいの
    const layers = [
      { GRID: 55, SIZE: 16, alphaBase: 0.50, offsetY: 0 },
      { GRID: 88, SIZE: 28, alphaBase: 0.32, offsetY: 44 },
    ];

    layers.forEach(({ GRID, SIZE, alphaBase, offsetY }, li) => {
      let idx = li * 41;
      for (let row = 0; row * GRID < canvas.height + GRID; row++) {
        for (let col = 0; col * GRID < canvas.width + GRID; col++) {
          const x = col * GRID + (row % 2 === 0 ? 0 : GRID * 0.5);
          const y = row * GRID + offsetY;
          const inLP = x + SIZE > lpLeft - 8 && x - SIZE < lpRight + 8;
          if (inLP) { idx++; continue; }
          const angle = ((row * 13 + col * 7 + li * 17) % 32 - 16) * (Math.PI / 180) * 2;
          const alpha = alphaBase * (0.65 + 0.35 * Math.abs(Math.sin(row * 0.7 + col)));
          drawIcon(icons[(row * 3 + col * 7 + idx) % icons.length], x, y, SIZE, angle, alpha);
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
