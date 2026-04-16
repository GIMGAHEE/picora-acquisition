(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  const COLOR = '#5ba4f5';
  const ALPHA = 0.28;

  const shapes = [
    // 円（大）
    function(ctx, x, y, s) {
      ctx.beginPath(); ctx.arc(x, y, s*0.46, 0, Math.PI*2); ctx.stroke();
    },
    // 円（小・二重）
    function(ctx, x, y, s) {
      ctx.beginPath(); ctx.arc(x, y, s*0.46, 0, Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y, s*0.26, 0, Math.PI*2); ctx.stroke();
    },
    // 正方形
    function(ctx, x, y, s) {
      ctx.beginPath(); ctx.rect(x-s*0.38, y-s*0.38, s*0.76, s*0.76); ctx.stroke();
    },
    // 角丸四角形
    function(ctx, x, y, s) {
      ctx.beginPath(); ctx.roundRect(x-s*0.40, y-s*0.40, s*0.80, s*0.80, s*0.16); ctx.stroke();
    },
    // 正三角形
    function(ctx, x, y, s) {
      ctx.beginPath();
      ctx.moveTo(x, y - s*0.46);
      ctx.lineTo(x + s*0.40, y + s*0.28);
      ctx.lineTo(x - s*0.40, y + s*0.28);
      ctx.closePath(); ctx.stroke();
    },
    // 十字
    function(ctx, x, y, s) {
      ctx.beginPath(); ctx.moveTo(x, y-s*0.46); ctx.lineTo(x, y+s*0.46); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x-s*0.46, y); ctx.lineTo(x+s*0.46, y); ctx.stroke();
    },
    // ひし形
    function(ctx, x, y, s) {
      ctx.beginPath();
      ctx.moveTo(x, y-s*0.48);
      ctx.lineTo(x+s*0.34, y);
      ctx.lineTo(x, y+s*0.48);
      ctx.lineTo(x-s*0.34, y);
      ctx.closePath(); ctx.stroke();
    },
    // 水平線（短）
    function(ctx, x, y, s) {
      ctx.beginPath(); ctx.moveTo(x-s*0.44, y); ctx.lineTo(x+s*0.44, y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x-s*0.28, y-s*0.18); ctx.lineTo(x+s*0.28, y-s*0.18); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x-s*0.28, y+s*0.18); ctx.lineTo(x+s*0.28, y+s*0.18); ctx.stroke();
    },
    // プラス（細め）
    function(ctx, x, y, s) {
      ctx.lineWidth = s * 0.07;
      ctx.beginPath(); ctx.moveTo(x, y-s*0.38); ctx.lineTo(x, y+s*0.38); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x-s*0.38, y); ctx.lineTo(x+s*0.38, y); ctx.stroke();
    },
    // 半円
    function(ctx, x, y, s) {
      ctx.beginPath(); ctx.arc(x, y+s*0.06, s*0.42, Math.PI, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x-s*0.42, y+s*0.06); ctx.lineTo(x+s*0.42, y+s*0.06); ctx.stroke();
    },
  ];

  function drawShape(shapeFn, x, y, size, angle, alpha) {
    ctx.save();
    ctx.translate(x, y); ctx.rotate(angle);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = COLOR;
    ctx.fillStyle = COLOR;
    ctx.lineWidth = 1.3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    shapeFn(ctx, 0, 0, size);
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#d6e8fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2레이어: 작은 것 + 큰 것
    const layers = [
      { GRID: 56, SIZE: 14, alphaBase: 0.30 },
      { GRID: 96, SIZE: 26, alphaBase: 0.18 },
    ];

    layers.forEach(({ GRID, SIZE, alphaBase }, li) => {
      let idx = li * 53;
      for (let row = 0; row * GRID < canvas.height + GRID; row++) {
        for (let col = 0; col * GRID < canvas.width + GRID; col++) {
          const x = col * GRID + (row % 2 === 0 ? 0 : GRID * 0.5);
          const y = row * GRID + (li === 1 ? GRID * 0.48 : 0);
          const angle = ((row * 11 + col * 7 + li * 19) % 8) * (Math.PI / 4);  // 45도 단위로 깔끔하게
          const alpha = alphaBase * (0.7 + 0.3 * Math.sin(row * 1.1 + col * 0.7));
          drawShape(shapes[(row * 3 + col * 7 + idx) % shapes.length], x, y, SIZE, angle, alpha);
          idx++;
        }
      }
    });
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
  }

  window.addEventListener('resize', resize);
  resize();
})();
