import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

import { serializePlaybook } from "@/lib/playbooks/serialize";

export async function GET() {
  try {
    const user = await requireUser();
    const playbooks = await prisma.playbook.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ playbooks: playbooks.map(serializePlaybook) });
  } catch (error) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const { name, description, color } = await req.json();

    if (!name) {
      return NextResponse.json({ message: "Name is required" }, { status: 400 });
    }

    const playbook = await prisma.playbook.create({
      data: {
        userId: user.id,
        name,
        description,
        color: color || "#D9B45E",
      },
    });

    return NextResponse.json({ playbook: serializePlaybook(playbook) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating playbook" }, { status: 500 });
  }
}
