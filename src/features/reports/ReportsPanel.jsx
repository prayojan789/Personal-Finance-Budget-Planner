import { useFinance } from "../../context/FinanceContext.jsx";
import { downloadCsv } from "../../services/financeService.js";
import Button from "../../components/common/Button.jsx";
import formatCurrency from "../../utils/formatCurrency.js";
import ExpenseChart from "../../components/charts/ExpenseChart.jsx";
import IncomeChart from "../../components/charts/IncomeChart.jsx";
import MonthlyTrendChart from "../../components/charts/MonthlyTrendChart.jsx";
import IncomeExpenseComparisonChart from "../../components/charts/IncomeExpenseComparisonChart.jsx";

const downloadJson = (filename, payload) => {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default function ReportsPanel() {
  const { transactions, budgets, totals, settings, monthlySummary, categoryTotals } = useFinance();

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

  const handleExportChartCsv = () => {
    const categoryRows = Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
    }));
    const monthlyRows = monthlySummary.map((month) => ({
      month: month.month,
      income: month.income,
      expenses: month.expenses,
    }));
    downloadCsv("chart-category-expenses.csv", categoryRows);
    downloadCsv("chart-monthly-trends.csv", monthlyRows);
  };

  const handleExportChartJson = () => {
    const payload = {
      categoryExpenses: Object.entries(categoryTotals).map(([category, amount]) => ({
        category,
        amount,
      })),
      monthlyTrends: monthlySummary.map((month) => ({
        month: month.month,
        income: month.income,
        expenses: month.expenses,
      })),
    };
    downloadJson("chart-data.json", payload);
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
        <div className="report-card">
          <h3>Export chart data</h3>
          <p className="muted">Download chart-ready CSV or JSON data.</p>
          <div className="report-actions">
            <Button className="btn--primary" type="button" onClick={handleExportChartCsv}>
              Export charts CSV
            </Button>
            <Button type="button" onClick={handleExportChartJson}>
              Export charts JSON
            </Button>
          </div>
        </div>
      </div>
      <div className="report-charts">
        <div className="report-card report-card--chart">
          <div className="report-card__header">
            <h3>Expense by category</h3>
            <span className="chip chip--neutral">Breakdown</span>
          </div>
          <ExpenseChart />
        </div>
        <div className="report-card report-card--chart">
          <div className="report-card__header">
            <h3>Monthly trend line</h3>
            <span className="chip chip--neutral">Trend</span>
          </div>
          <MonthlyTrendChart />
        </div>
        <div className="report-card report-card--chart">
          <div className="report-card__header">
            <h3>Income vs expenses</h3>
            <span className="chip chip--neutral">Comparison</span>
          </div>
          <IncomeExpenseComparisonChart />
        </div>
        <div className="report-card report-card--chart">
          <div className="report-card__header">
            <h3>Monthly income vs expenses</h3>
            <span className="chip chip--neutral">Overview</span>
          </div>
          <IncomeChart />
        </div>
      </div>
    </section>
  );
}
