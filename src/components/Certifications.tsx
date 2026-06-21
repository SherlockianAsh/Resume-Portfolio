import type { Certification } from "../types/resume";
import { formatMonth } from "../utils";

export default function Certifications({ items }: { items: Certification[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mv-section accreditations-section" id="accreditations">
      <div className="mv-inner">
        <span className="mv-kicker">// accreditations</span>
        <h2 className="mv-section-title">
          Verified <em>credentials.</em>
        </h2>

        <div className="accreditations-grid">
          {items.map((cert, i) => (
            <div className="accreditation-card" key={i}>
              <h3 className="accreditation-name">{cert.certName}</h3>
              <span className="accreditation-org">{cert.issuingOrg}</span>
              {cert.issueDate && (
                <span className="accreditation-date">{formatMonth(cert.issueDate)}</span>
              )}
              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="accreditation-link"
                >
                  View credential →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
