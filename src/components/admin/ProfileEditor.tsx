import type { Profile } from "../../types/resume";

interface Props {
  profile: Profile;
  onChange: (profile: Profile) => void;
}

const FIELDS: { key: keyof Profile; label: string; type?: "textarea" }[] = [
  { key: "fullName", label: "Full Name" },
  { key: "title", label: "Job Title" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "location", label: "Location" },
  { key: "linkedinUrl", label: "LinkedIn URL" },
  { key: "githubUrl", label: "GitHub URL" },
  { key: "profileImage", label: "Profile Image Path" },
  { key: "summary", label: "Professional Summary", type: "textarea" },
];

export default function ProfileEditor({ profile, onChange }: Props) {
  const update = (key: keyof Profile, value: string) => {
    onChange({ ...profile, [key]: value });
  };

  return (
    <div className="admin-profile-editor">
      {FIELDS.map(({ key, label, type }) => (
        <div className="admin-field" key={key}>
          <label className="admin-label">{label}</label>
          {type === "textarea" ? (
            <textarea
              className="admin-input admin-textarea"
              value={(profile[key] as string) ?? ""}
              onChange={(e) => update(key, e.target.value)}
              rows={5}
            />
          ) : (
            <input
              type="text"
              className="admin-input"
              value={(profile[key] as string) ?? ""}
              onChange={(e) => update(key, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
