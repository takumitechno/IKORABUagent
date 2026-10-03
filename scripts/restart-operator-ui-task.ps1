[CmdletBinding()]
param(
    [ValidateSet('IKORABU-Operator-UI')]
    [string]$TaskName = 'IKORABU-Operator-UI',
    [string]$ExpectedWorkingDirectory = (Split-Path $PSScriptRoot -Parent),
    [switch]$StatusOnly
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

if ([string]$task.State -eq 'Running') {
    Stop-ScheduledTask -TaskPath $taskPath -TaskName $TaskName
}
Start-ScheduledTask -TaskPath $taskPath -TaskName $TaskName
