import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

const updatePlaybookSchema = z.object({
  name: z.string().min(1, "Name is required").max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format").optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const body = await request.json();
    const parsed = updatePlaybookSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid input", errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    // Check ownership
    const existing = await prisma.playbook.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      return NextResponse.json({ message: "Playbook not found" }, { status: 404 });
    }

    if (existing.userId !== user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const playbook = await prisma.playbook.update({
      where: { id },
      data: {
        ...(parsed.data.name && { name: parsed.data.name }),
        ...(parsed.data.description !== undefined && { description: parsed.data.description }),
        ...(parsed.data.color && { color: parsed.data.color }),
      },
    });

    return NextResponse.json({ playbook });
  } catch (error) {
    console.error("PATCH /api/playbooks/[id] error:", error);
    return NextResponse.json({ message: "Failed to update playbook" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;

    // Check ownership
    const existing = await prisma.playbook.findUnique({
      where: { id },
      select: { userId: true, _count: { select: { trades: true } } },
    });

    if (!existing) {
      return NextResponse.json({ message: "Playbook not found" }, { status: 404 });
    }

    if (existing.userId !== user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Delete playbook (trades will be set to NULL via onDelete: SetNull in schema)
    await prisma.playbook.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Playbook deleted", tradesAffected: existing._count.trades });
  } catch (error) {
    console.error("DELETE /api/playbooks/[id] error:", error);
    return NextResponse.json({ message: "Failed to delete playbook" }, { status: 500 });
  }
}
