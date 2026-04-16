(function() {

  /* =====================================================
     PICORA ゲーム型 インタラクション
     - ボタン クリックエフェクト (ピクセル爆発)
     - ホバー シェイク
     - ポイント数字 カウントアップ
     - コイン アニメーション (ヘッダー)
     - カーソル ピクセル化
     - タイプライター テキスト
  ===================================================== */

  // ── 1. ピクセル爆発エフェクト ──
  const fxCanvas = document.createElement('canvas');
  fxCanvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:9999;pointer-events:none;';
  document.body.appendChild(fxCanvas);
  const fxCtx = fxCanvas.getContext('2d');

  function resizeFx() {
    fxCanvas.width  = window.innerWidth;
    fxCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeFx);
  resizeFx();

  const particles = [];
  const COLORS = ['#ffd600','#ff294d','#f8f6f1','#ffa500','#fff'];

  function spawnExplosion(x, y, count) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
      const speed = 2 + Math.random() * 4;
      const size  = 4 + Math.floor(Math.random() * 3) * 4; // 픽셀 단위
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        gravity: 0.18,
        size,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 1.0,
        decay: 0.03 + Math.random() * 0.04,
      });
    }
  }

  function spawnCoinPop(x, y) {
    for (let i = 0; i < 5; i++) {
      particles.push({
        x: x + (Math.random() - 0.5) * 40,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: -(3 + Math.random() * 3),
        gravity: 0.12,
        size: 8,
        color: '#ffd600',
        life: 1.0,
        decay: 0.025,
        isCoin: true,
        label: '+PT',
      });
    }
  }

  function updateFx() {
    fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += p.gravity;
      p.life -= p.decay;

      if (p.life <= 0) { particles.splice(i, 1); continue; }

      fxCtx.globalAlpha = p.life;
      if (p.isCoin) {
        // コイン
        fxCtx.fillStyle = p.color;
        fxCtx.beginPath();
        fxCtx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        fxCtx.fill();
        fxCtx.fillStyle = '#fff';
        fxCtx.font = `bold 7px "Press Start 2P"`;
        fxCtx.textAlign = 'center';
        fxCtx.textBaseline = 'middle';
        fxCtx.fillText('P', p.x, p.y);
      } else {
        // ピクセルブロック
        fxCtx.fillStyle = p.color;
        const s = Math.round(p.size * p.life / 4) * 4;
        if (s > 0) fxCtx.fillRect(
          Math.round(p.x / 4) * 4,
          Math.round(p.y / 4) * 4,
          s, s
        );
      }
    }
    fxCtx.globalAlpha = 1;
    requestAnimationFrame(updateFx);
  }
  requestAnimationFrame(updateFx);

  // ── 2. ボタン クリック + ホバー ──
  function addButtonFx(btn) {
    // ホバー シェイク
    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'none';
      let tick = 0;
      const shake = setInterval(() => {
        const dx = tick % 2 === 0 ? 2 : -2;
        btn.style.transform = `translateX(${dx}px)`;
        tick++;
        if (tick > 5) {
          clearInterval(shake);
          btn.style.transform = '';
        }
      }, 40);
    });

    // クリック 爆発
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;

      // 押し込みエフェクト
      btn.style.transform = 'translate(4px,4px)';
      btn.style.boxShadow = 'none';
      setTimeout(() => {
        btn.style.transform = '';
        btn.style.boxShadow = '';
      }, 120);

      spawnExplosion(cx, cy, 18);
      spawnCoinPop(cx, cy - 20);

      // SE風テキスト
      showSE('QUEST START!!', cx, cy - 60);
    });
  }

  document.querySelectorAll('.quest-btn').forEach(addButtonFx);

  // ── 3. SE風 テキストポップ ──
  function showSE(text, x, y) {
    const el = document.createElement('div');
    el.textContent = text;
    el.style.cssText = `
      position:fixed;
      left:${x}px; top:${y}px;
      transform:translate(-50%,-50%);
      font-family:"Press Start 2P",monospace;
      font-size:14px;
      color:#ffd600;
      text-shadow:2px 2px 0 #000,-2px -2px 0 #000,2px -2px 0 #000,-2px 2px 0 #000;
      pointer-events:none;
      z-index:99999;
      white-space:nowrap;
      transition:transform 0.5s ease-out, opacity 0.5s ease-out;
    `;
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      el.style.transform = `translate(-50%, calc(-50% - 50px))`;
      el.style.opacity = '0';
    });
    setTimeout(() => el.remove(), 600);
  }

  // ── 4. ポイント数字 カウントアップ ──
  const pointEl = document.querySelector('.point-num');
  if (pointEl) {
    const target = 2100;
    let current = 0;
    const duration = 1200;
    const start = performance.now();

    // 画面内に入ったらスタート
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // イーズアウト
          const ease = 1 - Math.pow(1 - progress, 3);
          current = Math.floor(ease * target);
          pointEl.textContent = current.toLocaleString();
          if (progress < 1) requestAnimationFrame(tick);
          else pointEl.textContent = '2,100';
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    observer.observe(pointEl);
  }

  // ── 5. コイン アイコン スピン ──
  const coinIcons = document.querySelectorAll('.coin-icon');
  coinIcons.forEach((coin, i) => {
    setInterval(() => {
      coin.style.transform = 'scaleX(0.1)';
      coin.style.transition = 'transform 0.1s';
      setTimeout(() => {
        coin.style.transform = 'scaleX(1)';
      }, 100);
    }, 1500 + i * 300);
  });

  // ── 6. ヘッダー ロゴ グリッチ ──
  const logoEl = document.querySelector('.header-1 .logo-pixel');
  if (logoEl) {
    setInterval(() => {
      if (Math.random() > 0.7) {
        logoEl.style.textShadow = '3px 0 #ff294d, -3px 0 #00e5ff';
        logoEl.style.transform  = `translateX(${Math.random() < 0.5 ? 2 : -2}px)`;
        setTimeout(() => {
          logoEl.style.textShadow = '';
          logoEl.style.transform  = '';
        }, 80);
      }
    }, 2500);
  }

  // ── 7. ランキング 行 スキャン ──
  const rankRows = document.querySelectorAll('.ranking-row');
  rankRows.forEach((row, i) => {
    setTimeout(() => {
      row.style.opacity = '0';
      row.style.transform = 'translateX(-10px)';
      row.style.transition = 'opacity 0.3s, transform 0.3s';

      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          obs.disconnect();
          setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateX(0)';
          }, i * 120);
        });
      }, { threshold: 0.3 });
      obs.observe(row);
    }, 100);
  });

  // ── 8. スクロール時 ピクセルフラッシュ ──
  let lastScroll = window.scrollY;
  window.addEventListener('scroll', () => {
    const diff = Math.abs(window.scrollY - lastScroll);
    if (diff > 200 && Math.random() > 0.6) {
      const x = window.innerWidth * Math.random();
      const y = window.innerHeight * Math.random();
      spawnExplosion(x, y, 6);
    }
    lastScroll = window.scrollY;
  });

})();
