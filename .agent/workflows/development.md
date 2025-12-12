---
description: How to run the development server and test locally
---

# Development Workflow

## Starting the Dev Server

// turbo
1. Open a terminal in the project root

// turbo
2. Run the development server:
```bash
npm run dev
```

3. Open http://localhost:8080 in your browser

## Hot Reload

The server supports hot module replacement (HMR). Changes to:
- React components → instant refresh
- CSS files → instant update
- TypeScript → fast rebuild

## Environment Variables

Required `.env` variables for full functionality:
- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk authentication
- `VITE_STRIPE_PRICE_*` - Stripe pricing IDs

## Common Issues

### Port Already in Use
```bash
# Find what's using port 8080
netstat -ano | findstr :8080

# Kill the process (replace PID)
taskkill /F /PID <pid>
```

### Node Modules Issues
```bash
rm -rf node_modules
npm install
```
