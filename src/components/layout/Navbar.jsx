export default function Navbar() {
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
        <button className="btn btn--ghost" type="button">
          Sync
        </button>
      </nav>
    </header>
  );
}
