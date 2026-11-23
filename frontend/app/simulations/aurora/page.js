import "./aurora.css";
import AuroraClient from "../../../components/simulations/aurora/AuroraClient";

export const metadata = {
  title: "Aurora Lab · Touchable Science",
  description:
    "Aurora Lab — touchable science. Simulate physics, chemistry, biology and the cosmos in a browser that feels alive.",
};

export const viewport = { themeColor: "#f3efe6" };

export default function AuroraPage() {
  return <AuroraClient />;
}
