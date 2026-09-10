import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";

const stats = [
  { node: <Counter to={40} suffix="+" />, label: "Simulations" },
  { node: <Counter to={6} />, label: "Subjects" },
  { node: <Counter to={12} suffix="k+" />, label: "Students" },
  { node: <Counter to={98} suffix="%" />, label: "Would recommend" },
];

export default function Stats() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <Reveal>
        <div className="grid grid-cols-2 gap-6 rounded-[2.5rem] bg-card p-10 shadow-[0_30px_70px_-40px_rgba(28,25,53,0.5)] ring-1 ring-line md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="bg-gradient-to-br from-primary to-primary2 bg-clip-text font-[family-name:var(--font-round)] text-4xl font-semibold tracking-tight text-transparent md:text-5xl">
                {s.node}
              </div>
              <div className="mt-1 text-sm font-medium text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
