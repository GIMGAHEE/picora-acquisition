(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;

  // ⑥ グラフィック型 — ポップアート ハーフトーン + 星 + ダイヤ
  const COLORS = [
    'rgba(245,186,212,', // ピンク
    'rgba(225,180,246,', // パープル
    'rgba(255,229,90,',  // イエロー
    'rgba(125,133,190,', // インディゴ
    'rgba(255,122,190,', // ホットピンク
  ];

  const shapes = [];

  function makeShape() {
    const lpL = (W - 390) / 2;
    const lpR = lpL + 390;
    let x;
    if (W <= 500) x = Math.random() * W;
    else x = Math.random() < 0.5
      ? Math.random() * (lpL - 10)
      : lpR + 10 + Math.random() * (W - lpR - 10);

    const types = ['star', 'diamond', 'circle', 'cross'];
    return {
      x, y: H + 30,
      type: types[Math.floor(Math.random() * types.length)],
      size: 12 + Math.random() * 20,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(0.3 + Math.random() * 0.5),
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.025,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 0.4 + Math.random() * 0.3,
      life: 1.0,
      decay: 0.003 + Math.random() * 0.003,
    };
  }

  function drawShape(s) {
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.rot);
    ctx.globalAlpha = s.alpha * Math.min(1, s.life * 4);
    ctx.fillStyle = s.color + s.alpha + ')';
    ctx.strokeStyle = 'rgba(80,80,80,0.3)';
    ctx.lineWidth = 1;

    switch(s.type) {
      case 'star': {
        const pts = 4, r1 = s.size * 0.5, r2 = s.size * 0.2;
        ctx.beginPath();
        for (let i = 0; i < pts * 2; i++) {
          const r = i % 2 === 0 ? r1 : r2;
          const a = (i * Math.PI / pts) - Math.PI / 4;
          i === 0 ? ctx.moveTo(r*Math.cos(a), r*Math.sin(a)) : ctx.lineTo(r*Math.cos(a), r*Math.sin(a));
        }
        ctx.closePath(); ctx.fill(); ctx.stroke();
        break;
      }
      case 'diamond': {
        ctx.beginPath();
        ctx.moveTo(0, -s.size*0.55);
        ctx.lineTo(s.size*0.35, 0);
        ctx.lineTo(0, s.size*0.55);
        ctx.lineTo(-s.size*0.35, 0);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        break;
      }
      case 'circle': {
        ctx.beginPath();
        ctx.arc(0, 0, s.size * 0.42, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
        break;
      }
      case 'cross': {
        const t = s.size * 0.15, l = s.size * 0.5;
        ctx.beginPath();
        ctx.rect(-t, -l, t*2, l*2);
        ctx.fill(); ctx.stroke();
        ctx.beginPath();
        ctx.rect(-l, -t, l*2, t*2);
        ctx.fill(); ctx.stroke();
        break;
      }
    }
    ctx.restore();
  }

  function init() {
    shapes.length = 0;
    for (let i = 0; i < 30; i++) {
      const s = makeShape();
      s.y = Math.random() * H;
      s.life = 0.3 + Math.random() * 0.7;
      shapes.push(s);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // 배경 — 연한 라벤더
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0,   '#f5eeff');
    bg.addColorStop(0.5, '#f0e8ff');
    bg.addColorStop(1,   '#ece0ff');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // ハーフトーン ドット
    const DOT_SPACING = 20;
    for (let x = 0; x < W; x += DOT_SPACING) {
      for (let y = 0; y < H; y += DOT_SPACING) {
        const dist = Math.sqrt(Math.pow(x - W*0.5, 2) + Math.pow(y - H*0.5, 2));
        const r = 1.5 + (dist / (W * 0.8)) * 2.5;
        ctx.beginPath();
        ctx.arc(x, y, Math.min(r, 3.5), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(125,133,190,0.08)';
        ctx.fill();
      }
    }

    shapes.forEach(drawShape);
    ctx.globalAlpha = 1;
  }

  function update() {
    shapes.forEach((s, i) => {
      s.x += s.vx;
      s.y += s.vy;
      s.rot += s.rotSpeed;
      s.life -= s.decay;
      if (s.life <= 0 || s.y < -s.size * 2) shapes[i] = makeShape();
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
    init();
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(animate);
})();
