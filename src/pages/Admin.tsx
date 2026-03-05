import { useState, useEffect, useCallback } from "react";
import type { ResumeData } from "../types/resume";
import { fetchResumeFromGitHub, commitResumeToGitHub } from "../services/github";
import { useGitHubPat } from "../hooks/useGitHubPat";
import AdminLayout, { type TabKey } from "../components/admin/AdminLayout";
import ProfileEditor from "../components/admin/ProfileEditor";
import ExperienceEditor from "../components/admin/ExperienceEditor";
import EducationEditor from "../components/admin/EducationEditor";
import SkillEditor from "../components/admin/SkillEditor";
import CertificationEditor from "../components/admin/CertificationEditor";
import ProjectEditor from "../components/admin/ProjectEditor";

export default function Admin() {
  const { pat, savePat } = useGitHubPat();
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [data, setData] = useState<ResumeData | null>(null);
  const [sha, setSha] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadData = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchResumeFromGitHub(token);
      setData(result.data as ResumeData);
      setSha(result.sha);
      setDirty(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (pat) loadData(pat);
  }, [pat, loadData]);

  const handlePatChange = (value: string) => {
    savePat(value);
  };

  const updateData = (partial: Partial<ResumeData>) => {
    if (!data) return;
    setData({ ...data, ...partial });
    setDirty(true);
    setSuccess(null);
  };

  const handleSave = async () => {
    if (!data || !pat) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await commitResumeToGitHub(pat, data, sha);
      // Re-fetch to get new SHA
      const result = await fetchResumeFromGitHub(pat);
      setSha(result.sha);
      setDirty(false);
      setSuccess("Saved! GitHub Pages will rebuild shortly.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      pat={pat}
      onPatChange={handlePatChange}
      dirty={dirty}
      saving={saving}
      onSave={handleSave}
    >
      {error && <div className="admin-message admin-error">{error}</div>}
      {success && <div className="admin-message admin-success">{success}</div>}

      {loading && <p className="admin-loading">Loading resume data from GitHub...</p>}

      {data && (
        <>
          {activeTab === "profile" && (
            <ProfileEditor
              profile={data.profile}
              onChange={(profile) => updateData({ profile })}
            />
          )}
          {activeTab === "experience" && (
            <ExperienceEditor
              items={data.experiences}
              onChange={(experiences) => updateData({ experiences })}
            />
          )}
          {activeTab === "education" && (
            <EducationEditor
              items={data.education}
              onChange={(education) => updateData({ education })}
            />
          )}
          {activeTab === "skills" && (
            <SkillEditor
              items={data.skills}
              onChange={(skills) => updateData({ skills })}
            />
          )}
          {activeTab === "certifications" && (
            <CertificationEditor
              items={data.certifications}
              onChange={(certifications) => updateData({ certifications })}
            />
          )}
          {activeTab === "projects" && (
            <ProjectEditor
              items={data.projects}
              onChange={(projects) => updateData({ projects })}
            />
          )}
        </>
      )}
    </AdminLayout>
  );
}
