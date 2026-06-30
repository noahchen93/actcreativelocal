param(
  [int]$LoopSeconds = 60,
  [int]$WarmEverySeconds = 43200
)

$ErrorActionPreference = "Continue"

$repoRoot = Split-Path -Parent $PSScriptRoot
$runtimeDirectory = Join-Path $repoRoot "tmp"
$supervisorLog = Join-Path $runtimeDirectory "production-ai-supervisor.log"
$startAiScript = Join-Path $PSScriptRoot "start-production-ai.ps1"
$startTunnelScript = Join-Path $PSScriptRoot "start-production-tunnel.ps1"
$mutex = New-Object System.Threading.Mutex($false, "Global\ACTCreativeProductionAISupervisor")

function Write-SupervisorLog {
  param([Parameter(Mandatory = $true)][string]$Message)

  New-Item -ItemType Directory -Path $runtimeDirectory -Force | Out-Null
  $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss zzz"
  Add-Content -LiteralPath $supervisorLog -Encoding UTF8 -Value "[$timestamp] $Message"
}

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

function Invoke-RepairScript {
  param(
    [Parameter(Mandatory = $true)][string]$Name,
    [Parameter(Mandatory = $true)][string]$Path
  )

  try {
    & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $Path
    if ($LASTEXITCODE -ne 0) {
      Write-SupervisorLog "$Name repair exited with code $LASTEXITCODE"
      return $false
    }

    return $true
  } catch {
    Write-SupervisorLog "$Name repair failed: $($_.Exception.Message)"
    return $false
  }
}

function Invoke-OllamaWarmProbe {
  Set-SiteOllamaEnvironment

  $ollamaUrl = (Get-LocalEnvValue "OLLAMA_URL")
  if (-not $ollamaUrl) {
    $ollamaUrl = "http://127.0.0.1:11434"
  }
  $ollamaUrl = $ollamaUrl.TrimEnd("/")

  $chatModel = Get-LocalEnvValue "OLLAMA_MODEL"
  if (-not $chatModel) {
    $chatModel = "act-event-assistant"
  }

  $embeddingModel = Get-LocalEnvValue "OLLAMA_EMBEDDING_MODEL"
  if (-not $embeddingModel) {
    $embeddingModel = "act-rag-embedding"
  }

  try {
    $chatBody = @{
      model = $chatModel
      messages = @(@{ role = "user"; content = "Reply with exactly: READY" })
      stream = $false
      think = $false
      keep_alive = "24h"
      options = @{
        num_ctx = 8192
        num_predict = 10
        temperature = 0
      }
    } | ConvertTo-Json -Depth 8

    Invoke-RestMethod `
      -Method Post `
      -Uri "$ollamaUrl/api/chat" `
      -ContentType "application/json" `
      -Body $chatBody `
      -TimeoutSec 600 | Out-Null

    $embedBody = @{
      model = $embeddingModel
      input = @("ACT Creative Singapore event production")
      truncate = $true
      keep_alive = "24h"
    } | ConvertTo-Json -Depth 5

    Invoke-RestMethod `
      -Method Post `
      -Uri "$ollamaUrl/api/embed" `
      -ContentType "application/json" `
      -Body $embedBody `
      -TimeoutSec 120 | Out-Null

    Write-SupervisorLog "Ollama warm probe completed for $chatModel and $embeddingModel"
    return $true
  } catch {
    Write-SupervisorLog "Ollama warm probe failed: $($_.Exception.Message)"
    return $false
  }
}

if (-not $mutex.WaitOne(0)) {
  Write-SupervisorLog "Another production AI supervisor instance is already running; exiting."
  exit 0
}

try {
  Set-Location $repoRoot
  New-Item -ItemType Directory -Path $runtimeDirectory -Force | Out-Null
  Write-SupervisorLog "Production AI supervisor started. LoopSeconds=$LoopSeconds WarmEverySeconds=$WarmEverySeconds"

  $lastWarmAt = Get-Date "2000-01-01T00:00:00"

  while ($true) {
    try {
      Invoke-RepairScript -Name "local AI" -Path $startAiScript | Out-Null
      Invoke-RepairScript -Name "Cloudflare Tunnel" -Path $startTunnelScript | Out-Null

      if (((Get-Date) - $lastWarmAt).TotalSeconds -ge $WarmEverySeconds) {
        if (Invoke-OllamaWarmProbe) {
          $lastWarmAt = Get-Date
        }
      }
    } catch {
      Write-SupervisorLog "Supervisor loop failed: $($_.Exception.Message)"
    }

    Start-Sleep -Seconds ([Math]::Max(15, $LoopSeconds))
  }
} finally {
  $mutex.ReleaseMutex()
  $mutex.Dispose()
}
