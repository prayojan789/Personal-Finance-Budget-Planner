import { useMemo } from "react";
import { useFinance } from "../context/FinanceContext.jsx";
import formatCurrency from "../utils/formatCurrency.js";
import ExpenseChart from "../components/charts/ExpenseChart.jsx";
import IncomeChart from "../components/charts/IncomeChart.jsx";

export default function InsightsPage() {
  const { transactions, categoryTotals, monthlySummary, settings, budgetsWithSpend } = useFinance();

  const insights = useMemo(() => {
    const topCategory = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0];
    const monthlyTrend = monthlySummary.slice(-6);
    const avgMonthlySpend =
      monthlySummary.length > 0
        ? monthlySummary.reduce((sum, m) => sum + m.expenses, 0) / monthlySummary.length
        : 0;
    const budgetHealthy = budgetsWithSpend.filter((b) => b.progress < 80).length;
    const budgetAtRisk = budgetsWithSpend.filter((b) => b.progress >= 80 && b.progress < 100).length;
    const budgetOver = budgetsWithSpend.filter((b) => b.progress >= 100).length;

    return {
      topCategory,
      monthlyTrend,
      avgMonthlySpend,
      budgetHealthy,
      budgetAtRisk,
      budgetOver,
    };
  }, [categoryTotals, monthlySummary, budgetsWithSpend]);

  return (
    <div className="page">
      <div className="page__header">
        <h1>Financial Insights</h1>
        <p>Deep dive into your spending patterns and trends.</p>
      </div>

      <div className="insights-grid">
        {/* Spending Trends */}
        <section className="panel insight-card insight-card--wide">
          <header className="panel__header">
            <div>
              <h2>Spending Over Time</h2>
              <p className="muted">Trend over the last 6 months</p>
            </div>
          </header>
          <IncomeChart />
        </section>

        {/* Category Breakdown */}
        <section className="panel insight-card insight-card--wide">
          <header className="panel__header">
            <div>
              <h2>Spending by Category</h2>
              <p className="muted">Where your money goes</p>
            </div>
          </header>
          <ExpenseChart />
        </section>

        {/* Key Metrics */}
        <section className="panel insight-card">
          <header className="panel__header">
            <h3>Key Metrics</h3>
          </header>
          <div className="metric-stack">
            <div className="metric">
              <p className="metric__label">Top Spending Category</p>
              <strong className="metric__value">
                {insights.topCategory
                  ? `${insights.topCategory[0]} (${formatCurrency(insights.topCategory[1], settings.currency)})`
                  : "N/A"}
              </strong>
            </div>
            <div className="metric">
              <p className="metric__label">Avg Monthly Spend</p>
              <strong className="metric__value">
                {formatCurrency(insights.avgMonthlySpend, settings.currency)}
              </strong>
            </div>
            <div className="metric">
              <p className="metric__label">Total Transactions</p>
              <strong className="metric__value">{transactions.length}</strong>
            </div>
          </div>
        </section>

        {/* Budget Health */}
        <section className="panel insight-card">
          <header className="panel__header">
            <h3>Budget Health</h3>
          </header>
          <div className="health-stack">
            <div className="health-item health-item--healthy">
              <span className="health-badge">✓</span>
              <div>
                <p className="health-label">On Track</p>
                <strong>{insights.budgetHealthy}</strong>
              </div>
            </div>
            <div className="health-item health-item--warning">
              <span className="health-badge">!</span>
              <div>
                <p className="health-label">At Risk</p>
                <strong>{insights.budgetAtRisk}</strong>
              </div>
            </div>
            <div className="health-item health-item--danger">
              <span className="health-badge">✕</span>
              <div>
                <p className="health-label">Over</p>
                <strong>{insights.budgetOver}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Insights */}
        <section className="panel insight-card insight-card--wide">
          <header className="panel__header">
            <h3>Recommendations</h3>
          </header>
          <ul className="recommendation-list">
            {insights.topCategory && (
              <li>
                📌 Your biggest expense is <strong>{insights.topCategory[0]}</strong>. Consider
                reviewing this category for savings opportunities.
              </li>
            )}
            {insights.budgetOver > 0 && (
              <li>
                ⚠️ You have <strong>{insights.budgetOver} category/categories</strong> over budget.
                Review and adjust your spending patterns.
              </li>
            )}
            {insights.avgMonthlySpend > 0 && (
              <li>
                📊 Your average monthly spend is{" "}
                <strong>{formatCurrency(insights.avgMonthlySpend, settings.currency)}</strong>.
                Track your progress against this baseline.
              </li>
            )}
            {insights.budgetHealthy === budgetsWithSpend.length && (
              <li>✨ Excellent! All your budgets are on track. Keep up the good work!</li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
