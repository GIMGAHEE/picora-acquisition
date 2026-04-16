(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  const P = 16;
  let W, H;

  // PICORA 게임 팔레트 — 검정 기반, 노랑/크림 포인트만
  const TILE_DARK   = ['#111111','#141414','#0f0f0f','#161616','#131313'];
  const TILE_MID    = ['#1e1e1e','#1a1a1a','#222222','#202020','#1c1c1c'];
  const TILE_GRASS  = ['#2a2a00','#333300','#2e2e00','#252500','#313100'];
  const TILE_GRASS2 = ['#ffd600','#e6c200','#f0cc00','#d4b400','#ffd000']; // 노란 잔디
  const TILE_DIRT   = ['#1a1000','#1e1200','#161000','#200e00','#1c1100'];

  function rc(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function noise(x, y) {
    const n = Math.sin(x * 127.1 + y * 311.7 + 42) * 43758.5453;
    return n - Math.floor(n);
  }

  let tileMap = [];

  function buildMap() {
    const cols = Math.ceil(W / P) + 2;
    const rows = Math.ceil(H / P) + 2;
    tileMap = [];

    const horizonRow = Math.floor(rows * 0.38);
    const lpL = (W - 390) / 2;
    const lpR = lpL + 390;

    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        const px = (c - 1) * P;
        const inLP = W > 500 && px > lpL - P && px < lpR + P;
        if (inLP) { row.push(null); continue; }

        const n = noise(c, r);

        if (r < horizonRow - 1) {
          // 하늘 — 거의 다 어두운 타일, 가끔 약간 밝은 타일
          if (n < 0.06) row.push({ color: rc(TILE_MID), alpha: 0.6 });
          else          row.push({ color: rc(TILE_DARK), alpha: 0.9 });
        } else if (r === horizonRow - 1) {
          // 잔디 하이라이트 (노랑 포인트 한줄)
          row.push({ color: n < 0.4 ? rc(TILE_GRASS2) : rc(TILE_GRASS), alpha: 0.85 });
        } else if (r <= horizonRow + 1) {
          // 잔디층
          row.push({ color: rc(TILE_GRASS), alpha: 0.8 });
        } else if (r <= horizonRow + 4) {
          // 흙층
          row.push({ color: rc(TILE_DIRT), alpha: 0.85 });
        } else {
          // 깊은 땅
          row.push({ color: rc(TILE_DARK), alpha: 0.9 });
        }
      }
      tileMap.push(row);
    }
  }

  // 별 — 흰색/크림만, 조용하게
  const stars = [];
  function initStars() {
    stars.length = 0;
    const horizonY = H * 0.38;
    const lpL = (W - 390) / 2;
    const lpR = lpL + 390;

    for (let i = 0; i < 55; i++) {
      let x;
      if (W <= 500) x = Math.random() * W;
      else x = Math.random() < 0.5
        ? Math.random() * (lpL - 10)
        : lpR + 10 + Math.random() * (W - lpR - 10);

      stars.push({
        x: Math.round(x / P) * P,
        y: Math.round(Math.random() * (horizonY * 0.9) / P) * P,
        phase: Math.random() * Math.PI * 2,
        speed: 0.015 + Math.random() * 0.025,
        size: Math.random() < 0.15 ? P * 2 : P,
        // 흰색 위주, 아주 가끔 크림/노랑
        color: Math.random() < 0.8 ? '#ffffff' : (Math.random() < 0.5 ? '#fffde0' : '#ffd600'),
        baseAlpha: 0.12 + Math.random() * 0.25,
      });
    }
  }

  // 파티클 — 잔디에서 올라오는 노란 픽셀, 소량만
  const particles = [];
  function makeParticle() {
    const lpL = (W - 390) / 2;
    const lpR = lpL + 390;
    let x;
    if (W <= 500) x = Math.random() * W;
    else x = Math.random() < 0.5
      ? Math.random() * (lpL - 20)
      : lpR + 20 + Math.random() * (W - lpR - 20);

    return {
      x: Math.round(x / P) * P,
      y: H * 0.38,
      vy: -(0.3 + Math.random() * 0.6),
      color: Math.random() < 0.7 ? '#ffd600' : '#f0ede4',
      alpha: 0.3 + Math.random() * 0.3,
      life: 1.0,
      decay: 0.006 + Math.random() * 0.008,
      size: P,
    };
  }

  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < 10; i++) {
      const p = makeParticle();
      p.life = Math.random();
      p.y -= Math.random() * H * 0.25;
      particles.push(p);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // 배경 — 순수 블랙
    ctx.fillStyle = '#0d0d0d';
    ctx.fillRect(0, 0, W, H);

    // 타일 렌더링
    tileMap.forEach((row, r) => {
      row.forEach((tile, c) => {
        if (!tile) return;
        ctx.globalAlpha = tile.alpha;
        ctx.fillStyle = tile.color;
        ctx.fillRect((c - 1) * P, (r - 1) * P, P - 1, P - 1);
      });
    });

    const t = performance.now() / 1000;

    // 별
    stars.forEach(s => {
      const a = s.baseAlpha * (0.5 + 0.5 * Math.sin(s.phase + t * s.speed * 60));
      ctx.globalAlpha = a;
      ctx.fillStyle = s.color;
      ctx.fillRect(s.x, s.y, s.size, s.size);
      // 큰 별 십자
      if (s.size === P * 2 && a > 0.15) {
        ctx.globalAlpha = a * 0.3;
        ctx.fillRect(s.x - P, s.y + P/2, P * 4, P/2);
        ctx.fillRect(s.x + P/2, s.y - P, P/2, P * 4);
      }
    });

    // 파티클
    particles.forEach(p => {
      ctx.globalAlpha = p.alpha * p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x / P) * P, Math.round(p.y / P) * P, p.size, p.size);
    });

    ctx.globalAlpha = 1;
  }

  function update() {
    particles.forEach((p, i) => {
      p.y += p.vy;
      p.life -= p.decay;
      if (p.life <= 0) particles[i] = makeParticle();
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
    buildMap();
    initStars();
    initParticles();
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(animate);
})();
