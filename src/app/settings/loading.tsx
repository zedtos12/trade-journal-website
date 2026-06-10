import { AppShell } from "@/components/app-shell";

export default function SettingsLoading() {
  return (
    <AppShell>
      <div className="animate-fade-up">
        <div className="animate-shimmer h-5 w-32 rounded" />
        <div className="animate-shimmer mt-4 h-10 w-72 rounded" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="premium-card h-80 rounded-3xl p-6">
            <div className="animate-shimmer h-4 w-24 rounded" />
            <div className="animate-shimmer mt-4 h-8 w-48 rounded" />
            <div className="mt-8 space-y-4">
              {Array.from({ length: 3 }).map((_, index) => <div key={index} className="animate-shimmer h-12 rounded-2xl" />)}
            </div>
          </div>
          <div className="premium-card h-80 rounded-3xl p-6">
            <div className="animate-shimmer h-4 w-24 rounded" />
            <div className="animate-shimmer mt-4 h-8 w-48 rounded" />
            <div className="mt-8 space-y-4">
              {Array.from({ length: 3 }).map((_, index) => <div key={index} className="animate-shimmer h-12 rounded-2xl" />)}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
