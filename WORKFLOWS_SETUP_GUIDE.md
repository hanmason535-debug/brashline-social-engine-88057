# GitHub Workflows & MCPs Setup Guide

> **Last Updated:** November 21, 2025  
> **Project:** Brashline Social Engine  
> **Status:** Workflows Implemented ✅

---

## 🎯 Implemented Workflows

### ✅ Active Workflows

| Workflow | File | Status | Purpose |
|----------|------|--------|---------|
| CI Pipeline | `.github/workflows/ci.yml` | ✅ Active | TypeScript, ESLint, Prettier, Vitest, Codecov |
| Dependabot | `.github/dependabot.yml` | ✅ Active | Automated dependency updates |
| CodeQL Security | `.github/workflows/codeql.yml` | ✅ Active | Security vulnerability scanning |
| Bundle Size | `.github/workflows/bundle-size.yml` | ✅ Active | Track bundle size changes |
| PR Labeler | `.github/workflows/labeler.yml` | ✅ Active | Auto-label PRs by files changed |
| Release Automation | `.github/workflows/release.yml` | ✅ Active | Create releases on version tags |
| Accessibility | `.github/workflows/accessibility.yml` | ✅ Active | Axe + Pa11y a11y testing |
| Performance Budget | `.github/workflows/performance-budget.yml` | ✅ Active | Enforce performance limits |
| Playwright E2E | `.github/workflows/playwright.yml` | ✅ Active | End-to-end testing |
| Lighthouse CI | `.github/workflows/lighthouse.yml` | ✅ Active | Performance monitoring |
| Visual Regression | `.github/workflows/visual-regression.yml` | ✅ Active | Percy visual testing |

---

## 🔐 GitHub Secrets Configuration

### Already Configured ✅

1. **CODECOV_TOKEN**
   - Value: `f13c2597-5787-485e-ae7b-2ad69a808087`
   - Purpose: Upload coverage reports to Codecov
   - Status: ✅ Added to repository secrets

2. **PERCY_TOKEN** (Percy Visual Testing)
   - Username: `yushijain_PJVxRs`
   - Access Key: `Se9s8LhELJHisopUYxAD`
   - Purpose: Visual regression testing
   - Status: ✅ Configured in `.percyrc.yml`
   - **Action Required:** Add to GitHub Secrets as `PERCY_TOKEN`

### To Be Configured Later

3. **LHCI_GITHUB_APP_TOKEN** (Optional)
   - Purpose: Enhanced Lighthouse CI reports
   - Status: ⏳ Optional - works without token but limited features
   - How to get: Install Lighthouse CI GitHub App

---

## 🤖 MCPs Configuration

### ✅ Configured MCPs

Location: `.mcp/config.json`

1. **Filesystem MCP** ✅
   - Server: `@modelcontextprotocol/server-filesystem`
   - Path: `d:\Brashline\brashline-social-engine-88057`
   - Purpose: Read/write project files with context
   - Status: ✅ Configured and ready

2. **Git MCP** ✅
   - Server: `@modelcontextprotocol/server-git`
   - Repository: `d:\Brashline\brashline-social-engine-88057`
   - Purpose: Git operations and history analysis
   - Status: ✅ Configured and ready

3. **NPM MCP** ✅
   - Server: `@modelcontextprotocol/server-npm`
   - Purpose: Manage dependencies and package updates
   - Status: ✅ Configured and ready

4. **Puppeteer MCP** ✅
   - Server: `@modelcontextprotocol/server-puppeteer`
   - Purpose: Browser automation for testing and screenshots
   - Status: ✅ Configured and ready

### ⏳ To Be Configured Later

#### 5. GitHub MCP (Not configured - manual setup required)

**Purpose:** Interact with GitHub API for issues, PRs, releases

**Step-by-step setup:**

##### Step 1: Create GitHub Personal Access Token

1. Go to GitHub Settings: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Set token name: `Brashline MCP - [Your Computer Name]`
4. Set expiration: **No expiration** (or custom duration)
5. Select scopes:
   ```
   ✅ repo (Full control of private repositories)
      ✅ repo:status
      ✅ repo_deployment
      ✅ public_repo
      ✅ repo:invite
      ✅ security_events
   
   ✅ workflow (Update GitHub Action workflows)
   
   ✅ write:packages (Upload packages to GitHub Package Registry)
   ✅ read:packages
   
   ✅ read:org (Read org and team membership, read org projects)
   
   ✅ gist (Create gists)
   
   ✅ notifications (Access notifications)
   
   ✅ user (Update ALL user data)
      ✅ read:user
      ✅ user:email
      ✅ user:follow
   
   ✅ project (Full control of projects)
      ✅ read:project
   ```

6. Click **"Generate token"**
7. **IMPORTANT:** Copy the token immediately - you won't see it again!

##### Step 2: Add GitHub MCP to Configuration

