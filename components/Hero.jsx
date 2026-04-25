// ── HERO ──────────────────────────────────────────────────
function Hero() {
  const container = useRef(null);
  const canvasRef = useRef(null);

  // Generative canvas: architectural door with warm light
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let bloom = 0; // 0→1 over time
    let startTime = null;

    function resize() {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resize();
    window.addEventListener('resize', resize);

    function draw(ts) {
      if (!startTime) startTime = ts;
      const elapsed = (ts - startTime) / 1000;
      bloom = Math.min(1, elapsed / 2.5); // reach full bloom in 2.5s

      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      // Deep black base (REMOVIDO PARA QUITAR LA DIVISIÓN)
      // ctx.fillStyle = '#07090A';
      // ctx.fillRect(0, 0, W, H);

      // Floor gradient
      const floor = ctx.createLinearGradient(0, H * 0.62, 0, H);
      floor.addColorStop(0, `rgba(30,24,10,${0.6 * bloom})`);
      floor.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = floor;
      ctx.fillRect(0, H * 0.62, W, H * 0.38);

      // Central glow (door light source)
      const cx = W * 0.5;
      const cy = H * 0.48;
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.55);
      glow.addColorStop(0, `rgba(220,185,100,${0.55 * bloom})`);
      glow.addColorStop(0.18, `rgba(180,140,60,${0.35 * bloom})`);
      glow.addColorStop(0.45, `rgba(100,80,20,${0.12 * bloom})`);
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      // Door frame — outer rect (dark wall)
      const dW = W * 0.18;
      const dH = H * 0.58;
      const dX = cx - dW / 2;
      const dY = cy - dH * 0.55;
      // inner lit opening
      const iW = dW * 0.55;
      const iH = dH * 0.88;
      const iX = cx - iW / 2;
      const iY = dY + dH * 0.12;

      // Wall flanks
      ctx.fillStyle = '#09090B';
      ctx.fillRect(dX, dY, (dW - iW) / 2, dH);
      ctx.fillRect(iX + iW, dY, (dW - iW) / 2, dH);
      ctx.fillRect(dX, dY, dW, dH - iH);

      // Door inner light
      const inner = ctx.createRadialGradient(cx, iY + iH * 0.35, 0, cx, iY + iH * 0.5, iW * 1.2);
      inner.addColorStop(0, `rgba(240,210,140,${0.92 * bloom})`);
      inner.addColorStop(0.4, `rgba(200,165,80,${0.7 * bloom})`);
      inner.addColorStop(1, `rgba(120,90,20,${0.2 * bloom})`);
      ctx.fillStyle = inner;
      ctx.fillRect(iX, iY, iW, iH);

      // Door frame border
      ctx.strokeStyle = `rgba(200,175,100,${0.25 * bloom})`;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(iX, iY, iW, iH);

      // Floor light beam
      const beam = ctx.createLinearGradient(cx, iY + iH, cx, H);
      beam.addColorStop(0, `rgba(200,170,80,${0.22 * bloom})`);
      beam.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = beam;
      // trapezoid beam
      ctx.beginPath();
      ctx.moveTo(iX, iY + iH);
      ctx.lineTo(iX + iW, iY + iH);
      ctx.lineTo(cx + W * 0.22, H);
      ctx.lineTo(cx - W * 0.22, H);
      ctx.closePath();
      ctx.fill();

      // Small cube on floor
      const cubeSize = W * 0.045;
      const cubeX = cx - cubeSize * 0.5;
      const cubeY = iY + iH - cubeSize * 0.3;
      ctx.fillStyle = `rgba(40,32,12,${bloom})`;
      ctx.fillRect(cubeX, cubeY, cubeSize, cubeSize);
      ctx.strokeStyle = `rgba(180,150,60,${0.4 * bloom})`;
      ctx.lineWidth = 1;
      ctx.strokeRect(cubeX, cubeY, cubeSize, cubeSize);

      // Ambient corner shadows — solo borde derecho y top/bottom
      const sgR = ctx.createRadialGradient(W, H * 0.5, 0, W, H * 0.5, W * 0.35);
      sgR.addColorStop(0, 'rgba(0,0,0,0.45)');
      sgR.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = sgR;
      ctx.fillRect(0, 0, W, H);

      if (bloom < 1) raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // GSAP orchestration
  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      // (1) Right panel fade-in with bloom
      tl.fromTo('.hero-right',
        { opacity: 0 },
        { opacity: 1, duration: 1.4, ease: 'power2.inOut' }
      );

      // (2) Label line extends + text slides from top
      tl.fromTo('.hero-label-line',
        { width: 0 },
        { width: 24, duration: 0.6, ease: 'power2.out' },
        0.8
      ).fromTo('.hero-label-text',
        { y: -16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
        1.0
      );

      // (3) Headline lines with clipPath / translateY stagger
      const lines = gsap.utils.toArray('.hero-line-inner');
      tl.fromTo(lines,
        { y: '110%' },
        { y: '0%', duration: 0.75, ease: 'power3.out', stagger: 0.14 },
        1.2
      );

      // (5) Paragraph fade up
      tl.fromTo('.hero-sub',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
        2.0
      );

      // (6) Pillars emerge sequentially
      const pillars = gsap.utils.toArray('.hero-pillar');
      tl.fromTo(pillars,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.15 },
        2.4
      );

      // (7) BIVIA logo letters scale + fade letter by letter
      const letters = gsap.utils.toArray('.hero-logo-letter');
      tl.fromTo(letters,
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.4)', stagger: 0.1 },
        1.6
      );

      // Domain tag
      tl.fromTo('.hero-domain',
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out' },
        3.2
      );

    }, container);
    return () => ctx.revert();
  }, []);

  const pillars = [
    { n: '01', t: 'ESTRATEGIA', s: 'Pensamos el negocio.' },
    { n: '02', t: 'SISTEMAS', s: 'Diseñamos la solución.' },
    { n: '03', t: 'EJECUCIÓN', s: 'Generamos resultados.' },
  ];

  const headline = [
    'Digitalizamos',
    'lo complejo.',
    'Diseñamos estrategias',
    'que generan',
  ];

  return (
    <section id="hero" ref={container}>

      {/* LEFT */}
      <div className="hero-left">
        <div className="hero-top-content">
          {/* Label */}
          <div className="hero-label-wrap">
            <div className="hero-label-line" />

          </div>

          {/* Headline */}
          <h1 className="hero-headline-wrap">
            {headline.map((line, i) => (
              <span className="hero-line" key={i}>
                <span className="hero-line-inner">{line}</span>
              </span>
            ))}
            <span className="hero-line">
              <span className="hero-line-inner olive">resultados reales.</span>
            </span>
          </h1>

          {/* Sub */}
          <p className="hero-sub">
            En <strong>BIVIA</strong> combinamos estrategia, creatividad y tecnología para construir
            sistemas digitales que conectan visión con ejecución.
          </p>
        </div>

        {/* Pillars */}
        <div className="hero-pillars">
          {pillars.map(p => (
            <div className="hero-pillar" key={p.n}>
              <div className="hero-pillar-num">{p.n}</div>
              <div className="hero-pillar-title">{p.t}</div>
              <div className="hero-pillar-sub">{p.s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div className="hero-right">
        <canvas ref={canvasRef} className="hero-canvas" />
        <div className="hero-logo-overlay">
          <div className="hero-logo-letters">
            {'BIVIA'.split('').map((letter, i) => (
              <span key={i} className="hero-logo-letter">{letter}</span>
            ))}
          </div>
        </div>
        <div className="hero-domain">BIVIA.CO</div>
      </div>

    </section>
  );
}
