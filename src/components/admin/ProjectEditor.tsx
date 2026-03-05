import type { Project } from "../../types/resume";
import ArraySectionEditor, { type FieldConfig } from "./ArraySectionEditor";

const FIELDS: FieldConfig[] = [
  { key: "projectName", label: "Project Name" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "technologiesUsed", label: "Technologies Used" },
  { key: "projectUrl", label: "Project URL", type: "url" },
  { key: "startDate", label: "Start Date", placeholder: "YYYY-MM" },
  { key: "endDate", label: "End Date", placeholder: "YYYY-MM or leave empty" },
];

const createEmpty = (): Project => ({
  projectName: "", description: "", technologiesUsed: "",
  projectUrl: null, startDate: "", endDate: null,
});

interface Props {
  items: Project[];
  onChange: (items: Project[]) => void;
}

export default function ProjectEditor({ items, onChange }: Props) {
  return (
    <ArraySectionEditor
      items={items}
      onChange={onChange}
      fields={FIELDS}
      createEmpty={createEmpty}
      itemLabel={(item) => item.projectName || "New Project"}
    />
  );
}
