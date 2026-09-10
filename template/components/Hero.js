"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import CosmicBackground from "@/components/CosmicBackground";

function OrbitCard() {
  const chips = [
    { icon: "🎯", pos: "left-2 top-6", delay: "0s" },
    { icon: "🧪", pos: "right-3 top-16", delay: "0.8s" },
    { icon: "🧬", pos: "bottom-8 left-6", delay: "1.4s" },
    { icon: "🪐", pos: "bottom-14 right-4", delay: "2s" },
  ];
  return (
    <div className="lift relative mx-auto w-full max-w-md rounded-[2.5rem] p-8">
      <div className="relative mx-auto aspect-square w-full max-w-xs">
        {/* soft glow */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/40 via-primary2/25 to-accent/25 blur-2xl" />

        {/* faint rings */}
        <div className="absolute inset-2 rounded-full border border-white/10" />
        <div className="absolute inset-14 rounded-full border border-white/10" />
        <div className="absolute inset-24 rounded-full border border-white/10" />

        {/* orbiting planet on a spinning ring */}
        <div className="animate-spin-slow absolute inset-2">
          <span className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-full bg-gradient-to-br from-primary to-primary2 shadow-[0_0_16px_2px_rgba(109,94,252,0.6)]" />
        </div>
        <div className="animate-spin-rev absolute inset-14">
          <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_14px_2px_rgba(35,201,167,0.55)]" />
        </div>

        {/* core */}
        <div className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-br from-primary to-primary2 text-4xl shadow-[0_20px_50px_-10px_rgba(109,94,252,0.9)]">
          🔬
        </div>

        {/* floating subject chips */}
        {chips.map((c) => (
          <span
            key={c.icon}
            className={`animate-floaty absolute ${c.pos} grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/10 text-lg shadow-[0_12px_30px_-10px_rgba(0,0,0,0.6)] backdrop-blur-md`}
            style={{ animationDelay: c.delay }}
          >
            {c.icon}
          </span>
        ))}
      </div>

      {/* live readout pill */}
      <div className="mt-6 flex items-center justify-center gap-2 rounded-full border border-white/10 bg-transparent px-4 py-2.5">
        <span className="h-2 w-2 animate-pulse-soft rounded-full bg-accent" />
        <span className="text-sm font-medium text-white/70">
          40+ simulations running live
        </span>
      </div>
    </div>
  );
}

export default function Hero() {
  const nearRef = useRef(null);
  const farRef = useRef(null);

  // pointer parallax: foreground drifts one way (feels close),
  // the nebula layer drifts the other (feels far away).
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;

    const loop = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      if (farRef.current) {
        farRef.current.style.transform = `translate3d(${cx * 34}px, ${cy * 34}px, 0)`;
      }
      if (nearRef.current) {
        nearRef.current.style.transform = `perspective(1400px) rotateY(${cx * 4}deg) rotateX(${-cy * 4}deg) translate3d(${cx * -20}px, ${cy * -20}px, 0)`;
      }
      if (Math.abs(tx - cx) > 0.0004 || Math.abs(ty - cy) > 0.0004) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };

    const onMove = (e) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
      if (!raf) raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative -mt-[4.5rem] flex min-h-screen items-center overflow-hidden pt-[4.5rem] text-white">
      {/* deep-space sky (its own dark band, independent of theme) */}
      <div className="absolute inset-0 -z-30 bg-[radial-gradient(120%_120%_at_70%_-10%,#241b52_0%,#120f2e_38%,#080614_72%,#05040e_100%)]" />

      {/* live starfield */}
      <CosmicBackground className="absolute inset-0 -z-20" />

      {/* drifting nebula glow — the "distant" parallax layer */}
      <div ref={farRef} className="pointer-events-none absolute inset-0 -z-10 will-change-transform">
        <div className="animate-drift absolute -left-24 top-10 h-96 w-96 rounded-full bg-primary/25 blur-[120px]" />
        <div className="animate-drift absolute right-0 top-24 h-80 w-80 rounded-full bg-sky-500/20 blur-[120px] [animation-delay:3s]" />
        <div className="animate-drift absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-accent/20 blur-[120px] [animation-delay:6s]" />
        <div className="animate-drift absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-primary2/25 blur-[120px] [animation-delay:2s]" />
      </div>

      {/* fade into the rest of the page below */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-[var(--bg)]" />

      {/* foreground content — the "near" parallax layer */}
      <div
        ref={nearRef}
        className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-6 py-16 will-change-transform md:py-24 lg:grid-cols-[1.05fr_0.95fr]"
      >
        {/* left: copy */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/90 shadow-sm backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-accent" />
            Interactive science, made playful
          </span>

          <h1 className="mt-6 font-[family-name:var(--font-round)] text-5xl font-semibold leading-[1.02] tracking-tight text-white [text-shadow:0_2px_40px_rgba(120,90,255,0.35)] sm:text-6xl md:text-7xl">
            Curiosity,
            <br />
            <span className="bg-gradient-to-r from-primary via-primary2 to-accent bg-clip-text text-transparent">
              set in motion.
            </span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-white/70">
            Pendulums, circuits, waves, orbits, reactions — dozens of interactive
            instruments that run live in the browser. Change the variables, watch
            the science react.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="/simulations" variant="primary" className="px-8 py-4 text-base">
              Open the lab →
            </Button>
            <Link
              href="/about"
              className="lift inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur hover:-translate-y-0.5 hover:bg-white/15"
            >
              How it works
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/60">
            <span className="inline-flex items-center gap-1.5"><span className="text-accent">✓</span> No installs</span>
            <span className="inline-flex items-center gap-1.5"><span className="text-accent">✓</span> Free for classrooms</span>
            <span className="inline-flex items-center gap-1.5"><span className="text-accent">✓</span> Real equations</span>
          </div>
        </div>

        {/* right: orbit card */}
        <OrbitCard />
      </div>
    </section>
  );
}
