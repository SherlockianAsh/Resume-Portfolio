import { Link } from "react-router-dom";
import type { Profile, ResumeData } from "../types/resume";
import { humanizeKey } from "../utils";

interface StatItem {
  key: string;
  label: string;
  count: number;
  suffix: string;
}

/**
 * Auto-compute stats from ALL array sections in the resume data.
 * Known sections get friendly labels; unknown sections auto-label from key name.
 */
export function computeStats(data: ResumeData): StatItem[] {
  const labelMap: Record<string, string> = {
    experiences: "Years Experience",
    education: "Education",
    skills: "Skills",
    certifications: "Certifications",
    projects: "Projects",
  };

  // Keys that get a "+" suffix (implies "more than")
  const plusKeys = new Set(["experiences", "skills"]);

  const stats: StatItem[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (key === "profile") continue;
    if (!Array.isArray(value) || value.length === 0) continue;

    let count: number;
    if (key === "experiences") {
      // Calculate years from earliest non-internship startDate to now
      const fullTimeStart = "2016-08";
      const dates = (value as { startDate?: string }[])
        .map((e) => e.startDate)
        .filter((d): d is string => !!d && d >= fullTimeStart);
      if (dates.length > 0) {
        const earliest = new Date(dates.sort()[0] + "-01");
        count = Math.floor((Date.now() - earliest.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      } else {
        count = value.length;
      }
    } else {
      count = value.length;
    }

    stats.push({
      key,
      label: labelMap[key] || humanizeKey(key),
      count,
      suffix: plusKeys.has(key) ? "+" : "",
    });
  }

  return stats;
}

interface HeroProps {
  profile: Profile;
  stats: StatItem[];
}

export default function Hero({ profile, stats }: HeroProps) {
  // Split stats into rows: first 2 items, then remaining (max 3-4 per row)
  const row1 = stats.slice(0, 2);
  const row2 = stats.slice(2, 5);
  const row3 = stats.slice(5); // overflow if > 5 sections

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            {profile.profileImage ? (
              <img
                src={`${import.meta.env.BASE_URL}${profile.profileImage}`}
                alt={profile.fullName}
                className="hero-image"
              />
            ) : (
              <div className="hero-image-placeholder">
                {profile.fullName.charAt(0).toUpperCase()}
              </div>
            )}
            <h1 className="hero-name">{profile.fullName}</h1>
            <p className="hero-title">{profile.title}</p>
            <div className="hero-buttons">
              <Link to="/resume" className="hero-btn hero-btn-primary">
                View Resume
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          {row1.length > 0 && (
            <div className={`stats-row stats-row-${row1.length}`}>
              {row1.map((stat) => (
                <div className="stat-item" key={stat.key}>
                  <div className="stat-number">{stat.count}{stat.suffix}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
          {row2.length > 0 && (
            <div className={`stats-row stats-row-${row2.length}`}>
              {row2.map((stat) => (
                <div className="stat-item" key={stat.key}>
                  <div className="stat-number">{stat.count}{stat.suffix}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
          {row3.length > 0 && (
            <div className={`stats-row stats-row-${row3.length}`}>
              {row3.map((stat) => (
                <div className="stat-item" key={stat.key}>
                  <div className="stat-number">{stat.count}{stat.suffix}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
