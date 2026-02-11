import { useState } from "react";
import { useFinance } from "../../context/FinanceContext.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";

const defaultForm = {
  category: "Housing",
  limit: "",
  alertAt: 80,
  startDate: new Date().toISOString().slice(0, 10),
};

export default function BudgetForm() {
  const { addBudget, categories } = useFinance();
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
    addBudget({
      ...form,
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
          label="Start date"
          name="startDate"
          type="date"
          value={form.startDate}
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
