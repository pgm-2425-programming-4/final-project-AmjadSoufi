import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="about-container">
      <h1 className="about-title">Over dit project</h1>

      <div className="about-card">
        <p className="about-description">
          Deze Task Manager applicatie is ontwikkeld als onderdeel van mijn
          studie aan Artevelde Hogeschool. Het project demonstreert moderne web
          development technieken met React, TanStack Router voor routing, en
          TanStack Query voor data management. De applicatie biedt een
          intuïtieve interface voor het beheren van taken met real-time
          synchronisatie naar een backend API. Het project toont mijn
          vaardigheden in frontend development, state management, en het werken
          met externe APIs.
        </p>
      </div>

      <div className="about-card">
        <h2 className="contact-title">Contact</h2>
        <div className="contact-list">
          <div className="contact-item">
            <div className="contact-icon person"></div>
            <div className="contact-info">
              <p className="contact-name">Amjad Soufi</p>
              <p className="contact-detail">Student Web Development</p>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon email"></div>
            <div className="contact-info">
              <p className="contact-name">E-mail</p>
              <a
                href="mailto:amjad.soufi@student.arteveldehs.be"
                className="contact-link"
              >
                amjad.soufi@student.arteveldehs.be
              </a>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon linkedin"></div>
            <div className="contact-info">
              <p className="contact-name">LinkedIn</p>
              <a
                href="https://www.linkedin.com/in/amjad-soufi-57794b316/"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                linkedin.com
              </a>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon school"></div>
            <div className="contact-info">
              <p className="contact-name">Opleiding</p>
              <p className="contact-detail">
                Artevelde Hogeschool - Web Development
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
