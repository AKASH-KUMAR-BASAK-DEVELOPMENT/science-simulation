import Reveal from "@/components/Reveal";
import Button from "@/components/Button";

export const metadata = {
  title: "About",
  description:
    "How SciSim turns abstract science into hands-on, interactive experiments teachers and students love.",
};

const steps = [
  { step: "01", title: "Pick a simulation", text: "Choose from physics, chemistry, biology and astronomy experiments." },
  { step: "02", title: "Change the variables", text: "Drag sliders and toggles to set up your experiment exactly how you want it." },
  { step: "03", title: "Watch & learn", text: "See the science react in real time, read the data, and draw your own conclusions." },
];

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-drift absolute -left-24 top-0 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="animate-drift absolute right-0 top-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl [animation-delay:4s]" />
      </div>

      <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <Reveal>
          <span className="text-sm font-semibold text-primary">About</span>
          <h1 className="mt-3 font-[family-name:var(--font-round)] text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Science is best understood by doing.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            SciSim is a teaching tool built around a simple idea: people learn
            science best when they can experiment with it themselves. Instead of
            static diagrams, every topic here is an interactive simulation
            students can adjust, run and repeat.
          </p>
        </Reveal>

        <Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.step} className="lift rounded-3xl bg-card p-6 shadow-[0_20px_50px_-30px_rgba(28,25,53,0.5)] ring-1 ring-line">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary2 font-[family-name:var(--font-round)] text-lg font-semibold text-white">
                  {s.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-16 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary to-primary2 p-8 md:p-12">
            <h2 className="font-[family-name:var(--font-round)] text-2xl font-semibold tracking-tight text-white">
              Built for classrooms and curious minds
            </h2>
            <p className="mt-3 max-w-2xl text-white/85">
              Whether you are a teacher demonstrating a concept on a projector or a
              student exploring at home, SciSim runs on any modern browser with
              nothing to install. This page is part of a template — swap in your
              own copy, visuals and data whenever you are ready.
            </p>
            <div className="mt-6">
              <Button href="/simulations" variant="secondary" className="px-7 py-3.5 text-primary">
                Explore the library →
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
