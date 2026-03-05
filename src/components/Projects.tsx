import type { Project } from "../types/resume";
import { formatDateRange } from "../utils";

export default function Projects({ items }: { items: Project[] }) {
  if (items.length === 0) return null;

  return (
    <section className="projects-section">
      <div className="container">
        <div className="summary-content">
          <h2 className="section-title">Projects</h2>
        </div>
        <div className="cards-container">
          {items.map((project, i) => (
            <div className="entry-card" key={i}>
              <div className="entry-card-header">
                <h3 className="entry-card-title">
                  {project.projectUrl ? (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "inherit" }}
                    >
                      {project.projectName}
                    </a>
                  ) : (
                    project.projectName
                  )}
                </h3>
                <span className="entry-card-date">
                  {formatDateRange(project.startDate, project.endDate)}
                </span>
              </div>
              {project.description && (
                <p className="entry-card-description">{project.description}</p>
              )}
              {project.technologiesUsed && (
                <div className="project-card-tech">
                  {project.technologiesUsed.split(", ").map((tech, j) => (
                    <span className="tech-tag" key={j}>{tech}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
