import type { Skill } from "../../types/resume";
import ArraySectionEditor, { type FieldConfig } from "./ArraySectionEditor";

const FIELDS: FieldConfig[] = [
  { key: "skillName", label: "Skill Name" },
  { key: "category", label: "Category" },
  {
    key: "proficiencyLevel",
    label: "Proficiency",
    type: "select",
    options: ["Beginner", "Intermediate", "Advanced", "Expert"],
  },
];

const createEmpty = (): Skill => ({
  skillName: "", category: "", proficiencyLevel: "Intermediate",
});

interface Props {
  items: Skill[];
  onChange: (items: Skill[]) => void;
}

export default function SkillEditor({ items, onChange }: Props) {
  return (
    <ArraySectionEditor
      items={items}
      onChange={onChange}
      fields={FIELDS}
      createEmpty={createEmpty}
      itemLabel={(item) => item.skillName || "New Skill"}
    />
  );
}
