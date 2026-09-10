import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Stats from "@/components/Stats";
import SimulationsShowcase from "@/components/SimulationsShowcase";
import Testimonial from "@/components/Testimonial";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Stats />
      <SimulationsShowcase />
      <Testimonial />
      <CTA />
    </>
  );
}
