import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { serializePlaybook } from "@/lib/playbooks/serialize";

type PageProps = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: PageProps) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const { name, description, color } = await req.json();

    const playbook = await prisma.playbook.findFirst({ where: { id, userId: user.id } });
    if (!playbook) {
      return NextResponse.json({ message: "Playbook not found" }, { status: 404 });
    }

    const updated = await prisma.playbook.update({
      where: { id },
      data: { ...(name && { name }), ...(description !== undefined && { description }), ...(color && { color }) },
    });

    return NextResponse.json({ playbook: serializePlaybook(updated) });
  } catch (error) {
    return NextResponse.json({ message: "Error updating playbook" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: PageProps) {
  try {
    const user = await requireUser();
    const { id } = await params;

    const playbook = await prisma.playbook.findFirst({ where: { id, userId: user.id } });
    if (!playbook) {
      return NextResponse.json({ message: "Playbook not found" }, { status: 404 });
    }

    // Remove playbookId from all trades in this playbook
    await prisma.trade.updateMany({
      where: { playbookId: id },
      data: { playbookId: null },
    });

    await prisma.playbook.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting playbook" }, { status: 500 });
  }
}
