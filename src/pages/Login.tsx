import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { user, isAdmin, loading, configured, login } = useAuth();

  if (!configured) {
    return (
      <div className="admin-center">
        <div className="admin-login-card">
          <h1>Admin Login</h1>
          <p className="admin-error">Firebase is not configured. Set environment variables to enable auth.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (user && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="admin-center">
      <div className="admin-login-card">
        <h1>Admin Login</h1>
        {user && !isAdmin && (
          <p className="admin-error">
            Access denied. This account is not authorized.
          </p>
        )}
        <button className="admin-btn admin-btn-google" onClick={login}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
