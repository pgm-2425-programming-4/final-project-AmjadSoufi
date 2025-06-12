import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="welcome-page">
      <div className="welcome-content">
        <div className="welcome-badge">
          <span>✨</span>
          Welkom bij ProjectHub
        </div>

        <h1 className="welcome-title">
          Beheer je projecten <br />
          <span className="highlight">eenvoudig</span>
        </h1>

        <p className="welcome-subtitle">
          Organiseer je taken, volg je voortgang en werk samen aan projecten.
          Alles wat je nodig hebt om productief te blijven.
        </p>

        <div className="welcome-actions">
          <a href="/projects" className="btn btn-primary btn-lg">
            <span className="btn-icon">🚀</span>
            Start nu
          </a>
          <a href="/about" className="btn btn-secondary btn-lg">
            <span className="btn-icon">ℹ️</span>
            Meer info
          </a>
        </div>

        <div className="welcome-stats">
          <div className="stat-item-mini">
            <span className="stat-number-mini">24/7</span>
            <span className="stat-label-mini">Beschikbaar</span>
          </div>
          <div className="stat-item-mini">
            <span className="stat-number-mini">∞</span>
            <span className="stat-label-mini">Projecten</span>
          </div>
          <div className="stat-item-mini">
            <span className="stat-number-mini">⚡</span>
            <span className="stat-label-mini">Snel</span>
          </div>
        </div>
      </div>
    </div>
  );
}
