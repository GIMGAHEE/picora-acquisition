(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  const NAVY_DARK  = '#050e24';
  const NAVY_MID   = '#0a1a3a';
  const NAVY_LIGHT = '#0d2050';
  const DOT_COLOR  = 'rgba(100,160,255,';
  const LINE_COLOR = 'rgba(80,140,220,';
  const GLOW_COLOR = 'rgba(120,180,255,';

  let particles = [];
  let W, H;
  const PARTICLE_COUNT = 80;
  const CONNECT_DIST   = 160;
  const LP_LEFT  = () => (W - 390) / 2;
  const LP_RIGHT = () => LP_LEFT() + 390;

  function createParticle() {
    // 사이드에만 배치
    let x;
    const lpL = LP_LEFT();
    const lpR = LP_RIGHT();
    if (lpL < 60) {
      // 화면이 좁으면 전체에 배치
      x = Math.random() * W;
    } else {
      // 양쪽 사이드 랜덤
      const side = Math.random() < 0.5 ? 'left' : 'right';
      x = side === 'left'
        ? Math.random() * (lpL - 20)
        : lpR + 20 + Math.random() * (W - lpR - 20);
    }
    return {
      x,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2.2 + 0.8,
      alpha: Math.random() * 0.6 + 0.3,
      // 가끔 반짝이는 파티클
      glow: Math.random() < 0.15,
      glowPhase: Math.random() * Math.PI * 2,
      glowSpeed: 0.02 + Math.random() * 0.03,
    };
  }

  function init() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  function drawBackground() {
    // 다크 네이비 그라데이션
    const grad = ctx.createRadialGradient(W * 0.3, H * 0.3, 0, W * 0.3, H * 0.3, W * 0.8);
    grad.addColorStop(0,   '#0d2050');
    grad.addColorStop(0.5, '#0a1535');
    grad.addColorStop(1,   '#050e24');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // 왼쪽 빛 번짐
    const glow1 = ctx.createRadialGradient(W * 0.1, H * 0.2, 0, W * 0.1, H * 0.2, W * 0.35);
    glow1.addColorStop(0, 'rgba(30,80,160,0.35)');
    glow1.addColorStop(1, 'rgba(30,80,160,0)');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, W, H);

    // 오른쪽 빛 번짐
    const glow2 = ctx.createRadialGradient(W * 0.85, H * 0.6, 0, W * 0.85, H * 0.6, W * 0.3);
    glow2.addColorStop(0, 'rgba(20,60,140,0.25)');
    glow2.addColorStop(1, 'rgba(20,60,140,0)');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, W, H);
  }

  function update() {
    const lpL = LP_LEFT();
    const lpR = LP_RIGHT();

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.glowPhase += p.glowSpeed;

      // 화면 밖으로 나가면 반대편에서 재생성
      if (p.x < -20 || p.x > W + 20 || p.y < -20 || p.y > H + 20) {
        const np = createParticle();
        Object.assign(p, np);
      }

      // LP 영역으로 들어가면 살짝 튕기기 (화면 넓을때만)
      if (lpL > 60) {
        if (p.x > lpL - 10 && p.x < lpL + 10 && p.vx > 0) p.vx *= -1;
        if (p.x > lpR - 10 && p.x < lpR + 10 && p.vx < 0) p.vx *= -1;
      }
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    drawBackground();

    const lpL = LP_LEFT();
    const lpR = LP_RIGHT();

    // 연결선 먼저
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist > CONNECT_DIST) continue;

        // LP 영역을 가로지르는 선 제외 (화면 넓을때)
        if (lpL > 60) {
          const minX = Math.min(a.x, b.x);
          const maxX = Math.max(a.x, b.x);
          if (minX < lpL && maxX > lpR) continue;
        }

        const alpha = (1 - dist / CONNECT_DIST) * 0.45;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = LINE_COLOR + alpha + ')';
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }

    // 파티클
    particles.forEach(p => {
      const glowAlpha = p.glow ? 0.15 + Math.sin(p.glowPhase) * 0.12 : 0;

      // 글로우 효과
      if (p.glow) {
        const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8);
        glowGrad.addColorStop(0, GLOW_COLOR + (glowAlpha * 2) + ')');
        glowGrad.addColorStop(1, GLOW_COLOR + '0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 8, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();
      }

      // 메인 점
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = DOT_COLOR + (p.alpha + glowAlpha) + ')';
      ctx.fill();

      // 하이라이트
      ctx.beginPath();
      ctx.arc(p.x - p.r * 0.25, p.y - p.r * 0.25, p.r * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200,230,255,' + (p.alpha * 0.5) + ')';
      ctx.fill();
    });
  }

  let animId;
  function animate() {
    update();
    draw();
    animId = requestAnimationFrame(animate);
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    init();
  }

  window.addEventListener('resize', resize);
  resize();
  animate();
})();
