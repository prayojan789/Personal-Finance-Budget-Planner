import React, { useRef, useState } from "react";
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import Button from "../common/Button.jsx";
import Modal from "../common/Modal.jsx";
import {
  downloadBackup,
  parseBackupFile,
  restoreFromBackup,
  getBackupStats,
  clearAllData,
} from "../../services/backupService.js";
import { useToast } from "../../context/toastCore.js";
import "./BackupRestore.css";

export default function BackupRestore() {
  const fileInputRef = useRef(null);
  const { success, error } = useToast();
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [mergeMode, setMergeMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [backupStats, setBackupStats] = useState(null);

  // Load backup stats on mount
  React.useEffect(() => {
    updateBackupStats();
  }, []);

  const updateBackupStats = () => {
    try {
      const stats = getBackupStats();
      setBackupStats(stats);
    } catch (err) {
      console.error("Error loading backup stats:", err);
    }
  };

  const handleDownloadBackup = async () => {
    try {
      setIsLoading(true);
      downloadBackup();
      success("Backup downloaded successfully! 📥");
      updateBackupStats();
    } catch (err) {
      error(`Failed to download backup: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const backup = await parseBackupFile(file);

      // Show confirmation modal
      setShowRestoreModal(true);

      // Store backup for later restoration
      window.pendingBackup = backup;
    } catch (err) {
      error(`Failed to read backup file: ${err.message}`);
    } finally {
      setIsLoading(false);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRestoreConfirm = () => {
    try {
      setIsLoading(true);
      const result = restoreFromBackup(window.pendingBackup, {
        mergeMode,
        restoreUser: true,
        restoreSettings: true,
      });

      if (result.success) {
        success(
          `Data restored! 📥\n${result.stats.transactionsRestored} transactions, ${result.stats.budgetsRestored} budgets`,
        );
        setShowRestoreModal(false);
        updateBackupStats();

        // Reload page to reflect changes
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        error(`Restore failed: ${result.message}`);
      }
    } catch (err) {
      error(`Error during restore: ${err.message}`);
    } finally {
      setIsLoading(false);
      window.pendingBackup = null;
    }
  };

  const handleClearData = () => {
    try {
      setIsLoading(true);
      const isSuccess = clearAllData();

      if (isSuccess) {
        success("All data cleared successfully! 🗑️");
        setShowClearModal(false);
        updateBackupStats();

        // Reload page
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        error("Failed to clear data");
      }
    } catch (err) {
      error(`Error clearing data: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="backup-restore">
      <h3>Backup & Restore</h3>
      <p className="backup-restore__description">
        Secure your financial data by backing it up and restoring it whenever
        needed.
      </p>

      {/* Backup Stats */}
      {backupStats && (
        <div className="backup-stats">
          <div className="stat-card">
            <div className="stat-label">Total Data Size</div>
            <div className="stat-value">{formatBytes(backupStats.size)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Transactions</div>
            <div className="stat-value">{backupStats.transactionCount}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Budgets</div>
            <div className="stat-value">{backupStats.budgetCount}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Last Backup</div>
            <div className="stat-value">
              {new Date(backupStats.timestamp).toLocaleDateString()}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="backup-actions">
        <div className="action-group">
          <h4>Export Backup</h4>
          <p>Download all your data as a JSON file for safekeeping.</p>
          <Button
            className="btn--primary"
            onClick={handleDownloadBackup}
            disabled={isLoading}
            loading={isLoading}
            ariaLabel="Download backup file"
          >
            <ArrowDownTrayIcon className="icon" aria-hidden="true" />
            Download Backup
          </Button>
        </div>

        <div className="action-group">
          <h4>Import Backup</h4>
          <p>Restore your data from a previously downloaded backup file.</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
            style={{ display: "none" }}
            aria-label="Select backup file to upload"
          />
          <Button
            className="btn--primary"
            onClick={handleUploadClick}
            disabled={isLoading}
            loading={isLoading}
            ariaLabel="Upload and restore backup file"
          >
            <ArrowUpTrayIcon className="icon" aria-hidden="true" />
            Import Backup
          </Button>
        </div>

        <div className="action-group action-group--danger">
          <h4>Danger Zone</h4>
          <p>Permanently delete all your data. This action cannot be undone.</p>
          <Button
            className="btn--danger"
            onClick={() => setShowClearModal(true)}
            disabled={isLoading}
            ariaLabel="Clear all data - warning, this cannot be undone"
          >
            <TrashIcon className="icon" aria-hidden="true" />
            Clear All Data
          </Button>
        </div>
      </div>

      {/* Restore Confirmation Modal */}
      <Modal
        open={showRestoreModal}
        title="Restore Backup"
        onClose={() => setShowRestoreModal(false)}
      >
        <div className="modal-content">
          <p>Choose how you want to restore this backup:</p>

          <div className="restore-options">
            <label className="option-card">
              <input
                type="radio"
                name="restore-mode"
                value="replace"
                checked={!mergeMode}
                onChange={() => setMergeMode(false)}
                aria-label="Replace all data with backup"
              />
              <div className="option-content">
                <strong>Replace All Data</strong>
                <p>Your current data will be replaced with the backup data.</p>
              </div>
            </label>

            <label className="option-card">
              <input
                type="radio"
                name="restore-mode"
                value="merge"
                checked={mergeMode}
                onChange={() => setMergeMode(true)}
                aria-label="Merge backup with existing data"
              />
              <div className="option-content">
                <strong>Merge with Existing Data</strong>
                <p>The backup data will be added to your current data.</p>
              </div>
            </label>
          </div>

          <div className="modal-actions">
            <Button
              className="btn--secondary"
              onClick={() => setShowRestoreModal(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="btn--primary"
              onClick={handleRestoreConfirm}
              loading={isLoading}
            >
              Restore
            </Button>
          </div>
        </div>
      </Modal>

      {/* Clear Data Confirmation Modal */}
      <Modal
        open={showClearModal}
        title="Clear All Data"
        onClose={() => setShowClearModal(false)}
      >
        <div className="modal-content modal-content--warning">
          <div className="warning-header">
            <ExclamationTriangleIcon
              className="icon icon--lg"
              aria-hidden="true"
            />
            <h3>Are you absolutely sure?</h3>
          </div>

          <p>This action will permanently delete all your data including:</p>
          <ul className="warning-list">
            <li>All transactions</li>
            <li>All budgets</li>
            <li>All financial goals</li>
            <li>Your settings</li>
          </ul>

          <p className="warning-text">
            <strong>
              This action cannot be undone. Please make sure you have a backup
              before proceeding.
            </strong>
          </p>

          <div className="modal-actions">
            <Button
              className="btn--secondary"
              onClick={() => setShowClearModal(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="btn--danger"
              onClick={handleClearData}
              loading={isLoading}
              disabled={isLoading}
            >
              Yes, Delete Everything
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
