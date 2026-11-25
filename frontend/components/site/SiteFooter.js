import Link from "next/link";
import { BrandMark } from "./SiteChrome";

// The Experiverse footer, identical on every page that uses the home theme.
export default function SiteFooter({ home = false }) {
  const base = home ? "" : "/";
  const NavLink = home ? "a" : Link;
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <NavLink className="brand" href={home ? "#top" : "/"}>
            <BrandMark size={26} />
            <span className="brand-text">Experi<b>verse</b></span>
          </NavLink>
          <p>Interactive science simulations for the next generation of explorers.</p>
        </div>
        <div className="footer-col">
          <h4>Explore</h4>
          <NavLink href={base + "#simulations"}>Simulations</NavLink>
          <NavLink href={base + "#features"}>Platform</NavLink>
          <NavLink href={base + "#showcase"}>Live demo</NavLink>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <a href="#">About</a>
          <a href="#">Research</a>
          <a href="#">Careers</a>
        </div>
        <div className="footer-col">
          <h4>Connect</h4>
          <a href="#">Twitter / X</a>
          <a href="#">GitHub</a>
          <a href="#">Discord</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Experiverse. Made with curiosity.</span>
        <span className="footer-badge">◈ Rendered in real time</span>
      </div>
    </footer>
  );
}
