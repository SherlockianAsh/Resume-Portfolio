import type { Education as EducationType } from "../types/resume";
import { formatDateRange } from "../utils";

export default function Education({ items }: { items: EducationType[] }) {
  if (items.length === 0) return null;

  return (
    <section className="education-section">
      <div className="container">
        <div className="summary-content">
          <h2 className="section-title">Education</h2>
        </div>
        <div className="cards-container">
          {items.map((edu, i) => (
            <div className="entry-card" key={i}>
              <div className="entry-card-header">
                <h3 className="entry-card-title">
                  {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                </h3>
                <span className="entry-card-date">
                  {formatDateRange(edu.startDate, edu.endDate)}
                </span>
              </div>
              <p className="entry-card-subtitle">
                {edu.institution}{edu.location ? `, ${edu.location}` : ""}
              </p>
              {edu.description && (
                <p className="entry-card-description" style={{ whiteSpace: "pre-line" }}>
                  {edu.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
