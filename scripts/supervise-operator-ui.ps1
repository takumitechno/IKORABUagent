[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$dashboardRoot = Split-Path $PSScriptRoot -Parent
$launcher = Join-Path $PSScriptRoot 'start-agent-os.ps1'
$logPath = Join-Path $dashboardRoot '.runtime\logs\web-services-supervisor.log'

function Test-WebService {
    param([int]$Port)
    try {
        $response = Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:$Port/health" -TimeoutSec 3
        return $response.StatusCode -eq 200 -and ($response.Content | ConvertFrom-Json).status -eq 'ok'
    }
    catch { return $false }
}

function Repair-WebServices {
    $bridgeHealthy = Test-WebService -Port 8000
    $dashboardHealthy = Test-WebService -Port 5733
    if ($bridgeHealthy -and $dashboardHealthy) { return }

    Add-Content -LiteralPath $logPath -Value "[$([DateTimeOffset]::Now.ToString('o'))] recovery: Bridge=$bridgeHealthy UI=$dashboardHealthy"
    # Reuse the canonical launcher: it starts only missing services and rejects occupied ports.
    $arguments = '-NoProfile -NonInteractive -ExecutionPolicy Bypass -File "{0}" -DashboardRepo "{1}" -StartupTimeoutSeconds 20' -f $launcher, $dashboardRoot
    $process = Start-Process -FilePath 'powershell.exe' -ArgumentList $arguments `
        -WorkingDirectory $dashboardRoot -WindowStyle Hidden -PassThru
    # Wait only for the launcher; Start-Process -Wait and piped output wait for its long-lived children too.
    if (-not $process.WaitForExit(45000)) {
        $process.Kill()
        $process.Dispose()
        throw 'web services launcher timed out; retrying on the next health check'
    }
    $launcherExitCode = $process.ExitCode
    $process.Dispose()
    Add-Content -LiteralPath $logPath -Value "[$([DateTimeOffset]::Now.ToString('o'))] launcher completed: exit=$launcherExitCode"
    if ($launcherExitCode -ne 0) { throw "web services recovery failed (exit $launcherExitCode)" }
}

if ($MyInvocation.InvocationName -ne '.') {
    $mutex = New-Object System.Threading.Mutex($false, 'Local\IKORABUagent.WebServicesSupervisor')
    $lockTaken = $false
    try {
        $lockTaken = $mutex.WaitOne(0)
        if (-not $lockTaken) { exit 0 }
        Set-Location -LiteralPath $dashboardRoot
        New-Item -ItemType Directory -Path (Split-Path $logPath -Parent) -Force | Out-Null
        $env:POKEMON_AGENTS_SCHEDULER = 'off'
        $env:AUTOPILOT_BRIDGE_MODE = 'production'
        # The task's dashboard auth is authoritative; stale Windows User canary flags must not override it.
        $env:FEATURE_MULTI_TENANT_AUTH = $env:DASHBOARD_MULTI_TENANT_AUTH
        $env:FEATURE_MULTI_TENANT_AUTH_CANARY = $env:DASHBOARD_MULTI_TENANT_AUTH_CANARY
        $env:FEATURE_MULTI_TENANT_AUTH_SHADOW = $env:DASHBOARD_MULTI_TENANT_AUTH_SHADOW
        Add-Content -LiteralPath $logPath -Value "[$([DateTimeOffset]::Now.ToString('o'))] supervisor started; scheduler=off"
        while ($true) {
            try { Repair-WebServices }
            catch {
                Add-Content -LiteralPath $logPath -Value "[$([DateTimeOffset]::Now.ToString('o'))] $($_.Exception.Message)"
            }
            Start-Sleep -Seconds 30
        }
    }
    finally {
        if ($lockTaken) { $mutex.ReleaseMutex() }
        $mutex.Dispose()
    }
}
