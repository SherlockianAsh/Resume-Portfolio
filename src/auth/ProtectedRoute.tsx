import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading, configured, login } = useAuth();

  if (loading) {
    return (
      <div className="admin-center">
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="admin-center">
        <div className="admin-login-card">
          <h1>Admin Login</h1>
          <p className="admin-error">Firebase is not configured.</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="admin-center">
        <div className="admin-login-card">
          <h1>Admin Login</h1>
          {user && !isAdmin && (
            <p className="admin-error">Access denied. This account is not authorized.</p>
          )}
          <button className="admin-btn admin-btn-google" onClick={login}>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
