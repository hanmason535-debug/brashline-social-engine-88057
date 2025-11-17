# Testing & Accessibility Guide

## Running Tests

### Unit & Component Tests (Vitest)
```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### E2E Tests (Playwright)
```bash
# Run all E2E tests
npx playwright test

# Run specific test file
npx playwright test e2e/homepage-to-contact.spec.ts

# Run in UI mode (interactive)
npx playwright test --ui

# Run in headed mode (see browser)
npx playwright test --headed

# Run specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Debug mode
npx playwright test --debug
```

### Visual Regression Tests
```bash
# Update snapshots
npx playwright test --update-snapshots

# Run only visual tests
npx playwright test e2e/visual-regression.spec.ts
```

## Test Coverage

### Current Test Files
- `src/tests/setup.ts` - Test configuration
- `src/tests/accessibility.test.tsx` - Accessibility tests with axe
- `e2e/homepage-to-contact.spec.ts` - User flow testing
- `e2e/language-switching.spec.ts` - Language toggle testing
- `e2e/theme-switching.spec.ts` - Theme toggle testing
- `e2e/case-studies-lightbox.spec.ts` - Lightbox navigation testing
- `e2e/visual-regression.spec.ts` - Visual regression testing

## Accessibility Features

### 1. Skip to Content Link
- Keyboard accessible skip link at the top of every page
- Visible only when focused (press Tab on page load)
- Jumps directly to main content

### 2. Focus Management
- Visible focus indicators on all interactive elements
- Focus trap in modals/lightbox
- Proper tab order throughout the application

### 3. Keyboard Navigation
**Lightbox:**
- `←/→` Arrow keys - Navigate between items
- `Escape` - Close lightbox
- `Tab` - Navigate through controls

**General:**
- `Tab` - Move forward through interactive elements
- `Shift + Tab` - Move backward
- `Enter/Space` - Activate buttons and links

### 4. Reduced Motion Support
- Respects `prefers-reduced-motion` preference
- Disables animations for users who prefer reduced motion
- Instant transitions instead of animated ones

### 5. ARIA Labels
- All interactive elements have proper ARIA labels
- Screen reader friendly navigation
- Semantic HTML structure

## Browser Testing

Playwright runs tests across:
- **Desktop:** Chrome, Firefox, Safari
- **Mobile:** Chrome (Pixel 5), Safari (iPhone 12)

## CI/CD Integration

GitHub Actions workflow (`.github/workflows/playwright.yml`) automatically runs:
- E2E tests on every push/PR
- Visual regression tests
- Accessibility scans
- Uploads test reports as artifacts

## Accessibility Testing Tools

### Automated Testing
- **vitest-axe** - Automated a11y testing in unit tests
- **@axe-core/playwright** - Automated a11y testing in E2E tests

### Manual Testing Checklist
- [ ] Test with keyboard only (no mouse)
- [ ] Test with screen reader (NVDA/JAWS/VoiceOver)
- [ ] Test with 200% zoom
- [ ] Test with Windows High Contrast mode
- [ ] Test with dark/light themes
- [ ] Test with reduced motion enabled

## Performance Testing

### Lighthouse CI (Future)
```bash
# Install lighthouse
npm install -g @lhci/cli

# Run lighthouse
lhci autorun
```

### Bundle Size Monitoring
```bash
# Analyze bundle
npm run build
npx vite-bundle-visualizer
```

## Writing New Tests

### E2E Test Template
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/');
    // Test implementation
  });
});
```

### Accessibility Test Template
```typescript
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';

it('should have no a11y violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results.violations).toEqual([]);
});
```

## Best Practices

1. **Write tests that test behavior, not implementation**
2. **Use semantic queries** (`getByRole`, `getByLabelText`)
3. **Test accessibility in every component**
4. **Keep tests fast and focused**
5. **Use visual regression for UI changes**
6. **Test keyboard navigation explicitly**
7. **Mock external dependencies**
8. **Run tests before committing**

## Resources

- [Playwright Docs](https://playwright.dev/)
- [Vitest Docs](https://vitest.dev/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
