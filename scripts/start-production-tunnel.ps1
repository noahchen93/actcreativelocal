$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$runtimeDirectory = Join-Path $repoRoot "tmp"
$tunnelOutputLog = Join-Path $runtimeDirectory "cloudflared-production.out.log"
$tunnelErrorLog = Join-Path $runtimeDirectory "cloudflared-production.err.log"
$configPath = Join-Path $env:USERPROFILE ".cloudflared\config.yml"

function Get-LocalEnvValue {
  param([Parameter(Mandatory = $true)][string]$Name)

  $envPath = Join-Path $repoRoot ".env.local"
  if (-not (Test-Path -LiteralPath $envPath)) {
    return $null
  }

  $line = Get-Content -LiteralPath $envPath -Encoding UTF8 |
    Where-Object { $_ -match "^\s*$([regex]::Escape($Name))\s*=" } |
    Select-Object -First 1

  if (-not $line) {
    return $null
  }

  $value = ($line -split "=", 2)[1].Trim()
  if (
    ($value.StartsWith('"') -and $value.EndsWith('"')) -or
    ($value.StartsWith("'") -and $value.EndsWith("'"))
  ) {
    $value = $value.Substring(1, $value.Length - 2)
  }

  return $value
}

function Get-CloudflaredPath {
  $cloudflaredCommand = Get-Command "cloudflared.exe" -ErrorAction SilentlyContinue
  if ($cloudflaredCommand) {
    return $cloudflaredCommand.Source
  }

  return Get-ChildItem `
    -Path (Join-Path $env:LOCALAPPDATA "Microsoft\WinGet\Packages") `
    -Filter "cloudflared.exe" `
    -Recurse `
    -ErrorAction SilentlyContinue |
    Select-Object -First 1 -ExpandProperty FullName
}

function Get-SiteCloudflaredProcesses {
  $normalizedConfigPath = $configPath.ToLowerInvariant()

  return @(
    Get-CimInstance Win32_Process |
      Where-Object {
        $_.Name -eq "cloudflared.exe" -and
        $_.CommandLine -and
        $_.CommandLine.ToLowerInvariant().Contains("tunnel") -and
        $_.CommandLine.ToLowerInvariant().Contains("run") -and
        $_.CommandLine.ToLowerInvariant().Contains($normalizedConfigPath)
      }
  )
}

function Test-LocalAiGatewayHealth {
  try {
    $secret = Get-LocalEnvValue "AI_GATEWAY_SECRET"
    $headers = @{}
    if ($secret) {
      $headers.Authorization = "Bearer $secret"
    }

    $payload = Invoke-RestMethod `
      -Headers $headers `
      -Uri "http://127.0.0.1:8787/api/chat?health=1" `
      -TimeoutSec 10

    return $payload.ok -eq $true -and $payload.status -ne "error"
  } catch {
    return $false
  }
}

function Test-DirectTunnelHealth {
  try {
    $secret = Get-LocalEnvValue "AI_GATEWAY_SECRET"
    $headers = @{}
    if ($secret) {
      $headers.Authorization = "Bearer $secret"
    }

    $payload = Invoke-RestMethod `
      -Headers $headers `
      -Uri "https://ai.actcreative.net/api/chat?health=1" `
      -TimeoutSec 20

    return $payload.ok -eq $true -and $payload.status -ne "error"
  } catch {
    return $false
  }
}

function Stop-SiteCloudflaredProcesses {
  Get-SiteCloudflaredProcesses |
    ForEach-Object {
      Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
    }
}

function Wait-ForDirectTunnelHealth {
  param([int]$Attempts = 30)

  for ($attempt = 0; $attempt -lt $Attempts; $attempt += 1) {
    if (Test-DirectTunnelHealth) {
      return $true
    }
    Start-Sleep -Seconds 2
  }

  return $false
}

$cloudflaredPath = Get-CloudflaredPath
if (-not $cloudflaredPath) {
  throw "cloudflared.exe is not installed"
}

if (-not (Test-Path -LiteralPath $configPath)) {
  throw "Cloudflare Tunnel config was not found at $configPath"
}

New-Item -ItemType Directory -Path $runtimeDirectory -Force | Out-Null
Set-Location $repoRoot

$cloudflaredProcesses = Get-SiteCloudflaredProcesses
$localGatewayHealthy = Test-LocalAiGatewayHealth

if ($localGatewayHealthy -and (Test-DirectTunnelHealth)) {
  exit 0
}

if ($cloudflaredProcesses.Count -gt 0 -and $localGatewayHealthy) {
  Stop-SiteCloudflaredProcesses
  Start-Sleep -Seconds 3
  $cloudflaredProcesses = @()
}

if ($cloudflaredProcesses.Count -eq 0) {
  Start-Process `
    -FilePath $cloudflaredPath `
    -ArgumentList "tunnel", "--config", $configPath, "run" `
    -WindowStyle Hidden `
    -RedirectStandardOutput $tunnelOutputLog `
    -RedirectStandardError $tunnelErrorLog | Out-Null
}

if ($localGatewayHealthy -and -not (Wait-ForDirectTunnelHealth)) {
  throw "Cloudflare Tunnel process started, but https://ai.actcreative.net/api/chat?health=1 did not become healthy"
}

exit 0
