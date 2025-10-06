#!/usr/bin/env bash
set -euo pipefail

pnpm -C apps/web dev &
WEB_PID=$!

cleanup() {
  kill  2>/dev/null || true
}

trap cleanup INT TERM

pnpm -C apps/ext-clips dev
wait 
