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
    <button onClick={logout} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-rose-400/40 hover:text-rose-200">
      Logout
    </button>
  );
}
