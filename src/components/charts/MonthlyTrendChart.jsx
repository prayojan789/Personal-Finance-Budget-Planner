import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useFinance } from "../../context/FinanceContext.jsx";

export default function MonthlyTrendChart() {
  const { monthlySummary } = useFinance();

  if (!monthlySummary.length) {
    return <div className="chart chart--empty">Add transactions to see trends.</div>;
  }

  return (
    <div className="chart">
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={monthlySummary} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="expenses" stroke="#E07A5F" strokeWidth={2} />
          <Line type="monotone" dataKey="income" stroke="#3D405B" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
