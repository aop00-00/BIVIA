// ── SERVICIOS ─────────────────────────────────────────────
function Servicios() {
  const container  = useRef(null);
  const hexCanvasRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.section-label-servicios', { scrollTrigger: { trigger: container.current, start: 'top 90%' }, y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' });
      gsap.from('.servicios-header', { scrollTrigger: { trigger: '.servicios-header', start: 'top 90%' }, y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' });
      gsap.from('.servicio-card', { scrollTrigger: { trigger: '.servicios-grid', start: 'top 90%' }, y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' });
    }, container);
    return () => ctx.revert();
  }, []);

  // ── Hex grid background ───────────────────────────────────────────────────
  useEffect(() => {
    const canvas = hexCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function draw() {
      const W = canvas.width  = canvas.offsetWidth;
      const H = canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      const R    = 38;
      const colW = R * 1.732;
      const rowH = R * 1.5;
      const cols = Math.ceil(W / colW) + 2;
      const rows = Math.ceil(H / rowH) + 2;

      ctx.strokeStyle = 'rgba(200, 184, 149, 0.13)';
      ctx.lineWidth   = 0.7;

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

          if ((row + col) % 4 === 0) {
            ctx.fillStyle = 'rgba(200, 184, 149, 0.025)';
            ctx.fill();
          }
        }
      }

      // Radial vignette so edges fade into the dark bg
      const vgr = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, Math.max(W, H) * 0.75);
      vgr.addColorStop(0,   'rgba(11,13,15,0)');
      vgr.addColorStop(0.55,'rgba(11,13,15,0)');
      vgr.addColorStop(1,   'rgba(11,13,15,0.9)');
      ctx.fillStyle = vgr;
      ctx.fillRect(0, 0, W, H);
    }

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  // 3D tilt on each card
  useEffect(() => {
    const cards = container.current ? container.current.querySelectorAll('.servicio-card') : [];
    const cleanups = [];

    cards.forEach(card => {
      const onMove = (e) => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width  / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        gsap.to(card, {
          rotateY:  dx * 8,
          rotateX: -dy * 6,
          scale: 1.025,
          duration: 0.4,
          ease: 'power2.out',
          transformPerspective: 600,
          transformOrigin: 'center center',
        });
      };
      const onLeave = () => {
        gsap.to(card, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.6)' });
      };
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
      cleanups.push(() => {
        card.removeEventListener('mousemove', onMove);
        card.removeEventListener('mouseleave', onLeave);
      });
    });

    return () => cleanups.forEach(fn => fn());
  }, []);

  const svcs = [
    { n: '01', Icon: IconDiagnostico, t: 'Diagnóstico estratégico', d: 'Analizamos tu negocio, procesos y ecosistema digital para definir el camino correcto desde el inicio.', tags: ['Auditoría', 'Roadmap', 'KPIs'] },
    { n: '02', Icon: IconSistemas, t: 'Diseño de sistemas', d: 'Arquitecturamos plataformas, procesos y flujos que escalan con tu crecimiento y se integran sin fricción.', tags: ['Arquitectura', 'UX/UI', 'APIs'] },
    { n: '03', Icon: IconAutomatizacion, t: 'Automatización', d: 'Eliminamos operaciones manuales con flujos inteligentes que liberan tiempo y reducen errores humanos.', tags: ['Workflows', 'IA', 'Integraciones'] },
    { n: '04', Icon: IconEstrategia, t: 'Estrategia digital', d: 'Definimos la dirección correcta con datos, posicionamiento y una hoja de ruta ejecutable y medible.', tags: ['GTM', 'Posicionamiento', 'OKRs'] },
    { n: '05', Icon: IconDatos, t: 'Inteligencia de datos', d: 'Convertimos datos en decisiones: dashboards, modelos predictivos y reportes que clarifican el negocio.', tags: ['BI', 'Analytics', 'Dashboards'] },
    { n: '06', Icon: IconIntegracion, t: 'Integración y ejecución', d: 'Implementamos, conectamos y lanzamos. Gestionamos la ejecución técnica end-to-end hasta los resultados.', tags: ['Dev', 'Lanzamiento', 'Soporte'] },
  ];
  return (
    <section id="servicios" ref={container} style={{ position: 'relative' }}>
      <canvas
        ref={hexCanvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.9,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
      <div className="section-label section-label-servicios">03 — Servicios</div>
      <div className="servicios-header">
        <h2 className="servicios-headline">Lo que hacemos, y cómo lo hacemos.</h2>
        <p style={{ color: 'var(--stone)', fontSize: '13px', maxWidth: '240px', lineHeight: '1.6', textAlign: 'right' }}>Cada servicio es una palanca de transformación real.</p>
      </div>
      <div className="servicios-grid">
        {svcs.map(s => (
          <div className="servicio-card" key={s.n}>
            <s.Icon />
            <div className="servicio-num">{s.n}</div>
            <div className="servicio-title">{s.t}</div>
            <div className="servicio-desc">{s.d}</div>
            <div className="servicio-tags">
              {s.tags.map(tag => <span className="servicio-tag" key={tag}>{tag}</span>)}
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
