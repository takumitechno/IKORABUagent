[CmdletBinding()]
param(
    [ValidateRange(1, 65535)]
    [int]$Port = 3000,
    # 2回目以降、記事やコードを変えていなければビルドを省略して速く起動できる
    [switch]$SkipBuild,
    [switch]$NoBrowser
)

# 未経験転職メディア MVP をこの PC だけで閲覧できるように起動する（Windows PowerShell）。
#   cd career-media
#   powershell -ExecutionPolicy Bypass -File .\scripts\start-local.ps1
# 停止: このウィンドウで Ctrl+C
# 127.0.0.1 にだけ bind するため、同じネットワークの他の端末やインターネットからは見えない。

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$AppDir = Split-Path $PSScriptRoot -Parent
Set-Location $AppDir

function Test-LocalPort {
    param([int]$Port)
    $client = New-Object System.Net.Sockets.TcpClient
    try {
        $task = $client.ConnectAsync("127.0.0.1", $Port)
        if (-not $task.Wait(500)) { return $false }
        return $client.Connected
    }
    catch { return $false }
    finally { $client.Dispose() }
}

# 1. Node.js の確認（Next.js 16 は 20.9 以上が必要）
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Host "Node.js が見つかりません。https://nodejs.org/ から LTS 版をインストールしてから再実行してください。" -ForegroundColor Red
    exit 1
}
$nodeVersion = [version]((& node -v).TrimStart("v"))
if ($nodeVersion -lt [version]"20.9.0") {
    Write-Host "Node.js $nodeVersion は古すぎます。20.9 以上（LTS 推奨）に更新してください。" -ForegroundColor Red
    exit 1
}

$url = "http://localhost:$Port"
if (Test-LocalPort -Port $Port) {
    Write-Host "ポート $Port はすでに使われています。別のポートで起動する場合: -Port 3100" -ForegroundColor Yellow
    exit 1
}

$env:NEXT_TELEMETRY_DISABLED = "1"
$env:NEXT_PUBLIC_SITE_URL = $url

# 2. 依存パッケージ（初回、または package-lock.json が更新されたときだけ）
$installedMarker = Join-Path $AppDir "node_modules\.package-lock.json"
if (-not (Test-Path $installedMarker) -or ((Get-Item "package-lock.json").LastWriteTime -gt (Get-Item $installedMarker).LastWriteTime)) {
    Write-Host "[1/3] 依存パッケージをインストールしています（初回は数分かかります）..." -ForegroundColor Cyan
    & npm ci
    if ($LASTEXITCODE -ne 0) { throw "npm ci に失敗しました" }
}
else {
    Write-Host "[1/3] 依存パッケージはインストール済みです" -ForegroundColor Cyan
}

# 3. 本番ビルド
if ($SkipBuild -and (Test-Path ".next\BUILD_ID")) {
    Write-Host "[2/3] ビルドを省略します（-SkipBuild）" -ForegroundColor Cyan
}
else {
    Write-Host "[2/3] 本番ビルドを作成しています..." -ForegroundColor Cyan
    & npx next build
    if ($LASTEXITCODE -ne 0) { throw "ビルドに失敗しました" }
}

# 4. 起動（127.0.0.1 のみ）→ 起動を待ってブラウザを開く
Write-Host "[3/3] $url で起動します。停止するにはこのウィンドウで Ctrl+C を押してください。" -ForegroundColor Green
$server = Start-Process -FilePath "npx.cmd" -ArgumentList @("next", "start", "-p", "$Port", "-H", "127.0.0.1") -NoNewWindow -PassThru
try {
    $deadline = (Get-Date).AddSeconds(60)
    while (-not (Test-LocalPort -Port $Port)) {
        if ($server.HasExited) { throw "サーバーの起動に失敗しました" }
        if ((Get-Date) -gt $deadline) { throw "60秒以内に起動しませんでした" }
        Start-Sleep -Milliseconds 500
    }
    if (-not $NoBrowser) { Start-Process $url }
    Write-Host ""
    Write-Host "  トップ          $url/" -ForegroundColor Green
    Write-Host "  条件整理チェック $url/check"
    Write-Host "  職種比較        $url/jobs"
    Write-Host "  記事一覧        $url/articles"
    Write-Host "  ニュース解説    $url/news"
    Write-Host ""
    Wait-Process -Id $server.Id
}
finally {
    if (-not $server.HasExited) { Stop-Process -Id $server.Id -Force -ErrorAction SilentlyContinue }
}
