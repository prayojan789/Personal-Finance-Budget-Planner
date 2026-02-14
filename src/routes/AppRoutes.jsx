import DashboardPage from "../pages/DashboardPage.jsx";
import BudgetsPage from "../pages/BudgetsPage.jsx";
import TransactionsPage from "../pages/TransactionsPage.jsx";
import ReportsPage from "../pages/ReportsPage.jsx";
import SettingsPage from "../pages/SettingsPage.jsx";
import InsightsPage from "../pages/InsightsPage.jsx";
import GoalsPage from "../pages/GoalsPage.jsx";
import AnalyticsPage from "../pages/AnalyticsPage.jsx";
import HomePage from "../pages/HomePage.jsx";

export default function AppRoutes({ currentPage, onNavigate }) {
  const pages = {
    home: <HomePage onNavigate={onNavigate} />,
    dashboard: <DashboardPage />,
    transactions: <TransactionsPage />,
    budgets: <BudgetsPage />,
    goals: <GoalsPage />,
    insights: <InsightsPage />,
    analytics: <AnalyticsPage />,
    reports: <ReportsPage />,
    settings: <SettingsPage />,
  };

  return pages[currentPage] || pages.dashboard;
}
