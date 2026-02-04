# Script to sync changes to GitHub
$ScriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptPath

# Check for changes
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "No changes to sync."
    exit
}

# Add all changes
Write-Host "Adding changes..."
git add .

# Commit with timestamp
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$message = "Auto-update: $timestamp"
Write-Host "Committing with message: $message"
git commit -m "$message"

# Push to remote
Write-Host "Pushing to GitHub..."
git push origin master 2>&1 | ForEach-Object { 
    if ($_ -match "src refspec master does not match any") {
        # Fallback to main if master doesn't exist (common new default)
        Write-Warning "Master branch not found, trying 'main'..."
        git push origin main
    }
    else {
        Write-Host $_
    }
}
