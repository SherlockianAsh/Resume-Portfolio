import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const TABS = [
  { key: "profile", label: "Profile" },
  { key: "experience", label: "Experience" },
  { key: "education", label: "Education" },
  { key: "skills", label: "Skills" },
  { key: "certifications", label: "Certifications" },
  { key: "projects", label: "Projects" },
] as const;

export type TabKey = (typeof TABS)[number]["key"];

interface Props {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  pat: string;
  onPatChange: (pat: string) => void;
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  children: ReactNode;
}

export default function AdminLayout({
  activeTab,
  onTabChange,
  pat,
  onPatChange,
  dirty,
  saving,
  onSave,
  children,
}: Props) {
  const { user, logout } = useAuth();

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="admin-header-left">
          <h1 className="admin-title">Resume Admin</h1>
          <Link to="/" className="admin-link">View Site</Link>
        </div>
        <div className="admin-header-right">
          <span className="admin-user">{user?.email}</span>
          <button className="admin-btn admin-btn-secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {!pat && (
        <div className="admin-pat-banner">
          <label className="admin-label">GitHub Personal Access Token</label>
          <div className="admin-pat-input-row">
            <input
              type="password"
              className="admin-input"
              placeholder="ghp_... (needs repo or Contents read/write scope)"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onPatChange((e.target as HTMLInputElement).value);
                }
              }}
            />
            <button
              className="admin-btn"
              onClick={(e) => {
                const input = (e.target as HTMLElement)
                  .closest(".admin-pat-input-row")
                  ?.querySelector("input");
                if (input?.value) onPatChange(input.value);
              }}
            >
              Connect
            </button>
          </div>
          <p className="admin-pat-hint">
            PAT is stored in sessionStorage only — cleared when you close the tab.
          </p>
        </div>
      )}

      {pat && (
        <>
          <nav className="admin-tabs">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                className={`admin-tab ${activeTab === key ? "admin-tab-active" : ""}`}
                onClick={() => onTabChange(key)}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="admin-content">
            {children}
          </div>

          <footer className="admin-footer">
            <button
              className="admin-btn"
              onClick={onSave}
              disabled={!dirty || saving}
            >
              {saving ? "Saving..." : dirty ? "Save Changes" : "No Changes"}
            </button>
          </footer>
        </>
      )}
    </div>
  );
}
