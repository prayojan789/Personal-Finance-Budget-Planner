import Button from "../components/common/Button.jsx";
import heroIllustration from "../assets/images/hero-illustration.svg";

export default function HomePage({ onNavigate }) {
  return (
    <section className="hero">
      <div className="hero__copy">
        <p className="eyebrow">Personal finance</p>
        <h1>Budget Planner</h1>
        <p className="hero__subtitle">
          Track income, plan budgets, and see your spending at a glance.
        </p>
        <div className="hero__actions">
          <Button className="btn--primary" onClick={() => onNavigate("transactions")}>
            Create a plan
          </Button>
          <Button className="btn--ghost">Import data</Button>
        </div>
      </div>
      <div className="hero__media" aria-hidden="true">
        <img src={heroIllustration} alt="" />
      </div>
    </section>
  );
}