1. Open `.mcp/config.json`
2. Add the GitHub MCP server entry:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_TOKEN_HERE"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "d:\\Brashline\\brashline-social-engine-88057"
      ]
    },
    "git": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-git",
        "--repository",
        "d:\\Brashline\\brashline-social-engine-88057"
      ]
    },
    "npm": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-npm"]
    },
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}
```

3. Replace `YOUR_TOKEN_HERE` with your actual token
4. Save the file
5. Restart your editor/AI assistant to load the new MCP

##### Step 3: Verify GitHub MCP is Working

Test commands you can now use:
- Create issues for bugs found in code
- Create PRs automatically
- Read issue/PR discussions
- Update project boards
- List repository contributors
- Search code across repos
- Manage releases

---

#### 6. Postgres MCP (Not configured - manual setup required)

**Purpose:** Query analytics database (for future analytics dashboard)

**When to set this up:** Only if you build a PostgreSQL database for analytics

**Step-by-step setup:**

##### Step 1: Set Up PostgreSQL Database

1. **Option A: Local PostgreSQL**
   ```bash
   # Windows (via Chocolatey)
   choco install postgresql
   
   # Or download from: https://www.postgresql.org/download/windows/
   ```

2. **Option B: Cloud PostgreSQL**
   - **Supabase** (Recommended): https://supabase.com
     - Free tier includes PostgreSQL database
     - Sign up → Create new project
     - Copy connection string
   
   - **Neon**: https://neon.tech
     - Serverless PostgreSQL
     - Free tier available
   
   - **Railway**: https://railway.app
     - Easy PostgreSQL provisioning

##### Step 2: Create Analytics Database Schema

```sql
-- Connect to your PostgreSQL instance and run:

CREATE DATABASE brashline_analytics;

\c brashline_analytics

-- Events table
CREATE TABLE analytics_events (
    id SERIAL PRIMARY KEY,
    event_name VARCHAR(100) NOT NULL,
    event_category VARCHAR(50) NOT NULL,
    event_label VARCHAR(255),
    value NUMERIC,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_term VARCHAR(100),
    utm_content VARCHAR(100),
    session_id VARCHAR(255),
    user_agent TEXT,
    ip_address INET,
    page_url TEXT,
    referrer TEXT
);

-- Indexes for performance
CREATE INDEX idx_events_timestamp ON analytics_events(timestamp);
CREATE INDEX idx_events_category ON analytics_events(event_category);
CREATE INDEX idx_events_name ON analytics_events(event_name);
CREATE INDEX idx_events_utm_campaign ON analytics_events(utm_campaign);

-- Users table (optional)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP,
    total_events INTEGER DEFAULT 0
);
```

##### Step 3: Get Connection String

Your connection string format:
```
postgresql://username:password@host:port/database_name?sslmode=require
```

Example:
```
postgresql://postgres:mypassword@db.supabase.co:5432/brashline_analytics?sslmode=require
```

##### Step 4: Add Postgres MCP to Configuration

1. Open `.mcp/config.json`
2. Add the Postgres MCP server entry:

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://user:pass@host:5432/brashline_analytics?sslmode=require"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_TOKEN_HERE"
      }
    },
    "filesystem": { "...": "..." },
    "git": { "...": "..." },
    "npm": { "...": "..." },
    "puppeteer": { "...": "..." }
  }
}
```

3. Replace connection string with your actual database URL
4. Save and restart editor

##### Step 5: Update Analytics Code to Use Database

Modify `src/lib/analytics.ts`:

```typescript
// Add database storage function
async function storeEventInDatabase(event: AnalyticsEvent) {
  try {
    const response = await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    
    if (!response.ok) {
      console.error('Failed to store event in database');
    }
  } catch (error) {
    console.error('Database storage error:', error);
  }
}

// Update trackEvent function to use database
export function trackEvent(
  eventName: string,
  category: string,
  label?: string,
  value?: number
) {
  // ... existing code ...
  
  // Store in database (in addition to localStorage)
  storeEventInDatabase(event);
}
```

##### Step 6: Create API Endpoint (if using backend)

If you add a backend API:

```typescript
// api/analytics.ts (example with Express)
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
});

export async function POST(req, res) {
  const event = req.body;
  
  try {
    await pool.query(
      `INSERT INTO analytics_events 
       (event_name, event_category, event_label, value, utm_source, utm_medium, utm_campaign)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        event.event_name,
        event.event_category,
        event.event_label,
        event.value,
        event.utm?.utm_source,
        event.utm?.utm_medium,
        event.utm?.utm_campaign,
      ]
    );
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to store event' });
  }
}
```

##### Step 7: Query Analytics with MCP

Once configured, you can use the Postgres MCP to:
- Query total events by category
- Generate reports by date range
- Analyze UTM campaign performance
- Track user engagement metrics
- Export data for visualization

Example queries via MCP:
```sql
-- Top 10 events this month
SELECT event_name, COUNT(*) as count
FROM analytics_events
WHERE timestamp >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY event_name
ORDER BY count DESC
LIMIT 10;

