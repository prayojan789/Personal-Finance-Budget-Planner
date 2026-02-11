import { useState } from "react";
import "./App.css";
import Button from "./components/common/Button.jsx";
import Input from "./components/common/Input.jsx";
import Loader from "./components/common/Loader.jsx";
import Modal from "./components/common/Modal.jsx";
import ExpenseChart from "./components/charts/ExpenseChart.jsx";
import IncomeChart from "./components/charts/IncomeChart.jsx";
import Footer from "./components/layout/Footer.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import Sidebar from "./components/layout/Sidebar.jsx";
import BudgetForm from "./features/budgets/BudgetForm.jsx";
import BudgetList from "./features/budgets/BudgetList.jsx";
import Dashboard from "./features/dashboard/Dashboard.jsx";
import RecentTransactions from "./features/dashboard/RecentTransactions.jsx";
import SummaryCards from "./features/dashboard/SummaryCards.jsx";
import ReportsPanel from "./features/reports/ReportsPanel.jsx";
import SettingsPanel from "./features/settings/SettingsPanel.jsx";
import TransactionForm from "./features/transactions/TransactionForm.jsx";
import TransactionList from "./features/transactions/TransactionList.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import heroIllustration from "./assets/images/hero-illustration.svg";
import Login from "./features/auth/Login.jsx";
import Register from "./features/auth/Register.jsx";

function App() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="app">
      <Navbar />
      <div className="app__body">
        <Sidebar />
        <main className="app__main">
          <AppRoutes>
            <section className="hero">
              <div className="hero__copy">
                <p className="eyebrow">Personal finance</p>
                <h1>Budget Planner</h1>
                <p className="hero__subtitle">
                  Track income, plan budgets, and see your spending at a glance.
                </p>
                <div className="hero__actions">
                  <Button className="btn--primary" onClick={() => setModalOpen(true)}>
                    Create a plan
                  </Button>
                  <Button className="btn--ghost">Import data</Button>
                </div>
              </div>
              <div className="hero__media" aria-hidden="true">
                <img src={heroIllustration} alt="" />
              </div>
            </section>

            <section id="overview" className="panel">
              <Dashboard />
            </section>

            <section className="panel reveal" id="summary">
              <header className="panel__header">
                <h2>Summary</h2>
                <span className="panel__tag">This month</span>
              </header>
              <SummaryCards />
            </section>

            <section className="panel grid-2 reveal">
              <div>
                <h3>Expense trends</h3>
                <ExpenseChart />
              </div>
              <div>
                <h3>Income flow</h3>
                <IncomeChart />
              </div>
            </section>

            <section className="panel grid-2 reveal">
              <div>
                <TransactionForm />
                <div className="quick-form">
                  <h3>Quick add</h3>
                  <div className="quick-form__row">
                    <Input label="Description" placeholder="Groceries" />
                    <Input label="Amount" type="number" placeholder="120" />
                  </div>
                  <Button className="btn--primary">Save draft</Button>
                </div>
              </div>
              <div>
                <TransactionList />
                <RecentTransactions />
              </div>
            </section>

            <section className="panel grid-2 reveal">
              <BudgetForm />
              <BudgetList />
            </section>

            <ReportsPanel />

            <SettingsPanel />

            <section className="panel" id="auth">
              <div className="section-header">
                <h2>Mock Auth</h2>
                <span className="section-tag">Optional</span>
              </div>
              <div className="grid-2">
                <Login />
                <Register />
              </div>
            </section>
          </AppRoutes>
        </main>
      </div>
      <Footer />

      <Modal
        open={modalOpen}
        title="Getting started"
        onClose={() => setModalOpen(false)}
      >
        <p>We are preparing your personalized budget experience.</p>
        <Loader label="Setting up your workspace" />
      </Modal>
    </div>
  );
}

export default App;
