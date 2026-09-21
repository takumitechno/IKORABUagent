[CmdletBinding()]
param(
    [ValidateRange(1, 65535)]
    [int]$BridgePort = 8000,
    [ValidateRange(1, 65535)]
    [int]$DashboardPort = 5733
)

$launcher = Join-Path $PSScriptRoot "start-agent-os.ps1"
& $launcher -StatusOnly -BridgePort $BridgePort -DashboardPort $DashboardPort
$launcherSucceeded = $?
$launcherExitCode = $LASTEXITCODE
if (-not $launcherSucceeded) { exit 1 }
exit $launcherExitCode
