/* acquisition_02 — リスティング広告型 animations */
(function() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeUp {
      from { opacity:0; transform:translateY(30px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes slideInLeft {
      from { opacity:0; transform:translateX(-30px); }
      to   { opacity:1; transform:translateX(0); }
    }
    @keyframes shimmer {
      0%   { background-position: -600px 0; }
      100% { background-position: 600px 0; }
    }
    @keyframes btnGlow {
      0%,100% { box-shadow: 0 4px 15px rgba(26,111,232,0.4); }
      50%      { box-shadow: 0 4px 30px rgba(26,111,232,0.8); }
    }
    @keyframes numPop {
      0%   { transform:scale(1); }
      50%  { transform:scale(1.15); }
      100% { transform:scale(1); }
    }
    .anim-fadeup   { animation: fadeUp 0.7s ease both; }
    .anim-slidein  { animation: slideInLeft 0.6s ease both; }

    /* Button */
    .cta-btn, a[href] {
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .cta-btn:hover { transform: translateY(-3px); }
    .cta-btn:active { transform: translateY(1px); }

    /* Trust badge shimmer */
    .trust-item, .badge-item, [class*="trust"] {
      transition: transform 0.2s;
    }
    .trust-item:hover, [class*="trust"]:hover { transform: scale(1.05); }
  `;
  document.head.appendChild(style);

  /* セクション フェードイン */
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (!e.isIntersecting) return;
      obs.unobserve(e.target);
      setTimeout(() => e.target.classList.add('anim-fadeup'), i * 80);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('section, .reason-card, .step-item, .feature-item').forEach(el => {
    el.style.opacity = '0';
    obs.observe(el);
  });

  /* ボタン glow */
  document.querySelectorAll('.cta-btn').forEach(btn => {
    btn.style.animation = 'btnGlow 2.5s ease-in-out infinite';
  });

  /* 数字ハイライト ポップ */
  document.querySelectorAll('.highlight-num, .point-num, [class*="big-num"]').forEach(el => {
    const o = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        o.disconnect();
        el.style.animation = 'numPop 0.5s ease';
      });
    }, { threshold: 0.5 });
    o.observe(el);
  });

})();
