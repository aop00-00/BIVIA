// ── SERVICIOS — Orbital + Exit Burst ──────────────────────
function Servicios() {
  const wrapperRef     = useRef(null);   // outer div: orbital + 300vh burst space
  const sectionRef     = useRef(null);   // sticky panel
  const orbitRef       = useRef(null);
  const coreRef        = useRef(null);
  const nodeRefs       = useRef([]);
  const cardRefs       = useRef([]);
  const burstRef       = useRef(null);
  const rayRef         = useRef(null);
  const stateRef       = useRef({ angle: 0, autoRotate: true, activeId: null, raf: null });

  const svcs = [
    { id: 0, Icon: IconDiagnostico,    t: 'Diagnóstico estratégico', d: 'Analizamos tu negocio, procesos y ecosistema digital para definir el camino correcto desde el inicio.',    tags: ['Auditoría', 'Roadmap', 'KPIs'],     energy: 88, relatedIds: [1, 3] },
    { id: 1, Icon: IconSistemas,       t: 'Diseño de sistemas',      d: 'Arquitecturamos plataformas, procesos y flujos que escalan con tu crecimiento y se integran sin fricción.',  tags: ['Arquitectura', 'UX/UI', 'APIs'],    energy: 95, relatedIds: [0, 2, 5] },
    { id: 2, Icon: IconAutomatizacion, t: 'Automatización',          d: 'Eliminamos operaciones manuales con flujos inteligentes que liberan tiempo y reducen errores humanos.',      tags: ['Workflows', 'IA', 'Integraciones'], energy: 92, relatedIds: [1, 5] },
    { id: 3, Icon: IconEstrategia,     t: 'Estrategia digital',      d: 'Definimos la dirección correcta con datos, posicionamiento y una hoja de ruta ejecutable y medible.',        tags: ['GTM', 'Posicionamiento', 'OKRs'],   energy: 85, relatedIds: [0, 4] },
    { id: 4, Icon: IconDatos,          t: 'Inteligencia de datos',   d: 'Convertimos datos en decisiones: dashboards, modelos predictivos y reportes que clarifican el negocio.',     tags: ['BI', 'Analytics', 'Dashboards'],    energy: 90, relatedIds: [3, 1] },
    { id: 5, Icon: IconIntegracion,    t: 'Integración y ejecución', d: 'Implementamos, conectamos y lanzamos. Gestionamos la ejecución técnica end-to-end hasta los resultados.',    tags: ['Dev', 'Lanzamiento', 'Soporte'],    energy: 97, relatedIds: [2, 1] },
  ];

  // ── Exit burst ScrollTrigger (fires after orbital section) ───────────────
  // The wrapper is: orbital section (100vh sticky) + 300vh burst scroll space.
  // We drive a 3-phase burst:
  //   Phase 1 (0→0.30)  — orb ignites and grows from core
  //   Phase 2 (0.30→0.7) — orb expands radially to fill the entire viewport
  //   Phase 3 (0.55→0.95) — white overlay fades in so the screen goes 100% white
  // The overlay stays at opacity:1 when onLeave fires (Proyectos is white bg),
  // then a second ScrollTrigger on #proyectos fades it out once the section is visible.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const burst   = burstRef.current;
    const ray     = rayRef.current;
    const section = sectionRef.current;
    const core    = coreRef.current;
    if (!wrapper || !burst || !section || !core) return;

    let originX = 0, originY = 0;

    function snapOrigin() {
      const sRect = section.getBoundingClientRect();
      const cRect = core.getBoundingClientRect();
      originX = (cRect.left + cRect.width  / 2) - sRect.left;
      originY = (cRect.top  + cRect.height / 2) - sRect.top;
      burst.style.left = originX + 'px';
      burst.style.top  = originY + 'px';
      if (ray) {
        ray.style.left = originX + 'px';
        ray.style.top  = originY + 'px';
      }
    }

    // ── White overlay — fixed, shared across post-servicios sections ─────────
    let whiteEl = document.getElementById('bivia-white-overlay');
    if (!whiteEl) {
      whiteEl = document.createElement('div');
      whiteEl.id = 'bivia-white-overlay';
      Object.assign(whiteEl.style, {
        position: 'fixed', inset: '0',
        background: '#ffffff',
        opacity: '0',
        pointerEvents: 'none',
        zIndex: '50',
        transition: 'none',
        willChange: 'opacity',
      });
      document.body.appendChild(whiteEl);
    }
    
    // ── Local White Overlay (keeps the section white at the end) ─────────────
    const localWhiteBg = document.getElementById('servicios-local-white-bg');

    // ── Main burst ScrollTrigger ─────────────────────────────────────────────
    const st = ScrollTrigger.create({
      trigger: wrapper,
      start: () => '+=' + window.innerHeight,
      end:   () => '+=' + (window.innerHeight * 3),
      scrub: 1.5,

      onEnter() {
        stateRef.current.autoRotate = false;
        snapOrigin();
        gsap.to(core, { opacity: 0, duration: 0.3 });
      },

      onLeave() {
        // Screen is now 100% white — lock the overlay, kill pointer events
        // Proyectos has white bg so it appears seamlessly underneath
        whiteEl.style.opacity      = '1';
        whiteEl.style.pointerEvents = 'none';

        // Fade the overlay out only after Proyectos is comfortably in view.
        // We use a small delay so the eye never catches a black flash.
        gsap.to(whiteEl, {
          opacity: 0,
          duration: 1.4,
          ease: 'power2.inOut',
          delay: 0.55,
        });
      },

      onLeaveBack() {
        // Scrolling back into servicios — reset everything
        gsap.killTweensOf(whiteEl);
        burst.style.opacity   = '0';
        burst.style.transform = 'translate(-50%, -50%) scale(0)';
        if (ray) ray.style.opacity = '0';
        whiteEl.style.opacity = '0';
        if (localWhiteBg) localWhiteBg.style.opacity = '0';
        gsap.to(core, { opacity: 1, duration: 0.3 });
        stateRef.current.autoRotate = true;
      },

      onUpdate(self) {
        const t = self.progress;

        // ── Phase 1: orb ignites (0 → 0.30) ────────────────────────────────
        const p1  = Math.min(1, t / 0.30);
        const sc1 = p1 * p1 * 1.2;          // ease-in grow
        burst.style.transform = `translate(-50%, -50%) scale(${sc1})`;
        burst.style.opacity   = (p1 > 0.04 ? Math.min(1, p1 * 1.5) : 0).toFixed(3);
        if (ray) ray.style.opacity = (Math.min(p1, 0.7)).toFixed(3);

        // ── Phase 2: orb expands radially to fill screen (0.30 → 0.72) ─────
        const p2 = Math.max(0, Math.min(1, (t - 0.30) / 0.42));
        if (p2 > 0) {
          // Max scale: the orb is 60px, viewport diagonal ≈ 1.8× max(W,H).
          // Scale needed to cover a 1920×1080 screen from center ≈ ~36.
          // We overshoot to 72 to guarantee full coverage on any screen.
          const sc2 = 1.2 + p2 * p2 * 72;
          burst.style.transform = `translate(-50%, -50%) scale(${sc2})`;
        }

        // Burst opacity: visible through most of phase 2, then hands off to white
        const burstOp = p2 < 0.50
          ? 1
          : Math.max(0, 1 - ((p2 - 0.50) / 0.50));
        if (p1 > 0.04) {
          burst.style.opacity = burstOp.toFixed(3);
        }

        // ── Phase 3: white overlay fills screen (0.55 → 0.95) ───────────────
        // Uses a smooth cubic ease so the transition feels silky
        const p3Raw = Math.max(0, Math.min(1, (t - 0.55) / 0.40));
        // Cubic ease-in-out for p3
        const p3 = p3Raw < 0.5
          ? 4 * p3Raw * p3Raw * p3Raw
          : 1 - Math.pow(-2 * p3Raw + 2, 3) / 2;
        whiteEl.style.opacity = p3.toFixed(4);
        if (localWhiteBg) localWhiteBg.style.opacity = p3.toFixed(4);
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  // ── Orbital RAF + node interactions ──────────────────────────────────────
  useEffect(() => {
    const st    = stateRef.current;
    const orbit = orbitRef.current;
    const core  = coreRef.current;
    const nodes = nodeRefs.current;
    const cards = cardRefs.current;
    if (!orbit || !core) return;

    const TOTAL = svcs.length, RADIUS = 190;

    gsap.to(core, { scale: 1.12, duration: 1.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });

    function positionNode(index, angle) {
      const rad = ((angle + (index / TOTAL) * 360) * Math.PI) / 180;
      const depth = (1 + Math.sin(rad)) / 2;
      return {
        x:  RADIUS * Math.cos(rad),
        y:  RADIUS * Math.sin(rad),
        op: Math.max(0.35, 0.35 + 0.65 * depth),
        sc: Math.max(0.75, 0.75 + 0.25 * depth),
        zi: Math.round(50 + 50 * depth),
      };
    }

    function tick() {
      if (st.autoRotate) st.angle = (st.angle + 0.18) % 360;
      nodes.forEach((node, i) => {
        if (!node) return;
        const { x, y, op, sc, zi } = positionNode(i, st.angle);
        node.style.transform = `translate(${x}px, ${y}px) scale(${sc})`;
        node.style.opacity   = st.activeId === i ? '1' : op;
        node.style.zIndex    = st.activeId === i ? '200' : zi;
      });
      st.raf = requestAnimationFrame(tick);
    }
    st.raf = requestAnimationFrame(tick);

    nodes.forEach((node, i) => {
      if (!node) return;
      node.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = st.activeId === i;

        // Close all other cards
        cards.forEach((c, j) => {
          if (c && j !== i) {
            gsap.to(c, { opacity: 0, scale: 0.88, duration: 0.22, ease: 'power2.in',
              onComplete: () => { c.style.display = 'none'; } });
          }
          if (nodes[j] && j !== i) nodes[j].querySelector('.svc-dot').classList.remove('active');
        });

        if (isOpen) {
          const card = cards[i];
          if (card) gsap.to(card, { opacity: 0, scale: 0.88, duration: 0.22, ease: 'power2.in',
            onComplete: () => { card.style.display = 'none'; } });
          node.querySelector('.svc-dot').classList.remove('active');
          st.activeId   = null;
          st.autoRotate = true;
        } else {
          st.activeId   = i;
          st.autoRotate = false;
          gsap.to(st, { angle: 270 - (i / TOTAL) * 360, duration: 0.9, ease: 'power3.out' });
          const card = cards[i];
          if (card) {
            card.style.display = 'block';
            gsap.fromTo(card,
              { opacity: 0, scale: 0.88, y: 8 },
              { opacity: 1, scale: 1, y: 0, duration: 0.32, ease: 'back.out(1.6)' }
            );
          }
          node.querySelector('.svc-dot').classList.add('active');
          svcs[i].relatedIds.forEach(rid => {
            const rn = nodes[rid];
            if (rn) gsap.fromTo(rn, { scale: 1 }, { scale: 1.3, duration: 0.4, ease: 'elastic.out(1,0.4)', yoyo: true, repeat: 1 });
          });
        }
      });
    });

    orbit.addEventListener('click', () => {
      cards.forEach((c, j) => {
        if (c) gsap.to(c, { opacity: 0, scale: 0.88, duration: 0.2, onComplete: () => { c.style.display = 'none'; } });
        if (nodes[j]) nodes[j].querySelector('.svc-dot').classList.remove('active');
      });
      st.activeId   = null;
      st.autoRotate = true;
    });

    return () => cancelAnimationFrame(st.raf);
  }, []);

  return (
    // 100vh orbital (sticky) + 300vh burst scroll space = 400vh total
    <div ref={wrapperRef} style={{ position: 'relative', height: '400vh' }}>

      <section
        id="servicios"
        ref={sectionRef}
        style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}
      >
        {/* ── Orbital UI ──────────────────────────────────────────────────── */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-start' }}>

          <div style={{ textAlign: 'center', paddingTop: '28px', paddingBottom: '24px' }}>
            <div className="section-label section-label-servicios" style={{ justifyContent: 'center', marginBottom: '10px' }}>03 — Servicios</div>
            <h2 className="servicios-headline" style={{ textAlign: 'center', margin: '0 auto 8px', fontSize: 'clamp(22px, 2.4vw, 36px)' }}>Lo que hacemos, y cómo lo hacemos.</h2>
            <p style={{ color: 'var(--stone)', fontSize: '12px', lineHeight: '1.5', marginBottom: 0 }}>Cada servicio es una palanca de transformación real.</p>
          </div>

          <div
            ref={orbitRef}
            style={{ position: 'relative', width: '100%', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {/* Orbit rings */}
            <div style={{ position: 'absolute', width: '380px', height: '380px', borderRadius: '50%', border: '1px solid rgba(200,184,149,0.12)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', border: '1px dashed rgba(200,184,149,0.06)', pointerEvents: 'none' }} />

            {/* Core orb */}
            <div
              ref={coreRef}
              style={{ position: 'absolute', width: '56px', height: '56px', borderRadius: '50%', background: 'radial-gradient(circle, #fff9ec 0%, #C8B895 40%, #8B744A 70%, transparent 100%)', boxShadow: '0 0 40px 12px rgba(200,184,149,0.3), 0 0 80px 30px rgba(200,184,149,0.1)', zIndex: 10, pointerEvents: 'none' }}
            />
            <div style={{ position: 'absolute', width: '80px', height: '80px', borderRadius: '50%', border: '1px solid rgba(200,184,149,0.2)', animation: 'orbitPing 2s ease-out infinite', pointerEvents: 'none', zIndex: 9 }} />

            {/* Nodes */}
            {svcs.map((svc, i) => (
              <div
                key={svc.id}
                ref={el => nodeRefs.current[i] = el}
                style={{ position: 'absolute', cursor: 'pointer', willChange: 'transform, opacity', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <div className="svc-dot" style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1.5px solid rgba(200,184,149,0.45)', background: 'rgba(11,13,15,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.3s, background 0.3s, box-shadow 0.3s', backdropFilter: 'blur(6px)' }}>
                  <svc.Icon />
                </div>
                <div style={{ marginTop: '7px', fontFamily: 'Sora, sans-serif', fontSize: '9px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--sand)', whiteSpace: 'normal', textAlign: 'center', width: '90px', lineHeight: 1.35, pointerEvents: 'none' }}>
                  {svc.t}
                </div>

                {/* Info card */}
                <div
                  ref={el => cardRefs.current[i] = el}
                  style={{ display: 'none', position: 'absolute', top: '58px', left: '50%', transform: 'translateX(-50%)', width: '240px', background: 'rgba(11,13,15,0.92)', border: '1px solid rgba(200,184,149,0.22)', backdropFilter: 'blur(16px)', padding: '20px', zIndex: 300 }}
                  onClick={e => e.stopPropagation()}
                >
                  <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', width: '1px', height: '12px', background: 'rgba(200,184,149,0.4)' }} />
                  <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--sand)', marginBottom: '8px' }}>{String(i + 1).padStart(2, '0')}</div>
                  <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '14px', fontWeight: 700, color: '#F2EFE8', marginBottom: '10px', letterSpacing: '-0.01em', lineHeight: 1.25 }}>{svc.t}</div>
                  <p style={{ fontSize: '12px', color: 'var(--stone)', lineHeight: 1.7, marginBottom: '14px' }}>{svc.d}</p>
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--stone)', marginBottom: '5px' }}>
                      <span style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>Relevancia</span>
                      <span style={{ color: 'var(--sand)', fontWeight: 600 }}>{svc.energy}%</span>
                    </div>
                    <div style={{ height: '2px', background: 'rgba(200,184,149,0.12)' }}>
                      <div style={{ height: '100%', width: `${svc.energy}%`, background: 'linear-gradient(90deg, #8B744A, #C8B895)' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {svc.tags.map(tag => (
                      <span key={tag} style={{ fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--stone)', border: '1px solid rgba(110,110,110,0.3)', padding: '3px 8px' }}>{tag}</span>
                    ))}
                  </div>
                  {svc.relatedIds.length > 0 && (
                    <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(200,184,149,0.1)' }}>
                      <div style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: '8px' }}>Conectado con</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {svc.relatedIds.map(rid => (
                          <button key={rid}
                            style={{ fontSize: '10px', color: 'var(--sand)', background: 'rgba(200,184,149,0.08)', border: '1px solid rgba(200,184,149,0.2)', padding: '4px 10px', cursor: 'pointer', letterSpacing: '0.05em', fontFamily: 'Sora, sans-serif' }}
                            onClick={(e) => { e.stopPropagation(); nodeRefs.current[rid] && nodeRefs.current[rid].click(); }}
                          >
                            {svcs[rid].t.split(' ').slice(0, 2).join(' ')} →
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', paddingBottom: '16px' }}>
            <p style={{ fontSize: '10px', color: 'var(--stone)', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.5 }}>Selecciona un nodo para explorar</p>
          </div>
        </div>

        {/* ── Exit burst layers (always mounted, driven by ScrollTrigger) ──── */}
        {/* Burst orb — position set dynamically to match core location */}
        <div
          ref={burstRef}
          style={{
            position: 'absolute', top: 0, left: 0,
            transform: 'translate(-50%, -50%) scale(0)',
            opacity: 0, width: '60px', height: '60px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #ffffff 0%, #fff9ec 15%, #C8B895 35%, #8B744A 60%, #ffffff 100%)',
            boxShadow: '0 0 60px 20px rgba(200,184,149,0.6), 0 0 140px 60px rgba(200,184,149,0.25)',
            pointerEvents: 'none', zIndex: 20,
          }}
        />

        {/* Rays — same dynamic position */}
        <div
          ref={rayRef}
          style={{
            position: 'absolute', top: 0, left: 0,
            transform: 'translate(-50%, -50%)',
            width: '600px', height: '600px',
            opacity: 0, pointerEvents: 'none', zIndex: 19,
            background: 'conic-gradient(from 0deg, transparent 0deg, rgba(200,184,149,0.08) 6deg, transparent 12deg, transparent 42deg, rgba(200,184,149,0.05) 48deg, transparent 54deg, transparent 84deg, rgba(200,184,149,0.07) 90deg, transparent 96deg, transparent 126deg, rgba(200,184,149,0.06) 132deg, transparent 138deg, transparent 168deg, rgba(200,184,149,0.08) 174deg, transparent 180deg, transparent 210deg, rgba(200,184,149,0.05) 216deg, transparent 222deg, transparent 252deg, rgba(200,184,149,0.07) 258deg, transparent 264deg, transparent 294deg, rgba(200,184,149,0.06) 300deg, transparent 306deg, transparent 336deg, rgba(200,184,149,0.08) 342deg, transparent 360deg)',
            borderRadius: '50%',
          }}
        />

        {/* Solid white overlay to cover the section permanently at the end of scroll */}
        <div
          id="servicios-local-white-bg"
          style={{ position: 'absolute', inset: 0, background: '#ffffff', opacity: 0, zIndex: 50, pointerEvents: 'none' }}
        />
      </section>
    </div>
  );
}
