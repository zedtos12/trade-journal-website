import { AppShell } from "@/components/app-shell";

export default function TradesLoading() {
  return (
    <AppShell>
      <div className="animate-fade-up">
        <div className="animate-shimmer h-5 w-32 rounded" />
        <div className="animate-shimmer mt-4 h-10 w-64 rounded" />
        <div className="premium-card mt-8 grid gap-3 rounded-3xl p-4 md:grid-cols-6">
          {Array.from({ length: 8 }).map((_, index) => <div key={index} className="animate-shimmer h-12 rounded-2xl" />)}
        </div>
        <div className="premium-card mt-8 space-y-3 rounded-3xl p-5">
          {Array.from({ length: 5 }).map((_, index) => <div key={index} className="animate-shimmer h-14 rounded-2xl" />)}
        </div>
      </div>
    </AppShell>
  );
}
