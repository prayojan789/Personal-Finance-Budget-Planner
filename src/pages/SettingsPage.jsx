import SettingsPanel from "../features/settings/SettingsPanel.jsx";

export default function SettingsPage() {
  return (
    <div className="page">
      <div className="page__header">
        <h1>Settings</h1>
        <p>Manage your preferences and account.</p>
      </div>
      <SettingsPanel />
    </div>
  );
}
