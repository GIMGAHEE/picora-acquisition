(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  const P = 16; // 픽셀 블록 크기
  let W, H;

  // 블록 팔레트
  const GRASS_COLORS = [
    '#4caf1a','#56c41e','#3d9614','#6dd428','#48b018','#5ec822','#3a8c12','#62d020'
  ];
  const DIRT_COLORS = [
    '#8b5e3c','#7a4f2e','#9e6b40','#6e4428','#a07040','#855a34','#7c5232','#966038'
  ];
  const DARK_COLORS = [
    '#1a0f00','#120a00','#201200','#160c00','#1e1000'
  ];
  const STONE_COLORS = [
    '#555','#666','#4a4a4a','#5c5c5c','#606060'
  ];
  // PICORA 테마 컬러 강조 블록
  const ACCENT = ['#ffd600','#ff294d','#00e5ff'];

  function rc(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function noise(x, y, seed) {
    const n = Math.sin(x * 127.1 + y * 311.7 + seed) * 43758.5453;
    return n - Math.floor(n);
  }

  let tileMap = [];

  function buildMap() {
    const cols = Math.ceil(W / P) + 2;
    const rows = Math.ceil(H / P) + 2;
    tileMap = [];

    // 지평선 위치: 상단 30% ~ 40% 사이
    const horizonRow = Math.floor(rows * 0.32);

    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        const n = noise(c, r, 42);
        const n2 = noise(c * 2, r, 99);

        // LP 중앙 영역 (너비 좁으면 전체, 넓으면 사이드만)
        const px = c * P;
        const lpL = (W - 390) / 2;
        const lpR = lpL + 390;
        const inLP = W > 500 && px > lpL - P && px < lpR + P;

        if (inLP) {
          // LP 영역은 거의 투명한 어두운 블록
          row.push({ type: 'empty' });
          continue;
        }

        if (r < horizonRow - 1) {
          // 하늘 영역 → 어두운 공간 (게임 배경)
          if (n < 0.04) row.push({ type: 'accent', color: rc(ACCENT) });
          else if (n < 0.08) row.push({ type: 'stone', color: rc(STONE_COLORS) });
          else row.push({ type: 'dark', color: rc(DARK_COLORS) });
        } else if (r === horizonRow - 1) {
          // 잔디 최상단 레이어
          row.push({ type: 'grass_top', color: rc(GRASS_COLORS) });
        } else if (r <= horizonRow + 1) {
          // 잔디 레이어
          row.push({ type: 'grass', color: rc(GRASS_COLORS) });
        } else if (r <= horizonRow + 4) {
          // 흙 레이어
          row.push({ type: 'dirt', color: rc(DIRT_COLORS) });
        } else {
          // 더 깊은 흙/돌
          if (n2 < 0.15) row.push({ type: 'stone', color: rc(STONE_COLORS) });
          else row.push({ type: 'dirt_deep', color: rc(DARK_COLORS) });
        }
      }
      tileMap.push(row);
    }
  }

  // 떠다니는 픽셀 파티클 (잔디에서 올라오는 느낌)
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
      y: Math.round(H * 0.35 / P) * P,
      vy: -(0.4 + Math.random() * 0.8),
      color: Math.random() < 0.6 ? rc(GRASS_COLORS) : rc(ACCENT),
      alpha: 0.5 + Math.random() * 0.4,
      life: 1.0,
      decay: 0.008 + Math.random() * 0.012,
      size: Math.random() < 0.3 ? P * 2 : P,
    };
  }

  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < 20; i++) {
      const p = makeParticle();
      p.life = Math.random(); // 분산된 초기 수명
      p.y -= Math.random() * H * 0.3;
      particles.push(p);
    }
  }

  // 별 (하늘 영역)
  const stars = [];
  function initStars() {
    stars.length = 0;
    const horizonY = H * 0.32;
    for (let i = 0; i < 60; i++) {
      const lpL = (W - 390) / 2;
      const lpR = lpL + 390;
      let x;
      if (W <= 500) x = Math.random() * W;
      else x = Math.random() < 0.5
        ? Math.random() * (lpL - 10)
        : lpR + 10 + Math.random() * (W - lpR - 10);

      stars.push({
        x: Math.round(x / P) * P,
        y: Math.round(Math.random() * horizonY / P) * P,
        phase: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.04,
        color: Math.random() < 0.7 ? '#fff' : rc(ACCENT),
        size: Math.random() < 0.2 ? P * 2 : P,
      });
    }
  }

  function drawTiles() {
    tileMap.forEach((row, r) => {
      row.forEach((tile, c) => {
        if (tile.type === 'empty') return;

        const x = c * P - P;
        const y = r * P - P;
        let alpha = 1;

        switch(tile.type) {
          case 'dark':      alpha = 0.85; break;
          case 'stone':     alpha = 0.70; break;
          case 'accent':    alpha = 0.40; break;
          case 'grass_top': alpha = 1.0;  break;
          case 'grass':     alpha = 0.95; break;
          case 'dirt':      alpha = 0.90; break;
          case 'dirt_deep': alpha = 0.80; break;
        }

        ctx.globalAlpha = alpha;
        ctx.fillStyle = tile.color;
        ctx.fillRect(x, y, P - 1, P - 1);

        // 잔디 블록 하이라이트
        if (tile.type === 'grass_top' || tile.type === 'grass') {
          ctx.globalAlpha = alpha * 0.3;
          ctx.fillStyle = '#a0e050';
          ctx.fillRect(x, y, P - 1, 3);
        }
        // 흙 블록 질감
        if (tile.type === 'dirt' || tile.type === 'dirt_deep') {
          ctx.globalAlpha = alpha * 0.15;
          ctx.fillStyle = '#fff';
          ctx.fillRect(x + 2, y + 2, 3, 3);
        }
      });
    });
    ctx.globalAlpha = 1;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // 배경 (하늘 = 어두운 스페이스)
    ctx.fillStyle = '#080810';
    ctx.fillRect(0, 0, W, H);

    drawTiles();

    const t = performance.now() / 1000;

    // 별
    stars.forEach(s => {
      const alpha = 0.3 + 0.5 * (0.5 + 0.5 * Math.sin(s.phase + t * s.speed * 60));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = s.color;
      ctx.fillRect(s.x, s.y, s.size, s.size);
    });

    // 파티클 (잔디에서 올라오는 픽셀)
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
      if (p.life <= 0) {
        particles[i] = makeParticle();
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
    buildMap();
    initParticles();
    initStars();
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(animate);
})();
