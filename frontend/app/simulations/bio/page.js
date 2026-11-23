import "./bio.css";
import BioClient from "../../../components/simulations/bio/BioClient";

export const metadata = {
  title: "Vivarium · Living Systems Lab",
  description:
    "Vivarium — a living systems lab. Culture microorganisms, evolve cellular life, and watch DNA and emergence unfold in your browser.",
};

export const viewport = { themeColor: "#04140f" };

export default function BioPage() {
  return <BioClient />;
}
