import { useContext } from "react";
import { FinanceContext } from "../context/FinanceContext";
import Calendar from "../components/charts/Calendar";

export default function CalendarPage() {
  const { data } = useContext(FinanceContext);
  const transactions = data?.transactions || [];

  return (
    <div className="page calendar-page">
      <div className="page-header">
        <h2 className="page-title">Calendar View</h2>
        <p className="page-subtitle">
          Visualize your transactions across the calendar. Click on any date to
          see detailed transactions for that day.
        </p>
      </div>
      <Calendar transactions={transactions} />
    </div>
  );
}
