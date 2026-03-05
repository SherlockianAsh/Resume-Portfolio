import { useOutletContext } from "react-router-dom";
import type { ResumeData } from "../types/resume";
import Hero, { computeStats } from "../components/Hero";
import Summary from "../components/Summary";
import Contact from "../components/Contact";
import Experience from "../components/Experience";
import Education from "../components/Education";
import Skills from "../components/Skills";
import Certifications from "../components/Certifications";
import Projects from "../components/Projects";
import DynamicSection from "../components/DynamicSection";

/** Keys that have dedicated components — everything else is rendered dynamically */
const HANDLED_KEYS = new Set<string>([
  "profile",
  "experiences",
  "education",
  "skills",
  "certifications",
  "projects",
]);

export default function Landing() {
  const data = useOutletContext<ResumeData>();
  const stats = computeStats(data);

  // Collect unknown sections (arrays not in HANDLED_KEYS)
  const dynamicSections = Object.entries(data)
    .filter(([key, value]) => !HANDLED_KEYS.has(key) && Array.isArray(value) && value.length > 0)
    .map(([key, value]) => ({ key, items: value as Record<string, unknown>[] }));

  return (
    <>
      <Hero profile={data.profile} stats={stats} />
      {data.profile.summary && <Summary text={data.profile.summary} />}
      <Contact profile={data.profile} />
      <Experience items={data.experiences} />
      <Education items={data.education} />
      <Skills items={data.skills} />
      <Certifications items={data.certifications} />
      <Projects items={data.projects} />

      {/* Dynamic sections — any new arrays added to resume.json render here */}
      {dynamicSections.map(({ key, items }) => (
        <DynamicSection key={key} sectionKey={key} items={items} variant="landing" />
      ))}
    </>
  );
}
