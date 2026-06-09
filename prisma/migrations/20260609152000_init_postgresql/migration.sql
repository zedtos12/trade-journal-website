-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'IDR');

-- CreateEnum
CREATE TYPE "TradeDirection" AS ENUM ('buy', 'sell');

-- CreateEnum
CREATE TYPE "TradeStatus" AS ENUM ('open', 'closed');

-- CreateEnum
CREATE TYPE "TradeResult" AS ENUM ('win', 'loss', 'breakeven', 'open');

-- CreateEnum
CREATE TYPE "Timeframe" AS ENUM ('M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1');

-- CreateEnum
CREATE TYPE "TradingSession" AS ENUM ('Asia', 'London', 'NewYork');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "preferred_currency" "Currency" NOT NULL DEFAULT 'USD',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trades" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "pair" TEXT NOT NULL,
    "direction" "TradeDirection" NOT NULL,
    "status" "TradeStatus" NOT NULL DEFAULT 'closed',
    "result" "TradeResult" NOT NULL,
    "open_date" TIMESTAMP(3) NOT NULL,
    "close_date" TIMESTAMP(3),
    "entry_price" DECIMAL(18,8),
    "exit_price" DECIMAL(18,8),
    "lot_size" DECIMAL(18,4),
    "stop_loss" DECIMAL(18,8),
    "take_profit" DECIMAL(18,8),
    "profit_loss_amount" DECIMAL(18,2),
    "profit_loss_percentage" DECIMAL(10,4),
    "risk_reward_ratio" DECIMAL(10,4),
    "setup_name" TEXT,
    "timeframe" "Timeframe",
    "session" "TradingSession",
    "emotion_before" TEXT,
    "emotion_after" TEXT,
    "entry_reason" TEXT,
    "exit_reason" TEXT,
    "lesson_learned" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trades_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "trades_user_id_idx" ON "trades"("user_id");

-- CreateIndex
CREATE INDEX "trades_user_id_open_date_idx" ON "trades"("user_id", "open_date");

-- CreateIndex
CREATE INDEX "trades_user_id_pair_idx" ON "trades"("user_id", "pair");

-- CreateIndex
CREATE INDEX "trades_user_id_result_idx" ON "trades"("user_id", "result");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trades" ADD CONSTRAINT "trades_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

