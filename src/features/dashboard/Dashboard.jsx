import { useFinance } from "../../context/FinanceContext.jsx";
import ExpenseChart from "../../components/charts/ExpenseChart.jsx";
import IncomeChart from "../../components/charts/IncomeChart.jsx";
import SummaryCards from "./SummaryCards.jsx";
import RecentTransactions from "./RecentTransactions.jsx";
import formatCurrency from "../../utils/formatCurrency.js";

const getSavingsStatus = (limit, spent, currency) => {
  if (!limit) return "Set a savings budget to start tracking progress.";
  const gap = limit - spent;
  if (gap > 0) return `${formatCurrency(gap, currency)} to go.`;
  if (gap < 0) return `${formatCurrency(Math.abs(gap), currency)} over goal.`;
  return "Goal reached.";
};

export default function Dashboard() {
  const { alerts, budgetsWithSpend, settings } = useFinance();
  const savingsBudget = budgetsWithSpend.find(
    (budget) => (budget.category || "").toLowerCase() === "savings"
  );
  const savingsLimit = Number(savingsBudget?.limit || 0);
  const savingsSpent = Number(savingsBudget?.spent || 0);
  const savingsProgress = savingsLimit
    ? Math.min((savingsSpent / savingsLimit) * 100, 120)
    : 0;
  const savingsStatus = getSavingsStatus(savingsLimit, savingsSpent, settings.currency);

  return (
    <section className="dashboard">
      <div className="dashboard__header">
        <div>
          <h2>Dashboard</h2>
          <p>Track balances, spending, and goals at a glance.</p>
        </div>
      </div>

      <SummaryCards />

      <div className="dashboard-grid">
        <section className="dashboard-card">
          <header className="dashboard-card__header">
            <h3>Monthly income vs expenses</h3>
            <span className="chip chip--neutral">Trend</span>
          </header>
          <IncomeChart />
        </section>

        <section className="dashboard-card">
          <header className="dashboard-card__header">
            <h3>Category breakdown</h3>
            <span className="chip chip--neutral">Spending</span>
          </header>
          <ExpenseChart />
        </section>

        <section className="dashboard-card">
          <header className="dashboard-card__header">
            <h3>Recent transactions</h3>
            <span className="chip chip--neutral">Latest</span>
          </header>
          <RecentTransactions />
        </section>

        <section className="dashboard-card">
          <header className="dashboard-card__header">
            <h3>Savings progress</h3>
            <span className="chip chip--neutral">Goal</span>
          </header>
          {savingsLimit ? (
            <div className="savings-progress">
              <div className="savings-metrics">
                <div>
                  <p className="muted">Saved</p>
                  <strong>{formatCurrency(savingsSpent, settings.currency)}</strong>
                </div>
                <div>
                  <p className="muted">Goal</p>
                  <strong>{formatCurrency(savingsLimit, settings.currency)}</strong>
                </div>
              </div>
              <div className="progress">
                <span style={{ width: `${Math.min(savingsProgress, 100)}%` }} />
              </div>
              <p className="muted">{savingsStatus}</p>
            </div>
          ) : (
            <p className="muted">{savingsStatus}</p>
          )}
        </section>

        <section className="dashboard-card dashboard-card--wide">
          <header className="dashboard-card__header">
            <h3>Budget status alerts</h3>
            <span className="chip chip--neutral">Budgets</span>
          </header>
          {alerts.length ? (
            <div className="alert-stack">
              {alerts.map((budget) => (
                <div key={budget.id} className="alert">
                  <strong>{budget.category}</strong> is {Math.round(budget.progress)}% used.
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert--ok">All budgets are on track.</div>
          )}
        </section>
      </div>
    </section>
  );
}
