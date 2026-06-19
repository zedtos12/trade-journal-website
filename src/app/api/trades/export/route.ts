import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parse } from "json2csv";
import * as ExcelJS from "exceljs";

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(request.url);
    
    const format = searchParams.get("format") || "csv"; // csv or xlsx
    const playbookId = searchParams.get("playbookId") || undefined;
    const pair = searchParams.get("pair") || undefined;
    const result = searchParams.get("result") || undefined;
    const direction = searchParams.get("direction") || undefined;
    const setupName = searchParams.get("setupName") || undefined;
    const dateFrom = searchParams.get("dateFrom") || undefined;
    const dateTo = searchParams.get("dateTo") || undefined;

    // Build where clause
    const where: any = { userId: user.id };
    if (playbookId) where.playbookId = playbookId;
    if (pair) where.pair = { contains: pair, mode: "insensitive" };
    if (result && result !== "all") where.result = result;
    if (direction && direction !== "all") where.direction = direction;
    if (setupName) where.setupName = { contains: setupName, mode: "insensitive" };
    if (dateFrom) where.openDate = { ...where.openDate, gte: new Date(dateFrom) };
    if (dateTo) where.openDate = { ...where.openDate, lte: new Date(dateTo) };

    // Fetch trades
    const trades = await prisma.trade.findMany({
      where,
      orderBy: { openDate: "desc" },
      include: {
        playbook: {
          select: { name: true },
        },
      },
    });

    if (format === "csv") {
      return exportCSV(trades);
    } else if (format === "xlsx") {
      return await exportExcel(trades, user.preferred_currency);
    } else {
      return NextResponse.json({ message: "Invalid format" }, { status: 400 });
    }
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ message: "Export failed" }, { status: 500 });
  }
}

