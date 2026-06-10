"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type AuthFormProps = {
  mode: "login" | "register";
};

const inputClass = "mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-gold/50 focus:ring-2 focus:ring-gold/40";

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.message ?? "Request gagal");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  const isRegister = mode === "register";

  return (
    <form data-testid="auth-form-card" action={onSubmit} className="premium-card animate-fade-up space-y-4 rounded-3xl p-6">
      {isRegister && (
        <label className="block text-sm text-slate-300">
          Name
          <input name="name" required className={inputClass} placeholder="Boni Trader" />
        </label>
      )}
      <label className="block text-sm text-slate-300">
        Email / username
        <input name="email" type="text" required className={inputClass} placeholder="admin atau you@example.com" />
      </label>
      <label className="block text-sm text-slate-300">
        Password
        <input name="password" type="password" required minLength={8} className={inputClass} placeholder="Minimal 8 karakter" />
      </label>
      {isRegister && (
        <label className="block text-sm text-slate-300">
          Confirm password
          <input name="confirmPassword" type="password" required minLength={8} className={inputClass} placeholder="Ulangi password" />
        </label>
      )}
      {error && <p className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p>}
      <button disabled={loading} className="premium-button w-full rounded-2xl bg-gold px-5 py-3 font-semibold text-slate-950 transition hover:bg-goldLight disabled:opacity-60">
        {loading ? "Processing..." : isRegister ? "Create Account" : "Login"}
      </button>
      <p className="text-center text-sm text-slate-400">
        {isRegister ? "Sudah punya akun? " : "Belum punya akun? "}
        <Link className="text-gold transition hover:text-goldLight" href={isRegister ? "/login" : "/register"}>
          {isRegister ? "Login" : "Register"}
        </Link>
      </p>
    </form>
  );
}
