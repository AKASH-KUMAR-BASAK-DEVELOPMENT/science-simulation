"use client";

import { useEffect, useRef, useState } from "react";

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export default function CommandPalette({ open, onClose, commands }) {
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSel(0);
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  const filtered = commands.filter((c) => (c.title + " " + (c.sub || "")).toLowerCase().includes(query.toLowerCase()));

  function runSel(i) {
    const c = filtered[i ?? sel];
    if (!c) return;
    onClose();
    c.run();
  }

  if (!open) return <div className="cmdk" hidden></div>;

  return (
    <div className="cmdk" role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="cmdk-backdrop" onClick={onClose}></div>
      <div className="cmdk-box">
        <div className="cmdk-input-wrap">
          <span className="cmdk-search" aria-hidden="true">⌕</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search actions or jump to a simulation…"
            autoComplete="off"
            spellCheck={false}
            aria-label="Command search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSel(0); }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => clamp(s + 1, 0, filtered.length - 1)); }
              else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => clamp(s - 1, 0, filtered.length - 1)); }
              else if (e.key === "Enter") { e.preventDefault(); runSel(); }
            }}
          />
          <kbd>ESC</kbd>
        </div>
        <ul className="cmdk-list" role="listbox">
          {filtered.length === 0 && <li className="cmdk-empty">No matching commands</li>}
          {filtered.map((c, i) => (
            <li
              key={c.title}
              className={"cmdk-item" + (i === sel ? " sel" : "")}
              role="option"
              onMouseEnter={() => setSel(i)}
              onClick={() => runSel(i)}
            >
              <span className="ci-ico">{c.icon}</span>
              <span className="ci-text">
                <span className="ci-title">{c.title}</span>
                {c.sub && <span className="ci-sub">{c.sub}</span>}
              </span>
            </li>
          ))}
        </ul>
        <div className="cmdk-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> select</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
