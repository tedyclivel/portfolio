import React, { useEffect, useRef } from "react";

const HeroScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let disposed = false;
    let frameId = 0;
    let renderer;
    let geometry;
    let material;
    let particles;
    let resizeObserver;
    const pointer = { x: 0, y: 0 };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onPointerMove = (event) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 0.32;
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 0.22;
    };

    import("three").then((THREE) => {
      if (disposed) return;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
      camera.position.z = 5.4;
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.setAttribute("aria-hidden", "true");
      mount.appendChild(renderer.domElement);

      const count = window.innerWidth < 768 ? 220 : 420;
      const positions = new Float32Array(count * 3);
      for (let index = 0; index < count; index += 1) {
        const radius = 1.6 + Math.random() * 0.65;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[index * 3 + 2] = radius * Math.cos(phi);
      }

      geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      material = new THREE.PointsMaterial({ color: 0x64ffda, size: 0.025, transparent: true, opacity: 0.48 });
      particles = new THREE.Points(geometry, material);
      scene.add(particles);

      const resize = () => {
        const { width, height } = mount.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
      };
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(mount);
      resize();

      const render = () => {
        if (disposed) return;
        particles.rotation.y += (pointer.x - particles.rotation.y) * 0.025;
        particles.rotation.x += (-pointer.y - particles.rotation.x) * 0.025;
        particles.rotation.z += 0.0007;
        renderer.render(scene, camera);
        frameId = requestAnimationFrame(render);
      };
      if (reduceMotion) renderer.render(scene, camera);
      else render();
    });

    const pointerTarget = mount.parentElement || mount;
    pointerTarget.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      pointerTarget.removeEventListener("pointermove", onPointerMove);
      geometry?.dispose();
      material?.dispose();
      renderer?.dispose();
      renderer?.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="hero-scene" aria-hidden="true" />;
};

export default HeroScene;
