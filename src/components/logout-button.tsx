"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button data-testid="navbar-logout" onClick={logout} className="min-h-11 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300 transition hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400/30">
      Logout
    </button>
  );
}
