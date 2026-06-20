import type { Trade } from "@prisma/client";

type StreakData = {
  currentStreak: number;
  currentStreakType: "win" | "loss" | null;
  maxWinStreak: number;
  maxLossStreak: number;
  avgWinStreak: number;
  avgLossStreak: number;
};

export function calculateStreaks(trades: Trade[]): StreakData {
  if (trades.length === 0) {
    return {
      currentStreak: 0,
      currentStreakType: null,
      maxWinStreak: 0,
      maxLossStreak: 0,
      avgWinStreak: 0,
      avgLossStreak: 0,
    };
  }

  // Sort by date ascending
  const sorted = [...trades].sort((a, b) => a.openDate.getTime() - b.openDate.getTime());
  const closed = sorted.filter((t) => t.status === "closed" && t.result !== "open");

  let currentStreak = 0;
  let currentStreakType: "win" | "loss" | null = null;
  let maxWinStreak = 0;
  let maxLossStreak = 0;
  let tempStreak = 0;
  let tempType: "win" | "loss" | null = null;

  const winStreaks: number[] = [];
  const lossStreaks: number[] = [];

  for (const trade of closed) {
    const isWin = trade.result === "win";
    const isLoss = trade.result === "loss";

    if (!isWin && !isLoss) continue; // Skip breakeven

    if (tempType === null) {
      tempType = isWin ? "win" : "loss";
      tempStreak = 1;
    } else if ((isWin && tempType === "win") || (isLoss && tempType === "loss")) {
      tempStreak++;
    } else {
      // Streak broken
      if (tempType === "win") {
        winStreaks.push(tempStreak);
        maxWinStreak = Math.max(maxWinStreak, tempStreak);
      } else {
        lossStreaks.push(tempStreak);
        maxLossStreak = Math.max(maxLossStreak, tempStreak);
      }
      tempType = isWin ? "win" : "loss";
      tempStreak = 1;
    }
  }

  // Handle last streak
  if (tempType && tempStreak > 0) {
    if (tempType === "win") {
      winStreaks.push(tempStreak);
      maxWinStreak = Math.max(maxWinStreak, tempStreak);
    } else {
      lossStreaks.push(tempStreak);
      maxLossStreak = Math.max(maxLossStreak, tempStreak);
    }
    currentStreak = tempStreak;
    currentStreakType = tempType;
  }

  const avgWinStreak = winStreaks.length > 0 ? winStreaks.reduce((a, b) => a + b, 0) / winStreaks.length : 0;
  const avgLossStreak = lossStreaks.length > 0 ? lossStreaks.reduce((a, b) => a + b, 0) / lossStreaks.length : 0;

  return {
    currentStreak,
    currentStreakType,
    maxWinStreak,
    maxLossStreak,
    avgWinStreak: parseFloat(avgWinStreak.toFixed(1)),
    avgLossStreak: parseFloat(avgLossStreak.toFixed(1)),
  };
}

type HourlyPerformance = {
  hour: number;
  trades: number;
  wins: number;
  losses: number;
  totalPnL: number;
  winRate: number;
};

export function calculateHourlyPerformance(trades: Trade[]): HourlyPerformance[] {
  const hourlyData: Record<number, { trades: number; wins: number; losses: number; totalPnL: number }> = {};

  for (let i = 0; i < 24; i++) {
    hourlyData[i] = { trades: 0, wins: 0, losses: 0, totalPnL: 0 };
  }

  for (const trade of trades) {
    if (trade.status !== "closed") continue;

    const hour = trade.openDate.getUTCHours();
    hourlyData[hour].trades++;
    if (trade.result === "win") hourlyData[hour].wins++;
    if (trade.result === "loss") hourlyData[hour].losses++;
    hourlyData[hour].totalPnL += trade.profitLossAmount ? parseFloat(trade.profitLossAmount.toString()) : 0;
  }

  return Object.entries(hourlyData).map(([hour, data]) => ({
    hour: parseInt(hour),
    trades: data.trades,
    wins: data.wins,
    losses: data.losses,
    totalPnL: parseFloat(data.totalPnL.toFixed(2)),
    winRate: data.trades > 0 ? parseFloat(((data.wins / data.trades) * 100).toFixed(1)) : 0,
  }));
}