-- UTM campaign performance
SELECT 
  utm_campaign,
  COUNT(*) as events,
  COUNT(DISTINCT session_id) as sessions
FROM analytics_events
WHERE utm_campaign IS NOT NULL
GROUP BY utm_campaign
ORDER BY events DESC;
```

---

## 📊 Workflow Status Dashboard

### Quick Health Check

Run these commands to verify workflows:

```bash
# Check workflow files exist
ls .github/workflows/

# View recent workflow runs
gh run list --limit 5

# Check workflow status
gh run view

# View Dependabot status
gh api /repos/:owner/:repo/dependabot/alerts
```

### Expected Workflow Triggers

| Workflow | Trigger | Frequency |
|----------|---------|-----------|
| CI Pipeline | Push/PR to main | Every commit |
| Dependabot | Schedule | Weekly (Monday 9 AM) |
| CodeQL | Push/PR + Schedule | Every commit + Weekly |
| Bundle Size | PR to main | Every PR |
| PR Labeler | PR opened/sync | Every PR |
| Release | Tag push `v*.*.*` | Manual tag |
| Accessibility | PR to main | Every PR |
| Performance | PR to main | Every PR |
| Playwright | Push/PR to main | Every commit |
| Lighthouse | Push/PR to main | Every commit |
| Visual Regression | PR to main | Every PR |

---

## 🚀 Next Steps

### Immediate Actions Required

1. **Add Percy Token to GitHub Secrets**
   - Go to: https://github.com/hanmason535-debug/brashline-social-engine-88057/settings/secrets/actions
   - Click **"New repository secret"**
   - Name: `PERCY_TOKEN`
   - Value: `Se9s8LhELJHisopUYxAD`
   - Click **"Add secret"**

2. **Commit and Push Workflows**
   ```bash
   git add .github/ .mcp/ .percyrc.yml WORKFLOWS_SETUP_GUIDE.md
   git commit -m "ci: add comprehensive GitHub workflows and MCP configuration"
   git push origin main
   ```

3. **Verify Workflows Run**
   - Go to: https://github.com/hanmason535-debug/brashline-social-engine-88057/actions
   - Check that CI Pipeline runs successfully
   - Verify Codecov uploads coverage report

### Optional Enhancements

1. **Enable Branch Protection**
   - Settings > Branches > Add rule
   - Require CI Pipeline to pass
   - Require 1 approval before merging

2. **Set Up GitHub MCP** (See detailed guide above)
   - Create Personal Access Token
   - Add to `.mcp/config.json`
   - Restart editor

3. **Configure Lighthouse CI Token** (Optional)
   - Install Lighthouse CI GitHub App
   - Add `LHCI_GITHUB_APP_TOKEN` to secrets

4. **Set Up Postgres Analytics** (When needed)
   - Follow detailed guide above
   - Create database and schema
   - Add MCP configuration
   - Update analytics code

---

## 📝 Maintenance

### Weekly Tasks
- ✅ Review Dependabot PRs (automated)
- ✅ Check CodeQL security alerts
- ✅ Monitor bundle size trends
- ✅ Review accessibility issues

### Monthly Tasks
- ✅ Update workflow versions
- ✅ Review and update performance budgets
- ✅ Clean up old workflow runs
- ✅ Update this guide with lessons learned

---

## 🆘 Troubleshooting

### Common Issues

**Issue:** CI Pipeline fails on TypeScript check
```bash
# Fix locally:
npx tsc --noEmit
npm run lint
npm run format
```

**Issue:** Bundle size exceeds budget
```bash
# Analyze bundle:
npm run build
# Check dist/assets/ folder sizes
# Remove unused dependencies
# Add to manual chunks in vite.config.ts
```

**Issue:** Codecov upload fails
- Verify `CODECOV_TOKEN` is set correctly
- Check coverage report exists: `coverage/coverage-final.json`
- Ensure Vitest coverage is enabled

**Issue:** Percy visual tests fail
- Verify `PERCY_TOKEN` is set in GitHub Secrets
- Check `.percyrc.yml` configuration
- Ensure preview server starts correctly

---

## 📚 Resources

- **GitHub Actions Documentation**: https://docs.github.com/en/actions
- **Codecov Documentation**: https://docs.codecov.com
- **Percy Documentation**: https://docs.percy.io
- **Dependabot Documentation**: https://docs.github.com/en/code-security/dependabot
- **CodeQL Documentation**: https://codeql.github.com/docs/
- **MCP Documentation**: https://modelcontextprotocol.io

---

**Last Updated:** November 21, 2025  
**Maintained By:** Brashline Development Team
