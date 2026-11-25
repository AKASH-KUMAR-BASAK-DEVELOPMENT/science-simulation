// Experiverse colour palettes + saved light/dark theme, shared by the home page and lab detail pages.

export const PALETTES = [
  { name: "Nebula", a: "#5b8cff", b: "#a06bff", c: "#2ad4d4" },
  { name: "Plasma", a: "#ff6bb5", b: "#a06bff", c: "#ffb454" },
  { name: "Aurora", a: "#3ddc97", b: "#2ad4d4", c: "#5b8cff" },
  { name: "Solar", a: "#ffb454", b: "#ff6b3d", c: "#ff6bb5" },
];

// tiny store so components can subscribe to theme/accent changes (useSyncExternalStore)
const listeners = new Set();
export function subscribeTheme(cb) { listeners.add(cb); return () => listeners.delete(cb); }
const emit = () => listeners.forEach((cb) => cb());
export const getTheme = () => (document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark");
export const getAccent = () => parseInt(localStorage.getItem("ql-accent") || "0", 10) || 0;

export function applyAccent(i) {
  const p = PALETTES[i % PALETTES.length];
  const r = document.documentElement.style;
  r.setProperty("--accent", p.a);
  r.setProperty("--accent-2", p.b);
  r.setProperty("--accent-3", p.c);
  localStorage.setItem("ql-accent", String(i % PALETTES.length));
  emit();
}

// the accent lives inline on <html>; clear it when leaving the home theme so other labs keep their own
export function clearAccent() {
  const r = document.documentElement.style;
  ["--accent", "--accent-2", "--accent-3"].forEach((v) => r.removeProperty(v));
}

export function loadSavedTheme() {
  const theme = localStorage.getItem("ql-theme") === "light" ? "light" : "dark";
  if (theme === "light") document.documentElement.setAttribute("data-theme", "light");
  else document.documentElement.removeAttribute("data-theme");
  const accent = parseInt(localStorage.getItem("ql-accent") || "0", 10) || 0;
  applyAccent(accent);
  return { theme, accent };
}

export function setTheme(theme) {
  if (theme === "light") document.documentElement.setAttribute("data-theme", "light");
  else document.documentElement.removeAttribute("data-theme");
  localStorage.setItem("ql-theme", theme);
  emit();
}
