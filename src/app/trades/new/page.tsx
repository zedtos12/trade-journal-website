import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { TradeForm } from "@/components/trade-form";
import { requireUser } from "@/lib/auth";

export default async function NewTradePage() {
  await requireUser();

  return (
    <AppShell>
      <Link href="/trades" className="text-sm text-slate-400 hover:text-white">← Back to history</Link>
      <div className="mt-6 max-w-4xl">
        <p className="text-gold">Manual input</p>
        <h1 className="mt-2 text-4xl font-semibold">Add Trade</h1>
        <p className="mt-2 text-slate-400">Form dibagi per section supaya tidak terasa seperti spreadsheet panjang.</p>
      </div>
      <div className="mt-8 max-w-5xl"><TradeForm mode="create" /></div>
    </AppShell>
  );
}
