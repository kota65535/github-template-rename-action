#!/usr/bin/env bash
set -euo pipefail
set -x

export LC_ALL=C

usage() {
  cat <<EOF
Usage:
  bash $(basename "$0")
Environment Variables:
  GITHUB_TOKEN:
    An authentication token used by gh
  COMMIT_MESSAGE:
    Commit message
EOF
}

if [[ -z "${GITHUB_TOKEN}" ]] || [[ -z "${COMMIT_MESSAGE}" ]]; then
  usage && exit 1
fi

# Configure git
git config --global user.email "github-actions[bot]@users.noreply.github.com"
git config --global user.name "github-actions[bot]"
git config --global --add safe.directory /github/workspace

REPO_NAME_FULL="$(gh repo view --json nameWithOwner --jq ".nameWithOwner")"

# If from-name is not given, use the template repository name
if [[ -z "${FROM_NAME}" ]]; then
  FROM_NAME=$(gh api "repos/${REPO_NAME_FULL}" --jq .template_repository.name)
  if [[ -z ${FROM_NAME} ]]; then
    eecho "Could not get '${REPO_NAME_FULL}' template repository"
    eecho "Failed to get default from-name input"
    exit 1
  fi
fi

# If to-name not given, use the repository name
if [[ -z "${TO_NAME}" ]]; then
  TO_NAME="$(gh repo view --json name --jq ".name")"
fi

./rename.sh "${FROM_NAME}" "${TO_NAME}"

if ! git diff --quiet; then
  git add .
  git commit -m "${COMMIT_MESSAGE}"
  git push origin HEAD
fi
