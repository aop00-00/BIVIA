// ── BIVIA ─────────────────────────────────────────────────
function QueBivia() {
  const container = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo('.section-label-bivia', { y: 20, opacity: 0 }, { scrollTrigger: { trigger: container.current, start: 'top 85%' }, y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });
      gsap.fromTo('.bivia-headline', { y: 30, opacity: 0 }, { scrollTrigger: { trigger: '.bivia-headline', start: 'top 85%' }, y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });
      gsap.fromTo('.bivia-desc', { y: 30, opacity: 0 }, { scrollTrigger: { trigger: '.bivia-desc', start: 'top 85%' }, y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });
      gsap.fromTo('.bivia-stat-item', { y: 30, opacity: 0 }, { scrollTrigger: { trigger: '.bivia-stat-item', start: 'top 85%' }, y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' });

      const pillars = gsap.utils.toArray('.bivia-pillar');
      pillars.forEach((pillar, i) => {
        gsap.fromTo(pillar,
          { x: 40, opacity: 0 },
          { scrollTrigger: { trigger: pillar, start: 'top 90%' }, x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: i * 0.15 }
        );
      });
    }, container);
    return () => ctx.revert();
  }, []);

  const pillars = [
    { n: '01', t: 'Estrategia', d: 'Analizamos el negocio desde la raíz para trazar caminos claros, medibles y sostenibles. No actuamos sin entender.' },
    { n: '02', t: 'Sistemas', d: 'Diseñamos arquitecturas digitales que ordenan procesos, conectan datos y escalan sin fricciones.' },
    { n: '03', t: 'Ejecución', d: 'Convertimos ideas en productos reales. Código, diseño e implementación con estándares de clase mundial.' },
  ];
  return (
    <section id="bivia" ref={container}>
      <div className="section-label section-label-bivia">02 — Qué es BIVIA</div>
      <div className="bivia-grid">
        <div>
          <h2 className="bivia-headline">
            Conectamos datos,<br />procesos e ideas para<br /><em>transformar negocios.</em>
          </h2>
          <p className="bivia-desc">
            Diseñamos sistemas que convierten información en claridad, procesos en eficiencia y visión en resultados medibles. No somos una agencia creativa ni un proveedor de software — somos tu socio estratégico.
          </p>
          <div style={{ display: 'flex', gap: '32px' }}>
            {[
              { v: '100+', l: 'Proyectos' },
              { v: '3+', l: 'Años' },
              { v: '94%', l: 'Retención' },
            ].map(s => (
              <div key={s.l} className="bivia-stat-item">
                <div style={{ fontFamily: 'Sora,sans-serif', fontSize: '32px', fontWeight: '700', color: '#C8B895', letterSpacing: '-0.02em' }}>{s.v}</div>
                <div style={{ fontSize: '11px', color: 'var(--stone)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bivia-pillars">
          {pillars.map(p => (
            <div className="bivia-pillar" key={p.n}>
              <div className="bivia-pillar-num">{p.n}</div>
              <div className="bivia-pillar-content">
                <h3>{p.t}</h3>
                <p>{p.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
