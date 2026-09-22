[CmdletBinding()]
param(
    [Parameter(Mandatory=$true)][string]$TaskName,
    [Parameter(Mandatory=$true)][string]$ThreadsRoot,
    [Parameter(Mandatory=$true)][string]$DatabasePath,
    [Parameter(Mandatory=$true)][string]$AccountId,
    [string]$Actor = "night04-scheduled-runner",
    [Parameter(Mandatory=$true)][datetime]$At,
    [switch]$Inspect,
    [switch]$Apply,
    [string]$Confirm
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
$launcher = Join-Path $PSScriptRoot "night-runner-launcher.py"
$pythonw = Join-Path $ThreadsRoot ".venv\Scripts\pythonw.exe"
$logPath = Join-Path $repoRoot ".runtime\logs\night-runner.log"
$expectedConfirm = "APPLY:$TaskName"

if (-not (Test-Path -LiteralPath $pythonw -PathType Leaf)) { throw "pythonw.exe not found" }
if (-not (Test-Path -LiteralPath $launcher -PathType Leaf)) { throw "launcher not found" }
if (-not (Test-Path -LiteralPath $DatabasePath -PathType Leaf)) { throw "database not found" }

$arguments = @(
    ('"{0}"' -f $launcher),
    "--threads-root", ('"{0}"' -f $ThreadsRoot),
    "--db-path", ('"{0}"' -f $DatabasePath),
    "--account-id", $AccountId,
    "--actor", $Actor,
    "--log-path", ('"{0}"' -f $logPath)
) -join " "

$expected = [ordered]@{
    TaskName = $TaskName
    Execute = $pythonw
    Arguments = $arguments
    WorkingDirectory = $ThreadsRoot
    TriggerAt = $At.ToString("o")
    Hidden = $true
    MultipleInstances = "IgnoreNew"
    StartWhenAvailable = $true
    WakeToRun = $true
    LogPath = $logPath
}

$existing = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
$current = if ($existing) {
    [ordered]@{
        Execute = $existing.Actions[0].Execute
        Arguments = $existing.Actions[0].Arguments
        WorkingDirectory = $existing.Actions[0].WorkingDirectory
        Hidden = $existing.Settings.Hidden
        MultipleInstances = [string]$existing.Settings.MultipleInstances
        StartWhenAvailable = $existing.Settings.StartWhenAvailable
        WakeToRun = $existing.Settings.WakeToRun
    }
} else { $null }
$report = [ordered]@{ Mode = "dry-run"; Expected = $expected; Current = $current; NoOp = $false }
if ($current) {
    $report.NoOp = ($current.Execute -eq $expected.Execute -and
        $current.Arguments -eq $expected.Arguments -and
        $current.WorkingDirectory -eq $expected.WorkingDirectory -and
        $current.Hidden -eq $expected.Hidden -and
        $current.MultipleInstances -eq $expected.MultipleInstances -and
        $current.StartWhenAvailable -eq $expected.StartWhenAvailable -and
        $current.WakeToRun -eq $expected.WakeToRun)
}
if ($Inspect -or -not $Apply) { $report | ConvertTo-Json -Depth 5; exit 0 }
if ($Confirm -ne $expectedConfirm) { throw "apply requires -Confirm '$expectedConfirm'" }
if ($report.NoOp) { $report.Mode = "apply-no-op"; $report | ConvertTo-Json -Depth 5; exit 0 }

$action = New-ScheduledTaskAction -Execute $pythonw -Argument $arguments -WorkingDirectory $ThreadsRoot
$trigger = New-ScheduledTaskTrigger -Once -At $At
$settings = New-ScheduledTaskSettingsSet -Hidden -MultipleInstances IgnoreNew `
    -StartWhenAvailable -WakeToRun
Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger `
    -Settings $settings -Force | Out-Null
$report.Mode = "applied"
$report | ConvertTo-Json -Depth 5
