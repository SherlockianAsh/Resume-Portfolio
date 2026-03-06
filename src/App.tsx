import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import PublicLayout from "./components/PublicLayout";
import Landing from "./pages/Landing";
import Resume from "./pages/Resume";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Card from "./pages/Card";
import Showcase from "./pages/Showcase";
import Analytics from "./pages/Analytics";

import "./styles/base.css";
import "./styles/landing.css";
import "./styles/resume.css";
import "./styles/print.css";
import "./styles/admin.css";
import "./styles/card.css";
import "./styles/showcase.css";
import "./styles/analytics.css";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/card" element={<Card />} />
            <Route path="/projects" element={<Showcase />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
