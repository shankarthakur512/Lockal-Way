#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/lokalway/app}"
COMPOSE_ENV_FILE="${COMPOSE_ENV_FILE:-$APP_DIR/compose.env}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"
GIT_BRANCH="${GIT_BRANCH:-main}"
HEALTHCHECK_URL="${HEALTHCHECK_URL:-http://127.0.0.1/healthz}"
HOMEPAGE_URL="${HOMEPAGE_URL:-http://127.0.0.1/}"

cd "$APP_DIR"

git fetch origin "$GIT_BRANCH"
git checkout "$GIT_BRANCH"
git pull --ff-only origin "$GIT_BRANCH"

docker compose --env-file "$COMPOSE_ENV_FILE" -f "$COMPOSE_FILE" up -d --build --remove-orphans

curl --fail --silent --show-error "$HEALTHCHECK_URL" >/dev/null
curl --fail --silent --show-error "$HOMEPAGE_URL" >/dev/null

echo "Deployment completed successfully."
