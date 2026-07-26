$ErrorActionPreference = "Continue"

$repoRoot = Split-Path -Parent $PSScriptRoot
$requiredOllamaModels = @("act-event-assistant:latest", "act-rag-embedding:latest")

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

function Test-HttpJson {
  param(
    [Parameter(Mandatory = $true)][string]$Uri,
    [hashtable]$Headers = @{},
    [int]$TimeoutSec = 20
  )

  try {
    $payload = Invoke-RestMethod -Headers $Headers -Uri $Uri -TimeoutSec $TimeoutSec
    return @{
      ok = $true
      payload = $payload
      error = ""
    }
  } catch {
    return @{
      ok = $false
      payload = $null
      error = $_.Exception.Message
    }
  }
}

$secret = Get-LocalEnvValue "AI_GATEWAY_SECRET"
$authHeaders = @{}
if ($secret) {
  $authHeaders.Authorization = "Bearer $secret"
}

$ollamaTags = Test-HttpJson -Uri "http://127.0.0.1:11434/api/tags" -TimeoutSec 10
$availableModels = @()
if ($ollamaTags.ok) {
  $availableModels = @($ollamaTags.payload.models | ForEach-Object { $_.model; $_.name }) |
    Where-Object { $_ } |
    Select-Object -Unique
}

$missingModels = @($requiredOllamaModels | Where-Object { $availableModels -notcontains $_ })
$localHealth = Test-HttpJson -Headers $authHeaders -Uri "http://127.0.0.1:8787/api/chat?health=1"
$tunnelHealth = Test-HttpJson -Headers $authHeaders -Uri "https://ai.actcreative.net/api/chat?health=1"
$productionHealth = Test-HttpJson -Uri "https://actcreative.net/api/chat?health=1"
$task = Get-ScheduledTask -TaskName "ACTCreativeProductionAISupervisor" -ErrorAction SilentlyContinue
$startupShortcut = Join-Path ([Environment]::GetFolderPath("Startup")) "ACTCreativeProductionAISupervisor.lnk"
$supervisorProcesses = @(
  Get-CimInstance Win32_Process |
    Where-Object {
      $_.CommandLine -and (
        $_.CommandLine.Contains("watch-production-ai.ps1") -or
        $_.CommandLine.Contains("run-production-ai-supervisor.cmd") -or
        $_.CommandLine.Contains("run-production-ai-supervisor.vbs")
      )
    }
)
$autostartState = if ($task) {
  "scheduledTask:$($task.State)"
} elseif (Test-Path -LiteralPath $startupShortcut) {
  "startupShortcut"
} else {
  "missing"
}

[pscustomobject]@{
  autostart = $autostartState
  supervisorProcessCount = $supervisorProcesses.Count
  ollamaProcessCount = @(Get-Process "ollama" -ErrorAction SilentlyContinue).Count
  cloudflaredProcessCount = @(Get-Process "cloudflared" -ErrorAction SilentlyContinue).Count
  localPort11434 = @(Get-NetTCPConnection -LocalPort 11434 -State Listen -ErrorAction SilentlyContinue).Count -gt 0
  localPort8787 = @(Get-NetTCPConnection -LocalPort 8787 -State Listen -ErrorAction SilentlyContinue).Count -gt 0
  ollamaModelsReady = $ollamaTags.ok -and $missingModels.Count -eq 0
  missingOllamaModels = ($missingModels -join ", ")
  localGatewayOk = $localHealth.ok -and $localHealth.payload.ok -eq $true -and $localHealth.payload.status -ne "error"
  localGatewayStatus = if ($localHealth.ok) { $localHealth.payload.status } else { $localHealth.error }
  ragReady = if ($localHealth.ok -and $localHealth.payload.rag) { $localHealth.payload.rag.ready } else { $false }
  directTunnelOk = $tunnelHealth.ok -and $tunnelHealth.payload.ok -eq $true -and $tunnelHealth.payload.status -ne "error"
  directTunnelStatus = if ($tunnelHealth.ok) { $tunnelHealth.payload.status } else { $tunnelHealth.error }
  productionOk = $productionHealth.ok -and $productionHealth.payload.ok -eq $true -and $productionHealth.payload.status -ne "error"
  productionStatus = if ($productionHealth.ok) { $productionHealth.payload.status } else { $productionHealth.error }
} | Format-List
