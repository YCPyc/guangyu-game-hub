#!/usr/bin/env bash
# Build the site and deploy it to the server, where Caddy serves it as static files.
# Usage: ./deploy.sh root@<服务器IP>
set -euo pipefail

HOST="${1:?用法: ./deploy.sh root@<服务器IP>}"
DIR=/opt/jiaoxue-ai
cd "$(dirname "$0")"

echo "==> 构建"
npm run build

echo "==> 上传"
ssh "$HOST" "mkdir -p $DIR/site"
rsync -az docker-compose.yml Caddyfile "$HOST:$DIR/"
rsync -az --delete dist/ "$HOST:$DIR/site/"

echo "==> 启动"
ssh "$HOST" "cd $DIR && touch .env && docker compose up -d --remove-orphans && docker compose restart caddy >/dev/null && docker compose ps"
