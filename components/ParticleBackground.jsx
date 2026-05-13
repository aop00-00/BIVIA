// ── THREE.JS PARTICLE BACKGROUND ─────────────────────────────────────────────
function ParticleBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !window.THREE) return;

    const THREE = window.THREE;

    // ── Scene setup ──────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 80;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x0B0D0F, 1);
    mount.appendChild(renderer.domElement);

    // ── Particles ────────────────────────────────────────────────────────────
    const COUNT = 1800;
    const positions = new Float32Array(COUNT * 3);
    const colors    = new Float32Array(COUNT * 3);
    const sizes     = new Float32Array(COUNT);

    // Brand palette: sand, olive, golden
    const palette = [
      new THREE.Color('#C8B895'),
      new THREE.Color('#8B744A'),
      new THREE.Color('#A89060'),
      new THREE.Color('#777735'),
      new THREE.Color('#B49C64'),
    ];

    for (let i = 0; i < COUNT; i++) {
      // Spread in a volume biased toward the center
      positions[i * 3]     = (Math.random() - 0.5) * 220;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 130;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 180;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3]     = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      sizes[i] = 0.4 + Math.random() * 1.6;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

    // Circular soft sprite via canvas texture
    const spriteCanvas = document.createElement('canvas');
    spriteCanvas.width = spriteCanvas.height = 64;
    const sc = spriteCanvas.getContext('2d');
    const sg = sc.createRadialGradient(32, 32, 0, 32, 32, 32);
    sg.addColorStop(0,   'rgba(255,255,255,1)');
    sg.addColorStop(0.35,'rgba(255,255,255,0.6)');
    sg.addColorStop(1,   'rgba(255,255,255,0)');
    sc.fillStyle = sg;
    sc.fillRect(0, 0, 64, 64);
    const spriteTex = new THREE.CanvasTexture(spriteCanvas);

    const mat = new THREE.PointsMaterial({
      size: 1.4,
      sizeAttenuation: true,
      vertexColors: true,
      map: spriteTex,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // ── Nebula glow orbs (large soft spheres) ────────────────────────────────
    const orbData = [
      { pos: [-60, 30, -40], col: '#C8B895', size: 45, alpha: 0.06 },
      { pos: [ 50,-20, -60], col: '#8B744A', size: 55, alpha: 0.07 },
      { pos: [  0, 10, -30], col: '#A89060', size: 35, alpha: 0.05 },
      { pos: [-30,-40, -50], col: '#777735', size: 40, alpha: 0.04 },
    ];

    const orbs = orbData.map(({ pos, col, size, alpha }) => {
      const orbGeo = new THREE.SphereGeometry(size, 16, 16);
      const orbMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(col),
        transparent: true,
        opacity: alpha,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Mesh(orbGeo, orbMat);
      mesh.position.set(...pos);
      scene.add(mesh);
      return { mesh, baseOpacity: alpha };
    });

    // ── GSAP intro fade-in ────────────────────────────────────────────────────
    gsap.to(mat, { opacity: 0.82, duration: 2.8, ease: 'power2.inOut', delay: 0.2 });
    orbs.forEach(({ mesh }, i) => {
      gsap.to(mesh.material, {
        opacity: orbData[i].alpha,
        duration: 3.2,
        ease: 'power2.inOut',
        delay: 0.4 + i * 0.15,
      });
    });

    // ── Mouse parallax ───────────────────────────────────────────────────────
    const mouse = { x: 0, y: 0 };
    const targetRot = { x: 0, y: 0 };

    function onMouseMove(e) {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }
    window.addEventListener('mousemove', onMouseMove);

    // ── Scroll: slow drift on Y ───────────────────────────────────────────────
    let scrollY = 0;
    function onScroll() { scrollY = window.scrollY; }
    window.addEventListener('scroll', onScroll, { passive: true });

    // ── Resize ───────────────────────────────────────────────────────────────
    function onResize() {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    }
    window.addEventListener('resize', onResize);

    // ── Animation loop ───────────────────────────────────────────────────────
    let raf;
    let clock = 0;

    function animate() {
      raf = requestAnimationFrame(animate);
      clock += 0.004;

      // Smooth mouse parallax on the whole scene
      targetRot.x += (-mouse.y * 0.06 - targetRot.x) * 0.04;
      targetRot.y += ( mouse.x * 0.08 - targetRot.y) * 0.04;
      points.rotation.x = targetRot.x;
      points.rotation.y = targetRot.y;

      // Slow auto-rotation
      points.rotation.z = clock * 0.06;

      // Scroll drift: camera moves slightly down as page scrolls
      camera.position.y = -scrollY * 0.012;

      // Breathe orbs
      orbs.forEach(({ mesh, baseOpacity }, i) => {
        mesh.material.opacity = baseOpacity * (0.75 + 0.25 * Math.sin(clock * 0.7 + i * 1.3));
        mesh.position.x += Math.sin(clock * 0.3 + i) * 0.015;
        mesh.position.y += Math.cos(clock * 0.25 + i) * 0.012;
      });

      renderer.render(scene, camera);
    }
    animate();

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      spriteTex.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
}
