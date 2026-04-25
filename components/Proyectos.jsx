// ── PROYECTOS ─────────────────────────────────────────────
function Proyectos() {
  const container = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.section-label-proyectos', { scrollTrigger: { trigger: container.current, start: 'top 90%' }, y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' });
      gsap.from('.proyectos-header', { scrollTrigger: { trigger: '.proyectos-header', start: 'top 90%' }, y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' });
      gsap.from('.proyecto-card', { scrollTrigger: { trigger: '.proyectos-scroll', start: 'top 85%' }, x: 60, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' });
    }, container);
    return () => ctx.revert();
  }, []);

  // Make the scroll container draggable for better UX
  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;
    let isDown = false;
    let startX;
    let scrollLeft;

    const onMouseDown = (e) => {
      isDown = true;
      slider.style.cursor = 'grabbing';
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };
    const onMouseLeave = () => {
      isDown = false;
      slider.style.cursor = 'grab';
    };
    const onMouseUp = () => {
      isDown = false;
      slider.style.cursor = 'grab';
    };
    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener('mousedown', onMouseDown);
    slider.addEventListener('mouseleave', onMouseLeave);
    slider.addEventListener('mouseup', onMouseUp);
    slider.addEventListener('mousemove', onMouseMove);
    slider.style.cursor = 'grab';

    return () => {
      slider.removeEventListener('mousedown', onMouseDown);
      slider.removeEventListener('mouseleave', onMouseLeave);
      slider.removeEventListener('mouseup', onMouseUp);
      slider.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  const ps = [
    {
      url: 'https://mt3arquitectos.com.mx',
      bg: './uploads/Arquitectos.png',
      tag: 'SITIO WEB',
      t: 'Despacho de arquitectura contemporánea en León',
      d: 'Sitio institucional diseñado para reflejar más de 20 años de trayectoria en proyectos con personalidad única. Desde residencias y naves industriales hasta diseño de muebles y remodelaciones, cada sección comunica su filosofía: romper estereotipos y construir espacios que se sienten propios.',
      meta: { sector: 'Arquitectura', tipo: 'Sitio institucional', ubicación: 'León, Gto.' }
    },
    {
      url: 'https://www.quidamelo.com',
      bg: './uploads/Sitio-bodegas.png.png',
      tag: 'SITIO WEB · PLATAFORMA SAAS',
      t: 'Portal de gestión para bodegas rentadas con panel administrativo',
      d: 'Desarrollo completo de dos capas digitales: un sitio público orientado al cliente donde puede consultar información relevante de su bodega en renta, y un panel administrativo privado con métricas en tiempo real, historial de clientes activos y seguimiento detallado de cada contrato. Arquitectura pensada para operar con precisión y escalar sin fricciones.',
      meta: { sector: 'Inmobiliario / Logística', tipo: 'Web + Dashboard', resultado: 'Visibilidad operativa total' }
    },
    {
      url: 'https://www.malpe.com.mx',
      bg: './uploads/Sitio-Malpe.png.png',
      tag: 'SITIO WEB',
      t: 'Presencia digital premium para una curtiduría certificada Gold LWG',
      d: 'Sitio corporativo bilingüe para una curtiduría artesanal con más de 25 años en la industria. Posiciona a MALPE como proveedor premium de cuero para calzado, tapicería y marroquinería, respaldado por la certificación Gold del Leather Working Group —el estándar más alto de manufactura responsable a nivel mundial.',
      meta: { sector: 'Industria del cuero', tipo: 'Sitio corporativo', certificación: 'LWG Gold' }
    },
    {
      url: 'https://www.pimed.com.mx',
      bg: './uploads/Ecosistema-educativo.png.png',
      tag: 'SITIO WEB · PLATAFORMA EDUCATIVA',
      t: 'Sistema integral de preparación para examen de admisión médica',
      d: 'Desarrollo completo de ecosistema educativo: sitio público que comunica el método y el proceso del sistema, más una plataforma de estudio con dashboards diferenciados para alumno, maestro y administrador. Una solución integral que centraliza contenidos, seguimiento académico y gestión operativa en un solo lugar.',
      meta: { sector: 'Educación / Salud', tipo: 'Web + LMS', roles: 'Alumno · Maestro · Admin' }
    },
    {
      url: 'https://www.saltandspirit.com.mx',
      bg: './uploads/E-commerce-electrolitos.png.png',
      tag: 'E-COMMERCE · SHOPIFY',
      t: 'Tienda de hidratación funcional con identidad lifestyle de alto nivel',
      d: 'E-commerce para una marca de electrolitos premium con tres productos core: Vital Red, Pure Blue e Hydra-Rest. La experiencia de compra refleja la estética editorial de la marca —limpia, enfocada en performance— con bundles configurables, carrito dinámico y arquitectura optimizada para conversión.',
      meta: { sector: 'Health & Wellness', tipo: 'E-commerce', plataforma: 'Shopify' }
    },
    {
      url: 'https://grindproject.vercel.app',
      bg: './uploads/Plataforma-estudios.png.png',
      tag: 'SITIO WEB · PLATAFORMA SAAS',
      t: 'Software de gestión integral para estudios de fitness en LATAM',
      d: 'Plataforma completa para estudios de Pilates, Yoga, Barre, CrossFit y más: reservas online, control de acceso QR, facturación fiscal automática CFDI 4.0, CRM tipo Kanban y sistema de gamificación con puntos de lealtad. Un solo panel para operar uno o múltiples estudios con roles diferenciados para admin, recepción y coaches.',
      meta: { sector: 'Fitness / Wellness', tipo: 'Web + SaaS', mercado: 'México · LATAM' }
    }
  ];

  return (
    <section id="proyectos" ref={container}>
      <div className="proyectos-container">
        <div className="section-label section-label-proyectos">04 — Proyectos</div>
        <div className="proyectos-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0' }}>
          <h2 style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 'clamp(32px,3vw,44px)', letterSpacing: '-0.02em' }}>
            Casos que hablan<br />por sí solos.
          </h2>
          <p style={{ color: 'var(--stone)', fontSize: '13px', letterSpacing: '0.08em' }}>SELECCIÓN 2025–2026</p>
        </div>
      </div>

      <div className="proyectos-scroll" ref={scrollRef}>
        <div className="proyectos-grid">
          {ps.map((p, i) => (
            <div className={`proyecto-card${p.featured ? ' featured' : ''}`} key={i}>
              <div className="proyecto-accent" />
              <div className="proyecto-bg" style={{ backgroundImage: `url("${p.bg}")` }} />

              <div className="proyecto-content-wrapper">
                <div className="proyecto-tag">{p.tag}</div>
                <div className="proyecto-title">{p.t}</div>
                <div className="proyecto-desc">{p.d}</div>
              </div>
              <div className="proyecto-meta proyecto-content-wrapper" style={p.featured ? { flexDirection: 'column', gap: '6px', alignItems: 'flex-end' } : {}}>
                {Object.entries(p.meta).map(([k, v]) => (
                  <div key={k} className="meta-pill">
                    <span>{k}</span>
                    <span className="meta-pill-val">{v}</span>
                  </div>
                ))}
              </div>
              <div className="proyecto-content-wrapper" style={{ marginTop: '24px' }}>
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="proyecto-link-glass">
                  Visitar sitio ↗
                </a>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
