"use client";

import { useState } from "react";
import { Download } from "lucide-react";

type ExportButtonProps = {
  searchParams: URLSearchParams;
};

export function ExportButton({ searchParams }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleExport(format: "csv" | "xlsx") {
    setLoading(true);
    setOpen(false);

    try {
      const params = new URLSearchParams(searchParams);
      params.set("format", format);

      const response = await fetch(`/api/trades/export?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `trades-export-${new Date().toISOString().split("T")[0]}.${format === "csv" ? "csv" : "xlsx"}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export error:", error);
      alert("Export failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white transition hover:border-gold/30 hover:bg-white/[0.08] disabled:opacity-50"
      >
        <Download size={16} />
        {loading ? "Exporting..." : "Export"}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-2xl backdrop-blur-xl">
            <button
              onClick={() => handleExport("csv")}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              <Download size={14} />
              Export as CSV
            </button>
            <div className="border-t border-white/5" />
            <button
              onClick={() => handleExport("xlsx")}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              <Download size={14} />
              Export as Excel
            </button>
          </div>
        </>
      )}
    </div>
  );
}
