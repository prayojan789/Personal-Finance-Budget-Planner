import { useFinance } from "../../context/FinanceContext.jsx";
import { downloadCsv } from "../../services/financeService.js";
import Button from "../../components/common/Button.jsx";
import formatCurrency from "../../utils/formatCurrency.js";

export default function ReportsPanel() {
  const { transactions, budgets, totals, settings } = useFinance();

  const handleExportTransactions = () => {
    const rows = transactions.map((transaction) => ({
      id: transaction.id,
      description: transaction.description,
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      date: transaction.date,
      note: transaction.note || "",
    }));
    downloadCsv("transactions.csv", rows);
  };

  const handleExportBudgets = () => {
    const rows = budgets.map((budget) => ({
      id: budget.id,
      category: budget.category,
      limit: budget.limit,
      alertAt: budget.alertAt,
      startDate: budget.startDate,
    }));
    downloadCsv("budgets.csv", rows);
  };

  return (
    <section className="panel" id="reports">
      <div className="section-header">
        <h2>Reports & Exports</h2>
        <span className="section-tag">Shareable data</span>
      </div>
      <div className="report-grid">
        <div className="report-card">
          <h3>Totals snapshot</h3>
          <p className="muted">High-level metrics for quick reporting.</p>
          <div className="report-metric">
            <span>Income</span>
            <strong>{formatCurrency(totals.income, settings.currency)}</strong>
          </div>
          <div className="report-metric">
            <span>Expenses</span>
            <strong>{formatCurrency(totals.expenses, settings.currency)}</strong>
          </div>
          <div className="report-metric">
            <span>Balance</span>
            <strong>{formatCurrency(totals.balance, settings.currency)}</strong>
          </div>
        </div>
        <div className="report-card">
          <h3>Export data</h3>
          <p className="muted">Download CSV files for external tools.</p>
          <div className="report-actions">
            <Button className="btn--primary" type="button" onClick={handleExportTransactions}>
              Export transactions
            </Button>
            <Button type="button" onClick={handleExportBudgets}>
              Export budgets
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
