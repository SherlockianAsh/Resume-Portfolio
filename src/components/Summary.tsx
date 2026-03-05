import { interpolateYears } from "../utils";

export default function Summary({ text }: { text: string }) {
  const rendered = interpolateYears(text);

  return (
    <section className="summary-section">
      <div className="container">
        <div className="summary-content">
          <h2 className="section-title">Professional Summary</h2>
          <p className="summary-text">{rendered}</p>
        </div>
      </div>
    </section>
  );
}
