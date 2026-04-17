/* acquisition_06 — グラフィック型 animations */
(function() {
  const style = document.createElement('style');
  style.textContent = `
    /* Pop-art button */
    @keyframes popBtn {
      0%,100% { transform:translate(0,0); box-shadow:4px 4px 0 #505050; }
      50%      { transform:translate(-2px,-4px); box-shadow:6px 8px 0 #505050; }
    }
    @keyframes comicShake {
      0%,100% { transform:rotate(0deg) scale(1); }
      25%      { transform:rotate(-3deg) scale(1.05); }
      75%      { transform:rotate(3deg) scale(1.05); }
    }
    @keyframes stampIn {
      0%   { transform:scale(2) rotate(-15deg); opacity:0; }
      60%  { transform:scale(0.9) rotate(2deg); opacity:1; }
      100% { transform:scale(1) rotate(0deg); opacity:1; }
    }
    @keyframes borderPulse {
      0%,100% { border-color:#7d85be; }
      50%      { border-color:#ff7abe; }
    }
    @keyframes fadeUp {
      from { opacity:0; transform:translateY(24px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes slideInLeft {
      from { opacity:0; transform:translateX(-30px); }
      to   { opacity:1; transform:translateX(0); }
    }
    .anim-fadeup  { animation: fadeUp 0.5s ease both; }
    .anim-stamp   { animation: stampIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both; }
    .anim-slidein { animation: slideInLeft 0.5s ease both; }

    /* Main button */
    .btn-main {
      animation: popBtn 2s ease-in-out infinite !important;
      transition: transform 0.1s, box-shadow 0.1s !important;
    }
    .btn-main:hover {
      animation: none !important;
      transform: translate(-4px,-6px) !important;
      box-shadow: 8px 10px 0 #505050 !important;
    }
    .btn-main:active {
      transform: translate(4px,4px) !important;
      box-shadow: 0 0 0 #505050 !important;
    }

    /* Final button */
    .final-btn {
      transition: transform 0.1s, box-shadow 0.1s;
    }
    .final-btn:hover {
      transform: translate(-3px,-4px) !important;
      box-shadow: 7px 8px 0 #505050 !important;
    }
    .final-btn:active {
      transform: translate(4px,4px) !important;
      box-shadow: 0 0 0 #505050 !important;
    }

    /* Reason cards */
    .reason-card {
      transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
      cursor: default;
    }
    .reason-card:hover { transform: scale(1.06) rotate(-2deg); }

    /* Step cards */
    .step-card {
      transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
    }
    .step-card:hover {
      transform: translate(-3px,-3px);
      box-shadow: 7px 7px 0 #7d85be !important;
    }

    /* Reason border pulse */
    .reason-grid-wrap { animation: borderPulse 3s ease-in-out infinite; }

    /* Point number */
    .point-num {
      display: inline-block;
      transition: transform 0.2s;
    }
  `;
  document.head.appendChild(style);

  /* Stamp-in for sections */
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (!e.isIntersecting) return;
      obs.unobserve(e.target);
      const cls = i % 2 === 0 ? 'anim-stamp' : 'anim-slidedin';
      setTimeout(() => {
        e.target.style.opacity = '1';
        e.target.classList.add('anim-fadeup');
      }, i * 80);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reason-card, .step-card, .point-frame, .stat-card').forEach(el => {
    el.style.opacity = '0';
    obs.observe(el);
  });

  /* Point section stamp-in */
  const ptFrame = document.querySelector('.point-frame');
  if (ptFrame) {
    const o = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        o.disconnect();
        ptFrame.classList.add('anim-stamp');
      });
    }, { threshold: 0.3 });
    o.observe(ptFrame);
  }

  /* MV text comic shake on scroll */
  const mvText = document.querySelector('.mv-text');
  if (mvText) {
    let lastY = 0;
    window.addEventListener('scroll', () => {
      const dy = Math.abs(window.scrollY - lastY);
      if (dy > 80) {
        mvText.style.animation = 'comicShake 0.4s ease';
        setTimeout(() => mvText.style.animation = '', 400);
        lastY = window.scrollY;
      }
    });
  }

  /* Number count up */
  document.querySelectorAll('.point-num').forEach(el => {
    const t = parseInt(el.textContent.replace(/,/g,'').replace(/[^\d]/g,''));
    if (!t || t < 10) return;
    const o = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        o.disconnect();
        const dur = 1000; const t0 = performance.now();
        const suffix = el.textContent.includes('pt') ? 'pt' : '';
        (function tick(now) {
          const p = Math.min((now-t0)/dur,1);
          const ease = 1-Math.pow(1-p,3);
          el.textContent = Math.floor(ease*t).toLocaleString() + suffix;
          if(p<1) requestAnimationFrame(tick);
          else el.textContent = t.toLocaleString() + suffix;
        })(t0);
      });
    }, {threshold:0.5});
    o.observe(el);
  });

})();
