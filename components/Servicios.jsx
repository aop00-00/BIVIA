// ── SERVICIOS ─────────────────────────────────────────────
function Servicios() {
  const container = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.section-label-servicios', { scrollTrigger: { trigger: container.current, start: 'top 90%' }, y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' });
      gsap.from('.servicios-header', { scrollTrigger: { trigger: '.servicios-header', start: 'top 90%' }, y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' });
      gsap.from('.servicio-card', { scrollTrigger: { trigger: '.servicios-grid', start: 'top 90%' }, y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' });
    }, container);
    return () => ctx.revert();
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
    <section id="servicios" ref={container}>
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
    </section>
  );
}
