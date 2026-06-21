import type { Education as EducationType } from "../types/resume";
import { formatDateRange } from "../utils";

export default function Education({ items }: { items: EducationType[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mv-section credentials-section" id="credentials">
      <div className="mv-inner">
        <span className="mv-kicker">// case file no. 04 — credentials</span>
        <h2 className="mv-section-title">
          Formal <em>foundations.</em>
        </h2>

        <div className="credentials-entries">
          {items.map((edu, i) => (
            <div className="credentials-entry" key={i}>
              <div className="credentials-meta">
                <span className="credentials-date">
                  {formatDateRange(edu.startDate, edu.endDate)}
                </span>
                <span className="credentials-institution">{edu.institution}</span>
                {edu.location && (
                  <span className="credentials-institution" style={{ opacity: 0.6 }}>
                    {edu.location}
                  </span>
                )}
              </div>
              <div className="credentials-body">
                <h3 className="credentials-degree">
                  {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                </h3>
                {edu.description && (
                  <p className="credentials-desc">{edu.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
