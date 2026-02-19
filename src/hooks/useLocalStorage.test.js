import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useLocalStorage from '../hooks/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.getItem.mockClear();
    localStorage.setItem.mockClear();
    localStorage.removeItem.mockClear();
  });

  it('should initialize with default value', () => {
    localStorage.getItem.mockReturnValue(null);
    const { result } = renderHook(() => useLocalStorage('testKey', 'defaultValue'));
    expect(result.current[0]).toBe('defaultValue');
  });

  it('should retrieve value from localStorage', () => {
    localStorage.getItem.mockReturnValue(JSON.stringify('storedValue'));
    const { result } = renderHook(() => useLocalStorage('testKey', 'defaultValue'));
    expect(result.current[0]).toBe('storedValue');
  });

  it('should update localStorage when value changes', () => {
    localStorage.getItem.mockReturnValue(null);
    const { result } = renderHook(() => useLocalStorage('testKey', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('testKey', JSON.stringify('updated'));
  });

  it('should handle JSON serialization of objects', () => {
    const initialObject = { name: 'John', age: 30 };
    localStorage.getItem.mockReturnValue(JSON.stringify(initialObject));
    const { result } = renderHook(() => useLocalStorage('testKey', {}));
    expect(result.current[0]).toEqual(initialObject);
  });

  it('should handle arrays', () => {
    const initialArray = [1, 2, 3];
    localStorage.getItem.mockReturnValue(JSON.stringify(initialArray));
    const { result } = renderHook(() => useLocalStorage('testKey', []));
    expect(result.current[0]).toEqual(initialArray);
  });

  it('should handle invalid JSON gracefully', () => {
    localStorage.getItem.mockReturnValue('invalid json');
    const { result } = renderHook(() => useLocalStorage('testKey', 'defaultValue'));
    expect(result.current[0]).toBe('defaultValue');
  });

  it('should update with null values', () => {
    localStorage.getItem.mockReturnValue(null);
    const { result } = renderHook(() => useLocalStorage('testKey', 'initial'));

    act(() => {
      result.current[1](null);
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('testKey', JSON.stringify(null));
  });
});
