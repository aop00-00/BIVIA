// ── HERO — sticky scroll pin + Three.js portal ───────────────────────────────
function Hero() {
  const container = useRef(null);
  const threeRef  = useRef(null);

  useEffect(() => {
    const mount = threeRef.current;
    if (!mount || !window.THREE) return;
    const THREE = window.THREE;

    // ── Scene + camera ──────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 300);
    camera.position.set(0, 0, 12);
    camera.rotation.x = -0.04;

    // TRANSPARENT — ParticleBackground shows through
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    Object.assign(renderer.domElement.style, {
      position: 'absolute', top: '0', left: '0', width: '100%', height: '100%',
    });
    mount.appendChild(renderer.domElement);

    // ── Lights ──────────────────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0x100C06, 0.4);
    scene.add(ambient);

    const portalLight = new THREE.PointLight(0xDCB964, 0, 32);
    portalLight.position.set(0, 0.3, -5.2);
    portalLight.castShadow = true;
    scene.add(portalLight);

    const fillLight = new THREE.SpotLight(0xF0D890, 0, 40, Math.PI * 0.28, 0.6);
    fillLight.position.set(0, 2.5, -4.2);
    fillLight.target.position.set(0, -4, 6);
    scene.add(fillLight);
    scene.add(fillLight.target);

    const rimLight = new THREE.DirectionalLight(0xC8B895, 0);
    rimLight.position.set(0, 8, 4);
    scene.add(rimLight);

    // ── Portal dimensions ────────────────────────────────────────────────────
    const DOOR_W  = 2.8;
    const DOOR_H  = 5.0;
    const FRAME_T = 0.1;
    const WALL_Z  = -4.5;

    // ── Gold frame (no solid walls — particles visible in bg) ────────────────
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xC8B895, roughness: 0.28, metalness: 0.72,
      emissive: 0xC8B895, emissiveIntensity: 0,
    });
    const lFrameGeo = new THREE.BoxGeometry(FRAME_T, DOOR_H + FRAME_T, 0.1);
    const lFrame    = new THREE.Mesh(lFrameGeo, frameMat);
    lFrame.position.set(-DOOR_W / 2, 0, WALL_Z + 0.3);
    scene.add(lFrame);
    const rFrame = lFrame.clone();
    rFrame.position.set(DOOR_W / 2, 0, WALL_Z + 0.3);
    scene.add(rFrame);
    const tFrameGeo = new THREE.BoxGeometry(DOOR_W + FRAME_T * 2, FRAME_T, 0.1);
    const tFrame    = new THREE.Mesh(tFrameGeo, frameMat);
    tFrame.position.set(0, DOOR_H / 2, WALL_Z + 0.3);
    scene.add(tFrame);
    const bFrame = tFrame.clone();
    bFrame.position.set(0, -DOOR_H / 2, WALL_Z + 0.3);
    scene.add(bFrame);

    // Inner detail frame
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x8B744A, roughness: 0.4, metalness: 0.6,
      emissive: 0x8B744A, emissiveIntensity: 0,
    });
    const INSET = 0.2;
    const liGeo = new THREE.BoxGeometry(FRAME_T * 0.5, DOOR_H - INSET * 2, 0.06);
    const li    = new THREE.Mesh(liGeo, innerMat);
    li.position.set(-DOOR_W / 2 + INSET, 0, WALL_Z + 0.36);
    scene.add(li);
    const ri = li.clone(); ri.position.set(DOOR_W / 2 - INSET, 0, WALL_Z + 0.36); scene.add(ri);
    const tiGeo = new THREE.BoxGeometry(DOOR_W - INSET * 2, FRAME_T * 0.5, 0.06);
    const ti    = new THREE.Mesh(tiGeo, innerMat);
    ti.position.set(0, DOOR_H / 2 - INSET, WALL_Z + 0.36);
    scene.add(ti);
    const bi = ti.clone(); bi.position.set(0, -DOOR_H / 2 + INSET, WALL_Z + 0.36); scene.add(bi);

    // ── Portal glow planes ───────────────────────────────────────────────────
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xF0D060, transparent: true, opacity: 0,
      depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const glowGeo = new THREE.PlaneGeometry(DOOR_W - FRAME_T * 2, DOOR_H - FRAME_T * 2);
    const glow    = new THREE.Mesh(glowGeo, glowMat);
    glow.position.set(0, 0, WALL_Z - 0.05);
    scene.add(glow);

    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xDCB964, transparent: true, opacity: 0,
      side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const haloGeo = new THREE.PlaneGeometry(DOOR_W + 1.8, DOOR_H + 1.4);
    const halo    = new THREE.Mesh(haloGeo, haloMat);
    halo.position.set(0, 0, WALL_Z - 0.25);
    scene.add(halo);

    // ── Door leaves ──────────────────────────────────────────────────────────
    const doorMat    = new THREE.MeshStandardMaterial({ color: 0x141008, roughness: 0.78, metalness: 0.22 });
    const doorPanGeo = new THREE.BoxGeometry(DOOR_W / 2, DOOR_H - FRAME_T * 2, 0.1);

    const lPivot = new THREE.Group();
    lPivot.position.set(-DOOR_W / 2, 0, WALL_Z + 0.2);
    const lLeaf = new THREE.Mesh(doorPanGeo, doorMat);
    lLeaf.position.set(DOOR_W / 4, 0, 0);
    lPivot.add(lLeaf);
    scene.add(lPivot);

    const rPivot = new THREE.Group();
    rPivot.position.set(DOOR_W / 2, 0, WALL_Z + 0.2);
    const rLeaf = new THREE.Mesh(doorPanGeo, doorMat);
    rLeaf.position.set(-DOOR_W / 4, 0, 0);
    rPivot.add(rLeaf);
    scene.add(rPivot);

    // Handles
    const hndMat = new THREE.MeshStandardMaterial({ color: 0xC8B895, metalness: 0.86, roughness: 0.14 });
    const hndGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.26, 8);
    const lHnd   = new THREE.Mesh(hndGeo, hndMat);
    lHnd.rotation.z = Math.PI / 2;
    lHnd.position.set(DOOR_W / 4 - 0.2, 0.1, 0.065);
    lLeaf.add(lHnd);
    const rHnd = lHnd.clone(); rHnd.position.set(-(DOOR_W / 4 - 0.2), 0.1, 0.065); rLeaf.add(rHnd);

    // ── Floor slab ───────────────────────────────────────────────────────────
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x0C0A07, roughness: 0.96, transparent: true, opacity: 0.9 });
    const floorGeo = new THREE.PlaneGeometry(DOOR_W * 2.8, 12);
    const floor    = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -DOOR_H / 2, WALL_Z + 4.5);
    floor.receiveShadow = true;
    scene.add(floor);

    // Beam
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xDCB964, transparent: true, opacity: 0,
      side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const beamGeo = new THREE.BufferGeometry();
    const bv = new Float32Array([
      -DOOR_W * 0.34, 0, 0.1,   DOOR_W * 0.34, 0, 0.1,
       DOOR_W * 2.5,  0, -10,  -DOOR_W * 2.5,  0, -10,
    ]);
    beamGeo.setAttribute('position', new THREE.BufferAttribute(bv, 3));
    beamGeo.setIndex([0, 1, 2, 0, 2, 3]);
    beamGeo.computeVertexNormals();
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.set(0, -DOOR_H / 2 + 0.01, WALL_Z + 0.32);
    scene.add(beam);

    // Cube
    const cubeMat = new THREE.MeshStandardMaterial({
      color: 0x2A1E0C, roughness: 0.5, metalness: 0.5,
      emissive: 0xC8B895, emissiveIntensity: 0,
    });
    const cubeGeo = new THREE.BoxGeometry(0.36, 0.36, 0.36);
    const cube    = new THREE.Mesh(cubeGeo, cubeMat);
    cube.position.set(0.2, -DOOR_H / 2 + 0.18, WALL_Z + 1.3);
    scene.add(cube);

    // Dust
    const DUST    = 200;
    const dustPos = new Float32Array(DUST * 3);
    for (let i = 0; i < DUST; i++) {
      dustPos[i * 3]     = (Math.random() - 0.5) * (DOOR_W - 0.4);
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * (DOOR_H - 0.6);
      dustPos[i * 3 + 2] = WALL_Z + Math.random() * 2.8;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xF5E8A0, size: 0.022, transparent: true, opacity: 0,
      depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // ── Shared state (camera Z driven from outside the loop) ─────────────────
    const state = {
      camZ: 12,
      breathing: false,
      introComplete: false,
    };

    // ── Mouse parallax via rotation ──────────────────────────────────────────
    const mouse = { x: 0, y: 0 };
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove);

    // ── Resize ───────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // ── Render loop ──────────────────────────────────────────────────────────
    let raf, clock = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      clock += 0.008;

      camera.position.z = state.camZ;
      camera.rotation.x += (-mouse.y * 0.022 - 0.04 - camera.rotation.x) * 0.036;
      camera.rotation.y += ( mouse.x * 0.028 - camera.rotation.y) * 0.036;

      if (state.breathing) {
        const t = 40 + Math.sin(clock * 0.58) * 11;
        portalLight.intensity += (t       - portalLight.intensity) * 0.015;
        fillLight.intensity   += (t * 0.28 - fillLight.intensity)  * 0.015;
        glowMat.opacity       += (0.28 + Math.sin(clock * 0.5) * 0.04 - glowMat.opacity) * 0.018;
        haloMat.opacity       += (0.28 + Math.sin(clock * 0.4) * 0.04 - haloMat.opacity) * 0.018;
      }

      // Dust float
      const dp = dustGeo.attributes.position.array;
      for (let i = 0; i < DUST; i++) {
        dp[i * 3 + 1] += 0.0015 + Math.sin(clock * 0.9 + i) * 0.0007;
        if (dp[i * 3 + 1] > DOOR_H / 2) dp[i * 3 + 1] = -DOOR_H / 2;
      }
      dustGeo.attributes.position.needsUpdate = true;

      cube.rotation.y = clock * 0.22;
      cube.rotation.x = clock * 0.09;

      renderer.render(scene, camera);
    };
    animate();

    // ── GSAP intro — lock scroll during animation ─────────────────────────────
    const darkEl  = document.getElementById('hero-overlay-dark');
    const flashEl = document.getElementById('hero-overlay-flash');
    const scrollEl= document.getElementById('hero-overlay-scroll');

    // Lock scroll while intro plays (only if starting from top)
    const atTop = window.scrollY < 5;
    if (atTop) document.body.style.overflow = 'hidden';

    const introTl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        state.camZ          = 8.5;
        state.introComplete = true;
        state.breathing     = true;
        // Re-sync ScrollTrigger in case user was already mid-scroll
        ScrollTrigger.refresh();
      },
    });

    if (atTop) {
      // FASE 2 — portal wakes
      introTl
        .to(portalLight, { intensity: 80,  duration: 0.75, ease: 'power3.in'  }, 0.4)
        .to(glowMat,     { opacity: 0.18,  duration: 0.65, ease: 'power3.in'  }, 0.4)
        .to(haloMat,     { opacity: 0.14,  duration: 0.65, ease: 'power2.in'  }, 0.4)
        .to(darkEl,      { opacity: 0,     duration: 0.5,  ease: 'power2.out' }, 0.65);

      // FASE 3 — doors open
      introTl
        .to(lPivot.rotation, { y: -Math.PI / 2, duration: 1.5, ease: 'power2.inOut' }, 1.2)
        .to(rPivot.rotation, { y:  Math.PI / 2, duration: 1.5, ease: 'power2.inOut' }, 1.2)
        .to(portalLight,  { intensity: 210, duration: 0.5,  ease: 'power4.in'  }, 1.4)
        .to(portalLight,  { intensity: 50,  duration: 1.0,  ease: 'power2.out' }, 1.9)
        .to(fillLight,    { intensity: 16,  duration: 1.2,  ease: 'power2.out' }, 1.5)
        .to(glowMat,      { opacity: 0.32,  duration: 0.5,  ease: 'power2.in'  }, 1.4)
        .to(haloMat,      { opacity: 0.28,  duration: 1.2,  ease: 'power2.out' }, 1.5)
        .to(beamMat,      { opacity: 0.20,  duration: 1.2,  ease: 'power2.out' }, 1.5)
        .to(dustMat,      { opacity: 0.78,  duration: 1.2,  ease: 'power2.out' }, 1.5)
        .to(rimLight,     { intensity: 0.7, duration: 1.2,  ease: 'power2.out' }, 1.5)
        .to(frameMat,     { emissiveIntensity: 0.38, duration: 1.2, ease: 'power2.out' }, 1.5)
        .to(innerMat,     { emissiveIntensity: 0.22, duration: 1.2, ease: 'power2.out' }, 1.5)
        .to(state,        { camZ: 8.5, duration: 1.6, ease: 'power2.inOut' }, 1.2);

      // FASE 4 — flash (intro termina aquí, sin reveal de texto)
      introTl
        .to(flashEl,  { opacity: 1, duration: 0.26, ease: 'power3.in'  }, 2.9)
        .to(flashEl,  { opacity: 0, duration: 0.34, ease: 'power2.out' }, 3.16)
        .to(cubeMat,  { emissiveIntensity: 0.5, duration: 0.4, ease: 'power2.out' }, 3.05);
    } else {
      // Skip intro if page already scrolled
      if (darkEl)  darkEl.style.opacity  = '0';
      if (flashEl) flashEl.style.opacity = '0';
      state.camZ          = 8.5;
      state.introComplete = true;
      state.breathing     = true;
      lPivot.rotation.y = -Math.PI / 2;
      rPivot.rotation.y =  Math.PI / 2;
      portalLight.intensity = 50;
      fillLight.intensity   = 16;
      glowMat.opacity       = 0.32;
      haloMat.opacity       = 0.28;
      beamMat.opacity       = 0.20;
      dustMat.opacity       = 0.78;
      rimLight.intensity    = 0.7;
      frameMat.emissiveIntensity = 0.38;
      innerMat.emissiveIntensity = 0.22;
      cubeMat.emissiveIntensity  = 0.5;
    }

    // ── PINNED SCROLL: sticky CSS + ScrollTrigger progress ───────────────────
    // #hero-wrapper has height:350vh in CSS → hero sticky for 250vh of scroll
    const scrollST = ScrollTrigger.create({
      trigger: '#hero-wrapper',
      start: 'top top',
      end: 'bottom bottom',   // bottom of 350vh wrapper hits bottom of viewport = 250vh scroll
      scrub: 1.2,

      onUpdate(self) {
        if (!state.introComplete) return;
        const t = self.progress; // 0 → 1

        // Camera flies from z=8.5 (outside) into portal (WALL_Z=-4.5) and beyond
        state.camZ = 8.5 - t * 14; // z goes 8.5 → -5.5

        // Portal light explodes as camera approaches
        portalLight.intensity = 40 + t * 420;
        fillLight.intensity   = 16 + t * 110;
        glowMat.opacity       = Math.min(0.55, 0.32 + t * 0.23);
        haloMat.opacity       = 0.28 + t * 0.65;
        beamMat.opacity       = 0.20 + t * 0.45;

        // Stop breathing during scroll
        state.breathing = false;

        // Golden bloom fills screen as camera enters portal
        const enterProgress = Math.max(0, (t - 0.68) / 0.32);
        if (flashEl) flashEl.style.opacity = enterProgress.toFixed(3);
        // Subtle ambient scroll overlay
        if (scrollEl) scrollEl.style.opacity = Math.min(0.15, t * 0.2).toFixed(3);
        // Fade Three.js canvas out as camera passes through portal wall (t: 0.85 → 1)
        // so the halo/beam geometry doesn't show as a gold band when flash fades
        if (t > 0.85) {
          renderer.domElement.style.opacity = (1 - (t - 0.85) / 0.15).toFixed(3);
        } else {
          renderer.domElement.style.opacity = '1';
        }
      },

      onLeave() {
        // Canvas fully hidden before flash fades — eliminates golden band artifact
        renderer.domElement.style.opacity = '0';
        if (flashEl) gsap.to(flashEl, { opacity: 0, duration: 0.7, ease: 'power2.out', delay: 0.1 });
        if (scrollEl) gsap.to(scrollEl, { opacity: 0, duration: 0.4, ease: 'power2.out' });
      },

      onLeaveBack() {
        renderer.domElement.style.opacity = '1';
        state.breathing = true;
        if (flashEl && parseFloat(flashEl.style.opacity) > 0) {
          gsap.to(flashEl, { opacity: 0, duration: 0.3, ease: 'power2.out' });
        }
      },
    });

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = '';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      introTl.kill();
      scrollST.kill();
      [lFrameGeo, tFrameGeo, liGeo, tiGeo, glowGeo, haloGeo,
       doorPanGeo, floorGeo, beamGeo, cubeGeo, dustGeo, hndGeo].forEach(g => g.dispose());
      [frameMat, innerMat, glowMat, haloMat, doorMat, floorMat,
       beamMat, cubeMat, dustMat, hndMat].forEach(m => m.dispose());
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div id="hero-wrapper">
      <section id="hero" ref={container}>

        {/* ── Overlays ───────────────────────────────────────────────────── */}
        <div id="hero-overlay-dark" style={{
          position: 'fixed', inset: 0, background: '#0B0D0F',
          zIndex: 1000, pointerEvents: 'none',
        }} />
        <div id="hero-overlay-flash" style={{
          position: 'fixed', inset: 0,
          background: 'radial-gradient(ellipse at center, #FFFDF0 0%, #F2E8C8 38%, #C8B895 68%, #8B744A 100%)',
          opacity: 0, zIndex: 1001, pointerEvents: 'none',
        }} />
        <div id="hero-overlay-scroll" style={{
          position: 'fixed', inset: 0,
          background: 'radial-gradient(ellipse 55% 50% at 50% 42%, #DCB964 0%, #8B744A 50%, transparent 100%)',
          opacity: 0, zIndex: 998, pointerEvents: 'none',
        }} />

        {/* ── Three.js canvas — portal only, no text ─────────────────────── */}
        <div ref={threeRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      </section>
    </div>
  );
}
