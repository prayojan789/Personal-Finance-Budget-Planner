import { useMemo, useState } from "react";
import { useFinance } from "../../context/FinanceContext.jsx";
import TransactionItem from "./TransactionItem.jsx";

export default function TransactionList() {
  const { transactions, categories } = useFinance();
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    category: "all",
    from: "",
    to: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filtered = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchSearch = filters.search
        ? transaction.description?.toLowerCase().includes(filters.search.toLowerCase())
        : true;
      const matchType = filters.type === "all" ? true : transaction.type === filters.type;
      const matchCategory =
        filters.category === "all"
          ? true
          : (transaction.category || "Other") === filters.category;
      const date = new Date(transaction.date);
      const matchFrom = filters.from ? date >= new Date(filters.from) : true;
      const matchTo = filters.to ? date <= new Date(filters.to) : true;
      return matchSearch && matchType && matchCategory && matchFrom && matchTo;
    });
  }, [transactions, filters]);

  const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <section className="transaction-list">
      <div className="section-header">
        <h2>Transactions</h2>
        <span className="section-tag">Filter and edit</span>
      </div>
      <div className="filters">
        <input
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search description"
        />
        <select name="type" value={filters.type} onChange={handleChange}>
          <option value="all">All types</option>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <select name="category" value={filters.category} onChange={handleChange}>
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <input name="from" type="date" value={filters.from} onChange={handleChange} />
        <input name="to" type="date" value={filters.to} onChange={handleChange} />
      </div>

      <div className="list">
        {sorted.length ? (
          sorted.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))
        ) : (
          <p className="empty">No transactions match these filters.</p>
        )}
      </div>
    </section>
  );
}
