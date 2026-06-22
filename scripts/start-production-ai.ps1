$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$runtimeDirectory = Join-Path $repoRoot "tmp"
$gatewayOutputLog = Join-Path $runtimeDirectory "ai-production-task.out.log"
$gatewayErrorLog = Join-Path $runtimeDirectory "ai-production-task.err.log"
$ollamaOutputLog = Join-Path $runtimeDirectory "ollama-production-task.out.log"
$ollamaErrorLog = Join-Path $runtimeDirectory "ollama-production-task.err.log"
$nodeExecutable = "C:\Program Files\nodejs\node.exe"
$ollamaExecutable = Join-Path $env:LOCALAPPDATA "Programs\Ollama\ollama.exe"

New-Item -ItemType Directory -Path $runtimeDirectory -Force | Out-Null
Set-Location $repoRoot

if (Get-NetTCPConnection -LocalPort 8787 -State Listen -ErrorAction SilentlyContinue) {
  exit 0
}

if (-not (Test-Path -LiteralPath $nodeExecutable)) {
  throw "Node.js was not found at $nodeExecutable"
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
