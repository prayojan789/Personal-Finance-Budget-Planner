import { useMemo } from "react";
import { useFinance } from "../context/FinanceContext.jsx";
import formatCurrency from "../utils/formatCurrency.js";

const formatMonth = (value) => {
  if (!value) return "";
  const date = new Date(`${value}-01T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, { month: "short", year: "numeric" });
};

export default function AnalyticsPage() {
  const {
    monthlySummary,
    monthComparison,
    categoryTrends,
    spendingForecast,
    savingsRate,
    spendingHabits,
    settings,
  } = useFinance();

  const trendingCategories = useMemo(() => {
    return Object.values(categoryTrends)
      .sort((a, b) => b.average - a.average)
      .slice(0, 5);
  }, [categoryTrends]);

  const last6Months = useMemo(() => monthlySummary.slice(-6), [monthlySummary]);

  return (
    <div className="page">
      <div className="page__header">
        <h1>Advanced Analytics</h1>
        <p>Deep insights into your spending patterns and financial health.</p>
      </div>

      {/* Key Metrics */}
      <div className="analytics-grid metrics-grid">
        <section className="panel metric-card">
          <h3>Savings Rate</h3>
          <strong className="metric-large">{savingsRate}%</strong>
          <p className="muted">Of income saved annually</p>
        </section>

        <section className="panel metric-card">
          <h3>Monthly Average</h3>
          <strong className="metric-large">
            {formatCurrency(
              monthlySummary.reduce((sum, m) => sum + m.expenses, 0) / Math.max(monthlySummary.length, 1),
              settings.currency
            )}
          </strong>
          <p className="muted">Average expenses</p>
        </section>

        {monthComparison && (
          <section className="panel metric-card">
            <h3>Month-over-Month</h3>
            <strong
              className={`metric-large ${monthComparison.expenseChange < 0 ? "text-success" : "text-danger"}`}
            >
              {monthComparison.expenseChange < 0 ? "−" : "+"}
              {Math.abs(Math.round(monthComparison.expenseChangePercent))}%
            </strong>
            <p className="muted">Spending change</p>
          </section>
        )}

        {spendingForecast && (
          <section className="panel metric-card">
            <h3>Next Month Forecast</h3>
            <strong className="metric-large">
              {formatCurrency(spendingForecast.projectedExpenses, settings.currency)}
            </strong>
            <p className="muted">Projected spending ({spendingForecast.trend})</p>
          </section>
        )}
      </div>

      {/* Month Comparison */}
      {monthComparison && (
        <section className="panel">
          <h2>Month-to-Month Comparison</h2>
          <div className="comparison-grid">
            <div className="comparison-item">
              <p className="comparison-label">{formatMonth(monthComparison.previousMonth)}</p>
              <div className="comparison-bar">
                <div
                  className="comparison-fill"
                  style={{
                    width: `${Math.min(
                      (monthlySummary.find((m) => m.month === monthComparison.currentMonth)?.expenses || 0) /
                        Math.max(
                          monthlySummary.find((m) => m.month === monthComparison.previousMonth)?.expenses || 1,
                          monthlySummary.find((m) => m.month === monthComparison.currentMonth)?.expenses || 1
                        ) *
                        100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <p className="comparison-value">
                {formatCurrency(
                  monthlySummary.find((m) => m.month === monthComparison.previousMonth)?.expenses || 0,
                  settings.currency
                )}
              </p>
            </div>
            <div className="comparison-item">
              <p className="comparison-label">{formatMonth(monthComparison.currentMonth)}</p>
              <div className="comparison-bar">
                <div
                  className="comparison-fill comparison-fill--active"
                  style={{
                    width: `${Math.min(
                      (monthlySummary.find((m) => m.month === monthComparison.currentMonth)?.expenses || 0) /
                        Math.max(
                          monthlySummary.find((m) => m.month === monthComparison.previousMonth)?.expenses || 1,
                          monthlySummary.find((m) => m.month === monthComparison.currentMonth)?.expenses || 1
                        ) *
                        100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <p className="comparison-value">
                {formatCurrency(
                  monthlySummary.find((m) => m.month === monthComparison.currentMonth)?.expenses || 0,
                  settings.currency
                )}
              </p>
            </div>
          </div>
          <p className="comparison-note">
            {monthComparison.expenseChange > 0
              ? `Spending increased by ${formatCurrency(monthComparison.expenseChange, settings.currency)}`
              : `Spending decreased by ${formatCurrency(Math.abs(monthComparison.expenseChange), settings.currency)}`}
          </p>
        </section>
      )}

      {/* Last 6 Months Trend */}
      <section className="panel">
        <h2>6-Month Spending Trend</h2>
        <div className="trend-chart">
          {last6Months.map((month) => (
            <div key={month.month} className="trend-bar">
              <div
                className="trend-bar__fill"
                style={{
                  height: `${Math.max(
                    (month.expenses / Math.max(...last6Months.map((m) => m.expenses), 1)) * 100,
                    5
                  )}%`,
                }}
              />
              <p className="trend-bar__label">{formatMonth(month.month)}</p>
              <p className="trend-bar__value">
                {formatCurrency(month.expenses, settings.currency)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Top Spending Categories */}
      <section className="panel">
        <h2>Top Spending Categories</h2>
        <div className="category-list">
          {spendingHabits.slice(0, 8).map((habit) => (
            <div key={habit.category} className="category-item">
              <div className="category-info">
                <strong>{habit.category}</strong>
                <p className="muted">{habit.percentage.toFixed(1)}% of total</p>
              </div>
              <div className="category-bar">
                <div
                  className="category-bar__fill"
                  style={{ width: `${habit.percentage}%` }}
                />
              </div>
              <p className="category-value">
                {formatCurrency(habit.amount, settings.currency)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Category Trends */}
      {trendingCategories.length > 0 && (
        <section className="panel">
          <h2>Category Trends (Last 6 Months)</h2>
          <div className="trend-grid">
            {trendingCategories.map((trend) => (
              <div key={trend.category} className="trend-card">
                <h3>{trend.category}</h3>
                <p className="trend-average">
                  Avg: {formatCurrency(trend.average, settings.currency)}
                </p>
                <div className="mini-trend">
                  {trend.data.map((point, idx) => (
                    <div
                      key={idx}
                      className="mini-trend__bar"
                      style={{
                        height: `${Math.max(
                          (point.amount / Math.max(...trend.data.map((d) => d.amount), 1)) * 60,
                          3
                        )}px`,
                      }}
                      title={`${formatMonth(point.month)}: ${formatCurrency(point.amount, settings.currency)}`}
                    />
                  ))}
                </div>
                <p className="trend-total">
                  Total: {formatCurrency(trend.total, settings.currency)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Spending Insights */}
      <section className="panel insight-recommendations">
        <h2>Spending Insights</h2>
        <ul className="insight-list">
          {spendingHabits[0] && (
            <li>
              📌 <strong>{spendingHabits[0].category}</strong> is your top expense at
              {" " + spendingHabits[0].percentage.toFixed(1)}% of total spending.
            </li>
          )}
          {savingsRate >= 20 && (
            <li>
              ✨ Excellent savings rate of <strong>{savingsRate}%</strong>. You're on track for
              financial success!
            </li>
          )}
          {savingsRate >= 10 && savingsRate < 20 && (
            <li>
              💡 Your savings rate is <strong>{savingsRate}%</strong>. Try to increase it further
              by reviewing discretionary spending.
            </li>
          )}
          {savingsRate < 10 && (
            <li>
              ⚠️ Your savings rate is low at <strong>{savingsRate}%</strong>. Consider budgeting
              to increase savings.
            </li>
          )}
          {monthComparison && monthComparison.expenseChange > 0 && (
            <li>
              📈 Spending increased by{" "}
              <strong>{Math.round(monthComparison.expenseChangePercent)}%</strong> this month
              compared to last.
            </li>
          )}
          {trendingCategories[0] && trendingCategories[0].average && (
            <li>
              🔍 <strong>{trendingCategories[0].category}</strong> averages{" "}
              {formatCurrency(trendingCategories[0].average, settings.currency)} per month.
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
 