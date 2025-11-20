# Git History Cleanup Script
# Use this script to purge exposed tokens from repository history
# WARNING: This rewrites git history - coordinate with team first!

# Configuration
$REPO_URL = "https://github.com/hanmason535-debug/brashline-social-engine-88057.git"
$BACKUP_DIR = "D:\Brashline\backups"
$WORK_DIR = "D:\Brashline\cleanup"
$TIMESTAMP = Get-Date -Format "yyyyMMdd-HHmmss"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Git History Cleanup Script" -ForegroundColor Cyan
Write-Host "Brashline Social Engine" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Create backup
Write-Host "[1/7] Creating backup..." -ForegroundColor Yellow
if (!(Test-Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Path $BACKUP_DIR | Out-Null
}

$BACKUP_PATH = Join-Path $BACKUP_DIR "brashline-backup-$TIMESTAMP.git"
Write-Host "Cloning to: $BACKUP_PATH" -ForegroundColor Gray

git clone --mirror $REPO_URL $BACKUP_PATH

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backup created successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Backup failed! Exiting..." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: Verify backup
Write-Host "[2/7] Verifying backup..." -ForegroundColor Yellow
Push-Location $BACKUP_PATH
$commitCount = (git log --oneline --all | Measure-Object).Count
Write-Host "Backup contains $commitCount commits" -ForegroundColor Gray
Pop-Location

if ($commitCount -gt 0) {
    Write-Host "✅ Backup verified" -ForegroundColor Green
} else {
    Write-Host "❌ Backup verification failed! Exiting..." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 3: Create replacements file
Write-Host "[3/7] Creating replacements file..." -ForegroundColor Yellow

$REPLACEMENTS_FILE = Join-Path $WORK_DIR "replacements.txt"
if (!(Test-Path $WORK_DIR)) {
    New-Item -ItemType Directory -Path $WORK_DIR | Out-Null
}

# Known exposed tokens (add more as needed)
$replacements = @"
# Codecov Token
f13c2597-5787-485e-ae7b-2ad69a808087==>CODECOV_TOKEN_REDACTED_PERMANENTLY

# Percy Token
Se9s8LhELJHisopUYxAD==>PERCY_TOKEN_REDACTED_PERMANENTLY

# Add any other exposed tokens below:
# pattern==>REPLACEMENT_TEXT
"@

Set-Content -Path $REPLACEMENTS_FILE -Value $replacements -Encoding UTF8
Write-Host "Created: $REPLACEMENTS_FILE" -ForegroundColor Gray
Write-Host "✅ Replacements file created" -ForegroundColor Green
Write-Host ""

# Step 4: Choose cleanup method
Write-Host "[4/7] Choose cleanup method:" -ForegroundColor Yellow
Write-Host "  1. git-filter-repo (Recommended - faster, safer)" -ForegroundColor White
Write-Host "  2. BFG Repo-Cleaner (Alternative)" -ForegroundColor White
Write-Host "  3. Skip cleanup (just verify backup)" -ForegroundColor White
Write-Host ""

$method = Read-Host "Enter choice (1-3)"

if ($method -eq "3") {
    Write-Host ""
    Write-Host "✅ Backup completed. Cleanup skipped." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Install git-filter-repo or BFG manually" -ForegroundColor White
    Write-Host "2. Run this script again and choose method 1 or 2" -ForegroundColor White
    Write-Host "3. Or follow manual instructions in SECURITY_REMEDIATION.md" -ForegroundColor White
    exit 0
}

# Step 5: Clone fresh copy for cleanup
Write-Host ""
Write-Host "[5/7] Cloning fresh copy for cleanup..." -ForegroundColor Yellow

$CLEAN_PATH = Join-Path $WORK_DIR "brashline-clean-$TIMESTAMP"
git clone $REPO_URL $CLEAN_PATH

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Fresh clone created" -ForegroundColor Green
} else {
    Write-Host "❌ Clone failed! Exiting..." -ForegroundColor Red
    exit 1
}

Push-Location $CLEAN_PATH
Write-Host ""

# Step 6: Run cleanup based on method
if ($method -eq "1") {
    # git-filter-repo method
    Write-Host "[6/7] Running git-filter-repo..." -ForegroundColor Yellow
    Write-Host ""
    
    # Check if git-filter-repo is installed
    $filterRepoInstalled = Get-Command git-filter-repo -ErrorAction SilentlyContinue
    
    if (!$filterRepoInstalled) {
        Write-Host "❌ git-filter-repo not found!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Install with pip:" -ForegroundColor Yellow
        Write-Host "  pip install git-filter-repo" -ForegroundColor White
        Write-Host ""
        Write-Host "Or download from:" -ForegroundColor Yellow
        Write-Host "  https://github.com/newren/git-filter-repo/releases" -ForegroundColor White
        Pop-Location
        exit 1
    }
    
    Write-Host "Running: git filter-repo --replace-text $REPLACEMENTS_FILE --force" -ForegroundColor Gray
    git filter-repo --replace-text $REPLACEMENTS_FILE --force
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ History rewritten successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ History rewrite failed!" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    
} elseif ($method -eq "2") {
    # BFG method
    Write-Host "[6/7] Running BFG Repo-Cleaner..." -ForegroundColor Yellow
    Write-Host ""
    
    # Check if BFG is available
    $bfgPath = "C:\Program Files\bfg\bfg.jar"
    if (!(Test-Path $bfgPath)) {
        Write-Host "❌ BFG not found at: $bfgPath" -ForegroundColor Red
        Write-Host ""
        Write-Host "Download from:" -ForegroundColor Yellow
        Write-Host "  https://rtyley.github.io/bfg-repo-cleaner/" -ForegroundColor White
        Write-Host ""
        Write-Host "Then extract to: C:\Program Files\bfg\" -ForegroundColor Yellow
        Pop-Location
        exit 1
    }
    
    # Check Java
    $javaInstalled = Get-Command java -ErrorAction SilentlyContinue
    if (!$javaInstalled) {
        Write-Host "❌ Java not found! BFG requires Java 8 or higher." -ForegroundColor Red
        Pop-Location
        exit 1
    }
    
    Write-Host "Running: java -jar $bfgPath --replace-text $REPLACEMENTS_FILE" -ForegroundColor Gray
    java -jar $bfgPath --replace-text $REPLACEMENTS_FILE .
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "Cleaning up..." -ForegroundColor Gray
        git reflog expire --expire=now --all
        git gc --prune=now --aggressive
        Write-Host "✅ History rewritten successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ History rewrite failed!" -ForegroundColor Red
        Pop-Location
        exit 1
    }
}

