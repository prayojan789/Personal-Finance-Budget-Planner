import { useMemo, useState } from "react";
import { useFinance } from "../context/FinanceContext.jsx";
import formatCurrency from "../utils/formatCurrency.js";
import Button from "../components/common/Button.jsx";
import Input from "../components/common/Input.jsx";

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

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getMonthsRemaining = (targetDate) => {
  const today = new Date();
  const target = new Date(targetDate);
  if (Number.isNaN(target.getTime())) return 0;
  let months =
    (target.getFullYear() - today.getFullYear()) * 12 +
    (target.getMonth() - today.getMonth());
  if (target.getDate() < today.getDate()) {
    months -= 1;
  }
  return Math.max(months, 0);
};

const defaultGoalForm = {
  name: "",
  targetAmount: "",
  targetDate: "",
  savedAmount: "",
};

export default function GoalsPage() {
  const { budgetsWithSpend, settings, goals, addGoal, updateGoal, deleteGoal } = useFinance();
  const currentMonthKey = useMemo(() => getMonthKey(new Date()), []);
  const [expandedMonth, setExpandedMonth] = useState(currentMonthKey);
  const [goalForm, setGoalForm] = useState(defaultGoalForm);
  const [goalError, setGoalError] = useState("");
  const [contributions, setContributions] = useState({});

  const handleGoalChange = (event) => {
    const { name, value } = event.target;
    setGoalForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoalSubmit = (event) => {
    event.preventDefault();
    const name = goalForm.name.trim();
    const targetAmount = Number(goalForm.targetAmount || 0);
    const savedAmount = Number(goalForm.savedAmount || 0);

    if (!name) {
      setGoalError("Add a goal name.");
      return;
    }
    if (!goalForm.targetDate) {
      setGoalError("Add a target date.");
      return;
    }
    if (!targetAmount || targetAmount <= 0) {
      setGoalError("Add a valid target amount.");
      return;
    }
    if (savedAmount < 0) {
      setGoalError("Saved amount cannot be negative.");
      return;
    }

    addGoal({
      name,
      targetAmount,
      targetDate: goalForm.targetDate,
      savedAmount,
      createdAt: new Date().toISOString(),
    });
    setGoalForm(defaultGoalForm);
    setGoalError("");
  };

  const handleContributionChange = (goalId, value) => {
    setContributions((prev) => ({ ...prev, [goalId]: value }));
  };

  const handleAddContribution = (goal) => {
    const amount = Number(contributions[goal.id] || 0);
    if (!amount || amount <= 0) return;
    updateGoal(goal.id, { savedAmount: Number(goal.savedAmount || 0) + amount });
    setContributions((prev) => ({ ...prev, [goal.id]: "" }));
  };

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
    const total = goals.length;
    const totalTarget = goals.reduce((sum, goal) => sum + Number(goal.targetAmount || 0), 0);
    const totalSaved = goals.reduce((sum, goal) => sum + Number(goal.savedAmount || 0), 0);
    const remaining = Math.max(totalTarget - totalSaved, 0);

    return { total, totalTarget, totalSaved, remaining };
  }, [goals]);

  const goalItems = useMemo(
    () =>
      goals.map((goal) => {
        const targetAmount = Number(goal.targetAmount || 0);
        const savedAmount = Number(goal.savedAmount || 0);
        const remaining = Math.max(targetAmount - savedAmount, 0);
        const progress = targetAmount ? Math.min((savedAmount / targetAmount) * 100, 120) : 0;
        const monthsRemaining = getMonthsRemaining(goal.targetDate);
        const requiredMonthly =
          remaining <= 0 ? 0 : monthsRemaining > 0 ? remaining / monthsRemaining : remaining;
        let status = "neutral";
        if (remaining > 0 && monthsRemaining === 0) {
          status = "danger";
        } else if (remaining > 0 && monthsRemaining <= 2) {
          status = "warning";
        }

        return {
          ...goal,
          targetAmount,
          savedAmount,
          remaining,
          progress,
          monthsRemaining,
          requiredMonthly,
          status,
        };
      }),
    [goals]
  );

  return (
    <div className="page">
      <div className="page__header">
        <h1>Savings & Goals</h1>
        <p>Create savings goals, track progress, and see required monthly savings.</p>
      </div>

      <div className="goals-grid">
        <section className="panel goal-stat">
          <h3>Total Goals</h3>
          <strong>{goalsStats.total}</strong>
          <p className="muted">Active savings goals</p>
        </section>

        <section className="panel goal-stat">
          <h3>Total Target</h3>
          <strong>{formatCurrency(goalsStats.totalTarget, settings.currency)}</strong>
          <p className="muted">Across all goals</p>
        </section>

        <section className="panel goal-stat">
          <h3>Total Saved</h3>
          <strong>{formatCurrency(goalsStats.totalSaved, settings.currency)}</strong>
          <p className="muted">So far</p>
        </section>

        <section className="panel goal-stat">
          <h3>Remaining</h3>
          <strong>{formatCurrency(goalsStats.remaining, settings.currency)}</strong>
          <p className="muted">To hit all targets</p>
        </section>
      </div>

      <div className="goals-savings">
        <section className="panel goal-form">
          <div className="section-header">
            <h2>Create Savings Goal</h2>
            <span className="section-tag">Target + date</span>
          </div>
          <form className="form" onSubmit={handleGoalSubmit}>
            <Input
              label="Goal name"
              name="name"
              type="text"
              value={goalForm.name}
              onChange={handleGoalChange}
              placeholder="Emergency fund"
            />
            <Input
              label="Target amount"
              name="targetAmount"
              type="number"
              step="0.01"
              value={goalForm.targetAmount}
              onChange={handleGoalChange}
              placeholder="0.00"
            />
            <Input
              label="Target date"
              name="targetDate"
              type="date"
              value={goalForm.targetDate}
              onChange={handleGoalChange}
            />
            <Input
              label="Saved so far"
              name="savedAmount"
              type="number"
              step="0.01"
              value={goalForm.savedAmount}
              onChange={handleGoalChange}
              placeholder="0.00"
            />
            {goalError ? <p className="form__error">{goalError}</p> : null}
            <Button className="btn--primary" type="submit">
              Create goal
            </Button>
          </form>
        </section>

        <section className="panel goals-list">
          <div className="section-header">
            <h2>Track Progress</h2>
            <span className="section-tag">Monthly required savings</span>
          </div>
          {goalItems.length ? (
            <div className="goals-stack">
              {goalItems.map((goal) => {
                const progressClass =
                  goal.status === "neutral" ? "progress" : `progress progress--${goal.status}`;
                const requiredLabel =
                  goal.remaining <= 0
                    ? "Goal reached"
                    : goal.monthsRemaining > 0
                      ? `${formatCurrency(goal.requiredMonthly, settings.currency)} / month`
                      : `${formatCurrency(goal.remaining, settings.currency)} due now`;

                return (
                  <div key={goal.id} className="goal-card">
                    <div className="goal-card__header">
                      <div>
                        <strong>{goal.name}</strong>
                        <p className="muted">
                          Target {formatCurrency(goal.targetAmount, settings.currency)}
                        </p>
                      </div>
                      <span className={`chip chip--${goal.status}`}>
                        {Math.round(goal.progress)}%
                      </span>
                    </div>
                    <div className={progressClass}>
                      <span style={{ width: `${Math.min(goal.progress, 100)}%` }} />
                    </div>
                    <div className="goal-card__metrics">
                      <div>
                        <p className="muted">Saved</p>
                        <strong>{formatCurrency(goal.savedAmount, settings.currency)}</strong>
                      </div>
                      <div>
                        <p className="muted">Remaining</p>
                        <strong>{formatCurrency(goal.remaining, settings.currency)}</strong>
                      </div>
                    </div>
                    <div className="goal-card__dates">
                      <span>Target date: {formatDate(goal.targetDate)}</span>
                      <span>
                        {goal.monthsRemaining > 0
                          ? `${goal.monthsRemaining} month${
                              goal.monthsRemaining === 1 ? "" : "s"
                            } left`
                          : "Due now"}
                      </span>
                    </div>
                    <p className="goal-card__required">Required monthly saving: {requiredLabel}</p>
                    <div className="goal-card__actions">
                      <Input
                        className="goal-card__input"
                        id={`contribution-${goal.id}`}
                        label="Add contribution"
                        type="number"
                        step="0.01"
                        value={contributions[goal.id] || ""}
                        onChange={(event) =>
                          handleContributionChange(goal.id, event.target.value)
                        }
                        placeholder="0.00"
                      />
                      <div className="goal-card__buttons">
                        <Button
                          className="btn--primary"
                          type="button"
                          onClick={() => handleAddContribution(goal)}
                        >
                          Add
                        </Button>
                        <Button
                          className="btn--ghost"
                          type="button"
                          onClick={() => deleteGoal(goal.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="empty">No savings goals yet. Add one to start tracking.</p>
          )}
        </section>
      </div>

      <div className="section-header">
        <h2>Monthly Budget Goals</h2>
        <span className="section-tag">Budget-based tracking</span>
      </div>

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
