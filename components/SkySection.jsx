// ── SKY SECTION — GLSL sky + falling cloud parallax ──────────────────────

const SKY_CARDS = [
  {
    id: 'sky-card-0',
    inAt: 0.06, outAt: 0.22,
    x: '7%', y: '22%',
    type: 'stat',
    label: 'TRAYECTORIA',
    value: '+40',
    sub: 'proyectos entregados en LATAM',
  },
  {
    id: 'sky-card-1',
    inAt: 0.20, outAt: 0.38,
    x: '54%', y: '16%',
    type: 'project',
    tag: 'E-COMMERCE',
    title: 'Tienda Electrolitos',
    desc: 'Ecosistema digital completo: branding, e-commerce y automatización de operaciones.',
    pills: ['Shopify', 'CRM', '+320% ventas'],
  },
  {
    id: 'sky-card-2',
    inAt: 0.36, outAt: 0.54,
    x: '5%', y: '18%',
    type: 'quote',
    quote: '"Construimos los sistemas que permiten a los negocios escalar sin caos."',
  },
  {
    id: 'sky-card-3',
    inAt: 0.52, outAt: 0.70,
    x: '51%', y: '28%',
    type: 'project',
    tag: 'PLATAFORMA EDUCATIVA',
    title: 'Ecosistema Estudios',
    desc: 'LMS integrado con automatización de cobranza, CRM y seguimiento de alumnos en tiempo real.',
    pills: ['LMS', 'Automatización', 'CRM'],
  },
  {
    id: 'sky-card-4',
    inAt: 0.68, outAt: 0.92,
    x: '16%', y: '20%',
    type: 'cta',
    label: 'SIGUIENTE PASO',
    title: 'Hablemos.',
    sub: 'Diseñamos el sistema que tu negocio necesita para escalar.',
  },
];

