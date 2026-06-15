-- CreateTable
CREATE TABLE "playbooks" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL DEFAULT '#D9B45E',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "playbooks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "playbooks_user_id_idx" ON "playbooks"("user_id");

-- AlterTable
ALTER TABLE "trades" ADD COLUMN "playbook_id" TEXT;

-- CreateIndex
CREATE INDEX "trades_user_id_playbook_id_idx" ON "trades"("user_id", "playbook_id");

-- AddForeignKey
ALTER TABLE "playbooks" ADD CONSTRAINT "playbooks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trades" ADD CONSTRAINT "trades_playbook_id_fkey" FOREIGN KEY ("playbook_id") REFERENCES "playbooks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
