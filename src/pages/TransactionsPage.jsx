import TransactionForm from "../features/transactions/TransactionForm.jsx";
import TransactionList from "../features/transactions/TransactionList.jsx";
import Input from "../components/common/Input.jsx";
import Button from "../components/common/Button.jsx";

export default function TransactionsPage() {
  return (
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
      </div>
    </section>
  );
}
