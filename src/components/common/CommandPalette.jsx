import { useEffect, useMemo, useRef, useState } from "react";
import { useFinance } from "../../context/FinanceContext.jsx";
import formatCurrency from "../../utils/formatCurrency.js";
import Modal from "./Modal.jsx";

const navItems = [
  { id: "home", label: "Home" },
  { id: "dashboard", label: "Dashboard" },
  { id: "transactions", label: "Transactions" },
  { id: "calendar", label: "Calendar" },
  { id: "budgets", label: "Budgets" },
  { id: "goals", label: "Goals" },
  { id: "insights", label: "Insights" },
  { id: "analytics", label: "Analytics" },
  { id: "reports", label: "Reports" },
  { id: "settings", label: "Settings" },
];

export default function CommandPalette({ currentPage, onNavigate }) {
  const { transactions, settings } = useFinance();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const openPalette = () => {
    setQuery("");
    setSelectedIndex(0);
    setOpen(true);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const isCommand = event.ctrlKey || event.metaKey;
      if (isCommand && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openPalette();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [open]);

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();

    const baseActions = [
      {
        id: "quick-add",
        type: "action",
        label: "Quick add transaction",
        description: "Jump to the transaction form",
        action: () => {
          onNavigate("transactions");
          window.dispatchEvent(new Event("focus-transaction-form"));
        },
      },
      ...navItems.map((item) => ({
        id: `nav-${item.id}`,
        type: "nav",
        label: `Go to ${item.label}`,
        description: item.id === currentPage ? "Current page" : "",
        action: () => onNavigate(item.id),
      })),
    ];

    if (!trimmed) {
      return baseActions;
    }

    const matchedTransactions = transactions
      .filter((transaction) => {
        const description = (transaction.description || "").toLowerCase();
        const category = (transaction.category || "").toLowerCase();
        const note = (transaction.note || "").toLowerCase();
        return (
          description.includes(trimmed) ||
          category.includes(trimmed) ||
          note.includes(trimmed)
        );
      })
      .slice(0, 6)
      .map((transaction) => ({
        id: `txn-${transaction.id}`,
        type: "transaction",
        label: transaction.description || transaction.category || "Untitled transaction",
        description: `${formatCurrency(transaction.amount, settings.currency)} · ${transaction.category || "Other"}`,
        action: () => {
          onNavigate("transactions");
          const searchValue = transaction.description || transaction.category || "";
          window.dispatchEvent(
            new CustomEvent("command-palette-search", {
              detail: { query: searchValue },
            })
          );
        },
      }));

    const searchAction = {
      id: "search-transactions",
      type: "action",
      label: `Search transactions for "${query}"`,
      description: "Open transactions with this search applied",
      action: () => {
        onNavigate("transactions");
        window.dispatchEvent(
          new CustomEvent("command-palette-search", {
            detail: { query: query.trim() },
          })
        );
      },
    };

    return [searchAction, ...matchedTransactions, ...baseActions].slice(0, 10);
  }, [query, transactions, settings.currency, currentPage, onNavigate]);


  const handleClose = () => setOpen(false);

  const handleSelect = (item) => {
    item.action();
    setOpen(false);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const item = results[selectedIndex];
      if (item) handleSelect(item);
    }
  };

  return (
    <Modal open={open} title="Command Palette" onClose={handleClose}>
      <div className="command-palette">
        <label className="sr-only" htmlFor="command-palette-input">
          Search commands
        </label>
        <input
          ref={inputRef}
          id="command-palette-input"
          className="command-palette__input"
          placeholder="Search transactions or jump to a page"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSelectedIndex(0);
          }}
          onKeyDown={handleInputKeyDown}
          autoComplete="off"
        />
        <div className="command-palette__hint">Tip: Press Ctrl+K or Cmd+K</div>
        <div className="command-palette__list" role="listbox">
          {results.length === 0 ? (
            <div className="command-palette__empty">No results found.</div>
          ) : (
            results.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`command-palette__item ${
                  index === selectedIndex ? "command-palette__item--active" : ""
                }`}
                onClick={() => handleSelect(item)}
                role="option"
                aria-selected={index === selectedIndex}
              >
                <span className="command-palette__item-label">{item.label}</span>
                {item.description && (
                  <span className="command-palette__item-meta">{item.description}</span>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}
