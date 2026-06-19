import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

const createPlaybookSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional().nullable(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format").default("#D9B45E"),
});

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser();

    const playbooks = await prisma.playbook.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        color: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { trades: true },
        },
      },
    });

    return NextResponse.json({ playbooks });
  } catch (error) {
    console.error("GET /api/playbooks error:", error);
    return NextResponse.json({ message: "Failed to fetch playbooks" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const parsed = createPlaybookSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid input", errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const playbook = await prisma.playbook.create({
      data: {
        userId: user.id,
        name: parsed.data.name,
        description: parsed.data.description ?? null,
        color: parsed.data.color,
      },
    });

    return NextResponse.json({ playbook }, { status: 201 });
  } catch (error) {
    console.error("POST /api/playbooks error:", error);
    return NextResponse.json({ message: "Failed to create playbook" }, { status: 500 });
  }
}
