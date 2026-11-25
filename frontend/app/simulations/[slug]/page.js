import "../../home.css";
import "./lab.css";
import { notFound } from "next/navigation";
import { PREVIEW_LABS, getLab } from "../../../components/simulations/catalog";
import LabPageClient from "../../../components/simulations/detail/LabPageClient";

// only the labs in the catalog exist; anything else 404s
export const dynamicParams = false;

export function generateStaticParams() {
  return PREVIEW_LABS.map((lab) => ({ slug: lab.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const lab = getLab(slug);
  if (!lab) return {};
  return {
    title: `${lab.title} · Experiverse Lab`,
    description: `${lab.desc} Discover the ideas behind the Experiverse ${lab.title.toLowerCase()} lab.`,
  };
}

export default async function LabPage({ params }) {
  const { slug } = await params;
  if (!getLab(slug)) notFound();
  return <LabPageClient slug={slug} />;
}
