import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar({ name }: { name: string }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <div className="navbar-brand-icon" aria-label="Ashlock Tech Solutions">
            {/* The lens that reads code — magnifier enclosing a >_ terminal prompt.
                Knockout finish: currentColor inherits --text-on-primary on the brass chip. */}
            <svg viewBox="0 0 120 120" width="22" height="22" fill="none" aria-hidden="true">
              <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="7" />
              <line x1="78" y1="78" x2="104" y2="104" stroke="currentColor" strokeWidth="11" strokeLinecap="round" />
              <path d="M34 40 l13 10 l-13 10" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="52" y="58" width="20" height="7" rx="3.5" fill="currentColor" />
            </svg>
          </div>
          <span className="hide-mobile">{name}</span>
        </Link>

        <button
          className={`navbar-burger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          aria-controls="navbar-menu"
        >
          <span className="burger-line" />
          <span className="burger-line" />
          <span className="burger-line" />
        </button>

        <div
          id="navbar-menu"
          className={`navbar-nav${menuOpen ? " navbar-nav-open" : ""}`}
        >
          <Link
            to="/"
            className={`navbar-link${location.pathname === "/" ? " active" : ""}`}
            onClick={closeMenu}
          >
            01 — Dossier
          </Link>
          <Link
            to="/resume"
            className={`navbar-link${location.pathname === "/resume" ? " active" : ""}`}
            onClick={closeMenu}
          >
            Resume
          </Link>
          <Link
            to="/card"
            className={`navbar-link${location.pathname === "/card" ? " active" : ""}`}
            onClick={closeMenu}
          >
            Card
          </Link>
          <Link
            to="/projects"
            className={`navbar-link${location.pathname === "/projects" ? " active" : ""}`}
            onClick={closeMenu}
          >
            Cases
          </Link>
          <Link
            to="/analytics"
            className={`navbar-link${location.pathname === "/analytics" ? " active" : ""}`}
            onClick={closeMenu}
          >
            Analytics
          </Link>
          <a href="/#contact" className="navbar-link navbar-link-cta" onClick={closeMenu}>
            Make Contact
          </a>
        </div>
      </div>
    </nav>
  );
}
