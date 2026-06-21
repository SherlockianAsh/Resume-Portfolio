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
import Reveal from "../components/Reveal";

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
      {data.profile.summary && (
        <Reveal>
          <Summary text={data.profile.summary} />
        </Reveal>
      )}
      <Reveal>
        <Contact profile={data.profile} />
      </Reveal>
      <Reveal>
        <Experience items={data.experiences} />
      </Reveal>
      <Reveal>
        <Education items={data.education} />
      </Reveal>
      <Reveal staggerSelector="[data-reveal-item]">
        <Skills items={data.skills} />
      </Reveal>
      <Reveal>
        <Certifications items={data.certifications} />
      </Reveal>
      <Reveal>
        <Projects items={data.projects} />
      </Reveal>

      {/* Dynamic sections — any new arrays added to resume.json render here */}
      {dynamicSections.map(({ key, items }) => (
        <Reveal key={key}>
          <DynamicSection sectionKey={key} items={items} variant="landing" />
        </Reveal>
      ))}
    </>
  );
}
