$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$runtimeDirectory = Join-Path $repoRoot "tmp"
$gatewayOutputLog = Join-Path $runtimeDirectory "ai-production-task.out.log"
$gatewayErrorLog = Join-Path $runtimeDirectory "ai-production-task.err.log"
$ollamaOutputLog = Join-Path $runtimeDirectory "ollama-production-task.out.log"
$ollamaErrorLog = Join-Path $runtimeDirectory "ollama-production-task.err.log"
$nodeExecutable = "C:\Program Files\nodejs\node.exe"
$ollamaExecutable = Join-Path $env:LOCALAPPDATA "Programs\Ollama\ollama.exe"
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

function Set-SiteOllamaEnvironment {
  $configuredModelsDirectory = Get-LocalEnvValue "OLLAMA_MODELS"
  $siteModelsDirectory = "H:\LLM\Ollama\models"

  if ($configuredModelsDirectory) {
    $env:OLLAMA_MODELS = $configuredModelsDirectory
  } elseif (Test-Path -LiteralPath $siteModelsDirectory) {
    $env:OLLAMA_MODELS = $siteModelsDirectory
  }

  $env:OLLAMA_HOST = "127.0.0.1:11434"
  $env:OLLAMA_CONTEXT_LENGTH = "8192"
  $env:OLLAMA_KEEP_ALIVE = "24h"
  $env:OLLAMA_LOAD_TIMEOUT = "10m"
  $env:OLLAMA_NUM_PARALLEL = "1"
  $env:OLLAMA_VULKAN = "false"
}

function Get-ListeningProcessIds {
  param([Parameter(Mandatory = $true)][int]$Port)

  return @(
    Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
      Select-Object -ExpandProperty OwningProcess -Unique
  )
}

function Get-OllamaServeProcessIds {
  return @(
    Get-CimInstance Win32_Process |
      Where-Object { $_.Name -in @("ollama.exe", "ollama app.exe") } |
      Select-Object -ExpandProperty ProcessId
  )
}

function Get-OllamaRelatedProcessIds {
  return @(
    Get-CimInstance Win32_Process |
      Where-Object { $_.Name -in @("ollama.exe", "ollama app.exe", "llama-server.exe") } |
      Select-Object -ExpandProperty ProcessId
  )
}

function Test-OllamaModelsAvailable {
  try {
    $payload = Invoke-RestMethod -Uri "http://127.0.0.1:11434/api/tags" -TimeoutSec 10
    $availableModels = @($payload.models | ForEach-Object { $_.model; $_.name }) |
      Where-Object { $_ } |
      Select-Object -Unique

    foreach ($model in $requiredOllamaModels) {
      if ($availableModels -notcontains $model) {
        return $false
      }
    }

    return $true
  } catch {
    return $false
  }
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

    if ($payload.ok -ne $true) {
      return $false
    }
    if ($payload.status -eq "error") {
      return $false
    }
    if ($payload.rag -and $payload.rag.embeddingStatus -eq "error") {
      return $false
    }

    return $true
  } catch {
    return $false
  }
}

function Stop-ProcessIds {
  param([int[]]$ProcessIds)

  foreach ($processId in @($ProcessIds | Select-Object -Unique)) {
    if ($processId) {
      Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    }
  }
}

function Stop-OllamaForSiteRestart {
  Stop-ProcessIds -ProcessIds (Get-OllamaRelatedProcessIds)
}

function Stop-LocalAiGateway {
  Stop-ProcessIds -ProcessIds (Get-ListeningProcessIds -Port 8787)
}

function Wait-ForPortToClose {
  param(
    [Parameter(Mandatory = $true)][int]$Port,
    [int]$Attempts = 30
  )

  for ($attempt = 0; $attempt -lt $Attempts; $attempt += 1) {
    if (-not (Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue)) {
      return $true
    }
    Start-Sleep -Seconds 1
  }

  return $false
}

function Wait-ForOllamaModels {
  param([int]$Attempts = 90)

  for ($attempt = 0; $attempt -lt $Attempts; $attempt += 1) {
    if (Test-OllamaModelsAvailable) {
      return $true
    }
    Start-Sleep -Seconds 2
  }

  return $false
}

function Wait-ForLocalAiGatewayHealth {
  param([int]$Attempts = 60)

  for ($attempt = 0; $attempt -lt $Attempts; $attempt += 1) {
    if (Test-LocalAiGatewayHealth) {
      return $true
    }
    Start-Sleep -Seconds 2
  }

  return $false
}

New-Item -ItemType Directory -Path $runtimeDirectory -Force | Out-Null
Set-Location $repoRoot
Set-SiteOllamaEnvironment

$ollamaProcessIds = Get-OllamaServeProcessIds
$ollamaModelsAvailable = Test-OllamaModelsAvailable
$gatewayHealthy = Test-LocalAiGatewayHealth

if ($gatewayHealthy -and $ollamaModelsAvailable -and $ollamaProcessIds.Count -le 1) {
  exit 0
}

if ($ollamaProcessIds.Count -gt 1 -or ((Get-ListeningProcessIds -Port 11434).Count -gt 0 -and -not $ollamaModelsAvailable)) {
  Stop-LocalAiGateway
  Stop-OllamaForSiteRestart
  if (-not (Wait-ForPortToClose -Port 11434)) {
    throw "Ollama did not release port 11434"
  }
  $ollamaModelsAvailable = $false
  $gatewayHealthy = $false
}

if (-not (Get-ListeningProcessIds -Port 11434)) {
  if (-not (Test-Path -LiteralPath $ollamaExecutable)) {
    throw "Ollama was not found at $ollamaExecutable"
  }

  Start-Process `
    -FilePath $ollamaExecutable `
    -ArgumentList "serve" `
    -WindowStyle Hidden `
    -RedirectStandardOutput $ollamaOutputLog `
    -RedirectStandardError $ollamaErrorLog | Out-Null
}

if (-not (Wait-ForOllamaModels)) {
  throw "Ollama is running, but the ACT Creative AI models are not available. Check OLLAMA_MODELS."
}

if (-not (Test-Path -LiteralPath $nodeExecutable)) {
  throw "Node.js was not found at $nodeExecutable"
}

if (-not (Test-LocalAiGatewayHealth)) {
  Stop-LocalAiGateway
  Start-Sleep -Seconds 2

  Start-Process `
    -FilePath $nodeExecutable `
    -ArgumentList "scripts/local-ai-server.mjs" `
    -WorkingDirectory $repoRoot `
    -WindowStyle Hidden `
    -RedirectStandardOutput $gatewayOutputLog `
    -RedirectStandardError $gatewayErrorLog | Out-Null
}

if (-not (Wait-ForLocalAiGatewayHealth)) {
  throw "Local AI gateway did not become healthy on 127.0.0.1:8787"
}

exit 0
