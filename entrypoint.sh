#!/usr/bin/env bash
set -euo pipefail
# set -x

export LC_ALL=C

if ! [[ -v GITHUB_TOKEN ]]; then
  echo "GITHUB_TOKEN env var is not defined."
  exit 1
fi

REPO_NAME_FULL="$(gh repo view --json nameWithOwner --jq ".nameWithOwner")"

if ! [[ -v FROM_NAME ]]; then
  FROM_NAME=$(gh api "${REPO_NAME_FULL}" --jq .template_repository.name)
  if [[ -z ${FROM_NAME} ]]; then
    echo "Cannot get template repository name"
  fi
fi

if ! [[ -v TO_NAME ]]; then
  TO_NAME="$(gh repo view --json name --jq ".name")"
fi

./rename.sh "${FROM_NAME}" "${TO_NAME}"

git add .
git commit "Renamed"
git push origin main
