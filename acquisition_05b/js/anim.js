/* acquisition_05 — 広告型（ブルー）animations */
(function() {
  const style = document.createElement('style');
  style.textContent = `
    /* Button bounce */
    @keyframes btnBounce {
      0%,100% { transform: translateY(0) scale(1); box-shadow: 0 6px 0 #ed2b21; }
      40%      { transform: translateY(-8px) scale(1.03); box-shadow: 0 14px 0 #ed2b21; }
      70%      { transform: translateY(-3px) scale(1.01); }
    }
    /* え!? shake */
    @keyframes eiShake {
      0%,100% { transform: rotate(0deg); }
      20%      { transform: rotate(-4deg) scale(1.05); }
      40%      { transform: rotate(3deg) scale(1.08); }
      60%      { transform: rotate(-2deg); }
      80%      { transform: rotate(1deg); }
    }
    /* Fade up */
    @keyframes fadeUp {
      from { opacity:0; transform:translateY(28px); }
      to   { opacity:1; transform:translateY(0); }
    }
    /* Heart pop */
    @keyframes heartPop {
      0%   { transform:scale(1); }
      50%  { transform:scale(1.3) rotate(-10deg); }
      100% { transform:scale(1) rotate(0deg); }
    }
    /* Badge wiggle */
    @keyframes badgeWiggle {
      0%,100% { transform:rotate(-2deg); }
      50%      { transform:rotate(2deg); }
    }
    /* Shimmer on CTA */
    @keyframes ctaShimmer {
      0%   { background-position: -400px 0; }
      100% { background-position: 400px 0; }
    }
    .anim-fadeup { animation: fadeUp 0.6s ease both; }

    /* CTA button */
    .cta-btn {
      position: relative;
      overflow: hidden;
      transition: transform 0.1s, box-shadow 0.1s !important;
      animation: btnBounce 2.5s ease-in-out infinite !important;
    }
    .cta-btn::after {
      content:'';
      position:absolute;
      top:0; left:-100%;
      width:60%; height:100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
      animation: ctaShimmer 3s ease-in-out infinite;
    }
    .cta-btn:hover {
      animation: none !important;
      transform: scale(1.04) translateY(-2px) !important;
      box-shadow: 0 10px 0 #ed2b21 !important;
    }
    .cta-btn:active {
      transform: translateY(6px) scale(0.98) !important;
      box-shadow: none !important;
    }

    /* Reason cards */
    .reason-card {
      transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s;
      cursor: default;
    }
    .reason-card:hover {
      transform: translateY(-6px) scale(1.03);
      box-shadow: 0 12px 30px rgba(39,127,250,0.25);
    }

    /* Step number */
    .step-num {
      transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
    }
    .step-item:hover .step-num {
      transform: scale(1.2) rotate(-8deg);
    }

    /* Sim table rows */
    .sim-row {
      transition: background 0.2s, transform 0.2s;
      cursor: default;
    }
    .sim-row:hover {
      background: rgba(39,127,250,0.06);
      transform: translateX(4px);
    }
  `;
  document.head.appendChild(style);

  /* Section fade in */
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (!e.isIntersecting) return;
      obs.unobserve(e.target);
      setTimeout(() => e.target.classList.add('anim-fadeup'), i * 70);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reason-card, .step-item, .sim-row, .sim-bonus, .final-point-card').forEach(el => {
    el.style.opacity = '0';
    obs.observe(el);
  });

  /* え!? periodic shake */
  const eiEl = document.querySelector('.mv-ei');
  if (eiEl) {
    setInterval(() => {
      eiEl.style.animation = 'eiShake 0.5s ease';
      setTimeout(() => eiEl.style.animation = '', 600);
    }, 3500);
  }

  /* Header banner badge wiggle */
  const badge = document.querySelector('.header-banner');
  if (badge) {
    badge.style.animation = 'badgeWiggle 2s ease-in-out infinite';
  }

  /* Point number count up */
  document.querySelectorAll('.final-point-num, .point-num').forEach(el => {
    const t = parseInt(el.textContent.replace(/,/g,''));
    if (isNaN(t)) return;
    const o = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        o.disconnect();
        const dur = 1200; const t0 = performance.now();
        (function tick(now) {
          const p = Math.min((now-t0)/dur,1);
          const ease = 1-Math.pow(1-p,3);
          el.textContent = Math.floor(ease*t).toLocaleString();
          if (p<1) requestAnimationFrame(tick);
          else el.textContent = t.toLocaleString();
        })(t0);
      });
    }, { threshold:0.5 });
    o.observe(el);
  });

})();
