import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { calculateGoalProgress, formatPeriod } from "@/lib/goals/progress";
import { CreateGoalForm } from "@/components/create-goal-form";

export default async function GoalsPage() {
  const user = await requireUser();

  const allGoals = await prisma.goal.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const allTrades = await prisma.trade.findMany({
    where: { userId: user.id },
    orderBy: { openDate: "desc" },
  });

  const goalsWithProgress = allGoals.map((goal) => {
    const goalTrades = allTrades.filter((t) => {
      const tradeDate = new Date(t.openDate);
      return tradeDate >= goal.startDate && tradeDate <= goal.endDate;
    });
    const currentAmount = goalTrades.reduce((sum, t) => sum + (t.profitLossAmount?.toNumber() ?? 0), 0);
    return calculateGoalProgress(goal, currentAmount);
  });

  const activeGoals = goalsWithProgress.filter((g) => g.status === "active");
  const completedGoals = goalsWithProgress.filter((g) => g.status === "completed" || g.isCompleted);
  const failedGoals = goalsWithProgress.filter((g) => g.status === "failed" || g.isFailed);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Goals & Targets</h1>
          <p className="mt-2 text-slate-400">Track your profit targets and milestones</p>
        </div>

        {/* Create Goal Section */}
        <section className="premium-card animate-fade-up rounded-3xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-5">Create New Goal</h2>
          <CreateGoalForm />
        </section>

        {/* Active Goals */}
        {activeGoals.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Active Goals ({activeGoals.length})</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {activeGoals.map((goal) => {
                const statusColor = goal.isCompleted 
                  ? "border-emerald-500/30 bg-emerald-500/5" 
                  : goal.isFailed 
                  ? "border-rose-500/30 bg-rose-500/5" 
                  : goal.isOnTrack 
                  ? "border-gold/30 bg-gold/5" 
                  : "border-orange-500/30 bg-orange-500/5";
                const statusLabel = goal.isCompleted 
                  ? "✓ Achieved" 
                  : goal.isFailed 
                  ? "✗ Failed" 
                  : goal.isOnTrack 
                  ? "→ On Track" 
                  : "⚠ Behind";
                const statusTextColor = goal.isCompleted 
                  ? "text-emerald-300" 
                  : goal.isFailed 
                  ? "text-rose-300" 
                  : goal.isOnTrack 
                  ? "text-gold" 
                  : "text-orange-300";

                return (
                  <div key={goal.id} className={`rounded-xl border p-6 ${statusColor}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{goal.name}</h3>
                        <p className="text-sm text-slate-400 mt-1">
                          {formatPeriod(goal.period)} · {new Date(goal.startDate).toLocaleDateString()} - {new Date(goal.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`text-sm font-semibold ${statusTextColor}`}>{statusLabel}</span>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-slate-300">
                          {goal.currentAmount >= 0 ? "+" : ""}{goal.currentAmount.toFixed(2)} / {parseFloat(goal.targetAmount.toString()).toFixed(2)}
                        </span>
                        <span className="font-semibold text-goldLight">{goal.progressPercentage}%</span>
                      </div>
                      <div className="h-3 rounded-full bg-slate-900 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            goal.isCompleted 
                              ? "bg-emerald-400" 
                              : goal.isOnTrack 
                              ? "bg-gradient-to-r from-gold to-goldLight" 
                              : "bg-gradient-to-r from-orange-400 to-rose-400"
                          }`}
                          style={{ width: `${Math.min(100, goal.progressPercentage)}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">{goal.daysRemaining} days remaining</span>
                      <span className="text-slate-400">{goal.daysTotal - goal.daysRemaining} / {goal.daysTotal} days</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Completed Goals ({completedGoals.length})</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {completedGoals.map((goal) => (
                <div key={goal.id} className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{goal.name}</h3>
                      <p className="text-sm text-slate-400 mt-1">{formatPeriod(goal.period)}</p>
                      <p className="text-emerald-300 mt-2 font-semibold">
                        ✓ Achieved: {goal.currentAmount.toFixed(2)} / {parseFloat(goal.targetAmount.toString()).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Failed Goals */}
        {failedGoals.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Failed Goals ({failedGoals.length})</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {failedGoals.map((goal) => (
                <div key={goal.id} className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{goal.name}</h3>
                      <p className="text-sm text-slate-400 mt-1">{formatPeriod(goal.period)}</p>
                      <p className="text-rose-300 mt-2 font-semibold">
                        ✗ Not achieved: {goal.currentAmount.toFixed(2)} / {parseFloat(goal.targetAmount.toString()).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {allGoals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No goals yet. Create your first goal above!</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
