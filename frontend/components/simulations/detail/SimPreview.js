// Animated SVG illustrations of each lab's topic, used as hero artwork on the lab pages.
// Positions come from a seeded RNG so server and client render identical markup.

const W = 800, H = 450;

function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const r1 = (n) => Math.round(n * 10) / 10;

function Stars({ seed = 7, n = 70 }) {
  const rand = rng(seed);
  return (
    <g className="sd-stars">
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={r1(rand() * W)} cy={r1(rand() * H)} r={r1(rand() * 1.3 + 0.3)}
          style={{ animationDelay: `${r1(rand() * 4)}s` }} />
      ))}
    </g>
  );
}

function Particles({ accent }) {
  const rand = rng(42);
  const cols = [accent, "#a06bff", "#2ad4d4", "#ff6bb5", "#3ddc97", "#ffb454"];
  const dots = Array.from({ length: 90 }, (_, i) => {
    const a = rand() * Math.PI * 2, d = 40 + rand() * 330;
    return {
      x: r1(W / 2 + Math.cos(a) * d * 1.05), y: r1(H / 2 + Math.sin(a) * d * 0.55),
      r: r1(rand() * 2.6 + 1.6), c: cols[i % cols.length],
      dx: r1((rand() - 0.5) * 60), dy: r1((rand() - 0.5) * 40), dur: r1(4 + rand() * 6), delay: r1(-rand() * 8),
    };
  });
  return (
    <>
      <Stars seed={3} n={40} />
      <g className="sd-field">
        {[60, 110, 165].map((r, i) => (
          <ellipse key={r} cx={W / 2} cy={H / 2} rx={r * 1.4} ry={r * 0.75} fill="none" stroke={accent}
            strokeOpacity={0.35 - i * 0.09} strokeDasharray="3 7" className="sd-spin" style={{ animationDuration: `${30 + i * 15}s`, animationDirection: i % 2 ? "reverse" : "normal" }} />
        ))}
      </g>
      {dots.map((d, i) => (
        <g key={i} className="sd-drift" style={{ "--dx": `${d.dx}px`, "--dy": `${d.dy}px`, animationDuration: `${d.dur}s`, animationDelay: `${d.delay}s` }}>
          <circle cx={d.x} cy={d.y} r={d.r} fill={d.c} filter="url(#sd-glow)" />
          {i % 9 === 0 && <line x1={d.x} y1={d.y} x2={r1(d.x + d.dx * 0.6)} y2={r1(d.y + d.dy * 0.6)} stroke={d.c} strokeWidth="1.4" strokeOpacity="0.7" markerEnd="url(#sd-arrow)" />}
        </g>
      ))}
      <circle cx={W / 2} cy={H / 2} r="10" fill="#fff" filter="url(#sd-glow)" className="sd-pulse" />
    </>
  );
}

function Orbits({ accent }) {
  const orbits = [
    { rx: 120, ry: 48, dur: 7, c: "#5b8cff", r: 6 },
    { rx: 200, ry: 82, dur: 12, c: "#3ddc97", r: 8 },
    { rx: 300, ry: 122, dur: 20, c: accent, r: 10 },
  ];
  const cx = W / 2, cy = H / 2;
  const ellipsePath = (rx, ry) => `M ${cx + rx} ${cy} A ${rx} ${ry} 0 1 1 ${cx - rx} ${cy} A ${rx} ${ry} 0 1 1 ${cx + rx} ${cy}`;
  const probe = `M 20 420 Q ${cx + 60} ${cy + 150} ${cx + 250} ${cy - 10} T 790 40`;
  return (
    <>
      <Stars seed={11} n={110} />
      {orbits.map((o) => (
        <path key={o.rx} d={ellipsePath(o.rx, o.ry)} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1.2" />
      ))}
      <path d={probe} fill="none" stroke="#ffb454" strokeOpacity="0.55" strokeWidth="1.4" strokeDasharray="5 6" />
      <circle cx={cx} cy={cy} r="46" fill="url(#sd-sun)" opacity="0.5" />
      <circle cx={cx} cy={cy} r="24" fill="url(#sd-sun)" filter="url(#sd-glow)" className="sd-pulse" />
      {orbits.map((o) => (
        <circle key={o.rx} r={o.r} fill={o.c} filter="url(#sd-glow)">
          <animateMotion dur={`${o.dur}s`} repeatCount="indefinite" path={ellipsePath(o.rx, o.ry)} />
        </circle>
      ))}
      <path d="M -7 -5 L 9 0 L -7 5 Z" fill="#ffb454" filter="url(#sd-glow)">
        <animateMotion dur="9s" repeatCount="indefinite" rotate="auto" path={probe} />
      </path>
    </>
  );
}

