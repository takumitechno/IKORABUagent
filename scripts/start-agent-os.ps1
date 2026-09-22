[CmdletBinding()]
param(
    [switch]$StatusOnly,
    [ValidateRange(1, 65535)]
    [int]$BridgePort = 8000,
    [ValidateRange(1, 65535)]
    [int]$DashboardPort = 5733,
    [ValidateRange(1, 65535)]
    [int]$LegacyDashboardPort = 5735,
    [ValidateSet("inherit", "local", "cloudflare-access")]
    [string]$DashboardAuthMode = "inherit",
    [string]$DashboardAccountIds = "",
    [string]$ThreadsRepo = (Join-Path $env:USERPROFILE "Threads-"),
    [string]$DashboardRepo = "",
    [ValidateRange(5, 120)]
    [int]$StartupTimeoutSeconds = 30
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($DashboardRepo)) {
    $DashboardRepo = Split-Path $PSScriptRoot -Parent
}

function Test-LocalPort {
    param([int]$Port)

    $client = New-Object System.Net.Sockets.TcpClient
    try {
        $task = $client.ConnectAsync("127.0.0.1", $Port)
        if (-not $task.Wait(500)) { return $false }
        return $client.Connected
    }
    catch {
        return $false
    }
    finally {
        $client.Dispose()
    }
}

function Get-ListenerPid {
    param([int]$Port)
    $listener = Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue |
        Select-Object -First 1
    if ($null -eq $listener) { return $null }
    return [int]$listener.OwningProcess
}

function Get-LegacyDashboardState {
    param([int]$Port)
    $pidValue = Get-ListenerPid $Port
    [pscustomobject]@{ Detected = $null -ne $pidValue; Port = $Port; ProcessId = $pidValue }
}

function Invoke-LocalGet {
    param([string]$Uri)

    try {
        return Invoke-WebRequest -UseBasicParsing -Uri $Uri -TimeoutSec 3
    }
    catch {
        $responseProperty = $_.Exception.PSObject.Properties["Response"]
        if ($null -ne $responseProperty -and $null -ne $responseProperty.Value) {
            return [pscustomobject]@{
                StatusCode = [int]$responseProperty.Value.StatusCode
                Content = ""
            }
        }
        return $null
    }
}

function Get-BridgeState {
    param([int]$Port)

    $response = Invoke-LocalGet "http://127.0.0.1:$Port/health"
    $healthy = $false
    if ($null -ne $response -and [int]$response.StatusCode -eq 200) {
        try {
            $document = $response.Content | ConvertFrom-Json
            $healthy = $document.status -eq "ok"
        }
        catch {
            $healthy = $false
        }
    }

    [pscustomobject]@{
        Healthy = $healthy
        Listening = if ($healthy) { $true } else { Test-LocalPort $Port }
        Label = "production Bridge"
        Url = "http://127.0.0.1:$Port"
    }
}

function Get-DashboardState {
    param([int]$Port)

    $root = Invoke-LocalGet "http://127.0.0.1:$Port/"
    $internal = Invoke-LocalGet "http://127.0.0.1:$Port/internal"
    $health = Invoke-LocalGet "http://127.0.0.1:$Port/health"
    $rootRendered = $null -ne $root -and [int]$root.StatusCode -eq 200 -and
        $root.Content -match "<title>[^<]*AI SNS運用[^<]*</title>"
    $healthHealthy = $false
    if ($null -ne $health -and [int]$health.StatusCode -eq 200) {
        try { $healthHealthy = ($health.Content | ConvertFrom-Json).status -eq "ok" } catch { $healthHealthy = $false }
    }
    $rootProtected = $null -ne $root -and [int]$root.StatusCode -eq 401 -and
        $healthHealthy
    $rootHealthy = $rootRendered -or $rootProtected
    $internalHealthy = ($null -ne $internal -and [int]$internal.StatusCode -eq 200 -and
        $internal.Content -match "<title>[^<]*Agent OS[^<]*</title>") -or $healthHealthy
    $healthy = $rootHealthy -and $internalHealthy

    [pscustomobject]@{
        Healthy = $healthy
        RootHealthy = $rootHealthy
        InternalHealthy = $internalHealthy
        Listening = if ($healthy) { $true } else { Test-LocalPort $Port }
        Label = "dashboard"
        Url = "http://127.0.0.1:$Port"
    }
}

