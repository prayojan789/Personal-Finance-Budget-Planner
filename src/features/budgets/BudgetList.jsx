import { useFinance } from "../../context/FinanceContext.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import formatCurrency from "../../utils/formatCurrency.js";
import { useState } from "react";

export default function BudgetList() {
  const { budgetsWithSpend, settings, updateBudget, deleteBudget } = useFinance();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ limit: "", alertAt: 80 });

  const startEdit = (budget) => {
    setEditingId(budget.id);
    setEditForm({ limit: budget.limit, alertAt: budget.alertAt || 80 });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (id) => {
    updateBudget(id, {
      limit: Number(editForm.limit),
      alertAt: Number(editForm.alertAt || 80),
    });
    setEditingId(null);
  };

  return (
    <section className="budget-list">
      <div className="section-header">
        <h2>Budgets</h2>
        <span className="section-tag">Track progress</span>
      </div>
      <div className="list">
        {budgetsWithSpend.length ? (
          budgetsWithSpend.map((budget) => (
            <div key={budget.id} className="budget-item">
              <div className="budget-item__header">
                <div>
                  <strong>{budget.category}</strong>
                  <p>
                    Spent {formatCurrency(budget.spent, settings.currency)} of{" "}
                    {formatCurrency(budget.limit, settings.currency)}
                  </p>
                </div>
                <span
                  className={`chip chip--$${budget.progress >= 100 ? "danger" : "neutral"}`}
                >
                  {Math.round(budget.progress)}%
                </span>
              </div>
              <div className="progress">
                <span style={{ width: `${Math.min(budget.progress, 100)}%` }} />
              </div>
              <p className="muted">
                Remaining {formatCurrency(budget.remaining, settings.currency)} • Alerts at{" "}
                {budget.alertAt}%
              </p>
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
                  <Button type="button" onClick={() => deleteBudget(budget.id)}>
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="empty">No budgets yet. Add one to start tracking.</p>
        )}
      </div>
    </section>
  );
}
