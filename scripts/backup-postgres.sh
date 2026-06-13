#!/usr/bin/env bash
set -euo pipefail

# PostgreSQL backup helper for the VPS host.
# Fill these values via environment variables or a root-owned env file; do not commit secrets.
: "${PGHOST:=127.0.0.1}"
: "${PGPORT:=15432}"
: "${PGDATABASE:=tradingjournal}"
: "${PGUSER:?Set PGUSER}"
: "${PGPASSWORD:?Set PGPASSWORD}"
: "${BACKUP_DIR:=/var/backups/trade-journal}"

mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"

stamp="$(date -u +%Y%m%dT%H%M%SZ)"
file="$BACKUP_DIR/${PGDATABASE}-${stamp}.dump"

export PGPASSWORD
pg_dump \
  --host "$PGHOST" \
  --port "$PGPORT" \
  --username "$PGUSER" \
  --format custom \
  --no-owner \
  --no-privileges \
  --file "$file" \
  "$PGDATABASE"

chmod 600 "$file"
find "$BACKUP_DIR" -type f -name "${PGDATABASE}-*.dump" -mtime +14 -delete

echo "Backup written: $file"
