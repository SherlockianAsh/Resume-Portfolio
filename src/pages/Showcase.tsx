import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import type { ResumeData, Project } from "../types/resume";

function formatDate(dateStr: string) {
  const [y, m] = dateStr.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(m, 10) - 1]} ${y}`;
}

function parseTags(tech: string): string[] {
  return tech.split(/,\s*/).map((t) => t.trim()).filter(Boolean);
}

function FeaturedCard({ project }: { project: Project }) {
  const isActive = !project.endDate;

  return (
    <div className="featured-card">
      <div className="featured-accent" />
      <div className="featured-content">
        <span className="featured-badge">Featured</span>
        <h3 className="featured-name">{project.projectName}</h3>
        <p className="featured-desc">{project.description}</p>
        <div className="featured-meta">
          <span className="featured-date">
            {formatDate(project.startDate)} — {project.endDate ? formatDate(project.endDate) : "Present"}
          </span>
          <span className={`featured-status ${isActive ? "featured-status-active" : "featured-status-completed"}`}>
            {isActive ? "Active" : "Completed"}
          </span>
        </div>
        <div className="featured-tags">
          {parseTags(project.technologiesUsed).map((tag) => (
            <span key={tag} className="featured-tag">{tag}</span>
          ))}
        </div>
        {project.projectUrl && (
          <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="featured-link">
            View Project
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

function CompactCard({ project }: { project: Project }) {
  return (
    <div className="compact-card">
      <h4 className="compact-name">{project.projectName}</h4>
      <p className="compact-desc">{project.description}</p>
      <div className="compact-tags">
        {parseTags(project.technologiesUsed).slice(0, 4).map((tag) => (
          <span key={tag} className="compact-tag">{tag}</span>
        ))}
      </div>
    </div>
  );
}

export default function Showcase() {
  const data = useOutletContext<ResumeData>();

  useEffect(() => {
    document.title = "Projects — Ashlock Tech Solutions";
    return () => {
      document.title = "Ashlock Tech Solutions - Resume Portfolio";
    };
  }, []);

  const featured = data.projects.filter((p) => p.featured);
  const others = data.projects.filter((p) => !p.featured);

  return (
    <section className="showcase-section">
      <div className="container">
        <div className="showcase-header">
          <h1 className="section-title">Project Showcase</h1>
          <p className="showcase-subtitle">
            A collection of enterprise systems, community tools, and personal projects built over {new Date().getFullYear() - 2016}+ years.
          </p>
        </div>

        {featured.length > 0 && (
          <div className="featured-grid">
            {featured.map((project) => (
              <FeaturedCard key={project.projectName} project={project} />
            ))}
          </div>
        )}

        {others.length > 0 && (
          <>
            <div className="projects-divider">
              <h2 className="projects-divider-title">All Projects</h2>
            </div>
            <div className="compact-grid">
              {others.map((project) => (
                <CompactCard key={project.projectName} project={project} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
