#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOST="${HOST:-127.0.0.1}"
START_PORT="${PORT:-8080}"
HTML_FILE="${HTML_FILE:-LinuxTestingWeb.html}"

find_free_port() {
	local port="$1"
	while ! python3 - "$HOST" "$port" <<'PY'
import socket
import sys

host = sys.argv[1]
port = int(sys.argv[2])
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    try:
        sock.bind((host, port))
    except OSError:
        sys.exit(1)
PY
	do
		port=$((port + 1))
	done
	printf '%s\n' "$port"
}

open_browser() {
	local url="$1"

	if [[ -n "${BROWSER_BIN:-}" ]]; then
		"$BROWSER_BIN" "$url" >/dev/null 2>&1 &
		return
	fi

	if command -v brave-browser >/dev/null 2>&1; then
		brave-browser "$url" >/dev/null 2>&1 &
	elif command -v brave >/dev/null 2>&1; then
		brave "$url" >/dev/null 2>&1 &
	elif command -v xdg-open >/dev/null 2>&1; then
		xdg-open "$url" >/dev/null 2>&1 &
	else
		printf 'Open this URL manually: %s\n' "$url"
	fi
}

PORT="$(find_free_port "$START_PORT")"
URL="http://$HOST:$PORT/$HTML_FILE?v=$(date +%s)"

printf 'Serving %s\n' "$SCRIPT_DIR"
printf 'Opening %s\n' "$URL"

python3 - "$HOST" "$PORT" "$SCRIPT_DIR" <<'PY' &
import functools
import http.server
import socketserver
import sys


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


class ReusableTcpServer(socketserver.TCPServer):
    allow_reuse_address = True


host = sys.argv[1]
port = int(sys.argv[2])
directory = sys.argv[3]
handler = functools.partial(NoCacheHandler, directory=directory)

with ReusableTcpServer((host, port), handler) as server:
    server.serve_forever()
PY
SERVER_PID="$!"

cleanup() {
	kill "$SERVER_PID" >/dev/null 2>&1 || true
}
trap cleanup EXIT INT TERM

sleep 0.5
open_browser "$URL"

wait "$SERVER_PID"
