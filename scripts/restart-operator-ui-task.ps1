[CmdletBinding()]
param(
    [ValidateSet('IKORABU-Operator-UI')]
    [string]$TaskName = 'IKORABU-Operator-UI',
    [string]$ExpectedWorkingDirectory = (Split-Path $PSScriptRoot -Parent),
    [ValidateRange(1, 65535)]
    [int]$DashboardPort = 5733,
    [switch]$StatusOnly,
    [switch]$EnableSupervisor
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$expectedDescription = 'IKORABU read-only operator UI; scheduler explicitly disabled'
$taskPath = '\'

$task = Get-ScheduledTask -TaskPath $taskPath -TaskName $TaskName -ErrorAction Stop
if ($task.TaskPath -ne $taskPath -or $task.Description -ne $expectedDescription -or
    @($task.Actions).Count -ne 1 -or
    (Split-Path -Leaf $task.Actions[0].Execute) -ne 'powershell.exe' -or
    [IO.Path]::GetFullPath($task.Actions[0].WorkingDirectory) -ne
        [IO.Path]::GetFullPath($ExpectedWorkingDirectory)) {
    throw 'operator UI task ownership metadata mismatch'
}
if ($StatusOnly) {
    [pscustomobject]@{ TaskName = $task.TaskName; State = [string]$task.State } |
        ConvertTo-Json
    exit 0
}

if ($EnableSupervisor) {
    $supervisor = Join-Path $ExpectedWorkingDirectory 'scripts\supervise-operator-ui.ps1'
    if (-not (Test-Path -LiteralPath $supervisor -PathType Leaf) -or
        $task.Actions[0].Arguments -notmatch '-EncodedCommand\s+(\S+)' -or
        @($task.Triggers).Count -ne 1 -or
        $task.Triggers[0].CimClass.CimClassName -ne 'MSFT_TaskLogonTrigger') {
        throw 'operator UI supervisor installation prerequisites mismatch'
    }
    $command = [Text.Encoding]::Unicode.GetString([Convert]::FromBase64String($Matches[1]))
    if (-not $command.Contains($supervisor)) {
        $serverInvocation = [regex]::Match($command, "&\s*'[^']*bun\.exe'\s*'pokemon-agents/web/server\.ts'\s*;?\s*$")
        if (-not $serverInvocation.Success) { throw 'operator UI launch command mismatch' }
        $command = $command.Substring(0, $serverInvocation.Index) + "& '" + $supervisor.Replace("'", "''") + "'"
    }
    $encoded = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($command))
    $action = New-ScheduledTaskAction -Execute $task.Actions[0].Execute `
        -Argument "-NoProfile -NonInteractive -WindowStyle Hidden -ExecutionPolicy Bypass -EncodedCommand $encoded" `
        -WorkingDirectory $task.Actions[0].WorkingDirectory
    # Repeat the existing task after a supervisor exit; IgnoreNew prevents duplicate running instances.
    $task.Triggers[0].Repetition.Interval = 'PT1M'
    Set-ScheduledTask -TaskPath $taskPath -TaskName $TaskName -Action $action -Trigger $task.Triggers | Out-Null
}

if ([string]$task.State -eq 'Running') {
    Stop-ScheduledTask -TaskPath $taskPath -TaskName $TaskName
}

$listenerProcessIds = @(
    Get-NetTCPConnection -State Listen -LocalPort $DashboardPort -ErrorAction SilentlyContinue |
        Select-Object -ExpandProperty OwningProcess -Unique
)
if ($listenerProcessIds.Count -gt 1) {
    throw 'operator UI port has multiple owners'
}
if ($listenerProcessIds.Count -eq 1) {
    $listenerProcessId = [int]$listenerProcessIds[0]
    $listenerProcess = Get-CimInstance Win32_Process -Filter "ProcessId=$listenerProcessId"
    if ($null -eq $listenerProcess) {
        throw 'operator UI listener process was not found'
    }

    $executableName = Split-Path -Leaf ([string]$listenerProcess.ExecutablePath)
    $normalizedCommandLine = ([string]$listenerProcess.CommandLine) -replace '\\', '/'
    if ($executableName -ne 'bun.exe' -or
        -not $normalizedCommandLine.Contains('pokemon-agents/web/server.ts')) {
        throw 'operator UI port ownership mismatch'
    }

    Stop-Process -Id $listenerProcessId -Force
    Wait-Process -Id $listenerProcessId -Timeout 10 -ErrorAction SilentlyContinue
}
Start-ScheduledTask -TaskPath $taskPath -TaskName $TaskName
