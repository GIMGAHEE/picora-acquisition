/* acquisition_01 — ポイントアプリ型 animations */
(function() {

  /* === CSSアニメーション追加 === */
  const style = document.createElement('style');
  style.textContent = `
    /* Coin bounce */
    @keyframes coinBounce {
      0%,100% { transform: translateY(0) rotate(0deg); }
      30%      { transform: translateY(-18px) rotate(-8deg); }
      60%      { transform: translateY(-8px) rotate(4deg); }
    }
    /* Button pulse */
    @keyframes btnPulse {
      0%,100% { box-shadow: 0 0 0 0 rgba(140,200,75,0.5); }
      50%      { box-shadow: 0 0 0 14px rgba(140,200,75,0); }
    }
    /* Fade slide up */
    @keyframes fadeUp {
      from { opacity:0; transform:translateY(24px); }
      to   { opacity:1; transform:translateY(0); }
    }
    /* Shimmer */
    @keyframes shimmer {
      0%   { background-position: -400px 0; }
      100% { background-position: 400px 0; }
    }
    .anim-fadeup { animation: fadeUp 0.6s ease both; }

    /* Button hover/active */
    .cta-btn, .btn-download {
      transition: transform 0.15s, box-shadow 0.15s !important;
    }
    .cta-btn:hover, .btn-download:hover {
      transform: translateY(-3px) scale(1.02) !important;
    }
    .cta-btn:active, .btn-download:active {
      transform: translateY(2px) scale(0.98) !important;
    }
  `;
  document.head.appendChild(style);

  /* === ポイント数字カウントアップ === */
  const ptEls = document.querySelectorAll('.point-big, .point-number, [class*="point-num"]');
  ptEls.forEach(el => {
    const text = el.textContent.trim();
    const num = parseInt(text.replace(/,/g,''));
    if (isNaN(num) || num < 10) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        let start = 0;
        const dur = 1200;
        const t0 = performance.now();
        (function tick(now) {
          const p = Math.min((now - t0) / dur, 1);
          const ease = 1 - Math.pow(1-p, 3);
          el.textContent = Math.floor(ease * num).toLocaleString();
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = num.toLocaleString();
        })(t0);
      });
    }, { threshold: 0.5 });
    obs.observe(el);
  });

  /* === ボタン パルス === */
  document.querySelectorAll('.cta-btn, .btn-download').forEach(btn => {
    btn.style.animation = 'btnPulse 2s ease-in-out infinite';
  });

  /* === セクション フェードイン === */
  const sections = document.querySelectorAll('section, .reason-card, .step-item, .stat-card');
  const sObs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (!e.isIntersecting) return;
      sObs.unobserve(e.target);
      e.target.style.animationDelay = (i * 0.08) + 's';
      e.target.classList.add('anim-fadeup');
    });
  }, { threshold: 0.15 });
  sections.forEach(s => {
    s.style.opacity = '0';
    sObs.observe(s);
  });

  /* === コインアイコン バウンス === */
  document.querySelectorAll('.coin-icon, [class*="coin"]').forEach((el, i) => {
    el.style.animation = `coinBounce 1.8s ease-in-out ${i * 0.25}s infinite`;
    el.style.display = 'inline-block';
  });

})();
