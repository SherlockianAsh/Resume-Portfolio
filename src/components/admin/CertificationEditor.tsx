import type { Certification } from "../../types/resume";
import ArraySectionEditor, { type FieldConfig } from "./ArraySectionEditor";

const FIELDS: FieldConfig[] = [
  { key: "certName", label: "Certification Name" },
  { key: "issuingOrg", label: "Issuing Organization" },
  { key: "issueDate", label: "Issue Date", placeholder: "YYYY-MM" },
  { key: "expiryDate", label: "Expiry Date", placeholder: "YYYY-MM or leave empty" },
  { key: "credentialUrl", label: "Credential URL", type: "url" },
];

const createEmpty = (): Certification => ({
  certName: "", issuingOrg: "", issueDate: "",
  expiryDate: null, credentialUrl: null,
});

interface Props {
  items: Certification[];
  onChange: (items: Certification[]) => void;
}

export default function CertificationEditor({ items, onChange }: Props) {
  return (
    <ArraySectionEditor
      items={items}
      onChange={onChange}
      fields={FIELDS}
      createEmpty={createEmpty}
      itemLabel={(item) => item.certName || "New Certification"}
    />
  );
}
