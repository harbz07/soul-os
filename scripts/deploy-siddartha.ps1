<#
  deploy-siddartha.ps1
  Uploads a new Siddartha Worker version using the correct Wrangler config.

  Usage:
    .\scripts\deploy-siddartha.ps1
    .\scripts\deploy-siddartha.ps1 -Login

  Notes:
    - For CI/non-interactive deploys, prefer CLOUDFLARE_API_TOKEN.
    - This script always targets apps/siddartha/wrangler.toml.
#>

param(
    [switch]$Login,
    [string]$ConfigPath = "apps/siddartha/wrangler.toml"
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$configAbs = Join-Path $repoRoot $ConfigPath

if (-not (Test-Path $configAbs)) {
    Write-Host "[deploy] Wrangler config not found: $configAbs" -ForegroundColor Red
    exit 1
}

Push-Location $repoRoot
try {
    if ($Login) {
        Write-Host "[deploy] Starting Wrangler login..." -ForegroundColor Cyan
        npx wrangler login
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[deploy] Login failed." -ForegroundColor Red
            exit $LASTEXITCODE
        }
    }

    if (-not $env:CLOUDFLARE_API_TOKEN) {
        Write-Host "[deploy] CLOUDFLARE_API_TOKEN not set. Wrangler may require interactive OAuth login." -ForegroundColor Yellow
    }

    Write-Host "[deploy] Uploading Siddartha worker version..." -ForegroundColor Cyan
    Write-Host "[deploy] Config: $ConfigPath" -ForegroundColor Gray

    npx wrangler versions upload --config $ConfigPath
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[deploy] Upload failed." -ForegroundColor Red
        exit $LASTEXITCODE
    }

    Write-Host "[deploy] Upload completed successfully." -ForegroundColor Green
}
finally {
    Pop-Location
}
