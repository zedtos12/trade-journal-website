#!/usr/bin/env bash
# Automated safe deploy script for Trade Journal Website
# Run this on the VPS host inside the project root folder.

set -euo pipefail

echo "========================================="
echo "🚀 Starting deployment..."
echo "========================================="

# 1. Pull latest code
echo "📥 Pulling latest code..."
git pull

# 2. Run database migration if schema changes
echo "🗄️ Running database migrations..."
docker compose -f docker-compose.prod.example.yml --profile migrate run --rm --build trade-journal-migrate

# 3. Build & restart container
echo "🏗️ Building and restarting container..."
docker compose -f docker-compose.prod.example.yml up -d --build trade-journal-web

# 4. Verify health check
echo "🩺 Verifying container health..."
max_attempts=10
attempt=1
health_url="http://127.0.0.1:3000/api/health"

sleep 3

while [ "$attempt" -le "$max_attempts" ]; do
  echo "Checking health (attempt $attempt/$max_attempts)..."
  if curl -sSf "$health_url" | grep -q '"status":"ok"'; then
    echo "✅ Deploy successful! App is healthy."
    exit 0
  fi
  attempt=$((attempt + 1))
  sleep 3
done

echo "❌ Deploy failed! Container is not responding with status: ok."
echo "Logs from container:"
docker compose -f docker-compose.prod.example.yml logs --tail=50 trade-journal-web
exit 1
