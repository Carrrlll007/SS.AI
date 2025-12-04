param(
    [switch]$SyncDeps
)

$ErrorActionPreference = "Stop"
$repoRoot = (Resolve-Path "$PSScriptRoot\\..").Path

$agents = @(
    @{ Name = "llm-auditor"; Path = "external/google-adk-samples/python/agents/llm-auditor"; Entry = @("-m", "llm_auditor.agent") },
    @{ Name = "image-scoring"; Path = "external/google-adk-samples/python/agents/image-scoring"; Entry = @("-m", "image_scoring.agent") },
    @{ Name = "marketing-agency"; Path = "external/google-adk-samples/python/agents/marketing-agency"; Entry = @("-m", "marketing_agency.agent") },
    @{ Name = "fomc-research"; Path = "external/google-adk-samples/python/agents/fomc-research"; Entry = @("-m", "fomc_research.agent") },
    @{ Name = "RAG"; Path = "external/google-adk-samples/python/agents/RAG"; Entry = @("-m", "rag.agent") },
    @{ Name = "data-science"; Path = "external/google-adk-samples/python/agents/data-science"; Entry = @("main.py") }
)

function New-Venv {
    param(
        [string]$AgentPath,
        [string]$AgentName
    )

    Write-Host "Creating venv for $AgentName..." -ForegroundColor Cyan
    Push-Location $AgentPath
    $venvCreated = $false
    if (Get-Command py -ErrorAction SilentlyContinue) {
        & py -m venv .venv
        $venvCreated = $true
    } elseif (Get-Command python -ErrorAction SilentlyContinue) {
        & python -m venv .venv
        $venvCreated = $true
    } else {
        Write-Warning "Python launcher not found; install Python 3.11+ and retry."
    }
    Pop-Location
    return $venvCreated
}

function Install-AgentDeps {
    param(
        [string]$PythonExe,
        [string]$AgentPath,
        [string]$AgentName
    )

    Write-Host "Installing deps for $AgentName..." -ForegroundColor Cyan
    $hasUv = $null -ne (Get-Command uv -ErrorAction SilentlyContinue)
    Push-Location $AgentPath
    if ($hasUv -and (Test-Path "uv.lock")) {
        & uv sync
    } else {
        & $PythonExe -m pip install --upgrade pip
        & $PythonExe -m pip install -e .
    }
    Pop-Location
}

function Test-AgentReady {
    param(
        [hashtable]$Agent
    )

    $agentPath = Join-Path $repoRoot $Agent.Path
    if (-not (Test-Path $agentPath)) {
        Write-Warning "Skipping $($Agent.Name): path not found ($agentPath)"
        return $null
    }

    $venvPath = Join-Path $agentPath ".venv"
    $pythonExe = Join-Path $venvPath "Scripts\\python.exe"
    $created = $false

    if (-not (Test-Path $venvPath)) {
        $created = New-Venv -AgentPath $agentPath -AgentName $Agent.Name
    }

    if (-not (Test-Path $pythonExe)) {
        Write-Warning "Skipping $($Agent.Name): venv python not found ($pythonExe)"
        return $null
    }

    if ($SyncDeps -or $created) {
        Install-AgentDeps -PythonExe $pythonExe -AgentPath $agentPath -AgentName $Agent.Name
    }

    return $pythonExe
}

function Start-AgentJob {
    param(
        [hashtable]$Agent,
        [string]$PythonExe
    )

    $agentPath = Join-Path $repoRoot $Agent.Path
    $envFile = Join-Path $agentPath ".env"

    if (-not (Test-Path $envFile)) {
        Write-Warning "Skipping $($Agent.Name): missing .env (copy .env.example to .env and fill values)."
        return $null
    }

    $entryArgs = $Agent.Entry
    Write-Host "Starting $($Agent.Name)..." -ForegroundColor Green

    $job = Start-Job -Name "agent-$($Agent.Name)" -ScriptBlock {
        param($Path, $Python, $Args, $EnvFilePath)
        Set-Location $Path

        Get-Content $EnvFilePath | ForEach-Object {
            if ($_ -match "^\s*$" -or $_ -match "^\s*#") { return }
            $parts = $_ -split "=", 2
            if ($parts.Count -eq 2) {
                $key = $parts[0].Trim()
                $val = $parts[1].Trim()
                if ($key) { Set-Item -Path "Env:$key" -Value $val }
            }
        }

        & $Python @Args
    } -ArgumentList $agentPath, $PythonExe, $entryArgs, $envFile

    return $job
}

$jobs = @()

foreach ($agent in $agents) {
    $pythonExe = Test-AgentReady -Agent $agent
    if ($null -eq $pythonExe) { continue }

    $job = Start-AgentJob -Agent $agent -PythonExe $pythonExe
    if ($job) { $jobs += $job }
}

Write-Host "Starting Next.js dev server..." -ForegroundColor Green
$nextJob = Start-Job -Name "web-next-dev" -ScriptBlock {
    param($RootPath)
    Set-Location $RootPath
    npm run dev
} -ArgumentList $repoRoot

$jobs += $nextJob

Write-Host "`nStarted jobs:" -ForegroundColor Green
$jobs | Select-Object Id, Name, State | Format-Table -AutoSize

Write-Host "`nPress Ctrl+C to stop all jobs..." -ForegroundColor Yellow

try {
    while ($true) { Start-Sleep 3600 }
}
finally {
    foreach ($job in $jobs) {
        Stop-Job $job -Force -ErrorAction SilentlyContinue
        Remove-Job $job -ErrorAction SilentlyContinue
    }
}
