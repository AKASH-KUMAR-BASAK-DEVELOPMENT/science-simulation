import Reveal from "@/components/Reveal";

const steps = [
  { no: "01", title: "Choose a simulation", text: "Browse the library by subject and open any experiment in one click." },
  { no: "02", title: "Change the variables", text: "Drag the sliders and toggles to set up the scenario you want to explore." },
  { no: "03", title: "Observe & conclude", text: "Watch the results update live, read the graphs, and draw your own conclusions." },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary to-primary2 px-6 py-16 md:px-14 md:py-20">
        {/* soft light blobs */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />

        <Reveal>
          <div className="relative max-w-2xl">
            <span className="text-sm font-semibold text-white/80">Workflow</span>
            <h2 className="mt-3 font-[family-name:var(--font-round)] text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              From question to conclusion.
            </h2>
          </div>
        </Reveal>

        <div className="relative mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.no} delay={i * 90}>
              <div className="h-full rounded-3xl bg-white/12 p-7 ring-1 ring-white/20 backdrop-blur-sm">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-card font-[family-name:var(--font-round)] text-lg font-semibold text-primary">
                  {s.no}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  {s.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
