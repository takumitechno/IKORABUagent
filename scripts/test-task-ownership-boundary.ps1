$ErrorActionPreference = 'Stop'
$script = Join-Path $PSScriptRoot 'restart-operator-ui-task.ps1'
$suffix = [guid]::NewGuid().ToString('N').Substring(0,8)
$forbidden = "Threads-NightBatch-acct_fixture-$suffix-20990101-0800"
$action = New-ScheduledTaskAction -Execute 'cmd.exe' -Argument '/c exit 0'
$trigger = New-ScheduledTaskTrigger -Once -At ([datetime]::Now.AddDays(1))
$settings = New-ScheduledTaskSettingsSet
Register-ScheduledTask -TaskName $forbidden -Action $action -Trigger $trigger `
    -Settings $settings -Description 'TEST_ONLY finite publication ownership boundary' | Out-Null

try {
    $before = Get-ScheduledTask -TaskName $forbidden
    & powershell.exe -NoProfile -NonInteractive -File $script -TaskName $forbidden 2>$null
    if ($LASTEXITCODE -eq 0) {
        throw 'UI maintenance accepted a finite publication task name'
    }
    $after = Get-ScheduledTask -TaskName $forbidden
    if (-not $before.Settings.Enabled -or -not $after.Settings.Enabled) {
        throw 'UI maintenance changed a finite publication task'
    }
}
finally {
    Unregister-ScheduledTask -TaskName $forbidden -Confirm:$false -ErrorAction SilentlyContinue
}

$source = Get-Content -LiteralPath $script -Raw
foreach ($command in @('Disable-ScheduledTask','Unregister-ScheduledTask','Register-ScheduledTask','Set-ScheduledTask')) {
    if ($source.Contains($command)) {
        throw "UI maintenance contains forbidden task mutation: $command"
    }
}
foreach ($marker in @('expectedDescription','ExpectedWorkingDirectory','operator UI task ownership metadata mismatch')) {
    if (-not $source.Contains($marker)) { throw "UI ownership guard missing: $marker" }
}

[pscustomobject]@{
    Passed = $true
    OwnedTask = 'IKORABU-Operator-UI'
    ForbiddenTaskRejected = $forbidden
} | ConvertTo-Json
