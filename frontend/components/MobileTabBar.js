"use client";

import { useEffect, useState } from "react";

// Stroke icons shared by every page's tab bar.
const PATHS = {
  home: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V20h5v-6h4v6h5V9.5" /></>,
  flask: <><path d="M9 3h6" /><path d="M10 3v6L4.8 18a2 2 0 0 0 1.8 3h10.8a2 2 0 0 0 1.8-3L14 9V3" /><path d="M7.5 15h9" /></>,
  play: <><circle cx="12" cy="12" r="9" /><path d="m10 8.5 5.5 3.5-5.5 3.5z" /></>,
  grid: <><rect x="3.5" y="3.5" width="7" height="7" rx="2" /><rect x="13.5" y="3.5" width="7" height="7" rx="2" /><rect x="3.5" y="13.5" width="7" height="7" rx="2" /><rect x="13.5" y="13.5" width="7" height="7" rx="2" /></>,
  menu: <><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></>,
  cell: <><circle cx="12" cy="12" r="8.5" /><circle cx="10" cy="10" r="2.5" /><circle cx="15.5" cy="14.5" r="1.3" /></>,
  life: <><rect x="4" y="4" width="4.5" height="4.5" rx="1" /><rect x="15.5" y="4" width="4.5" height="4.5" rx="1" /><rect x="9.75" y="9.75" width="4.5" height="4.5" rx="1" /><rect x="4" y="15.5" width="4.5" height="4.5" rx="1" /><rect x="15.5" y="15.5" width="4.5" height="4.5" rx="1" /></>,
  dna: <><path d="M7 3c0 7 10 11 10 18" /><path d="M17 3c0 7-10 11-10 18" /><path d="M8 7h8M7.3 12h9.4M8 17h8" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></>,
  chip: <><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" /></>,
  flow: <><path d="M3 12h4l3-6 4 12 3-6h4" /></>,
  branch: <><circle cx="6" cy="6" r="2.2" /><circle cx="6" cy="18" r="2.2" /><circle cx="18" cy="9" r="2.2" /><path d="M6 8.2v7.6M18 11.2c0 4-6 3-11 5" /></>,
  terminal: <><rect x="3" y="4.5" width="18" height="15" rx="2.5" /><path d="m7 9.5 3 2.5-3 2.5M12.5 15h4" /></>,
  sparkle: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" /></>,
  gallery: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m3 16 5-5 4 4 3-3 6 6" /><circle cx="15.5" cy="9" r="1.4" /></>,
  bolt: <><path d="M13 3 5 13.5h6L10 21l9-11h-6z" /></>,
};

export function TabIcon({ name }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}

/**
 * Floating bottom tab bar shown on phones (≤768px).
 * items: { id, label, icon, target? (section id), href? (other page), onClick?, pressed? }
 * Section items must be listed in document order; the active one follows scroll.
 */
export default function MobileTabBar({ items, label = "Sections" }) {
  const [active, setActive] = useState(items.find((i) => i.target)?.id);

  useEffect(() => {
    const tracked = items.filter((i) => i.target);
    let raf = 0;
    function update() {
      raf = 0;
      const line = innerHeight * 0.38;
      let cur = tracked[0]?.id;
      for (const it of tracked) {
        const el = document.getElementById(it.target);
        if (el && el.getBoundingClientRect().top <= line) cur = it.id;
      }
      // at the very bottom, short final sections never cross the line
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4 && tracked.length) cur = tracked[tracked.length - 1].id;
      setActive(cur);
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav className="mtab" aria-label={label}>
      {items.map((it) => {
        const on = it.pressed ?? (it.target && it.id === active);
        const cls = "mtab-item" + (on ? " on" : "");
        const inner = <><TabIcon name={it.icon} /><span className="mtab-label">{it.label}</span></>;
        if (it.onClick) {
          return <button key={it.id} type="button" className={cls} onClick={it.onClick} aria-pressed={!!it.pressed}>{inner}</button>;
        }
        return (
          <a key={it.id} className={cls} href={it.href ?? "#" + it.target} aria-current={on ? "true" : undefined}>
            {inner}
          </a>
        );
      })}
    </nav>
  );
}
