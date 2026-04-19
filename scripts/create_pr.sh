#!/usr/bin/env bash
set -euo pipefail

# Creates a feature branch, commits staged changes, pushes, and opens a PR using GitHub CLI if available.
branch="feat/studio-skin-$(date +%s)"
echo "Creating branch: $branch"
git checkout -b "$branch"
git add -A
git commit -m "feat(ui): cinematic studio skin, toon-shaded hero, bloom, micro-animations"
git push -u origin "$branch"

if command -v gh >/dev/null 2>&1; then
  echo "Opening PR with GitHub CLI"
  gh pr create --fill --title "feat(ui): Cinematic studio skin" --body "Adds stylized viewport (toon shading + bloom), micro-animations, and UI polish."
else
  echo "PR created on branch $branch. Use 'gh pr create' or open the repository on GitHub and create a pull request from branch $branch."
fi

echo "Done."
