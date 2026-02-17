import { useFinance } from "../../context/FinanceContext.jsx";
import { useToast } from "../../context/toastCore.js";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import formatCurrency from "../../utils/formatCurrency.js";
import { useMemo, useState } from "react";

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

export default function BudgetList() {
  const { budgetsWithSpend, settings, updateBudget, deleteBudget } = useFinance();
  const toast = useToast();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ limit: "", alertAt: 80, month: "" });
  const currentMonthKey = useMemo(() => getMonthKey(new Date()), []);
  const [filterMonth, setFilterMonth] = useState(currentMonthKey);

  const visibleBudgets = useMemo(
    () =>
      budgetsWithSpend.filter(
        (budget) => (budget.monthKey || currentMonthKey) === filterMonth
      ),
    [budgetsWithSpend, filterMonth, currentMonthKey]
  );

  const monthTotals = useMemo(
    () =>
      visibleBudgets.reduce(
        (acc, budget) => {
          acc.limit += Number(budget.limit || 0);
          acc.spent += Number(budget.spent || 0);
          acc.remaining += Number(budget.remaining || 0);
          return acc;
        },
        { limit: 0, spent: 0, remaining: 0 }
      ),
    [visibleBudgets]
  );

  const startEdit = (budget) => {
    setEditingId(budget.id);
    setEditForm({
      limit: budget.limit,
      alertAt: budget.alertAt || 80,
      month: budget.month || budget.monthKey || getMonthKey(budget.startDate) || currentMonthKey,
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (id) => {
    const monthValue = editForm.month || currentMonthKey;
    updateBudget(id, {
      limit: Number(editForm.limit),
      alertAt: Number(editForm.alertAt || 80),
      month: monthValue,
      startDate: `${monthValue}-01`,
    });
    toast.success("Budget updated successfully!");
    setEditingId(null);
  };

  const handleDelete = (id) => {
    deleteBudget(id);
    toast.info("Budget deleted.");
  };

  return (
    <section className="budget-list">
      <div className="section-header">
        <h2>Budgets</h2>
        <span className="section-tag">Track progress</span>
      </div>
      <div className="filters budget-filters">
        <Input
          label="Month"
          name="filterMonth"
          type="month"
          value={filterMonth}
          onChange={(event) => setFilterMonth(event.target.value)}
        />
      </div>
      <p className="budget-summary">
        {formatMonth(filterMonth)} • Spent {formatCurrency(monthTotals.spent, settings.currency)} of{" "}
        {formatCurrency(monthTotals.limit, settings.currency)} • Remaining{" "}
        {formatCurrency(monthTotals.remaining, settings.currency)}
      </p>
      <div className="list">
        {visibleBudgets.length ? (
          visibleBudgets.map((budget) => (
            <div key={budget.id} className="budget-item">
              <div className="budget-item__header">
                <div>
                  <strong>{budget.category}</strong>
                  <p>
                    Spent {formatCurrency(budget.spent, settings.currency)} of{" "}
                    {formatCurrency(budget.limit, settings.currency)}
                  </p>
                  <p className="budget-meta">{formatMonth(budget.monthKey)}</p>
                </div>
                <span
                  className={`chip chip--${budget.status === "danger" ? "danger" : budget.status === "warning" ? "warning" : "neutral"}`}
                >
                  {Math.round(budget.progress)}%
                </span>
              </div>
              <div className={`progress progress--${budget.status}`}>
                <span style={{ width: `${Math.min(budget.progress, 100)}%` }} />
              </div>
              <p className="muted">
                Remaining {formatCurrency(budget.remaining, settings.currency)} • Alerts at{" "}
                {budget.alertAt}%
              </p>
              {budget.remaining < 0 ? (
                <p className="budget-warning">
                  Overspent by {formatCurrency(Math.abs(budget.remaining), settings.currency)}
                </p>
              ) : null}
              {editingId === budget.id ? (
                <div className="form__row">
                  <Input
                    label="Limit"
                    name="limit"
                    type="number"
                    step="0.01"
                    value={editForm.limit}
                    onChange={handleChange}
                  />
                  <Input
                    label="Alert %"
                    name="alertAt"
                    type="number"
                    value={editForm.alertAt}
                    onChange={handleChange}
                  />
                  <Input
                    label="Month"
                    name="month"
                    type="month"
                    value={editForm.month}
                    onChange={handleChange}
                  />
                  <div className="transaction-actions">
                    <Button className="btn--primary" type="button" onClick={() => handleSave(budget.id)}>
                      Save
                    </Button>
                    <Button type="button" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="transaction-actions">
                  <Button type="button" onClick={() => startEdit(budget)}>
                    Adjust
                  </Button>
                  <Button type="button" onClick={() => handleDelete(budget.id)}>
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="empty">No budgets for this month yet. Add one to start tracking.</p>
        )}
      </div>
    </section>
  );
}
