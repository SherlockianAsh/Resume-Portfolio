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
          <div className="navbar-brand-icon">A</div>
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
            Home
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
          <a href="/#contact" className="navbar-link" onClick={closeMenu}>
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}
