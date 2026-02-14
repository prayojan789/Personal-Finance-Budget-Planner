export default function Sidebar({ currentPage, onNavigate }) {
  const isActive = (page) => currentPage === page ? "active" : "";

  return (
    <aside className="sidebar">
      <nav className="sidebar__nav">
        <button
          className={`sidebar__link ${isActive("dashboard")}`}
          onClick={() => onNavigate("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`sidebar__link ${isActive("transactions")}`}
          onClick={() => onNavigate("transactions")}
        >
          Transactions
        </button>
        <button
          className={`sidebar__link ${isActive("budgets")}`}
          onClick={() => onNavigate("budgets")}
        >
          Budgets
        </button>
        <button
          className={`sidebar__link ${isActive("goals")}`}
          onClick={() => onNavigate("goals")}
        >
          Goals
        </button>
        <button
          className={`sidebar__link ${isActive("insights")}`}
          onClick={() => onNavigate("insights")}
        >
          Insights
        </button>
        <button
          className={`sidebar__link ${isActive("analytics")}`}
          onClick={() => onNavigate("analytics")}
        >
          Analytics
        </button>
        <button
          className={`sidebar__link ${isActive("reports")}`}
          onClick={() => onNavigate("reports")}
        >
          Reports
        </button>
        <button
          className={`sidebar__link ${isActive("settings")}`}
          onClick={() => onNavigate("settings")}
        >
          Settings
        </button>
      </nav>
    </aside>
  );
}
