/* A wall of miniature science instruments — every tile animates on its own. */

function Tile({ label, children }) {
  return (
    <div className="relative flex min-h-[120px] items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
      {children}
      <span className="absolute bottom-1.5 left-2 font-mono text-[9px] uppercase tracking-wider text-slate-500">
        {label}
      </span>
    </div>
  );
}

function Gear({ color, size = 44 }) {
  const teeth = Array.from({ length: 8 });
  return (
    <svg width={size} height={size} viewBox="0 0 44 44">
      <circle cx="22" cy="22" r="12" fill="none" stroke={color} strokeWidth="2" />
      <circle cx="22" cy="22" r="4" fill={color} />
      {teeth.map((_, i) => (
        <rect
          key={i}
          x="20.5"
          y="2"
          width="3"
          height="6"
          fill={color}
          transform={`rotate(${i * 45} 22 22)`}
        />
      ))}
    </svg>
  );
}

const Wave = ({ color }) => (
  <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-full w-1/2">
    <path
      d="M0 20 Q12.5 2 25 20 T50 20 T75 20 T100 20"
      fill="none"
      stroke={color}
      strokeWidth="2"
    />
  </svg>
);

const sims = [
  {
    label: "Pendulum",
    node: (
      <div className="relative h-full w-full">
        <div className="animate-pendulum absolute left-1/2 top-3 -ml-[5px] w-2.5">
          <div className="mx-auto h-12 w-0.5 bg-cyan-400" />
          <div className="mx-auto -mt-0.5 h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_2px_rgba(34,211,238,0.6)]" />
        </div>
      </div>
    ),
  },
  {
    label: "Atom",
    node: (
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border border-white/15" />
        <div className="absolute inset-3 rounded-full border border-white/10" />
        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-400 shadow-[0_0_10px_2px_rgba(167,139,250,0.6)]" />
        <div className="animate-spin-slow absolute inset-0">
          <div className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-cyan-400" />
        </div>
        <div className="animate-spin-rev absolute inset-3">
          <div className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-pink-400" />
        </div>
      </div>
    ),
  },
  {
    label: "Waveform",
    node: (
      <div className="relative h-10 w-full overflow-hidden">
        <div className="animate-wave absolute inset-y-0 left-0 flex w-[200%]">
          <Wave color="#a3e635" />
          <Wave color="#a3e635" />
        </div>
      </div>
    ),
  },
  {
    label: "Projectile",
    node: (
      <svg viewBox="0 0 80 60" className="h-16 w-16">
        <path d="M8 52 Q40 -4 72 52" stroke="#fb923c" fill="none" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="8" y1="52" x2="72" y2="52" stroke="rgba(255,255,255,0.15)" />
        <circle r="3" fill="#fb923c">
          <animateMotion dur="2s" repeatCount="indefinite" path="M8 52 Q40 -4 72 52" />
        </circle>
      </svg>
    ),
  },
  {
    label: "Free fall",
    node: (
      <div className="relative h-16 w-8">
        <div className="animate-bounce-ball absolute left-1/2 top-1/2 -ml-[6px] h-3 w-3 rounded-full bg-sky-400 shadow-[0_0_8px_2px_rgba(56,189,248,0.5)]" />
        <div className="absolute bottom-1 left-0 h-px w-full bg-white/20" />
      </div>
    ),
  },
  {
    label: "Spring",
    node: (
      <div className="animate-spring flex flex-col items-center">
        <svg width="22" height="34" viewBox="0 0 22 34">
          <path d="M11 0 L11 4 L3 7 L19 11 L3 15 L19 19 L11 22" stroke="#fbbf24" fill="none" strokeWidth="1.5" />
        </svg>
        <div className="h-4 w-6 rounded-sm border border-amber-300/40 bg-amber-400" />
      </div>
    ),
  },
  {
    label: "Oscilloscope",
    node: (
      <div className="flex h-12 items-end gap-1">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="animate-bar h-full w-1.5 rounded-sm bg-pink-400"
            style={{ animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </div>
    ),
  },
  {
    label: "Circuit",
    node: (
      <svg viewBox="0 0 70 50" className="h-14 w-16">
        <rect x="8" y="8" width="54" height="34" rx="3" stroke="#34d399" fill="none" strokeWidth="1.5" />
        <rect x="30" y="4" width="10" height="8" fill="#0a0d12" stroke="#34d399" strokeWidth="1.5" />
        <circle r="2.5" fill="#34d399">
          <animateMotion dur="2.4s" repeatCount="indefinite" path="M8 8 H62 V42 H8 Z" />
        </circle>
      </svg>
    ),
  },
  {
    label: "Gears",
    node: (
      <div className="relative h-16 w-20">
        <div className="animate-spin-slow absolute left-1 top-2">
          <Gear color="#22d3ee" size={40} />
        </div>
        <div className="animate-spin-rev absolute right-1 bottom-1">
          <Gear color="#a78bfa" size={30} />
        </div>
      </div>
    ),
  },
  {
    label: "Molecule",
    node: (
      <div className="animate-vibrate">
        <svg width="62" height="48" viewBox="0 0 62 48">
          <line x1="16" y1="24" x2="46" y2="14" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="16" y1="24" x2="46" y2="34" stroke="#94a3b8" strokeWidth="1.5" />
          <circle cx="16" cy="24" r="7" fill="#f472b6" />
          <circle cx="46" cy="14" r="5" fill="#38bdf8" />
          <circle cx="46" cy="34" r="5" fill="#38bdf8" />
        </svg>
      </div>
    ),
  },
  {
    label: "Ripples",
    node: (
      <div className="relative h-14 w-14">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="animate-ripple absolute inset-0 rounded-full border border-sky-400"
            style={{ animationDelay: `${i * 0.8}s` }}
          />
        ))}
        <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400" />
      </div>
    ),
  },
  {
    label: "Gauge",
    node: (
      <div className="relative h-12 w-16">
        <svg viewBox="0 0 80 46" className="w-full">
          <path d="M6 42 A34 34 0 0 1 74 42" stroke="#334155" fill="none" strokeWidth="3" />
        </svg>
        <div className="animate-gauge absolute bottom-1 left-1/2 h-8 w-0.5 -ml-px bg-amber-400" />
        <div className="absolute bottom-0.5 left-1/2 h-2 w-2 -ml-1 rounded-full bg-amber-400" />
      </div>
    ),
  },
];

export default function SimWall() {
  // repeat + offset so the grid fills the whole hero
  const tiles = [...sims, ...sims.slice(3), ...sims.slice(0, 6)];
  return (
    <div className="grid h-full auto-rows-fr grid-cols-3 gap-3 p-3 sm:grid-cols-4 lg:grid-cols-6">
      {tiles.map((s, i) => (
        <Tile key={i} label={s.label}>
          {s.node}
        </Tile>
      ))}
    </div>
  );
}
