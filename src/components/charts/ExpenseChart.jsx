import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useFinance } from "../../context/FinanceContext.jsx";

export default function ExpenseChart() {
  const { categoryTotals } = useFinance();
  const data = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));

  if (!data.length) {
    return <div className="chart chart--empty">Add expenses to see categories.</div>;
  }

  return (
    <div className="chart">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie dataKey="value" data={data} innerRadius={50} outerRadius={90} paddingAngle={4} />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
