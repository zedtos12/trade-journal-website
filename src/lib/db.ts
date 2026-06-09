import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

const dbPath = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "trade_journal.sqlite");
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const globalForDb = globalThis as unknown as { db?: Database.Database };

export const db = globalForDb.db ?? new Database(dbPath);
if (process.env.NODE_ENV !== "production") globalForDb.db = db;

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

export function migrate() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      preferred_currency TEXT NOT NULL DEFAULT 'USD',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS trades (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      pair TEXT NOT NULL,
      direction TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'closed',
      result TEXT NOT NULL,
      open_date TEXT NOT NULL,
      close_date TEXT,
      entry_price REAL,
      exit_price REAL,
      lot_size REAL,
      stop_loss REAL,
      take_profit REAL,
      profit_loss_amount REAL,
      profit_loss_percentage REAL,
      risk_reward_ratio REAL,
      setup_name TEXT,
      timeframe TEXT,
      session TEXT,
      emotion_before TEXT,
      emotion_after TEXT,
      entry_reason TEXT,
      exit_reason TEXT,
      lesson_learned TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);
    CREATE INDEX IF NOT EXISTS idx_trades_user_open_date ON trades(user_id, open_date);
  `);
}

migrate();
