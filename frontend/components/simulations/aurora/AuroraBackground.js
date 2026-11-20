"use client";

import { useEffect, useRef } from "react";

const BLOBS = [
  { c: "#6d28d9", r: 0.42, ax: 0.22, ay: 0.16, sx: 0.7, sy: 1.1, px: 0.28, py: 0.3 },
  { c: "#ff5334", r: 0.38, ax: 0.26, ay: 0.2, sx: 1.1, sy: 0.8, px: 0.72, py: 0.28 },
  { c: "#37c4f0", r: 0.4, ax: 0.24, ay: 0.22, sx: 0.9, sy: 1.3, px: 0.5, py: 0.72 },
  { c: "#ffb703", r: 0.34, ax: 0.28, ay: 0.18, sx: 1.3, sy: 0.9, px: 0.2, py: 0.75 },
  { c: "#c6f24e", r: 0.3, ax: 0.2, ay: 0.24, sx: 0.8, sy: 1.0, px: 0.82, py: 0.7 },
];

export default function AuroraBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = cv.getContext("2d");
    let w, h, dpr, t = 0, raf;
    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 1.6);
      w = cv.width = innerWidth * dpr;
      h = cv.height = innerHeight * dpr;
      cv.style.width = innerWidth + "px";
      cv.style.height = innerHeight + "px";
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
      const base = Math.max(w, h);
      for (const b of BLOBS) {
        const cx = (b.px + Math.sin(t * b.sx + b.ax * 10) * b.ax) * w;
        const cy = (b.py + Math.cos(t * b.sy + b.ay * 10) * b.ay) * h;
        const rad = b.r * base;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        g.addColorStop(0, b.c + "cc");
        g.addColorStop(1, b.c + "00");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, 6.2832);
        ctx.fill();
      }
      t += reduce ? 0 : 0.0016;
      raf = requestAnimationFrame(draw);
    }
    window.addEventListener("resize", resize);
    resize();
    cv.style.opacity = "0.55";
    cv.style.filter = "blur(60px) saturate(150%)";
    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(raf); };
  }, []);

  return <canvas id="aurora" ref={ref} aria-hidden="true"></canvas>;
}
