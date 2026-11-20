"use client";

import { useEffect, useRef } from "react";

const DPR = () => Math.min(devicePixelRatio || 1, 2);
const N = 26;

export default function DnaHelix() {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = cv.getContext("2d");
    let w, h, dpr, phase = 0, spin = 0.02;
    const pairs = [];
    function seed() {
      dpr = DPR(); w = cv.width = cv.clientWidth * dpr; h = cv.height = cv.clientHeight * dpr;
      pairs.length = 0;
      for (let i = 0; i < N; i++) pairs.push(Math.random() < 0.5 ? [255, 92, 138] : [92, 255, 208]);
    }
    window.addEventListener("resize", seed); seed();

    const onMove = (e) => {
      const r = cv.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      spin = 0.02 + nx * 0.09;
    };
    const onLeave = () => { spin = 0.02; };
    cv.addEventListener("mousemove", onMove);
    cv.addEventListener("mouseleave", onLeave);

    let raf, on = true, started = false, obs;
    function frame() {
      if (!on) { started = false; return; }
      ctx.clearRect(0, 0, w, h);
      phase += reduce ? 0 : spin;
      const cx = w / 2, amp = w * 0.24, top = h * 0.08, spacing = (h * 0.84) / (N - 1), twist = 0.5;
      const nodes = [];
      for (let i = 0; i < N; i++) {
        const ang = i * twist + phase, y = top + i * spacing;
        const x1 = cx + Math.sin(ang) * amp, z1 = Math.cos(ang);
        const x2 = cx + Math.sin(ang + Math.PI) * amp, z2 = Math.cos(ang + Math.PI);
        nodes.push({ i, y, x1, z1, x2, z2, col: pairs[i] });
      }
      const order = nodes.slice().sort((a, b) => Math.min(a.z1, a.z2) - Math.min(b.z1, b.z2));
      for (const strand of [0, 1]) {
        ctx.beginPath();
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i], x = strand ? n.x2 : n.x1;
          if (i === 0) ctx.moveTo(x, n.y); else ctx.lineTo(x, n.y);
        }
        ctx.strokeStyle = "rgba(92,255,208,0.25)"; ctx.lineWidth = 2 * dpr; ctx.stroke();
      }
      for (const n of order) {
        const [r0, g0, b0] = n.col;
        ctx.beginPath(); ctx.moveTo(n.x1, n.y); ctx.lineTo(n.x2, n.y);
        ctx.strokeStyle = `rgba(${r0},${g0},${b0},0.4)`; ctx.lineWidth = 2 * dpr; ctx.stroke();
        for (const [x, z] of [[n.x1, n.z1], [n.x2, n.z2]]) {
          const s = (z + 1.4) / 2.4, rr = (3 + s * 5) * dpr;
          ctx.beginPath(); ctx.arc(x, n.y, rr, 0, 6.28);
          ctx.fillStyle = `rgba(${r0},${g0},${b0},${0.4 + s * 0.6})`;
          ctx.shadowBlur = 12 * s; ctx.shadowColor = `rgb(${r0},${g0},${b0})`; ctx.fill(); ctx.shadowBlur = 0;
        }
      }
      raf = requestAnimationFrame(frame);
    }
    function kick() { if (!started) { started = true; frame(); } }
    if ("IntersectionObserver" in window) {
      obs = new IntersectionObserver((es) => { on = es[0].isIntersecting; if (on) kick(); }, { threshold: 0.01 });
      obs.observe(cv);
    }
    kick();

    return () => {
      window.removeEventListener("resize", seed);
      cv.removeEventListener("mousemove", onMove);
      cv.removeEventListener("mouseleave", onLeave);
      obs?.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas id="helix" ref={ref}></canvas>;
}