Write-Host ""

# Step 7: Verify cleanup
Write-Host "[7/7] Verifying cleanup..." -ForegroundColor Yellow
Write-Host ""

# Search for exposed tokens
$foundCodecov = git log --all --source --full-history -S "f13c2597-5787-485e-ae7b-2ad69a808087" 2>&1
$foundPercy = git log --all --source --full-history -S "Se9s8LhELJHisopUYxAD" 2>&1

$cleanupSuccessful = $true

if ($foundCodecov -match "f13c2597") {
    Write-Host "⚠️  Codecov token still found in history!" -ForegroundColor Yellow
    $cleanupSuccessful = $false
} else {
    Write-Host "✅ Codecov token not found in history" -ForegroundColor Green
}

if ($foundPercy -match "Se9s8LhELJH") {
    Write-Host "⚠️  Percy token still found in history!" -ForegroundColor Yellow
    $cleanupSuccessful = $false
} else {
    Write-Host "✅ Percy token not found in history" -ForegroundColor Green
}

Write-Host ""

if ($cleanupSuccessful) {
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✅ CLEANUP SUCCESSFUL!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  WARNING: You are about to rewrite public history!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Before force-pushing:" -ForegroundColor Yellow
    Write-Host "1. Notify all team members to backup their work" -ForegroundColor White
    Write-Host "2. Ensure all branches are merged or backed up" -ForegroundColor White
    Write-Host "3. Verify tokens have been rotated" -ForegroundColor White
    Write-Host ""
    Write-Host "Ready to force-push?" -ForegroundColor Yellow
    $confirm = Read-Host "Type 'YES' to continue, anything else to cancel"
    
    if ($confirm -eq "YES") {
        Write-Host ""
        Write-Host "Force-pushing to remote..." -ForegroundColor Yellow
        
        # Add remote if needed
        git remote add origin $REPO_URL 2>$null
        
        # Force push all branches and tags
        git push --force --all origin
        git push --force --tags origin
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "========================================" -ForegroundColor Green
            Write-Host "✅ HISTORY REWRITE COMPLETE!" -ForegroundColor Green
            Write-Host "========================================" -ForegroundColor Green
            Write-Host ""
            Write-Host "Next steps:" -ForegroundColor Cyan
            Write-Host "1. Notify team to re-clone repository" -ForegroundColor White
            Write-Host "2. Update any open PRs" -ForegroundColor White
            Write-Host "3. Verify workflows still work" -ForegroundColor White
            Write-Host "4. Mark secret scanning alerts as resolved" -ForegroundColor White
        } else {
            Write-Host "❌ Force push failed!" -ForegroundColor Red
            Write-Host "Check your permissions and try again." -ForegroundColor Yellow
        }
    } else {
        Write-Host ""
        Write-Host "⏸️  Force-push cancelled." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "To push manually later:" -ForegroundColor Cyan
        Write-Host "cd $CLEAN_PATH" -ForegroundColor White
        Write-Host "git push --force --all origin" -ForegroundColor White
        Write-Host "git push --force --tags origin" -ForegroundColor White
    }
} else {
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "❌ CLEANUP INCOMPLETE" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Tokens still found in history." -ForegroundColor Yellow
    Write-Host "Review replacements.txt and try again." -ForegroundColor Yellow
}

Pop-Location

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Cleanup Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Backup location: $BACKUP_PATH" -ForegroundColor White
Write-Host "Cleaned repo:    $CLEAN_PATH" -ForegroundColor White
Write-Host "Replacements:    $REPLACEMENTS_FILE" -ForegroundColor White
Write-Host ""
Write-Host "📚 For more details, see SECURITY_REMEDIATION.md" -ForegroundColor Cyan
Write-Host ""
