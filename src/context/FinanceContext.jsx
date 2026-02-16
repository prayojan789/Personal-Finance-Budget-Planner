/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo } from "react";
import useLocalStorage from "../hooks/useLocalStorage.js";

const FinanceContext = createContext(null);
const STORAGE_KEY = "budget-planner-data";
const defaultData = {
  transactions: [],
  budgets: [],
  goals: [],
  settings: {
    currency: "NPR",
    timezone: "Asia/Kathmandu",
    theme: "light",
  },
};

const defaultCategories = [
  "Housing",
  "Food",
  "Transport",
  "Utilities",
  "Health",
  "Savings",
  "Entertainment",
  "Income",
  "Other",
];

const createId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const getMonthKey = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}`;
};

export function FinanceProvider({ children }) {
  const [data, setData] = useLocalStorage(STORAGE_KEY, defaultData);

  // Auto-migrate to NPR if still using USD
  if (data.settings?.currency === "USD") {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, currency: "NPR", timezone: "Asia/Kathmandu" },
    }));
  }

  const addTransaction = useCallback((transaction) => {
    const next = {
      ...transaction,
      id: createId(),
    };
    setData((prev) => ({
      ...prev,
      transactions: [next, ...prev.transactions],
    }));
  }, [setData]);

  const updateTransaction = useCallback((id, updates) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.map((transaction) =>
        transaction.id === id ? { ...transaction, ...updates } : transaction
      ),
    }));
  }, [setData]);

  const deleteTransaction = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((transaction) => transaction.id !== id),
    }));
  }, [setData]);

  const addBudget = useCallback((budget) => {
    const next = {
      alertAt: 80,
      period: "monthly",
      ...budget,
      id: createId(),
    };
    setData((prev) => ({
      ...prev,
      budgets: [next, ...prev.budgets],
    }));
  }, [setData]);

  const updateBudget = useCallback((id, updates) => {
    setData((prev) => ({
      ...prev,
      budgets: prev.budgets.map((budget) =>
        budget.id === id ? { ...budget, ...updates } : budget
      ),
    }));
  }, [setData]);

  const deleteBudget = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      budgets: prev.budgets.filter((budget) => budget.id !== id),
    }));
  }, [setData]);

  const addGoal = useCallback((goal) => {
    const next = {
      ...goal,
      id: createId(),
    };
    setData((prev) => ({
      ...prev,
      goals: [next, ...(prev.goals || [])],
    }));
  }, [setData]);

  const updateGoal = useCallback((id, updates) => {
    setData((prev) => ({
      ...prev,
      goals: (prev.goals || []).map((goal) =>
        goal.id === id ? { ...goal, ...updates } : goal
      ),
    }));
  }, [setData]);

  const deleteGoal = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      goals: (prev.goals || []).filter((goal) => goal.id !== id),
    }));
  }, [setData]);

  const resetData = useCallback(() => {
    setData((prev) => ({
      ...prev,
      transactions: [],
      budgets: [],
      goals: [],
    }));
  }, [setData]);

  const updateSettings = useCallback((updates) => {
    setData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...updates,
      },
    }));
  }, [setData]);

  const transactions = data.transactions;
  const budgets = data.budgets;
  const goals = data.goals || [];
  const settings = data.settings;

  const totals = transactions.reduce(
    (acc, transaction) => {
      const amount = Number(transaction.amount || 0);
      if (transaction.type === "income") {
        acc.income += amount;
      } else {
        acc.expenses += amount;
      }
      acc.balance = acc.income - acc.expenses;
      return acc;
    },
    { income: 0, expenses: 0, balance: 0 }
  );

  const monthlySummary = transactions.reduce((acc, transaction) => {
    const key = getMonthKey(transaction.date);
    if (!key) return acc;
    if (!acc[key]) {
      acc[key] = { month: key, income: 0, expenses: 0 };
    }
    const amount = Number(transaction.amount || 0);
    if (transaction.type === "income") {
      acc[key].income += amount;
    } else {
      acc[key].expenses += amount;
    }
    return acc;
  }, {});

  const categoryTotals = transactions.reduce((acc, transaction) => {
    if (transaction.type !== "expense") return acc;
    const category = transaction.category || "Other";
    acc[category] = (acc[category] || 0) + Number(transaction.amount || 0);
    return acc;
  }, {});

  const currentMonthKey = getMonthKey(new Date());
  const budgetsWithSpend = budgets.map((budget) => {
    const budgetMonthKey = budget.month || getMonthKey(budget.startDate) || currentMonthKey;
    const spent = transactions
      .filter((transaction) => {
        if (transaction.type !== "expense") return false;
        const matchesCategory = (transaction.category || "Other") === budget.category;
        const matchesMonth = getMonthKey(transaction.date) === budgetMonthKey;
        return matchesCategory && matchesMonth;
      })
      .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);
    const limit = Number(budget.limit || 0);
    const remaining = limit - spent;
    const progress = limit ? Math.min((spent / limit) * 100, 120) : 0;
    const alertAt = Number(budget.alertAt || 80);
    const isOver = remaining < 0 || progress >= 100;
    const isWarning = !isOver && limit > 0 && progress >= alertAt;
    return {
      ...budget,
      monthKey: budgetMonthKey,
      spent,
      remaining,
      progress,
      alertAt,
      status: isOver ? "danger" : isWarning ? "warning" : "neutral",
    };
  });

  const alerts = budgetsWithSpend.filter(
    (budget) => budget.limit && (budget.progress >= budget.alertAt || budget.remaining < 0)
  );

  // Advanced Analytics
  const monthlySummaryArray = Object.values(monthlySummary).sort((a, b) =>
    a.month.localeCompare(b.month)
  );

  // Month-to-month comparison
  const monthComparison = useMemo(() => {
    if (monthlySummaryArray.length < 2) return null;
    const current = monthlySummaryArray[monthlySummaryArray.length - 1];
    const previous = monthlySummaryArray[monthlySummaryArray.length - 2];
    return {
      currentMonth: current.month,
      previousMonth: previous.month,
      expenseChange: current.expenses - previous.expenses,
      expenseChangePercent:
        previous.expenses > 0
          ? ((current.expenses - previous.expenses) / previous.expenses) * 100
          : 0,
      incomeChange: current.income - previous.income,
      incomeChangePercent:
        previous.income > 0 ? ((current.income - previous.income) / previous.income) * 100 : 0,
    };
  }, [monthlySummaryArray]);

  // Category trends over last 6 months
  const categoryTrends = useMemo(() => {
    const trends = {};
    const last6Months = monthlySummaryArray.slice(-6);
    
    last6Months.forEach((month) => {
      const monthTxns = transactions.filter(
        (t) => t.type === "expense" && getMonthKey(t.date) === month.month
      );
      monthTxns.forEach((txn) => {
        const cat = txn.category || "Other";
        if (!trends[cat]) trends[cat] = [];
        trends[cat].push({ month: month.month, amount: Number(txn.amount || 0) });
      });
    });

    Object.keys(trends).forEach((cat) => {
      trends[cat] = {
        category: cat,
        data: trends[cat].sort((a, b) => a.month.localeCompare(b.month)),
        average: trends[cat].reduce((sum, d) => sum + d.amount, 0) / trends[cat].length,
        total: trends[cat].reduce((sum, d) => sum + d.amount, 0),
      };
    });
    
    return trends;
  }, [monthlySummaryArray, transactions]);

  // Spending forecast (next month based on current trend)
  const spendingForecast = useMemo(() => {
    if (monthlySummaryArray.length === 0) return null;
    const last3Months = monthlySummaryArray.slice(-3);
    const avgExpenses =
      last3Months.reduce((sum, m) => sum + m.expenses, 0) / Math.max(last3Months.length, 1);
    const avgIncome =
      last3Months.reduce((sum, m) => sum + m.income, 0) / Math.max(last3Months.length, 1);
    const trendExpenses = last3Months.map((m) => m.expenses);
    const isIncreasing =
      trendExpenses.length >= 2 &&
      trendExpenses[trendExpenses.length - 1] > trendExpenses[trendExpenses.length - 2];

    return {
      projectedExpenses: avgExpenses,
      projectedIncome: avgIncome,
      trend: isIncreasing ? "increasing" : "decreasing",
      confidence: Math.min(last3Months.length * 0.33, 1),
    };
  }, [monthlySummaryArray]);

  // Savings rate calculation
  const savingsRate = useMemo(() => {
    const last12Months = monthlySummaryArray.slice(-12);
    if (last12Months.length === 0) return 0;
    const totalIncome = last12Months.reduce((sum, m) => sum + m.income, 0);
    const totalExpenses = last12Months.reduce((sum, m) => sum + m.expenses, 0);
    if (totalIncome === 0) return 0;
    return Math.round(((totalIncome - totalExpenses) / totalIncome) * 100);
  }, [monthlySummaryArray]);

  // Spending habits by category (percentage)
  const spendingHabits = useMemo(() => {
    const habits = {};
    const totalExpense = Object.values(categoryTotals).reduce((sum, v) => sum + v, 0);
    if (totalExpense === 0) return [];
    
    Object.entries(categoryTotals).forEach(([cat, amount]) => {
      habits[cat] = {
        category: cat,
        amount,
        percentage: (amount / totalExpense) * 100,
      };
    });

    return Object.values(habits).sort((a, b) => b.amount - a.amount);
  }, [categoryTotals]);

  const value = useMemo(
    () => ({
      transactions,
      budgets,
      goals,
      settings,
      totals,
      monthlySummary: monthlySummaryArray,
      categoryTotals,
      budgetsWithSpend,
      alerts,
      categories: defaultCategories,
      // Advanced analytics
      monthComparison,
      categoryTrends,
      spendingForecast,
      savingsRate,
      spendingHabits,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addBudget,
      updateBudget,
      deleteBudget,
      addGoal,
      updateGoal,
      deleteGoal,
      resetData,
      updateSettings,
    }),
    [
      transactions,
      budgets,
      goals,
      settings,
      totals,
      monthlySummaryArray,
      categoryTotals,
      budgetsWithSpend,
      alerts,
      monthComparison,
      categoryTrends,
      spendingForecast,
      savingsRate,
      spendingHabits,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addBudget,
      updateBudget,
      deleteBudget,
      addGoal,
      updateGoal,
      deleteGoal,
      resetData,
      updateSettings,
    ]
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within FinanceProvider");
  }
  return context;
}
