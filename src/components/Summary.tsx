export default function Summary({ text }: { text: string }) {
  return (
    <section className="summary-section">
      <div className="container">
        <div className="summary-content">
          <h2 className="section-title">Professional Summary</h2>
          <p className="summary-text">{text}</p>
        </div>
      </div>
    </section>
  );
}
