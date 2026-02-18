import { useRef } from "react";
import { useFinance } from "../../context/FinanceContext.jsx";
import { useToast } from "../../context/toastCore.js";
import Button from "../../components/common/Button.jsx";
import BackupRestore from "../../components/BackupRestore.jsx";
import { exportToCSV, importFromCSV } from "../../services/csvService.js";

const timezones = ["local", "UTC", "America/New_York", "Europe/London", "Asia/Tokyo", "Asia/Kathmandu"];
const currencies = ["NPR", "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "INR"];
const themes = ["light", "dark"];

export default function SettingsPanel() {
  const {
    settings,
    updateSettings,
    transactions,
    budgets,
    goals,
    addTransaction,
    addBudget,
    addGoal,
    resetData,
  } = useFinance();
  const toast = useToast();
  const fileInputRef = useRef(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    updateSettings({ [name]: value });
  };

  const handleExport = () => {
    const timestamp = new Date().toISOString().slice(0, 10);
    exportToCSV(
      { transactions, budgets, goals },
      `budget-planner-export-${timestamp}.csv`
    );
    toast.success("Data exported successfully!");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { transactions: importedTxns, budgets: importedBudgets, goals: importedGoals } =
        await importFromCSV(file);

      let addedCount = 0;
      importedTxns.forEach((txn) => {
        addTransaction(txn);
        addedCount++;
      });

      importedBudgets.forEach((budget) => {
        addBudget(budget);
        addedCount++;
      });

      importedGoals.forEach((goal) => {
        addGoal(goal);
        addedCount++;
      });

      toast.success(`Imported ${addedCount} items successfully!`);
    } catch (error) {
      toast.error(`Import failed: ${error.message}`);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      "This will clear all transactions, budgets, and savings goals. Continue?"
    );
    if (!confirmed) return;
    resetData();
    toast.info("All data has been reset.");
  };

  return (
    <section className="panel" id="settings">
      <div className="section-header">
        <h2>Settings</h2>
        <span className="section-tag">Preferences & Data</span>
      </div>
      <div className="settings-grid">
        <div>
          <h3>Localization</h3>
          <label className="field">
            <span className="field__label">Currency</span>
            <select name="currency" value={settings.currency} onChange={handleChange}>
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field__label">Timezone</span>
            <select name="timezone" value={settings.timezone} onChange={handleChange}>
              {timezones.map((timezone) => (
                <option key={timezone} value={timezone}>
                  {timezone}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field__label">Theme</span>
            <select name="theme" value={settings.theme || "light"} onChange={handleChange}>
              {themes.map((theme) => (
                <option key={theme} value={theme}>
                  {theme[0].toUpperCase() + theme.slice(1)}
                </option>
              ))}
            </select>
          </label>
          <div className="settings-note">
            <p className="muted">
              Timezone is used for date grouping and reports. Currency updates apply instantly.
            </p>
          </div>
        </div>

        <div>
          <h3>Data Management</h3>
          <div className="settings-section">
            <p className="settings-label">Export your data as CSV</p>
            <p className="muted">Backup transactions, budgets, and savings goals to a CSV file.</p>
            <Button className="btn--primary" onClick={handleExport}>
              Export Data
            </Button>
          </div>

          <div className="settings-section">
            <p className="settings-label">Import data from CSV</p>
            <p className="muted">Load transactions, budgets, and goals from a previously exported file.</p>
            <Button onClick={handleImportClick}>Import Data</Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />
          </div>

          <div className="settings-section">
            <p className="settings-label">Reset local data</p>
            <p className="muted">Clear transactions, budgets, and savings goals from this device.</p>
            <Button className="btn--ghost" type="button" onClick={handleReset}>
              Reset Data
            </Button>
          </div>

          {/* Backup & Restore Component */}
          <BackupRestore />
        </div>
      </div>
    </section>
   );
}
