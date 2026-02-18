/**
 * Backup & Restore Service
 * Handles exporting, importing, and migrating app data
 */

const BACKUP_VERSION = '1.0.0';
const REQUIRED_KEYS = ['transactions', 'budgets', 'goals', 'settings'];

/**
 * Collect all app data from localStorage
 * @returns {Object} - Complete app backup object
 */
export const collectAppData = () => {
  const backup = {
    version: BACKUP_VERSION,
    timestamp: new Date().toISOString(),
    data: {},
  };

  try {
    // Collect all finance-related data
    const transactions = localStorage.getItem('transactions');
    const budgets = localStorage.getItem('budgets');
    const goals = localStorage.getItem('goals');
    const settings = localStorage.getItem('settings');
    const user = localStorage.getItem('user');

    backup.data = {
      transactions: transactions ? JSON.parse(transactions) : [],
      budgets: budgets ? JSON.parse(budgets) : [],
      goals: goals ? JSON.parse(goals) : [],
      settings: settings ? JSON.parse(settings) : {},
      user: user ? JSON.parse(user) : null,
    };

    backup.stats = {
      transactionCount: backup.data.transactions?.length || 0,
      budgetCount: backup.data.budgets?.length || 0,
      goalCount: backup.data.goals?.length || 0,
      userEmail: backup.data.user?.email || 'Unknown',
    };

    return backup;
  } catch (error) {
    console.error('Error collecting app data:', error);
    throw new Error('Failed to collect backup data');
  }
};

/**
 * Create a downloadable backup file
 * @returns {string} - JSON string ready for download
 */
export const createBackupFile = () => {
  const backup = collectAppData();
  return JSON.stringify(backup, null, 2);
};

/**
 * Download backup as JSON file
 * @param {string} filename - Name of the file to download
 */
export const downloadBackup = (filename = null) => {
  try {
    const backupData = createBackupFile();
    const timestamp = new Date().toISOString().slice(0, 10);
    const finalFilename = filename || `budget-backup-${timestamp}.json`;

    // Create blob and download link
    const blob = new Blob([backupData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = finalFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Error downloading backup:', error);
    throw new Error('Failed to download backup file');
  }
};

/**
 * Validate backup file structure
 * @param {Object} backup - Backup object to validate
 * @returns {Object} - Validation result { valid: boolean, errors: string[] }
 */
export const validateBackup = (backup) => {
  const errors = [];

  if (!backup) {
    errors.push('Backup data is empty');
    return { valid: false, errors };
  }

  if (!backup.version) {
    errors.push('Missing backup version');
  }

  if (!backup.timestamp) {
    errors.push('Missing backup timestamp');
  }

  if (!backup.data) {
    errors.push('Missing backup data');
    return { valid: false, errors };
  }

  // Check for critical data keys
  const missingKeys = REQUIRED_KEYS.filter(key => !(key in backup.data));
  if (missingKeys.length > 0) {
    errors.push(`Missing required data: ${missingKeys.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Migrate backup data to current version if needed
 * @param {Object} backup - Backup object
 * @returns {Object} - Migrated backup
 */
export const migrateBackupData = (backup) => {
  let migratedBackup = { ...backup };

  // Migration from 0.x to 1.0.0
  if (!migratedBackup.version || migratedBackup.version < '1.0.0') {
    console.log('Migrating backup data to v1.0.0...');

    // Add missing data structures
    if (!migratedBackup.data.settings) {
      migratedBackup.data.settings = {
        theme: 'light',
        currency: 'USD',
        notifications: true,
      };
    }

    // Ensure user object exists
    if (!migratedBackup.data.user) {
      migratedBackup.data.user = null;
    }

    migratedBackup.version = BACKUP_VERSION;
    migratedBackup.migrated = true;
  }

  return migratedBackup;
};

/**
 * Restore app data from backup
 * @param {Object} backup - Backup object to restore
 * @param {Object} options - Restore options
 * @returns {Object} - Result { success: boolean, message: string }
 */
export const restoreFromBackup = (backup, options = {}) => {
  const {
    mergeMode = false, // false = replace, true = merge
    restoreUser = true,
    restoreSettings = true,
  } = options;

  try {
    // Validate backup
    const validation = validateBackup(backup);
    if (!validation.valid) {
      throw new Error(validation.errors.join('; '));
    }

    // Migrate if needed
    const migratedBackup = migrateBackupData(backup);

    // Prepare data for restore
    let dataToRestore = { ...migratedBackup.data };

    if (mergeMode) {
      // Merge mode: combine with existing data
      const transactions = [
        ...JSON.parse(localStorage.getItem('transactions') || '[]'),
        ...(dataToRestore.transactions || []),
      ];
      const budgets = [
        ...JSON.parse(localStorage.getItem('budgets') || '[]'),
        ...(dataToRestore.budgets || []),
      ];
      const goals = [
        ...JSON.parse(localStorage.getItem('goals') || '[]'),
        ...(dataToRestore.goals || []),
      ];

      dataToRestore = {
        transactions: transactions,
        budgets: budgets,
        goals: goals,
        settings: dataToRestore.settings,
        user: dataToRestore.user,
      };
    }

    // Restore data
    localStorage.setItem('transactions', JSON.stringify(dataToRestore.transactions || []));
    localStorage.setItem('budgets', JSON.stringify(dataToRestore.budgets || []));
    localStorage.setItem('goals', JSON.stringify(dataToRestore.goals || []));

    if (restoreSettings && dataToRestore.settings) {
      localStorage.setItem('settings', JSON.stringify(dataToRestore.settings));
    }

    if (restoreUser && dataToRestore.user) {
      localStorage.setItem('user', JSON.stringify(dataToRestore.user));
    }

    return {
      success: true,
      message: 'Data restored successfully',
      stats: {
        transactionsRestored: dataToRestore.transactions?.length || 0,
        budgetsRestored: dataToRestore.budgets?.length || 0,
        goalsRestored: dataToRestore.goals?.length || 0,
      },
    };
  } catch (error) {
    console.error('Error restoring backup:', error);
    return {
      success: false,
      message: error.message,
    };
  }
};

/**
 * Parse JSON file from upload
 * @param {File} file - File object from input
 * @returns {Promise<Object>} - Parsed backup object
 */
export const parseBackupFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const backup = JSON.parse(event.target.result);
        resolve(backup);
      } catch {
        reject(new Error('Invalid JSON file format'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
};

/**
 * Clear all app data (dangerous!)
 * @returns {boolean} - Success status
 */
export const clearAllData = () => {
  try {
    localStorage.removeItem('transactions');
    localStorage.removeItem('budgets');
    localStorage.removeItem('goals');
    localStorage.removeItem('settings');
    localStorage.removeItem('user');
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

/**
 * Get backup statistics
 * @returns {Object} - Backup stats
 */
export const getBackupStats = () => {
  const backup = collectAppData();
  return {
    version: backup.version,
    timestamp: backup.timestamp,
    size: new Blob([JSON.stringify(backup)]).size,
    ...backup.stats,
  };
};

export default {
  collectAppData,
  createBackupFile,
  downloadBackup,
  validateBackup,
  migrateBackupData,
  restoreFromBackup,
  parseBackupFile,
  clearAllData,
  getBackupStats,
  BACKUP_VERSION,
};
