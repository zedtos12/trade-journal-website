import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { TradeForm } from "@/components/trade-form";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { serializeTrade } from "@/lib/trades/serialize";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditTradePage({ params }: PageProps) {
  const user = await requireUser();
  const { id } = await params;
  const trade = await prisma.trade.findFirst({ where: { id, userId: user.id } });
  if (!trade) notFound();

  return (
    <AppShell>
      <Link href={`/trades/${id}`} className="text-sm text-slate-400 hover:text-white">← Back to detail</Link>
      <div className="mt-6 max-w-4xl">
        <p className="text-gold">Edit trade</p>
        <h1 className="mt-2 text-4xl font-semibold">Update {trade.pair}</h1>
        <p className="mt-2 text-slate-400">Update manual trade journal sesuai data review terbaru.</p>
      </div>
      <div className="mt-8 max-w-5xl"><TradeForm mode="edit" trade={serializeTrade(trade)} /></div>
    </AppShell>
  );
}
