"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import SiteChrome from "../../site/SiteChrome";
import SiteFooter from "../../site/SiteFooter";
import useSound from "../../useSound";
import useConfetti from "../../Confetti";
import SimPreview from "./SimPreview";
import { LABS, getLab, labHref } from "../catalog";

const range = (c) => `${c.min}–${c.max}${c.unit}`;

export default function LabPageClient({ slug }) {
  const lab = getLab(slug);
  const related = LABS.filter((l) => l.slug !== slug);
  const containerRef = useRef(null);
  const sound = useSound();
  const burst = useConfetti();
  const [note, setNote] = useState("Free for students and teachers. No spam, ever.");

  // reveal-on-scroll, same feel as the home page
  useEffect(() => {
    const els = [...containerRef.current.querySelectorAll("[data-reveal]")];
    if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach((el, i) => { el.style.transitionDelay = (i % 4) * 60 + "ms"; io.observe(el); });
    return () => io.disconnect();
  }, []);

  function handleNotify(e) {
    e.preventDefault();
    setNote(`🎉 You're on the list — we'll email you when ${lab.title} opens.`);
    const r = e.target.querySelector("button[type=submit]").getBoundingClientRect();
    burst(150, { x: r.left + r.width / 2, y: r.top });
    sound.chord();
    e.target.reset();
  }

  const words = [...lab.tags, ...lab.explore.map((x) => x.title), lab.discipline];

  return (
    <div ref={containerRef} className="theme-home lp" style={{ "--lab": lab.accent }}>
      <SiteChrome sound={sound} />

      <main id="top">
        {/* ---------- hero ---------- */}
        <section className="lp-hero">
          <div className="lp-hero-copy">
            <nav className="lp-crumbs reveal" data-reveal aria-label="Breadcrumb">
              <Link href="/#simulations">Labs</Link><span aria-hidden="true">›</span><span>{lab.discipline}</span>
            </nav>
            <div className="pill reveal" data-reveal>
              <span className="pill-dot"></span>
              {lab.discipline} lab · opening soon
            </div>
            <h1 className="lp-title reveal" data-reveal>
              <span className="lp-title-icon" aria-hidden="true">{lab.icon}</span>
              <span className="grad-text">{lab.title}</span>
            </h1>
            <p className="lp-sub reveal" data-reveal>{lab.about}</p>
            <div className="hero-cta reveal" data-reveal>
              <a href="#notify" className="btn btn-primary btn-lg">Get notified <span aria-hidden="true">→</span></a>
              <a href="#explore" className="btn btn-outline btn-lg">What you&apos;ll learn</a>
            </div>
            <ul className="lp-meta reveal" data-reveal>
              <li><span>Level</span><b>{lab.level}</b></li>
              <li><span>Session</span><b>{lab.duration}</b></li>
              <li><span>Topics</span><b>{lab.tags.join(" · ")}</b></li>
            </ul>
          </div>

          <div className="lp-art reveal" data-reveal aria-hidden="true">
            <div className="lp-art-frame">
              <SimPreview slug={slug} accent={lab.accent} />
            </div>
            <div className="float-card lp-fc lp-fc-1">
              <span className="fc-label">{lab.formula.caption}</span>
              <span className="fc-value lp-fc-expr">{lab.formula.expr}</span>
            </div>
            {lab.hud.slice(0, 2).map(([k, v], i) => (
              <div key={k} className={`float-card lp-fc lp-fc-${i + 2}`}>
                <span className="fc-label">{k}</span>
                <span className="fc-value">{v}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[0, 1, 2, 3].map((k) => (
              <span key={k} style={{ display: "contents" }}>
                {words.map((w, i) => <span key={i} style={{ display: "contents" }}><span>{w.toUpperCase()}</span><span>•</span></span>)}
              </span>
            ))}
          </div>
        </div>

        {/* ---------- explore ---------- */}
        <section className="section" id="explore">
          <div className="section-head reveal" data-reveal>
            <span className="eyebrow">What you&apos;ll explore</span>
            <h2>Four big ideas. <span className="grad-text">One lab.</span></h2>
            <p>{lab.tagline}</p>
          </div>
          <div className="lp-explore">
            {lab.explore.map((e, i) => (
              <article key={e.title} className="lp-card reveal" data-reveal>
                <span className="lp-card-num">0{i + 1}</span>
                <span className="lp-card-ico" aria-hidden="true">{e.icon}</span>
                <h3>{e.title}</h3>
                <p>{e.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- science ---------- */}
        <section className="section" id="science">
          <div className="section-head reveal" data-reveal>
            <span className="eyebrow">The science</span>
            <h2>The idea at the <span className="grad-text">heart of it.</span></h2>
          </div>
          <div className="lp-science">
            <div className="lp-formula reveal" data-reveal>
              <p className="lp-expr">{lab.formula.expr}</p>
              <p className="lp-expr-caption">{lab.formula.caption}</p>
              <ul className="lp-terms">
                {lab.formula.terms.map(([s, d]) => <li key={s}><b>{s}</b> {d}</li>)}
              </ul>
            </div>
            <div className="lp-vars reveal" data-reveal>
              <h3>Things you&apos;ll get to change</h3>
              <ul>
                {lab.controls.map((c) => (
                  <li key={c.label}>
                    <span className="lp-var-name">{c.label}</span>
                    <span className="lp-var-range">{range(c)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------- real world ---------- */}
        <section className="section" id="real-world">
          <div className="section-head reveal" data-reveal>
            <span className="eyebrow">In the real world</span>
            <h2>You&apos;ve already seen it <span className="grad-text">today.</span></h2>
          </div>
          <div className="lp-real">
            {lab.realWorld.map((r) => (
              <article key={r.title} className="lp-real-card reveal" data-reveal>
                <span className="lp-real-ico" aria-hidden="true">{r.icon}</span>
                <h3>{r.title}</h3>
                <p>{r.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- facts ---------- */}
        <section className="section" id="facts">
          <div className="lp-facts reveal" data-reveal>
            <div className="lp-facts-head">
              <span className="eyebrow">Did you know?</span>
              <h2>Three things to <span className="grad-text">wow your friends.</span></h2>
            </div>
            <ol>
              {lab.facts.map((f) => <li key={f}>{f}</li>)}
            </ol>
          </div>
        </section>

        {/* ---------- notify ---------- */}
        <section className="section cta-section" id="notify">
          <div className="cta-card reveal" data-reveal>
            <div className="cta-aura" aria-hidden="true"></div>
            <span className="lp-cta-ico" aria-hidden="true">{lab.icon}</span>
            <h2>The {lab.title} lab is on its way.</h2>
            <p>Be the first to step inside when it opens.</p>
            <form className="cta-form" onSubmit={handleNotify}>
              <input type="email" placeholder="you@university.edu" aria-label="Email address" required />
              <button className="btn btn-primary btn-lg" type="submit">Notify me</button>
            </form>
            <span className="cta-note">{note}</span>
          </div>
        </section>

        {/* ---------- related ---------- */}
        <section className="section" id="related">
          <div className="section-head reveal" data-reveal>
            <span className="eyebrow">Keep exploring</span>
            <h2>More labs to <span className="grad-text">discover.</span></h2>
          </div>
          <div className="lp-related">
            {related.map((l) => (
              <Link key={l.slug} href={labHref(l)} className="lp-rel reveal" data-reveal style={{ "--lab": l.accent }}>
                <span className="lp-rel-ico" aria-hidden="true">{l.icon}</span>
                <span className="lp-rel-title">
                  {l.title}
                  {l.live ? <span className="sim-live">Live</span> : <span className="sim-soon">Soon</span>}
                </span>
                <span className="lp-rel-desc">{l.tagline}</span>
                <span className="lp-rel-go" aria-hidden="true">›</span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
