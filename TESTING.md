# Testing Documentation

Comprehensive guide to testing in the Brashline Social Engine project.

## Table of Contents

- [Overview](#overview)
- [Test Coverage Goals](#test-coverage-goals)
- [Testing Stack](#testing-stack)
- [Running Tests](#running-tests)
- [Testing Patterns](#testing-patterns)
- [Writing Tests](#writing-tests)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Overview

The Brashline Social Engine uses **Vitest** as the test runner and **React Testing Library** for component testing. Our testing strategy focuses on:

1. **Unit Testing** - Individual functions and hooks
2. **Component Testing** - React components in isolation
3. **Integration Testing** - Component interactions
4. **Accessibility Testing** - ARIA attributes and keyboard navigation

---

## Test Coverage Goals

### Phase 3.2 Achievement

| Metric | Target | Achieved | Status |
|--------|--------|----------|---------|
| Statement Coverage | 70%+ | **81.15%** | ✅ |
| Test Files | 10+ | **14** | ✅ |
| Test Count | 80+ | **105** | ✅ |
| Pass Rate | 100% | **100%** | ✅ |

### Coverage by Category

```
All files            |   81.15 |    54.08 |   78.65 |    79.6
 components/home     |   86.48 |    45.16 |   78.57 |   85.29
 components/layout   |   62.96 |    32.35 |   36.36 |   61.53
 components/ui       |   88.23 |     65.3 |   81.81 |    87.5
 data                |     100 |      100 |     100 |     100
 hooks               |   92.39 |       75 |   94.44 |   91.46
 lib                 |   59.37 |    53.33 |   63.63 |   55.17
 pages               |     100 |      100 |     100 |     100
 utils               |   59.25 |       75 |      80 |   57.69
```

---

## Testing Stack

### Core Libraries

```json
{
  "vitest": "^4.0.8",
  "@testing-library/react": "^16.1.0",
  "@testing-library/user-event": "^14.5.2",
  "@vitest/coverage-v8": "^4.0.8",
  "jsdom": "^25.0.1"
}
```

### Test Environment

- **Test Runner:** Vitest (Vite-native, fast)
- **DOM Environment:** jsdom
- **Component Testing:** React Testing Library
- **Hook Testing:** `renderHook` utility
- **Coverage:** V8 coverage provider

---

## Running Tests

### Basic Commands

```bash
# Run all tests (watch mode)
npm test

# Run all tests once
npm test -- --run

# Run with coverage
npm test -- --coverage --run

# Run specific file
npm test -- src/hooks/useServices.test.ts

# Run tests matching pattern
npm test -- --grep="Header"

# Update snapshots
npm test -- -u
```

### CI/CD

```bash
# Run in CI mode (no watch, exit on failure)
npm test -- --run --reporter=verbose
```

---

## Testing Patterns

### 1. Hook Testing

**Pattern:** Use `renderHook` to test custom hooks in isolation.

```typescript
import { renderHook } from '@testing-library/react';
import { useServices } from './useServices';

describe('useServices', () => {
  it('should return localized services for English', () => {
    const { result } = renderHook(() => useServices('en'));
    
    expect(result.current.services).toHaveLength(9);
    expect(result.current.services[0].title).toBe('Social Media Management');
  });

  it('should return localized services for Spanish', () => {
    const { result } = renderHook(() => useServices('es'));
    
    expect(result.current.services).toHaveLength(9);
    expect(result.current.services[0].title).toBe('Gestión de Redes Sociales');
  });
});
```

**Testing Language Switching:**
```typescript
it('should update when language changes', () => {
  const { result, rerender } = renderHook(
    ({ lang }) => useServices(lang),
    { initialProps: { lang: 'en' as 'en' | 'es' } }
  );
  
  expect(result.current.services[0].title).toContain('Management');
  
  // Change language
  rerender({ lang: 'es' });
  
  expect(result.current.services[0].title).toContain('Gestión');
});
```

**Testing Memoization:**
```typescript
it('should memoize result for same language', () => {
  const { result, rerender } = renderHook(() => useServices('en'));
  
  const firstResult = result.current.services;
  rerender();
  const secondResult = result.current.services;
  
  expect(firstResult).toBe(secondResult); // Same reference
});
```

---

### 2. Component Testing

**Pattern:** Render components with necessary providers (Router, Context).

```typescript
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';

describe('Header', () => {
  const renderHeader = () => {
    return render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
  };

  it('should render logo and navigation', () => {
    renderHeader();
    
    expect(screen.getByAltText('Brashline Logo')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
  });

  it('should render WhatsApp button', () => {
    renderHeader();
    
    const waButton = screen.getByRole('link', { name: /book strategic call/i });
    expect(waButton).toHaveAttribute('href', 'https://wa.me/19294468440');
    expect(waButton).toHaveAttribute('target', '_blank');
  });
});
```

---

### 3. User Interaction Testing

**Pattern:** Use `userEvent` for realistic user interactions.

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

describe('Button', () => {
  it('should handle click events', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    await user.click(screen.getByText('Click Me'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not trigger click when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    
    render(<Button disabled onClick={handleClick}>Click Me</Button>);
    
    await user.click(screen.getByText('Click Me'));
    
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

---

### 4. Accessibility Testing

**Pattern:** Test ARIA attributes and keyboard navigation.

```typescript
describe('Header Accessibility', () => {
  it('should have proper ARIA attributes on mobile menu', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    
    const menuButton = screen.getByRole('button', { name: /menu/i });
    
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(menuButton).toHaveAttribute('aria-label');
  });

  it('should have skip to content link', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    
    const skipLink = screen.getByText(/skip to main content/i);
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('should trap focus in mobile menu', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    
    const menuButton = screen.getByRole('button', { name: /menu/i });
    await user.click(menuButton);
    
    // First link should be focused
    const firstLink = screen.getAllByRole('link')[0];
    expect(firstLink).toHaveFocus();
  });
});
```

---

### 5. Snapshot Testing

**Pattern:** Use snapshots for components with complex structure.

```typescript
import { render } from '@testing-library/react';
import { PricingCard } from './PricingCard';

describe('PricingCard', () => {
  it('should match snapshot', () => {
    const { container } = render(
      <PricingCard
        title="Brand Pulse"
        price={179}
        features={['Feature 1', 'Feature 2']}
      />
    );
    
    expect(container).toMatchSnapshot();
  });
});
```

**Updating Snapshots:**
```bash
npm test -- -u
```

---

### 6. Async Testing

**Pattern:** Test components with async data or effects.

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { BlogPage } from './BlogPage';

describe('BlogPage', () => {
  it('should load and display blog posts', async () => {
    render(<BlogPage />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Check content is displayed
    expect(screen.getByText('Blog Post Title')).toBeInTheDocument();
  });

  it('should handle errors gracefully', async () => {
    // Mock fetch to throw error
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
    
    render(<BlogPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```

---

### 7. Mocking

**Pattern:** Mock external dependencies and browser APIs.

**Mocking IntersectionObserver:**
```typescript
beforeEach(() => {
  global.IntersectionObserver = vi.fn().mockImplementation((callback) => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    root: null,
    rootMargin: '0px',
    thresholds: [0.1],
    takeRecords: () => [],
  }));
});

afterEach(() => {
  vi.restoreAllMocks();
});
```

**Mocking window properties:**
```typescript
it('should handle scroll events', () => {
  const { result } = renderHook(() => useParallax({ speed: 0.5 }));
  
  // Mock scroll position
  Object.defineProperty(window, 'pageYOffset', {
    value: 100,
    writable: true,
  });
  
  // Trigger scroll
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });
  
  expect(result.current).toBe(-50); // 100 * 0.5 * -1
});
```

**Mocking modules:**
```typescript
vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => ({ lang: 'en', setLang: vi.fn() }),
}));
```

---

## Writing Tests

### Test File Structure

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ComponentToTest } from './ComponentToTest';

describe('ComponentToTest', () => {
  // Setup
  beforeEach(() => {
    // Run before each test
  });

  afterEach(() => {
    // Cleanup after each test
    vi.restoreAllMocks();
  });

  // Group related tests
  describe('Feature A', () => {
    it('should do something specific', () => {
      // Arrange
      render(<ComponentToTest />);
      
      // Act
      // ... user interactions
      
      // Assert
      expect(screen.getByText('Expected')).toBeInTheDocument();
    });
  });

  describe('Feature B', () => {
    it('should handle edge case', () => {
      // ...
    });
  });
});
```

### Test Naming Convention

Use descriptive names following the pattern:
```
should [expected behavior] when [condition]
```

**Good:**
```typescript
it('should display error message when form submission fails')
it('should disable submit button when form is invalid')
it('should call onClick handler when button is clicked')
```

**Bad:**
```typescript
it('test button')
it('works correctly')
it('renders')
```

---

## Best Practices

### 1. Arrange-Act-Assert (AAA)

```typescript
it('should update count on button click', async () => {
  // Arrange
  const user = userEvent.setup();
  render(<Counter />);
  
  // Act
  await user.click(screen.getByRole('button', { name: 'Increment' }));
  
  // Assert
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

### 2. Query Priority (React Testing Library)

Prefer queries in this order:

1. **getByRole** - Most accessible
2. **getByLabelText** - Forms
3. **getByPlaceholderText** - Forms
4. **getByText** - Non-interactive content
5. **getByTestId** - Last resort

```typescript
// ✅ Good - Accessible query
const button = screen.getByRole('button', { name: 'Submit' });

// ⚠️ Okay - Less accessible
const button = screen.getByText('Submit');

// ❌ Avoid - Not accessible
const button = screen.getByTestId('submit-button');
```

### 3. Don't Test Implementation Details

```typescript
// ❌ Bad - Testing implementation
it('should set state to true', () => {
  const { result } = renderHook(() => useState(false));
  act(() => result.current[1](true));
  expect(result.current[0]).toBe(true);
});

// ✅ Good - Testing behavior
it('should show success message after submission', async () => {
  const user = userEvent.setup();
  render(<Form />);
  
  await user.click(screen.getByRole('button', { name: 'Submit' }));
  
  expect(screen.getByText('Success!')).toBeInTheDocument();
});
```

### 4. Keep Tests Isolated

```typescript
// ❌ Bad - Tests depend on each other
let user;
it('should create user', () => {
  user = createUser();
});
it('should update user', () => {
  updateUser(user); // Depends on previous test
});

// ✅ Good - Each test is independent
it('should create user', () => {
  const user = createUser();
  expect(user).toBeDefined();
});
it('should update user', () => {
  const user = createUser();
  const updated = updateUser(user);
  expect(updated).toBeDefined();
});
```

### 5. Use Descriptive Assertions

```typescript
// ❌ Bad - Generic assertion
expect(result).toBeTruthy();

// ✅ Good - Specific assertion
expect(result.services).toHaveLength(9);
expect(result.services[0].title).toBe('Social Media Management');
```

### 6. Test Edge Cases

```typescript
describe('useCountUp', () => {
  it('should count from 0 to target', () => {
    const { result } = renderHook(() => useCountUp(100));
    // ... normal case
  });

  it('should handle zero as target', () => {
    const { result } = renderHook(() => useCountUp(0));
    expect(result.current).toBe(0);
  });

  it('should handle negative numbers', () => {
    const { result } = renderHook(() => useCountUp(-50));
    // ... edge case
  });

  it('should handle very large numbers', () => {
    const { result } = renderHook(() => useCountUp(999999));
    // ... edge case
  });
});
```

---

## Troubleshooting

### Common Issues

#### 1. "Cannot find module" errors

**Problem:** Import paths not resolving.

**Solution:** Check `vite.config.ts` has correct path aliases:
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
},
```

#### 2. "window is not defined"

**Problem:** Testing code that uses browser APIs.

**Solution:** Mock the API or use `jsdom` environment:
```typescript
// In test file
/**
 * @vitest-environment jsdom
 */

// Or mock window
Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
});
```

#### 3. Tests timing out

**Problem:** Async operations not completing.

**Solution:** Use `waitFor` and check for proper cleanup:
```typescript
await waitFor(
  () => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  },
  { timeout: 3000 }
);
```

#### 4. "Act" warnings

**Problem:** State updates not wrapped in `act()`.

**Solution:** Use `act()` for state updates outside React:
```typescript
import { act } from '@testing-library/react';

act(() => {
  // State updates here
  result.current.update();
});
```

#### 5. Flaky tests

**Problem:** Tests pass/fail randomly.

**Solution:**
- Avoid using `setTimeout` in tests
- Use `waitFor` for async operations
- Mock timers if needed:
```typescript
vi.useFakeTimers();
// ... test code
vi.advanceTimersByTime(1000);
vi.useRealTimers();
```

---

## Coverage Reports

### Viewing Coverage

```bash
# Generate coverage report
npm test -- --coverage --run

# Coverage saved to: coverage/index.html
```

### Interpreting Coverage

- **Statements:** Lines of code executed
- **Branches:** if/else paths covered
- **Functions:** Functions called
- **Lines:** Similar to statements

**Goal:** 70%+ on all metrics

### Improving Coverage

1. **Find uncovered files:**
```bash
npm test -- --coverage --reporter=verbose
```

2. **Write tests for uncovered code:**
   - Focus on high-value areas first
   - Test happy paths before edge cases
   - Aim for 80%+ on critical files

3. **Ignore generated/config files:**
```typescript
// vite.config.ts
test: {
  coverage: {
    exclude: [
      'src/vite-env.d.ts',
      '**/*.config.*',
      '**/dist/**',
    ],
  },
},
```

---

## Testing Checklist

When adding new features:

- [ ] Write tests before or alongside code (TDD)
- [ ] Achieve 80%+ coverage for new code
- [ ] Test happy path
- [ ] Test error cases
- [ ] Test edge cases (empty, null, undefined, zero)
- [ ] Test accessibility (ARIA, keyboard)
- [ ] Run full test suite before committing
- [ ] Update documentation if needed

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

---

**Last Updated:** November 14, 2025  
**Version:** Phase 3.4  
**Maintainers:** Brashline Development Team
