<#
.SYNOPSIS
  Build the card and push the integration to the Energiefluss test HA.

.EXAMPLE
  .\scripts\deploy.ps1            # build, upload, restart test HA
  .\scripts\deploy.ps1 -Setup     # first time: create test HA on the NAS
  .\scripts\deploy.ps1 -Config    # also upload dev/config/configuration.yaml (simulation)
  .\scripts\deploy.ps1 -NoRestart # upload only (card changes need just a browser reload)

  Settings come from scripts\deploy.local.psd1 (not in git), see deploy.example.psd1.
#>
param(
  [switch]$Setup,
  [switch]$Config,
  [switch]$SkipBuild,
  [switch]$NoRestart
)

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$cfgFile = Join-Path $PSScriptRoot 'deploy.local.psd1'
if (-not (Test-Path $cfgFile)) { throw "Fehlt: $cfgFile (Vorlage: deploy.example.psd1)" }
$cfg = Import-PowerShellDataFile $cfgFile
$ssh = $cfg.SshTarget
$dev = $cfg.DevPath
$docker = $cfg.Docker

function Invoke-Remote([string]$cmd) {
  # Native tools write progress to stderr; PowerShell 5 must not treat that as failure.
  $ErrorActionPreference = 'Continue'
  ssh -o BatchMode=yes $ssh "$cmd 2>&1" | Where-Object { $_ -notmatch 'post-quantum|store now|pq\.html' }
  if ($LASTEXITCODE -ne 0) { throw "SSH-Befehl fehlgeschlagen: $cmd" }
}

function Send-File([string]$local, [string]$remote) {
  # Streams the file through ssh (cmd redirection is binary-safe, unlike
  # PowerShell 5 pipes). Avoids Synology's SFTP path mapping.
  cmd /c "ssh -o BatchMode=yes $ssh `"cat > '$remote'`" < `"$local`""
  if ($LASTEXITCODE -ne 0) { throw "Upload fehlgeschlagen: $local" }
}

if ($Setup) {
  Write-Host '== Test-HA einrichten' -ForegroundColor Cyan
  Invoke-Remote "mkdir -p $dev/config/custom_components"
  Send-File (Join-Path $root 'dev\docker-compose.yml') "$dev/docker-compose.yml"
}
if ($Setup -or $Config) {
  Write-Host '== Simulations-Konfiguration hochladen' -ForegroundColor Cyan
  Send-File (Join-Path $root 'dev\config\configuration.yaml') "$dev/config/configuration.yaml"
}

if (-not $SkipBuild) {
  Write-Host '== Karte bauen' -ForegroundColor Cyan
  Push-Location (Join-Path $root 'frontend')
  try {
    npm run build --silent
    if ($LASTEXITCODE -ne 0) { throw 'Build fehlgeschlagen' }
  } finally { Pop-Location }
}

Write-Host '== Integration hochladen' -ForegroundColor Cyan
$tgz = Join-Path $env:TEMP 'energiefluss.tgz'
if (Test-Path $tgz) { Remove-Item $tgz -Force }
tar -czf $tgz --exclude '__pycache__' -C (Join-Path $root 'custom_components') energiefluss
if ($LASTEXITCODE -ne 0) { throw 'Packen fehlgeschlagen' }
Send-File $tgz '/tmp/energiefluss.tgz'
Invoke-Remote "rm -rf $dev/config/custom_components/energiefluss && tar -xzf /tmp/energiefluss.tgz -C $dev/config/custom_components && rm /tmp/energiefluss.tgz"
Remove-Item $tgz -Force

if ($Setup) {
  Write-Host '== Container starten' -ForegroundColor Cyan
  Invoke-Remote "cd $dev && $docker compose pull -q && $docker compose up -d"
} elseif (-not $NoRestart) {
  Write-Host '== Test-HA neu starten' -ForegroundColor Cyan
  Invoke-Remote "$docker restart energiefluss-dev-ha > /dev/null"
}

Write-Host "Fertig: $($cfg.DevUrl)" -ForegroundColor Green
