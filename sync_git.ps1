# Script to sync changes to GitHub
$ScriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptPath

# Check for changes
$status = git status --porcelain
$unpushed = git log origin/master..HEAD --oneline 2>$null

if ([string]::IsNullOrWhiteSpace($status) -and [string]::IsNullOrWhiteSpace($unpushed)) {
    Write-Host "No changes to sync (local is clean and no unpushed commits)."
    
    # Check if we have any commits at all (remote might not exist yet)
    $hasCommits = git rev-parse HEAD 2>$null
    if (-not $hasCommits) { exit }
    
    # If we have commits but no upstream tracking info, we might need to push
    # This is a bit complex to detect perfectly in PS without git noise, 
    # so we'll just allow the script to proceed to push if status is clean BUT we suspect unpushed.
    # Simpler: If clean, skip add/commit but Try Push.
}

if (-not [string]::IsNullOrWhiteSpace($status)) {
    # Add all changes
    Write-Host "Adding changes..."
    git add .

    # Commit with timestamp
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $message = "Auto-update: $timestamp"
    Write-Host "Committing with message: $message"
    git commit -m "$message"
}
else {
    Write-Host "No new file changes to commit."
}

# Push to remote
Write-Host "Pushing to GitHub..."
Write-Host "Opening a new window for 'git push'. Please check for a new terminal window to sign in..."

# Push master (or main) in a new window using cmd to ensure visibility and pause
$cmdCommand = "/c start cmd /k `"git push origin master & pause`""
Start-Process "cmd" -ArgumentList $cmdCommand -Wait

# Note: The new window will show the output and pause.
Write-Host "Process launched. Please check the new window."
