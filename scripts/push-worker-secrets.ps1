<#
  push-worker-secrets.ps1
  Pushes Worker secrets to Cloudflare for Siddartha and/or Coleco using Wrangler.

  Usage:
    .\scripts\push-worker-secrets.ps1 -Worker siddartha
    .\scripts\push-worker-secrets.ps1 -Worker coleco
    .\scripts\push-worker-secrets.ps1 -Worker all
    .\scripts\push-worker-secrets.ps1 -Worker all -DotEnvPath .env

  Notes:
    - Reads secret values from current process env vars.
    - Optionally loads KEY=VALUE lines from a .env file into process env first.
    - Never prints secret values.
#>

param(
    [ValidateSet("siddartha", "coleco", "all")]
    [string]$Worker = "all",
    [string]$DotEnvPath = "",
    [switch]$SkipMissingRequired
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot

function Resolve-DotEnvPath([string]$inputPath) {
    if (-not $inputPath) {
        return ""
    }
    if ([System.IO.Path]::IsPathRooted($inputPath)) {
        return $inputPath
    }
    return (Join-Path $repoRoot $inputPath)
}

function Import-DotEnv([string]$path) {
    if (-not $path) { return }
    if (-not (Test-Path $path)) {
        Write-Host "[secrets] .env not found: $path" -ForegroundColor Yellow
        return
    }

    Write-Host "[secrets] Loading env vars from $path" -ForegroundColor Gray
    foreach ($line in Get-Content -Path $path) {
        $trim = $line.Trim()
        if (-not $trim -or $trim.StartsWith("#")) { continue }
        $idx = $trim.IndexOf("=")
        if ($idx -lt 1) { continue }

        $key = $trim.Substring(0, $idx).Trim()
        $value = $trim.Substring($idx + 1).Trim()

        if ($value.StartsWith('"') -and $value.EndsWith('"')) {
            $value = $value.Substring(1, $value.Length - 2)
        }

        if (-not [string]::IsNullOrWhiteSpace($key) -and -not (Get-Item -Path "Env:$key" -ErrorAction SilentlyContinue)) {
            Set-Item -Path "Env:$key" -Value $value
        }
    }
}

function Push-WorkerSecrets {
    param(
        [string]$WorkerName,
        [string]$ConfigPath,
        [string[]]$Required,
        [string[]]$Optional
    )

    $configAbs = Join-Path $repoRoot $ConfigPath
    if (-not (Test-Path $configAbs)) {
        Write-Host "[secrets:$WorkerName] Config not found: $configAbs" -ForegroundColor Red
        exit 1
    }

    Write-Host "[secrets:$WorkerName] Using config: $ConfigPath" -ForegroundColor Cyan

    $missingRequired = @()
    foreach ($name in $Required) {
        $value = [Environment]::GetEnvironmentVariable($name)
        if ([string]::IsNullOrWhiteSpace($value)) {
            $missingRequired += $name
            continue
        }

        Write-Host "[secrets:$WorkerName] Pushing required secret: $name" -ForegroundColor Gray
        $value | npx wrangler secret put $name --config $ConfigPath | Out-Null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[secrets:$WorkerName] Failed pushing $name" -ForegroundColor Red
            exit $LASTEXITCODE
        }
    }

    foreach ($name in $Optional) {
        $value = [Environment]::GetEnvironmentVariable($name)
        if ([string]::IsNullOrWhiteSpace($value)) {
            continue
        }

        Write-Host "[secrets:$WorkerName] Pushing optional secret: $name" -ForegroundColor Gray
        $value | npx wrangler secret put $name --config $ConfigPath | Out-Null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[secrets:$WorkerName] Failed pushing $name" -ForegroundColor Red
            exit $LASTEXITCODE
        }
    }

    if ($missingRequired.Count -gt 0) {
        Write-Host "[secrets:$WorkerName] Missing required secrets:" -ForegroundColor Yellow
        foreach ($name in $missingRequired) {
            Write-Host "  - $name" -ForegroundColor Yellow
        }
        if (-not $SkipMissingRequired) {
            Write-Host "[secrets:$WorkerName] Aborting due to missing required secrets. Use -SkipMissingRequired to continue." -ForegroundColor Red
            exit 1
        }
    }

    Write-Host "[secrets:$WorkerName] Done." -ForegroundColor Green
}

$resolvedDotEnv = Resolve-DotEnvPath $DotEnvPath
Import-DotEnv $resolvedDotEnv

if (-not $env:CLOUDFLARE_API_TOKEN) {
    $userToken = [Environment]::GetEnvironmentVariable("CLOUDFLARE_API_TOKEN", "User")
    $machineToken = [Environment]::GetEnvironmentVariable("CLOUDFLARE_API_TOKEN", "Machine")
    if ($userToken) {
        $env:CLOUDFLARE_API_TOKEN = $userToken
    } elseif ($machineToken) {
        $env:CLOUDFLARE_API_TOKEN = $machineToken
    }
}

if (-not $env:CLOUDFLARE_API_TOKEN) {
    Write-Host "[secrets] CLOUDFLARE_API_TOKEN is not set." -ForegroundColor Red
    Write-Host "          Set it before running this script." -ForegroundColor Red
    exit 1
}

Push-Location $repoRoot
try {
    if ($Worker -eq "siddartha" -or $Worker -eq "all") {
        Push-WorkerSecrets \
            -WorkerName "siddartha" \
            -ConfigPath "apps/siddartha/wrangler.toml" \
            -Required @(
                "MEM0_API_KEY",
                "COMET_SECRET",
                "OPENAI_API_KEY"
            ) \
            -Optional @(
                "NOTION_TOKEN",
                "NOTION_CAMPFIRE_TALKS_DB_ID",
                "DISCORD_WEBHOOK_URL",
                "CAMPFIRE_WEBHOOK_URL",
                "ANTHROPIC_API_KEY",
                "GOOGLE_API_KEY",
                "DEEPSEEK_API_KEY",
                "MINDBRIDGE_ROUTER_URL",
                "MINDBRIDGE_API_KEY"
            )
    }

    if ($Worker -eq "coleco" -or $Worker -eq "all") {
        Push-WorkerSecrets \
            -WorkerName "coleco" \
            -ConfigPath "apps/coleco/wrangler.toml" \
            -Required @(
                "MEM0_API_KEY"
            ) \
            -Optional @(
                "LETTA_SUPPLEMENTAL_URL",
                "LETTA_API_KEY",
                "NOTION_SUPPLEMENTAL_URL",
                "NOTION_SUPPLEMENTAL_TOKEN",
                "CONSTELLATION_REGISTRY_URL",
                "CONSTELLATION_MAPPINGS_URL",
                "NOVA_SUPPLEMENTAL_URL",
                "NOVA_SUPPLEMENTAL_TOKEN",
                "ORION_SUPPLEMENTAL_URL",
                "ORION_SUPPLEMENTAL_TOKEN",
                "THE_FUCKFACE_SUPPLEMENTAL_URL",
                "THE_FUCKFACE_SUPPLEMENTAL_TOKEN",
                "FOUNDRY_KEEP_SUPPLEMENTAL_URL",
                "FOUNDRY_KEEP_SUPPLEMENTAL_TOKEN",
                "SUPPLEMENTAL_PROXY_URL",
                "SUPPLEMENTAL_PROXY_TOKEN"
            )
    }
}
finally {
    Pop-Location
}
