import type { Project } from "../types/resume";
import { formatDateRange } from "../utils";

export default function Projects({ items }: { items: Project[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mv-section cases-section" id="cases">
      <div className="mv-inner">
        <span className="mv-kicker">// case files — notable investigations</span>
        <h2 className="mv-section-title">
          Closed <em>cases.</em>
        </h2>

        <div className="cases-entries">
          {items.map((project, i) => (
            <div className="case-entry" key={i}>
              <div className="case-entry-header">
                <h3 className="case-title">
                  {project.projectUrl ? (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {project.projectName}
                    </a>
                  ) : (
                    project.projectName
                  )}
                </h3>
                <span className="case-date">
                  {formatDateRange(project.startDate, project.endDate)}
                </span>
              </div>
              {project.description && (
                <p className="case-desc">{project.description}</p>
              )}
              {project.technologiesUsed && (
                <div className="case-tech">
                  {project.technologiesUsed.split(", ").map((tech, j) => (
                    <span className="case-tech-tag" key={j}>{tech}</span>
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
