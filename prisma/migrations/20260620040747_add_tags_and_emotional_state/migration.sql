-- CreateEnum
CREATE TYPE "EmotionalState" AS ENUM ('confident', 'neutral', 'anxious', 'fomo', 'revenge', 'disciplined', 'impulsive');

-- AlterTable
ALTER TABLE "trades" ADD COLUMN "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "emotional_state" "EmotionalState";
