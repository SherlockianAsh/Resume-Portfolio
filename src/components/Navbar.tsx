import { Link, useLocation } from "react-router-dom";

export default function Navbar({ name }: { name: string }) {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <div className="navbar-brand-icon">A</div>
          <span className="hide-mobile">{name}</span>
        </Link>
        <div className="navbar-nav">
          <Link
            to="/"
            className={`navbar-link${location.pathname === "/" ? " active" : ""}`}
          >
            Home
          </Link>
          <Link
            to="/resume"
            className={`navbar-link${location.pathname === "/resume" ? " active" : ""}`}
          >
            Resume
          </Link>
          <a href="/#contact" className="navbar-link">
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}
