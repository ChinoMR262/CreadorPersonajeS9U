# Script to run the local server
$ScriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$dir = Join-Path $ScriptPath "mi-sitio"
$port = 8000

Write-Host "Starting server on http://localhost:$port..."
Write-Host "Serving content from: $dir"

# Check if port is in use
$tcpPort = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($tcpPort) {
    Write-Warning "Port $port is already in use."
    Write-Warning "If the server fails to start, try running .\stop_site.ps1 first."
}

# Open browser automatically
Start-Process "http://localhost:$port"

# Start python server
python -m http.server $port --directory "$dir"
