import { createContext, useContext, useMemo } from "react";
import useLocalStorage from "../hooks/useLocalStorage.js";

const FinanceContext = createContext(null);
const STORAGE_KEY = "budget-planner-data";
const defaultData = {
  transactions: [],
  budgets: [],
  settings: {
    currency: "NPR",
    timezone: "Asia/Kathmandu",
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

  const addTransaction = (transaction) => {
    const next = {
      ...transaction,
      id: createId(),
    };
    setData((prev) => ({
      ...prev,
      transactions: [next, ...prev.transactions],
    }));
  };

  const updateTransaction = (id, updates) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.map((transaction) =>
        transaction.id === id ? { ...transaction, ...updates } : transaction
      ),
    }));
  };

  const deleteTransaction = (id) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((transaction) => transaction.id !== id),
    }));
  };

  const addBudget = (budget) => {
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
  };

  const updateBudget = (id, updates) => {
    setData((prev) => ({
      ...prev,
      budgets: prev.budgets.map((budget) =>
        budget.id === id ? { ...budget, ...updates } : budget
      ),
    }));
  };

  const deleteBudget = (id) => {
    setData((prev) => ({
      ...prev,
      budgets: prev.budgets.filter((budget) => budget.id !== id),
    }));
  };

  const updateSettings = (updates) => {
    setData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...updates,
      },
    }));
  };

  const transactions = data.transactions;
  const budgets = data.budgets;
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

  const budgetsWithSpend = budgets.map((budget) => {
    const spent = transactions
      .filter(
        (transaction) =>
          transaction.type === "expense" &&
          (transaction.category || "Other") === budget.category
      )
      .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);
    const remaining = Number(budget.limit || 0) - spent;
    const progress = budget.limit ? Math.min((spent / budget.limit) * 100, 120) : 0;
    return {
      ...budget,
      spent,
      remaining,
      progress,
    };
  });

  const alerts = budgetsWithSpend.filter(
    (budget) => budget.limit && budget.progress >= (budget.alertAt || 80)
  );

  const value = useMemo(
    () => ({
      transactions,
      budgets,
      settings,
      totals,
      monthlySummary: Object.values(monthlySummary).sort((a, b) =>
        a.month.localeCompare(b.month)
      ),
      categoryTotals,
      budgetsWithSpend,
      alerts,
      categories: defaultCategories,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addBudget,
      updateBudget,
      deleteBudget,
      updateSettings,
    }),
    [
      transactions,
      budgets,
      settings,
      totals,
      monthlySummary,
      categoryTotals,
      budgetsWithSpend,
      alerts,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addBudget,
      updateBudget,
      deleteBudget,
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
