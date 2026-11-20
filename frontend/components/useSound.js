"use client";

import { useMemo, useRef, useState } from "react";

export default function useSound() {
  const [enabled, setEnabled] = useState(false);
  const ctxRef = useRef(null);
  const masterRef = useRef(null);
  const lastHoverRef = useRef(0);

  const api = useMemo(() => {
    function ensure() {
      if (ctxRef.current) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctxRef.current = new AC();
      masterRef.current = ctxRef.current.createGain();
      masterRef.current.gain.value = 0.06;
      masterRef.current.connect(ctxRef.current.destination);
    }
    function tone(freq, dur = 0.12, type = "sine", vol = 1) {
      if (!enabled || !ctxRef.current) return;
      const ctx = ctxRef.current;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, ctx.currentTime);
      g.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      o.connect(g).connect(masterRef.current);
      o.start();
      o.stop(ctx.currentTime + dur);
    }
    return {
      get enabled() { return enabled; },
      set(v) { setEnabled(v); if (v) { ensure(); ctxRef.current?.resume?.(); } },
      hover() { const n = performance.now(); if (n - lastHoverRef.current < 70) return; lastHoverRef.current = n; tone(880, 0.05, "sine", 0.5); },
      click() { tone(523.25, 0.11, "triangle", 0.9); },
      tab() { tone(660, 0.09, "triangle"); tone(990, 0.09, "sine", 0.5); },
      spawn() { tone(440 + Math.random() * 220, 0.14, "sine", 0.7); },
      chord() { [261.6, 329.6, 392, 523.2].forEach((f, i) => setTimeout(() => tone(f, 0.5, "sine", 0.7), i * 70)); },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return api;
}
