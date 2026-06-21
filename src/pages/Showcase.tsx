import { useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import type { ResumeData, Project } from "../types/resume";
import Reveal from "../components/Reveal";
import Loupe from "../components/Loupe";

function formatDate(dateStr: string) {
  const [y, m] = dateStr.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(m, 10) - 1]} ${y}`;
}

function parseTags(tech: string): string[] {
  return tech.split(/,\s*/).map((t) => t.trim()).filter(Boolean);
}

/** Years (rounded down) between two YYYY-MM dates. */
function spanYears(start: string, end: string | null): string {
  const [sy, sm] = start.split("-").map((n) => parseInt(n, 10));
  const e = end ? end.split("-").map((n) => parseInt(n, 10)) : [new Date().getFullYear(), new Date().getMonth() + 1];
  const months = (e[0] - sy) * 12 + (e[1] - sm);
  if (months < 1) return "under a month";
  if (months < 12) return `${months} month${months === 1 ? "" : "s"}`;
  const yrs = Math.floor(months / 12);
  const rem = months % 12;
  return rem ? `${yrs}y ${rem}m` : `${yrs} year${yrs === 1 ? "" : "s"}`;
}

/** Deterministic case number from the project name — like a real casebook. */
function caseNumber(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return String(1000 + (h % 8999));
}

function FeaturedCase({ project, index }: { project: Project; index: number }) {
  const isActive = !project.endDate;
  const tags = parseTags(project.technologiesUsed);
  const visibleTags = tags.slice(0, 4);
  const hiddenTags = tags.slice(4);
  const tilt = index % 2 === 0 ? "tilt-right" : "tilt-left";

  return (
    <article className="case-card case-card--featured" data-reveal-item data-loupe-target>
      <header className="case-head">
        <span className="case-num">CASE No. {caseNumber(project.projectName)}</span>
        <span className={`case-stamp ${isActive ? "case-stamp--open" : "case-stamp--solved"} ${tilt}`}>
          {isActive ? "ON THE BOARD" : "SOLVED"}
        </span>
      </header>

      <h3 className="case-title">{project.projectName}</h3>
      <p className="case-logline">
        {formatDate(project.startDate)} &mdash; {project.endDate ? formatDate(project.endDate) : "Present"}
        <span className="case-logline-dot">&middot;</span>
        <span className="case-logline-span">{spanYears(project.startDate, project.endDate)}</span>
      </p>

      <p className="case-brief">{project.description}</p>

      <div className="case-tags">
        {visibleTags.map((tag) => (
          <span key={tag} className="case-tag">#{tag.toLowerCase().replace(/\s+/g, "-")}</span>
        ))}
      </div>

      {/* Revealed under the loupe / on hover (touch) — extra case detail. */}
      <div className="loupe-detail" aria-hidden="true">
        <div className="loupe-detail-label">Resolution</div>
        <p className="loupe-detail-text">
          {isActive
            ? `Active investigation. ${spanYears(project.startDate, project.endDate)} on the wire and counting.`
            : `Closed in ${spanYears(project.startDate, project.endDate)}. Filed and signed.`}
        </p>
        {hiddenTags.length > 0 && (
          <>
            <div className="loupe-detail-label">Full evidence</div>
            <div className="case-tags case-tags--all">
              {tags.map((tag) => (
                <span key={tag} className="case-tag">#{tag.toLowerCase().replace(/\s+/g, "-")}</span>
              ))}
            </div>
          </>
        )}
      </div>

      {project.projectUrl && (
        <a
          href={project.projectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="case-link"
          onClick={(e) => e.stopPropagation()}
        >
          Read the file
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      )}
    </article>
  );
}

function CompactCase({ project }: { project: Project }) {
  const isActive = !project.endDate;
  const tags = parseTags(project.technologiesUsed);
  return (
    <article className="case-card case-card--compact" data-reveal-item data-loupe-target>
      <header className="case-head">
        <span className="case-num">No. {caseNumber(project.projectName)}</span>
        <span className={`case-mini-status ${isActive ? "is-open" : "is-closed"}`}>
          {isActive ? "open" : "closed"}
        </span>
      </header>
      <h4 className="case-title case-title--sm">{project.projectName}</h4>
      <p className="case-brief case-brief--sm">{project.description}</p>
      <div className="case-tags">
        {tags.slice(0, 3).map((tag) => (
          <span key={tag} className="case-tag">#{tag.toLowerCase().replace(/\s+/g, "-")}</span>
        ))}
      </div>

      <div className="loupe-detail" aria-hidden="true">
        <div className="loupe-detail-label">Full evidence</div>
        <div className="case-tags case-tags--all">
          {tags.map((tag) => (
            <span key={tag} className="case-tag">#{tag.toLowerCase().replace(/\s+/g, "-")}</span>
          ))}
        </div>
        <p className="loupe-detail-text">
          {formatDate(project.startDate)} &mdash; {project.endDate ? formatDate(project.endDate) : "Present"}
          &nbsp;&middot;&nbsp; {spanYears(project.startDate, project.endDate)}
        </p>
      </div>
    </article>
  );
}

export default function Showcase() {
  const data = useOutletContext<ResumeData>();
  const casebookRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    document.title = "The Casebook — Ashlock Tech Solutions";
    return () => {
      document.title = "Ashlock Tech Solutions - Resume Portfolio";
    };
  }, []);

  const featured = data.projects.filter((p) => p.featured);
  const others = data.projects.filter((p) => !p.featured);
  const yrs = new Date().getFullYear() - 2016;

  return (
    <section className="casebook-section" ref={casebookRef}>
      <div className="container casebook-container">
        <header className="casebook-header">
          <span className="casebook-eyebrow">The Casebook</span>
          <h1 className="casebook-title">
            Solved, and worth <em>retelling.</em>
          </h1>
          <p className="casebook-subtitle">
            A private ledger of systems shipped, outages resolved, and quiet wins recorded across {yrs}+ years.
            Hover any file &mdash; the loupe will read the small print.
          </p>
          <div className="casebook-rule" aria-hidden="true" />
        </header>

        {featured.length > 0 && (
          <>
            <h2 className="casebook-chapter">
              <span className="casebook-chapter-num">I.</span> The Notable Files
            </h2>
            <Reveal staggerSelector="[data-reveal-item]" className="case-grid case-grid--featured">
              {featured.map((project, i) => (
                <FeaturedCase key={project.projectName} project={project} index={i} />
              ))}
            </Reveal>
          </>
        )}

        {others.length > 0 && (
          <>
            <h2 className="casebook-chapter">
              <span className="casebook-chapter-num">II.</span> The Wider Ledger
            </h2>
            <Reveal staggerSelector="[data-reveal-item]" className="case-grid case-grid--compact">
              {others.map((project) => (
                <CompactCase key={project.projectName} project={project} />
              ))}
            </Reveal>
          </>
        )}
      </div>

      <Loupe containerRef={casebookRef} />
    </section>
  );
}
