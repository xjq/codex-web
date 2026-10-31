#!/usr/bin/env bash
# Start the codex-web server (browser frontend for Codex Desktop).
# Env is loaded through a login shell so ~/.profile (bailian keys etc.) is picked up.
set -euo pipefail

cd /home/xjq/src/0xcaff-codex-web

exec bash -lc '
  export CODEX_CLI_PATH="${CODEX_CLI_PATH:-$(command -v codex)}"
  export NODE_ENV=production
  exec node src/server/main.js --host "${CODEX_WEB_HOST:-127.0.0.1}" --port "${CODEX_WEB_PORT:-8214}"
'
