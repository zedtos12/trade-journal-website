"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteTradeButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function deleteTrade() {
    if (!confirm("Delete trade ini?")) return;
    setLoading(true);
    await fetch(`/api/trades/${id}`, { method: "DELETE" });
    router.push("/trades");
    router.refresh();
  }

  return (
    <button onClick={deleteTrade} disabled={loading} className="rounded-full border border-rose-400/30 px-4 py-2 text-sm text-rose-200 hover:bg-rose-500/10 disabled:opacity-60">
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
