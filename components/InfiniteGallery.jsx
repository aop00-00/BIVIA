// ── INFINITE GALLERY ─────────────────────────────────────
function InfiniteGallery({ images, speed = 1 }) {
  const mountRef = React.useRef(null);

  React.useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !window.THREE) return;
    const T = window.THREE;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Let touch/pointer events pass through the canvas to the document
    // so the page can scroll naturally and our document-level listeners fire
    renderer.domElement.style.pointerEvents = 'none';
    renderer.domElement.style.touchAction = 'none';

    mount.appendChild(renderer.domElement);

    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(55, width / height, 0.1, 1000);

    const VISIBLE = 8;
    const DEPTH = 50;

    const createMat = () => new T.ShaderMaterial({
      transparent: true,
      side: T.DoubleSide,
      uniforms: {
        map: { value: null },
        opacity: { value: 1.0 },
        blurAmount: { value: 0.0 },
        scrollForce: { value: 0.0 },
        time: { value: 0.0 },
        isHovered: { value: 0.0 },
      },
      vertexShader: `
    uniform float scrollForce; uniform float time; uniform float isHovered;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec3 pos = position;
      float ci = scrollForce * 0.3;
      float d = length(pos.xy);
      float curve = d * d * ci;
      float r1 = sin(pos.x*2.0+scrollForce*3.0)*0.02;
      float r2 = sin(pos.y*2.5+scrollForce*2.0)*0.015;
      float cloth = (r1+r2)*abs(ci)*2.0;
      float flag = 0.0;
      if(isHovered>0.5){
        float dp = smoothstep(-0.5,0.5,pos.x);
        flag = sin(pos.x*3.0+time*8.0)*0.1*dp + sin(pos.x*5.0+time*12.0)*0.03*dp;
      }
      pos.z -= (curve+cloth+flag);
      gl_Position = projectionMatrix*modelViewMatrix*vec4(pos,1.0);
    }
  `,
      fragmentShader: `
    uniform sampler2D map; uniform float opacity; uniform float blurAmount; uniform float scrollForce;
    varying vec2 vUv;
    void main() {
      vec4 color = texture2D(map,vUv);
      if(blurAmount>0.0){
        vec2 ts = vec2(0.002)*blurAmount;
        vec4 b = vec4(0.0); float t = 0.0;
        for(float x=-2.0;x<=2.0;x+=1.0){
          for(float y=-2.0;y<=2.0;y+=1.0){
            float w=1.0/(1.0+length(vec2(x,y)));
            b+=texture2D(map,vUv+vec2(x,y)*ts)*w;
            t+=w;
          }
        }
        color=b/t;
      }
      gl_FragColor=vec4(color.rgb,color.a*opacity);
    }
  `,
    });

    const materials = Array.from({ length: VISIBLE }, createMat);
    const geo = new T.PlaneGeometry(1, 1, 32, 32);
    const meshes = materials.map(mat => {
      const m = new T.Mesh(geo, mat);
      scene.add(m);
      return m;
    });

    const spatialPos = Array.from({ length: VISIBLE }, (_, i) => ({
      x: (Math.sin((i * 2.618) % (Math.PI * 2)) * (i % 3) * 1.2 * 8) / 3,
      y: (Math.cos((i * 1.618 + Math.PI / 3) % (Math.PI * 2)) * ((i + 1) % 4) * 0.8 * 8) / 4,
    }));

    const textures = Array(images.length).fill(null);
    const loader = new T.TextureLoader();
    images.forEach((img, i) => {
      const src = typeof img === 'string' ? img : img.src;
      loader.load(src, tex => { textures[i] = tex; });
    });

    const planes = Array.from({ length: VISIBLE }, (_, i) => ({
      z: (DEPTH / VISIBLE) * i,
      imageIndex: i % Math.max(images.length, 1),
      x: spatialPos[i].x,
      y: spatialPos[i].y,
    }));

    let vel = 0, autoPlay = true, lastInteract = Date.now(), rafId;
    let lastT = performance.now();

    // ── WHEEL (desktop) ────────────────────────────────────────
    // Canvas has pointer-events:none so wheel goes to the section wrapper
    const onWheel = e => {
      const rect = mount.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) {
        e.preventDefault();
        vel += e.deltaY * 0.01 * speed;
        autoPlay = false;
        lastInteract = Date.now();
      }
    };

    const onKey = e => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { vel -= 2 * speed; autoPlay = false; lastInteract = Date.now(); }
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { vel += 2 * speed; autoPlay = false; lastInteract = Date.now(); }
    };

    // ── SCROLL — works on mobile because canvas has pointer-events:none ─
    // The user scrolls the page naturally. window.scroll fires and feeds vel.
    let lastScrollY = window.scrollY;
    const onScroll = () => {
      const rect = mount.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.9 && rect.bottom > window.innerHeight * 0.1;
      if (inView) {
        const delta = window.scrollY - lastScrollY;
        if (Math.abs(delta) > 0) {
          vel += delta * 0.015 * speed;
          autoPlay = false;
          lastInteract = Date.now();
        }
      }
      lastScrollY = window.scrollY;
    };

    // ── TOUCH on the section wrapper (not canvas) ──────────────
    // Since canvas is pointer-events:none, touch events land on the mount div.
    // We use these to drive vel independently of page scroll for extra responsiveness.
    let touchStartY = 0;
    let touchLastY = 0;
    const onTouchStart = e => {
      touchStartY = e.touches[0].clientY;
      touchLastY = e.touches[0].clientY;
      lastInteract = Date.now();
    };
    const onTouchMove = e => {
      const currentY = e.touches[0].clientY;
      const delta = touchLastY - currentY;
      vel += delta * 0.025 * speed;
      touchLastY = currentY;
      autoPlay = false;
      lastInteract = Date.now();
    };

    // Attach wheel to the mount wrapper (not canvas, since canvas is pointer-events:none)
    mount.addEventListener('wheel', onWheel, { passive: false });
    mount.addEventListener('touchstart', onTouchStart, { passive: true });
    mount.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKey);
    const autoTimer = setInterval(() => { if (Date.now() - lastInteract > 3000) autoPlay = true; }, 1000);

    const FI = { start: 0.05, end: 0.25 };
    const FO = { start: 0.75, end: 0.95 };
    const BI = { start: 0.0, end: 0.1 };
    const BO = { start: 0.9, end: 1.0 };
    const MAX_BLUR = 6.0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;
      const time = now / 1000;

      if (autoPlay) vel += 0.3 * dt;
      vel *= 0.95;

      const nImg = images.length;
      const advance = VISIBLE % nImg || nImg;

      planes.forEach((plane, i) => {
        let nz = plane.z + vel * dt * 10;
        let fw = 0, bw = 0;
        if (nz >= DEPTH) { fw = Math.floor(nz / DEPTH); nz -= DEPTH * fw; }
        else if (nz < 0) { bw = Math.ceil(-nz / DEPTH); nz += DEPTH * bw; }
        if (fw > 0) plane.imageIndex = (plane.imageIndex + fw * advance) % nImg;
        if (bw > 0) { const s = plane.imageIndex - bw * advance; plane.imageIndex = ((s % nImg) + nImg) % nImg; }
        plane.z = ((nz % DEPTH) + DEPTH) % DEPTH;

        const norm = plane.z / DEPTH;
        let op = 1;
        if (norm < FI.start) op = 0;
        else if (norm <= FI.end) op = (norm - FI.start) / (FI.end - FI.start);
        else if (norm > FO.end) op = 0;
        else if (norm >= FO.start) op = 1 - (norm - FO.start) / (FO.end - FO.start);
        op = Math.max(0, Math.min(1, op));

        let bl = 0;
        if (norm < BI.start) bl = MAX_BLUR;
        else if (norm <= BI.end) bl = MAX_BLUR * (1 - (norm - BI.start) / (BI.end - BI.start));
        else if (norm > BO.end) bl = MAX_BLUR;
        else if (norm >= BO.start) bl = MAX_BLUR * (norm - BO.start) / (BO.end - BO.start);
        bl = Math.max(0, Math.min(MAX_BLUR, bl));

        const mat = materials[i];
        const tex = textures[plane.imageIndex];
        if (mat && mat.uniforms) {
          mat.uniforms.opacity.value = op;
          mat.uniforms.blurAmount.value = bl;
          mat.uniforms.time.value = time;
          mat.uniforms.scrollForce.value = vel;
          if (tex) mat.uniforms.map.value = tex;
        }
        const mesh = meshes[i];
        if (mesh) {
          mesh.position.set(plane.x, plane.y, plane.z - DEPTH / 2);
          if (tex && tex.image) {
            const asp = tex.image.width / tex.image.height;
            mesh.scale.set(asp > 1 ? 2 * asp : 2, asp > 1 ? 2 : 2 / asp, 1);
          }
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(autoTimer);
      mount.removeEventListener('wheel', onWheel);
      mount.removeEventListener('touchstart', onTouchStart);
      mount.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}
