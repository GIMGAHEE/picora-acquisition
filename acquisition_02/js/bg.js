(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  const COLOR = '#5ba4f5';
  const ALPHA = 0.28;

  const icons = [
    // スマホ
    function (ctx, x, y, s) {
      ctx.beginPath(); ctx.roundRect(x - s*0.4, y - s*0.6, s*0.8, s*1.2, s*0.12); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y + s*0.45, s*0.08, 0, Math.PI*2); ctx.stroke();
    },
    // コイン
    function (ctx, x, y, s) {
      ctx.beginPath(); ctx.arc(x, y, s*0.5, 0, Math.PI*2); ctx.stroke();
      ctx.font = `bold ${s*0.5}px sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('P', x, y + 1);
    },
    // ショッピングバッグ
    function (ctx, x, y, s) {
      ctx.beginPath(); ctx.roundRect(x - s*0.45, y - s*0.3, s*0.9, s*0.8, s*0.08); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - s*0.2, y - s*0.3);
      ctx.quadraticCurveTo(x - s*0.2, y - s*0.7, x, y - s*0.7);
      ctx.quadraticCurveTo(x + s*0.2, y - s*0.7, x + s*0.2, y - s*0.3);
      ctx.stroke();
    },
    // ギフト
    function (ctx, x, y, s) {
      ctx.beginPath(); ctx.roundRect(x - s*0.45, y - s*0.15, s*0.9, s*0.65, s*0.06); ctx.stroke();
      ctx.beginPath(); ctx.rect(x - s*0.45, y - s*0.3, s*0.9, s*0.18); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, y - s*0.3); ctx.lineTo(x, y + s*0.5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, y - s*0.3); ctx.bezierCurveTo(x - s*0.3, y - s*0.6, x - s*0.5, y - s*0.15, x, y - s*0.15); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, y - s*0.3); ctx.bezierCurveTo(x + s*0.3, y - s*0.6, x + s*0.5, y - s*0.15, x, y - s*0.15); ctx.stroke();
    },
    // クレジットカード
    function (ctx, x, y, s) {
      ctx.beginPath(); ctx.roundRect(x - s*0.55, y - s*0.35, s*1.1, s*0.7, s*0.08); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - s*0.55, y - s*0.1); ctx.lineTo(x + s*0.55, y - s*0.1); ctx.stroke();
      ctx.beginPath(); ctx.roundRect(x - s*0.42, y + s*0.05, s*0.3, s*0.16, s*0.04); ctx.stroke();
    },
    // 星
    function (ctx, x, y, s) {
      const pts = 5, r1 = s*0.5, r2 = s*0.22;
      ctx.beginPath();
      for (let i = 0; i < pts*2; i++) {
        const r = i%2===0 ? r1 : r2;
        const a = (i*Math.PI/pts) - Math.PI/2;
        i===0 ? ctx.moveTo(x + r*Math.cos(a), y + r*Math.sin(a)) : ctx.lineTo(x + r*Math.cos(a), y + r*Math.sin(a));
      }
      ctx.closePath(); ctx.stroke();
    },
    // アンケート
    function (ctx, x, y, s) {
      ctx.beginPath(); ctx.roundRect(x - s*0.4, y - s*0.6, s*0.8, s*1.2, s*0.06); ctx.stroke();
      [-0.3, -0.05, 0.2].forEach(dy => {
        ctx.beginPath(); ctx.moveTo(x - s*0.22, y + s*dy); ctx.lineTo(x + s*0.22, y + s*dy); ctx.stroke();
      });
    },
    // 財布
    function (ctx, x, y, s) {
      ctx.beginPath(); ctx.roundRect(x - s*0.5, y - s*0.35, s, s*0.7, s*0.1); ctx.stroke();
      ctx.beginPath(); ctx.roundRect(x + s*0.05, y - s*0.2, s*0.35, s*0.4, s*0.1); ctx.stroke();
      ctx.beginPath(); ctx.arc(x + s*0.25, y, s*0.1, 0, Math.PI*2); ctx.stroke();
    },
  ];

  function drawIcon(iconFn, x, y, size, angle) {
    ctx.save();
    ctx.translate(x, y); ctx.rotate(angle);
    ctx.globalAlpha = ALPHA;
    ctx.strokeStyle = COLOR; ctx.fillStyle = COLOR;
    ctx.lineWidth = 1.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    iconFn(ctx, 0, 0, size);
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#dce8fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const lpLeft  = (canvas.width - 390) / 2;
    const lpRight = lpLeft + 390;
    const GRID = 90, ICON_SIZE = 22;
    let idx = 0;

    for (let row = 0; row * GRID < canvas.height + GRID; row++) {
      for (let col = 0; col * GRID < canvas.width + GRID; col++) {
        const x = col * GRID + (row % 2 === 0 ? 0 : GRID * 0.5);
        const y = row * GRID;
        if (x + ICON_SIZE > lpLeft - 10 && x - ICON_SIZE < lpRight + 10) continue;
        const angle  = ((row * 7 + col * 13) % 16 - 8) * (Math.PI / 180) * 3;
        const iconFn = icons[(row * 3 + col * 5 + idx) % icons.length];
        drawIcon(iconFn, x, y, ICON_SIZE, angle);
        idx++;
      }
    }
  }

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
  }

  window.addEventListener('resize', resize);
  resize();
})();
