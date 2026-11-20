"use client";

import { useEffect, useRef, useState } from "react";

const DPR = () => Math.min(devicePixelRatio || 1, 2);
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[(Math.random() * arr.length) | 0];

export default function CpuDie() {
  const ref = useRef(null);
  const [ops, setOps] = useState(0);
  const [activityPct, setActivityPct] = useState(20);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    let w, h, dpr, cx, cy, die, pins = [], signals = [], opsCount = 0, activity = 0.2, hover = false, emitAcc = 0;

    function layout() {
      dpr = DPR(); w = cv.width = cv.clientWidth * dpr; h = cv.height = cv.clientHeight * dpr;
      cx = w / 2; cy = h / 2; die = Math.min(w, h) * 0.34;
      pins = [];
      const per = 7, gap = die / (per + 1), half = die / 2, ext = die * 0.28;
      for (let s = 0; s < 4; s++) {
        for (let i = 1; i <= per; i++) {
          const o = -half + gap * i;
          let sx, sy, ex, ey;
          if (s === 0) { sx = cx + o; sy = cy - half; ex = sx; ey = cy - half - ext; }
          else if (s === 1) { sx = cx + half; sy = cy + o; ex = cx + half + ext; ey = sy; }
          else if (s === 2) { sx = cx + o; sy = cy + half; ex = sx; ey = cy + half + ext; }
          else { sx = cx - half; sy = cy + o; ex = cx - half - ext; ey = sy; }
          pins.push({ sx, sy, ex, ey, flash: 0 });
        }
      }
    }
    function emit(n) {
      for (let i = 0; i < n; i++) {
        const pin = pick(pins);
        signals.push({ pin, t: 0, spd: rand(0.02, 0.05), col: pick(["#2de2ff", "#39ff9f", "#ffb020"]) });
      }
      opsCount += n * 137; activity = Math.min(1, activity + n * 0.05);
    }
    window.addEventListener("resize", layout); layout();

    const onMove = () => { hover = true; };
    const onLeave = () => { hover = false; };
    const onClick = () => { emit(14); activity = 1; };
    cv.addEventListener("mousemove", onMove);
    cv.addEventListener("mouseleave", onLeave);
    cv.addEventListener("click", onClick);
    cv.style.cursor = "pointer";

    function roundRect(x, y, ww, hh, r) {
      ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + ww, y, x + ww, y + hh, r); ctx.arcTo(x + ww, y + hh, x, y + hh, r); ctx.arcTo(x, y + hh, x, y, r); ctx.arcTo(x, y, x + ww, y, r); ctx.closePath();
    }

    let t = 0, raf, on = true, started = false, obs;
    function frame() {
      if (!on) { started = false; return; }
      t += 0.03;
      ctx.clearRect(0, 0, w, h);
      emitAcc += 1; if (emitAcc > (hover ? 10 : 22)) { emit(hover ? 3 : 1); emitAcc = 0; }
      activity += (hover ? 0.02 : -0.006); activity = Math.max(0.15, Math.min(1, activity));

      for (const p of pins) {
        p.flash *= 0.9;
        ctx.strokeStyle = `rgba(45,226,255,${0.25 + p.flash * 0.75})`;
        ctx.lineWidth = 2.4 * dpr; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(p.sx, p.sy); ctx.lineTo(p.ex, p.ey); ctx.stroke();
        ctx.beginPath(); ctx.arc(p.ex, p.ey, 2.4 * dpr, 0, 6.2832);
        ctx.fillStyle = p.flash > 0.15 ? "#fff" : "rgba(45,226,255,0.5)";
        if (p.flash > 0.15) { ctx.shadowBlur = 10; ctx.shadowColor = "#2de2ff"; }
        ctx.fill(); ctx.shadowBlur = 0;
      }

      const half = die / 2;
      const grad = ctx.createLinearGradient(cx - half, cy - half, cx + half, cy + half);
      grad.addColorStop(0, "#0c1730"); grad.addColorStop(1, "#0a1224");
      roundRect(cx - half, cy - half, die, die, 10 * dpr); ctx.fillStyle = grad; ctx.fill();
      ctx.strokeStyle = "rgba(45,226,255,0.4)"; ctx.lineWidth = 1.5 * dpr; ctx.stroke();

      ctx.strokeStyle = "rgba(45,226,255,0.10)"; ctx.lineWidth = 1 * dpr;
      const step = die / 8;
      for (let i = 1; i < 8; i++) {
        ctx.beginPath(); ctx.moveTo(cx - half + i * step, cy - half + step); ctx.lineTo(cx - half + i * step, cy + half - step); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx - half + step, cy - half + i * step); ctx.lineTo(cx + half - step, cy - half + i * step); ctx.stroke();
      }

      const pulse = 0.5 + Math.sin(t * 2) * 0.5;
      const core = die * 0.2;
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, core * 2.2);
      cg.addColorStop(0, `rgba(45,226,255,${0.5 + pulse * 0.4 * activity})`);
      cg.addColorStop(0.5, `rgba(57,255,159,${0.18 * activity})`);
      cg.addColorStop(1, "rgba(45,226,255,0)");
      ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(cx, cy, core * 2.2, 0, 6.2832); ctx.fill();
      roundRect(cx - core, cy - core, core * 2, core * 2, 5 * dpr);
      ctx.fillStyle = `rgba(45,226,255,${0.6 + pulse * 0.3})`; ctx.shadowBlur = 24 * activity; ctx.shadowColor = "#2de2ff"; ctx.fill(); ctx.shadowBlur = 0;

      ctx.fillStyle = "rgba(215,227,255,0.75)"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.font = `${9 * dpr}px "JetBrains Mono", monospace`;
      ctx.fillText("SL-9 · 128 CORE", cx, cy + core + 12 * dpr);

      signals = signals.filter((s) => s.t < 1);
      for (const s of signals) {
        s.t += s.spd;
        const x = cx + (s.pin.ex - cx) * s.t, y = cy + (s.pin.ey - cy) * s.t;
        ctx.beginPath(); ctx.arc(x, y, 3 * dpr, 0, 6.2832);
        ctx.fillStyle = s.col; ctx.shadowBlur = 12; ctx.shadowColor = s.col; ctx.fill(); ctx.shadowBlur = 0;
        if (s.t >= 1) s.pin.flash = 1;
      }

      setOps(opsCount);
      setActivityPct(Math.round(activity * 100));
      raf = requestAnimationFrame(frame);
    }
    function kick() { if (!started) { started = true; frame(); } }
    if ("IntersectionObserver" in window) {
      obs = new IntersectionObserver((es) => { on = es[0].isIntersecting; if (on) kick(); }, { threshold: 0.01 });
      obs.observe(cv);
    }
    kick();

    return () => {
      window.removeEventListener("resize", layout);
      cv.removeEventListener("mousemove", onMove);
      cv.removeEventListener("mouseleave", onLeave);
      cv.removeEventListener("click", onClick);
      obs?.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="cpu-wrap" data-reveal>
      <canvas id="cpu" ref={ref}></canvas>
      <div className="cpu-hud">
        <span>OPS <b>{ops.toLocaleString()}</b></span>
        <span className="act-wrap">ACT <span className="act-bar"><i style={{ width: activityPct + "%" }}></i></span></span>
      </div>
      <span className="cpu-hint">▸ click the die to inject a signal burst</span>
    </div>
  );
}
