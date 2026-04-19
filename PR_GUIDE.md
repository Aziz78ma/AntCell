PR Creation Guide
==================

Quick steps to create a branch, commit all changes, push, and open a PR.

Using the provided helper scripts:

Unix / WSL / Git Bash:
```bash
./scripts/create_pr.sh
```

PowerShell (Windows):
```powershell
./scripts/create_pr.ps1
```

Manual commands:
```bash
git checkout -b feat/studio-skin-<timestamp>
git add -A
git commit -m "feat(ui): cinematic studio skin, toon-shaded hero, bloom, micro-animations"
git push -u origin feat/studio-skin-<timestamp>
# Then open a PR on GitHub or use the GitHub CLI:
gh pr create --fill --title "feat(ui): Cinematic studio skin"
```
