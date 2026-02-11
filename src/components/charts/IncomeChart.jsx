import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useFinance } from "../../context/FinanceContext.jsx";

export default function IncomeChart() {
  const { monthlySummary } = useFinance();

  if (!monthlySummary.length) {
    return <div className="chart chart--empty">Add transactions to see trends.</div>;
  }

  return (
    <div className="chart">
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={monthlySummary} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#E07A5F" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#E07A5F" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="income" stroke="#E07A5F" fill="url(#incomeGradient)" />
          <Area type="monotone" dataKey="expenses" stroke="#3D405B" fill="rgba(61, 64, 91, 0.15)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
