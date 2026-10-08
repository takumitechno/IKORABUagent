$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'supervise-operator-ui.ps1')
$script:healthyPorts = @(8000, 5733)
$script:launchCount = 0
$script:launcherResult = 0
$script:launcherExited = $true
$script:killedLaunchers = 0
$script:capturedLog = @()
function Test-WebService { param([int]$Port) return $Port -in $script:healthyPorts }
function Add-Content { param($LiteralPath, $Value) process { $script:capturedLog += $Value } }
function Start-Process {
    param($FilePath, $ArgumentList, $WorkingDirectory, $WindowStyle, [switch]$PassThru)
    $script:launchCount++
    $process = [pscustomobject]@{ ExitCode = $script:launcherResult }
    $process | Add-Member ScriptMethod WaitForExit { param($Timeout) return $script:launcherExited }
    $process | Add-Member ScriptMethod Kill { $script:killedLaunchers++ }
    $process | Add-Member ScriptMethod Dispose {}
    return $process
}

Repair-WebServices
if ($script:launchCount -ne 0) { throw 'healthy services were restarted' }
foreach ($ports in @(@(5733), @(8000), @())) {
    $script:healthyPorts = $ports
    $previousCount = $script:launchCount
    Repair-WebServices
    if ($script:launchCount -ne $previousCount + 1) { throw 'missing service did not trigger canonical recovery' }
}
$script:launcherResult = 2
$failed = $false
try { Repair-WebServices } catch { $failed = $true }
if (-not $failed) { throw 'launcher refusal was hidden' }
$script:launcherExited = $false
$failed = $false
try { Repair-WebServices } catch { $failed = $true }
if (-not $failed -or $script:killedLaunchers -ne 1) { throw 'hung launcher was not contained' }
Write-Output 'PASS: healthy no-op, Bridge/UI recovery, occupied-port refusal, hung launcher timeout'
