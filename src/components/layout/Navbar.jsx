import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  BanknotesIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext.jsx";
import Button from "../common/Button.jsx";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const today = new Date().toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <BanknotesIcon className="icon icon--lg" aria-hidden="true" />
        Budget Planner
      </div>
      <div className="navbar__actions">
        <span className="muted navbar__date">
          <CalendarDaysIcon className="icon" aria-hidden="true" />
          {today}
        </span>
        {isAuthenticated ? (
          <>
            <div className="user-badge">
              <span className="user-badge__avatar">{user.name[0].toUpperCase()}</span>
              <span className="user-badge__name">{user.name}</span>
            </div>
            <Button className="btn--ghost" type="button" onClick={logout}>
              <ArrowRightOnRectangleIcon className="icon" aria-hidden="true" />
              Logout
            </Button>
          </>
        ) : (
          <a href="#auth" className="btn btn--ghost">
            <ArrowLeftOnRectangleIcon className="icon" aria-hidden="true" />
            Login
          </a>
        )}
      </div>
    </header>
  );
}
