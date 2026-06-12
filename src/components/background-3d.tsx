"use client";

import { useEffect, useRef } from "react";

interface Orb {
  el: HTMLDivElement;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  rotX: number;
  rotY: number;
  rotVx: number;
  rotVy: number;
  size: number;
  opacity: number;
}

export function Background3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbsRef = useRef<Orb[]>([]);
  const frameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const shapes = ["cube", "pyramid", "sphere", "torus", "ring"];
    const colors = [
      "rgba(139,92,246,",  // violet
      "rgba(6,182,212,",   // cyan
      "rgba(168,85,247,",  // purple
      "rgba(14,165,233,",  // sky
      "rgba(236,72,153,",  // pink
    ];

    const orbs: Orb[] = [];
    const count = 12;

    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      const shape = shapes[i % shapes.length];
      const color = colors[i % colors.length];
      const size = 20 + Math.random() * 60;
      const opacity = 0.06 + Math.random() * 0.1;

      el.className = `orb orb-${shape}`;
      el.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        pointer-events: none;
        z-index: 0;
        opacity: 0;
        transition: opacity 2s ease;
      `;

      if (shape === "sphere") {
        el.style.borderRadius = "50%";
        el.style.background = `${color}${opacity})`;
        el.style.boxShadow = `0 0 ${size * 0.5}px ${color}${opacity * 0.5})`;
      } else if (shape === "cube") {
        el.style.border = `1px solid ${color}${opacity + 0.05})`;
        el.style.borderRadius = "4px";
        el.style.boxShadow = `0 0 ${size * 0.3}px ${color}${opacity * 0.3})`;
      } else if (shape === "pyramid") {
        el.style.width = "0";
        el.style.height = "0";
        el.style.borderLeft = `${size * 0.5}px solid transparent`;
        el.style.borderRight = `${size * 0.5}px solid transparent`;
        el.style.borderBottom = `${size}px solid ${color}${opacity})`;
        el.style.background = "none";
        el.style.boxShadow = "none";
      } else if (shape === "torus") {
        el.style.borderRadius = "50%";
        el.style.border = `2px solid ${color}${opacity + 0.05})`;
        el.style.background = "none";
      } else if (shape === "ring") {
        el.style.borderRadius = "50%";
        el.style.border = `1.5px solid ${color}${opacity})`;
        el.style.background = "none";
        el.style.boxShadow = `0 0 ${size * 0.2}px ${color}${opacity * 0.2})`;
      }

      container.appendChild(el);

      orbs.push({
        el,
        x: Math.random() * 100,
        y: Math.random() * 100,
        z: Math.random() * 100 - 50,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        vz: (Math.random() - 0.5) * 0.1,
        rotX: Math.random() * 360,
        rotY: Math.random() * 360,
        rotVx: (Math.random() - 0.5) * 0.5,
        rotVy: (Math.random() - 0.5) * 0.5,
        size,
        opacity: shape === "pyramid" ? 1 : opacity,
      });

      requestAnimationFrame(() => { el.style.opacity = "1"; });
    }

    orbsRef.current = orbs;

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    window.addEventListener("mousemove", handleMouse);

    let lastTime = performance.now();

    const animate = (time: number) => {
      const dt = Math.min((time - lastTime) / 16, 3);
      lastTime = time;
      const mx = (mouseRef.current.x - 0.5) * 2;
      const my = (mouseRef.current.y - 0.5) * 2;

      for (const orb of orbs) {
        orb.x += orb.vx * dt;
        orb.y += orb.vy * dt;
        orb.z += orb.vz * dt;
        orb.rotX += orb.rotVx * dt;
        orb.rotY += orb.rotVy * dt;

        if (orb.x > 110 || orb.x < -10) orb.vx *= -1;
        if (orb.y > 110 || orb.y < -10) orb.vy *= -1;
        if (orb.z > 50 || orb.z < -50) orb.vz *= -1;

        const perspective = 800;
        const scale = perspective / (perspective + orb.z);
        const offsetX = mx * 10 * (orb.z / 50);
        const offsetY = my * 10 * (orb.z / 50);

        const px = orb.x + offsetX;
        const py = orb.y + offsetY;

        orb.el.style.transform = `
          translate(${px}vw, ${py}vh)
          translate(-50%, -50%)
          scale(${scale})
          rotateX(${orb.rotX}deg)
          rotateY(${orb.rotY}deg)
          rotateZ(${orb.rotX * 0.3}deg)
        `;
        orb.el.style.opacity = String(Math.max(0, Math.min(1, orb.opacity * scale)));
        orb.el.style.zIndex = String(Math.floor(orb.z + 50));
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("mousemove", handleMouse);
      for (const orb of orbs) orb.el.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ perspective: "800px", transformStyle: "preserve-3d" }}
    />
  );
}
