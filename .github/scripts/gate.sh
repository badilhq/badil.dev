#!/usr/bin/env bash
# Run one rehearsal gate of scripts/film.mjs and apply its pass rule.
# Usage: .github/scripts/gate.sh <label> <film arguments...>  (from the repository root)
#
# Still runs (--still) pass only on film exit 0 with a `rehearsal passed` line.
# Loop runs also pass on exit 2 (inconclusive) when `rehearsal passed` is printed,
# no column-0 `incomplete:` line (page error) appears, and every indented
# `incomplete:` reason is a sampling gap.
set -uo pipefail

label="${1:?usage: gate.sh <label> <film arguments...>}"
shift

out="${FILM_OUT_DIR:?FILM_OUT_DIR must be set}"
mkdir -p "$out"
log="$out/$label.log"

node scripts/film.mjs http://127.0.0.1:5173/ "$@" --out "$out/$label.png" < /dev/null 2>&1 | tee "$log"
code="${PIPESTATUS[0]}"

still=no
for arg in "$@"; do
  if [[ "$arg" == "--still" ]]; then still=yes; fi
done

passed=no
if grep -q '^rehearsal passed' "$log"; then
  if [[ "$code" == 0 ]]; then
    passed=yes
  elif [[ "$code" == 2 && "$still" == no ]] \
    && ! grep -q '^incomplete:' "$log" \
    && ! grep -E '^[[:space:]]+incomplete:' "$log" | grep -qv 'sampling gap(s) exceeded'; then
    passed=yes
  fi
fi

if [[ "$passed" == yes ]]; then
  echo "gate $label: passed (exit $code)"
  exit 0
fi

echo "::error title=rehearsal $label::exit $code; see $label.log"
exit 1
