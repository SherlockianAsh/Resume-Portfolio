import {
  humanizeKey,
  findTitleField,
  findDateRange,
  formatDateRange,
  formatFieldValue,
  isInternalKey,
  isDateKey,
  isUrlKey,
  isDescriptionKey,
  isSubtitleKey,
  parseDescription,
  isUrl,
} from "../utils";

interface DynamicSectionProps {
  sectionKey: string;
  items: Record<string, unknown>[];
  variant?: "landing" | "resume";
}

/**
 * Generic section renderer for dynamic/unknown sections.
 * Inspects field names and values to auto-format cards.
 *
 * Landing variant: styled cards with border-left accent.
 * Resume variant: ATS-friendly plain text entries.
 */
export default function DynamicSection({ sectionKey, items, variant = "landing" }: DynamicSectionProps) {
  if (!items || items.length === 0) return null;

  const sectionTitle = humanizeKey(sectionKey);

  if (variant === "resume") {
    return <ResumeDynamic sectionTitle={sectionTitle} items={items} />;
  }

  return <LandingDynamic sectionKey={sectionKey} sectionTitle={sectionTitle} items={items} />;
}

function LandingDynamic({
  sectionKey,
  sectionTitle,
  items,
}: {
  sectionKey: string;
  sectionTitle: string;
  items: Record<string, unknown>[];
}) {
  // Alternate background: even index sections get gray bg
  const bgClass = sectionKey.length % 2 === 0 ? "experience-section" : "education-section";

  return (
    <section className={bgClass}>
      <div className="container">
        <div className="summary-content">
          <h2 className="section-title">{sectionTitle}</h2>
        </div>
        <div className="cards-container">
          {items.map((item, i) => (
            <DynamicCard key={i} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DynamicCard({ item }: { item: Record<string, unknown> }) {
  const titleField = findTitleField(item);
  const dateRange = findDateRange(item);

  // Collect remaining fields (not title, not dates, not internal)
  const handledKeys = new Set<string>();
  if (titleField) handledKeys.add(titleField.key);
  if (dateRange) {
    for (const key of Object.keys(item)) {
      if (isDateKey(key)) handledKeys.add(key);
    }
  }

  // Group remaining fields by type
  const subtitles: { key: string; value: string }[] = [];
  const descriptions: { key: string; value: string }[] = [];
  const urls: { key: string; value: string }[] = [];
  const extras: { key: string; value: string }[] = [];

  for (const [key, value] of Object.entries(item)) {
    if (handledKeys.has(key) || isInternalKey(key) || value === null || value === undefined || value === "") continue;

    const strValue = formatFieldValue(key, value);
    if (!strValue) continue;

    if (isSubtitleKey(key)) {
      subtitles.push({ key, value: strValue });
    } else if (isDescriptionKey(key)) {
      descriptions.push({ key, value: String(value) });
    } else if (isUrlKey(key) || isUrl(value)) {
      urls.push({ key, value: strValue });
    } else {
      extras.push({ key, value: strValue });
    }
  }

  return (
    <div className="entry-card">
      <div className="entry-card-header">
        {titleField && <h3 className="entry-card-title">{titleField.value}</h3>}
        {dateRange && (
          <span className="entry-card-date">
            {formatDateRange(dateRange.start, dateRange.end)}
          </span>
        )}
      </div>

      {subtitles.map(({ key, value }) => (
        <p className="entry-card-subtitle" key={key}>{value}</p>
      ))}

      {descriptions.map(({ key, value }) => (
        <div
          className="entry-card-description"
          key={key}
          dangerouslySetInnerHTML={{ __html: parseDescription(value) }}
        />
      ))}

      {urls.map(({ key, value }) => (
        <div key={key} style={{ marginTop: "var(--space-2)" }}>
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "var(--text-sm)", color: "var(--primary)" }}
          >
            {humanizeKey(key)}
          </a>
        </div>
      ))}

      {extras.length > 0 && (
        <div style={{ marginTop: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--gray-600)" }}>
          {extras.map(({ key, value }) => (
            <div key={key}>
              <strong>{humanizeKey(key)}:</strong> {value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ResumeDynamic({
  sectionTitle,
  items,
}: {
  sectionTitle: string;
  items: Record<string, unknown>[];
}) {
  return (
    <section className="resume-section">
      <h2 className="resume-section-title">{sectionTitle}</h2>
      {items.map((item, i) => {
        const titleField = findTitleField(item);
        const dateRange = findDateRange(item);

        const handledKeys = new Set<string>();
        if (titleField) handledKeys.add(titleField.key);
        if (dateRange) {
          for (const key of Object.keys(item)) {
            if (isDateKey(key)) handledKeys.add(key);
          }
        }

        return (
          <div className="resume-entry" key={i}>
            <div className="resume-entry-header">
              {titleField && <h3 className="resume-entry-title">{titleField.value}</h3>}
              {dateRange && (
                <span className="resume-entry-date">
                  {formatDateRange(dateRange.start, dateRange.end)}
                </span>
              )}
            </div>
            {Object.entries(item).map(([key, value]) => {
              if (handledKeys.has(key) || isInternalKey(key) || value === null || value === undefined || value === "") return null;

              const strValue = formatFieldValue(key, value);
              if (!strValue) return null;

              if (isDescriptionKey(key)) {
                return (
                  <div
                    className="resume-entry-description"
                    key={key}
                    dangerouslySetInnerHTML={{ __html: parseDescription(String(value)) }}
                  />
                );
              }

              if (isSubtitleKey(key)) {
                return <p className="resume-entry-subtitle" key={key}>{strValue}</p>;
              }

              if (isUrlKey(key) || isUrl(value)) return null; // Skip URLs in ATS view

              return (
                <p className="resume-entry-description" key={key}>
                  <strong>{humanizeKey(key)}:</strong> {strValue}
                </p>
              );
            })}
          </div>
        );
      })}
    </section>
  );
}
