import "./silicon.css";
import SiliconClient from "../../../components/simulations/silicon/SiliconClient";

export const metadata = {
  title: "Silicon · Supercomputer Simulation Lab",
  description:
    "Silicon Lab — a live supercomputer simulator. Watch data flow through circuits, pipeline instructions, and branch through a decision engine in real time.",
};

export default function SiliconPage() {
  return <SiliconClient />;
}
