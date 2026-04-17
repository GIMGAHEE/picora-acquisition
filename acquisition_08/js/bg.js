/* acquisition_08 — コインゲーム型 background */
(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;

  const coins = [];

  function makeCoin() {
    const lpL = (W - 390) / 2;
    const lpR = lpL + 390;
    let x;
    if (W <= 500) return null;
    x = Math.random() < 0.5
      ? Math.random() * (lpL - 20)
      : lpR + 20 + Math.random() * (W - lpR - 20);

    const size = 14 + Math.random() * 20;
    return {
      x, y: H + size,
      vy: -(0.6 + Math.random() * 1.2),
      vx: (Math.random() - 0.5) * 0.4,
      size,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      alpha: 0.25 + Math.random() * 0.3,
      life: 1.0,
      decay: 0.004 + Math.random() * 0.003,
    };
  }

  function drawCoin(c) {
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.rot);
    ctx.globalAlpha = c.alpha * Math.min(1, c.life * 3);

    const scaleX = Math.abs(Math.cos(c.rot * 2));
    ctx.scale(scaleX, 1);

    // Coin body
    const g = ctx.createRadialGradient(-c.size*0.2, -c.size*0.2, 0, 0, 0, c.size);
    g.addColorStop(0, '#fff9c4');
    g.addColorStop(0.5, '#ffc107');
    g.addColorStop(1, '#e65100');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(0,0,c.size,0,Math.PI*2); ctx.fill();

    // Edge
    ctx.strokeStyle = '#e65100';
    ctx.lineWidth = c.size * 0.1;
    ctx.stroke();

    // Inner ring
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(0,0,c.size*0.7,0,Math.PI*2); ctx.stroke();

    // Shine
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath(); ctx.ellipse(-c.size*0.25, -c.size*0.3, c.size*0.2, c.size*0.12, -0.5, 0, Math.PI*2);
    ctx.fill();

    ctx.restore();
  }

  function init() {
    coins.length = 0;
    for (let i = 0; i < 20; i++) {
      const c = makeCoin();
      if (c) { c.y = Math.random() * H; c.life = 0.4 + Math.random() * 0.6; coins.push(c); }
    }
  }

  function draw() {
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle = '#e3f2fd';
    ctx.fillRect(0,0,W,H);
    coins.forEach(drawCoin);
    ctx.globalAlpha = 1;
  }

  function update() {
    coins.forEach((c,i) => {
      c.x += c.vx; c.y += c.vy;
      c.rot += c.rotSpeed;
      c.life -= c.decay;
      if (c.life <= 0 || c.y < -c.size * 2) {
        const nc = makeCoin();
        if (nc) coins[i] = nc;
      }
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
