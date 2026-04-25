// ── PARTICLE BACKGROUND ──────────────────────────────────────────
function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    // Brand palette: [r, g, b, peakAlpha, radiusFactor]
    const palette = [
      { rgb: '200, 184, 149', alphaPeak: 0.22, rf: 0.28 }, // Sand — prominent
      { rgb: '200, 184, 149', alphaPeak: 0.18, rf: 0.20 }, // Sand mid
      { rgb: '139, 116, 74', alphaPeak: 0.28, rf: 0.18 }, // Olive — warm accent
      { rgb: '139, 116, 74', alphaPeak: 0.20, rf: 0.24 }, // Olive large
      { rgb: '119, 119, 53', alphaPeak: 0.16, rf: 0.22 }, // Mist — green-gold
      { rgb: '180, 155, 100', alphaPeak: 0.14, rf: 0.32 }, // Sand-warm wide
      { rgb: '160, 130, 70', alphaPeak: 0.24, rf: 0.16 }, // Golden
      { rgb: '200, 184, 149', alphaPeak: 0.12, rf: 0.38 }, // Sand — huge diffuse
    ];

    let orbs = [];

    function init() {
      orbs = [];
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      const base = Math.max(W, H);

      palette.forEach((p, i) => {
        const side = i % 4; // distribute across quadrants
        orbs.push({
          x: (side < 2 ? Math.random() * 0.55 : 0.45 + Math.random() * 0.55) * W,
          y: (side % 2 === 0 ? Math.random() * 0.55 : 0.45 + Math.random() * 0.55) * H,
          radius: p.rf * base,
          dx: (Math.random() - 0.5) * 0.5,
          dy: (Math.random() - 0.5) * 0.5,
          rgb: p.rgb,
          alphaPeak: p.alphaPeak,
          // breathing effect
          breath: Math.random() * Math.PI * 2,
          breathSpeed: 0.004 + Math.random() * 0.006,
        });
      });
    }

    function resize() {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      init();
    }

    window.addEventListener('resize', resize);
    resize();

    function draw() {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;

      // Dark base
      ctx.fillStyle = '#0B0D0F';
      ctx.fillRect(0, 0, W, H);

      // Composite orbs with 'lighter' blending for natural colour mixing
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      orbs.forEach(p => {
        // Drift
        p.x += p.dx;
        p.y += p.dy;
        // Soft wrap instead of bounce — seamless loop
        if (p.x < -p.radius) p.x = W + p.radius;
        if (p.x > W + p.radius) p.x = -p.radius;
        if (p.y < -p.radius) p.y = H + p.radius;
        if (p.y > H + p.radius) p.y = -p.radius;

        // Breathing
        p.breath += p.breathSpeed;
        const breathScale = 0.82 + 0.18 * Math.sin(p.breath);
        const r = p.radius * breathScale;
        const alpha = p.alphaPeak * (0.7 + 0.3 * Math.sin(p.breath));

        const rg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        rg.addColorStop(0, `rgba(${p.rgb}, ${alpha})`);
        rg.addColorStop(0.4, `rgba(${p.rgb}, ${alpha * 0.5})`);
        rg.addColorStop(1, `rgba(${p.rgb}, 0)`);

        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      // Subtle vignette to keep edges dark
      const vignette = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.85);
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.55)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, W, H);

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
}
