#!/usr/bin/env bash
set -euo pipefail
# set -x

export LC_ALL=C

usage() {
  cat <<EOF
Rename a project.

Usage:
  bash $(basename "$0") <original-name> <new-name>
Arguments:
  original-name:
    Original project name. Should be in kebab-case.
  new-name:
    New project name. Should be in kebab-case.
EOF
}

eecho() { echo "$@" 1>&2; }

trap 'onerror $LINENO "$@"' ERR
onerror() {
  eecho "[ERROR] Unexpected error at line $1: status=$?"
}

# Parse options
POSITIONAL=()
while [[ $# -gt 0 ]]; do
  case "$1" in
    *)
      POSITIONAL+=("$1")
      shift
      ;;
  esac
done

if [[ ${#POSITIONAL[@]} -lt 2 ]]; then
  usage && exit 1
fi

to_joined() {
  echo "${1//-/}"
}

to_snake_case() {
  echo "${1//-/_}"
}

to_pascal_case() {
  local spaced=(${1//-/ })
  printf %s "${spaced[@]^}"
}

to_camel_case() {
  local spaced=(${1//-/ })
  local spaced2=(${spaced[@]:1})
  printf %s%s "${spaced[0]}" "${spaced2[@]^}"
}

ORIG_NAME="${POSITIONAL[0]}"
NEW_NAME="${POSITIONAL[1]}"

ORIG_NAME_JOIN=$(to_joined "${ORIG_NAME}")
ORIG_NAME_SNAKE=$(to_snake_case "${ORIG_NAME}")
ORIG_NAME_CAMEL=$(to_camel_case "${ORIG_NAME}")
ORIG_NAME_PASCAL=$(to_pascal_case "${ORIG_NAME}")

NEW_NAME_JOIN=$(to_joined "${NEW_NAME}")
NEW_NAME_SNAKE=$(to_snake_case "${NEW_NAME}")
NEW_NAME_CAMEL=$(to_camel_case "${NEW_NAME}")
NEW_NAME_PASCAL=$(to_pascal_case "${NEW_NAME}")

eecho "[INFO] Following names are to be replaced"
cat << EOF 1>&2
ORIGINAL\tRENAMED
${ORIG_NAME}\t${NEW_NAME}
${ORIG_NAME_JOIN}\t${NEW_NAME_JOIN}
${ORIG_NAME_SNAKE}\t${NEW_NAME_SNAKE}
${ORIG_NAME_CAMEL}\t${NEW_NAME_CAMEL}
${ORIG_NAME_PASCAL}\t${NEW_NAME_PASCAL}
EOF

# Change directory to the repository root
cd "$(git rev-parse --show-toplevel)"

eecho "[INFO] Replacing names in non-binary files..."
# Filter non-binary files by grep -I
# cf. https://unix.stackexchange.com/questions/46276/finding-all-non-binary-files 
find . -type f -not -path './.git/*' -exec grep -I -q . {} \; -print0 \
  | xargs -0 -I{} perl -i \
    -pe "s/${ORIG_NAME}/${NEW_NAME}/g;" \
    -pe "s/${ORIG_NAME_JOIN}/${NEW_NAME_JOIN}/g;" \
    -pe "s/${ORIG_NAME_SNAKE}/${NEW_NAME_SNAKE}/g;" \
    -pe "s/${ORIG_NAME_CAMEL}/${NEW_NAME_CAMEL}/g;" \
    -pe "s/${ORIG_NAME_PASCAL}/${NEW_NAME_PASCAL}/g;" {}

eecho "[INFO] Renaming files and directories..."
find . -not -path './.git/*' | while read -r name; do
  new_name=${name}
  new_name="${new_name//${ORIG_NAME}/${NEW_NAME}}"
  new_name="${new_name//${ORIG_NAME_JOIN}/${NEW_NAME_JOIN}}"
  new_name="${new_name//${ORIG_NAME_SNAKE}/${NEW_NAME_SNAKE}}"
  new_name="${new_name//${ORIG_NAME_CAMEL}/${NEW_NAME_CAMEL}}"
  new_name="${new_name//${ORIG_NAME_PASCAL}/${NEW_NAME_PASCAL}}"
  
  orig_base="$(basename "${name}")"
  new_dir="$(dirname "${new_name}")"
  new_base="$(basename "${new_name}")"
  
  # Rename if the basename doe does not match
  if [[ "${orig_base}" != "${new_base}" ]]; then
    # Since 'find' command visits directories in pre-order, the dirname should have already been renamed
    pushd "${new_dir}" > /dev/null
    mv "${orig_base}" "${new_base}"
    popd > /dev/null
  fi
done
