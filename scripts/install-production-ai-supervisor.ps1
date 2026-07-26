$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$watchScript = Join-Path $PSScriptRoot "watch-production-ai.ps1"
$taskName = "ACTCreativeProductionAISupervisor"
$currentUser = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name

if (-not (Test-Path -LiteralPath $watchScript)) {
  throw "Supervisor script was not found at $watchScript"
}

$powershellPath = (Get-Command "powershell.exe" -ErrorAction Stop).Source
$arguments = "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$watchScript`""
$action = New-ScheduledTaskAction -Execute $powershellPath -Argument $arguments -WorkingDirectory $repoRoot
$description = "Keeps ACT Creative local Ollama gateway and Cloudflare Tunnel healthy."

function Install-StartupSupervisor {
  $startupDirectory = [Environment]::GetFolderPath("Startup")
  $runtimeDirectory = Join-Path $repoRoot "tmp"
  $runnerCmd = Join-Path $runtimeDirectory "run-production-ai-supervisor.cmd"
  $runnerVbs = Join-Path $runtimeDirectory "run-production-ai-supervisor.vbs"
  $startupShortcut = Join-Path $startupDirectory "$taskName.lnk"

  New-Item -ItemType Directory -Path $runtimeDirectory -Force | Out-Null

  $cmdContents = @"
@echo off
cd /d "$repoRoot"
:loop
"$powershellPath" -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File "$watchScript"
timeout /t 60 /nobreak >nul
goto loop
"@
  Set-Content -LiteralPath $runnerCmd -Encoding ASCII -Value $cmdContents

  $escapedRunnerCmd = $runnerCmd.Replace('"', '""')
  $vbsContents = @"
Set shell = CreateObject("WScript.Shell")
shell.Run """" & "$escapedRunnerCmd" & """", 0, False
"@
  Set-Content -LiteralPath $runnerVbs -Encoding ASCII -Value $vbsContents

  $wscriptPath = Join-Path $env:WINDIR "System32\wscript.exe"
  $shell = New-Object -ComObject WScript.Shell
  $shortcut = $shell.CreateShortcut($startupShortcut)
  $shortcut.TargetPath = $wscriptPath
  $shortcut.Arguments = "`"$runnerVbs`""
  $shortcut.WorkingDirectory = $repoRoot
  $shortcut.WindowStyle = 7
  $shortcut.Description = $description
  $shortcut.Save()

  Start-Process -FilePath $wscriptPath -ArgumentList "`"$runnerVbs`"" -WindowStyle Hidden
  Write-Output "Installed and started current-user Startup supervisor shortcut: $startupShortcut"
}

$triggers = @(
  New-ScheduledTaskTrigger -AtLogOn -User $currentUser
)

$settings = New-ScheduledTaskSettingsSet `
  -StartWhenAvailable `
  -MultipleInstances IgnoreNew `
  -RestartCount 999 `
  -RestartInterval (New-TimeSpan -Minutes 1) `
  -ExecutionTimeLimit (New-TimeSpan -Seconds 0) `
  -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries

try {
  $principal = New-ScheduledTaskPrincipal `
    -UserId $currentUser `
    -LogonType Interactive `
    -RunLevel Highest

  Register-ScheduledTask `
    -TaskName $taskName `
    -Action $action `
    -Trigger $triggers `
    -Settings $settings `
    -Principal $principal `
    -Description $description `
    -Force | Out-Null

  Start-ScheduledTask -TaskName $taskName
  Write-Output "Installed and started scheduled task: $taskName"
} catch {
  Write-Warning "Could not register elevated task. Retrying as current interactive user: $($_.Exception.Message)"

  try {
    $principal = New-ScheduledTaskPrincipal `
      -UserId $currentUser `
      -LogonType Interactive

    Register-ScheduledTask `
      -TaskName $taskName `
      -Action $action `
      -Trigger $triggers `
      -Settings $settings `
      -Principal $principal `
      -Description $description `
      -Force | Out-Null

    Start-ScheduledTask -TaskName $taskName
    Write-Output "Installed and started scheduled task: $taskName"
  } catch {
    Write-Warning "Could not register current-user scheduled task: $($_.Exception.Message)"

    $schtasksCommand = "powershell.exe -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$watchScript`""
    $schtasksArguments = "/Create /TN `"$taskName`" /SC ONLOGON /TR `"$schtasksCommand`" /F"
    $schtasks = Start-Process `
      -FilePath "schtasks.exe" `
      -ArgumentList $schtasksArguments `
      -NoNewWindow `
      -Wait `
      -PassThru

    if ($schtasks.ExitCode -eq 0) {
      Start-Process -FilePath "schtasks.exe" -ArgumentList "/Run", "/TN", $taskName -NoNewWindow -Wait | Out-Null
      Write-Output "Installed and started schtasks entry: $taskName"
    } else {
      Write-Warning "schtasks.exe registration failed with exit code $($schtasks.ExitCode). Installing Startup shortcut fallback."
      Install-StartupSupervisor
    }
  }
}
