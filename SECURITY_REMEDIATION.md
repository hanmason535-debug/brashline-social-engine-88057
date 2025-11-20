# Security Remediation Guide
## Brashline Social Engine - Token Exposure & History Cleanup

**Date Created:** November 21, 2025  
**Severity:** HIGH  
**Status:** 🔴 ACTION REQUIRED  

---

## 🚨 Executive Summary

Hardcoded tokens were found in documentation files committed to the repository:
- **Codecov Token:** 
- **Percy Token:** 

**Immediate Actions Required:**
1. ✅ Tokens redacted from current files (completed)
2. ⏳ **Rotate exposed tokens** (high priority)
3. ⏳ **Purge tokens from git history** (required)
4. ⏳ Enable GitHub secret scanning & push protection
5. ⏳ Setup pre-commit hooks to prevent future leaks

---

## 📋 Table of Contents

1. [Exposed Tokens Summary](#exposed-tokens-summary)
2. [Immediate Rotation Steps](#immediate-rotation-steps)
3. [Git History Cleanup](#git-history-cleanup)
4. [GitHub Security Settings](#github-security-settings)
5. [Pre-commit Hooks Setup](#pre-commit-hooks-setup)
6. [Verification & Testing](#verification--testing)
7. [Prevention Best Practices](#prevention-best-practices)

---

## 1. Exposed Tokens Summary

### 🔴 Compromised Credentials

#### Codecov Token
- **Value:** `f13c2597-5787-485e-ae7b-2ad69a808087`
- **Type:** Upload token for coverage reports
- **Exposed In:**
  - `WORKFLOWS_SETUP_GUIDE.md` (lines 34)
  - `TEST_REPORT.md` (line 747)
  - Git commits: `861cbb2` and earlier
- **Risk Level:** MEDIUM
  - Allows unauthorized uploads to Codecov project
  - Can manipulate coverage statistics
  - Cannot access other projects or sensitive data
- **Action:** Rotate immediately

#### Percy Visual Testing Token
- **Value:** `Se9s8LhELJHisopUYxAD`
- **Username:** `yushijain_PJVxRs`
- **Type:** Project access key for visual regression
- **Exposed In:**
  - `WORKFLOWS_SETUP_GUIDE.md` (line 40)
  - `TEST_REPORT.md` (lines 226, 659, 753)
  - `.percyrc.yml` (commented line 3)
  - Git commits: `27a3eaf`, `861cbb2` and earlier
- **Risk Level:** MEDIUM-HIGH
  - Allows unauthorized snapshot uploads
  - Can view existing visual test results
  - Potential for malicious baseline poisoning
- **Action:** Rotate immediately

### ✅ Already Mitigated

- All tokens redacted in current `main` branch (commit `5eabf34`)
- Secret scanning workflow added (`.github/workflows/secret-scan.yml`)
- Documentation updated with `**REDACTED**` placeholders

### ⚠️ Not Yet Mitigated

- Tokens still exist in git history (accessible via `git log`, GitHub commit history)
- Old tokens still valid (not rotated)
- Anyone with repo access can retrieve old commits containing tokens

---

## 2. Immediate Rotation Steps

### Priority 1: Rotate Codecov Token (15 minutes)

#### Step 1: Generate New Codecov Token

```powershell
# Option A: Via Codecov Web UI
# 1. Go to: https://codecov.io/gh/hanmason535-debug/brashline-social-engine-88057/settings
# 2. Navigate to "General" tab
# 3. Scroll to "Repository Upload Token"
# 4. Click "Regenerate" button
# 5. Copy the new token (format: UUID like f13c2597-5787-485e-ae7b-2ad69a808087)
# 6. Save it securely (password manager or temporary secure note)
```

#### Step 2: Update GitHub Secret

```powershell
# Option A: Via GitHub CLI (recommended)
gh secret set CODECOV_TOKEN --body "PASTE_NEW_TOKEN_HERE"

# Option B: Via Web UI
# 1. Go to: https://github.com/hanmason535-debug/brashline-social-engine-88057/settings/secrets/actions
# 2. Click on "CODECOV_TOKEN" (if exists) → "Update"
# 3. Or click "New repository secret" if not exists
# 4. Paste new token value
# 5. Click "Update secret" or "Add secret"
```

#### Step 3: Verify New Token Works

```powershell
# Trigger CI workflow to test new token
git commit --allow-empty -m "test: verify new Codecov token"
git push origin main

# Watch workflow run:
# https://github.com/hanmason535-debug/brashline-social-engine-88057/actions

# Expected: CI Pipeline succeeds and uploads coverage to Codecov
```

#### Step 4: Revoke Old Codecov Token

```powershell
# In Codecov web UI:
# 1. Return to: https://codecov.io/gh/hanmason535-debug/brashline-social-engine-88057/settings
# 2. Confirm new token is working (check recent uploads)
# 3. Old token is automatically invalidated when regenerated
# 4. Verify old token no longer works (optional: try upload with old token, should fail)
```

---

### Priority 2: Rotate Percy Token (15 minutes)

#### Step 1: Generate New Percy Token

```powershell
# Via Percy Web UI:
# 1. Go to: https://percy.io/yushijain_PJVxRs/brashline-social-engine
# 2. Click "Settings" → "Tokens"
# 3. Find current token (ends in ...pUYxAD)
# 4. Click "Regenerate" or "Create new token"
# 5. Copy the new token (format: alphanumeric string)
# 6. Save securely
```

#### Step 2: Update GitHub Secret

```powershell
# Option A: Via GitHub CLI (recommended)
gh secret set PERCY_TOKEN --body "PASTE_NEW_PERCY_TOKEN_HERE"

# Option B: Via Web UI
# 1. Go to: https://github.com/hanmason535-debug/brashline-social-engine-88057/settings/secrets/actions
# 2. Click "New repository secret" (if PERCY_TOKEN doesn't exist yet)
# 3. Name: PERCY_TOKEN
# 4. Value: Paste new token
# 5. Click "Add secret"
```

#### Step 3: Verify New Token Works

```powershell
# Trigger visual regression workflow (requires PR)
git checkout -b test/verify-percy-token
git commit --allow-empty -m "test: verify new Percy token"
git push origin test/verify-percy-token

# Create PR on GitHub and watch visual-regression.yml workflow
# Expected: Percy snapshots upload successfully
```

#### Step 4: Revoke Old Percy Token

```powershell
# In Percy web UI:
# 1. Return to: https://percy.io/yushijain_PJVxRs/brashline-social-engine/settings/tokens
# 2. Find old token (Se9s8LhELJHisopUYxAD or similar)
# 3. Click "Revoke" or "Delete" button
# 4. Confirm revocation
# 5. Verify old token no longer works
```

---

## 3. Git History Cleanup

### ⚠️ WARNING: This Rewrites Git History

**Implications:**
- All commit SHAs will change
- Team members must re-clone or reset their local repos
- Breaks existing PR links and references
- Requires force-push to remote
- Cannot be undone easily

**Coordination Required:**
1. Notify all team members 24 hours in advance
2. Ensure all branches are merged or backed up
3. Schedule during low-activity period (evening/weekend)
4. Have rollback plan ready

---

### Method 1: git-filter-repo (Recommended)

#### Prerequisites

```powershell
# Install git-filter-repo
# Option A: Via pip (recommended)
pip install git-filter-repo

# Option B: Manual download
# Download from: https://github.com/newren/git-filter-repo/releases
# Place git-filter-repo in your PATH
```

#### Step 1: Create Backup

```powershell
# Create full backup of repository
cd D:\Brashline
git clone --mirror https://github.com/hanmason535-debug/brashline-social-engine-88057.git brashline-backup-20251121.git

# Verify backup
cd brashline-backup-20251121.git
git log --oneline | Select-Object -First 10
```

#### Step 2: Prepare Replacements File

```powershell
# Create replacements.txt in project root
@"
f13c2597-5787-485e-ae7b-2ad69a808087==>CODECOV_TOKEN_REDACTED_PERMANENTLY
Se9s8LhELJHisopUYxAD==>PERCY_TOKEN_REDACTED_PERMANENTLY
"@ | Out-File -FilePath "D:\Brashline\brashline-social-engine-88057\replacements.txt" -Encoding UTF8
```

#### Step 3: Create Fresh Clone for Cleaning

```powershell
# Clone a fresh copy to work with
cd D:\Brashline
git clone https://github.com/hanmason535-debug/brashline-social-engine-88057.git brashline-clean
cd brashline-clean

# Verify current state
git log --oneline --all | Select-Object -First 20
```

#### Step 4: Run git-filter-repo

```powershell
# Run filter-repo with replacement file
git filter-repo --replace-text ../replacements.txt --force

# This will:
# - Scan all commits in all branches
# - Replace tokens with REDACTED placeholders
# - Rewrite commit SHAs
# - Take 1-5 minutes depending on repo size
```

#### Step 5: Verify Cleanup

```powershell
# Search for exposed tokens in entire history
git log --all --source --full-history -S "f13c2597-5787-485e-ae7b-2ad69a808087"
# Expected: No results

git log --all --source --full-history -S "Se9s8LhELJHisopUYxAD"
# Expected: No results

# Check if replacements were applied
git log --all --source --full-history -S "CODECOV_TOKEN_REDACTED_PERMANENTLY"
# Expected: Shows commits where replacement occurred

git log --all --source --full-history -S "PERCY_TOKEN_REDACTED_PERMANENTLY"
# Expected: Shows commits where replacement occurred
```

#### Step 6: Force Push to Remote

```powershell
# ⚠️ DESTRUCTIVE OPERATION - POINT OF NO RETURN

# Add remote (if not already added)
git remote add origin https://github.com/hanmason535-debug/brashline-social-engine-88057.git

# Force push all branches
git push --force --all origin

# Force push all tags
git push --force --tags origin

# Expected output: "forced update" messages for all branches
```

#### Step 7: Notify Team & Cleanup

```powershell
# Send notification to team:
# Subject: [URGENT] Git history rewritten - please re-clone repository
# 
# The repository history has been rewritten to remove exposed tokens.
# 
# ACTION REQUIRED:
# 1. Backup any local uncommitted work
# 2. Delete your local clone: rm -rf brashline-social-engine-88057
# 3. Re-clone: git clone https://github.com/hanmason535-debug/brashline-social-engine-88057.git
# 4. Restore any uncommitted work
# 
# DO NOT use `git pull` or `git rebase` - you must re-clone.
# 
# If you have open PRs, they may need to be recreated.
```

---

### Method 2: BFG Repo-Cleaner (Alternative)

#### Prerequisites

```powershell
# Download BFG (requires Java)
# Visit: https://rtyley.github.io/bfg-repo-cleaner/
# Download: bfg-1.14.0.jar (or latest version)

# Verify Java installed
java -version
# Expected: Java 8 or higher
```

#### Step 1: Create Backup (Same as Method 1)

```powershell
cd D:\Brashline
git clone --mirror https://github.com/hanmason535-debug/brashline-social-engine-88057.git brashline-backup-bfg.git
```

#### Step 2: Prepare Replacements File

```powershell
# Create passwords.txt for BFG
@"
f13c2597-5787-485e-ae7b-2ad69a808087
Se9s8LhELJHisopUYxAD
"@ | Out-File -FilePath "D:\Brashline\passwords.txt" -Encoding UTF8
```

#### Step 3: Run BFG

```powershell
# Run BFG on mirror clone
cd D:\Brashline
java -jar bfg-1.14.0.jar --replace-text passwords.txt brashline-backup-bfg.git

# BFG output will show:
# - Number of commits scanned
# - Number of files cleaned
# - Protected commits (HEAD is protected by default)
```

#### Step 4: Clean and Push

```powershell
cd brashline-backup-bfg.git

# Expire reflogs and garbage collect
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Verify cleanup
git log --all --oneline | Select-String "f13c2597"
# Expected: No results

# Force push
git push --force --all
git push --force --tags
```

---

### Method 3: Manual Commit Rewriting (For Specific Commits Only)

⚠️ Only use if tokens appear in a small number of recent commits

```powershell
# Identify commits containing tokens
git log --all --oneline -S "f13c2597-5787-485e-ae7b-2ad69a808087"

# Interactive rebase to edit specific commits
git rebase -i <commit-before-first-leak>^

# In editor, change "pick" to "edit" for commits to modify
# Save and close

# For each commit:
# 1. Edit files to remove tokens
# 2. Stage changes: git add .
# 3. Amend commit: git commit --amend --no-edit
# 4. Continue: git rebase --continue

# Force push when done
git push --force origin main
```

---

## 4. GitHub Security Settings

### Enable Secret Scanning (Required)

#### Via GitHub Web UI

```powershell
# 1. Go to repository Settings:
#    https://github.com/hanmason535-debug/brashline-social-engine-88057/settings

# 2. Navigate to "Security" in left sidebar

# 3. Click "Code security and analysis"

# 4. Under "Secret scanning":
#    - Click "Enable" button
#    - Feature is free for public repos
#    - For private repos: requires GitHub Advanced Security (paid)

# 5. Verify enabled:
#    - Should show "Secret scanning is enabled"
#    - Will scan all commits for known secret patterns
```

#### Via GitHub CLI

```powershell
# Enable secret scanning
gh api --method PATCH /repos/hanmason535-debug/brashline-social-engine-88057 `
  -f security_and_analysis[secret_scanning][status]=enabled

# Verify status
gh api /repos/hanmason535-debug/brashline-social-engine-88057 `
  --jq '.security_and_analysis.secret_scanning.status'
# Expected: "enabled"
```

---

### Enable Push Protection (Recommended)

⚠️ **Note:** Push protection requires GitHub Advanced Security (available on public repos for free, paid for private)

#### Via GitHub Web UI

```powershell
# 1. Go to: https://github.com/hanmason535-debug/brashline-social-engine-88057/settings/security_analysis

# 2. Under "Secret scanning":
#    - Find "Push protection" section
#    - Click "Enable" button

# 3. Configure:
#    - ✅ Block pushes with secrets detected
#    - ✅ Allow bypasses with justification (optional)
#    - ✅ Notify security email on bypass

# 4. Test:
#    - Try to commit a test token
#    - Expected: Git push rejected with error message
```

#### Via GitHub CLI

```powershell
# Enable push protection
gh api --method PATCH /repos/hanmason535-debug/brashline-social-engine-88057 `
  -f security_and_analysis[secret_scanning_push_protection][status]=enabled

# Verify status
gh api /repos/hanmason535-debug/brashline-social-engine-88057 `
  --jq '.security_and_analysis.secret_scanning_push_protection.status'
# Expected: "enabled"
```

---

### Review Secret Scanning Alerts

```powershell
# Check for existing alerts (after enabling)
gh api /repos/hanmason535-debug/brashline-social-engine-88057/secret-scanning/alerts

# Or via web UI:
# https://github.com/hanmason535-debug/brashline-social-engine-88057/security/secret-scanning

# Expected alerts:
# - Codecov token (if not yet rotated)
# - Percy token (if not yet rotated)
# - Any other secrets found

# Resolve alerts:
# 1. Rotate the exposed secret
# 2. Mark alert as "Revoked" in GitHub
# 3. Add comment explaining rotation
```

---

## 5. Pre-commit Hooks Setup

### Install Husky + lint-staged

```powershell
# Navigate to project directory
cd D:\Brashline\brashline-social-engine-88057

# Install Husky and lint-staged
npm install --save-dev husky lint-staged

# Initialize Husky
npx husky init

# This creates:
# - .husky/ directory
# - .husky/pre-commit hook
```

---

### Install gitleaks

```powershell
# Option A: Download binary (Windows)
# 1. Download from: https://github.com/gitleaks/gitleaks/releases
# 2. Download gitleaks_8.18.1_windows_x64.zip (or latest)
# 3. Extract gitleaks.exe to C:\Program Files\gitleaks\
# 4. Add to PATH:
$env:Path += ";C:\Program Files\gitleaks\"
# 5. Verify: gitleaks version

# Option B: Via Chocolatey
choco install gitleaks

# Option C: Via Scoop
scoop install gitleaks

# Verify installation
gitleaks version
# Expected: gitleaks version 8.18.1 (or later)
```

---

### Configure gitleaks

Create `.gitleaks.toml` in project root:

```toml
# .gitleaks.toml
title = "Gitleaks Config for Brashline Social Engine"

[extend]
useDefault = true

[[rules]]
id = "codecov-token"
description = "Codecov Upload Token"
regex = '''[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'''
tags = ["codecov", "token"]

[[rules]]
id = "percy-token"
description = "Percy Visual Testing Token"
regex = '''[A-Za-z0-9]{20,}'''
path = '''\.percyrc\.yml'''
tags = ["percy", "token"]

[[rules]]
id = "github-pat"
description = "GitHub Personal Access Token"
regex = '''ghp_[0-9a-zA-Z]{36}'''
tags = ["github", "token", "pat"]

[[rules]]
id = "generic-api-key"
description = "Generic API Key"
regex = '''(?i)(api[_-]?key|apikey|api[_-]?secret)['"]?\s*[:=]\s*['"]?[0-9a-zA-Z\-_]{20,}'''
tags = ["api", "key"]

[allowlist]
description = "Allowlist for false positives"
paths = [
  '''\.git/''',
  '''node_modules/''',
  '''dist/''',
  '''coverage/''',
  '''\.next/''',
]
regexes = [
  '''REDACTED''',
  '''YOUR_TOKEN_HERE''',
  '''ghp_your_token_here''',
  '''example\.com''',
  '''localhost''',
]
```

---

### Setup Pre-commit Hook

Edit `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run gitleaks scan before commit
echo "🔍 Scanning for secrets with gitleaks..."
gitleaks protect --verbose --staged --redact

if [ $? -ne 0 ]; then
  echo "❌ Gitleaks detected secrets in your commit!"
  echo "Please remove secrets and try again."
  echo "If this is a false positive, you can:"
  echo "  1. Add to .gitleaks.toml allowlist"
  echo "  2. Use --no-verify flag (NOT RECOMMENDED)"
  exit 1
fi

# Run prettier and eslint via lint-staged
npx lint-staged

echo "✅ Pre-commit checks passed!"
```

Make script executable (PowerShell):

```powershell
# No chmod needed on Windows, but ensure file is saved with LF endings
# Use VS Code or: dos2unix .husky/pre-commit (if dos2unix installed)
```

---

### Configure lint-staged

Add to `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,css,md,yml,yaml}": [
      "prettier --write"
    ],
    "*": [
      "gitleaks protect --staged --verbose --redact --no-banner"
    ]
  }
}
```

---

### Add npm Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "scan:secrets": "gitleaks detect --source . --verbose --redact",
    "scan:secrets:uncommitted": "gitleaks protect --verbose --redact",
    "prepare": "husky install"
  }
}
```

---

### Test Pre-commit Hook

```powershell
# Test with a dummy secret
echo "API_KEY=sk_live_REDACTED_EXAMPLE" > test-secret.txt
git add test-secret.txt
git commit -m "test: trying to commit a secret"

# Expected output:
# 🔍 Scanning for secrets with gitleaks...
# ○
#    │╲
#    │ ○
#    ○ ░
#    ░    gitleaks
#
# Finding:     API_KEY=sk_***REDACTED***
# Secret:      sk_***REDACTED***
# RuleID:      generic-api-key
# File:        test-secret.txt
# ❌ Gitleaks detected secrets in your commit!

# Clean up test
git reset HEAD test-secret.txt
rm test-secret.txt
```

---

## 6. Verification & Testing

### Verify Token Rotation

```powershell
# Test 1: Codecov token works
# Trigger CI workflow and check Codecov dashboard
git commit --allow-empty -m "test: verify Codecov token"
git push origin main

# Wait 2-3 minutes, then check:
# https://codecov.io/gh/hanmason535-debug/brashline-social-engine-88057
# Expected: New coverage report uploaded

# Test 2: Percy token works
# Create a PR to trigger visual regression
git checkout -b test/percy-verification
git commit --allow-empty -m "test: verify Percy token"
git push origin test/percy-verification
# Create PR on GitHub

# Check: https://percy.io/yushijain_PJVxRs/brashline-social-engine
# Expected: New snapshot uploaded
```

---

### Verify History Cleanup

```powershell
# Search entire history for old tokens
cd D:\Brashline\brashline-social-engine-88057

# Test 1: Search git log
git log --all --source --full-history -S "f13c2597-5787-485e-ae7b-2ad69a808087"
# Expected: No results (or only "REDACTED" placeholders)

git log --all --source --full-history -S "Se9s8LhELJHisopUYxAD"
# Expected: No results (or only "REDACTED" placeholders)

# Test 2: Search file contents in history
git grep "f13c2597-5787-485e-ae7b-2ad69a808087" $(git rev-list --all)
# Expected: No results

git grep "Se9s8LhELJHisopUYxAD" $(git rev-list --all)
# Expected: No results

# Test 3: Run gitleaks on entire history
gitleaks detect --source . --verbose --report-path gitleaks-report.json

# Check report
Get-Content gitleaks-report.json | ConvertFrom-Json | Select-Object -ExpandProperty Findings
# Expected: No findings (or only allowlisted items)
```

---

### Verify GitHub Security Settings

```powershell
# Check secret scanning status
gh api /repos/hanmason535-debug/brashline-social-engine-88057 `
  --jq '{secret_scanning: .security_and_analysis.secret_scanning.status, push_protection: .security_and_analysis.secret_scanning_push_protection.status}'

# Expected output:
# {
#   "secret_scanning": "enabled",
#   "push_protection": "enabled"
# }

# Check for alerts
gh api /repos/hanmason535-debug/brashline-social-engine-88057/secret-scanning/alerts `
  --jq '.[] | {number: .number, secret_type: .secret_type, state: .state}'

# Expected: Empty array [] or resolved alerts (state: "resolved")
```

---

### Verify Pre-commit Hooks

```powershell
# Test 1: Try to commit a fake secret
echo "CODECOV_TOKEN=f13c2597-5787-485e-ae7b-2ad69a808087" > test.env
git add test.env
git commit -m "test: should be blocked"

# Expected: Commit blocked by gitleaks

# Test 2: Commit without secrets
echo "VITE_SITE_URL=https://brashline.com" > test.env
git add test.env
git commit -m "test: should pass"

# Expected: Commit succeeds

# Clean up
git reset HEAD~1
rm test.env
```

---

## 7. Prevention Best Practices

### Developer Guidelines

1. **Never commit secrets directly**
   - Use `.env.local` for local secrets (gitignored)
   - Use GitHub Secrets for CI/CD
   - Use password managers for personal tokens

2. **Use environment variables**
   ```typescript
   // ❌ Bad
  const API_KEY = "sk_live_REDACTED_EXAMPLE";
   
   // ✅ Good
   const API_KEY = import.meta.env.VITE_API_KEY;
   ```

3. **Check before committing**
   ```powershell
   # Run scan manually before commit
   npm run scan:secrets:uncommitted
   
   # Review diff for secrets
   git diff --staged
   ```

4. **Use .env.example for templates**
   ```env
   # .env.example (safe to commit)
   VITE_API_KEY=your_api_key_here
   CODECOV_TOKEN=your_codecov_token
   
   # .env.local (gitignored)
   VITE_API_KEY=actual_secret_key
   CODECOV_TOKEN=actual_token
   ```

---

### Code Review Checklist

Before approving PRs, verify:
- [ ] No hardcoded credentials in code
- [ ] No tokens in config files
- [ ] Environment variables used for secrets
- [ ] `.env` files are gitignored
- [ ] No secrets in comments or documentation
- [ ] Gitleaks pre-commit hook passed

---

### Regular Security Audits

Schedule quarterly security reviews:

```powershell
# Full repository scan
npm run scan:secrets

# Check GitHub secret scanning alerts
gh api /repos/hanmason535-debug/brashline-social-engine-88057/secret-scanning/alerts

# Review GitHub Secrets inventory
gh secret list

# Rotate tokens (quarterly or after staff changes)
# - Follow rotation steps in Section 2
```

---

### Incident Response Plan

If secrets are exposed:

1. **Within 1 hour:**
   - Rotate exposed credentials immediately
   - Revoke old credentials
   - Document exposure timeline

2. **Within 4 hours:**
   - Remove secrets from git history
   - Enable GitHub secret scanning
   - Notify affected team members

3. **Within 24 hours:**
   - Review access logs for unauthorized usage
   - Update documentation
   - Implement additional controls (pre-commit hooks)

4. **Within 1 week:**
   - Post-mortem analysis
   - Update security procedures
   - Train team on prevention

---

## 📊 Remediation Checklist

### Immediate Actions (High Priority)

- [ ] Rotate Codecov token (Section 2.1)
- [ ] Rotate Percy token (Section 2.2)
- [ ] Update GitHub Secrets with new tokens
- [ ] Verify new tokens work in CI/CD

### History Cleanup (High Priority)

- [ ] Create repository backup
- [ ] Choose cleanup method (git-filter-repo or BFG)
- [ ] Notify team of upcoming history rewrite
- [ ] Run history cleanup tool
- [ ] Verify tokens removed from history
- [ ] Force push cleaned history
- [ ] Team members re-clone repository

### GitHub Security (Medium Priority)

- [ ] Enable secret scanning
- [ ] Enable push protection (if available)
- [ ] Review and resolve secret scanning alerts
- [ ] Configure alert notifications

### Pre-commit Hooks (Medium Priority)

- [ ] Install Husky and lint-staged
- [ ] Install gitleaks
- [ ] Create `.gitleaks.toml` configuration
- [ ] Setup pre-commit hook
- [ ] Test hook with dummy secret
- [ ] Document hook usage for team

### Verification (Required)

- [ ] Test rotated tokens in workflows
- [ ] Verify history cleanup completed
- [ ] Confirm secret scanning enabled
- [ ] Verify pre-commit hooks work
- [ ] Run full gitleaks scan
- [ ] Document completion date

### Documentation (Low Priority)

- [ ] Update README with security guidelines
- [ ] Create team security training materials
- [ ] Schedule quarterly security audits
- [ ] Update incident response procedures

---

## 🆘 Emergency Contacts

### If Tokens Are Actively Exploited

1. **Rotate all credentials immediately**
2. **Contact service providers:**
   - Codecov Support: support@codecov.io
   - Percy Support: hello@percy.io
3. **Review access logs:**
   - Codecov: https://codecov.io/gh/hanmason535-debug/brashline-social-engine-88057/settings/logs
   - Percy: https://percy.io/yushijain_PJVxRs/brashline-social-engine/settings/activity
4. **Monitor for unauthorized activity:**
   - Unusual coverage uploads
   - Unexpected visual snapshots
   - Unknown build triggers

---

## 📚 Additional Resources

- **gitleaks Documentation:** https://github.com/gitleaks/gitleaks
- **git-filter-repo Guide:** https://github.com/newren/git-filter-repo
- **BFG Repo-Cleaner:** https://rtyley.github.io/bfg-repo-cleaner/
- **GitHub Secret Scanning:** https://docs.github.com/en/code-security/secret-scanning
- **Husky Documentation:** https://typicode.github.io/husky/
- **Security Best Practices:** https://owasp.org/www-project-top-ten/

---

## 📝 Remediation Log

| Date | Action | Status | Completed By |
|------|--------|--------|--------------|
| 2025-11-21 | Tokens redacted from docs | ✅ Complete | GitHub Copilot |
| 2025-11-21 | Secret scan workflow added | ✅ Complete | GitHub Copilot |
| 2025-11-21 | SECURITY_REMEDIATION.md created | ✅ Complete | GitHub Copilot |
| YYYY-MM-DD | Codecov token rotated | ⏳ Pending | |
| YYYY-MM-DD | Percy token rotated | ⏳ Pending | |
| YYYY-MM-DD | Git history cleaned | ⏳ Pending | |
| YYYY-MM-DD | Secret scanning enabled | ⏳ Pending | |
| YYYY-MM-DD | Pre-commit hooks setup | ⏳ Pending | |

---

**Document Version:** 1.0  
**Last Updated:** November 21, 2025  
**Next Review:** December 21, 2025  
**Owner:** Brashline Security Team
