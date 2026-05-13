// ── LIGHT BURST TRANSITION ────────────────────────────────
function LightBurst() {
  const wrapperRef = useRef(null);
  const sectionRef = useRef(null);
  const burstRef   = useRef(null);
  const rayRef     = useRef(null);
  const gridRef    = useRef(null);
  const canvasRef  = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const burst   = burstRef.current;
    const ray     = rayRef.current;
    const grid    = gridRef.current;
    const canvas  = canvasRef.current;
    if (!wrapper || !burst || !grid || !canvas) return;

    // ── Draw hexagonal grid on canvas ───────────────────────────────────────
    const ctx = canvas.getContext('2d');
    function drawGrid() {
      const W = canvas.width  = canvas.offsetWidth;
      const H = canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      const R = 36; // hex radius
      const colW  = R * 1.732; // √3 * R
      const rowH  = R * 1.5;
      const cols  = Math.ceil(W / colW) + 2;
      const rows  = Math.ceil(H / rowH) + 2;

      ctx.strokeStyle = 'rgba(200, 184, 149, 0.18)';
      ctx.lineWidth   = 0.8;

      for (let row = -1; row < rows; row++) {
        for (let col = -1; col < cols; col++) {
          const offset = (row % 2 === 0) ? 0 : colW / 2;
          const cx = col * colW + offset;
          const cy = row * rowH;

          ctx.beginPath();
          for (let a = 0; a < 6; a++) {
            const angle = (Math.PI / 3) * a - Math.PI / 6;
            const px = cx + R * Math.cos(angle);
            const py = cy + R * Math.sin(angle);
            a === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();

          // Subtle fill on every other hex
          if ((row + col) % 3 === 0) {
            ctx.fillStyle = 'rgba(200, 184, 149, 0.03)';
            ctx.fill();
          }
        }
      }

      // Radial vignette on top
      const vgr = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.65);
      vgr.addColorStop(0,   'rgba(11,13,15,0)');
      vgr.addColorStop(0.6, 'rgba(11,13,15,0)');
      vgr.addColorStop(1,   'rgba(11,13,15,0.85)');
      ctx.fillStyle = vgr;
      ctx.fillRect(0, 0, W, H);
    }

    drawGrid();
    window.addEventListener('resize', drawGrid);

    // ── ScrollTrigger: 3 fases en 200vh ─────────────────────────────────────
    // t 0.00 → 0.35 : destello central crece (burst scale 0→1, rays)
    // t 0.35 → 0.70 : burst expande hasta llenar pantalla (scale 1→40)
    // t 0.70 → 1.00 : grid aparece, partícula bg se reemplaza visualmente
    const st = ScrollTrigger.create({
      trigger: wrapper,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate(self) {
        const t = self.progress;

        // ── Fase 1: punto de luz crece (0 → 0.35) ──────────────────────────
        const phase1 = Math.min(1, t / 0.35);
        const burstScale = phase1 * phase1; // ease cuadrática
        burst.style.transform = `translate(-50%, -50%) scale(${burstScale})`;
        burst.style.opacity   = phase1 > 0.05 ? '1' : '0';
        if (ray) ray.style.opacity = (phase1 * 0.6).toFixed(3);

        // ── Fase 2: expansión total (0.35 → 0.70) ──────────────────────────
        const phase2 = Math.max(0, Math.min(1, (t - 0.35) / 0.35));
        // escala hiperbólica: de 1 a ~50 para tapar toda la pantalla
        const expandScale = 1 + phase2 * phase2 * 49;
        if (phase2 > 0) {
          burst.style.transform = `translate(-50%, -50%) scale(${expandScale})`;
        }
        // opacidad del burst baja al final de la expansión
        const burstOpacity = phase2 < 0.7 ? 1 : 1 - ((phase2 - 0.7) / 0.3);
        burst.style.opacity = (phase1 > 0.05 ? burstOpacity : 0).toFixed(3);

        // ── Fase 3: grid reveal (0.70 → 1.00) ──────────────────────────────
        const phase3 = Math.max(0, Math.min(1, (t - 0.70) / 0.30));
        grid.style.opacity = phase3.toFixed(3);
      },
    });

    return () => {
      st.kill();
      window.removeEventListener('resize', drawGrid);
    };
  }, []);

  return (
    <div ref={wrapperRef} style={{ position: 'relative', height: '300vh' }}>
      <section
        ref={sectionRef}
        id="light-burst"
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Burst orb — punto de luz central que se expande */}
        <div
          ref={burstRef}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(0)',
            opacity: 0,
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #fff9ec 0%, #C8B895 25%, #8B744A 55%, transparent 100%)',
            boxShadow: '0 0 60px 20px rgba(200,184,149,0.6), 0 0 140px 60px rgba(200,184,149,0.25)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* Rays — destellos radiales */}
        <div
          ref={rayRef}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '600px',
            opacity: 0,
            pointerEvents: 'none',
            zIndex: 1,
            background: 'conic-gradient(from 0deg, transparent 0deg, rgba(200,184,149,0.08) 6deg, transparent 12deg, transparent 42deg, rgba(200,184,149,0.05) 48deg, transparent 54deg, transparent 84deg, rgba(200,184,149,0.07) 90deg, transparent 96deg, transparent 126deg, rgba(200,184,149,0.06) 132deg, transparent 138deg, transparent 168deg, rgba(200,184,149,0.08) 174deg, transparent 180deg, transparent 210deg, rgba(200,184,149,0.05) 216deg, transparent 222deg, transparent 252deg, rgba(200,184,149,0.07) 258deg, transparent 264deg, transparent 294deg, rgba(200,184,149,0.06) 300deg, transparent 306deg, transparent 336deg, rgba(200,184,149,0.08) 342deg, transparent 360deg)',
            borderRadius: '50%',
          }}
        />

        {/* Grid hexagonal — patrón que aparece tras el burst */}
        <div
          ref={gridRef}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          <canvas
            ref={canvasRef}
            style={{ width: '100%', height: '100%', display: 'block' }}
          />
          {/* Texto central que aparece con el grid */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}>
            <div style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: 'clamp(11px, 1.2vw, 14px)',
              fontWeight: 600,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--sand)',
              opacity: 0.7,
              marginBottom: '16px',
            }}>
              03 — Servicios
            </div>
            <div style={{
              fontFamily: 'Sora, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(32px, 4vw, 56px)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              color: '#F2EFE8',
            }}>
              Lo que<br /><span style={{ color: 'var(--sand)' }}>construimos.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
