(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  function draw() {
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // 베이스: 순백색
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    // 오른쪽 하단으로 갈수록 블루그레이가 쌓이는 방향성
    // 원본처럼 평행사변형/마름모 계열 도형이 대각선 방향으로 겹침

    const shapes = [];
    const seed = (x, y) => {
      let h = x * 2654435761 ^ y * 2246822519;
      h = ((h >>> 16) ^ h) * 0x45d9f3b;
      h = ((h >>> 16) ^ h);
      return (h >>> 0) / 0xffffffff;
    };

    // 평행사변형 계열을 대각선 방향으로 배치
    const TILE = Math.min(W, H) * 0.13;
    const cols = Math.ceil(W / TILE) + 4;
    const rows = Math.ceil(H / TILE) + 4;

    for (let r = -2; r < rows; r++) {
      for (let c = -2; c < cols; c++) {
        const idx = (r + 10) * 100 + (c + 10);
        const t = seed(c + 50, r + 50);
        const t2 = seed(c + 80, r + 20);

        // 대각선 방향 위치 (왼쪽위=흰색, 오른쪽아래=블루)
        const diagRatio = ((c / cols) * 0.6 + (r / rows) * 0.4);

        // 색상: 흰색~회청색~연블루
        // 원본 이미지 색상 분석: 밝은부분 #f0f4f8, 어두운부분 #9ab5cc
        const brightness = 1 - diagRatio * 0.55 + (t - 0.5) * 0.15;
        const blue = diagRatio * 0.6 + (t2 - 0.5) * 0.1;

        const rv = Math.max(0, Math.min(255, Math.round(240 * brightness)));
        const gv = Math.max(0, Math.min(255, Math.round(248 * brightness - blue * 20)));
        const bv = Math.max(0, Math.min(255, Math.round(255 * brightness + blue * 8)));
        const alpha = 0.12 + t * 0.42 + diagRatio * 0.20;

        const x = c * TILE - TILE;
        const y = r * TILE - TILE;

        // 원본처럼 기울어진 평행사변형 (약 -15도 기울기)
        const skew = TILE * 0.35;
        const w = TILE * (0.7 + t2 * 0.6);
        const h2 = TILE * (0.5 + t * 0.5);

        ctx.save();
        ctx.globalAlpha = Math.min(0.75, alpha);
        ctx.fillStyle = `rgb(${rv},${gv},${bv})`;
        ctx.beginPath();
        ctx.moveTo(x + skew,      y);
        ctx.lineTo(x + skew + w,  y);
        ctx.lineTo(x + w,         y + h2);
        ctx.lineTo(x,             y + h2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    // 왼쪽 상단 흰색 페이드 오버레이
    const fadeL = ctx.createRadialGradient(W * 0.15, H * 0.2, 0, W * 0.15, H * 0.2, W * 0.55);
    fadeL.addColorStop(0, 'rgba(255,255,255,0.92)');
    fadeL.addColorStop(0.5, 'rgba(255,255,255,0.55)');
    fadeL.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = fadeL;
    ctx.fillRect(0, 0, W, H);
  }

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
  }

  window.addEventListener('resize', resize);
  resize();
})();
