import {
  ChartPieIcon,
  ArrowsRightLeftIcon,
  WalletIcon,
  TrophyIcon,
  LightBulbIcon,
  ChartBarIcon,
  DocumentChartBarIcon,
  CalendarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: ChartPieIcon },
  { id: "transactions", label: "Transactions", icon: ArrowsRightLeftIcon },
  { id: "calendar", label: "Calendar", icon: CalendarIcon },
  { id: "budgets", label: "Budgets", icon: WalletIcon },
  { id: "goals", label: "Goals", icon: TrophyIcon },
  { id: "insights", label: "Insights", icon: LightBulbIcon },
  { id: "analytics", label: "Analytics", icon: ChartBarIcon },
  { id: "reports", label: "Reports", icon: DocumentChartBarIcon },
  { id: "settings", label: "Settings", icon: Cog6ToothIcon },
];

export default function Sidebar({ currentPage, onNavigate }) {
  const isActive = (page) => (currentPage === page ? "active" : "");

  return (
    <aside className="sidebar" aria-label="Navigation">
      <nav className="sidebar__nav" aria-label="Main navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isItemActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              className={`sidebar__link ${isActive(item.id)}`}
              onClick={() => onNavigate(item.id)}
              aria-current={isItemActive ? "page" : undefined}
              aria-label={`${item.label}${isItemActive ? " (current page)" : ""}`}
              type="button"
            >
              <Icon className="sidebar__icon" aria-hidden="true" />
              <span className="sidebar__label">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
