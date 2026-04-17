/* acquisition_03 — 金融・クリーン型 animations */
(function() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes elegantFadeUp {
      from { opacity:0; transform:translateY(40px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes goldShimmer {
      0%   { background-position: -400px 0; }
      100% { background-position: 400px 0; }
    }
    @keyframes borderGlow {
      0%,100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.0), 0 8px 40px rgba(0,0,0,0.4); }
      50%      { box-shadow: 0 0 20px 4px rgba(201,168,76,0.3), 0 8px 40px rgba(0,0,0,0.4); }
    }
    @keyframes lineExpand {
      from { transform: scaleX(0); }
      to   { transform: scaleX(1); }
    }
    @keyframes counterUp {
      from { opacity:0; transform: translateY(10px); }
      to   { opacity:1; transform: translateY(0); }
    }
    .anim-elegant { animation: elegantFadeUp 1s cubic-bezier(0.16,1,0.3,1) both; }

    /* CTA ボタン */
    .cta-btn {
      transition: transform 0.2s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s !important;
    }
    .cta-btn:hover {
      transform: translateY(-4px) !important;
      box-shadow: 0 12px 40px rgba(201,168,76,0.4) !important;
    }
    .cta-btn:active { transform: translateY(0px) !important; }

    /* Reason カード */
    .reason-item {
      transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s;
      cursor: default;
    }
    .reason-item:hover {
      transform: translateX(6px);
      box-shadow: 6px 0 20px rgba(201,168,76,0.2), -2px 0 0 rgba(201,168,76,0.6) !important;
    }

    /* ランキング行 */
    .ranking-row {
      transition: background 0.2s;
      cursor: default;
    }
    .ranking-row:hover { background: rgba(201,168,76,0.08) !important; }
  `;
  document.head.appendChild(style);

  /* エレガントなフェードイン */
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (!e.isIntersecting) return;
      obs.unobserve(e.target);
      e.target.style.animationDelay = (i * 0.12) + 's';
      e.target.classList.add('anim-elegant');
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('section, .reason-item, .ranking-row, .stat-card, .quest-row').forEach(el => {
    el.style.opacity = '0';
    obs.observe(el);
  });

  /* ボタン border glow */
  document.querySelectorAll('.cta-btn').forEach(btn => {
    btn.style.animation = 'borderGlow 3s ease-in-out infinite';
  });

  /* 数字カウントアップ */
  document.querySelectorAll('.point-num').forEach(el => {
    const target = parseInt(el.textContent.replace(/,/g,''));
    if (isNaN(target)) return;
    const o = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        o.disconnect();
        const dur = 1600;
        const t0 = performance.now();
        (function tick(now) {
          const p = Math.min((now-t0)/dur, 1);
          const ease = 1 - Math.pow(1-p, 4);
          el.textContent = Math.floor(ease*target).toLocaleString();
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = target.toLocaleString();
        })(t0);
      });
    }, { threshold: 0.5 });
    o.observe(el);
  });

})();
