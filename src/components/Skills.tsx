import type { Skill } from "../types/resume";

function groupByCategory(skills: Skill[]): Record<string, Skill[]> {
  const groups: Record<string, Skill[]> = {};
  for (const skill of skills) {
    if (!groups[skill.category]) groups[skill.category] = [];
    groups[skill.category].push(skill);
  }
  return groups;
}

function proficiencyClass(level: string): string {
  switch (level) {
    case "Expert": return "proficiency-expert";
    case "Advanced": return "proficiency-advanced";
    case "Intermediate": return "proficiency-intermediate";
    default: return "proficiency-beginner";
  }
}

export default function Skills({ items }: { items: Skill[] }) {
  if (items.length === 0) return null;
  const groups = groupByCategory(items);

  return (
    <section className="mv-section methods-section" id="methods">
      <div className="mv-inner">
        <div className="methods-header">
          <div>
            <span className="mv-kicker">// case file no. 02 — methods &amp; instruments</span>
            <h2 className="mv-section-title">
              The tools of <em>deduction.</em>
            </h2>
          </div>
          <p className="mv-section-sub">
            A working detective keeps a tidy kit. Here is mine — sharpened by use, not collected for show.
          </p>
        </div>

        <div className="methods-grid">
          {Object.entries(groups).map(([category, skills]) => (
            <div className="method-panel" key={category}>
              <span className="method-panel-title">/ {category}</span>
              {skills.map((skill, i) => (
                <div className="method-skill-item" data-reveal-item key={i}>
                  <span className="method-skill-name">{skill.skillName}</span>
                  <span className={`proficiency-badge ${proficiencyClass(skill.proficiencyLevel)}`}>
                    {skill.proficiencyLevel}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
