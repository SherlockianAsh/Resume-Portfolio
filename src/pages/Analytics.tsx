import { useEffect, useState } from "react";

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
}

interface GitHubStats {
  publicRepos: number;
  totalStars: number;
  totalForks: number;
  topRepos: GitHubRepo[];
  languages: Record<string, number>;
}

const GITHUB_USER = "SherlockianAsh";

const LANG_COLORS: Record<string, string> = {
  "C#": "#178600",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  PHP: "#4F5D95",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Dart: "#00B4AB",
  Vue: "#41b883",
};

function useGitHubStats() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchStats() {
      try {
        const cacheKey = `github_stats_${GITHUB_USER}`;
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached) as GitHubStats;
          if (!cancelled) { setStats(parsed); setLoading(false); }
          return;
        }

        const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`);
        if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
        const repos: GitHubRepo[] = await res.json();

        if (cancelled) return;

        const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
        const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);
        const languages: Record<string, number> = {};
        for (const r of repos) {
          if (r.language) languages[r.language] = (languages[r.language] || 0) + 1;
        }

        const topRepos = [...repos]
          .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          .slice(0, 6);

        const result: GitHubStats = { publicRepos: repos.length, totalStars, totalForks, topRepos, languages };
        try { sessionStorage.setItem(cacheKey, JSON.stringify(result)); } catch { /* quota exceeded — ignore */ }
        setStats(result);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchStats();
    return () => { cancelled = true; };
  }, []);

  return { stats, loading, error };
}

export default function Analytics() {
  const { stats, loading, error } = useGitHubStats();

  useEffect(() => {
    document.title = "Analytics — Ashlock Tech Solutions";
    return () => {
      document.title = "Ashlock Tech Solutions - Resume Portfolio";
    };
  }, []);

  return (
    <section className="analytics-section">
      <div className="container">
        <div className="analytics-header">
          <h1 className="section-title">Analytics</h1>
          <p className="analytics-subtitle">
            GitHub activity and site statistics — open and transparent.
          </p>
        </div>

        {/* GitHub Stats */}
        <div className="github-section">
          <h2 className="github-section-title">
            <svg className="github-section-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
            </svg>
            GitHub Activity
          </h2>

          {loading && <div className="analytics-loading">Loading GitHub stats...</div>}

          {error && (
            <div className="analytics-error">
              <p>Could not load GitHub data. Rate limit may apply.</p>
            </div>
          )}

          {stats && (
            <>
              <div className="github-stats-grid">
                <div className="github-stat-card">
                  <div className="github-stat-value">{stats.publicRepos}</div>
                  <div className="github-stat-label">Public Repos</div>
                </div>
                <div className="github-stat-card">
                  <div className="github-stat-value">{stats.totalStars}</div>
                  <div className="github-stat-label">Total Stars</div>
                </div>
                <div className="github-stat-card">
                  <div className="github-stat-value">{stats.totalForks}</div>
                  <div className="github-stat-label">Total Forks</div>
                </div>
                <div className="github-stat-card">
                  <div className="github-stat-value">{Object.keys(stats.languages).length}</div>
                  <div className="github-stat-label">Languages</div>
                </div>
              </div>

              {stats.topRepos.length > 0 && (
                <div className="top-repos-grid">
                  {stats.topRepos.map((repo) => (
                    <a
                      key={repo.name}
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="repo-card"
                    >
                      <div className="repo-name">{repo.name}</div>
                      <div className="repo-desc">{repo.description || "No description"}</div>
                      <div className="repo-meta">
                        {repo.language && (
                          <span className="repo-meta-item">
                            <span
                              className="repo-lang-dot"
                              style={{ background: LANG_COLORS[repo.language] || "#8b8b8b" }}
                            />
                            {repo.language}
                          </span>
                        )}
                        {repo.stargazers_count > 0 && (
                          <span className="repo-meta-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            {repo.stargazers_count}
                          </span>
                        )}
                        {repo.forks_count > 0 && (
                          <span className="repo-meta-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="18" r="3" />
                              <circle cx="6" cy="6" r="3" />
                              <circle cx="18" cy="6" r="3" />
                              <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9" />
                              <path d="M12 12v3" />
                            </svg>
                            {repo.forks_count}
                          </span>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Site Analytics — GoatCounter */}
        <div className="site-analytics-section">
          <h2 className="github-section-title">
            <svg className="github-section-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            Site Analytics
          </h2>
          <div className="goatcounter-placeholder">
            <p>Privacy-friendly site analytics coming soon.</p>
            <p>
              Powered by <a href="https://www.goatcounter.com" target="_blank" rel="noopener noreferrer">GoatCounter</a> — no cookies, no tracking, fully GDPR compliant.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
