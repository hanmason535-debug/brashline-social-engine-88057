# Security Quick-Start Script
# Run this after installing gitleaks to verify your security setup

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Security Setup Quick-Start" -ForegroundColor Cyan
Write-Host "Brashline Social Engine" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check 1: Gitleaks installed
Write-Host "[1/7] Checking gitleaks installation..." -ForegroundColor Yellow
$gitleaksInstalled = Get-Command gitleaks -ErrorAction SilentlyContinue

if ($gitleaksInstalled) {
    $version = gitleaks version 2>&1
    Write-Host "✅ gitleaks found: $version" -ForegroundColor Green
} else {
    Write-Host "❌ gitleaks not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Install gitleaks first:" -ForegroundColor Yellow
    Write-Host "  See GITLEAKS_INSTALL.md for installation instructions" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host ""

# Check 2: Husky installed
Write-Host "[2/7] Checking Husky installation..." -ForegroundColor Yellow
$huskyInstalled = Test-Path ".husky/pre-commit"

if ($huskyInstalled) {
    Write-Host "✅ Husky pre-commit hook found" -ForegroundColor Green
} else {
    Write-Host "⚠️  Husky not initialized" -ForegroundColor Yellow
    Write-Host "Run: npm install" -ForegroundColor White
}

Write-Host ""

# Check 3: Configuration files
Write-Host "[3/7] Checking configuration files..." -ForegroundColor Yellow

$configFiles = @(
    ".gitleaks.toml",
    ".github/workflows/secret-scan.yml",
    "SECURITY_REMEDIATION.md"
)

$allConfigsPresent = $true
foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file missing!" -ForegroundColor Red
        $allConfigsPresent = $false
    }
}

if (!$allConfigsPresent) {
    Write-Host ""
    Write-Host "Some configuration files are missing." -ForegroundColor Yellow
    Write-Host "Please restore them from the repository." -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Check 4: Scan current files
Write-Host "[4/7] Scanning current files for secrets..." -ForegroundColor Yellow
Write-Host "This may take a moment..." -ForegroundColor Gray
Write-Host ""

$scanResult = gitleaks detect --source . --config=.gitleaks.toml --no-git --redact 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ No secrets found in current files" -ForegroundColor Green
} else {
    if ($scanResult -match "Finding:") {
        Write-Host "⚠️  Secrets found in current files!" -ForegroundColor Yellow
        Write-Host ""
        Write-Host $scanResult
        Write-Host ""
        Write-Host "Review findings above and redact secrets before committing." -ForegroundColor Yellow
    } else {
        Write-Host "✅ No secrets found in current files" -ForegroundColor Green
    }
}

Write-Host ""

# Check 5: Scan git history
Write-Host "[5/7] Scanning git history for secrets..." -ForegroundColor Yellow
Write-Host "This will scan all commits - may take 1-2 minutes..." -ForegroundColor Gray
Write-Host ""

$historyReport = "security-scan-results-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
$historyScan = gitleaks detect --source . --config=.gitleaks.toml --report-path=$historyReport --redact 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ No secrets found in git history" -ForegroundColor Green
} else {
    if (Test-Path $historyReport) {
        $findings = Get-Content $historyReport | ConvertFrom-Json
        $findingCount = $findings.Count
        
        Write-Host "⚠️  Found $findingCount secret(s) in git history!" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Report saved to: $historyReport" -ForegroundColor White
        Write-Host ""
        
        # Show summary
        if ($findingCount -gt 0) {
            Write-Host "Secret types found:" -ForegroundColor Yellow
            $findings | Group-Object -Property RuleID | ForEach-Object {
                Write-Host "  - $($_.Name): $($_.Count) occurrence(s)" -ForegroundColor White
            }
            Write-Host ""
        }
        
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Rotate all exposed tokens immediately" -ForegroundColor White
        Write-Host "2. Follow SECURITY_REMEDIATION.md Section 2 for rotation" -ForegroundColor White
        Write-Host "3. Follow SECURITY_REMEDIATION.md Section 3 for history cleanup" -ForegroundColor White
        Write-Host "4. Or run: .\scripts\cleanup-git-history.ps1" -ForegroundColor White
    }
}

Write-Host ""

# Check 6: Test pre-commit hook
Write-Host "[6/7] Testing pre-commit hook..." -ForegroundColor Yellow

