import { useState, useEffect, useCallback } from "react";
import type { ResumeData } from "../types/resume";
import { updateJsonBin } from "../services/github";
import AdminLayout, { type TabKey } from "../components/admin/AdminLayout";
import ProfileEditor from "../components/admin/ProfileEditor";
import ExperienceEditor from "../components/admin/ExperienceEditor";
import EducationEditor from "../components/admin/EducationEditor";
import SkillEditor from "../components/admin/SkillEditor";
import CertificationEditor from "../components/admin/CertificationEditor";
import ProjectEditor from "../components/admin/ProjectEditor";

const JSONBIN_BIN_ID = import.meta.env.VITE_JSONBIN_BIN_ID;
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`;
const MASTER_KEY_STORAGE = "jsonbin_master_key";

function useMasterKey() {
  const [key, setKey] = useState<string>(() => sessionStorage.getItem(MASTER_KEY_STORAGE) ?? "");
  const saveKey = (value: string) => {
    sessionStorage.setItem(MASTER_KEY_STORAGE, value);
    setKey(value);
  };
  return { key, saveKey };
}

export default function Admin() {
  const { key: masterKey, saveKey } = useMasterKey();
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [data, setData] = useState<ResumeData | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(JSONBIN_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json.record as ResumeData);
      setDirty(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (masterKey) loadData();
  }, [masterKey, loadData]);

  const updateData = (partial: Partial<ResumeData>) => {
    if (!data) return;
    setData({ ...data, ...partial });
    setDirty(true);
    setSuccess(null);
  };

  const handleSave = async () => {
    if (!data || !masterKey) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateJsonBin(masterKey, data);
      setDirty(false);
      setSuccess("Saved to JSONBin! Changes are live immediately.");
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
      pat={masterKey}
      onPatChange={saveKey}
      dirty={dirty}
      saving={saving}
      onSave={handleSave}
    >
      {error && <div className="admin-message admin-error">{error}</div>}
      {success && <div className="admin-message admin-success">{success}</div>}

      {loading && <p className="admin-loading">Loading resume data from JSONBin...</p>}

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
