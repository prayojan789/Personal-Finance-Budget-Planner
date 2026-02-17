import { memo, useState } from "react";
import { useFinance } from "../../../context/FinanceContext.jsx";
import { useToast } from "../../../context/toastCore.js";
import formatCurrency from "../../../utils/formatCurrency.js";
import Button from "../../../components/common/Button.jsx";
import Input from "../../../components/common/Input.jsx";

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString();
};

function TransactionItem({ transaction }) {
  const { settings, updateTransaction, deleteTransaction, categories } = useFinance();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    description: transaction.description || "",
    amount: transaction.amount || "",
    type: transaction.type || "expense",
    category: transaction.category || "Other",
    date: transaction.date || "",
    note: transaction.note || "",
  });

  const handleChange = (event) => {
    const { na   me, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateTransaction(transaction.id, {
      ...form,
      amount: Number(form.amount || 0),
    });
    toast.success("Transaction updated!");
    setEditing(false);
  };

  const handleDelete = () => {
    deleteTransaction(transaction.id);
    toast.info("Transaction deleted.");
  };

  const handleCancel = () => {
    setForm({
      description: transaction.description || "",
      amount: transaction.amount || "",
      type: transaction.type || "expense",
      category: transaction.category || "Other",
      date: transaction.date || "",
      note: transaction.note || "",
    });
    setEditing(false);
  };

  return (
    <div className={`transaction-item ${editing ? "transaction-item--edit" : ""}`}>
      {editing ? (
        <>
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
            <div className="field">
              <label className="field__label" htmlFor={`type-${transaction.id}`}>
                Type
              </label>
              <select
                id={`type-${transaction.id}`}
                name="type"
                value={form.type}
                onChange={handleChange}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div className="field">
              <label className="field__label" htmlFor={`category-${transaction.id}`}>
                Category
              </label>
              <select
                id={`category-${transaction.id}`}
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>
          <Input label="Note" name="note" value={form.note} onChange={handleChange} />
          <div className="transaction-actions">
            <Button className="btn--primary" type="button" onClick={handleSave}>
              Save
            </Button>
            <Button type="button" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <>
          <div>
            <strong>{transaction.description || "Untitled"}</strong>
            <div className="transaction-meta">
              {transaction.category || "Other"} - {formatDate(transaction.date)}
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
            <Button type="button" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default memo(TransactionItem);
