# 还原 Docker Desktop 为官方原版 (英文界面)
# 说明: 本脚本会把备份的官方 app.asar 和 exe 还原回去, 界面恢复英文.
$ErrorActionPreference = 'Stop'

$dockerRoot = Join-Path $env:LOCALAPPDATA 'Programs\DockerDesktop'
$res        = Join-Path $dockerRoot 'frontend\resources'
$exe        = Join-Path $dockerRoot 'frontend\Docker Desktop.exe'
$bk         = Join-Path $env:LOCALAPPDATA 'DockerCN\backup'

if (-not (Test-Path (Join-Path $bk 'app.asar.orig'))) {
  Write-Output "找不到备份文件: $bk"
  Write-Output "无法自动还原, 请重新安装 Docker Desktop."
  exit 1
}

Write-Output "[1/4] 停止 Docker Desktop (容器会短暂中断)"
Get-Process | Where-Object { $_.Name -match '^(Docker Desktop|com\.docker\.backend|com\.docker\.build)$' } |
  ForEach-Object { Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue }
Start-Sleep -Seconds 6

Write-Output "[2/4] 还原 exe 与 app.asar"
Copy-Item (Join-Path $bk 'Docker Desktop.exe.orig') $exe -Force
Copy-Item (Join-Path $bk 'app.asar.orig') (Join-Path $res 'app.asar') -Force
Remove-Item (Join-Path $res 'app.asar.unpacked') -Recurse -Force -ErrorAction SilentlyContinue
if (Test-Path (Join-Path $bk 'app.asar.unpacked.orig')) {
  Copy-Item (Join-Path $bk 'app.asar.unpacked.orig') (Join-Path $res 'app.asar.unpacked') -Recurse -Force
}

Write-Output "[3/4] 清理残留"
Remove-Item (Join-Path $res 'app-cn.asar') -Force -ErrorAction SilentlyContinue

Write-Output "[4/4] 启动 Docker Desktop"
Start-Process (Join-Path $dockerRoot 'Docker Desktop.exe')
Write-Output "完成, 界面已恢复为英文原版."
