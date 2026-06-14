import Image from "next/image";
import Link from "next/link";
import { BarChart3, BookOpenCheck, Brain, LineChart, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

const features = [
  { icon: BookOpenCheck, title: "Manual trade journal", text: "Catat pair, setup, timeframe, result, emosi, dan lesson learned tanpa spreadsheet ribet." },
  { icon: BarChart3, title: "Performance dashboard", text: "Lihat win rate, total P/L, average win/loss, profit factor, dan average R:R." },
  { icon: LineChart, title: "Pair & setup analytics", text: "Pahami pair, setup, timeframe, dan session mana yang paling cocok buat kamu." },
  { icon: Brain, title: "Psychology notes", text: "Bangun disiplin dengan review emosi sebelum/sesudah trade." },
];

const previewMetrics = ["Win Rate 58%", "Total P/L $2,430", "Profit Factor 1.84", "Avg R:R 1.7"];
const previewBars = [22, 38, 28, 48, 42, 68, 60, 82, 76, 92];

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function LandingPage() {
  return (
    <main className="bg-grid-luxury relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#172554_0%,#050816_42%,#030712_100%)] text-white">
      <div className="pointer-events-none absolute left-[-8rem] top-24 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[-10rem] top-10 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />

      <nav className="animate-fade-in relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="group flex items-center gap-3 font-semibold tracking-tight">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} className="h-10 w-10 transition duration-200 group-hover:scale-105" />
          <span className="text-sm uppercase tracking-[0.28em] text-slate-200">Trade Journal</span>
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/login" className="rounded-full px-3 py-2 text-slate-300 transition hover:bg-white/5 hover:text-white">Login</Link>
          <Link href="/register" className="premium-button rounded-full bg-white px-4 py-2 font-medium text-slate-950 hover:bg-goldLight">Create Account</Link>
        </div>
      </nav>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 pb-24 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <div className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm text-goldLight">
            <Sparkles size={16} /> Built for disciplined forex traders
          </div>
          <h1 className="animate-fade-up max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-white md:text-7xl" style={{ animationDelay: "90ms" }}>
            A premium forex trade journal built for disciplined traders.
          </h1>
          <p className="animate-fade-up mt-6 max-w-2xl text-lg leading-8 text-slate-300" style={{ animationDelay: "180ms" }}>
            Track every trade, review your performance, and understand what actually works.
          </p>
          <div className="animate-fade-up mt-9 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "270ms" }}>
            <Link href="/register" className="premium-button rounded-full bg-gold px-6 py-3 text-center font-semibold text-slate-950 shadow-lg shadow-gold/20 hover:bg-goldLight">
              Start Journaling
            </Link>
            <Link href="/login" className="premium-button rounded-full border border-white/15 px-6 py-3 text-center font-semibold text-white hover:border-gold/50 hover:bg-white/5">
              Login
            </Link>
          </div>

          <div className="animate-fade-up mt-10 grid max-w-xl grid-cols-3 gap-3 text-sm text-slate-300" style={{ animationDelay: "360ms" }}>
            {[
              ["Private", "per-user data"],
              ["Manual", "trade logging"],
              ["Analytics", "performance clarity"],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur">
                <p className="font-semibold text-white">{title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-fade-up relative" style={{ animationDelay: "220ms" }}>
          <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-gold/20 via-blue-500/10 to-emerald-400/10 blur-2xl" />
          <div data-testid="dashboard-preview" className="premium-card interactive-card animate-float-slow relative rounded-[2rem] p-4">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/85 p-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm text-slate-400">Dashboard preview</p>
                  <h2 className="mt-1 text-xl font-semibold">Trading Performance</h2>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300">
                  <TrendingUp size={14} /> +12.4% MoM
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {previewMetrics.map((item, index) => (
                  <div
                    key={item}
                    className="animate-scale-in rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300 transition hover:border-gold/30 hover:bg-white/[0.07]"
                    style={{ animationDelay: `${360 + index * 80}ms` }}
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-5 h-40 rounded-2xl border border-white/10 bg-gradient-to-t from-gold/20 to-transparent p-4">
                <div className="flex h-full items-end gap-2">
                  {previewBars.map((height, index) => (
                    <div
                      key={index}
                      className="rounded-t-lg bg-gradient-to-t from-gold to-goldLight shadow-lg shadow-gold/10 transition duration-300 hover:brightness-125"
                      style={{ height: `${height}%`, flex: 1, animationDelay: `${420 + index * 45}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-4 md:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              data-testid={`feature-card-${slugify(feature.title)}`}
              className="premium-card interactive-card animate-fade-up rounded-3xl p-6"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <feature.icon className="text-gold" />
              <h3 className="mt-5 font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-24 text-center">
        <div className="premium-card rounded-[2rem] px-6 py-12">
          <ShieldCheck className="mx-auto text-gold" size={36} />
          <h2 className="mt-5 text-3xl font-semibold tracking-tight">Why journal trades?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Trader yang disiplin tidak cuma cari entry. Mereka mengukur setup, review kesalahan, dan membuat keputusan berdasarkan data pribadi.
          </p>
          <Link href="/register" className="premium-button mt-8 inline-flex rounded-full bg-gold px-6 py-3 font-semibold text-slate-950 hover:bg-goldLight">
            Create Account
          </Link>
        </div>
      </section>
    </main>
  );
}
