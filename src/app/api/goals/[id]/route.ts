import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

const updateGoalSchema = z.object({
  status: z.enum(["active", "completed", "failed", "cancelled"]).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const body = await req.json();
    const data = updateGoalSchema.parse(body);

    // Check ownership
    const existing = await prisma.goal.findFirst({ where: { id, userId: user.id } });
    if (!existing) {
      return NextResponse.json({ message: "Goal not found" }, { status: 404 });
    }

    const goal = await prisma.goal.update({
      where: { id },
      data,
    });

    return NextResponse.json({ goal });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ message: error.message ?? "Internal error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;

    // Check ownership
    const existing = await prisma.goal.findFirst({ where: { id, userId: user.id } });
    if (!existing) {
      return NextResponse.json({ message: "Goal not found" }, { status: 404 });
    }

    await prisma.goal.delete({ where: { id } });

    return NextResponse.json({ message: "Goal deleted" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message ?? "Internal error" }, { status: 500 });
  }
}
