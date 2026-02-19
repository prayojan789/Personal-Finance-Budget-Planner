# Testing Guide

This document provides comprehensive information about running tests and writing new tests for the Personal Finance Budget Planner.

## 📋 Quick Start

### Running Tests

```bash
# Run tests in watch mode (default)
npm test

# Run tests once (CI mode)
npm run test:run

# Run tests with UI dashboard
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## 🏗️ Architecture

### Test Setup

- **Framework**: Vitest (modern, Vite-integrated alternative to Jest)
- **DOM Testing**: jsdom (simulates browser environment)
- **React Testing**: @testing-library/react
- **Configuration**: `vitest.config.js`
- **Setup File**: `src/setup.test.js` (global test utilities)

### Coverage Requirements

- **Lines**: 70%
- **Functions**: 70%
- **Branches**: 70%
- **Statements**: 70%

## 📁 Test Files Structure

Test files are colocated with source files using `.test.js` or `.test.jsx` naming:

```
src/
├── utils/
│   ├── formatCurrency.js
│   ├── formatCurrency.test.js      ← Test file
│   └── ...
├── hooks/
│   ├── useLocalStorage.js
│   ├── useLocalStorage.test.js     ← Test file
│   └── ...
├── services/
│   ├── csvService.js
│   ├── csvService.test.js          ← Test file
│   └── ...
└── components/
    ├── common/
    │   ├── Button.jsx
    │   └── Button.test.jsx         ← Test file
    └── ...
```

## 🧪 Test Categories

### 1. Unit Tests (Utilities & Hooks)

Test pure functions and React hooks in isolation.

**Example: `formatCurrency.test.js`**
```javascript
import { describe, it, expect } from 'vitest';
import formatCurrency from '../utils/formatCurrency';

describe('formatCurrency', () => {
  it('should format positive numbers', () => {
    const result = formatCurrency(1000);
    expect(result).toContain('1,000');
  });

  it('should handle zero', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0');
  });

  it('should support different currencies', () => {
    const nprResult = formatCurrency(1000, 'NPR');
    const usdResult = formatCurrency(1000, 'USD');
    expect(nprResult).not.toEqual(usdResult);
  });
});
```

**Example: `useLocalStorage.test.js`**
```javascript
import { renderHook, act } from '@testing-library/react';
import useLocalStorage from '../hooks/useLocalStorage';

