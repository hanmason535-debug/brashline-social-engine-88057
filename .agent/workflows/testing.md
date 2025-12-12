---
description: How to run tests - unit, integration, and E2E
---

# Testing Workflow

## Quick Commands

// turbo
1. Run all unit tests:
```bash
npm test
```

// turbo
2. Run tests in watch mode:
```bash
npm test -- --watch
```

// turbo
3. Run with coverage:
```bash
npm test -- --coverage
```

## E2E Testing with Playwright

### Setup (First Time)

1. Install Playwright browsers:
```bash
npx playwright install chromium
```

2. Install Python dependencies (for helper scripts):
```bash
pip install playwright
```

### Running E2E Tests

// turbo
1. With dev server already running:
```bash
npx playwright test
```

2. Auto-start server, run tests, cleanup:
```bash
python scripts/with_server.py --server "npm run dev" --port 8080 -- npx playwright test
```

3. Run in headed mode (see browser):
```bash
npx playwright test --headed
```

4. Run specific test file:
```bash
npx playwright test e2e/homepage.spec.ts
```

## Element Discovery

Before writing tests, discover what elements are on the page:

```bash
# With dev server running
python scripts/discover-elements.py

# Or auto-start server
python scripts/with_server.py --server "npm run dev" --port 8080 -- python scripts/discover-elements.py
```

This generates:
- `e2e/page-discovery.png` - Screenshot
- `e2e/elements.json` - All buttons, links, inputs, test IDs

## Test Patterns

### Wait for React Hydration
```typescript
await page.waitForSelector('[data-testid="hero-section"]');
```

### Click Button by Text
```typescript
await page.click('button:has-text("Get Started")');
```

### Fill Form
```typescript
await page.fill('input[name="email"]', 'test@example.com');
```

### Check Toast Appears
```typescript
await expect(page.locator('.toast')).toBeVisible();
```
