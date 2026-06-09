import Link from "next/link";
import { BarChart3, BookOpenCheck, Brain, LineChart, ShieldCheck, Sparkles } from "lucide-react";

const features = [
  { icon: BookOpenCheck, title: "Manual trade journal", text: "Catat pair, setup, timeframe, result, emosi, dan lesson learned tanpa spreadsheet ribet." },
  { icon: BarChart3, title: "Performance dashboard", text: "Lihat win rate, total P/L, average win/loss, profit factor, dan average R:R." },
  { icon: LineChart, title: "Pair & setup analytics", text: "Pahami pair, setup, timeframe, dan session mana yang paling cocok buat kamu." },
  { icon: Brain, title: "Psychology notes", text: "Bangun disiplin dengan review emosi sebelum/sesudah trade." },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#172554_0%,#050816_42%,#030712_100%)] text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold text-slate-950">TJ</span>
          Trade Journal
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/login" className="text-slate-300 hover:text-white">Login</Link>
          <Link href="/register" className="rounded-full bg-white px-4 py-2 font-medium text-slate-950 hover:bg-goldLight">Create Account</Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-24 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm text-goldLight">
            <Sparkles size={16} /> Built for disciplined forex traders
          </div>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white md:text-7xl">
            A premium forex trade journal built for disciplined traders.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Track every trade, review your performance, and understand what actually works.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/register" className="rounded-full bg-gold px-6 py-3 text-center font-semibold text-slate-950 shadow-lg shadow-gold/20 transition hover:bg-goldLight">
              Start Journaling
            </Link>
            <Link href="/login" className="rounded-full border border-white/15 px-6 py-3 text-center font-semibold text-white transition hover:border-gold/50 hover:bg-white/5">
              Login
            </Link>
          </div>
        </div>

        <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/40 backdrop-blur">
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-sm text-slate-400">Dashboard preview</p>
                <h2 className="text-xl font-semibold">Trading Performance</h2>
              </div>
              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300">+12.4% MoM</span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {["Win Rate 58%", "Total P/L $2,430", "Profit Factor 1.84", "Avg R:R 1.7"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">{item}</div>
              ))}
            </div>
            <div className="mt-5 h-40 rounded-2xl border border-white/10 bg-gradient-to-t from-gold/20 to-transparent p-4">
              <div className="flex h-full items-end gap-2">
                {[22, 38, 28, 48, 42, 68, 60, 82, 76, 92].map((height, index) => (
                  <div key={index} className="flex-1 rounded-t-lg bg-gold/80" style={{ height: `${height}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-4 md:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <feature.icon className="text-gold" />
              <h3 className="mt-5 font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24 text-center">
        <ShieldCheck className="mx-auto text-gold" size={36} />
        <h2 className="mt-5 text-3xl font-semibold">Why journal trades?</h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-300">
          Trader yang disiplin tidak cuma cari entry. Mereka mengukur setup, review kesalahan, dan membuat keputusan berdasarkan data pribadi.
        </p>
        <Link href="/register" className="mt-8 inline-flex rounded-full bg-gold px-6 py-3 font-semibold text-slate-950 hover:bg-goldLight">
          Create Account
        </Link>
      </section>
    </main>
  );
}
