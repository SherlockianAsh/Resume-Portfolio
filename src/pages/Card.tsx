import { useEffect } from "react";
import { useResume } from "../hooks/useResume";

export default function Card() {
  const { data, loading, error } = useResume();

  if (loading) {
    return (
      <div className="card-page">
        <div className="card-loading">Loading...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="card-page">
        <div className="card-loading">Failed to load.</div>
      </div>
    );
  }

  const { profile } = data;
  const cardUrl = `${window.location.origin}/card`;

  useEffect(() => {
    document.title = `${profile.fullName} — Digital Business Card`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", `${profile.fullName} — ${profile.title} at Ashlock Tech Solutions. Contact, connect, and save.`);
    return () => {
      document.title = "Ashlock Tech Solutions - Resume Portfolio";
      if (meta) meta.setAttribute("content", "Ashlock Tech Solutions — .NET Consultant specializing in enterprise systems, ticketing, and IoT integration");
    };
  }, [profile]);

  const escVcard = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,");

  const handleSaveContact = () => {
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${escVcard(profile.fullName)}`,
      `TITLE:${escVcard(profile.title)}`,
      `TEL;TYPE=CELL:${profile.phone}`,
      `EMAIL:${profile.email}`,
      `URL:${cardUrl}`,
      `ADR;TYPE=WORK:;;${escVcard(profile.location)};;;;`,
      `URL;TYPE=LinkedIn:${profile.linkedinUrl}`,
      `URL;TYPE=GitHub:${profile.githubUrl}`,
      "END:VCARD",
    ].join("\r\n");

    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${profile.fullName.replace(/\s+/g, "_")}.vcf`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="card-page">
      <div className="card-container">
        <div className="card-body">
          {/* Header with accent bar */}
          <div className="card-accent" />

          {/* Profile */}
          <div className="card-profile">
            <div className="card-avatar">
              {profile.profileImage ? (
                <img
                  src={`${import.meta.env.BASE_URL}${profile.profileImage}`}
                  alt={profile.fullName}
                  className="card-avatar-img"
                />
              ) : (
                <div className="card-avatar-placeholder">
                  {profile.fullName.charAt(0)}
                </div>
              )}
            </div>
            <h1 className="card-name">{profile.fullName}</h1>
            <p className="card-title">{profile.title}</p>
            <p className="card-company">Ashlock Tech Solutions</p>
          </div>

          {/* Contact Links */}
          <div className="card-links">
            <a href={`tel:${profile.phone}`} className="card-link">
              <div className="card-link-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <div className="card-link-info">
                <span className="card-link-label">Phone</span>
                <span className="card-link-value">{profile.phone}</span>
              </div>
            </a>

            <a href={`mailto:${profile.email}`} className="card-link">
              <div className="card-link-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div className="card-link-info">
                <span className="card-link-label">Email</span>
                <span className="card-link-value">{profile.email}</span>
              </div>
            </a>

            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="card-link">
              <div className="card-link-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </div>
              <div className="card-link-info">
                <span className="card-link-label">LinkedIn</span>
                <span className="card-link-value">{profile.fullName.split(" ").slice(0, 2).join(" ")}</span>
              </div>
            </a>

            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="card-link">
              <div className="card-link-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
              </div>
              <div className="card-link-info">
                <span className="card-link-label">GitHub</span>
                <span className="card-link-value">{profile.githubUrl.replace("https://github.com/", "")}</span>
              </div>
            </a>

            <div className="card-link" style={{ cursor: "default" }}>
              <div className="card-link-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div className="card-link-info">
                <span className="card-link-label">Location</span>
                <span className="card-link-value">{profile.location}</span>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="card-qr">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(cardUrl)}&bgcolor=0D1117&color=D4A847&format=svg`}
              alt="QR Code"
              className="card-qr-img"
            />
            <p className="card-qr-label">Scan to view card</p>
          </div>

          {/* Actions */}
          <div className="card-actions">
            <button onClick={handleSaveContact} className="card-btn-save">
              Save Contact
            </button>
            <a href="/" className="card-btn-portfolio">
              View Portfolio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
