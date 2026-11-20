"use client";

import { useEffect, useRef } from "react";

const DPR = () => Math.min(devicePixelRatio || 1, 2);
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[(Math.random() * arr.length) | 0];

export default function CircuitBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = cv.getContext("2d");
    let w, h, dpr, traces = [], pulses = [], off, octx;

    function pointAt(tr, dist) {
      if (dist <= 0) return { x: tr.pts[0].x, y: tr.pts[0].y };
      for (const s of tr.segs) {
        if (dist <= s.len) { const t = dist / s.len; return { x: s.x1 + (s.x2 - s.x1) * t, y: s.y1 + (s.y2 - s.y1) * t }; }
        dist -= s.len;
      }
      const l = tr.pts[tr.pts.length - 1]; return { x: l.x, y: l.y };
    }
    function build(pts) {
      const segs = []; let total = 0;
      for (let i = 1; i < pts.length; i++) {
        const x1 = pts[i - 1].x, y1 = pts[i - 1].y, x2 = pts[i].x, y2 = pts[i].y;
        const len = Math.hypot(x2 - x1, y2 - y1);
        if (len < 1) continue;
        segs.push({ x1, y1, x2, y2, len }); total += len;
      }
      return { pts, segs, total };
    }
    function gen() {
      traces = [];
      const g = 34 * dpr, cols = Math.ceil(w / g), rows = Math.ceil(h / g);
      const n = Math.min(52, Math.max(14, Math.floor((cols * rows) / 42)));
      for (let i = 0; i < n; i++) {
        let x = ((Math.random() * cols) | 0) * g, y = ((Math.random() * rows) | 0) * g;
        const pts = [{ x, y }], steps = 3 + ((Math.random() * 7) | 0);
        let horiz = Math.random() < 0.5;
        for (let s = 0; s < steps; s++) {
          const len = (1 + ((Math.random() * 4) | 0)) * g;
          if (horiz) x += Math.random() < 0.5 ? len : -len; else y += Math.random() < 0.5 ? len : -len;
          x = Math.max(0, Math.min(w, x)); y = Math.max(0, Math.min(h, y));
          pts.push({ x, y }); horiz = !horiz;
        }
        const tr = build(pts);
        if (tr.total > g) traces.push(tr);
      }
      off = document.createElement("canvas"); off.width = w; off.height = h; octx = off.getContext("2d");
      octx.lineWidth = 1 * dpr; octx.strokeStyle = "rgba(45,226,255,0.10)";
      for (const tr of traces) {
        octx.beginPath(); octx.moveTo(tr.pts[0].x, tr.pts[0].y);
        for (let i = 1; i < tr.pts.length; i++) octx.lineTo(tr.pts[i].x, tr.pts[i].y);
        octx.stroke();
        for (const p of tr.pts) { octx.beginPath(); octx.arc(p.x, p.y, 2 * dpr, 0, 6.2832); octx.fillStyle = "rgba(45,226,255,0.22)"; octx.fill(); }
      }
      const cols3 = ["#2de2ff", "#39ff9f", "#ffb020"];
      pulses = Array.from({ length: Math.min(70, traces.length * 2) }, () => ({
        tr: pick(traces), d: Math.random() * 1, spd: rand(0.6, 1.9) * dpr, col: pick(cols3),
      }));
      pulses.forEach((p) => (p.d = Math.random() * p.tr.total));
    }
    function resize() {
      dpr = DPR(); w = cv.width = innerWidth * dpr; h = cv.height = innerHeight * dpr;
      cv.style.width = innerWidth + "px"; cv.style.height = innerHeight + "px"; gen();
    }
    let raf, on = true, started = false;
    function frame() {
      if (!on) { started = false; return; }
      ctx.clearRect(0, 0, w, h);
      if (off) ctx.drawImage(off, 0, 0);
      for (const p of pulses) {
        p.d += p.spd * (reduce ? 0 : 1);
        if (p.d > p.tr.total) { p.tr = pick(traces); p.d = 0; p.col = pick(["#2de2ff", "#39ff9f", "#ffb020"]); }
        const head = pointAt(p.tr, p.d);
        for (let k = 0; k < 5; k++) {
          const t = pointAt(p.tr, p.d - k * 5 * dpr);
          ctx.globalAlpha = (1 - k / 5) * 0.5;
          ctx.beginPath(); ctx.arc(t.x, t.y, (3 - k * 0.4) * dpr, 0, 6.2832);
          ctx.fillStyle = p.col; ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.beginPath(); ctx.arc(head.x, head.y, 2.4 * dpr, 0, 6.2832);
        ctx.fillStyle = "#fff"; ctx.shadowBlur = 12; ctx.shadowColor = p.col; ctx.fill(); ctx.shadowBlur = 0;
      }
      raf = requestAnimationFrame(frame);
    }
    window.addEventListener("resize", resize);
    resize();
    let obs;
    function kick() { if (!started) { started = true; frame(); } }
    if ("IntersectionObserver" in window) {
      obs = new IntersectionObserver((es) => { on = es[0].isIntersecting; if (on) kick(); }, { threshold: 0.01 });
      obs.observe(cv);
    }
    kick();

    return () => {
      window.removeEventListener("resize", resize);
      obs?.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas id="circuit" ref={ref} aria-hidden="true"></canvas>;
}
