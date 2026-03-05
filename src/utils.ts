const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Format "2023-08" → "Aug 2023" */
export function formatMonth(dateStr: string): string {
  const [year, month] = dateStr.split("-");
  const monthIndex = parseInt(month, 10) - 1;
  return `${MONTH_NAMES[monthIndex]} ${year}`;
}

/** Format date range: "Aug 2023 - Present" or "Aug 2023 - Nov 2024" */
export function formatDateRange(start: string, end: string | null): string {
  const startFormatted = formatMonth(start);
  if (!end) return `${startFormatted} - Present`;
  return `${startFormatted} - ${formatMonth(end)}`;
}

/**
 * Parse description text into HTML.
 * Lines starting with "- " become <li>, others become <p>.
 */
export function parseDescription(text: string): string {
  const lines = text.split("\n");
  let html = "";
  let inList = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith("- ") || line.startsWith("* ")) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${escapeHtml(line.slice(2))}</li>`;
    } else if (line) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += `<p>${escapeHtml(line)}</p>`;
    }
  }
  if (inList) html += "</ul>";
  return html;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// =====================================================
// Dynamic field detection utilities
// =====================================================

/** Convert camelCase/snake_case key to human-readable label */
export function humanizeKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")       // camelCase → spaced
    .replace(/[_-]/g, " ")            // snake_case → spaced
    .replace(/\b\w/g, (c) => c.toUpperCase()) // capitalize words
    .trim();
}

/** Convert camelCase key to kebab-case for CSS class names */
export function kebabCase(key: string): string {
  return key
    .replace(/([A-Z])/g, "-$1")
    .replace(/[_\s]/g, "-")
    .toLowerCase()
    .replace(/^-/, "");
}

/** Check if a string looks like a date (YYYY-MM or YYYY-MM-DD) */
export function isDateString(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}(-\d{2})?$/.test(value);
}

/** Check if a string looks like a URL */
export function isUrl(value: unknown): value is string {
  return typeof value === "string" && /^https?:\/\//.test(value);
}

/** Check if a key name suggests it contains a date */
export function isDateKey(key: string): boolean {
  const lower = key.toLowerCase();
  return lower.includes("date") || lower === "year" || lower === "period";
}

/** Check if a key name suggests it contains a URL/link */
export function isUrlKey(key: string): boolean {
  const lower = key.toLowerCase();
  return lower.includes("url") || lower.includes("link") || lower.includes("website");
}

/** Check if a key name suggests it's a description/body field */
export function isDescriptionKey(key: string): boolean {
  const lower = key.toLowerCase();
  return lower.includes("description") || lower.includes("details") || lower.includes("body") || lower.includes("content");
}

/** Check if a key name suggests it's a title/name field (used as card heading) */
export function isTitleKey(key: string): boolean {
  const lower = key.toLowerCase();
  return lower.includes("name") || lower.includes("title") || lower === "role" || lower === "position" || lower === "company" || lower === "institution";
}

/** Check if a key name suggests it's a subtitle/org field */
export function isSubtitleKey(key: string): boolean {
  const lower = key.toLowerCase();
  return lower.includes("org") || lower.includes("company") || lower.includes("institution") || lower.includes("issuer") || lower.includes("location");
}

/** Keys to skip in dynamic rendering (internal/display-only) */
export function isInternalKey(key: string): boolean {
  const lower = key.toLowerCase();
  return lower === "displayorder" || lower === "display_order" || lower === "id";
}

/**
 * Smart format a field value based on its key name and value type.
 * Returns a string suitable for display.
 */
export function formatFieldValue(_key: string, value: unknown): string {
  if (value === null || value === undefined) return "";

  // Date fields
  if (isDateString(value)) {
    return formatMonth(value);
  }

  // Arrays → comma-separated
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return String(value);
}

/**
 * Find the best "title" field from a record.
 * Looks for keys containing "name" or "title", returns the first match.
 */
export function findTitleField(record: Record<string, unknown>): { key: string; value: string } | null {
  // Priority: *Name > *Title > first string field
  const titlePriority = ["name", "title", "role", "position"];

  for (const priority of titlePriority) {
    for (const [k, v] of Object.entries(record)) {
      if (k.toLowerCase().includes(priority) && typeof v === "string" && v) {
        return { key: k, value: v };
      }
    }
  }

  // Fallback: first non-empty string field
  for (const [k, v] of Object.entries(record)) {
    if (typeof v === "string" && v && !isInternalKey(k)) {
      return { key: k, value: v };
    }
  }

  return null;
}

/**
 * Find date range fields from a record.
 * Returns { start, end } if both startDate and endDate exist.
 */
export function findDateRange(record: Record<string, unknown>): { start: string; end: string | null } | null {
  const startKey = Object.keys(record).find((k) => k.toLowerCase().includes("start") && isDateKey(k));
  const endKey = Object.keys(record).find((k) => k.toLowerCase().includes("end") && isDateKey(k));

  if (startKey && typeof record[startKey] === "string") {
    return {
      start: record[startKey] as string,
      end: endKey && typeof record[endKey] === "string" ? (record[endKey] as string) : null,
    };
  }
  return null;
}
