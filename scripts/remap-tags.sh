#!/usr/bin/env bash
#
# remap-tags.sh — Remap 27 chaotic historical tags onto a SemVer-by-content
# scheme. See VERSIONING.md and the [v0.12.0] section of CHANGELOG.md for
# the why.
#
# The mapping is hard-coded below for auditability — every (old, sha, new)
# triple is intentional, derived from the commit subject's conventional-commit
# type at the time of remap design. Re-running is idempotent: existing local
# tags are skipped, missing Forgejo releases are ignored.
#
# Usage:
#   scripts/remap-tags.sh dry-run     # print the operations, do nothing
#   scripts/remap-tags.sh execute     # apply
#
# Requires: git, fj (Forgejo CLI), authenticated to git.nhsoul.fr.

set -euo pipefail

REMOTE="${REMOTE:-origin}"

# Mapping rows: "old_tag|sha|new_tag"
# Order matters: chronological, so partial progress remains coherent.
MAPPING=(
  "0.1.0|2adb671|v0.1.0"
  "0.1.0-hf1|2461c9d|v0.1.1"
  "0.1.0-hf2|582865c|v0.1.2"
  "0.2.0|db5da64|v0.2.0"
  "0.2.1|7f679aa|v0.2.1"
  "0.2.1-hf1|36b1fb5|v0.2.2"
  "0.2.1-hf2|c156a12|v0.2.3"
  "0.2.1-hf3|658dc2d|v0.2.4"
  "0.2.2|18092a3|v0.3.0"
  "0.2.4-pre1|11875e0|v0.4.0"
  "0.2.4-pre2|d914b27|v0.4.1"
  "0.2.4-pre3|2f47c6a|v0.4.2"
  "0.2.4-pre4|1a49ddb|v0.4.3"
  "0.2.5-pre1|eb15437|v0.5.0"
  "0.2.5-pre2|ded067b|v0.6.0"
  "0.2.5-pre3|d23da2c|v0.6.1"
  "0.2.5-pre4|8f4ac58|v0.7.0"
  "0.2.5-pre5|43a2f1b|v0.8.0"
  "0.2.5-pre6|673114d|v0.8.1"
  "0.2.5-pre7|5ce7821|v0.9.0"
  "0.2.5-pre8|77e0b24|v0.9.1"
  "0.2.5-pre9|d0c7301|v0.9.2"
  "0.2.5-pre10|c14e6df|v0.10.0"
  "0.2.5-pre11|75007c2|v0.10.1"
  "0.2.5-pre12|14b658d|v0.11.0"
  "0.2.5-pre13|287df77|v0.11.1"
  "0.2.5-pre14|94babc9|v0.11.2"
)

mode="${1:-}"
case "$mode" in
  dry-run|execute) ;;
  *)
    echo "usage: $0 dry-run|execute" >&2
    exit 64
    ;;
esac

# Pretty step prefix.
say() { printf '\033[1;34m[%s]\033[0m %s\n' "$1" "$2"; }
warn() { printf '\033[1;33m[WARN]\033[0m %s\n' "$1"; }

run() {
  if [[ "$mode" == "dry-run" ]]; then
    printf '  + %s\n' "$*"
  else
    "$@"
  fi
}

# Idempotent: returns 0 if local tag already exists at the desired sha.
local_tag_at_sha() {
  local tag="$1" want_sha="$2"
  local have_sha
  have_sha="$(git rev-parse "refs/tags/$tag" 2>/dev/null || true)"
  [[ -n "$have_sha" && "$have_sha" == "$want_sha"* ]]
}

remap_one() {
  local old="$1" sha="$2" new="$3"
  say "$old → $new" "sha=$sha"

  # 1. Create new local tag at the same commit (idempotent).
  if local_tag_at_sha "$new" "$sha"; then
    say "skip" "local tag $new already at $sha"
  else
    run git tag "$new" "$sha"
  fi

  # 2. Push the new tag to the remote.
  run git push "$REMOTE" "$new" 2>&1 | grep -v 'Everything up-to-date' || true

  # 3. Delete the Forgejo release tied to the old tag (if any).
  if [[ "$mode" == "execute" ]]; then
    fj release delete "$old" 2>/dev/null && say "release deleted" "$old" \
      || warn "no release for $old (ok)"
  else
    printf '  + fj release delete %s (best-effort)\n' "$old"
  fi

  # 4. Delete the old remote tag.
  if [[ "$mode" == "execute" ]]; then
    fj tag delete "$old" 2>/dev/null && say "tag deleted" "$old" \
      || warn "remote tag $old already absent"
  else
    printf '  + fj tag delete %s\n' "$old"
  fi

  # 5. Delete the old local tag.
  if git rev-parse "refs/tags/$old" >/dev/null 2>&1; then
    run git tag -d "$old"
  fi

  # 6. Create the Forgejo release on the new tag.
  local body
  body="$(printf 'Remap from %s.\n\nCommit: %s' "$old" "$sha")"
  if [[ "$mode" == "execute" ]]; then
    if fj release view "$new" >/dev/null 2>&1; then
      say "skip" "release $new already exists"
    else
      fj release create "$new" --tag "$new" --body "$body" \
        || warn "failed to create release $new (manual recovery)"
    fi
  else
    printf '  + fj release create %s --tag %s --body "Remap from %s"\n' "$new" "$new" "$old"
  fi
}

say "remap" "mode=$mode rows=${#MAPPING[@]}"
for row in "${MAPPING[@]}"; do
  IFS='|' read -r old sha new <<<"$row"
  remap_one "$old" "$sha" "$new"
done
say "done" "processed ${#MAPPING[@]} rows"
