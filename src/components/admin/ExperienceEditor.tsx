import type { Experience } from "../../types/resume";
import ArraySectionEditor, { type FieldConfig } from "./ArraySectionEditor";

const FIELDS: FieldConfig[] = [
  { key: "company", label: "Company" },
  { key: "position", label: "Position" },
  { key: "location", label: "Location" },
  { key: "startDate", label: "Start Date", placeholder: "YYYY-MM" },
  { key: "endDate", label: "End Date", placeholder: "YYYY-MM or leave empty for Present" },
  { key: "description", label: "Description", type: "textarea", placeholder: "Use - for bullet points" },
  { key: "displayOrder", label: "Display Order", placeholder: "1, 2, 3..." },
];

const createEmpty = (): Experience => ({
  company: "", position: "", location: "", startDate: "",
  endDate: null, description: "", displayOrder: 0,
});

interface Props {
  items: Experience[];
  onChange: (items: Experience[]) => void;
}

export default function ExperienceEditor({ items, onChange }: Props) {
  return (
    <ArraySectionEditor
      items={items}
      onChange={onChange}
      fields={FIELDS}
      createEmpty={createEmpty}
      itemLabel={(item) => item.position || item.company || "New Experience"}
    />
  );
}
