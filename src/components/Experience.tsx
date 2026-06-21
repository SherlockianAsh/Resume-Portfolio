import type { Experience as ExperienceType } from "../types/resume";
import { formatDateRange, parseDescription } from "../utils";

export default function Experience({ items }: { items: ExperienceType[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mv-section history-section" id="history">
      <div className="mv-inner">
        <span className="mv-kicker">// case file no. 03 — case history</span>
        <h2 className="mv-section-title">
          A record of <em>prior engagements.</em>
        </h2>

        <div className="history-entries">
          {items.map((exp, i) => (
            <div className="history-entry" key={i}>
              <div className="history-meta">
                <span className="history-date">
                  {formatDateRange(exp.startDate, exp.endDate)}
                </span>
                {!exp.endDate && (
                  <span className="history-status">Active case</span>
                )}
              </div>
              <div className="history-body">
                <div className="history-entry-header">
                  <h3 className="history-title">{exp.position}</h3>
                  <span className="history-org">{exp.company}</span>
                  {exp.location && (
                    <span className="history-location">{exp.location}</span>
                  )}
                </div>
                {exp.description && (
                  <div
                    className="history-desc"
                    dangerouslySetInnerHTML={{ __html: parseDescription(exp.description) }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
