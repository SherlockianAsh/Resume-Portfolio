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
    <section className="skills-section">
      <div className="container">
        <div className="summary-content">
          <h2 className="section-title">Skills</h2>
        </div>
        <div className="skills-grid">
          {Object.entries(groups).map(([category, skills]) => (
            <div className="skill-category" key={category}>
              <h3 className="skill-category-title">{category}</h3>
              {skills.map((skill, i) => (
                <div className="skill-item" key={i}>
                  <span className="skill-name">{skill.skillName}</span>
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
