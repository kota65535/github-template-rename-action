#!/usr/bin/env bash
set -euo pipefail
set -x

export LC_ALL=C

git config --global user.email "github-actions[bot]@users.noreply.github.com"
git config --global user.name "github-actions[bot]"
git config --global --add safe.directory /github/workspace

if ! [[ -v GITHUB_TOKEN ]]; then
  echo "GITHUB_TOKEN env var is not defined."
  exit 1
fi

REPO_NAME_FULL="$(gh repo view --json nameWithOwner --jq ".nameWithOwner")"

if ! [[ -v FROM_NAME ]]; then
  FROM_NAME=$(gh api "repos/${REPO_NAME_FULL}" --jq .template_repository.name)
  if [[ -z ${FROM_NAME} ]]; then
    echo "Could not get '${REPO_NAME_FULL}' template repository"
    echo "Failed to get default from-name input"
    exit 1
  fi
fi

if ! [[ -v TO_NAME ]]; then
  TO_NAME="$(gh repo view --json name --jq ".name")"
fi

#./rename.sh "${FROM_NAME}" "${TO_NAME}"

#git add .
#git commit "Renamed"
#git push origin main