function exportCSV(trades: any[]) {
  const data = trades.map((t) => ({
    Playbook: t.playbook?.name || "General Journal",
    Pair: t.pair,
    Direction: t.direction,
    Status: t.status,
    Result: t.result,
    "Open Date": t.openDate.toISOString().split("T")[0],
    "Close Date": t.closeDate ? t.closeDate.toISOString().split("T")[0] : "",
    "Entry Price": t.entryPrice?.toString() || "",
    "Exit Price": t.exitPrice?.toString() || "",
    "Lot Size": t.lotSize?.toString() || "",
    "Stop Loss": t.stopLoss?.toString() || "",
    "Take Profit": t.takeProfit?.toString() || "",
    "P/L Amount": t.profitLossAmount?.toString() || "",
    "P/L %": t.profitLossPercentage?.toString() || "",
    "R:R Ratio": t.riskRewardRatio?.toString() || "",
    Setup: t.setupName || "",
    Timeframe: t.timeframe || "",
    Session: t.session || "",
    "Emotion Before": t.emotionBefore || "",
    "Emotion After": t.emotionAfter || "",
    "Entry Reason": t.entryReason || "",
    "Exit Reason": t.exitReason || "",
    "Lesson Learned": t.lessonLearned || "",
    Notes: t.notes || "",
  }));

  const csv = parse(data);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="trades-export-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}

async function exportExcel(trades: any[], currency: string) {
  const workbook = new ExcelJS.Workbook();
  
  // Summary sheet
  const summarySheet = workbook.addWorksheet("Summary");
  summarySheet.columns = [
    { header: "Metric", key: "metric", width: 30 },
    { header: "Value", key: "value", width: 20 },
  ];

  const totalTrades = trades.length;
  const closedTrades = trades.filter((t) => t.status === "closed");
  const wins = closedTrades.filter((t) => t.result === "win").length;
  const losses = closedTrades.filter((t) => t.result === "loss").length;
  const winRate = closedTrades.length > 0 ? ((wins / closedTrades.length) * 100).toFixed(2) : "0.00";
  const totalPnL = trades.reduce((sum, t) => sum + (t.profitLossAmount ? parseFloat(t.profitLossAmount.toString()) : 0), 0);
  const grossProfit = trades
    .filter((t) => t.profitLossAmount && parseFloat(t.profitLossAmount.toString()) > 0)
    .reduce((sum, t) => sum + parseFloat(t.profitLossAmount!.toString()), 0);
  const grossLoss = Math.abs(
    trades
      .filter((t) => t.profitLossAmount && parseFloat(t.profitLossAmount.toString()) < 0)
      .reduce((sum, t) => sum + parseFloat(t.profitLossAmount!.toString()), 0)
  );
  const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : "∞";

  summarySheet.addRows([
    { metric: "Total Trades", value: totalTrades },
    { metric: "Closed Trades", value: closedTrades.length },
    { metric: "Wins", value: wins },
    { metric: "Losses", value: losses },
    { metric: "Win Rate", value: `${winRate}%` },
    { metric: "Total P/L", value: `${currency} ${totalPnL.toFixed(2)}` },
    { metric: "Gross Profit", value: `${currency} ${grossProfit.toFixed(2)}` },
    { metric: "Gross Loss", value: `${currency} ${grossLoss.toFixed(2)}` },
    { metric: "Profit Factor", value: profitFactor },
    { metric: "Exported At", value: new Date().toLocaleString() },
  ]);

  // Style summary sheet
  summarySheet.getRow(1).font = { bold: true, size: 12 };
  summarySheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD7B56D" } };

  // Trades sheet
  const tradesSheet = workbook.addWorksheet("Trades");
  tradesSheet.columns = [
    { header: "Playbook", key: "playbook", width: 20 },
    { header: "Pair", key: "pair", width: 12 },
    { header: "Direction", key: "direction", width: 10 },
    { header: "Status", key: "status", width: 10 },
    { header: "Result", key: "result", width: 10 },
    { header: "Open Date", key: "openDate", width: 12 },
    { header: "Close Date", key: "closeDate", width: 12 },
    { header: "Entry Price", key: "entryPrice", width: 12 },
    { header: "Exit Price", key: "exitPrice", width: 12 },
    { header: "Lot Size", key: "lotSize", width: 10 },
    { header: "Stop Loss", key: "stopLoss", width: 12 },
    { header: "Take Profit", key: "takeProfit", width: 12 },
    { header: "P/L Amount", key: "pnlAmount", width: 12 },
    { header: "P/L %", key: "pnlPercent", width: 10 },
    { header: "R:R Ratio", key: "rrRatio", width: 10 },
    { header: "Setup", key: "setup", width: 20 },
    { header: "Timeframe", key: "timeframe", width: 10 },
    { header: "Session", key: "session", width: 12 },
    { header: "Entry Reason", key: "entryReason", width: 30 },
    { header: "Exit Reason", key: "exitReason", width: 30 },
    { header: "Lesson Learned", key: "lessonLearned", width: 30 },
    { header: "Notes", key: "notes", width: 30 },
  ];

  trades.forEach((t) => {
    tradesSheet.addRow({
      playbook: t.playbook?.name || "General Journal",
      pair: t.pair,
      direction: t.direction,
      status: t.status,
      result: t.result,
      openDate: t.openDate.toISOString().split("T")[0],
      closeDate: t.closeDate ? t.closeDate.toISOString().split("T")[0] : "",
      entryPrice: t.entryPrice?.toString() || "",
      exitPrice: t.exitPrice?.toString() || "",
      lotSize: t.lotSize?.toString() || "",
      stopLoss: t.stopLoss?.toString() || "",
      takeProfit: t.takeProfit?.toString() || "",
      pnlAmount: t.profitLossAmount?.toString() || "",
      pnlPercent: t.profitLossPercentage?.toString() || "",
      rrRatio: t.riskRewardRatio?.toString() || "",
      setup: t.setupName || "",
      timeframe: t.timeframe || "",
      session: t.session || "",
      entryReason: t.entryReason || "",
      exitReason: t.exitReason || "",
      lessonLearned: t.lessonLearned || "",
      notes: t.notes || "",
    });
  });

  // Style trades sheet header
  tradesSheet.getRow(1).font = { bold: true };
  tradesSheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD7B56D" } };

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="trades-export-${new Date().toISOString().split("T")[0]}.xlsx"`,
    },
  });
}