if (Test-Path ".husky/pre-commit") {
    # Create a test file with a dummy secret
    $testFile = ".gitleaks-test-$(Get-Date -Format 'yyyyMMddHHmmss').tmp"
    $testSecret = "ghp_test1234567890abcdefghijklmnopqrs"
    
    Write-Host "Creating test file with dummy secret..." -ForegroundColor Gray
    Set-Content -Path $testFile -Value "API_KEY=$testSecret"
    
    git add $testFile 2>&1 | Out-Null
    
    Write-Host "Testing gitleaks protect on staged files..." -ForegroundColor Gray
    $protectTest = gitleaks protect --staged --config=.gitleaks.toml --redact 2>&1
    
    # Clean up
    git reset HEAD $testFile 2>&1 | Out-Null
    Remove-Item $testFile -Force -ErrorAction SilentlyContinue
    
    if ($LASTEXITCODE -ne 0 -and $protectTest -match "Finding:") {
        Write-Host "✅ Pre-commit hook working - test secret blocked!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Pre-commit hook may not be working correctly" -ForegroundColor Yellow
        Write-Host "Test result: $protectTest" -ForegroundColor Gray
    }
} else {
    Write-Host "⚠️  Pre-commit hook not found" -ForegroundColor Yellow
}

Write-Host ""

# Check 7: GitHub security settings
Write-Host "[7/7] Checking GitHub security settings..." -ForegroundColor Yellow

$ghInstalled = Get-Command gh -ErrorAction SilentlyContinue

if ($ghInstalled) {
    $repoInfo = gh api /repos/hanmason535-debug/brashline-social-engine-88057 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        $repoJson = $repoInfo | ConvertFrom-Json
        
        # Check secret scanning
        $secretScanning = $repoJson.security_and_analysis.secret_scanning.status
        if ($secretScanning -eq "enabled") {
            Write-Host "✅ GitHub secret scanning: enabled" -ForegroundColor Green
        } else {
            Write-Host "❌ GitHub secret scanning: disabled" -ForegroundColor Red
            Write-Host "   Enable with: gh api --method PATCH /repos/hanmason535-debug/brashline-social-engine-88057 -f security_and_analysis[secret_scanning][status]=enabled" -ForegroundColor White
        }
        
        # Check push protection
        $pushProtection = $repoJson.security_and_analysis.secret_scanning_push_protection.status
        if ($pushProtection -eq "enabled") {
            Write-Host "✅ GitHub push protection: enabled" -ForegroundColor Green
        } else {
            Write-Host "⚠️  GitHub push protection: disabled" -ForegroundColor Yellow
            Write-Host "   Enable with: gh api --method PATCH /repos/hanmason535-debug/brashline-social-engine-88057 -f security_and_analysis[secret_scanning_push_protection][status]=enabled" -ForegroundColor White
        }
    } else {
        Write-Host "⚠️  Could not check GitHub settings" -ForegroundColor Yellow
        Write-Host "   Authenticate with: gh auth login" -ForegroundColor White
    }
} else {
    Write-Host "⚠️  GitHub CLI not installed - cannot check remote settings" -ForegroundColor Yellow
    Write-Host "   Install from: https://cli.github.com/" -ForegroundColor White
    Write-Host "   Or check manually: https://github.com/hanmason535-debug/brashline-social-engine-88057/settings/security_analysis" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($LASTEXITCODE -eq 0 -and $allConfigsPresent) {
    Write-Host "✅ Security setup looks good!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your repository is now protected by:" -ForegroundColor Cyan
    Write-Host "  • Local pre-commit hooks (gitleaks + lint-staged)" -ForegroundColor White
    Write-Host "  • GitHub Actions secret scanning (CI/CD)" -ForegroundColor White
    Write-Host "  • Custom gitleaks rules (.gitleaks.toml)" -ForegroundColor White
    Write-Host ""
    
    if (Test-Path $historyReport) {
        Write-Host "⚠️  WARNING: Secrets found in git history!" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Complete these steps:" -ForegroundColor Cyan
        Write-Host "1. Review: $historyReport" -ForegroundColor White
        Write-Host "2. Rotate all exposed tokens (see SECURITY_REMEDIATION.md Section 2)" -ForegroundColor White
        Write-Host "3. Clean git history (see SECURITY_REMEDIATION.md Section 3)" -ForegroundColor White
        Write-Host "4. Or run: .\scripts\cleanup-git-history.ps1" -ForegroundColor White
    } else {
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Enable GitHub secret scanning (if not already enabled)" -ForegroundColor White
        Write-Host "2. Enable GitHub push protection (if Advanced Security available)" -ForegroundColor White
        Write-Host "3. Review SECURITY_REMEDIATION.md for best practices" -ForegroundColor White
        Write-Host "4. Set up quarterly security audit reminders" -ForegroundColor White
    }
} else {
    Write-Host "⚠️  Setup incomplete or issues found" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Review the checks above and fix any issues." -ForegroundColor White
}

Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   SECURITY_REMEDIATION.md - Complete security guide" -ForegroundColor White
Write-Host "   GITLEAKS_INSTALL.md - Gitleaks installation" -ForegroundColor White
Write-Host "   .gitleaks.toml - Custom scanning rules" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Commands:" -ForegroundColor Cyan
Write-Host "   npm run scan:secrets - Scan entire repository" -ForegroundColor White
Write-Host "   npm run scan:secrets:uncommitted - Scan staged files only" -ForegroundColor White
Write-Host "   gitleaks detect --help - See all gitleaks options" -ForegroundColor White
Write-Host ""
