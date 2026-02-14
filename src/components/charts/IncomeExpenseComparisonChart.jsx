import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useFinance } from "../../context/FinanceContext.jsx";

export default function IncomeExpenseComparisonChart() {
  const { monthlySummary } = useFinance();

  if (!monthlySummary.length) {
    return <div className="chart chart--empty">Add transactions to compare.</div>;
  }

  return (
    <div className="chart">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={monthlySummary} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="income" fill="#3D405B" radius={[8, 8, 0, 0]} />
          <Bar dataKey="expenses" fill="#E07A5F" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
