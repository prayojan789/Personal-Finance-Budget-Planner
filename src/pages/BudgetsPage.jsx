import BudgetForm from "../features/budgets/BudgetForm.jsx";
import BudgetList from "../features/budgets/BudgetList.jsx";

export default function BudgetsPage() {
  return (
    <div className="page">
      <div className="page__header">
        <h1>Monthly Budgets</h1>
        <p>Create and track budgets by category for each month.</p>
      </div>
      <section className="panel grid-2">
        <BudgetForm />
        <BudgetList />
      </section>
    </div>
  );
}
