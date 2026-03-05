import type { Education } from "../../types/resume";
import ArraySectionEditor, { type FieldConfig } from "./ArraySectionEditor";

const FIELDS: FieldConfig[] = [
  { key: "institution", label: "Institution" },
  { key: "degree", label: "Degree" },
  { key: "fieldOfStudy", label: "Field of Study" },
  { key: "location", label: "Location" },
  { key: "startDate", label: "Start Date", placeholder: "YYYY-MM" },
  { key: "endDate", label: "End Date", placeholder: "YYYY-MM" },
  { key: "description", label: "Description", type: "textarea" },
];

const createEmpty = (): Education => ({
  institution: "", degree: "", fieldOfStudy: "", location: "",
  startDate: "", endDate: "", description: null,
});

interface Props {
  items: Education[];
  onChange: (items: Education[]) => void;
}

export default function EducationEditor({ items, onChange }: Props) {
  return (
    <ArraySectionEditor
      items={items}
      onChange={onChange}
      fields={FIELDS}
      createEmpty={createEmpty}
      itemLabel={(item) => item.degree || item.institution || "New Education"}
    />
  );
}