function Show-AgentOsStatus {
    param([int]$BridgePort, [int]$DashboardPort, [int]$LegacyDashboardPort)

    $bridge = Get-BridgeState $BridgePort
    $dashboard = Get-DashboardState $DashboardPort
    $legacy = Get-LegacyDashboardState $LegacyDashboardPort

    if ($bridge.Healthy) {
        Write-Host "[OK] production Bridge: 正常 ($($bridge.Url))" -ForegroundColor Green
    }
    elseif ($bridge.Listening) {
        Write-Host "[NG] $BridgePort 番ポートは使用中ですが、正しいBridgeではありません。" -ForegroundColor Red
    }
    else {
        Write-Host "[--] production Bridge: 停止中 ($($bridge.Url))" -ForegroundColor Yellow
    }

    if ($dashboard.RootHealthy) {
        Write-Host "[OK] 顧客ダッシュボード: 正常 ($($dashboard.Url)/)" -ForegroundColor Green
    }
    else {
        Write-Host "[NG] 顧客ダッシュボード: 応答を確認できません。" -ForegroundColor Red
    }

    if ($dashboard.InternalHealthy) {
        Write-Host "[OK] 内部HQ: 正常 ($($dashboard.Url)/internal)" -ForegroundColor Green
    }
    else {
        Write-Host "[NG] 内部HQ: 応答を確認できません。" -ForegroundColor Red
    }

    if ($legacy.Detected) {
        Write-Host "[CRITICAL] stale legacy dashboard detected: port $($legacy.Port), PID $($legacy.ProcessId). Auto-kill is disabled." -ForegroundColor Red
    }
    else {
        Write-Host "[OK] legacy $LegacyDashboardPort port: listenerなし" -ForegroundColor Green
    }

    [pscustomobject]@{ Bridge = $bridge; Dashboard = $dashboard; Legacy = $legacy }
}

function Start-ProcessWithEnvironment {
    param(
        [string]$FilePath,
        [string[]]$ArgumentList,
        [string]$WorkingDirectory,
        [hashtable]$Environment,
        [string]$StdoutPath,
        [string]$StderrPath
    )

    $previous = @{}
    try {
        foreach ($name in $Environment.Keys) {
            $previous[$name] = [Environment]::GetEnvironmentVariable($name, "Process")
            [Environment]::SetEnvironmentVariable($name, [string]$Environment[$name], "Process")
        }
        return Start-Process -FilePath $FilePath -ArgumentList $ArgumentList `
            -WorkingDirectory $WorkingDirectory -WindowStyle Hidden -PassThru `
            -RedirectStandardOutput $StdoutPath -RedirectStandardError $StderrPath
    }
    finally {
        foreach ($name in $Environment.Keys) {
            [Environment]::SetEnvironmentVariable($name, $previous[$name], "Process")
        }
    }
}

function Wait-Healthy {
    param(
        [scriptblock]$Probe,
        [int]$TimeoutSeconds
    )

    $deadline = [DateTime]::UtcNow.AddSeconds($TimeoutSeconds)
    do {
        $state = & $Probe
        if ($state.Healthy) { return $state }
        Start-Sleep -Milliseconds 500
    } while ([DateTime]::UtcNow -lt $deadline)
    return & $Probe
}

function Get-RuntimeEnvironmentValue {
    param([string]$Name)

    $processValue = [Environment]::GetEnvironmentVariable($Name, "Process")
    if (-not [string]::IsNullOrWhiteSpace($processValue)) { return $processValue }
    $userValue = [Environment]::GetEnvironmentVariable($Name, "User")
    if (-not [string]::IsNullOrWhiteSpace($userValue)) { return $userValue }
    return $null
}

