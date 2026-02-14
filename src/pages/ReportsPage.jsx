import ReportsPanel from "../features/reports/ReportsPanel.jsx";

export default function ReportsPage() {
  return (
    <div className="page">
      <div className="page__header">
        <h1>Reports</h1>
        <p>Generate and export financial reports.</p>
      </div>
      <ReportsPanel />
    </div>
  );
}
