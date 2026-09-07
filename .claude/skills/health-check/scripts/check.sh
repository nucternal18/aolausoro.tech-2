#!/usr/bin/env bash
# aolausoro.tech health check
# Usage: bash .claude/skills/health-check/scripts/check.sh
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
cd "$REPO_ROOT"

RED='\033[0;31m'; YEL='\033[1;33m'; GRN='\033[0;32m'; BLD='\033[1m'; NC='\033[0m'
FAILS=0; WARNS=0
ok()   { printf "  ${GRN}✓${NC} %s\n" "$1"; }
warn() { printf "  ${YEL}⚠${NC} %s\n" "$1"; WARNS=$((WARNS+1)); }
fail() { printf "  ${RED}✗${NC} %s\n" "$1"; FAILS=$((FAILS+1)); }
hdr()  { printf "\n${BLD}── %s${NC}\n" "$1"; }

printf "${BLD}=== aolausoro.tech Health Check ===${NC}\n"

hdr "1. Dependency CVE audit (pnpm audit)"
if pnpm audit --audit-level=high; then ok "No high/critical CVEs"; else warn "High/critical CVEs found — review and resolve"; fi

hdr "2. Outdated packages (pnpm outdated)"
OUT=$(pnpm outdated 2>&1 || true)
if [ -z "$OUT" ]; then ok "All packages current"; else printf "%s\n" "$OUT"; warn "Outdated packages — flag major-version gaps to the user"; fi

hdr "3. Lint (pnpm run lint)"
if pnpm run lint; then ok "No ESLint errors"; else fail "ESLint errors — fix before starting"; fi

hdr "4. Type-check (tsc --noEmit)"
if pnpm exec tsc --noEmit; then ok "No TypeScript errors"; else fail "TypeScript errors — fix before starting"; fi

hdr "5. Integration tests (pnpm run test:int)"
if pnpm run test:int; then ok "Integration tests pass"; else fail "Integration tests failing — check DB reachability first"; fi

printf "\n${BLD}════════════════════════════════${NC}\n"
if [ "$FAILS" -eq 0 ] && [ "$WARNS" -eq 0 ]; then
  printf "${GRN}${BLD}All checks passed.${NC}\n"
elif [ "$FAILS" -eq 0 ]; then
  printf "${YEL}${BLD}%s warning(s). Review with user.${NC}\n" "$WARNS"
else
  printf "${RED}${BLD}%s failure(s), %s warning(s). Resolve before proceeding.${NC}\n" "$FAILS" "$WARNS"
  exit 1
fi
