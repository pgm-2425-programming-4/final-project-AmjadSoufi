import * as React from "react";
import { Outlet, createRootRoute, Link } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <React.Fragment>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <div className="nav-brand">
              <h2>ProjectHub</h2>
            </div>

            {/* Hamburger Menu Button */}
            <button
              className={`hamburger ${isMenuOpen ? "active" : ""}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>

            {/* Navigation Links */}
            <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
              <Link
                to="/"
                className="nav-link"
                activeProps={{ className: "nav-link nav-link-active" }}
                onClick={closeMenu}
              >
                <span className="nav-icon">🏠</span>
                Home
              </Link>
              <Link
                to="/projects"
                className="nav-link"
                activeProps={{ className: "nav-link nav-link-active" }}
                onClick={closeMenu}
              >
                <span className="nav-icon">📁</span>
                Projects
              </Link>
              <Link
                to="/backlog"
                className="nav-link"
                activeProps={{ className: "nav-link nav-link-active" }}
                onClick={closeMenu}
              >
                <span className="nav-icon">📋</span>
                All Backlog
              </Link>
              <Link
                to="/about"
                className="nav-link"
                activeProps={{ className: "nav-link nav-link-active" }}
                onClick={closeMenu}
              >
                <span className="nav-icon">ℹ️</span>
                About
              </Link>
            </div>
          </div>

          {/* Mobile Overlay */}
          <div
            className={`nav-overlay ${isMenuOpen ? "active" : ""}`}
            onClick={closeMenu}
          ></div>
        </nav>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </React.Fragment>
  );
}
