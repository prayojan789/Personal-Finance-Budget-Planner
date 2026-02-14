import { useState } from "react";
import { useFinance } from "../../context/FinanceContext.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";

const getMonthKey = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}`;
};

const defaultForm = {
  category: "Housing",
  limit: "",
  alertAt: 80,
  month: new Date().toISOString().slice(0, 7),
};

export default function BudgetForm() {
  const { addBudget, categories, budgets } = useFinance();
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.limit) {
      setError("Add a monthly limit.");
      return;
    }
    const monthValue = form.month || new Date().toISOString().slice(0, 7);
    const hasDuplicate = budgets.some((budget) => {
      const budgetMonth = budget.month || getMonthKey(budget.startDate);
      return budget.category === form.category && budgetMonth === monthValue;
    });
    if (hasDuplicate) {
      setError("A budget for this category and month already exists.");
      return;
    }
    addBudget({
      ...form,
      month: monthValue,
      startDate: `${monthValue}-01`,
      limit: Number(form.limit),
      alertAt: Number(form.alertAt || 80),
    });
    setForm(defaultForm);
    setError("");
  };

  return (
    <section className="budget-form" id="budgets">
      <div className="section-header">
        <h2>Budget Rules</h2>
        <span className="section-tag">Monthly limits</span>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field__label">Category</span>
          <select name="category" value={form.category} onChange={handleChange}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <Input
          label="Monthly limit"
          name="limit"
          type="number"
          step="0.01"
          value={form.limit}
          onChange={handleChange}
          placeholder="0.00"
        />
        <Input
          label="Alert at %"
          name="alertAt"
          type="number"
          value={form.alertAt}
          onChange={handleChange}
        />
        <Input
          label="Budget month"
          name="month"
          type="month"
          value={form.month}
          onChange={handleChange}
        />
        {error ? <p className="form__error">{error}</p> : null}
        <Button className="btn--primary" type="submit">
          Save budget
        </Button>
      </form>
    </section>
  );
}
