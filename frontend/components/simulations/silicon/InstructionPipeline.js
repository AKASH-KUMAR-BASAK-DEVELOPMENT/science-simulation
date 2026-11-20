"use client";

import { useEffect, useRef } from "react";

const DPR = () => Math.min(devicePixelRatio || 1, 2);
const pick = (arr) => arr[(Math.random() * arr.length) | 0];
const stages = ["IF", "ID", "EX", "MEM", "WB"];
const instrs = ["LD  r1,[r2]", "ADD r3,r1", "MUL r4,r3", "CMP r4,0", "JNZ .loop", "ST  [r5],r4", "XOR r6,r6", "SHL r7,1", "SUB r8,r2", "AND r9,r1"];
const cols = ["#2de2ff", "#39ff9f", "#ffb020", "#ff4d9d"];

export default function InstructionPipeline() {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = cv.getContext("2d");
    let w, h, dpr, packets = [], spawnAcc = 0;
    function resize() { dpr = DPR(); w = cv.width = cv.clientWidth * dpr; h = cv.height = cv.clientHeight * dpr; }
    window.addEventListener("resize", resize); resize();

    let raf, on = true, started = false, obs;
    function frame() {
      if (!on) { started = false; return; }
      ctx.clearRect(0, 0, w, h);
      const pad = 16 * dpr, sw = (w - pad * 2) / stages.length, top = 30 * dpr, bh = h - top - 30 * dpr;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      for (let i = 0; i < stages.length; i++) {
        const x = pad + i * sw;
        ctx.strokeStyle = "rgba(45,226,255,0.2)"; ctx.lineWidth = 1 * dpr;
        ctx.strokeRect(x + 4 * dpr, top, sw - 8 * dpr, bh);
        ctx.fillStyle = "rgba(45,226,255,0.6)"; ctx.font = `700 ${13 * dpr}px "Chakra Petch", sans-serif`;
        ctx.fillText(stages[i], x + sw / 2, top - 14 * dpr);
      }
      spawnAcc++; if (spawnAcc > 46) { spawnAcc = 0; packets.push({ x: pad, label: pick(instrs), col: pick(cols) }); }
      const speed = ((w - pad * 2) / stages.length) / 46;
      const pw = sw * 0.82, ph = 34 * dpr, py = top + bh / 2 - ph / 2;
      packets = packets.filter((p) => p.x < w - pad);
      for (const p of packets) {
        p.x += speed * (reduce ? 0 : 1);
        const stage = Math.max(0, Math.min(stages.length - 1, Math.floor((p.x - pad) / sw)));
        ctx.fillStyle = "rgba(45,226,255,0.06)";
        ctx.fillRect(pad + stage * sw + 4 * dpr, top, sw - 8 * dpr, bh);
        const drawX = Math.max(pad, Math.min(p.x, w - pad - pw));
        ctx.fillStyle = "rgba(6,12,24,0.9)"; ctx.strokeStyle = p.col; ctx.lineWidth = 1.5 * dpr;
        ctx.beginPath(); ctx.rect(drawX, py, pw, ph); ctx.fill();
        ctx.shadowBlur = 12; ctx.shadowColor = p.col; ctx.stroke(); ctx.shadowBlur = 0;
        ctx.fillStyle = p.col; ctx.font = `${11 * dpr}px "JetBrains Mono", monospace`;
        ctx.fillText(p.label, drawX + pw / 2, py + ph / 2);
      }
      raf = requestAnimationFrame(frame);
    }
    function kick() { if (!started) { started = true; frame(); } }
    if ("IntersectionObserver" in window) {
      obs = new IntersectionObserver((es) => { on = es[0].isIntersecting; if (on) kick(); }, { threshold: 0.01 });
      obs.observe(cv);
    }
    kick();

    return () => { window.removeEventListener("resize", resize); obs?.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, []);

  return <canvas id="pipe" ref={ref}></canvas>;
}
