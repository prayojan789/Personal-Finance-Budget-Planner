import { lazy } from "react";

const DashboardPage = lazy(() => import("../pages/DashboardPage.jsx"));
const BudgetsPage = lazy(() => import("../pages/BudgetsPage.jsx"));
const TransactionsPage = lazy(() => import("../pages/TransactionsPage.jsx"));
const CalendarPage = lazy(() => import("../pages/CalendarPage.jsx"));
const ReportsPage = lazy(() => import("../pages/ReportsPage.jsx"));
const SettingsPage = lazy(() => import("../pages/SettingsPage.jsx"));
const InsightsPage = lazy(() => import("../pages/InsightsPage.jsx"));
const GoalsPage = lazy(() => import("../pages/GoalsPage.jsx"));
const AnalyticsPage = lazy(() => import("../pages/AnalyticsPage.jsx"));
const HomePage = lazy(() => import("../pages/HomePage.jsx"));

export default function AppRoutes({ currentPage, onNavigate }) {
  const pages = {
    home: <HomePage onNavigate={onNavigate} />,
    dashboard: <DashboardPage />,
    transactions: <TransactionsPage />,
    calendar: <CalendarPage />,
    budgets: <BudgetsPage />,
    goals: <GoalsPage />,
    insights: <InsightsPage />,
    analytics: <AnalyticsPage />,
    reports: <ReportsPage />,
    settings: <SettingsPage />,
  };

  return pages[currentPage] || pages.dashboard;
}
