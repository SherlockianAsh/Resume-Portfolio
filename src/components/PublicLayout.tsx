import { Outlet } from "react-router-dom";
import { useResume } from "../hooks/useResume";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CodeBackground from "./CodeBackground";
import type { ResumeData } from "../types/resume";

export default function PublicLayout() {
  const { data, loading, error } = useResume();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <p>Failed to load resume data.</p>
      </div>
    );
  }

  return (
    <>
      <CodeBackground />
      <Navbar name={data.profile.fullName} />
      <Outlet context={data satisfies ResumeData} />
      <Footer />
    </>
  );
}
