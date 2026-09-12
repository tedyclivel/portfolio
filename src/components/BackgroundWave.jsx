import React, { useEffect, useRef } from "react";
import "../styles/BackgroundWave.css";

const BackgroundWave = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let disposed = false;
    let frameId = 0;
    let renderer;
    let geometry;
    let material;
    let tearGeometry;
    let tearMaterial;
    let riftGeometry;
    let riftMaterial;
    let removeResizeListener = () => {};
    const pointer = { lastX: null, lastY: null, activeTear: null };
    const tears = [];

    const toWorld = (clientX, clientY) => ({
      x: (clientX / window.innerWidth - 0.5) * 10 * (window.innerWidth / window.innerHeight),
      y: -(clientY / window.innerHeight - 0.5) * 10,
    });

    const onPointerMove = (event) => {
      if (pointer.lastX === null) {
        pointer.lastX = event.clientX;
        pointer.lastY = event.clientY;
        const position = toWorld(event.clientX, event.clientY);
        pointer.activeTear = { ...position, directionX: 1, directionY: 0, strength: 0.8, live: true, startedAt: performance.now() };
        return;
      }
      const distance = Math.hypot(event.clientX - pointer.lastX, event.clientY - pointer.lastY);
      if (distance < 8) return;
      const start = toWorld(pointer.lastX, pointer.lastY);
      const end = toWorld(event.clientX, event.clientY);
      const directionLength = Math.hypot(end.x - start.x, end.y - start.y) || 1;
      const directionX = (end.x - start.x) / directionLength;
      const directionY = (end.y - start.y) / directionLength;
      pointer.activeTear = {
        ...end,
        directionX,
        directionY,
        strength: Math.min(1, distance / 46),
        live: true,
        startedAt: performance.now(),
      };
      tears.push({
        x: end.x,
        y: end.y,
        directionX,
        directionY,
        strength: Math.min(1, distance / 46),
        startedAt: performance.now(),
      });
      if (tears.length > 16) tears.shift();
      pointer.lastX = event.clientX;
      pointer.lastY = event.clientY;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    import("three").then((THREE) => {
      if (disposed) return;

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-8, 8, 5, -5, 0.1, 30);
      camera.position.z = 10;
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.setAttribute("aria-hidden", "true");
      mount.appendChild(renderer.domElement);

      const columns = 80;
      const rows = 52;
      const basePositions = new Float32Array(columns * rows * 3);
      const positions = new Float32Array(columns * rows * 3);
      let index = 0;
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const x = -8 + (column / (columns - 1)) * 16;
          const y = -5 + (row / (rows - 1)) * 10;
          basePositions[index] = x;
          basePositions[index + 1] = y;
          basePositions[index + 2] = 0;
          positions[index] = x;
          positions[index + 1] = y;
          positions[index + 2] = 0;
          index += 3;
        }
      }

      geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      material = new THREE.PointsMaterial({ color: 0x64ffda, size: 0.023, transparent: true, opacity: 0.48, depthWrite: false });
      scene.add(new THREE.Points(geometry, material));

      tearGeometry = new THREE.BufferGeometry();
      const maxTearVertices = 17 * 12 * 2;
      tearGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(maxTearVertices * 3), 3));
      tearMaterial = new THREE.LineBasicMaterial({
        color: 0x64ffda,
        transparent: true,
        opacity: 0.82,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const tearLines = new THREE.LineSegments(tearGeometry, tearMaterial);
      scene.add(tearLines);

      riftGeometry = new THREE.BufferGeometry();
      riftGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(17 * 12 * 6 * 3), 3));
      riftMaterial = new THREE.MeshBasicMaterial({ color: 0x020c1b, transparent: true, opacity: 0.9, depthWrite: false });
      const riftSurface = new THREE.Mesh(riftGeometry, riftMaterial);
      scene.add(riftSurface);

      const resize = () => {
        const aspect = window.innerWidth / window.innerHeight;
        camera.left = -5 * aspect;
        camera.right = 5 * aspect;
        camera.top = 5;
        camera.bottom = -5;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight, false);
      };
      resize();
      window.addEventListener("resize", resize, { passive: true });
      removeResizeListener = () => window.removeEventListener("resize", resize);

      const animate = () => {
        if (disposed) return;
        const now = performance.now();
        const positionAttribute = geometry.getAttribute("position");
        const tearAttribute = tearGeometry.getAttribute("position");
        const riftAttribute = riftGeometry.getAttribute("position");
        const activeTears = pointer.activeTear ? [...tears, pointer.activeTear] : tears;
        let pointIndex = 0;
        for (let i = 0; i < basePositions.length; i += 3) {
          const x = basePositions[i];
          const y = basePositions[i + 1];
          let offsetX = 0;
          let offsetY = 0;
          let depth = 0;
          activeTears.forEach((tear) => {
            const age = (now - tear.startedAt) / 1000;
            if (!tear.live && age > 1.35) return;
            const relativeX = x - tear.x;
            const relativeY = y - tear.y;
            const along = relativeX * tear.directionX + relativeY * tear.directionY;
            const across = relativeX * -tear.directionY + relativeY * tear.directionX;
            const footprint = Math.exp(-((along * along) / 1.4 + (across * across) / 0.055));
            const fade = tear.live ? 1 : 1 - age / 1.35;
            const side = across < 0 ? -1 : 1;
            const opening = footprint * fade * (0.5 + tear.strength * 0.35);
            offsetX += -tear.directionY * side * opening;
            offsetY += tear.directionX * side * opening;
            depth += footprint * fade * 0.24;
          });
          positionAttribute.setXYZ(pointIndex, x + offsetX, y + offsetY, depth);
          pointIndex += 1;
        }
        while (tears.length && now - tears[0].startedAt > 1350) tears.shift();
        positionAttribute.needsUpdate = true;

        let tearVertex = 0;
        let riftVertex = 0;
        activeTears.forEach((tear, tearIndex) => {
          const age = (now - tear.startedAt) / 1000;
          const fade = tear.live ? 1 : Math.max(0, 1 - age / 1.35);
          const normalX = -tear.directionY;
          const normalY = tear.directionX;
          for (let segment = 0; segment < 12; segment += 1) {
            const tearLength = tear.live ? 0.9 : 1.8;
            const from = segment / 12 - 0.5;
            const to = (segment + 0.78) / 12 - 0.5;
            const jaggedFrom = Math.sin((segment + tearIndex * 3) * 2.4) * 0.1 * fade;
            const jaggedTo = Math.sin((segment + 1 + tearIndex * 3) * 2.4) * 0.1 * fade;
            const fromX = tear.x + tear.directionX * from * tearLength + normalX * jaggedFrom;
            const fromY = tear.y + tear.directionY * from * tearLength + normalY * jaggedFrom;
            const toX = tear.x + tear.directionX * to * tearLength + normalX * jaggedTo;
            const toY = tear.y + tear.directionY * to * tearLength + normalY * jaggedTo;
            const halfWidth = (0.075 + tear.strength * 0.075) * fade;
            tearAttribute.setXYZ(tearVertex, fromX, fromY, 0.3);
            tearAttribute.setXYZ(tearVertex + 1, toX, toY, 0.3);
            riftAttribute.setXYZ(riftVertex, fromX + normalX * halfWidth, fromY + normalY * halfWidth, 0.26);
            riftAttribute.setXYZ(riftVertex + 1, fromX - normalX * halfWidth, fromY - normalY * halfWidth, 0.26);
            riftAttribute.setXYZ(riftVertex + 2, toX + normalX * halfWidth, toY + normalY * halfWidth, 0.26);
            riftAttribute.setXYZ(riftVertex + 3, toX + normalX * halfWidth, toY + normalY * halfWidth, 0.26);
            riftAttribute.setXYZ(riftVertex + 4, fromX - normalX * halfWidth, fromY - normalY * halfWidth, 0.26);
            riftAttribute.setXYZ(riftVertex + 5, toX - normalX * halfWidth, toY - normalY * halfWidth, 0.26);
            tearVertex += 2;
            riftVertex += 6;
          }
        });
        tearGeometry.setDrawRange(0, tearVertex);
        riftGeometry.setDrawRange(0, riftVertex);
        tearAttribute.needsUpdate = true;
        riftAttribute.needsUpdate = true;
        tearMaterial.opacity = activeTears.length ? 0.72 : 0;
        renderer.render(scene, camera);
        frameId = requestAnimationFrame(animate);
      };
      animate();

    });

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", onPointerMove);
      removeResizeListener();
      geometry?.dispose();
      material?.dispose();
      tearGeometry?.dispose();
      tearMaterial?.dispose();
      riftGeometry?.dispose();
      riftMaterial?.dispose();
      renderer?.dispose();
      renderer?.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="background-wave" aria-hidden="true" />;
};

export default BackgroundWave;
