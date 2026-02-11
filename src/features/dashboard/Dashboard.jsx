import { useFinance } from "../../context/FinanceContext.jsx";

export default function Dashboard() {
  const { alerts } = useFinance();

  return (
    <section className="dashboard">
      <div>
        <h2>Overview</h2>
        <p>Review your key metrics, upcoming budgets, and recent activity.</p>
      </div>
      {alerts.length ? (
        <div className="alert-stack">
          {alerts.map((budget) => (
            <div key={budget.id} className="alert">
              <strong>{budget.category}</strong> is {Math.round(budget.progress)}% used.
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert--ok">All budgets are on track.</div>
      )}
    </section>
  );
}
