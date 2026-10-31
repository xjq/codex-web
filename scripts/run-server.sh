#!/usr/bin/env bash
# Start the codex-web server (browser frontend for Codex Desktop).
# Env is loaded through a login shell so ~/.profile (bailian keys etc.) is picked up.
set -euo pipefail

# Self-locating: works from any install dir (a repo clone or /opt/codex-web)
# and does not depend on systemd's WorkingDirectory.
cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")/.."

exec bash -lc '
  export CODEX_CLI_PATH="${CODEX_CLI_PATH:-$(command -v codex)}"
  export NODE_ENV=production
  exec node src/server/main.js --host "${CODEX_WEB_HOST:-127.0.0.1}" --port "${CODEX_WEB_PORT:-8214}"
'
