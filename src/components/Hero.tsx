import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createScope, createTimeline } from "animejs";
import type { Profile, ResumeData } from "../types/resume";
import { humanizeKey } from "../utils";
import { useAuth } from "../auth/AuthContext";
import { useCountUp } from "../hooks/useCountUp";
import Typewriter from "./Typewriter";
import Kanta from "./Kanta";
import { prefersReducedMotion } from "../lib/motion";
import "../styles/kanta.css";

/** Single stat cell — count-up animates 0 → count when scrolled into view. */
function StatNumber({ count, suffix }: { count: number; suffix: string }) {
  const { ref, value } = useCountUp(count);
  return (
    <div ref={ref} className="stat-number">
      {value}
      {suffix}
    </div>
  );
}

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
  const navigate = useNavigate();
  const { user, isAdmin, login } = useAuth();
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [showLogin, setShowLogin] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Choreographed entrance: image glows in, then name, then CTA.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const scope = createScope({ root: heroRef }).add(() => {
      const tl = createTimeline({ defaults: { ease: "out(3)" } });
      tl.add(".hero-image, .hero-image-placeholder", {
        opacity: [0, 1],
        scale: [0.82, 1],
        duration: 720,
      })
        .add(".hero-name", { opacity: [0, 1], translateY: [22, 0], duration: 520 }, "-=420")
        .add(".hero-buttons", { opacity: [0, 1], translateY: [16, 0], duration: 420 }, "-=240");
    });
    return () => scope.revert();
  }, []);

  const handleImageClick = () => {
    clickCount.current++;
    clearTimeout(clickTimer.current);
    if (clickCount.current >= 5) {
      clickCount.current = 0;
      if (user && isAdmin) {
        navigate("/admin");
      } else {
        setShowLogin(true);
      }
      return;
    }
    clickTimer.current = setTimeout(() => { clickCount.current = 0; }, 1500);
  };

  const handleLogin = async () => {
    setLoginError(null);
    try {
      await login();
      setShowLogin(false);
      navigate("/admin");
    } catch {
      setLoginError("Sign-in failed. Please try again.");
    }
  };

  // Split stats into rows: first 2 items, then remaining (max 3-4 per row)
  const row1 = stats.slice(0, 2);
  const row2 = stats.slice(2, 5);
  const row3 = stats.slice(5); // overflow if > 5 sections

  return (
    <>
      <section className="hero" ref={heroRef}>
        <div className="container">
          <div className="hero-content">
            <p className="hero-kicker">Case File · Engineering Dossier</p>
            <div className="hero-portrait" onClick={handleImageClick}>
              {profile.profileImage ? (
                <>
                  <img
                    src={`${import.meta.env.BASE_URL}${profile.profileImage}`}
                    alt={profile.fullName}
                    className="hero-image"
                    data-anim
                  />
                  <Kanta src={`${import.meta.env.BASE_URL}${profile.profileImage}`} />
                </>
              ) : (
                <div className="hero-image-placeholder" data-anim>
                  {profile.fullName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h1 className="hero-name" data-anim>{profile.fullName}</h1>
            {profile.title && (
              <p className="hero-title">
                <Typewriter text={profile.title} />
              </p>
            )}
            <div className="hero-buttons" data-anim>
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
                  <StatNumber count={stat.count} suffix={stat.suffix} />
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
          {row2.length > 0 && (
            <div className={`stats-row stats-row-${row2.length}`}>
              {row2.map((stat) => (
                <div className="stat-item" key={stat.key}>
                  <StatNumber count={stat.count} suffix={stat.suffix} />
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
          {row3.length > 0 && (
            <div className={`stats-row stats-row-${row3.length}`}>
              {row3.map((stat) => (
                <div className="stat-item" key={stat.key}>
                  <StatNumber count={stat.count} suffix={stat.suffix} />
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {showLogin && (
        <div className="modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowLogin(false)}>&times;</button>
            <div className="modal-header">
              <div className="modal-logo">
                {profile.fullName.charAt(0).toUpperCase()}
              </div>
              <h2 className="modal-title">Admin Login</h2>
              <p className="modal-subtitle">Sign in to manage your resume</p>
            </div>
            {loginError && <p className="admin-error">{loginError}</p>}
            <button className="admin-btn admin-btn-google" onClick={handleLogin} style={{ width: "100%" }}>
              Sign in with Google
            </button>
          </div>
        </div>
      )}
    </>
  );
}
