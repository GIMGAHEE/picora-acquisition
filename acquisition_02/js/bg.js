(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  const COLOR = '#5ba4f5';
  const ALPHA = 0.32;

  const icons = [
    // チェックマーク（丸）
    function(ctx, x, y, s) {
      ctx.beginPath(); ctx.arc(x, y, s*0.48, 0, Math.PI*2); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - s*0.22, y + s*0.02);
      ctx.lineTo(x - s*0.04, y + s*0.22);
      ctx.lineTo(x + s*0.26, y - s*0.20);
      ctx.stroke();
    },
    // 上昇グラフ
    function(ctx, x, y, s) {
      ctx.beginPath();
      ctx.moveTo(x - s*0.46, y + s*0.40);
      ctx.lineTo(x - s*0.46, y - s*0.40);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - s*0.46, y + s*0.40);
      ctx.lineTo(x + s*0.46, y + s*0.40);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - s*0.32, y + s*0.18);
      ctx.lineTo(x - s*0.08, y - s*0.08);
      ctx.lineTo(x + s*0.14, y - s*0.22);
      ctx.lineTo(x + s*0.36, y - s*0.38);
      ctx.stroke();
    },
    // コイン（¥）
    function(ctx, x, y, s) {
      ctx.beginPath(); ctx.arc(x, y, s*0.48, 0, Math.PI*2); ctx.stroke();
      ctx.font = `bold ${s*0.44}px sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('¥', x, y + 1);
    },
    // シールド
    function(ctx, x, y, s) {
      ctx.beginPath();
      ctx.moveTo(x, y - s*0.50);
      ctx.lineTo(x + s*0.36, y - s*0.22);
      ctx.lineTo(x + s*0.36, y + s*0.08);
      ctx.quadraticCurveTo(x + s*0.36, y + s*0.46, x, y + s*0.52);
      ctx.quadraticCurveTo(x - s*0.36, y + s*0.46, x - s*0.36, y + s*0.08);
      ctx.lineTo(x - s*0.36, y - s*0.22);
      ctx.closePath(); ctx.stroke();
    },
    // 星
    function(ctx, x, y, s) {
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
    // スマホ
    function(ctx, x, y, s) {
      ctx.beginPath(); ctx.roundRect(x-s*0.36, y-s*0.56, s*0.72, s*1.12, s*0.14); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y+s*0.42, s*0.07, 0, Math.PI*2); ctx.stroke();
    },
    // クレジットカード
    function(ctx, x, y, s) {
      ctx.beginPath(); ctx.roundRect(x-s*0.52, y-s*0.32, s*1.04, s*0.64, s*0.08); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x-s*0.52, y-s*0.08); ctx.lineTo(x+s*0.52, y-s*0.08); ctx.stroke();
      ctx.beginPath(); ctx.roundRect(x-s*0.38, y+s*0.06, s*0.28, s*0.14, s*0.04); ctx.stroke();
    },
    // 錠前（セキュリティ）
    function(ctx, x, y, s) {
      ctx.beginPath(); ctx.roundRect(x-s*0.36, y-s*0.10, s*0.72, s*0.56, s*0.08); ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y-s*0.10, s*0.26, Math.PI, 0);
      ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y+s*0.20, s*0.08, 0, Math.PI*2); ctx.stroke();
    },
  ];

  function drawIcon(iconFn, x, y, size, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.globalAlpha = ALPHA;
    ctx.strokeStyle = COLOR;
    ctx.fillStyle = COLOR;
    ctx.lineWidth = 1.4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    iconFn(ctx, 0, 0, size);
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#d6e8fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const GRID = 90;
    const ICON_SIZE = 22;
    let idx = 0;
    for (let row = 0; row * GRID < canvas.height + GRID; row++) {
      for (let col = 0; col * GRID < canvas.width + GRID; col++) {
        const x = col * GRID + (row % 2 === 0 ? 0 : GRID * 0.5);
        const y = row * GRID;
        const angle = ((row * 7 + col * 13) % 16 - 8) * (Math.PI / 180) * 3;
        const iconFn = icons[(row * 3 + col * 5 + idx) % icons.length];
        drawIcon(iconFn, x, y, ICON_SIZE, angle);
        idx++;
      }
    }
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
  }

  window.addEventListener('resize', resize);
  resize();
})();
