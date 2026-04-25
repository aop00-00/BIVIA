// ── FORM ──────────────────────────────────────────────────
const BUDGET_STEPS = [5000, 10000, 20000, 50000, 100000, 150000, 200000, 300000, 400000, 500000];

function formatMXN(v) {
  if (v >= 500000) return '$500k+ MXN';
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}k MXN`;
  return `$${v} MXN`;
}

function Contacto() {
  const container = useRef(null);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState({
    tipos: [],
    industria: null,
    objetivos: [],
    descripcion: '',
    timeline: null,
    budgetIdx: 4,
    nombre: '', empresa: '', telefono: '', email: '', canal: '',
  });

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.section-label-contacto', { scrollTrigger: { trigger: container.current, start: 'top 80%' }, y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' });
      gsap.from('.form-header', { scrollTrigger: { trigger: '.form-header', start: 'top 80%' }, y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' });
    }, container);
    return () => ctx.revert();
  }, []);

  const tipos = [
    { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C8B895" strokeWidth="1.4"><rect x="2" y="3" width="20" height="14" /><line x1="2" y1="20" x2="22" y2="20" /><line x1="12" y1="17" x2="12" y2="20" /></svg>, t: 'Plataforma digital', d: 'Web app, SaaS, portal' },
    { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C8B895" strokeWidth="1.4"><circle cx="12" cy="12" r="4" /><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" /></svg>, t: 'Automatización', d: 'Flujos, bots, integraciones' },
    { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C8B895" strokeWidth="1.4"><polygon points="12,2 22,22 2,22" /><line x1="12" y1="2" x2="12" y2="22" /><line x1="7" y1="15" x2="17" y2="15" /></svg>, t: 'Estrategia digital', d: 'Diagnóstico, roadmap' },
    { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C8B895" strokeWidth="1.4"><rect x="3" y="18" width="4" height="4" /><rect x="10" y="12" width="4" height="10" /><rect x="17" y="6" width="4" height="16" /><polyline points="5,14 10,9 14,12 19,5" stroke="#8B744A" strokeWidth="1.4" /></svg>, t: 'Inteligencia de datos', d: 'BI, dashboards, analytics' },
    { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C8B895" strokeWidth="1.4"><rect x="5" y="2" width="14" height="20" rx="1" /><line x1="9" y1="7" x2="15" y2="7" /><line x1="9" y1="11" x2="15" y2="11" /><rect x="9" y="15" width="6" height="4" fill="#8B744A" stroke="none" /></svg>, t: 'App móvil', d: 'iOS, Android, PWA' },
    { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C8B895" strokeWidth="1.4"><circle cx="9" cy="21" r="1" fill="#C8B895" stroke="none" /><circle cx="20" cy="21" r="1" fill="#C8B895" stroke="none" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>, t: 'E-commerce', d: 'Tienda, catálogo, checkout' },
  ];
  const industrias = [
    'Retail / Comercio', 'Salud / Wellness', 'Fintech / Banca',
    'Educación', 'Manufactura', 'Real Estate', 'Gobierno / Público', 'Otro',
  ];
  const objetivos = [
    { t: 'Aumentar ventas y conversiones', d: 'Más clientes, más ingresos' },
    { t: 'Automatizar procesos internos', d: 'Eliminar trabajo manual' },
    { t: 'Digitalizar operaciones', d: 'Pasar de papel/Excel a sistema' },
    { t: 'Mejorar experiencia del cliente', d: 'Producto o servicio más fluido' },
    { t: 'Escalar el negocio', d: 'Crecer sin aumentar costos linealmente' },
    { t: 'Tomar mejores decisiones con datos', d: 'Visibilidad y analítica' },
  ];
  const timelines = [
    { t: 'Urgente', d: 'Menos de 1 mes' },
    { t: 'Corto plazo', d: '1 a 3 meses' },
    { t: 'Medio plazo', d: '3 a 6 meses' },
    { t: 'Flexible', d: 'Más de 6 meses' },
  ];

  const steps = [
    'Tipo de proyecto', 'Industria / Sector', 'Objetivo principal',
    'Cuéntanos más', 'Timeline', 'Presupuesto', 'Tus datos',
  ];

  async function next() {
    if (step < 6) {
      setStep(s => s + 1);
    } else {
      setIsSubmitting(true);
      try {
        const payload = {
          ...data,
          presupuesto_estimado: formatMXN(BUDGET_STEPS[data.budgetIdx])
        };
        
        const response = await fetch('https://formspree.io/f/meevndjw', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        
        if (response.ok) {
          setDone(true);
        } else {
          alert('Hubo un problema al enviar tu solicitud. Inténtalo de nuevo.');
        }
      } catch (err) {
        alert('Error de conexión. Por favor, verifica tu internet.');
      } finally {
        setIsSubmitting(false);
      }
    }
  }
  function back() { setStep(s => s - 1); }

  function toggleArr(arr, val) {
    return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
  }

  function canNext() {
    if (step === 0) return data.tipos.length > 0;
    if (step === 1) return !!data.industria;
    if (step === 2) return data.objetivos.length > 0;
    if (step === 3) return data.descripcion.length > 10;
    if (step === 4) return !!data.timeline;
    if (step === 5) return true;
    if (step === 6) return data.nombre && data.email;
    return true;
  }

  const budget = BUDGET_STEPS[data.budgetIdx];

  if (done) return (
    <section id="contacto">
      <div className="form-wrapper">
        <div className="success-state">
          <div className="success-icon">✓</div>
          <div className="success-title">Recibido.</div>
          <p className="success-sub">Gracias, {data.nombre.split(' ')[0]}. Revisamos tu proyecto y te contactamos en menos de 24 horas hábiles.</p>
          <div style={{ marginTop: '16px', display: 'flex', gap: '32px', justifyContent: 'center' }}>
            {[['Tipo', data.tipos.join(', ')], ['Industria', data.industria], ['Budget', formatMXN(budget)]].map(([k, v]) => (
              <div key={k} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--stone)', marginBottom: '4px' }}>{k}</div>
                <div style={{ fontFamily: 'Sora,sans-serif', fontSize: '14px', fontWeight: '600', color: 'var(--sand)' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <section id="contacto" ref={container}>
      <div className="section-label section-label-contacto">05 — Iniciar proyecto</div>
      <div className="form-wrapper">
        <div className="form-header">
          <h2 className="form-headline">Cuéntanos tu <em>proyecto.</em></h2>
          <p className="form-sub">7 preguntas rápidas. Nada irrelevante.</p>
        </div>

        <div className="form-progress">
          {steps.map((_, i) => (
            <div key={i} className={`form-step-dot ${i === step ? 'active' : i < step ? 'done' : ''}`} />
          ))}
        </div>

        <div className="form-step-label">Paso {step + 1} de {steps.length}</div>
        <div className="form-step-title">{steps[step]}</div>

        {step === 0 && (
          <div className="options-grid">
            {tipos.map(t => (
              <button key={t.t} className={`option-card${data.tipos.includes(t.t) ? ' selected' : ''}`}
                onClick={() => setData(d => ({ ...d, tipos: toggleArr(d.tipos, t.t) }))}>
                <span className="option-card-icon">{t.icon}</span>
                <div className="option-card-title">{t.t}</div>
                <div className="option-card-desc">{t.d}</div>
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="options-grid-2">
            {industrias.map(ind => (
              <button key={ind} className={`option-pill${data.industria === ind ? ' selected' : ''}`}
                onClick={() => setData(d => ({ ...d, industria: ind }))}>
                {ind}
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="options-grid-obj">
            {objetivos.map(o => (
              <button key={o.t} className={`option-card${data.objetivos.includes(o.t) ? ' selected' : ''}`}
                onClick={() => setData(d => ({ ...d, objetivos: toggleArr(d.objetivos, o.t) }))}>
                <div className="option-card-title">{o.t}</div>
                <div className="option-card-desc">{o.d}</div>
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div>
            <textarea
              rows={6}
              placeholder="Describe tu proyecto con tus propias palabras. ¿Qué problema quieres resolver? ¿Qué tienes hoy? ¿A dónde quieres llegar?"
              value={data.descripcion}
              onChange={e => setData(d => ({ ...d, descripcion: e.target.value }))}
            />
            <div style={{ fontSize: '12px', color: 'var(--stone)', marginTop: '8px', textAlign: 'right' }}>
              {data.descripcion.length} caracteres {data.descripcion.length < 10 && '— mínimo 10'}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="timeline-grid">
            {timelines.map(t => (
              <button key={t.t} className={`option-card${data.timeline === t.t ? ' selected' : ''}`}
                onClick={() => setData(d => ({ ...d, timeline: t.t }))}>
                <div className="option-card-title">{t.t}</div>
                <div className="option-card-desc">{t.d}</div>
              </button>
            ))}
          </div>
        )}

        {step === 5 && (
          <div>
            <div className="budget-display">{formatMXN(budget)}</div>
            <div className="budget-hint" style={{ marginBottom: '24px' }}>Rango de inversión estimada en MXN (impuestos no incluidos)</div>
            <div className="slider-wrap">
              <input
                type="range" className="budget-slider"
                min={0} max={BUDGET_STEPS.length - 1}
                value={data.budgetIdx}
                onChange={e => setData(d => ({ ...d, budgetIdx: parseInt(e.target.value) }))}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: 'var(--stone)' }}>
                <span>$5k MXN</span><span>$500k+ MXN</span>
              </div>
            </div>
            <div style={{ marginTop: '32px', padding: '20px 24px', border: '1px solid var(--sand-border)', background: 'var(--sand-dim)' }}>
              <div style={{ fontSize: '12px', color: 'var(--stone)', marginBottom: '8px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Resumen del proyecto</div>
              <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                {[['Tipo', data.tipos.join(', ')], ['Industria', data.industria], ['Objetivo', data.objetivos[0]?.substring(0, 30) + '…'], ['Timeline', data.timeline]].map(([k, v]) => v && (
                  <div key={k}>
                    <div style={{ fontSize: '10px', color: 'var(--stone)', letterSpacing: '0.1em' }}>{k}</div>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--sand)', fontFamily: 'Sora,sans-serif' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-grid-2">
              <div className="form-field">
                <label className="form-label">Nombre completo *</label>
                <input type="text" placeholder="Tu nombre" value={data.nombre}
                  onChange={e => setData(d => ({ ...d, nombre: e.target.value }))} />
              </div>
              <div className="form-field">
                <label className="form-label">Empresa</label>
                <input type="text" placeholder="Nombre de tu empresa" value={data.empresa}
                  onChange={e => setData(d => ({ ...d, empresa: e.target.value }))} />
              </div>
            </div>
            <div className="form-grid-2">
              <div className="form-field">
                <label className="form-label">Correo electrónico *</label>
                <input type="email" placeholder="tu@empresa.com" value={data.email}
                  onChange={e => setData(d => ({ ...d, email: e.target.value }))} />
              </div>
              <div className="form-field">
                <label className="form-label">Teléfono</label>
                <input type="tel" placeholder="+52 55 0000 0000" value={data.telefono}
                  onChange={e => setData(d => ({ ...d, telefono: e.target.value }))} />
              </div>
            </div>
            <div className="form-field">
              <label className="form-label">¿Cómo llegaste a BIVIA?</label>
              <select value={data.canal} onChange={e => setData(d => ({ ...d, canal: e.target.value }))}>
                <option value="">Selecciona una opción</option>
                <option value="referido">Referido de un cliente</option>
                <option value="linkedin">LinkedIn</option>
                <option value="instagram">Instagram</option>
                <option value="google">Búsqueda en Google</option>
                <option value="evento">Evento o conferencia</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>
        )}

        <div className="form-nav">
          {step > 0
            ? <button className="btn-back" onClick={back}>← Atrás</button>
            : <div className="btn-back-placeholder" />
          }
          <div className="form-nav-right">
            <span className="step-counter">{step + 1} / {steps.length}</span>
            <button className="btn-next" onClick={next} disabled={!canNext() || isSubmitting}>
              {step === 6 ? (isSubmitting ? 'Enviando...' : 'Enviar proyecto →') : 'Continuar →'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
