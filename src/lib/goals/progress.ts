import type { Goal } from "@prisma/client";

type GoalWithProgress = Goal & {
  currentAmount: number;
  progressPercentage: number;
  isOnTrack: boolean;
  isCompleted: boolean;
  isFailed: boolean;
  daysRemaining: number;
  daysTotal: number;
};

export function calculateGoalProgress(
  goal: Goal,
  currentAmount: number
): GoalWithProgress {
  const now = new Date();
  const start = new Date(goal.startDate);
  const end = new Date(goal.endDate);
  
  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const daysElapsed = Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  const targetAmount = parseFloat(goal.targetAmount.toString());
  const progressPercentage = targetAmount > 0 
    ? Math.min(100, Math.max(0, (currentAmount / targetAmount) * 100))
    : 0;
  
  // Calculate if on track (current progress >= expected progress based on time elapsed)
  const expectedProgress = totalDays > 0 ? (daysElapsed / totalDays) * 100 : 0;
  const isOnTrack = progressPercentage >= expectedProgress;
  
  const isCompleted = currentAmount >= targetAmount && goal.status !== "failed" && goal.status !== "cancelled";
  const isFailed = (now > end && currentAmount < targetAmount) || goal.status === "failed";
  
  return {
    ...goal,
    currentAmount,
    progressPercentage: parseFloat(progressPercentage.toFixed(1)),
    isOnTrack,
    isCompleted,
    isFailed,
    daysRemaining: Math.max(0, daysRemaining),
    daysTotal: totalDays,
  };
}

export function formatPeriod(period: string): string {
  const map: Record<string, string> = {
    weekly: "Weekly",
    monthly: "Monthly",
    quarterly: "Quarterly",
    yearly: "Yearly",
  };
  return map[period] || period;
}
