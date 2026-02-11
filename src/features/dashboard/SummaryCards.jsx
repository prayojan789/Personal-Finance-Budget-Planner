import { useFinance } from "../../context/FinanceContext.jsx";
import formatCurrency from "../../utils/formatCurrency.js";

export default function SummaryCards() {
  const { totals, settings, budgetsWithSpend } = useFinance();
  const budgetUsed = budgetsWithSpend.reduce((sum, budget) => sum + budget.spent, 0);
  const budgetLimit = budgetsWithSpend.reduce((sum, budget) => sum + Number(budget.limit || 0), 0);

  return (
    <div className="summary-cards">
      <article className="summary-card">
        <h3>Total income</h3>
        <p>{formatCurrency(totals.income, settings.currency)}</p>
      </article>
      <article className="summary-card">
        <h3>Total expenses</h3>
        <p>{formatCurrency(totals.expenses, settings.currency)}</p>
      </article>
      <article className="summary-card">
        <h3>Net balance</h3>
        <p>{formatCurrency(totals.balance, settings.currency)}</p>
      </article>
      <article className="summary-card">
        <h3>Budget used</h3>
        <p>
          {formatCurrency(budgetUsed, settings.currency)} /{" "}
          {formatCurrency(budgetLimit, settings.currency)}
        </p>
      </article>
    </div>
  );
}
