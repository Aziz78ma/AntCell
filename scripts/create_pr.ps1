Param()

Write-Host "Creating feature branch and opening PR (PowerShell)"
$time = Get-Date -UFormat %s
$branch = "feat/studio-skin-$time"
git checkout -b $branch
git add -A
git commit -m "feat(ui): cinematic studio skin, toon-shaded hero, bloom, micro-animations"
git push -u origin $branch

if (Get-Command gh -ErrorAction SilentlyContinue) {
  gh pr create --fill --title "feat(ui): Cinematic studio skin" --body "Adds stylized viewport (toon shading + bloom), micro-animations, and UI polish."
} else {
  Write-Host "Branch pushed: $branch"
  Write-Host "Run 'gh pr create' to open a PR, or create one in GitHub web UI."
}
