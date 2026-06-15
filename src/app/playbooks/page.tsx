import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PlaybooksClient } from "./playbooks-client";

export default async function PlaybooksPage() {
  const user = await requireUser();
  const playbooks = await prisma.playbook.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AppShell>
      <div data-testid="playbooks-page-header" className="premium-card animate-fade-up relative overflow-hidden rounded-[2rem] p-6 md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(244,213,141,0.12),transparent_50%)]" />
        <p className="text-gold">Journals</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Playbooks & Sessions</h1>
        <p className="mt-2 max-w-xl text-slate-400">
          Organize your trades into isolated playbooks. Create different sessions for scalping, swing trading, or specific prop firm accounts.
        </p>
      </div>

      <div className="mt-8">
        <PlaybooksClient initialPlaybooks={playbooks} />
      </div>
    </AppShell>
  );
}