describe('useLocalStorage', () => {
  it('should initialize with default value', () => {
    localStorage.getItem.mockReturnValue(null);
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('should update localStorage on change', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'));
    
    act(() => {
      result.current[1]('updated');
    });
    
    expect(localStorage.setItem).toHaveBeenCalledWith('key', JSON.stringify('updated'));
  });
});
```

### 2. Service Tests

Test data transformation and API-like functions.

**Example: `csvService.test.js`**
```javascript
import { importFromCSV, exportToCSV } from '../services/csvService';

describe('csvService', () => {
  it('should parse CSV transactions', async () => {
    const csv = `type,description,amount,category,date,note
income,"Salary",5000,"Work","2024-01-15","Monthly salary"`;
    
    const file = new File([csv], 'test.csv');
    const result = await importFromCSV(file);
    
    expect(result.transactions).toHaveLength(1);
    expect(result.transactions[0].amount).toBe(5000);
  });
});
```

### 3. Component Tests

Test React components with user interactions.

**Example: `Button.test.jsx`**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../components/common/Button';

describe('Button', () => {
  it('should handle click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('should be disabled when prop is set', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

## 🛠️ Writing Tests

### Basic Test Structure

```javascript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Feature Name', () => {
  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    // Cleanup after each test
  });

  it('should do something specific', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = myFunction(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

### Common Assertions

```javascript
// Equality
expect(value).toBe(expected);
expect(value).toEqual(expected);
expect(value).not.toBe(unexpected);

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();

// Numbers
expect(value).toBeGreaterThan(2);
expect(value).toBeLessThan(5);
expect(value).toBeCloseTo(3.14, 2);

// Strings
expect(value).toMatch(/regex/);
expect(value).toContain('substring');

// Arrays
expect(array).toHaveLength(3);
expect(array).toContain(item);
expect(array).toEqual([1, 2, 3]);

// Objects
expect(obj).toHaveProperty('key');
expect(obj).toEqual({ key: 'value' });

// Functions
expect(fn).toHaveBeenCalled();
expect(fn).toHaveBeenCalledWith(arg1, arg2);
expect(fn).toHaveBeenCalledOnce();

// Exceptions
expect(() => fn()).toThrow();
expect(() => fn()).toThrow('message');
```

### Mocking

```javascript
import { vi } from 'vitest';

// Mock function
const mockFn = vi.fn();
const mockFn = vi.fn(() => 'return value');
const mockFn = vi.fn((arg) => arg * 2);

// Mock module
vi.mock('../utils/helper', () => ({
  helperFunction: vi.fn(() => 'mocked'),
}));

// Mock localStorage
localStorage.getItem.mockReturnValue('value');
localStorage.setItem.mockClear();

// Spies
vi.spyOn(obj, 'method').mockReturnValue('mocked');
```

### Async Testing

```javascript
// Promise-based
it('should handle async operations', async () => {
  const result = await asyncFunction();
  expect(result).toBe('expected');
});

// Timeout handling
it('should handle delays', async () => {
  vi.useFakeTimers();
  const promise = delayedFunction();
  vi.advanceTimersByTime(1000);
  await expect(promise).resolves.toBe('expected');
  vi.useRealTimers();
});
```

### React Component Testing

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

describe('Component', () => {
  it('should render with props', () => {
    render(<Component prop="value" />);
    expect(screen.getByText('value')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    render(<Component />);
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByText('Updated')).toBeInTheDocument();
    });
  });

  it('should display loading state', () => {
    render(<Component isLoading />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
```

## 🔍 Current Test Coverage

The following areas have comprehensive test coverage:

- ✅ **Utils**: formatCurrency (9 tests, 100%)
- ✅ **Hooks**: useLocalStorage (8 tests, 100%), useDebouncedValue (6 tests, 100%)
- ✅ **Services**: csvService (8 tests, ~90%), backupService (12 tests, ~85%)
- ✅ **Components**: Button (7 tests, 100%)

## 📊 Coverage Reports

After running `npm run test:coverage`, view the HTML report:

```bash
open coverage/index.html
```

This shows line-by-line coverage for all tested files.

## 🚀 CI/CD Integration

Tests run automatically on:
- **Push** to `main` or `develop` branches
- **Pull Requests** to `main` or `develop`

See `.github/workflows/ci.yml` for details.

### CI Pipeline

1. **Lint Check**: ESLint validation
2. **Unit Tests**: All tests must pass
3. **Coverage Report**: Generated and uploaded to Codecov
4. **Build**: Production build verification
5. **Deploy** (main branch only): Upload artifacts

## 📚 Testing Best Practices

### ✅ Do

- Write descriptive test names: `should...`, `given...when...then...`
- Test user behavior, not implementation details
- Keep tests focused and isolated
- Mock external dependencies
- Use `beforeEach`/`afterEach` for setup/cleanup
- Test edge cases and error conditions
- Keep assertions simple and clear

### ❌ Don't

- Test implementation details (internal state)
- Write tests that depend on other tests
- Hardcode timeouts and delays
- Create overly complex tests
- Skip error handling tests
- Test third-party libraries

## 🐛 Debugging Tests

### Run Single Test

```bash
it.only('should test this specifically', () => {
  // ...
});
```

### Skip Test

```bash
it.skip('should test this later', () => {
  // ...
});
```

### Debug in VS Code

1. Add breakpoint in test file
2. Open Run and Debug (Ctrl+Shift+D)
3. Select "Debug Vitest"
4. Step through code

### Console Logging

```javascript
it('should debug', () => {
  console.log('Debug info:', value);
  console.debug('Detailed:', object);
  console.table(arrayData);
});
```

## 🔗 Resources

- [Vitest Documentation](https://vitest.dev)
- [Testing Library React](https://testing-library.com/react)
- [Jest Matchers](https://vitest.dev/api/expect.html)
- [AAA Pattern](https://www.arrangeactassert.com/)

## 📝 Contributing Tests

When adding new features:

1. Write tests first (TDD) or alongside code
2. Ensure all edge cases are covered
3. Keep coverage above 70%
4. Document complex test logic
5. Run `npm run test:coverage` locally before pushing
6. Update this guide if adding new patterns

---

**Last Updated**: February 2026
**Test Framework**: Vitest 1.x
**Node Version**: 18.x+
