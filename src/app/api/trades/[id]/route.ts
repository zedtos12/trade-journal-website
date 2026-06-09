import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { tradeInputToPrismaData } from "@/lib/trades/map";
import { serializeTrade } from "@/lib/trades/serialize";
import { tradeSchema } from "@/lib/validation/trade";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;

  const trade = await prisma.trade.findFirst({ where: { id, userId: user.id } });
  if (!trade) return NextResponse.json({ message: "Trade tidak ditemukan" }, { status: 404 });

  return NextResponse.json({ trade: serializeTrade(trade) });
}

export async function PATCH(request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;

  const existingTrade = await prisma.trade.findFirst({ where: { id, userId: user.id } });
  if (!existingTrade) return NextResponse.json({ message: "Trade tidak ditemukan" }, { status: 404 });

  try {
    const input = tradeSchema.parse(await request.json());
    const trade = await prisma.trade.update({
      where: { id },
      data: tradeInputToPrismaData(input),
    });

    return NextResponse.json({ trade: serializeTrade(trade) });
  } catch {
    return NextResponse.json({ message: "Data trade tidak valid" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;

  const deleted = await prisma.trade.deleteMany({ where: { id, userId: user.id } });
  if (deleted.count === 0) return NextResponse.json({ message: "Trade tidak ditemukan" }, { status: 404 });

  return NextResponse.json({ ok: true });
}
