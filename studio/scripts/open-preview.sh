#!/usr/bin/env bash
# Reopen the ByVasoVasiko studio preview for a browser that cannot use localhost.
# Stdout is only the final https URL (including /en). A healthy dev server is left running.

set -euo pipefail

STUDIO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PREVIEW_FILE="/cursor/stores/self/preview-url.txt"
PORT=8080
DEV_SESSION="studio-php"
TUNNEL_SESSION="studio-tunnel"

tmux_cmd() {
  if [[ -f /exec-daemon/tmux.portal.conf ]]; then
    command tmux -f /exec-daemon/tmux.portal.conf "$@"
  else
    command tmux "$@"
  fi
}

http_code() {
  local url="$1"
  local max="${2:-20}"
  local code
  code="$(curl -s -o /dev/null -w '%{http_code}' --connect-timeout 5 --max-time "$max" "$url" 2>/dev/null)" || code="000"
  if [[ ! "$code" =~ ^[0-9]{3}$ ]]; then
    code="000"
  fi
  printf '%s' "$code"
}

server_listening() {
  local code
  code="$(http_code "http://127.0.0.1:${PORT}/en" 5)"
  if [[ "$code" != "000" ]]; then
    return 0
  fi
  code="$(http_code "http://[::1]:${PORT}/en" 5)"
  [[ "$code" != "000" ]]
}

dev_session_busy() {
  local cmd pid
  cmd="$(tmux_cmd list-panes -t "$DEV_SESSION" -F '#{pane_current_command}' 2>/dev/null || true)"
  case "$cmd" in
    php) return 0 ;;
  esac
  pid="$(tmux_cmd list-panes -t "$DEV_SESSION" -F '#{pane_pid}' 2>/dev/null | head -n 1 || true)"
  if [[ -n "${pid}" ]] && pgrep -P "$pid" >/dev/null 2>&1; then
    return 0
  fi
  return 1
}

ensure_dev_server() {
  local i
  if server_listening; then
    return 0
  fi

  if tmux_cmd has-session -t "$DEV_SESSION" 2>/dev/null; then
    if ! dev_session_busy; then
      tmux_cmd kill-session -t "$DEV_SESSION"
    fi
  fi

  if ! tmux_cmd has-session -t "$DEV_SESSION" 2>/dev/null; then
    tmux_cmd new-session -d -s "$DEV_SESSION" -c "$STUDIO_DIR" -- \
      bash -lc "cd $(printf '%q' "$STUDIO_DIR") && exec php -S 127.0.0.1:${PORT} -t public router.php"
  fi

  for i in $(seq 1 120); do
    if server_listening; then
      return 0
    fi
    sleep 1
  done

  printf 'dev server on port %s did not start\n' "$PORT" >&2
  exit 1
}

preview_url() {
  if [[ ! -f "$PREVIEW_FILE" ]]; then
    return 0
  fi
  tr -d '[:space:]' < "$PREVIEW_FILE"
}

body_is_php() {
  local url="$1"
  local body
  body="$(curl -fsS --connect-timeout 5 --max-time 20 "$url" 2>/dev/null || true)"
  [[ "$body" == *"<!-- studio-php -->"* && "$body" == *"Best tattoo artists"* && "$body" == *"home-artists"* ]]
}

preview_ok() {
  local url="$1"
  local i
  [[ -n "$url" ]] || return 1
  for i in 1 2 3; do
    if body_is_php "$url"; then
      return 0
    fi
    sleep 1
  done
  return 1
}

cloudflared_bin() {
  local existing asset
  if [[ -x /tmp/cloudflared ]]; then
    printf '%s' /tmp/cloudflared
    return
  fi
  if [[ -f /tmp/cloudflared ]]; then
    chmod +x /tmp/cloudflared
    printf '%s' /tmp/cloudflared
    return
  fi
  existing="$(command -v cloudflared 2>/dev/null || true)"
  if [[ -n "$existing" ]]; then
    printf '%s' "$existing"
    return
  fi
  case "$(uname -m)" in
    x86_64|amd64) asset="cloudflared-linux-amd64" ;;
    aarch64|arm64) asset="cloudflared-linux-arm64" ;;
    *)
      printf 'unsupported architecture: %s\n' "$(uname -m)" >&2
      exit 1
      ;;
  esac
  curl -fsSL -o /tmp/cloudflared "https://github.com/cloudflare/cloudflared/releases/latest/download/${asset}"
  chmod +x /tmp/cloudflared
  printf '%s' /tmp/cloudflared
}

tunnel_hostname() {
  tmux_cmd capture-pane -t "$TUNNEL_SESSION" -p -J -S -400 2>/dev/null \
    | grep -m1 -oE 'https://[A-Za-z0-9-]+\.trycloudflare\.com' || true
}

start_tunnel() {
  local bin host final code i
  bin="$(cloudflared_bin)"

  if tmux_cmd has-session -t "$TUNNEL_SESSION" 2>/dev/null; then
    tmux_cmd kill-session -t "$TUNNEL_SESSION"
  fi

  tmux_cmd new-session -d -s "$TUNNEL_SESSION" -- \
    "$bin" tunnel --url "http://127.0.0.1:${PORT}" --no-autoupdate

  for i in $(seq 1 90); do
    host="$(tunnel_hostname)"
    if [[ -n "$host" ]]; then
      final="${host}/en"
      if body_is_php "$final"; then
        mkdir -p "$(dirname "$PREVIEW_FILE")"
        printf '%s\n' "$final" > "$PREVIEW_FILE"
        printf '%s\n' "$final"
        return 0
      fi
    fi
    sleep 1
  done

  printf 'preview tunnel did not answer\n' >&2
  exit 1
}

ensure_dev_server

saved="$(preview_url)"
if preview_ok "$saved"; then
  printf '%s\n' "$saved"
  exit 0
fi

start_tunnel
