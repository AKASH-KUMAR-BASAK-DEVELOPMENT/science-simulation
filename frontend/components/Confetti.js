"use client";

import { useEffect, useRef } from "react";

const DEFAULT_COLORS = ["#5b8cff", "#a06bff", "#2ad4d4", "#ff6bb5", "#3ddc97", "#ffb454"];

export default function useConfetti(colors = DEFAULT_COLORS) {
  const stateRef = useRef({ canvas: null, cx: null, parts: [], raf: null, dpr: 1 });

  useEffect(() => {
    return () => {
      const st = stateRef.current;
      if (st.raf) cancelAnimationFrame(st.raf);
      if (st.onResize) window.removeEventListener("resize", st.onResize);
      st.canvas?.remove();
    };
  }, []);

  function init() {
    const st = stateRef.current;
    st.canvas = document.createElement("canvas");
    st.canvas.className = "confetti-canvas";
    document.body.appendChild(st.canvas);
    st.cx = st.canvas.getContext("2d");
    size();
    st.onResize = size;
    window.addEventListener("resize", size);
  }
  function size() {
    const st = stateRef.current;
    if (!st.canvas) return;
    st.dpr = Math.min(window.devicePixelRatio || 1, 2);
    st.canvas.width = innerWidth * st.dpr; st.canvas.height = innerHeight * st.dpr;
    st.canvas.style.width = innerWidth + "px"; st.canvas.style.height = innerHeight + "px";
  }
  function loop() {
    const st = stateRef.current;
    st.cx.clearRect(0, 0, st.canvas.width, st.canvas.height);
    st.parts = st.parts.filter((p) => p.life > 0);
    for (const p of st.parts) {
      p.vy += p.g; p.x += p.vx; p.y += p.vy; p.vx *= 0.99; p.rot += p.vr; p.life -= 0.008;
      st.cx.save();
      st.cx.translate(p.x, p.y); st.cx.rotate(p.rot);
      st.cx.globalAlpha = Math.max(0, p.life);
      st.cx.fillStyle = p.col;
      st.cx.fillRect(-p.r, -p.r * 0.5, p.r * 2, p.r);
      st.cx.restore();
    }
    if (st.parts.length) st.raf = requestAnimationFrame(loop);
    else { st.cx.clearRect(0, 0, st.canvas.width, st.canvas.height); st.raf = null; }
  }

  function burst(n = 130, origin, reduceMotion = false) {
    if (reduceMotion) return;
    const st = stateRef.current;
    if (!st.canvas) init();
    const ox = (origin?.x ?? innerWidth / 2) * st.dpr, oy = (origin?.y ?? innerHeight / 2) * st.dpr;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, sp = (4 + Math.random() * 9) * st.dpr;
      st.parts.push({
        x: ox, y: oy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 4 * st.dpr,
        g: 0.22 * st.dpr, r: (3 + Math.random() * 4) * st.dpr, rot: Math.random() * 6.28,
        vr: (Math.random() - 0.5) * 0.4, life: 1, col: colors[(Math.random() * colors.length) | 0],
      });
    }
    if (!st.raf) loop();
  }

  return burst;
}
