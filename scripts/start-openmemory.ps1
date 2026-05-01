<# 
  start-openmemory.ps1
  Starts the local OpenMemory API + graphical UI, runs the hosted→local
  mem0 sync, and opens the memory browser in the default browser.

  Usage:
    .\scripts\start-openmemory.ps1              # start API + UI + sync + open browser
    .\scripts\start-openmemory.ps1 -SkipSync    # start only, no sync
    .\scripts\start-openmemory.ps1 -SyncOnly    # sync against already-running server
    .\scripts\start-openmemory.ps1 -ApiOnly     # start API only (no UI)
#>

param(
    [switch]$SkipSync,
    [switch]$SyncOnly,
    [switch]$ApiOnly,
    [string]$Port = "8765",
    [string]$UiPort = "3000",
    [string]$UserId = "harvey"
)

$ErrorActionPreference = "Stop"

$repoRoot   = Split-Path -Parent $PSScriptRoot                                   # soul-os
$apiDir     = Join-Path $repoRoot "memory_stores\mem0\openmemory\api"
$uiDir      = Join-Path $repoRoot "memory_stores\mem0\openmemory\ui"
$venvPython = Join-Path $apiDir ".openmemory_venv\Scripts\python.exe"
$venvUvi    = Join-Path $apiDir ".openmemory_venv\Scripts\uvicorn.exe"
$syncScript = Join-Path $repoRoot "tools\mem0-sync\hosted_to_local_sync.py"
$dotenvFile = Join-Path (Split-Path -Parent $repoRoot | Join-Path -ChildPath "graph_memory_database") ".env"
$baseUrl    = "http://127.0.0.1:$Port"
$uiUrl      = "http://localhost:$UiPort"

# ── Resolve MEM0_API_KEY ────────────────────────────────
function Resolve-Mem0Key {
    if ($env:MEM0_API_KEY) { return $env:MEM0_API_KEY }

    # Try graph_memory_database .env
    if (Test-Path $dotenvFile) {
        $match = Select-String -Path $dotenvFile -Pattern "^MEM0_API_KEY=(.+)$" | Select-Object -First 1
        if ($match) { return $match.Matches.Groups[1].Value.Trim() }
    }

    # Try soul-os memory_stores/mem0/.env
    $altEnv = Join-Path $repoRoot "memory_stores\mem0\.env"
    if (Test-Path $altEnv) {
        $match = Select-String -Path $altEnv -Pattern "^MEM0_API_KEY=(.+)$" | Select-Object -First 1
        if ($match) { return $match.Matches.Groups[1].Value.Trim() }
    }

    return $null
}

# ── Preflight checks ────────────────────────────────────
if (-not (Test-Path $venvPython)) {
    Write-Host "[openmemory] venv not found at $apiDir\.openmemory_venv" -ForegroundColor Red
    Write-Host "             Run:  python -m venv .openmemory_venv && .openmemory_venv\Scripts\pip install -r requirements.txt" -ForegroundColor Yellow
    exit 1
}

# ── Start server (unless -SyncOnly) ─────────────────────
if (-not $SyncOnly) {
    # Check if port is already in use
    $listening = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    if ($listening) {
        Write-Host "[openmemory] Port $Port already in use — assuming server is running." -ForegroundColor Yellow
    } else {
        Write-Host "[openmemory] Starting OpenMemory API on port $Port ..." -ForegroundColor Cyan
        $env:USER = $UserId
        Start-Process -FilePath $venvUvi -ArgumentList "main:app","--port",$Port -WorkingDirectory $apiDir -WindowStyle Minimized
        Write-Host "[openmemory] Waiting for server to become ready ..." -ForegroundColor Gray

        $ready = $false
        for ($i = 0; $i -lt 20; $i++) {
            Start-Sleep -Milliseconds 500
            try {
                $null = Invoke-RestMethod -Uri "$baseUrl/api/v1/stats/?user_id=$UserId" -Method Get -TimeoutSec 2
                $ready = $true
                break
            } catch { }
        }

        if (-not $ready) {
            Write-Host "[openmemory] Server did not respond within 10 seconds." -ForegroundColor Red
            exit 1
        }
        Write-Host "[openmemory] Server is ready." -ForegroundColor Green
    }
}

# ── Run hosted→local sync (unless -SkipSync) ────────────
if (-not $SkipSync) {
    $mem0Key = Resolve-Mem0Key
    if (-not $mem0Key) {
        Write-Host "[sync] MEM0_API_KEY not found in env or .env files — skipping sync." -ForegroundColor Yellow
    } else {
        Write-Host "[sync] Running hosted → local mem0 sync for user '$UserId' ..." -ForegroundColor Cyan
        $env:MEM0_API_KEY = $mem0Key
        & $venvPython $syncScript --user-id $UserId --local-base-url $baseUrl
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[sync] Sync completed successfully." -ForegroundColor Green
        } else {
            Write-Host "[sync] Sync failed (exit code $LASTEXITCODE). Check summary JSON for details." -ForegroundColor Red
        }
    }
}

# ── Start UI (unless -SyncOnly or -ApiOnly) ──────────────
if (-not $SyncOnly -and -not $ApiOnly) {
    $uiListening = Get-NetTCPConnection -LocalPort $UiPort -State Listen -ErrorAction SilentlyContinue
    if ($uiListening) {
        Write-Host "[ui] Port $UiPort already in use — assuming UI is running." -ForegroundColor Yellow
    } else {
        if (-not (Test-Path (Join-Path $uiDir "node_modules"))) {
            Write-Host "[ui] Installing UI dependencies ..." -ForegroundColor Cyan
            Start-Process -FilePath "pnpm" -ArgumentList "install" -WorkingDirectory $uiDir -NoNewWindow -Wait
        }
        Write-Host "[ui] Starting OpenMemory UI on port $UiPort ..." -ForegroundColor Cyan
        Start-Process -FilePath "pnpm" -ArgumentList "dev","--port",$UiPort -WorkingDirectory $uiDir -WindowStyle Minimized

        $uiReady = $false
        for ($i = 0; $i -lt 20; $i++) {
            Start-Sleep -Milliseconds 500
            try {
                $null = Invoke-WebRequest -Uri $uiUrl -Method Head -TimeoutSec 2 -ErrorAction Stop
                $uiReady = $true
                break
            } catch { }
        }

        if (-not $uiReady) {
            Write-Host "[ui] UI did not respond within 10 seconds — it may still be compiling." -ForegroundColor Yellow
        } else {
            Write-Host "[ui] UI is ready." -ForegroundColor Green
        }
    }
}

# ── Print stats ──────────────────────────────────────────
try {
    $stats = Invoke-RestMethod -Uri "$baseUrl/api/v1/stats/?user_id=$UserId" -Method Get -TimeoutSec 5
    Write-Host ""
    Write-Host "  Memories: $($stats.total_memories)    Apps: $($stats.total_apps)" -ForegroundColor White
    Write-Host "  API:      $baseUrl/docs" -ForegroundColor Gray
    if (-not $ApiOnly) {
        Write-Host "  Browser:  $uiUrl" -ForegroundColor Cyan
    }
    Write-Host ""
} catch {
    Write-Host "[openmemory] Could not fetch stats." -ForegroundColor Yellow
}

# ── Open browser ─────────────────────────────────────────
if (-not $ApiOnly) {
    $targetUrl = $uiUrl
} else {
    $targetUrl = "$baseUrl/docs"
}
Write-Host "[openmemory] Opening $targetUrl in browser ..." -ForegroundColor Cyan
Start-Process $targetUrl
