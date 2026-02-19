import { useState, useMemo } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import "./Calendar.css";

export default function Calendar({ transactions = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const transactionsByDate = useMemo(() => {
    const map = {};
    transactions.forEach((tx) => {
      const date = new Date(tx.date);
      const key = formatDateKey(date);
      if (!map[key]) {
        map[key] = { transactions: [], income: 0, expense: 0 };
      }
      map[key].transactions.push(tx);
      if (tx.type === "income") {
        map[key].income += tx.amount;
      } else {
        map[key].expense += tx.amount;
      }
    });
    return map;
  }, [transactions]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weeks = [];
  let currentWeek = Array(firstDay).fill(null);

  days.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    currentWeek.push(...Array(7 - currentWeek.length).fill(null));
    weeks.push(currentWeek);
  }

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
    setSelectedDate(null);
  };

  const handleDateClick = (day) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(date);
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const selectedDateKey = selectedDate ? formatDateKey(selectedDate) : null;
  const selectedDayData = selectedDateKey
    ? transactionsByDate[selectedDateKey]
    : null;

  return (
    <div className="calendar-container">
      <div className="calendar-grid">
        {/* Header */}
        <div className="calendar-header">
          <button
            className="calendar-nav-btn"
            onClick={previousMonth}
            aria-label="Previous month"
          >
            <ChevronLeftIcon className="calendar-nav-icon" />
          </button>
          <h3 className="calendar-month">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button
            className="calendar-nav-btn"
            onClick={nextMonth}
            aria-label="Next month"
          >
            <ChevronRightIcon className="calendar-nav-icon" />
          </button>
        </div>

        {/* Quick Action Button */}
        <button className="calendar-today-btn" onClick={handleToday}>
          Today
        </button>

        {/* Weekday Headers */}
        <div className="calendar-weekdays">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="calendar-weekday">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="calendar-days">
          {weeks.map((week, weekIndex) =>
            week.map((day, dayIndex) => {
              if (day === null) {
                return <div key={`empty-${weekIndex}-${dayIndex}`}></div>;
              }

              const date = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
              );
              const dateKey = formatDateKey(date);
              const dayData = transactionsByDate[dateKey];
              const isSelected =
                selectedDate &&
                formatDateKey(selectedDate) === dateKey;
              const isToday =
                new Date().toDateString() === date.toDateString();

              return (
                <button
                  key={day}
                  className={`calendar-day ${isSelected ? "selected" : ""} ${isToday ? "today" : ""}`}
                  onClick={() => handleDateClick(day)}
                  aria-pressed={isSelected}
                  type="button"
                >
                  <div className="calendar-day-number">{day}</div>
                  {dayData && (
                    <div className="calendar-day-summary">
                      <div className="calendar-day-count">
                        {dayData.transactions.length}
                      </div>
                      <div className="calendar-day-balance">
                        <span className="calendar-income">
                          +${dayData.income.toFixed(0)}
                        </span>
                        {dayData.expense > 0 && (
                          <span className="calendar-expense">
                            -${dayData.expense.toFixed(0)}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDayData && (
        <div className="calendar-details">
          <h4 className="calendar-details-title">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h4>

          <div className="calendar-details-summary">
            <div className="calendar-details-stat">
              <span className="calendar-details-label">Transactions</span>
              <span className="calendar-details-value">
                {selectedDayData.transactions.length}
              </span>
            </div>
            <div className="calendar-details-stat">
              <span className="calendar-details-label">Income</span>
              <span className="calendar-details-value calendar-income">
                +${selectedDayData.income.toFixed(2)}
              </span>
            </div>
            <div className="calendar-details-stat">
              <span className="calendar-details-label">Expense</span>
              <span className="calendar-details-value calendar-expense">
                -${selectedDayData.expense.toFixed(2)}
              </span>
            </div>
            <div className="calendar-details-stat">
              <span className="calendar-details-label">Net</span>
              <span
                className={`calendar-details-value ${
                  selectedDayData.income - selectedDayData.expense >= 0
                    ? "calendar-income"
                    : "calendar-expense"
                }`}
              >
                ${(selectedDayData.income - selectedDayData.expense).toFixed(2)}
              </span>
            </div>
          </div>

          {selectedDayData.transactions.length > 0 && (
            <div className="calendar-transactions">
              <h5 className="calendar-transactions-title">Transactions</h5>
              <div className="calendar-transactions-list">
                {selectedDayData.transactions.map((tx, index) => (
                  <div
                    key={`${tx.id}-${index}`}
                    className="calendar-transaction-item"
                  >
                    <div className="calendar-transaction-info">
                      <span className="calendar-transaction-category">
                        {tx.category}
                      </span>
                      {tx.description && (
                        <span className="calendar-transaction-description">
                          {tx.description}
                        </span>
                      )}
                    </div>
                    <span
                      className={`calendar-transaction-amount ${tx.type}`}
                    >
                      {tx.type === "income" ? "+" : "-"}$
                      {tx.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
