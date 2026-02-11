import { useState } from "react";
import { useFinance } from "../../context/FinanceContext.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import formatCurrency from "../../utils/formatCurrency.js";

export default function TransactionItem({ transaction }) {
  const { updateTransaction, deleteTransaction, settings, categories } = useFinance();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    description: transaction.description,
    amount: transaction.amount,
    type: transaction.type,
    category: transaction.category,
    date: transaction.date,
    note: transaction.note || "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateTransaction(transaction.id, {
      ...form,
      amount: Number(form.amount),
    });
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="transaction-item transaction-item--edit">
        <div className="form__row">
          <Input
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
          <Input
            label="Amount"
            name="amount"
            type="number"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
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
          <Input label="Date" name="date" type="date" value={form.date} onChange={handleChange} />
          <Input label="Note" name="note" value={form.note} onChange={handleChange} />
        </div>
        <div className="transaction-actions">
          <Button className="btn--primary" type="button" onClick={handleSave}>
            Save
          </Button>
          <Button type="button" onClick={() => setEditing(false)}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-item">
      <div>
        <strong>{transaction.description || "Untitled"}</strong>
        <div className="transaction-meta">
          {transaction.category || "Other"} • {new Date(transaction.date).toLocaleDateString()}
          {transaction.note ? ` • ${transaction.note}` : ""}
        </div>
      </div>
      <div className="transaction-actions">
        <span className={`chip chip--${transaction.type}`}>
          {transaction.type === "income" ? "+" : "-"}
          {formatCurrency(transaction.amount, settings.currency)}
        </span>
        <Button type="button" onClick={() => setEditing(true)}>
          Edit
        </Button>
        <Button type="button" onClick={() => deleteTransaction(transaction.id)}>
          Delete
        </Button>
      </div>
    </div>
  );
}
