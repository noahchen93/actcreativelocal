$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$runtimeDirectory = Join-Path $repoRoot "tmp"
$tunnelOutputLog = Join-Path $runtimeDirectory "cloudflared-production.out.log"
$tunnelErrorLog = Join-Path $runtimeDirectory "cloudflared-production.err.log"
$configPath = Join-Path $env:USERPROFILE ".cloudflared\config.yml"
$cloudflaredCommand = Get-Command "cloudflared.exe" -ErrorAction SilentlyContinue
$cloudflaredPath = if ($cloudflaredCommand) { $cloudflaredCommand.Source } else { $null }

if (-not $cloudflaredPath) {
  $cloudflaredPath = Get-ChildItem `
    -Path (Join-Path $env:LOCALAPPDATA "Microsoft\WinGet\Packages") `
    -Filter "cloudflared.exe" `
    -Recurse `
    -ErrorAction SilentlyContinue |
    Select-Object -First 1 -ExpandProperty FullName
}

if (-not $cloudflaredPath) {
  throw "cloudflared.exe is not installed"
}

if (-not (Test-Path -LiteralPath $configPath)) {
  throw "Cloudflare Tunnel config was not found at $configPath"
}

if (Get-Process "cloudflared" -ErrorAction SilentlyContinue) {
  exit 0
}

New-Item -ItemType Directory -Path $runtimeDirectory -Force | Out-Null
Set-Location $repoRoot

$process = Start-Process `
  -FilePath $cloudflaredPath `
  -ArgumentList "tunnel", "--config", $configPath, "run" `
  -WindowStyle Hidden `
  -RedirectStandardOutput $tunnelOutputLog `
  -RedirectStandardError $tunnelErrorLog `
  -PassThru `
  -Wait

exit $process.ExitCode