const ATOM = { H: { r: 9, c: "#e8ecff" }, O: { r: 15, c: "#ff5c6c" }, N: { r: 14, c: "#5b8cff" }, C: { r: 14, c: "#4a4f6a" } };
function Molecule({ atoms, bonds, x, y, i }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="sd-tumble" style={{ animationDuration: `${7 + (i % 4) * 2}s`, animationDelay: `${-i * 1.3}s` }}>
        {bonds.map(([a, b], k) => (
          <line key={k} x1={atoms[a][1]} y1={atoms[a][2]} x2={atoms[b][1]} y2={atoms[b][2]} stroke="rgba(255,255,255,0.55)" strokeWidth="4" strokeLinecap="round" />
        ))}
        {atoms.map(([el, ax, ay], k) => (
          <circle key={k} cx={ax} cy={ay} r={ATOM[el].r} fill={ATOM[el].c} stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
        ))}
      </g>
    </g>
  );
}
function Chemistry({ accent }) {
  const H2 = { atoms: [["H", -12, 0], ["H", 12, 0]], bonds: [[0, 1]] };
  const O2 = { atoms: [["O", -16, 0], ["O", 16, 0]], bonds: [[0, 1]] };
  const H2O = { atoms: [["O", 0, 0], ["H", -20, 14], ["H", 20, 14]], bonds: [[0, 1], [0, 2]] };
  const placed = [
    [H2, 120, 110], [O2, 250, 300], [H2, 330, 160], [H2, 140, 340], [O2, 90, 220],
    [H2O, 560, 120], [H2O, 650, 290], [H2O, 520, 350], [H2O, 710, 170], [H2, 420, 380],
  ];
  const rand = rng(9);
  return (
    <>
      <defs>
        <radialGradient id="sd-heat" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.45" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={W / 2} cy={H / 2} r="140" fill="url(#sd-heat)" className="sd-pulse" />
      {Array.from({ length: 26 }, (_, i) => (
        <circle key={i} cx={r1(rand() * W)} cy={r1(H - rand() * 40)} r={r1(2 + rand() * 4)} fill="none" stroke="rgba(255,255,255,0.35)"
          className="sd-bubble" style={{ animationDuration: `${r1(4 + rand() * 5)}s`, animationDelay: `${r1(-rand() * 8)}s` }} />
      ))}
      <text x={W / 2} y={H / 2 + 6} textAnchor="middle" className="sd-arrow-text">→</text>
      {placed.map(([m, x, y], i) => <Molecule key={i} {...m} x={x} y={y} i={i} />)}
      <g transform="translate(560 40)" opacity="0.8">
        <path d="M 0 60 C 40 60 50 5 90 5 S 140 80 200 80" fill="none" stroke={accent} strokeWidth="2.2" className="sd-draw" />
        <line x1="0" y1="92" x2="200" y2="92" stroke="rgba(255,255,255,0.25)" />
        <text x="90" y="-4" textAnchor="middle" className="sd-mini">Eₐ</text>
      </g>
    </>
  );
}

function Waves({ accent }) {
  const sources = [[300, 225], [420, 225]];
  return (
    <>
      <rect width={W} height={H} fill="url(#sd-wavebg)" />
      {sources.map(([x, y], s) => (
        <g key={s}>
          {Array.from({ length: 8 }, (_, i) => (
            <circle key={i} cx={x} cy={y} r="240" fill="none" stroke={accent} strokeWidth="2"
              className="sd-ripple" style={{ animationDelay: `${-i * 0.5}s` }} />
          ))}
          <circle cx={x} cy={y} r="6" fill="#fff" filter="url(#sd-glow)" />
        </g>
      ))}
      <rect x="690" y="20" width="14" height="410" rx="4" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" />
      {Array.from({ length: 9 }, (_, i) => {
        const y = 40 + i * 46, b = 1 - Math.abs(i - 4) / 5;
        return <rect key={i} x="692" y={y} width="10" height="18" rx="3" fill={accent} opacity={r1(0.25 + b * 0.75)} filter="url(#sd-glow)" />;
      })}
    </>
  );
}

function Quantum({ accent }) {
  const base = 300, pts = [], dens = [];
  for (let x = -260; x <= 260; x += 4) {
    const env = Math.exp(-((x / 95) ** 2));
    pts.push(`${x},${r1(base - 120 * env * Math.cos(x / 13))}`);
    dens.push(`${x},${r1(base - 150 * env * env)}`);
  }
  const wave = "M " + pts.join(" L ");
  const density = `M -260,${base} L ` + dens.join(" L ") + ` L 260,${base} Z`;
  return (
    <>
      <Stars seed={5} n={30} />
      <line x1="0" y1={base} x2={W} y2={base} stroke="rgba(255,255,255,0.2)" />
      <rect x="470" y="70" width="46" height={base - 70} fill={accent} opacity="0.16" />
      <rect x="470" y="70" width="46" height={base - 70} fill="none" stroke={accent} strokeOpacity="0.7" strokeDasharray="4 5" />
      <text x="493" y="58" textAnchor="middle" className="sd-mini">V₀</text>
      <g className="sd-packet">
        <path d={density} fill={accent} opacity="0.22" />
        <path d={wave} fill="none" stroke={accent} strokeWidth="2.6" filter="url(#sd-glow)" />
      </g>
      {/* the small packet that tunnelled through: same shape, 38% amplitude, still sitting on the baseline */}
      <g className="sd-transmit" transform={`translate(650 ${base * 0.62})`}>
        <path d={wave} fill="none" stroke="#a06bff" strokeWidth="2.4" transform="scale(0.45 0.38)" vectorEffect="non-scaling-stroke" />
      </g>
    </>
  );
}

const SCENES = {
  "particle-physics": Particles,
  "orbital-mechanics": Orbits,
  "chemical-reactions": Chemistry,
  "waves-optics": Waves,
  "quantum-fields": Quantum,
};

export default function SimPreview({ slug, accent }) {
  const Scene = SCENES[slug];
  return (
    <svg className="sd-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustration">
      <defs>
        <filter id="sd-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <marker id="sd-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill="rgba(255,255,255,0.8)" />
        </marker>
        <radialGradient id="sd-sun" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#fff6d5" />
          <stop offset="45%" stopColor="#ffb454" />
          <stop offset="100%" stopColor="#ff6b3d" />
        </radialGradient>
        <radialGradient id="sd-wavebg" cx="45%" cy="50%" r="65%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.14" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <pattern id="sd-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#sd-grid)" />
      {Scene && <Scene accent={accent} />}
    </svg>
  );
}
