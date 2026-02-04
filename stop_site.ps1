# Script to stop the local server on port 8000
$port = 8000

Write-Host "Stopping server on port $port..."

# Find the process listening on the port
$connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

if ($connections) {
    foreach ($conn in $connections) {
        $pid_to_kill = $conn.OwningProcess
        # PID 0 is System Idle Process, but sometimes System (4) holds ports (unexpected for http server)
        if ($pid_to_kill -gt 4) {
            Write-Host "Found process ID: $pid_to_kill"
            
            # Try Stop-Process first
            try {
                Stop-Process -Id $pid_to_kill -Force -ErrorAction Stop
                Write-Host "Process $pid_to_kill stopped successfully."
            }
            catch {
                Write-Warning "Stop-Process failed. Trying taskkill..."
                # Fallback to taskkill which sometimes handles permissions/stubborn processes better
                Start-Process -FilePath "taskkill" -ArgumentList "/F", "/PID", $pid_to_kill -NoNewWindow -Wait
            }
        }
    }
}
else {
    Write-Host "No server found running on port $port."
}
