import { Link, useOutletContext } from "react-router-dom";
import type { ResumeData } from "../types/resume";
import { formatDateRange, formatMonth, parseDescription, interpolateYears } from "../utils";
import DynamicSection from "../components/DynamicSection";

/** Keys that have dedicated rendering in the resume view */
const HANDLED_KEYS = new Set<string>([
  "profile",
  "experiences",
  "education",
  "skills",
  "certifications",
  "projects",
]);

export default function Resume() {
  const data = useOutletContext<ResumeData>();
  const { profile, experiences, education, skills, certifications, projects } = data;

  // Collect unknown sections for dynamic rendering
  const dynamicSections = Object.entries(data)
    .filter(([key, value]) => !HANDLED_KEYS.has(key) && Array.isArray(value) && value.length > 0)
    .map(([key, value]) => ({ key, items: value as Record<string, unknown>[] }));

  return (
    <main className="resume-page">
      <div className="resume-container">
        {/* Action Buttons */}
        <div className="resume-actions">
          <Link to="/" className="btn btn-secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back
          </Link>
          <button onClick={() => window.print()} className="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Print / Save PDF
          </button>
        </div>

        {/* Resume Document */}
        <div className="resume">
          {/* Header */}
          <header className="resume-header">
            <h1 className="resume-name">{profile.fullName}</h1>
            {profile.title && <p className="resume-title">{profile.title}</p>}
            <div className="resume-contact">
              {profile.location && (
                <span className="resume-contact-item">{profile.location}</span>
              )}
              {profile.email && (
                <span className="resume-contact-item">
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>
                </span>
              )}
              {profile.phone && (
                <span className="resume-contact-item">{profile.phone}</span>
              )}
            </div>
          </header>

          {/* Professional Summary */}
          {profile.summary && (
            <section className="resume-section">
              <h2 className="resume-section-title">Professional Summary</h2>
              <p className="resume-entry-description" style={{ whiteSpace: "pre-line" }}>
                {interpolateYears(profile.summary)}
              </p>
            </section>
          )}

          {/* Work Experience */}
          {experiences.length > 0 && (
            <section className="resume-section">
              <h2 className="resume-section-title">Work Experience</h2>
              {experiences.map((exp, i) => (
                <div className="resume-entry" key={i}>
                  <div className="resume-entry-header">
                    <h3 className="resume-entry-title">{exp.position}</h3>
                    <span className="resume-entry-date">
                      {formatDateRange(exp.startDate, exp.endDate)}
                    </span>
                  </div>
                  <p className="resume-entry-subtitle">
                    {exp.company}{exp.location ? `, ${exp.location}` : ""}
                  </p>
                  {exp.description && (
                    <div
                      className="resume-entry-description"
                      dangerouslySetInnerHTML={{ __html: parseDescription(exp.description) }}
                    />
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section className="resume-section">
              <h2 className="resume-section-title">Education</h2>
              {education.map((edu, i) => (
                <div className="resume-entry" key={i}>
                  <div className="resume-entry-header">
                    <h3 className="resume-entry-title">
                      {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                    </h3>
                    <span className="resume-entry-date">
                      {formatDateRange(edu.startDate, edu.endDate)}
                    </span>
                  </div>
                  <p className="resume-entry-subtitle">
                    {edu.institution}{edu.location ? `, ${edu.location}` : ""}
                  </p>
                </div>
              ))}
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section className="resume-section">
              <h2 className="resume-section-title">Skills</h2>
              <div className="resume-skills-list">
                {skills.map((s) => s.skillName).join(", ")}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section className="resume-section">
              <h2 className="resume-section-title">Certifications</h2>
              {certifications.map((cert, i) => (
                <div className="resume-cert" key={i}>
                  <span className="resume-cert-name">{cert.certName}</span>
                  <span className="resume-cert-org"> - {cert.issuingOrg}</span>
                  {cert.issueDate && (
                    <span className="resume-cert-org"> ({formatMonth(cert.issueDate)})</span>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section className="resume-section resume-section-projects">
              <h2 className="resume-section-title">Projects</h2>
              {projects.map((project, i) => (
                <div className="resume-project" key={i}>
                  <div className="resume-project-name">{project.projectName}</div>
                  {project.technologiesUsed && (
                    <div className="resume-project-tech">{project.technologiesUsed}</div>
                  )}
                  {project.description && (
                    <div className="resume-project-desc">{project.description}</div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Dynamic sections — auto-rendered from unknown keys */}
          {dynamicSections.map(({ key, items }) => (
            <DynamicSection key={key} sectionKey={key} items={items} variant="resume" />
          ))}
        </div>
      </div>
    </main>
  );
}