function SkySection() {
  const wrapperRef = React.useRef(null);
  const canvasRef  = React.useRef(null);

  React.useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas  = canvasRef.current;
    if (!wrapper || !canvas) return;

    const THREE = window.THREE;
    let animId;
    let st;

    // ── Renderer — sky blue clear so no black flash ───────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x2196f3, 1); // sky blue fallback color

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 1);

    // ── GLSL sky shader (full-screen background quad) ─────────────────────────
    const skyMat = new THREE.ShaderMaterial({
      uniforms: {
        uProgress: { value: 0 },
        uTime:     { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 1.0, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uProgress;
        uniform float uTime;
        varying vec2 vUv;

        vec3 skyColorAt(float t) {
          vec3 horizon = vec3(0.82, 0.91, 0.98);
          vec3 skyLow  = vec3(0.32, 0.70, 0.90);
          vec3 skyMid  = vec3(0.20, 0.58, 0.85);
          vec3 zenith  = vec3(0.14, 0.48, 0.80);
          float p1 = smoothstep(0.0,  0.30, t);
          float p2 = smoothstep(0.25, 0.65, t);
          float p3 = smoothstep(0.55, 1.00, t);
          vec3 c = mix(horizon, skyLow, pow(p1, 0.65));
          c      = mix(c, skyMid,  pow(p2, 0.80));
          c      = mix(c, zenith,  pow(p3, 0.90));
          return c;
        }

        void main() {
          // Shift toward horizon (lower UV) as user scrolls — feels like looking forward/down
          float scrolledUv = clamp(vUv.y - uProgress * 0.25, 0.0, 1.0);
          vec3 sky = skyColorAt(scrolledUv);

          // Sun glow top-right, fades as scroll progresses
          float sunDist = length(vUv - vec2(0.78, 0.88));
          float sunGlow = smoothstep(0.42, 0.0, sunDist) * (1.0 - uProgress * 0.9);
          sky += vec3(0.15, 0.09, 0.02) * sunGlow;

          sky += sin(uTime * 0.3) * 0.005;
          gl_FragColor = vec4(clamp(sky, 0.0, 1.0), 1.0);
        }
      `,
      depthTest:  false,
      depthWrite: false,
    });

    const skyMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), skyMat);
    skyMesh.renderOrder = -1;
    scene.add(skyMesh);

    // ── Cloud canvas texture ──────────────────────────────────────────────────
    function makeCloudTexture(size) {
      const c = document.createElement('canvas');
      c.width = c.height = size;
      const ctx = c.getContext('2d');
      const blobs = [
        { x: 0,             y: 0,             r: size * 0.28 },
        { x:  size * 0.22,  y: -size * 0.05,  r: size * 0.24 },
        { x: -size * 0.22,  y: -size * 0.02,  r: size * 0.22 },
        { x:  size * 0.12,  y:  size * 0.12,  r: size * 0.20 },
        { x: -size * 0.14,  y:  size * 0.10,  r: size * 0.18 },
        { x:  size * 0.35,  y:  size * 0.05,  r: size * 0.16 },
        { x: -size * 0.34,  y:  size * 0.04,  r: size * 0.15 },
        { x:  0,            y:  size * 0.18,  r: size * 0.18 },
      ];
      const cx = size / 2, cy = size / 2;
      blobs.forEach(b => {
        const g = ctx.createRadialGradient(cx + b.x, cy + b.y, 0, cx + b.x, cy + b.y, b.r);
        g.addColorStop(0,   'rgba(255,255,255,0.88)');
        g.addColorStop(0.4, 'rgba(240,245,255,0.58)');
        g.addColorStop(1,   'rgba(220,235,255,0.00)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, size, size);
      });
      return new THREE.CanvasTexture(c);
    }

    const cloudTex = makeCloudTexture(512);

    // ── Cloud layers — camera fixed at y≈0, clouds fall downward ─────────────
    // fallSpeed: units/sec at base velocity (near = faster = stronger depth cue)
    // wrapBelow/wrapTo: Y bounds for infinite recycling
    const LAYERS = [
      { baseZ: -90, n:  7, sMin: 22, sMax: 32, op: 0.92, sx: 100, ySpread: 80, fallSpeed: 0.6,  wrapBelow: -58, wrapTo:  56 },
      { baseZ: -60, n:  8, sMin: 16, sMax: 26, op: 0.82, sx:  80, ySpread: 60, fallSpeed: 1.4,  wrapBelow: -42, wrapTo:  40 },
      { baseZ: -35, n:  9, sMin: 10, sMax: 18, op: 0.70, sx:  70, ySpread: 36, fallSpeed: 2.2,  wrapBelow: -26, wrapTo:  24 },
      { baseZ: -18, n: 10, sMin:  6, sMax: 12, op: 0.55, sx:  60, ySpread: 20, fallSpeed: 3.0,  wrapBelow: -16, wrapTo:  14 },
      { baseZ:  -8, n: 12, sMin:  4, sMax:  9, op: 0.40, sx:  50, ySpread: 12, fallSpeed: 3.8,  wrapBelow: -10, wrapTo:   9 },
    ];

    function seededRand(seed) {
      let s = seed;
      return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    }

    const clouds = [];
    LAYERS.forEach((layer, li) => {
      const rand = seededRand(42 + li * 137);
      for (let i = 0; i < layer.n; i++) {
        const scale = layer.sMin + rand() * (layer.sMax - layer.sMin);
        const mat   = new THREE.SpriteMaterial({
          map: cloudTex, transparent: true,
          opacity: layer.op - rand() * 0.10,
          depthWrite: false, depthTest: false,
        });
        const sprite = new THREE.Sprite(mat);
        sprite.scale.set(
          scale * (0.9 + rand() * 0.4),
          scale * (0.5 + rand() * 0.25),
          1
        );
        // Stagger initial Y evenly across visible range so coverage starts full
        const initY = layer.wrapTo - (i / layer.n) * (layer.wrapTo - layer.wrapBelow);
        sprite.position.set(
          (rand() - 0.5) * layer.sx,
          initY,
          layer.baseZ + (rand() - 0.5) * 8
        );
        sprite.userData = {
          baseOpacity: mat.opacity,
          driftX:      (rand() - 0.5) * 0.012,
          fallSpeed:   layer.fallSpeed,
          wrapBelow:   layer.wrapBelow,
          wrapTo:      layer.wrapTo,
        };
        sprite.renderOrder = li;
        scene.add(sprite);
        clouds.push(sprite);
      }
    });

    scene.add(new THREE.AmbientLight(0xd0e8ff, 1.2));
    const sun = new THREE.DirectionalLight(0xfff4d0, 0.6);
    sun.position.set(5, 10, -20);
    scene.add(sun);

    // ── State ─────────────────────────────────────────────────────────────────
    const state = { progress: 0 };
    let mouseX = 0, mouseY = 0;
    const onMouse = (e) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse);

    const cardEls = SKY_CARDS.map(c => document.getElementById(c.id));
    const shown   = SKY_CARDS.map(() => false);
    const fadeEl  = document.getElementById('sky-white-in');

    // ScrollTrigger tied to the 900vh wrapper
    st = ScrollTrigger.create({
      trigger: wrapper,
      start:   'top top',
      end:     'bottom bottom',
      scrub:   2.0,
      onUpdate(self) { state.progress = self.progress; },
    });

    // ── Render loop ───────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let prevT = 0;

    function animate() {
      animId = requestAnimationFrame(animate);
      const t    = clock.getElapsedTime();
      const dt   = Math.min(t - prevT, 0.05); // cap spike after tab-switch
      prevT      = t;
      const prog = state.progress;

      // Sky
      skyMat.uniforms.uProgress.value = prog;
      skyMat.uniforms.uTime.value     = t;

      // Camera — stays at y≈0, only gentle sway + mouse
      camera.position.x += ((mouseX * 1.2 + Math.sin(t * 0.15) * 0.3) - camera.position.x) * 0.025;
      camera.position.y += ((Math.sin(t * 0.08) * 0.25 - mouseY * 0.15) - camera.position.y) * 0.015;
      camera.position.z  = 1 - prog * 0.12; // very subtle forward push
      camera.rotation.x  = -mouseY * 0.010 + Math.sin(t * 0.10) * 0.004;
      camera.rotation.z  =  Math.sin(t * 0.07) * 0.003;

      // Clouds fall downward — speed is base drift + scroll-driven boost
      const fallVelocity = 0.5 + prog * 2.8;
      clouds.forEach(cloud => {
        const { driftX, fallSpeed, wrapBelow, wrapTo, baseOpacity } = cloud.userData;

        // Move downward each frame
        cloud.position.y -= dt * fallSpeed * fallVelocity;

        // Horizontal slow drift
        cloud.position.x += driftX;
        if (cloud.position.x >  70) cloud.position.x -= 140;
        if (cloud.position.x < -70) cloud.position.x += 140;

        // Infinite recycle: reappear at top when below threshold
        if (cloud.position.y < wrapBelow) {
          cloud.position.y = wrapTo;
        }

        cloud.material.opacity = baseOpacity;
      });

      // Fade in from white
      if (fadeEl) fadeEl.style.opacity = Math.max(0, 1 - prog / 0.10).toFixed(3);

      // Cards
      SKY_CARDS.forEach((c, idx) => {
        const el     = cardEls[idx];
        if (!el) return;
        const active = prog >= c.inAt && prog < c.outAt;
        if (active && !shown[idx]) {
          shown[idx] = true;
          gsap.killTweensOf(el);
          el.style.display = 'flex';
          gsap.fromTo(el,
            { opacity: 0, y: 52, scale: 0.90 },
            { opacity: 1, y: 0,  scale: 1, duration: 1.1, ease: 'power3.out' }
          );
        } else if (!active && shown[idx]) {
          shown[idx] = false;
          gsap.killTweensOf(el);
          gsap.to(el, {
            opacity: 0, y: -36, scale: 0.93,
            duration: 0.55, ease: 'power2.in',
            onComplete: () => { el.style.display = 'none'; },
          });
        }
      });

      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      if (st) st.kill();
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      cloudTex.dispose();
    };
  }, []);

  return (
    <div ref={wrapperRef} style={{ height: '900vh', position: 'relative' }}>
      <section id="sky" style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        <canvas
          ref={canvasRef}
          style={{ display: 'block', position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
        />

        {/* Film grain */}
        <div className="sky-grain" style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }} />

        {/* ── Cards ── */}
        {SKY_CARDS.map(card => (
          <div
            key={card.id}
            id={card.id}
            className={`sky-card sky-card--${card.type}`}
            style={{ display: 'none', position: 'absolute', left: card.x, top: card.y, zIndex: 10 }}
          >
            {card.type === 'stat' && <>
              <span className="sky-label">{card.label}</span>
              <div className="sky-stat-val">{card.value}</div>
              <div className="sky-stat-sub">{card.sub}</div>
            </>}

            {card.type === 'project' && <>
              <span className="sky-tag">{card.tag}</span>
              <h3 className="sky-proj-title">{card.title}</h3>
              <p className="sky-proj-desc">{card.desc}</p>
              <div className="sky-pills">
                {card.pills.map(p => <span key={p} className="sky-pill">{p}</span>)}
              </div>
            </>}

            {card.type === 'quote' && (
              <blockquote className="sky-quote">{card.quote}</blockquote>
            )}

            {card.type === 'cta' && <>
              <span className="sky-label">{card.label}</span>
              <h2 className="sky-cta-h">{card.title}</h2>
              <p className="sky-cta-sub">{card.sub}</p>
              <button
                className="sky-cta-btn"
                onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Iniciar proyecto →
              </button>
            </>}
          </div>
        ))}

        {/* White fade-in — dissolves as user enters */}
        <div id="sky-white-in" style={{
          position: 'absolute', inset: 0,
          background: '#ffffff', zIndex: 18, pointerEvents: 'none',
        }} />

      </section>
    </div>
  );
}
