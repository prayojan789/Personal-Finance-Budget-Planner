import { describe, it, expect, beforeEach, vi } from 'vitest';
import { collectAppData, createBackupFile, downloadBackup, restoreFromBackup } from '../services/backupService';

describe('backupService', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.getItem.mockClear();
    localStorage.setItem.mockClear();
    localStorage.removeItem.mockClear();
  });

  describe('collectAppData', () => {
    it('should collect app data from localStorage', () => {
      const mockTransactions = [{ id: 1, type: 'income', amount: 100 }];
      const mockBudgets = [{ id: 1, category: 'Food', limit: 500 }];
      const mockSettings = { currency: 'USD', theme: 'light' };

      localStorage.getItem
        .mockImplementationOnce(() => JSON.stringify(mockTransactions))
        .mockImplementationOnce(() => JSON.stringify(mockBudgets))
        .mockImplementationOnce(() => JSON.stringify([]))
        .mockImplementationOnce(() => JSON.stringify(mockSettings));

      const backup = collectAppData();

      expect(backup).toHaveProperty('version');
      expect(backup).toHaveProperty('timestamp');
      expect(backup).toHaveProperty('data');
      expect(backup.data).toHaveProperty('transactions');
    });

    it('should include version and timestamp', () => {
      localStorage.getItem.mockReturnValue(null);
      const backup = collectAppData();

      expect(backup.version).toBe('1.0.0');
      expect(backup.timestamp).toBeDefined();
    });

    it('should handle missing localStorage keys gracefully', () => {
      localStorage.getItem.mockReturnValue(null);
      const backup = collectAppData();

      expect(backup.data.transactions).toEqual([]);
      expect(backup.data.budgets).toEqual([]);
      expect(backup.data.goals).toEqual([]);
      expect(backup.data.settings).toEqual({});
    });

    it('should generate statistics in backup', () => {
      const mockTransactions = [{ id: 1 }, { id: 2 }];
      localStorage.getItem
        .mockImplementationOnce(() => JSON.stringify(mockTransactions))
        .mockImplementationOnce(() => JSON.stringify([]))
        .mockImplementationOnce(() => JSON.stringify([]))
        .mockImplementationOnce(() => JSON.stringify({}));

      const backup = collectAppData();

      expect(backup.stats).toBeDefined();
      expect(backup.stats.transactionCount).toBe(2);
      expect(backup.stats.budgetCount).toBe(0);
    });

    it('should handle JSON parsing errors gracefully', () => {
      localStorage.getItem.mockReturnValue('invalid json');

      expect(() => collectAppData()).toThrow('Failed to collect backup data');
    });
  });

  describe('createBackupFile', () => {
    it('should return valid JSON string', () => {
      localStorage.getItem.mockReturnValue(null);
      const backupFile = createBackupFile();

      expect(() => JSON.parse(backupFile)).not.toThrow();
    });

    it('should contain all required properties', () => {
      localStorage.getItem.mockReturnValue(null);
      const backupFile = createBackupFile();
      const parsed = JSON.parse(backupFile);

      expect(parsed).toHaveProperty('version');
      expect(parsed).toHaveProperty('timestamp');
      expect(parsed).toHaveProperty('data');
      expect(parsed).toHaveProperty('stats');
    });
  });

  describe('downloadBackup', () => {
    it('should create and trigger download', () => {
      localStorage.getItem.mockReturnValue(null);
      const mockLink = document.createElement('a');
      const clickSpy = vi.spyOn(mockLink, 'click').mockImplementation(() => {});
      vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
      vi.spyOn(document.body, 'appendChild');
      vi.spyOn(document.body, 'removeChild');

      const result = downloadBackup();

      expect(result).toBe(true);
      expect(clickSpy).toHaveBeenCalled();
    });

    it('should generate filename with timestamp if not provided', () => {
      localStorage.getItem.mockReturnValue(null);
      const mockLink = document.createElement('a');
      vi.spyOn(mockLink, 'click').mockImplementation(() => {});
      vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
      vi.spyOn(document.body, 'appendChild');
      vi.spyOn(document.body, 'removeChild');

      downloadBackup();

      expect(mockLink.download).toMatch(/budget-backup-\d{4}-\d{2}-\d{2}\.json/);
    });

    it('should use provided filename', () => {
      localStorage.getItem.mockReturnValue(null);
      const mockLink = document.createElement('a');
      vi.spyOn(mockLink, 'click').mockImplementation(() => {});
      vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
      vi.spyOn(document.body, 'appendChild');
      vi.spyOn(document.body, 'removeChild');

      downloadBackup('custom-backup.json');

      expect(mockLink.download).toBe('custom-backup.json');
    });
  });

  describe('restoreFromBackup', () => {
    it('should parse and validate backup object', () => {
      const backupData = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        data: {
          transactions: [{ id: 1, type: 'income', amount: 100 }],
          budgets: [],
          goals: [],
          settings: {},
        },
      };

      const result = restoreFromBackup(backupData);

      expect(result.success).toBe(true);
      expect(result.stats).toBeDefined();
    });

    it('should return failure for invalid backup format', () => {
      const result = restoreFromBackup({});
      expect(result.success).toBe(false);
    });

    it('should restore data to localStorage', () => {
      const backupData = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        data: {
          transactions: [{ id: 1, type: 'income', amount: 100 }],
          budgets: [{ id: 1, category: 'Food', limit: 500 }],
          goals: [],
          settings: { currency: 'USD' },
        },
      };

      restoreFromBackup(backupData);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'transactions',
        JSON.stringify(backupData.data.transactions)
      );
    });
  });
});
