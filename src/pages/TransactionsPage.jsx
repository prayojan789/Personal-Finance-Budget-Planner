import TransactionForm from "../features/transactions/components/TransactionForm.jsx";
import TransactionList from "../features/transactions/components/TransactionList.jsx";

export default function TransactionsPage() {
  return (
    <div className="page">
      <div className="page__header">
        <h1>Transactions</h1>
        <p>Record and manage all your income and expenses.</p>
      </div>
      <section className="panel grid-2">
        <TransactionForm />
        <TransactionList />
      </section>
    </div>
  );
}
