# Trade Journal Website

Premium dark-mode Forex Trade Journal SaaS MVP based on Boni's PRD.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM
- Vitest

## Database

This project uses PostgreSQL via Prisma. SQLite has been removed.

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

For Boni's current VPS PostgreSQL container exposed on host port `15432`, use this shape:

```env
DATABASE_URL="postgresql://boni:YOUR_PASSWORD@localhost:15432/tradingjournal?schema=public"
```

If the Next.js app later runs inside the same Docker Compose network as PostgreSQL, use the service/container hostname instead:

```env
DATABASE_URL="postgresql://boni:YOUR_PASSWORD@postgres:5432/tradingjournal?schema=public"
```

Never commit `.env`.

## Setup

```bash
npm install
npm run db:generate
npm run db:migrate
npm run dev -- --hostname 0.0.0.0
```

Open:

```text
http://localhost:3000
```

If the app runs on a VPS and you preview from a laptop, use SSH tunneling:

```bash
ssh -L 3000:localhost:3000 ubuntu@YOUR_VPS_IP
```

Then open `http://localhost:3000` on the laptop.

## Scripts

```bash
npm test          # run unit tests
npm run lint      # run ESLint
npm run build     # production build
npm run db:generate
npm run db:migrate
npm run db:dev
```

## Current PRD Status

Done:

- Landing page
- Register/login/logout foundation
- PostgreSQL schema and initial migration
- Protected dashboard foundation
- Settings foundation
- Basic analytics calculation foundation

Next:

- Trade CRUD
- Trade history/search/filter
- Trade detail/review page
- Dashboard real metrics from trades
- Analytics page