type WeekdayPerformance = {
  day: string;
  dayIndex: number;
  trades: number;
  wins: number;
  losses: number;
  totalPnL: number;
  winRate: number;
};

export function calculateWeekdayPerformance(trades: Trade[]): WeekdayPerformance[] {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const weekdayData: Record<number, { trades: number; wins: number; losses: number; totalPnL: number }> = {};

  for (let i = 0; i < 7; i++) {
    weekdayData[i] = { trades: 0, wins: 0, losses: 0, totalPnL: 0 };
  }

  for (const trade of trades) {
    if (trade.status !== "closed") continue;

    const dayIndex = trade.openDate.getUTCDay();
    weekdayData[dayIndex].trades++;
    if (trade.result === "win") weekdayData[dayIndex].wins++;
    if (trade.result === "loss") weekdayData[dayIndex].losses++;
    weekdayData[dayIndex].totalPnL += trade.profitLossAmount ? parseFloat(trade.profitLossAmount.toString()) : 0;
  }

  return Object.entries(weekdayData).map(([dayIndex, data]) => ({
    day: days[parseInt(dayIndex)],
    dayIndex: parseInt(dayIndex),
    trades: data.trades,
    wins: data.wins,
    losses: data.losses,
    totalPnL: parseFloat(data.totalPnL.toFixed(2)),
    winRate: data.trades > 0 ? parseFloat(((data.wins / data.trades) * 100).toFixed(1)) : 0,
  }));
}

type RiskMetrics = {
  avgHoldingTimeHours: number;
  largestWin: number;
  largestLoss: number;
  avgWinSize: number;
  avgLossSize: number;
  profitFactor: number;
  expectancy: number;
};

export function calculateRiskMetrics(trades: Trade[]): RiskMetrics {
  const closed = trades.filter((t) => t.status === "closed" && t.closeDate);
  
  if (closed.length === 0) {
    return {
      avgHoldingTimeHours: 0,
      largestWin: 0,
      largestLoss: 0,
      avgWinSize: 0,
      avgLossSize: 0,
      profitFactor: 0,
      expectancy: 0,
    };
  }

  // Holding time
  const holdingTimes = closed.map((t) => {
    const diff = t.closeDate!.getTime() - t.openDate.getTime();
    return diff / (1000 * 60 * 60); // hours
  });
  const avgHoldingTimeHours = holdingTimes.reduce((a, b) => a + b, 0) / holdingTimes.length;

  // Win/Loss sizes
  const wins = closed.filter((t) => t.result === "win" && t.profitLossAmount).map((t) => parseFloat(t.profitLossAmount!.toString()));
  const losses = closed.filter((t) => t.result === "loss" && t.profitLossAmount).map((t) => Math.abs(parseFloat(t.profitLossAmount!.toString())));

  const largestWin = wins.length > 0 ? Math.max(...wins) : 0;
  const largestLoss = losses.length > 0 ? Math.max(...losses) : 0;
  const avgWinSize = wins.length > 0 ? wins.reduce((a, b) => a + b, 0) / wins.length : 0;
  const avgLossSize = losses.length > 0 ? losses.reduce((a, b) => a + b, 0) / losses.length : 0;

  // Profit factor
  const grossProfit = wins.reduce((a, b) => a + b, 0);
  const grossLoss = losses.reduce((a, b) => a + b, 0);
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : 0;

  // Expectancy (average P/L per trade)
  const totalPnL = closed.reduce((sum, t) => sum + (t.profitLossAmount ? parseFloat(t.profitLossAmount.toString()) : 0), 0);
  const expectancy = totalPnL / closed.length;

  return {
    avgHoldingTimeHours: parseFloat(avgHoldingTimeHours.toFixed(1)),
    largestWin: parseFloat(largestWin.toFixed(2)),
    largestLoss: parseFloat(largestLoss.toFixed(2)),
    avgWinSize: parseFloat(avgWinSize.toFixed(2)),
    avgLossSize: parseFloat(avgLossSize.toFixed(2)),
    profitFactor: parseFloat(profitFactor.toFixed(2)),
    expectancy: parseFloat(expectancy.toFixed(2)),
  };
}
