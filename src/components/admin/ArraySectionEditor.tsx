import { useState } from "react";

export interface FieldConfig {
  key: string;
  label: string;
  type?: "text" | "textarea" | "select" | "url";
  options?: string[];
  placeholder?: string;
}

interface Props<T extends Record<string, unknown>> {
  items: T[];
  onChange: (items: T[]) => void;
  fields: FieldConfig[];
  createEmpty: () => T;
  itemLabel?: (item: T, index: number) => string;
}

export default function ArraySectionEditor<T extends Record<string, unknown>>({
  items,
  onChange,
  fields,
  createEmpty,
  itemLabel,
}: Props<T>) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const updateItem = (index: number, key: string, value: unknown) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [key]: value || null } : item
    );
    onChange(updated);
  };

  const addItem = () => {
    onChange([...items, createEmpty()]);
    setExpandedIndex(items.length);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
    setExpandedIndex(null);
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const updated = [...items];
    [updated[index], updated[target]] = [updated[target], updated[index]];
    onChange(updated);
    setExpandedIndex(target);
  };

  return (
    <div className="admin-array-editor">
      {items.map((item, index) => {
        const isExpanded = expandedIndex === index;
        const label = itemLabel
          ? itemLabel(item, index)
          : `Item ${index + 1}`;

        return (
          <div key={index} className="admin-array-item">
            <div
              className="admin-array-item-header"
              onClick={() => setExpandedIndex(isExpanded ? null : index)}
            >
              <span className="admin-array-item-title">
                {isExpanded ? "\u25BC" : "\u25B6"} {label}
              </span>
              <div className="admin-array-item-actions" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="admin-btn-icon"
                  onClick={() => moveItem(index, -1)}
                  disabled={index === 0}
                  title="Move up"
                >
                  &uarr;
                </button>
                <button
                  type="button"
                  className="admin-btn-icon"
                  onClick={() => moveItem(index, 1)}
                  disabled={index === items.length - 1}
                  title="Move down"
                >
                  &darr;
                </button>
                <button
                  type="button"
                  className="admin-btn-icon admin-btn-danger"
                  onClick={() => removeItem(index)}
                  title="Remove"
                >
                  &times;
                </button>
              </div>
            </div>

            {isExpanded && (
              <div className="admin-array-item-body">
                {fields.map((field) => (
                  <div className="admin-field" key={field.key}>
                    <label className="admin-label">{field.label}</label>
                    {field.type === "textarea" ? (
                      <textarea
                        className="admin-input admin-textarea"
                        value={(item[field.key] as string) ?? ""}
                        onChange={(e) => updateItem(index, field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={4}
                      />
                    ) : field.type === "select" ? (
                      <select
                        className="admin-input"
                        value={(item[field.key] as string) ?? ""}
                        onChange={(e) => updateItem(index, field.key, e.target.value)}
                      >
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        className="admin-input"
                        value={(item[field.key] as string) ?? ""}
                        onChange={(e) => updateItem(index, field.key, e.target.value)}
                        placeholder={field.placeholder}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <button type="button" className="admin-btn-add" onClick={addItem}>
        + Add Item
      </button>
    </div>
  );
}
