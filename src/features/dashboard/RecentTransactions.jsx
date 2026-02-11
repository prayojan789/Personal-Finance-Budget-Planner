import { useFinance } from "../../context/FinanceContext.jsx";
import formatCurrency from "../../utils/formatCurrency.js";

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString();
};

export default function RecentTransactions() {
  const { transactions, settings } = useFinance();
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  if (!recent.length) {
    return <div className="recent-transactions">No recent transactions.</div>;
  }

  return (
    <div className="recent-transactions">
      {recent.map((transaction) => (
        <div key={transaction.id} className="transaction-row">
          <div>
            <strong>{transaction.description || "Untitled"}</strong>
            <div className="transaction-meta">
              {transaction.category || "Other"} • {formatDate(transaction.date)}
            </div>
          </div>
          <span className={`chip chip--${transaction.type}`}>
            {transaction.type === "income" ? "+" : "-"}
            {formatCurrency(transaction.amount, settings.currency)}
          </span>
        </div>
      ))}
    </div>
  );
}
