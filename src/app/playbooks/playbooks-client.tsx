"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

type Playbook = {
  id: string;
  name: string;
  description: string | null;
  color: string;
};

export function PlaybooksClient({ initialPlaybooks }: { initialPlaybooks: Playbook[] }) {
  const [playbooks, setPlaybooks] = useState(initialPlaybooks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlaybook, setEditingPlaybook] = useState<Playbook | null>(null);
  const [loading, setLoading] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#D9B45E");

  function openCreate() {
    setEditingPlaybook(null);
    setName("");
    setDescription("");
    setColor("#D9B45E");
    setIsModalOpen(true);
  }

  function openEdit(p: Playbook) {
    setEditingPlaybook(p);
    setName(p.name);
    setDescription(p.description || "");
    setColor(p.color);
    setIsModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const url = editingPlaybook ? `/api/playbooks/${editingPlaybook.id}` : "/api/playbooks";
    const method = editingPlaybook ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        body: JSON.stringify({ name, description, color }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        if (editingPlaybook) {
          setPlaybooks(playbooks.map((p) => (p.id === editingPlaybook.id ? data.playbook : p)));
        } else {
          setPlaybooks([data.playbook, ...playbooks]);
        }
        setIsModalOpen(false);
        window.dispatchEvent(new Event("playbooks-changed"));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure? Trades in this playbook will be moved to General Journal.")) return;

    try {
      const res = await fetch(`/api/playbooks/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPlaybooks(playbooks.filter((p) => p.id !== id));
        window.dispatchEvent(new Event("playbooks-changed"));
      } else {
        const data = await res.json().catch(() => null);
        alert(data?.message || "Failed to delete playbook.");
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={openCreate}
          className="premium-button flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 font-semibold text-slate-950 transition hover:bg-goldLight"
        >
          <Plus size={18} />
          Create Playbook
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {playbooks.map((p) => (
          <div
            key={p.id}
            className="premium-card group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/40 p-6 transition hover:border-gold/30"
          >
            <div
              className="absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-10 blur-2xl transition group-hover:opacity-20"
              style={{ backgroundColor: p.color }}
            />
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{ backgroundColor: p.color }} />
                <h3 className="text-xl font-bold text-white">{p.name}</h3>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white transition">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(p.id)} className="rounded-lg p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <p className="mt-3 text-sm text-slate-400 line-clamp-2 min-h-[2.5rem]">
              {p.description || "No description provided."}
            </p>

            <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Active Session</span>
              <Link href={`/trades?playbookId=${p.id}`} className="text-xs font-semibold text-gold hover:underline">
                View Trades →
              </Link>
            </div>
          </div>
        ))}

        {playbooks.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-white/10 py-20 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/5 text-slate-500">
              <Plus size={32} />
            </div>
            <h3 className="mt-4 text-lg font-medium text-white">No playbooks yet</h3>
            <p className="mt-1 text-slate-500">Create your first playbook to start organizing your trades.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/40 animate-fade-in">
          <div className="premium-card w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 shadow-2xl border border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {editingPlaybook ? "Edit Playbook" : "New Playbook"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="rounded-full p-2 text-slate-400 hover:bg-white/5">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-goldLight">Name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Scalping Gold"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-gold/50 transition"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-goldLight">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Strategy details, account info..."
                  rows={3}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-gold/50 transition resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-goldLight">Accent Color</label>
                <div className="mt-3 flex flex-wrap gap-3">
                  {["#D9B45E", "#34D399", "#60A5FA", "#F87171", "#A78BFA", "#F472B6"].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`h-10 w-10 rounded-xl transition-all ${color === c ? "ring-2 ring-white ring-offset-4 ring-offset-slate-950 scale-110" : "opacity-60 hover:opacity-100"}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-2xl border border-white/10 py-3 font-semibold text-white hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  disabled={loading}
                  type="submit"
                  className="premium-button flex-1 rounded-2xl bg-gold py-3 font-semibold text-slate-950 hover:bg-goldLight disabled:opacity-50 transition"
                >
                  {loading ? "Saving..." : editingPlaybook ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
