<#
  scripts/winget-install.ps1
  Wrapper to install packages with winget non-interactively.

  Usage (from PowerShell):
    .\scripts\winget-install.ps1 -PackageId OpenJS.NodeJS

  The script will re-run itself elevated if required (you will see a UAC prompt).
  It passes `--accept-source-agreements` and `--accept-package-agreements` to winget
  so you won't be prompted to accept terms interactively.
#>
param(
  [Parameter(Mandatory=$true, Position=0)]
  [string]$PackageId,

  [string[]]$AdditionalArgs
)

# Build the winget argument list
$wingetArgs = @('install', $PackageId, '--accept-source-agreements', '--accept-package-agreements')
if ($AdditionalArgs) { $wingetArgs += $AdditionalArgs }

# Function to run winget in the current session
function Run-Winget {
  Write-Host "Running: winget $($wingetArgs -join ' ')" -ForegroundColor Cyan
  & winget @wingetArgs
  return $LASTEXITCODE
}

# If not elevated, re-launch elevated
$principal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
  Write-Host "Not running as administrator — re-launching elevated to allow system installs (UAC prompt will appear)." -ForegroundColor Yellow
  $argLine = "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`" -PackageId `"$PackageId`""
  if ($AdditionalArgs) {
    $escaped = $AdditionalArgs -join ' '
    $argLine += " -AdditionalArgs $escaped"
  }
  Start-Process -FilePath pwsh -ArgumentList $argLine -Verb RunAs -Wait
  exit $LASTEXITCODE
}

# We're elevated (or running in an elevated shell). Run winget.
$code = Run-Winget
if ($code -ne 0) {
  Write-Host "winget exited with code $code" -ForegroundColor Red
  exit $code
}
else {
  Write-Host "Installation finished." -ForegroundColor Green
}
