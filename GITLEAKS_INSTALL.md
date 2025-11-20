# Gitleaks Installation Guide
## Quick Setup for Windows

### Method 1: Download Binary (Recommended)

1. **Download gitleaks:**
   - Go to: https://github.com/gitleaks/gitleaks/releases/latest
   - Download: `gitleaks_8.21.2_windows_x64.zip` (or latest version)
   - Extract to: `C:\Program Files\gitleaks\`

2. **Add to PATH:**
   ```powershell
   # Option A: Permanently add to PATH (recommended)
   $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
   $newPath = "$currentPath;C:\Program Files\gitleaks"
   [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
   
   # Restart PowerShell after this
   
   # Option B: Temporarily add to PATH (current session only)
   $env:Path += ";C:\Program Files\gitleaks"
   ```

3. **Verify installation:**
   ```powershell
   gitleaks version
   # Expected: gitleaks version 8.21.2
   ```

### Method 2: Chocolatey

```powershell
# Install Chocolatey if not already installed
# Visit: https://chocolatey.org/install

# Install gitleaks
choco install gitleaks

# Verify
gitleaks version
```

### Method 3: Scoop

```powershell
# Install Scoop if not already installed
# Visit: https://scoop.sh/

# Install gitleaks
scoop install gitleaks

# Verify
gitleaks version
```

### Method 4: Go Install (If you have Go)

```powershell
go install github.com/gitleaks/gitleaks/v8@latest

# Add Go bin to PATH if not already
$env:Path += ";$env:USERPROFILE\go\bin"

# Verify
gitleaks version
```

---

## Post-Installation: Run First Scan

Once gitleaks is installed, run these commands:

### 1. Scan entire repository history

```powershell
cd D:\Brashline\brashline-social-engine-88057

# Full scan with report
npm run scan:secrets
# or
gitleaks detect --source . --verbose --redact --config=.gitleaks.toml --report-path=gitleaks-scan-report.json

# Check report
Get-Content gitleaks-scan-report.json | ConvertFrom-Json | Select-Object -ExpandProperty Findings | Format-Table
```

### 2. Scan staged files (for pre-commit)

```powershell
npm run scan:secrets:uncommitted
# or
gitleaks protect --verbose --redact --config=.gitleaks.toml
```

### 3. Test pre-commit hook

```powershell
# Try to commit a test secret
echo "API_KEY=sk_live_test_REDACTED" > test-secret.txt
git add test-secret.txt
git commit -m "test: should be blocked"

# Expected: Hook blocks commit with gitleaks error

# Clean up
git reset HEAD test-secret.txt
rm test-secret.txt
```

---

## Troubleshooting

### Error: "gitleaks: command not found"

**Solution:**
1. Verify gitleaks.exe is in `C:\Program Files\gitleaks\`
2. Check PATH includes gitleaks directory
3. Restart PowerShell/Terminal
4. Try absolute path: `"C:\Program Files\gitleaks\gitleaks.exe" version`

### Error: "The system cannot find the path specified"

**Solution:**
1. Create directory: `mkdir "C:\Program Files\gitleaks"`
2. Move gitleaks.exe to this directory
3. Add to PATH (see Method 1 above)

### Pre-commit hook doesn't run gitleaks

**Solution:**
1. Verify gitleaks in PATH: `gitleaks version`
2. Check `.husky/pre-commit` is executable
3. Ensure `.gitleaks.toml` exists in project root
4. Test hook manually: `.\.husky\pre-commit`

### False positives in scan

**Solution:**
1. Add patterns to `.gitleaks.toml` allowlist
2. Use `--redact` flag to hide sensitive values in output
3. Review and update custom rules in `.gitleaks.toml`

---

## Next Steps After Installation

1. ✅ Install gitleaks (Method 1-4 above)
2. ✅ Verify installation: `gitleaks version`
3. ✅ Run full repository scan: `npm run scan:secrets`
4. ✅ Review findings in `gitleaks-scan-report.json`
5. ✅ Test pre-commit hook with dummy secret
6. ✅ Proceed with token rotation (see SECURITY_REMEDIATION.md)
7. ✅ Clean git history if secrets found (see SECURITY_REMEDIATION.md Section 3)

---

## Quick Reference Commands

```powershell
# Check if gitleaks is installed
gitleaks version

# Scan entire repository
npm run scan:secrets

# Scan uncommitted changes
npm run scan:secrets:uncommitted

# Scan specific directory
gitleaks detect --source ./src --verbose --redact

# Generate report
gitleaks detect --source . --report-path=scan-report.json --report-format=json

# Scan specific commit
gitleaks detect --source . --log-opts="--all --commit <commit-sha>"
```

---

**Installation Priority:** HIGH  
**Estimated Time:** 5-10 minutes  
**Required For:** Pre-commit hooks, security scanning, git history cleanup
