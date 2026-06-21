import { interpolateYears } from "../utils";

export default function Summary({ text }: { text: string }) {
  const rendered = interpolateYears(text);

  return (
    <section className="mv-section observation-section" id="about">
      <div className="mv-inner">
        <span className="mv-kicker">// case file no. 01 — the dossier</span>
        <h2 className="mv-section-title">
          Observation is a discipline. So is <em>clean code.</em>
        </h2>
        <div className="observation-prose">
          <p className="observation-text">{rendered}</p>
        </div>
      </div>
    </section>
  );
}
