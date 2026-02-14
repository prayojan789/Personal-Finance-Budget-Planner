import { useFinance } from "../../context/FinanceContext.jsx";
import Button from "../../components/common/Button.jsx";

const timezones = ["local", "UTC", "America/New_York", "Europe/London", "Asia/Tokyo", "Asia/Kathmandu"];
const currencies = ["NPR", "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "INR"];

export default function SettingsPanel() {
  const { settings, updateSettings } = useFinance();

  const handleChange = (event) => {
    const { name, value } = event.target;
    updateSettings({ [name]: value });
  };

  return (
    <section className="panel" id="settings">
      <div className="section-header">
        <h2>Settings</h2>
        <span className="section-tag">Localization</span>
      </div>
      <div className="settings-grid">
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
        <div className="settings-note">
          <p className="muted">
            Timezone is used for date grouping and reports. Currency updates apply instantly.
          </p>
          <Button type="button">Save preferences</Button>
        </div>
      </div>
    </section>
  ); 
}
