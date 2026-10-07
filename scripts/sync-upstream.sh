#!/usr/bin/env bash
set -euo pipefail

# Fetch mattpocock/skills, merge main, and re-apply this fork's overlay.
# Overlay-managed files are taken from upstream on conflict, then patched.
# Other conflicts are left for you to fix.

REPO="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO"

if ! command -v node >/dev/null; then
  echo "error: node is required to read fork/config.json and apply the overlay." >&2
  exit 1
fi

UPSTREAM_URL="$(node -p "require('./fork/config.json').upstream.git")"
mapfile -t MANAGED < <(node -p "require('./fork/config.json').managedFiles.join('\n')")

if git remote get-url upstream >/dev/null 2>&1; then
  git remote set-url upstream "$UPSTREAM_URL"
else
  git remote add upstream "$UPSTREAM_URL"
fi

git fetch upstream main

if git merge-base --is-ancestor upstream/main HEAD; then
  echo "Already up to date with upstream/main."
  node scripts/apply-fork-overlay.mjs
  node scripts/apply-fork-overlay.mjs --check
  exit 0
fi

overlay_commit() {
  node scripts/apply-fork-overlay.mjs
  git add -- "${MANAGED[@]}"
  if git diff --cached --quiet; then
    echo "Overlay produced no changes."
    return 0
  fi
  git commit -m "chore(fork): re-apply overlay after upstream merge"
}

if git merge --no-edit upstream/main; then
  overlay_commit
  echo "Merged upstream/main and re-applied the fork overlay."
  exit 0
fi

echo "Merge reported conflicts. Taking upstream on overlay-managed files, then re-applying the overlay."

unresolved="$(git diff --name-only --diff-filter=U || true)"
for f in "${MANAGED[@]}"; do
  if printf '%s\n' "$unresolved" | grep -qx "$f"; then
    git checkout --theirs -- "$f"
    git add -- "$f"
  fi
done

still="$(git diff --name-only --diff-filter=U || true)"
if [ -n "$still" ]; then
  echo "Unresolved conflicts remain (not overlay-managed):" >&2
  printf '%s\n' "$still" >&2
  echo "Fix those, then run: node scripts/apply-fork-overlay.mjs && git add -A && git commit" >&2
  exit 1
fi

overlay_commit
echo "Resolved overlay-managed conflicts from upstream and re-applied the overlay."
