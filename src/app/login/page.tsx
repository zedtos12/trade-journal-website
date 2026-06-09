import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#172554_0%,#050816_42%,#030712_100%)] px-6 py-12 text-white">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 inline-flex text-sm text-slate-400 hover:text-white">← Back to landing</Link>
        <p className="text-sm uppercase tracking-[0.3em] text-gold">Login</p>
        <h1 className="mt-3 text-4xl font-semibold">Welcome back, trader.</h1>
        <p className="mt-3 text-slate-400">Masuk untuk lanjut review performa trading kamu.</p>
        <div className="mt-8"><AuthForm mode="login" /></div>
      </div>
    </main>
  );
}
