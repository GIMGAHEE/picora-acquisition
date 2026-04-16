(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  function draw() {
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // 베이스 배경 - 흰색~연한 블루 그라데이션
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0,   '#ffffff');
    bg.addColorStop(0.4, '#eef4fb');
    bg.addColorStop(1,   '#d6e8f7');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // 로우폴리 삼각형 생성
    const seed = 42;
    function rng(n) {
      let x = Math.sin(n + seed) * 43758.5453;
      return x - Math.floor(x);
    }

    // 격자 기반 버텍스 생성
    const COLS = 10;
    const ROWS = Math.ceil(H / (W / COLS) * 1.2) + 2;
    const cellW = W / (COLS - 1);
    const cellH = H / (ROWS - 1);

    // 버텍스 배열 생성 (약간 랜덤 오프셋)
    const verts = [];
    for (let r = 0; r < ROWS; r++) {
      verts.push([]);
      for (let c = 0; c < COLS; c++) {
        const jx = (rng(r * 100 + c * 3 + 1) - 0.5) * cellW * 0.6;
        const jy = (rng(r * 100 + c * 3 + 2) - 0.5) * cellH * 0.6;
        verts[r].push([
          c * cellW + jx,
          r * cellH + jy
        ]);
      }
    }

    // 삼각형 그리기
    for (let r = 0; r < ROWS - 1; r++) {
      for (let c = 0; c < COLS - 1; c++) {
        const v0 = verts[r][c];
        const v1 = verts[r][c + 1];
        const v2 = verts[r + 1][c];
        const v3 = verts[r + 1][c + 1];

        // 각 삼각형마다 색상 결정
        [[v0, v1, v2], [v1, v3, v2]].forEach((tri, ti) => {
          const n = r * 20 + c * 2 + ti;
          const t = rng(n);

          // 위치 기반으로 밝기 변화 (왼쪽위=밝음, 오른쪽아래=파랑)
          const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3 / W;
          const cy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3 / H;
          const dist = cx * 0.6 + cy * 0.4;

          // 색상 범위: 흰색~연한 회청색
          const lightness = 1 - dist * 0.28 + (t - 0.5) * 0.12;
          const blueAmount = dist * 0.55 + (t - 0.5) * 0.12;

          const r_ = Math.round(255 * lightness);
          const g_ = Math.round(255 * lightness - blueAmount * 18);
          const b_ = Math.round(255 * lightness + blueAmount * 30);

          const alpha = 0.35 + t * 0.45;

          ctx.beginPath();
          ctx.moveTo(tri[0][0], tri[0][1]);
          ctx.lineTo(tri[1][0], tri[1][1]);
          ctx.lineTo(tri[2][0], tri[2][1]);
          ctx.closePath();

          ctx.fillStyle = `rgba(${Math.min(255,r_)},${Math.min(255,g_)},${Math.min(255,b_)},${alpha})`;
          ctx.fill();

          // 경계선 (아주 얇고 밝게)
          ctx.strokeStyle = `rgba(255,255,255,0.6)`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        });
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
