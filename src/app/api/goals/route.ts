import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

const createGoalSchema = z.object({
  name: z.string().min(1, "Goal name is required"),
  targetAmount: z.number().positive("Target must be positive"),
  period: z.enum(["weekly", "monthly", "quarterly", "yearly"]),
  startDate: z.string().min(1, "Start date is required"),
});

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "active";

    const goals = await prisma.goal.findMany({
      where: { 
        userId: user.id,
        ...(status !== "all" && { status: status as any }),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ goals });
  } catch (error: any) {
    return NextResponse.json({ message: error.message ?? "Internal error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const data = createGoalSchema.parse(body);

    // Calculate end date based on period
    const startDate = new Date(data.startDate);
    let endDate = new Date(startDate);

    switch (data.period) {
      case "weekly":
        endDate.setDate(endDate.getDate() + 7);
        break;
      case "monthly":
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case "quarterly":
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case "yearly":
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
    }

    const goal = await prisma.goal.create({
      data: {
        userId: user.id,
        name: data.name,
        targetAmount: data.targetAmount,
        period: data.period,
        startDate,
        endDate,
        status: "active",
      },
    });

    return NextResponse.json({ goal }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ message: error.message ?? "Internal error" }, { status: 500 });
  }
}
