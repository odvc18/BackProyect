Param(
    [Parameter(Mandatory=$false)][string]$Server = "DESKTOP-2DPUJ9B",
    [Parameter(Mandatory=$false)][switch]$Trusted = $true,
    [Parameter(Mandatory=$false)][string]$User = "",
    [Parameter(Mandatory=$false)][string]$Password = ""
)

function Assert-Command {
    param([string]$Name)
    $null = Get-Command $Name -ErrorAction SilentlyContinue
    if (-not $?) {
        Write-Error "No se encontró el comando '$Name'. Instala SQL Server Command Line Utilities (sqlcmd) o usa SSMS/ADS para ejecutar los scripts."
        exit 1
    }
}

Assert-Command -Name "sqlcmd"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir = Split-Path -Parent $scriptDir
$indexPath = Join-Path $scriptDir "index.sql"
$crudPath = Join-Path $scriptDir "CRUD_SP.sql"

if (-not (Test-Path $indexPath)) {
    Write-Error "No se encontró $indexPath"
    exit 1
}
if (-not (Test-Path $crudPath)) {
    Write-Error "No se encontró $crudPath"
    exit 1
}

Write-Host "Ejecutando scripts SQL contra el servidor: $Server" -ForegroundColor Cyan

if ($Trusted) {
    & sqlcmd -S $Server -b -i $indexPath
    if ($LASTEXITCODE -ne 0) { Write-Error "Fallo ejecutando index.sql"; exit $LASTEXITCODE }
    & sqlcmd -S $Server -b -i $crudPath
    if ($LASTEXITCODE -ne 0) { Write-Error "Fallo ejecutando CRUD_SP.sql"; exit $LASTEXITCODE }
} else {
    if ([string]::IsNullOrWhiteSpace($User) -or [string]::IsNullOrWhiteSpace($Password)) {
        Write-Error "Debe proporcionar -User y -Password cuando -Trusted:$false"
        exit 1
    }
    & sqlcmd -S $Server -U $User -P $Password -b -i $indexPath
    if ($LASTEXITCODE -ne 0) { Write-Error "Fallo ejecutando index.sql"; exit $LASTEXITCODE }
    & sqlcmd -S $Server -U $User -P $Password -b -i $crudPath
    if ($LASTEXITCODE -ne 0) { Write-Error "Fallo ejecutando CRUD_SP.sql"; exit $LASTEXITCODE }
}

Write-Host "✅ Scripts ejecutados correctamente." -ForegroundColor Green