function New-RuntimeSecret {
    $bytes = New-Object byte[] 32
    $generator = [Security.Cryptography.RandomNumberGenerator]::Create()
    try { $generator.GetBytes($bytes) } finally { $generator.Dispose() }
    return ([BitConverter]::ToString($bytes) -replace "-", "").ToLowerInvariant()
}

if ($BridgePort -eq 8765) {
    Write-Host "[停止] 8765番は旧設定のため、このlauncherでは起動しません。" -ForegroundColor Red
    exit 2
}
if ($LegacyDashboardPort -eq $DashboardPort) {
    Write-Host "[停止] legacy portとcanonical dashboard portは別にしてください。" -ForegroundColor Red
    exit 2
}

if ($StatusOnly) {
    $status = Show-AgentOsStatus -BridgePort $BridgePort -DashboardPort $DashboardPort -LegacyDashboardPort $LegacyDashboardPort
    if ($status.Bridge.Healthy -and $status.Dashboard.Healthy -and -not $status.Legacy.Detected) { exit 0 }
    exit 1
}

$mutex = New-Object System.Threading.Mutex($false, "Local\IKORABUagent.AgentOS.Launcher")
$lockTaken = $false
try {
    $lockTaken = $mutex.WaitOne(5000)
    if (-not $lockTaken) {
        Write-Host "[停止] 別のlauncherが起動処理中です。少し待ってから再実行してください。" -ForegroundColor Yellow
        exit 2
    }

    $bridge = Get-BridgeState $BridgePort
    if ($bridge.Healthy) {
        Write-Host "[そのまま] production Bridgeは既に正常です。" -ForegroundColor Cyan
    }
    elseif ($bridge.Listening) {
        Write-Host "[停止] $BridgePort 番ポートを別のサービスが使用中です。何も起動しません。" -ForegroundColor Red
        exit 2
    }
    else {
        $threadsRoot = (Resolve-Path -LiteralPath $ThreadsRepo).Path
        $python = Join-Path $threadsRoot ".venv\Scripts\python.exe"
        $productionDb = Join-Path $threadsRoot "data\research.db"
        if (-not (Test-Path -LiteralPath $python -PathType Leaf)) {
            throw "Bridge用Pythonが見つかりません。Threads-の.venvを確認してください。"
        }
        if (-not (Test-Path -LiteralPath $productionDb -PathType Leaf)) {
            throw "canonical production DBが見つかりません。Bridgeは起動していません。"
        }

        $logDirectory = Join-Path $DashboardRepo ".runtime\logs"
        New-Item -ItemType Directory -Path $logDirectory -Force | Out-Null
        $bridgeApiKey = Get-RuntimeEnvironmentValue "AUTOPILOT_BRIDGE_API_KEY"
        $bridgeEnvironment = @{
            AUTOPILOT_BRIDGE_HOST = "127.0.0.1"
            AUTOPILOT_BRIDGE_PORT = [string]$BridgePort
            THREADS_PRODUCTION_DB = $productionDb
            AUTOPILOT_BRIDGE_AUTH_MODE = if ($bridgeApiKey) { "api-key" } else { "local" }
        }
        if ($bridgeApiKey) { $bridgeEnvironment.AUTOPILOT_BRIDGE_API_KEY = $bridgeApiKey }
        foreach ($name in @(
            "FEATURE_MULTI_TENANT_AUTH",
            "FEATURE_MULTI_TENANT_AUTH_SHADOW",
            "FEATURE_MULTI_TENANT_AUTH_CANARY",
            "FEATURE_MULTI_TENANT_AUTH_CANARY_USER_ID",
            "FEATURE_MULTI_TENANT_AUTH_CANARY_ACCOUNT_ID"
        )) {
            $value = Get-RuntimeEnvironmentValue $name
            if ($null -ne $value) { $bridgeEnvironment[$name] = $value }
        }

        $process = Start-ProcessWithEnvironment -FilePath $python `
            -ArgumentList @("-m", "threads_autopilot.bridge") `
            -WorkingDirectory $threadsRoot `
            -Environment $bridgeEnvironment `
            -StdoutPath (Join-Path $logDirectory "bridge.stdout.log") `
            -StderrPath (Join-Path $logDirectory "bridge.stderr.log")
        Write-Host "[起動中] production Bridgeを公式経路で開始しました (PID $($process.Id))。" -ForegroundColor Cyan

        $bridge = Wait-Healthy -Probe { Get-BridgeState $BridgePort } -TimeoutSeconds $StartupTimeoutSeconds
        if (-not $bridge.Healthy) {
            Write-Host "[失敗] production Bridgeの正常応答を確認できません。ログを確認してください。" -ForegroundColor Red
            exit 1
        }
    }

    $dashboard = Get-DashboardState $DashboardPort
    if ($dashboard.Healthy) {
        Write-Host "[そのまま] dashboardは既に正常です。" -ForegroundColor Cyan
    }
    elseif ($dashboard.Listening) {
        Write-Host "[停止] $DashboardPort 番ポートを別のサービスが使用中です。dashboardは起動しません。" -ForegroundColor Red
        exit 2
    }
    else {
        $dashboardRoot = (Resolve-Path -LiteralPath $DashboardRepo).Path
        $bunCommand = Get-Command bun.exe -ErrorAction SilentlyContinue
        if ($null -eq $bunCommand) { $bunCommand = Get-Command bun -ErrorAction Stop }

        $runtimeDbRelative = ".runtime/db/agents-demo.db"
        $runtimeDb = Join-Path $dashboardRoot ".runtime\db\agents-demo.db"
        $runtimeDbGuard = Join-Path $dashboardRoot "pokemon-agents\scripts\ensure-runtime-db.ts"
        if (-not (Test-Path -LiteralPath $runtimeDbGuard -PathType Leaf)) {
            throw "runtime DB guardが見つかりません。dashboardは起動していません。"
        }
        Write-Host "[確認中] runtime demo DBを検証しています。未作成の場合のみ生成します。" -ForegroundColor Cyan
        & $bunCommand.Source $runtimeDbGuard
        if (-not $?) {
            throw "runtime demo DBの検証または生成に失敗しました。dashboardは起動していません。"
        }
        if (-not (Test-Path -LiteralPath $runtimeDb -PathType Leaf)) {
            throw "runtime demo DBの生成結果を確認できません。dashboardは起動していません。"
        }

        $dashboardEnvironment = @{
            AGENTS_DB_PATH = $runtimeDbRelative
            POKEMON_AGENTS_HOST = "127.0.0.1"
            POKEMON_AGENTS_PORT = [string]$DashboardPort
            POKEMON_AGENTS_SCHEDULER = "off"
            THREADS_BRIDGE_URL = "http://127.0.0.1:$BridgePort"
        }
        $dashboardBridgeKey = Get-RuntimeEnvironmentValue "THREADS_BRIDGE_API_KEY"
        if (-not $dashboardBridgeKey) { $dashboardBridgeKey = Get-RuntimeEnvironmentValue "AUTOPILOT_BRIDGE_API_KEY" }
        if ($dashboardBridgeKey) {
            $dashboardEnvironment.THREADS_BRIDGE_API_KEY = $dashboardBridgeKey
        }

        $effectiveAuthMode = $DashboardAuthMode
        if ($effectiveAuthMode -eq "inherit") {
            $effectiveAuthMode = Get-RuntimeEnvironmentValue "DASHBOARD_INTERNAL_AUTH"
            if (-not $effectiveAuthMode) { $effectiveAuthMode = "local" }
        }
        $dashboardEnvironment.DASHBOARD_INTERNAL_AUTH = $effectiveAuthMode
        foreach ($name in @(
            "DASHBOARD_INTERNAL_ALLOWED_EMAILS",
            "DASHBOARD_INTERNAL_ACCOUNT_IDS",
            "DASHBOARD_CSRF_SECRET",
            "DASHBOARD_INTERNAL_API_KEY",
            "DASHBOARD_MULTI_TENANT_AUTH",
            "DASHBOARD_MULTI_TENANT_AUTH_SHADOW",
            "DASHBOARD_MULTI_TENANT_AUTH_CANARY",
            "DASHBOARD_MULTI_TENANT_AUTH_CANARY_USER_ID",
            "DASHBOARD_MULTI_TENANT_AUTH_CANARY_ACCOUNT_ID",
            "DASHBOARD_LOCAL_USER_ID",
            "DASHBOARD_LOCAL_TENANT_ROLE"
        )) {
            $value = Get-RuntimeEnvironmentValue $name
            if ($null -ne $value) { $dashboardEnvironment[$name] = $value }
        }
        if (-not [string]::IsNullOrWhiteSpace($DashboardAccountIds)) {
            $dashboardEnvironment.DASHBOARD_INTERNAL_ACCOUNT_IDS = $DashboardAccountIds
        }
        if ($effectiveAuthMode -eq "cloudflare-access") {
            if (-not $dashboardEnvironment.ContainsKey("DASHBOARD_INTERNAL_ALLOWED_EMAILS") -or
                [string]::IsNullOrWhiteSpace($dashboardEnvironment["DASHBOARD_INTERNAL_ALLOWED_EMAILS"])) {
                throw "cloudflare-access mode requires DASHBOARD_INTERNAL_ALLOWED_EMAILS in Process or Windows User environment."
            }
            if (-not $dashboardEnvironment.ContainsKey("DASHBOARD_INTERNAL_ACCOUNT_IDS") -or
                [string]::IsNullOrWhiteSpace($dashboardEnvironment["DASHBOARD_INTERNAL_ACCOUNT_IDS"])) {
                throw "cloudflare-access mode requires DashboardAccountIds or DASHBOARD_INTERNAL_ACCOUNT_IDS."
            }
            if (-not $dashboardEnvironment.ContainsKey("DASHBOARD_CSRF_SECRET") -or
                [string]::IsNullOrWhiteSpace($dashboardEnvironment["DASHBOARD_CSRF_SECRET"])) {
                $dashboardEnvironment.DASHBOARD_CSRF_SECRET = New-RuntimeSecret
            }
        }

        $logDirectory = Join-Path $dashboardRoot ".runtime\logs"
        New-Item -ItemType Directory -Path $logDirectory -Force | Out-Null
        $process = Start-ProcessWithEnvironment -FilePath $bunCommand.Source `
            -ArgumentList @("pokemon-agents/web/server.ts") `
            -WorkingDirectory $dashboardRoot `
            -Environment $dashboardEnvironment `
            -StdoutPath (Join-Path $logDirectory "dashboard.stdout.log") `
            -StderrPath (Join-Path $logDirectory "dashboard.stderr.log")
        Write-Host "[起動中] dashboardを開始しました (PID $($process.Id))。" -ForegroundColor Cyan

        $dashboard = Wait-Healthy -Probe { Get-DashboardState $DashboardPort } -TimeoutSeconds $StartupTimeoutSeconds
        if (-not $dashboard.Healthy) {
            Write-Host "[失敗] dashboardの正常応答を確認できません。ログを確認してください。" -ForegroundColor Red
            exit 1
        }
    }

    Write-Host ""
    $status = Show-AgentOsStatus -BridgePort $BridgePort -DashboardPort $DashboardPort -LegacyDashboardPort $LegacyDashboardPort
    if ($status.Bridge.Healthy -and $status.Dashboard.Healthy -and -not $status.Legacy.Detected) {
        Write-Host "準備完了です。ブラウザで http://127.0.0.1:$DashboardPort/ を開いてください。" -ForegroundColor Green
        exit 0
    }
    exit 1
}
catch {
    Write-Host "[失敗] $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
finally {
    if ($lockTaken) { $mutex.ReleaseMutex() }
    $mutex.Dispose()
}
