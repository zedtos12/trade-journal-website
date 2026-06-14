import Image from "next/image";
import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function RegisterPage() {
  return (
    <main data-testid="auth-page-shell" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030712] px-6 py-12 text-white">
      {/* Background glows */}
      <div className="pointer-events-none absolute left-[-8rem] top-20 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />
      <div className="pointer-events-none absolute right-[-8rem] bottom-20 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Back link */}
        <Link href="/" className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 transition hover:border-gold/35 hover:text-white">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true"><path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H6.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L6.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" /></svg>
          Back to landing
        </Link>

        {/* Brand mark */}
        <div className="mb-8 flex items-center gap-3">
          <Image src="/logo.svg" alt="Logo" width={44} height={44} className="h-11 w-11 shadow-lg shadow-gold/30" />
          <div>
            <span className="block text-sm font-semibold text-white">Trade Journal</span>
            <span className="block text-[11px] uppercase tracking-[0.22em] text-gold/70">Performance OS</span>
          </div>
        </div>

        {/* Hero text */}
        <p className="inline-flex rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-goldLight">Create Account</p>
        <h1 className="animate-fade-up mt-4 text-4xl font-semibold tracking-tight">Start journaling your trades.</h1>
        <p className="mt-3 text-slate-400">Data trade kamu private dan terpisah per user. Gratis, aman, no tracking.</p>

        {/* Auth form directly */}
        <div className="mt-8">
          <AuthForm mode="register" />
        </div>
      </div>
    </main>
  );
}
