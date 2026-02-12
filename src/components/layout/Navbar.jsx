import { useAuth } from "../../context/AuthContext.jsx";
import Button from "../common/Button.jsx";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="navbar">
      <div className="navbar__brand">Budget Planner</div>
      <nav className="navbar__actions">
        <span className="muted">{today}</span>
        {isAuthenticated ? (
          <>
            <div className="user-badge">
              <span className="user-badge__avatar">{user.name[0].toUpperCase()}</span>
              <span className="user-badge__name">{user.name}</span>
            </div>
            <Button className="btn--ghost" type="button" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <a href="#auth" className="btn btn--ghost">
            Login
          </a>
        )}
      </nav>
    </header>
  );
}
