<#
  deploy-coleco.ps1
  Uploads a new Coleco Worker version using the correct Wrangler config.

  Usage:
    .\scripts\deploy-coleco.ps1
    .\scripts\deploy-coleco.ps1 -Login

  Notes:
    - For CI/non-interactive deploys, prefer CLOUDFLARE_API_TOKEN.
    - This script always targets apps/coleco/wrangler.toml.
#>

param(
    [switch]$Login,
    [ValidateSet("deploy", "upload")]
    [string]$Mode = "deploy",
    [string]$ConfigPath = "apps/coleco/wrangler.toml"
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
    if (-not $env:CLOUDFLARE_API_TOKEN) {
        $userToken = [Environment]::GetEnvironmentVariable("CLOUDFLARE_API_TOKEN", "User")
        $machineToken = [Environment]::GetEnvironmentVariable("CLOUDFLARE_API_TOKEN", "Machine")
        if ($userToken) {
            $env:CLOUDFLARE_API_TOKEN = $userToken
        } elseif ($machineToken) {
            $env:CLOUDFLARE_API_TOKEN = $machineToken
        }
    }

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

    if ($Mode -eq "deploy") {
        Write-Host "[deploy] Deploying Coleco worker to production..." -ForegroundColor Cyan
    } else {
        Write-Host "[deploy] Uploading Coleco worker version..." -ForegroundColor Cyan
    }
    Write-Host "[deploy] Config: $ConfigPath" -ForegroundColor Gray

    if ($Mode -eq "deploy") {
        npx wrangler deploy --config $ConfigPath
    } else {
        npx wrangler versions upload --config $ConfigPath
    }
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[deploy] Command failed." -ForegroundColor Red
        exit $LASTEXITCODE
    }

    if ($Mode -eq "deploy") {
        Write-Host "[deploy] Production deploy completed successfully." -ForegroundColor Green
    } else {
        Write-Host "[deploy] Upload completed successfully." -ForegroundColor Green
    }
}
finally {
    Pop-Location
}
