import type { Experience as ExperienceType } from "../types/resume";
import { formatDateRange, parseDescription } from "../utils";

export default function Experience({ items }: { items: ExperienceType[] }) {
  if (items.length === 0) return null;

  return (
    <section className="experience-section">
      <div className="container">
        <div className="summary-content">
          <h2 className="section-title">Work Experience</h2>
        </div>
        <div className="cards-container">
          {items.map((exp, i) => (
            <div className="entry-card" key={i}>
              <div className="entry-card-header">
                <h3 className="entry-card-title">{exp.position}</h3>
                <span className="entry-card-date">
                  {formatDateRange(exp.startDate, exp.endDate)}
                </span>
              </div>
              <p className="entry-card-subtitle">
                {exp.company}{exp.location ? `, ${exp.location}` : ""}
              </p>
              {exp.description && (
                <div
                  className="entry-card-description"
                  dangerouslySetInnerHTML={{ __html: parseDescription(exp.description) }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
