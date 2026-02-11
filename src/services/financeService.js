const STORAGE_KEY = "budget-planner-data";

export function getFinanceData() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored
      ? JSON.parse(stored)
      : { transactions: [], budgets: [], settings: { currency: "NPR", timezone: "Asia/Kathmandu" } };
  } catch {
    return { transactions: [], budgets: [], settings: { currency: "NPR", timezone: "Asia/Kathmandu" } };
  }
}

export function saveFinanceData(data) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore write errors.
  }
}

const toCsv = (rows) => {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (value) => {
    const safe = String(value ?? "").replace(/"/g, '""');
    return `"${safe}"`;
  };
  const lines = [headers.join(",")];
  rows.forEach((row) => {
    lines.push(headers.map((key) => escape(row[key])).join(","));
  });
  return lines.join("\n");
};

export function downloadCsv(filename, rows) {
  const csv = toCsv(rows);
  if (!csv) return;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
