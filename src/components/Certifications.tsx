import type { Certification } from "../types/resume";
import { formatMonth } from "../utils";

export default function Certifications({ items }: { items: Certification[] }) {
  if (items.length === 0) return null;

  return (
    <section className="certifications-section">
      <div className="container">
        <div className="summary-content">
          <h2 className="section-title">Certifications</h2>
        </div>
        <div className="cards-container">
          {items.map((cert, i) => (
            <div className="entry-card" key={i}>
              <div className="entry-card-header">
                <h3 className="entry-card-title">{cert.certName}</h3>
                {cert.issueDate && (
                  <span className="entry-card-date">{formatMonth(cert.issueDate)}</span>
                )}
              </div>
              <p className="entry-card-subtitle">{cert.issuingOrg}</p>
              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "var(--text-sm)", color: "var(--primary)" }}
                >
                  View Credential
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
