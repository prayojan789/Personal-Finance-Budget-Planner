import {
  ChartPieIcon,
  ArrowsRightLeftIcon,
  WalletIcon,
  TrophyIcon,
  LightBulbIcon,
  ChartBarIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: ChartPieIcon },
  { id: "transactions", label: "Transactions", icon: ArrowsRightLeftIcon },
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
    <aside className="sidebar">
      <nav className="sidebar__nav">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              className={`sidebar__link ${isActive(item.id)}`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon className="sidebar__icon" aria-hidden="true" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
