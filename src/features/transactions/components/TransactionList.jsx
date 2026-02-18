import { useEffect, useMemo, useState } from "react";
import { FixedSizeList as List } from "react-window";
import { useFinance } from "../../../context/FinanceContext.jsx";
import TransactionItem from "./TransactionItem.jsx";
import useDebouncedValue from "../../../hooks/useDebouncedValue.js";

export default function TransactionList() {
  const { transactions, categories } = useFinance();
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    category: "all",
    from: "",
    to: "",
    minAmount: "",
    maxAmount: "",
  });
  const [sort, setSort] = useState("newest");
  const debouncedSearch = useDebouncedValue(filters.search, 250);

  useEffect(() => {
    const handlePaletteSearch = (event) => {
      const nextQuery = event.detail?.query ?? "";
      setFilters((prev) => ({ ...prev, search: nextQuery }));
    };

    window.addEventListener("command-palette-search", handlePaletteSearch);
    return () => window.removeEventListener("command-palette-search", handlePaletteSearch);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const setTodayFilter = () => {
    const today = new Date().toISOString().split("T")[0];
    setFilters((prev) => ({ ...prev, from: today, to: today }));
  };

  const clearDateFilter = () => {
    setFilters((prev) => ({ ...prev, from: "", to: "" }));
  };

  const filtered = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchSearch = debouncedSearch
        ? transaction.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
        : true;
      const matchType = filters.type === "all" ? true : transaction.type === filters.type;
      const matchCategory =
        filters.category === "all"
          ? true
          : (transaction.category || "Other") === filters.category;
      const date = new Date(transaction.date);
      const matchFrom = filters.from ? date >= new Date(filters.from) : true;
      const matchTo = filters.to ? date <= new Date(filters.to) : true;

      const amount = Number(transaction.amount || 0);
      const matchMinAmount = filters.minAmount ? amount >= Number(filters.minAmount) : true;
      const matchMaxAmount = filters.maxAmount ? amount <= Number(filters.maxAmount) : true;

      return (
        matchSearch &&
        matchType &&
        matchCategory &&
        matchFrom &&
        matchTo &&
        matchMinAmount &&
        matchMaxAmount
      );
    });
  }, [transactions, filters, debouncedSearch]);

  const sorted = useMemo(() => {
    const copy = [...filtered];

    switch (sort) {
      case "newest":
        return copy.sort((a, b) => new Date(b.date) - new Date(a.date));
      case "oldest":
        return copy.sort((a, b) => new Date(a.date) - new Date(b.date));
      case "highest":
        return copy.sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0));
      case "lowest":
        return copy.sort((a, b) => Number(a.amount || 0) - Number(b.amount || 0));
      default:
        return copy.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  }, [filtered, sort]);

  return (
    <section className="transaction-list">
      <div className="section-header">
        <h2>Transactions</h2>
        <span className="section-tag">Filter and edit</span>
      </div>

      <div className="quick-filters">
        <button onClick={setTodayFilter} className="btn btn--sm">
          Today
        </button>
        <button onClick={clearDateFilter} className="btn btn--sm">
          Clear Dates
        </button>
      </div>

      <div className="filters">
        <input
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search description"
          title="Search by transaction description"
        />
        <select name="type" value={filters.type} onChange={handleChange} title="Filter by type">
          <option value="all">All types</option>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
          title="Filter by category"
        >
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <input
          name="from"
          type="date"
          value={filters.from}
          onChange={handleChange}
          title="From date"
        />
        <input
          name="to"
          type="date"
          value={filters.to}
          onChange={handleChange}
          title="To date"
        />
      </div>

      <div className="filters">
        <input
          name="minAmount"
          type="number"
          placeholder="Min amount"
          value={filters.minAmount}
          onChange={handleChange}
          title="Minimum transaction amount"
        />
        <input
          name="maxAmount"
          type="number"
          placeholder="Max amount"
          value={filters.maxAmount}
          onChange={handleChange}
          title="Maximum transaction amount"
        />
        <select value={sort} onChange={handleSortChange} title="Sort transactions">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="highest">Highest amount</option>
          <option value="lowest">Lowest amount</option>
        </select>
      </div>

      <div className="list">
        {sorted.length ? (
          <>
            <p className="filter-info">{sorted.length} transaction(s)</p>
            {sorted.length > 40 ? (
              <List
                className="transaction-virtual-list"
                height={Math.min(sorted.length * 220, 880)}
                itemCount={sorted.length}
                itemSize={220}
                width="100%"
                itemData={sorted}
                overscanCount={4}
              >
                {({ index, style, data }) => (
                  <div style={style} className="transaction-virtual-row">
                    <TransactionItem transaction={data[index]} />
                  </div>
                )}
              </List>
            ) : (
              sorted.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))
            )}
          </>
        ) : (
          <p className="empty">No transactions match these filters.</p>
        )}
      </div>
    </section>
  );
}
