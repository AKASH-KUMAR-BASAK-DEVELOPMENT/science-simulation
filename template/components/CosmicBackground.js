"use client";

import { useEffect, useRef } from "react";

/**
 * Live, transparent "deep space" backdrop.
 * A canvas starfield with three depth layers (so it reads as distance),
 * gentle twinkle, pointer parallax, and the occasional shooting star.
 * Sits behind the hero content and lets the glass panels show through.
 */
export default function CosmicBackground({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let stars = [];
    let shooting = null;
    let nextShot = 2000 + Math.random() * 3000;
    let comet = null;
    let cometTimer = 1500 + Math.random() * 2500;
    let satellites = [];
    let raf = 0;

    // smoothed pointer parallax (-0.5 .. 0.5)
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    function build() {
      const count = Math.min(300, Math.floor((w * h) / 5200));
      stars = Array.from({ length: count }, () => {
        const z = Math.random(); // 0 = far, 1 = near
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          r: 0.4 + z * 1.7,
          base: 0.2 + Math.random() * 0.65,
          hue: Math.random() < 0.22 ? 265 : Math.random() < 0.5 ? 205 : 230,
          phase: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random() * 1.6,
        };
      });
      if (!satellites.length) satellites = [spawnSatellite(), spawnSatellite()];
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function onMove(e) {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    }

    function drawStars() {
      for (const s of stars) {
        const tw = 0.55 + 0.45 * Math.sin(s.phase);
        const ox = cx * (6 + s.z * 46);
        const oy = cy * (6 + s.z * 46);
        const a = s.base * tw;
        const x = s.x + ox;
        const y = s.y + oy;

        if (s.r > 1.15) {
          ctx.beginPath();
          ctx.arc(x, y, s.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${s.hue}, 90%, 78%, ${a * 0.14})`;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 95%, 90%, ${a})`;
        ctx.fill();
      }
    }

    function drawShooting(dt) {
      nextShot -= dt;
      if (!shooting && nextShot <= 0) {
        const fromLeft = Math.random() < 0.5;
        shooting = {
          x: fromLeft ? -40 : w + 40,
          y: Math.random() * h * 0.5,
          vx: (fromLeft ? 1 : -1) * (520 + Math.random() * 260),
          vy: 160 + Math.random() * 140,
          life: 0,
          max: 0.9,
        };
        nextShot = 3200 + Math.random() * 4200;
      }
      if (shooting) {
        shooting.life += dt / 1000;
        shooting.x += (shooting.vx * dt) / 1000;
        shooting.y += (shooting.vy * dt) / 1000;
        const p = 1 - shooting.life / shooting.max;
        if (p <= 0) {
          shooting = null;
        } else {
          const tailX = shooting.x - shooting.vx * 0.09;
          const tailY = shooting.y - shooting.vy * 0.09;
          const grad = ctx.createLinearGradient(
            shooting.x,
            shooting.y,
            tailX,
            tailY
          );
          grad.addColorStop(0, `rgba(255,255,255,${0.9 * p})`);
          grad.addColorStop(1, "rgba(140,170,255,0)");
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(shooting.x, shooting.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();
        }
      }
    }

    // one satellite entering from a random edge, heading across the sky
    function spawnSatellite() {
      const edge = Math.floor(Math.random() * 4);
      const speed = 20 + Math.random() * 26;
      let x, y, ang;
      if (edge === 0) {
        x = -20; y = Math.random() * h; ang = (-25 + Math.random() * 50) * (Math.PI / 180);
      } else if (edge === 1) {
        x = w + 20; y = Math.random() * h; ang = (155 + Math.random() * 50) * (Math.PI / 180);
      } else if (edge === 2) {
        x = Math.random() * w; y = -20; ang = (65 + Math.random() * 50) * (Math.PI / 180);
      } else {
        x = Math.random() * w; y = h + 20; ang = (245 + Math.random() * 50) * (Math.PI / 180);
      }
      return {
        x, y,
        vx: Math.cos(ang) * speed,
        vy: Math.sin(ang) * speed,
        blink: Math.random() * Math.PI * 2,
      };
    }

    function spawnComet() {
      const fromLeft = Math.random() < 0.5;
      const speed = 110 + Math.random() * 70;
      comet = {
        x: fromLeft ? -90 : w + 90,
        y: h * (0.08 + Math.random() * 0.4),
        vx: (fromLeft ? 1 : -1) * speed,
        vy: -15 + Math.random() * 45,
      };
    }

    function drawSatellites(dt) {
      const s = dt / 1000;
      const ox = cx * 18;
      const oy = cy * 18;
      for (let i = 0; i < satellites.length; i++) {
        const sat = satellites[i];
        sat.x += sat.vx * s;
        sat.y += sat.vy * s;
        sat.blink += s * 4;
        if (sat.x < -60 || sat.x > w + 60 || sat.y < -60 || sat.y > h + 60) {
          satellites[i] = spawnSatellite();
          continue;
        }
        const x = sat.x + ox;
        const y = sat.y + oy;
        const tw = 0.55 + 0.45 * Math.sin(sat.blink);
        // short motion trail
        const mag = Math.hypot(sat.vx, sat.vy) || 1;
        const tx = x - (sat.vx / mag) * 9;
        const ty = y - (sat.vy / mag) * 9;
        const grad = ctx.createLinearGradient(x, y, tx, ty);
        grad.addColorStop(0, `rgba(180,240,255,${0.5 * tw})`);
        grad.addColorStop(1, "rgba(150,220,255,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(120,220,255,${0.14 * tw})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210,250,255,${0.7 + 0.3 * tw})`;
        ctx.fill();
      }
    }

    function drawComet(dt) {
      cometTimer -= dt;
      if (!comet && cometTimer <= 0) spawnComet();
      if (!comet) return;
      const s = dt / 1000;
      comet.x += comet.vx * s;
      comet.y += comet.vy * s;
      if (comet.x < -190 || comet.x > w + 190) {
        comet = null;
        cometTimer = 9000 + Math.random() * 9000;
        return;
      }
      const x = comet.x + cx * 18;
      const y = comet.y + cy * 18;
      const ang = Math.atan2(comet.vy, comet.vx);
      const tx = x - Math.cos(ang) * 170;
      const ty = y - Math.sin(ang) * 170;
      const grad = ctx.createLinearGradient(x, y, tx, ty);
      grad.addColorStop(0, "rgba(200,230,255,0.85)");
      grad.addColorStop(0.35, "rgba(150,185,255,0.22)");
      grad.addColorStop(1, "rgba(120,160,255,0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(tx, ty);
      ctx.stroke();
      const hg = ctx.createRadialGradient(x, y, 0, x, y, 11);
      hg.addColorStop(0, "rgba(240,248,255,0.95)");
      hg.addColorStop(1, "rgba(160,190,255,0)");
      ctx.fillStyle = hg;
      ctx.beginPath();
      ctx.arc(x, y, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.fill();
    }

    let last = performance.now();
    function frame(now) {
      const dt = Math.min(48, now - last);
      last = now;

      cx += (tx - cx) * 0.05;
      cy += (ty - cy) * 0.05;
      for (const s of stars) s.phase += (dt / 1000) * s.speed;

      ctx.clearRect(0, 0, w, h);
      drawStars();
      drawSatellites(dt);
      drawComet(dt);
      drawShooting(dt);
      raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);

    if (reduce) {
      drawStars(); // one static frame
    } else {
      window.addEventListener("mousemove", onMove);
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`h-full w-full ${className}`}
    />
  );
}
