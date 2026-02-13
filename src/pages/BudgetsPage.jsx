import BudgetForm from "../features/budgets/BudgetForm.jsx";
import BudgetList from "../features/budgets/BudgetList.jsx";

export default function BudgetsPage() {
  return (
    <section className="panel grid-2 reveal">
      <BudgetForm />
      <BudgetList />
    </section>
  );
}
