# Force remove gh-pages cache which is causing ENAMETOOLONG errors
Write-Host "Cleaning up gh-pages cache..."
if (Test-Path "node_modules/gh-pages") {
    Remove-Item -Path "node_modules/gh-pages" -Recurse -Force
    Write-Host "Cache cleared successfully."
} else {
    Write-Host "Cache not found. Doing nothing."
}
