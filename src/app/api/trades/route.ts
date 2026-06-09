import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { buildTradeOrderBy, buildTradePagination, buildTradeWhere } from "@/lib/trades/query";
import { serializeTrade } from "@/lib/trades/serialize";
import { tradeInputToPrismaData } from "@/lib/trades/map";
import { tradeQuerySchema, tradeSchema } from "@/lib/validation/trade";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const query = tradeQuerySchema.parse(Object.fromEntries(url.searchParams.entries()));
  const pagination = buildTradePagination(query.page);
  const where = buildTradeWhere(user.id, query);
  const [trades, totalTrades] = await Promise.all([
    prisma.trade.findMany({
      where,
      orderBy: buildTradeOrderBy(query.sort),
      take: pagination.take,
      skip: pagination.skip,
    }),
    prisma.trade.count({ where }),
  ]);

  return NextResponse.json({ trades: trades.map(serializeTrade), pagination: { ...pagination, totalTrades } });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const input = tradeSchema.parse(await request.json());
    const trade = await prisma.trade.create({
      data: {
        ...tradeInputToPrismaData(input),
        userId: user.id,
      },
    });

    return NextResponse.json({ trade: serializeTrade(trade) }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Data trade tidak valid" }, { status: 400 });
  }
}
