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

function Stop-OllamaForSiteRestart {
  Get-CimInstance Win32_Process |
    Where-Object {
      $_.Name -in @("ollama.exe", "ollama app.exe", "llama-server.exe")
    } |
    ForEach-Object {
      Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
    }
}

function Stop-LocalAiGateway {
  Get-NetTCPConnection -LocalPort 8787 -State Listen -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty OwningProcess -Unique |
    ForEach-Object {
      Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue
    }
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

New-Item -ItemType Directory -Path $runtimeDirectory -Force | Out-Null
Set-Location $repoRoot
Set-SiteOllamaEnvironment

if (
  (Get-NetTCPConnection -LocalPort 8787 -State Listen -ErrorAction SilentlyContinue) -and
  (Test-OllamaModelsAvailable)
) {
  exit 0
}

if (-not (Test-Path -LiteralPath $nodeExecutable)) {
  throw "Node.js was not found at $nodeExecutable"
}

if (
  (Get-NetTCPConnection -LocalPort 11434 -State Listen -ErrorAction SilentlyContinue) -and
  (-not (Test-OllamaModelsAvailable))
) {
  Stop-LocalAiGateway
  Stop-OllamaForSiteRestart
  if (-not (Wait-ForPortToClose -Port 11434)) {
    throw "Ollama did not release port 11434"
  }
}

if (-not (Get-NetTCPConnection -LocalPort 11434 -State Listen -ErrorAction SilentlyContinue)) {
  if (-not (Test-Path -LiteralPath $ollamaExecutable)) {
    throw "Ollama was not found at $ollamaExecutable"
  }

  Start-Process `
    -FilePath $ollamaExecutable `
    -ArgumentList "serve" `
    -WindowStyle Hidden `
    -RedirectStandardOutput $ollamaOutputLog `
    -RedirectStandardError $ollamaErrorLog

  $ollamaReady = $false
  for ($attempt = 0; $attempt -lt 60; $attempt += 1) {
    Start-Sleep -Seconds 2
    if (Get-NetTCPConnection -LocalPort 11434 -State Listen -ErrorAction SilentlyContinue) {
      $ollamaReady = $true
      break
    }
  }

  if (-not $ollamaReady) {
    throw "Ollama did not start within 120 seconds"
  }
}

if (-not (Test-OllamaModelsAvailable)) {
  throw "Ollama is running, but the ACT Creative AI models are not available. Check OLLAMA_MODELS."
}

$process = Start-Process `
  -FilePath $nodeExecutable `
  -ArgumentList "scripts/local-ai-server.mjs" `
  -WorkingDirectory $repoRoot `
  -WindowStyle Hidden `
  -RedirectStandardOutput $gatewayOutputLog `
  -RedirectStandardError $gatewayErrorLog `
  -PassThru `
  -Wait

exit $process.ExitCode
