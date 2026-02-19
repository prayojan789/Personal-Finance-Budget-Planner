import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import useDebouncedValue from '../hooks/useDebouncedValue';

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebouncedValue('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    expect(result.current).toBe('initial');

    // Change value
    rerender({ value: 'updated', delay: 300 });
    expect(result.current).toBe('initial'); // Still old value

    // Wait for debounce
    act(() => {
      vi.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current).toBe('updated');
    });
  });

  it('should cancel previous timeout on new change', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    rerender({ value: 'first', delay: 300 });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Change again before debounce completes
    rerender({ value: 'second', delay: 300 });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe('initial'); // Still initial

    // Complete the debounce
    act(() => {
      vi.advanceTimersByTime(200);
    });

    await waitFor(() => {
      expect(result.current).toBe('second');
    });
  });

  it('should support custom delays', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    rerender({ value: 'updated', delay: 500 });

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('initial');

    act(() => {
      vi.advanceTimersByTime(200);
    });

    await waitFor(() => {
      expect(result.current).toBe('updated');
    });
  });

  it('should handle rapid changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: 'v1', delay: 300 } }
    );

    // Rapid changes
    rerender({ value: 'v2', delay: 300 });
    rerender({ value: 'v3', delay: 300 });
    rerender({ value: 'v4', delay: 300 });
    rerender({ value: 'v5', delay: 300 });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current).toBe('v5'); // Only final value
    });
  });

  it('should work with different value types', async () => {
    // Test with object
    const obj = { key: 'value' };
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: obj, delay: 300 } }
    );

    const newObj = { key: 'new value' };
    rerender({ value: newObj, delay: 300 });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current).toBe(newObj);
    });
  });
});
