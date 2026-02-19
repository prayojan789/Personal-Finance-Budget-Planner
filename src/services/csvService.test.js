import { describe, it, expect, beforeEach, vi } from 'vitest';
import { exportToCSV, importFromCSV } from '../services/csvService';

describe('csvService', () => {
  beforeEach(() => {
    // Mock document.createElement, link.click, etc.
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();
  });

  describe('exportToCSV', () => {
    it('should export transactions to CSV format', () => {
      const mockData = {
        transactions: [
          { type: 'income', description: 'Salary', amount: 5000, category: 'Work', date: '2024-01-15', note: 'Monthly salary' },
          { type: 'expense', description: 'Rent', amount: 1200, category: 'Housing', date: '2024-01-10', note: 'Apartment rent' },
        ],
        budgets: [],
        goals: [],
      };

      const createElement = vi.fn(() => ({
        click: vi.fn(),
      }));
      vi.spyOn(document, 'createElement').mockImplementation(createElement);

      exportToCSV(mockData);
      expect(createElement).toHaveBeenCalledWith('a');
    });

    it('should include all data sections (transactions, budgets, goals)', () => {
      const mockData = {
        transactions: [],
        budgets: [{ category: 'Food', limit: 500, month: '2024-01', alertAt: 80 }],
        goals: [{ name: 'Vacation', targetAmount: 10000, targetDate: '2024-12-31', savedAmount: 5000, createdAt: '2024-01-01' }],
      };

      const createElement = vi.fn(() => ({
        click: vi.fn(),
      }));
      vi.spyOn(document, 'createElement').mockImplementation(createElement);

      exportToCSV(mockData);
      expect(URL.createObjectURL).toHaveBeenCalled();
    });

    it('should handle special characters in descriptions', () => {
      const mockData = {
        transactions: [
          { type: 'expense', description: 'Coffee "Premium"', amount: 5, category: 'Food', date: '2024-01-15', note: 'Quote test' },
        ],
        budgets: [],
        goals: [],
      };

      const createElement = vi.fn(() => ({
        click: vi.fn(),
      }));
      vi.spyOn(document, 'createElement').mockImplementation(createElement);

      exportToCSV(mockData, 'test.csv');
      expect(createElement).toHaveBeenCalledWith('a');
    });
  });

  describe('importFromCSV', () => {
    it('should parse valid CSV with transactions', async () => {
      const csvContent = `type,description,amount,category,date,note
income,"Salary",5000,"Work","2024-01-15","Monthly salary"
expense,"Rent",1200,"Housing","2024-01-10","Apartment rent"`;

      const mockFile = new File([csvContent], 'test.csv', { type: 'text/csv' });
      const result = await importFromCSV(mockFile);

      expect(result.transactions).toHaveLength(2);
      expect(result.transactions[0]).toMatchObject({
        type: 'income',
        description: 'Salary',
        amount: 5000,
        category: 'Work',
      });
    });

    it('should parse budgets section', async () => {
      const csvContent = `type,description,amount,category,date,note

# BUDGETS
category,limit,month,alertAt
"Food",500,"2024-01",80
"Transport",200,"2024-01",75`;

      const mockFile = new File([csvContent], 'test.csv', { type: 'text/csv' });
      const result = await importFromCSV(mockFile);

      expect(result.budgets).toHaveLength(2);
      expect(result.budgets[0]).toMatchObject({
        category: 'Food',
        limit: 500,
      });
    });

    it('should parse goals section', async () => {
      const csvContent = `type,description,amount,category,date,note

# BUDGETS
category,limit,month,alertAt

# GOALS
name,targetAmount,targetDate,savedAmount,createdAt
"Vacation",10000,"2024-12-31",5000,"2024-01-01"`;

      const mockFile = new File([csvContent], 'test.csv', { type: 'text/csv' });
      const result = await importFromCSV(mockFile);

      expect(result.goals).toHaveLength(1);
      expect(result.goals[0]).toMatchObject({
        name: 'Vacation',
        targetAmount: 10000,
      });
    });

    it('should handle empty sections', async () => {
      const csvContent = `type,description,amount,category,date,note
income,"Salary",5000,"Work","2024-01-15",""

# BUDGETS
category,limit,month,alertAt

# GOALS
name,targetAmount,targetDate,savedAmount,createdAt`;

      const mockFile = new File([csvContent], 'test.csv', { type: 'text/csv' });
      const result = await importFromCSV(mockFile);

      expect(result.transactions).toHaveLength(1);
      expect(result.budgets).toHaveLength(0);
      expect(result.goals).toHaveLength(0);
    });

    it('should reject with error on invalid file', async () => {
      const mockFile = new File([], 'test.txt');
      vi.spyOn(FileReader.prototype, 'readAsText').mockImplementation(function() {
        this.onerror?.();
      });

      await expect(importFromCSV(mockFile)).rejects.toThrow();
    });

    it('should handle quoted values correctly', async () => {
      const csvContent = `type,description,amount,category,date,note
expense,"Coffee, Tea & Snacks",15,"Food","2024-01-15","Best cafe"`;

      const mockFile = new File([csvContent], 'test.csv', { type: 'text/csv' });
      const result = await importFromCSV(mockFile);

      expect(result.transactions[0].description).toBe('Coffee, Tea & Snacks');
    });
  });
});
