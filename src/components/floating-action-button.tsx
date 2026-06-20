"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { QuickTradeModal } from "@/components/quick-trade-modal";

export function FloatingActionButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold to-goldLight shadow-[0_8px_32px_rgba(217,180,94,0.35)] transition-all hover:scale-110 hover:shadow-[0_12px_48px_rgba(217,180,94,0.45)] active:scale-95"
        aria-label="Quick add trade"
      >
        <Plus size={28} className="text-slate-950" strokeWidth={2.5} />
      </button>

      <QuickTradeModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
