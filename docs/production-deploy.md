# Production deploy guide

Target architecture for Boni's VPS:

- Hermes remains in its own Docker container.
- Trade Journal Website runs in a separate Docker container.
- PostgreSQL stays in its separate database container/setup.
- Public traffic goes through HTTPS reverse proxy (Nginx/Caddy) to `127.0.0.1:3000`.
- Secrets live only on the VPS host in `.env.production`; never in Git.

## 1. Prepare repo on VPS host

```bash
git clone https://github.com/zedtos12/trade-journal-website.git
cd trade-journal-website
cp .env.production.example .env.production
chmod 600 .env.production
```

Edit `.env.production` on the VPS host only.

For Boni's existing PostgreSQL container exposed on host port `15432`, use this shape inside `.env.production`:

```env
DATABASE_URL="postgresql://USER:REAL_PASSWORD@host.docker.internal:15432/tradingjournal?schema=public"
NODE_ENV="production"
```

Do not paste the real password into chat, README, screenshots, or GitHub.

## 2. Verify locally on VPS before container deploy

```bash
npm ci
npm run test
npm run lint
npm run build
```

## 3. Run migrations in a one-off Docker container

```bash
docker compose -f docker-compose.prod.example.yml --profile migrate run --rm trade-journal-migrate
```

Do not run `npm run db:seed` in production. If a dummy admin user exists in production, delete it or rotate its password.

## 4. Start production app container

```bash
docker compose -f docker-compose.prod.example.yml up -d --build trade-journal-web
```

Check health:

```bash
curl -fsS http://127.0.0.1:3000/api/health
```

Expected:

```json
{"status":"ok"}
```

## 5. Reverse proxy

Expose only 80/443 publicly. Keep app bound to `127.0.0.1:3000`.

### Caddy example

```caddyfile
tradejournal.example.com {
  encode zstd gzip
  reverse_proxy 127.0.0.1:3000
}
```

### Nginx example

```nginx
server {
  listen 80;
  server_name tradejournal.example.com;
  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl http2;
  server_name tradejournal.example.com;

  ssl_certificate /etc/letsencrypt/live/tradejournal.example.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/tradejournal.example.com/privkey.pem;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Security headers are also configured in `next.config.ts`; keep HTTPS enabled so secure cookies and HSTS work.

## 6. Firewall checklist

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

Do not expose:

- app port `3000` publicly
- PostgreSQL port `15432` publicly

## 7. Backup PostgreSQL

Run backup from VPS host or a trusted admin environment with `pg_dump` installed:

```bash
export PGHOST=127.0.0.1
export PGPORT=15432
export PGDATABASE=tradingjournal
export PGUSER='YOUR_DB_USER'
export PGPASSWORD='YOUR_DB_PASSWORD'
export BACKUP_DIR=/var/backups/trade-journal
./scripts/backup-postgres.sh
```

Recommended cron example:

```cron
15 2 * * * cd /path/to/trade-journal-website && /usr/bin/env bash scripts/backup-postgres.sh >> /var/log/trade-journal-backup.log 2>&1
```

Test restore before relying on backups.

## 8. Secret leak checks before production

```bash
git grep -n "postgresql://" -- ':!*.example' ':!docs/*'
git grep -n "DATABASE_URL" -- ':!*.example' ':!docs/*'
git grep -n "PASSWORD\|SECRET\|TOKEN\|PRIVATE_KEY" -- ':!*.example' ':!docs/*'
```

Optional stronger scan:

```bash
gitleaks detect --source . --redact
```

## 9. Deploy updates

```bash
git pull
npm ci
npm run test
npm run lint
npm run build
docker compose -f docker-compose.prod.example.yml --profile migrate run --rm trade-journal-migrate
docker compose -f docker-compose.prod.example.yml up -d --build trade-journal-web
curl -fsS http://127.0.0.1:3000/api/health
```
