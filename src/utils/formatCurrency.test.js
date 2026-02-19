import { describe, it, expect } from 'vitest';
import formatCurrency from '../utils/formatCurrency';

describe('formatCurrency', () => {
  it('should format a valid positive number', () => {
    const result = formatCurrency(1000);
    expect(result).toContain('1,000');
  });

  it('should handle decimal values', () => {
    const result = formatCurrency(99.99);
    expect(result).toContain('99.99');
  });

  it('should handle zero', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0');
  });

  it('should handle null or undefined as 0', () => {
    expect(formatCurrency(null)).toContain('0');
    expect(formatCurrency(undefined)).toContain('0');
  });

  it('should support different currencies', () => {
    const nprResult = formatCurrency(1000, 'NPR');
    const usdResult = formatCurrency(1000, 'USD');
    expect(nprResult).not.toEqual(usdResult);
  });

  it('should support different locales', () => {
    const enResult = formatCurrency(1000, 'USD', 'en-US');
    const deResult = formatCurrency(1000, 'EUR', 'de-DE');
    expect(enResult).not.toEqual(deResult);
  });

  it('should handle invalid input gracefully', () => {
    const result = formatCurrency('invalid');
    expect(result).toContain('0');
  });

  it('should handle negative numbers', () => {
    const result = formatCurrency(-500);
    expect(result).toContain('-');
  });

  it('should round to 2 decimal places', () => {
    const result = formatCurrency(99.999);
    expect(result).toContain('100');
  });
});
