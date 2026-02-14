import { useMemo, useState } from "react";
import { useFinance } from "../context/FinanceContext.jsx";
import formatCurrency from "../utils/formatCurrency.js";
import Button from "../components/common/Button.jsx";

const getMonthKey = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}`;
};

const formatMonth = (value) => {
  if (!value) return "";
  const date = new Date(`${value}-01T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, { month: "long", year: "numeric" });
};

export default function GoalsPage() {
  const { budgetsWithSpend, settings } = useFinance();
  const currentMonthKey = useMemo(() => getMonthKey(new Date()), []);
  const [expandedMonth, setExpandedMonth] = useState(currentMonthKey);

  const monthGroups = useMemo(() => {
    const groups = {};
    budgetsWithSpend.forEach((budget) => {
      const monthKey = budget.monthKey || currentMonthKey;
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(budget);
    });
    return groups;
  }, [budgetsWithSpend, currentMonthKey]);

  const monthsSorted = useMemo(
    () => Object.keys(monthGroups).sort().reverse(),
    [monthGroups]
  );

  const goalsStats = useMemo(() => {
    const total = budgetsWithSpend.length;
    const onTrack = budgetsWithSpend.filter((b) => b.progress < 80).length;
    const warning = budgetsWithSpend.filter((b) => b.progress >= 80 && b.progress < 100).length;
    const exceeded = budgetsWithSpend.filter((b) => b.progress >= 100).length;
    const totalLimit = budgetsWithSpend.reduce((sum, b) => sum + Number(b.limit || 0), 0);
    const totalSpent = budgetsWithSpend.reduce((sum, b) => sum + Number(b.spent || 0), 0);

    return { total, onTrack, warning, exceeded, totalLimit, totalSpent };
  }, [budgetsWithSpend]);

  return (
    <div className="page">
      <div className="page__header">
        <h1>Savings & Goals</h1>
        <p>Set and track your monthly financial goals by category.</p>
      </div>

      <div className="goals-grid">
        {/* Overall Stats */}
        <section className="panel goal-stat">
          <h3>Total Goals</h3>
          <strong>{goalsStats.total}</strong>
          <p className="muted">{goalsStats.onTrack} on track</p>
        </section>

        <section className="panel goal-stat">
          <h3>Total Limit</h3>
          <strong>{formatCurrency(goalsStats.totalLimit, settings.currency)}</strong>
          <p className="muted">Across all budgets</p>
        </section>

        <section className="panel goal-stat">
          <h3>Total Spent</h3>
          <strong>{formatCurrency(goalsStats.totalSpent, settings.currency)}</strong>
          <p className="muted">{Math.round((goalsStats.totalSpent / goalsStats.totalLimit) * 100)}% used</p>
        </section>

        <section className="panel goal-stat">
          <h3>Remaining</h3>
          <strong className={goalsStats.totalLimit - goalsStats.totalSpent < 0 ? "text-danger" : ""}>
            {formatCurrency(goalsStats.totalLimit - goalsStats.totalSpent, settings.currency)}
          </strong>
          <p className="muted">To stay within budget</p>
        </section>
      </div>

      {/* Goals by Month */}
      <div className="goals-timeline">
        {monthsSorted.length ? (
          monthsSorted.map((monthKey) => {
            const budgets = monthGroups[monthKey];
            const monthSpent = budgets.reduce((sum, b) => sum + Number(b.spent || 0), 0);
            const monthLimit = budgets.reduce((sum, b) => sum + Number(b.limit || 0), 0);
            const isExpanded = expandedMonth === monthKey;

            return (
              <section key={monthKey} className="panel goal-month">
                <button
                  className="goal-month__header"
                  onClick={() => setExpandedMonth(isExpanded ? null : monthKey)}
                >
                  <div>
                    <h3>{formatMonth(monthKey)}</h3>
                    <p className="muted">
                      {budgets.length} goal{budgets.length !== 1 ? "s" : ""} • Spent{" "}
                      {formatCurrency(monthSpent, settings.currency)} of{" "}
                      {formatCurrency(monthLimit, settings.currency)}
                    </p>
                  </div>
                  <span className="goal-month__toggle">{isExpanded ? "−" : "+"}</span>
                </button>

                {isExpanded && (
                  <div className="goal-month__list">
                    {budgets.map((budget) => (
                      <div key={budget.id} className="goal-item">
                        <div className="goal-item__header">
                          <div>
                            <strong>{budget.category}</strong>
                            <p className="muted">
                              {formatCurrency(budget.spent, settings.currency)} of{" "}
                              {formatCurrency(budget.limit, settings.currency)}
                            </p>
                          </div>
                          <span className={`chip chip--${budget.status}`}>
                            {Math.round(budget.progress)}%
                          </span>
                        </div>
                        <div className={`progress progress--${budget.status}`}>
                          <span style={{ width: `${Math.min(budget.progress, 100)}%` }} />
                        </div>
                        {budget.remaining > 0 ? (
                          <p className="goal-remaining">
                            {formatCurrency(budget.remaining, settings.currency)} remaining
                          </p>
                        ) : (
                          <p className="budget-warning">
                            Overspent by {formatCurrency(Math.abs(budget.remaining), settings.currency)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })
        ) : (
          <section className="panel">
            <p className="empty">No goals set yet. Create one in the Budgets section.</p>
          </section>
        )}
      </div>
    </div>
  );
}
