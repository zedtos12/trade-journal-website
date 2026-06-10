import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <main data-testid="auth-page-shell" className="bg-grid-luxury relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#172554_0%,#050816_42%,#030712_100%)] px-6 py-12 text-white">
      <div className="pointer-events-none absolute left-[-10rem] top-16 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[-10rem] bottom-16 h-96 w-96 rounded-full bg-blue-500/15 blur-3xl" />
      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="mb-8 inline-flex text-sm text-slate-400 transition hover:text-white">← Back to landing</Link>
        <p className="text-sm uppercase tracking-[0.3em] text-gold">Login</p>
        <h1 className="animate-fade-up mt-3 text-4xl font-semibold tracking-tight">Welcome back, trader.</h1>
        <p className="mt-3 text-slate-400">Masuk untuk lanjut review performa trading kamu.</p>
        <div className="mt-8"><AuthForm mode="login" /></div>
      </div>
    </main>
  );
}
