"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

type Playbook = { id: string; name: string; color: string };

function parsePlaybookId(raw: string | null): string | undefined {
  return raw && raw !== "all" ? raw : undefined;
}

export function PlaybookSwitcher() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const activeId = searchParams.get("playbookId") || "all";

  useEffect(() => {
    setMounted(true);
    fetchPlaybooks();
  }, []);

  function fetchPlaybooks() {
    fetch("/api/playbooks")
      .then((r) => r.json())
      .then((d) => setPlaybooks(d.playbooks || []))
      .catch(() => {});
  }

  useEffect(() => {
    function handler() {
      fetchPlaybooks();
    }
    window.addEventListener("playbooks-changed", handler);
    return () => window.removeEventListener("playbooks-changed", handler);
  }, []);

  function selectPlaybook(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (id === "all") {
      params.delete("playbookId");
    } else {
      params.set("playbookId", id);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
    setOpen(false);
  }

  const active = playbooks.find((p) => p.id === activeId);

  if (!mounted) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm transition hover:border-gold/30"
      >
        {active && (
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: active.color }} />
        )}
        <span className="text-white">{active ? active.name : "All Journals"}</span>
        <ChevronDown size={14} className="text-slate-400" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-2xl backdrop-blur-xl">
            <button
              onClick={() => selectPlaybook("all")}
              className={`flex w-full items-center gap-2 px-4 py-3 text-sm transition hover:bg-white/5 ${
                activeId === "all" ? "bg-white/10 text-gold" : "text-slate-300"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-slate-500" />
              All Journals
            </button>
            <div className="border-t border-white/5" />
            {playbooks.map((p) => (
              <button
                key={p.id}
                onClick={() => selectPlaybook(p.id)}
                className={`flex w-full items-center gap-2 px-4 py-3 text-sm transition hover:bg-white/5 ${
                  activeId === p.id ? "bg-white/10 text-gold" : "text-slate-300"
                }`}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
                {p.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
