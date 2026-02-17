import { useState } from "react";
import { useFinance } from "../../../context/FinanceContext.jsx";
import { useToast } from "../../../context/toastCore.js";
import Button from "../../../components/common/Button.jsx";
import Input from "../../../components/common/Input.jsx";

const defaultForm = {
  description: "",
  amount: "",
  type: "expense",
  category: "Food",
  date: new Date().toISOString().slice(0, 10),
  note: "",
};

export default function TransactionForm() {
  const { addTransaction, categories } = useFinance();
  const toast = useToast();
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.description || !form.amount) {
      setError("Add a description and  amount.");
      return;
    }
    addTransaction({
      ...form,
      amount: Number(form.amount),
    });
    toast.success("Transaction added successfully!");
    setForm(defaultForm);
    setError("");
  };

  return (
    <section className="transaction-form" id="transactions">
      <div className="section-header">
        <h2>Add Transaction</h2>
        <span className="section-tag"> Quick capture</span>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form__row">
          <Input
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Paycheck, groceries"
          />
          <Input
            label="Amount"
            name="amount"
            type="number"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
          />
        </div>
        <div className="form__row">
          <label className="field">
            <span className="field__label">Type</span>
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </label>
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
        </div>
        <div className="form__row">
          <Input
            label="Date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
          />
          <Input
            label="Note"
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Optional note"
          />
        </div>
        {error ? <p className="form__error">{error}</p> : null}
        <Button className="btn--primary" type="submit">
          Save transaction
        </Button>
      </form>
    </section>
  );
}
